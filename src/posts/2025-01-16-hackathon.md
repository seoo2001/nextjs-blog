---
title: 'RAG with Pinecone, Upstage API'
date: '2025-01-16'
tags: ['project']
---




<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fcd0E55%2FbtsLP2R412p%2FZnkKmAJZNkgTZdK7F2FU4k%2Fimg.png"/> 


 [파인콘](https://www.pinecone.io/)은 클라우드 벡터 DB 서비스이다. 파인콘을 활용해서 RAG를 구현해보자. RAG에 활용할 데이터셋은 [천재교육 출판사의 고등 교과서](https://textbook.tsherpa.co.kr/textbook/textbook_gallery2015.aspx?ClassA=A6-C3-HI)를 활용했다. 전체 과목 중, 사회(정치와 법), 과학(생명과학2)를 활용했다. 임베딩과, LLM에서는 [upstage API](https://www.upstage.ai/)를 활용했다.

## Pinecone Index 생성

 Pinecone은 2GB Storage, 월 1M RUs(Read Units), 2M WUs(Write Units)를 serverless mode에서 무료로 지원한다. 먼저 API Key를 발급받고, 환경 변수를 세팅해준다.

```bash
# .env
PINECONE_API_KEY = pcsk_**************************
```

 Pinecone에는 Index, namespace라는 개념이 있다. Index는 Database, namespace는 table의 역할과 비슷하다. Free tier에서는 최대 5개의 Index와 각 Index당 100개의 namespace를 지원한다. Index를 생성해보자. Index를 생성할 때는, 임베딩 차원과 metric을 설정해줘야 한다. Upstage embedding API의 차원인 4096으로 설정하고, metric은 추후 hybrid search 구현을 위해 dotproduct로 설정했다.

```python
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import os


load_dotenv() # 환경변수 불러오기

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

index_name = "quickstart"
if index_name not in [index_info["name"] for index_info in pc.list_indexes()]:
    pc.create_index(
        name=index_name,
        dimension=4096, # Upstage embedding api의 임베딩 차원, 사용하는 임베딩 API의 차원으로 설정
        metric="dotproduct", # euclidean, cosine
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ) 
    )
    print(f"{index_name} has been successfully created")

else:
    print(f"{index_name} is already exists.")

print(pc.list_indexes())
```

## Upstage Embedding API

 이번 프로젝트에서는 upstage의 embedding API와 Chat API를 사용했다. 먼저 API Key를 발급받고 환경변수로 추가해준다.

```bash
# .env
UPSTAGE_API_KEY = up_***************************
```

 다음은 langchain의 PyMuPDFLoader를 통해 PDF 문서를 읽고, textsplitter를 사용하여 지정한 단위의 Chunk로 나눠준다. 이후에는 필요한 metadata만 필터링 후, content의 길이가 너무 짧은 chunk들은 drop해준다.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
import glob

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=150)

split_docs = []
files = sorted(glob.glob("data/*.pdf"))

for file in files:
    loader = PyMuPDFLoader(file)
    split_docs.extend(loader.load_and_split(text_splitter))

# 문서 개수 확인
print(len(split_docs))

def preprocess_docs(docs, keys = ['source', 'page'], min_len=10):
    result_docs = []
    for doc in docs:
        doc.metadata = {key: doc.metadata[key] for key in keys}
        if len(doc.page_content) > min_len:
            result_docs.append(doc)
    return result_docs

split_docs = preprocess_docs(split_docs)
```

 이후에는 langchain\_pinecone 라이브러리를 활용하면 간단하게 split\_docs의 Document를 임베딩과 동시에 pinecone 벡터 DB에 upsert 가능하다.

```python
from langchain_pinecone import PineconeVectorStore
from langchain_upstage import ChatUpstage, UpstageEmbeddings

embeddings_passage = UpstageEmbeddings(model="embedding-passage") #4096
embeddings_query = UpstageEmbeddings(model="embedding-query") #4096

docsearch = PineconeVectorStore.from_existing_index(index_name=index_name, embedding=embeddings_passage)
docsearch.add_documents(split_docs)
```

 upstage embedding API는 passage와 query의 임베딩 모델을 분리하여 api로 제공한다. document에는 embeddings\_passage 모델을 적용했다. app.pinecone.io 로 접속해보면 vector가 저장되어 있는 것을 확인할 수 있다.

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcUr3u5%2FbtsLQqFaLPF%2FptvOcnrmVOYTLf3Mv7ocr0%2Fimg.png"/> 

## Retrieval 구현

 langchain\_pinocone의 PineconeVectorStore 클래스를 통해 간단하게 유사도가 가장 높은 chunk를 쉽게 검색이 가능하다. 중요한 점은 PineconeVectorStore의 객체를 query embedding으로 다시 불러와야 한다.

```python
docsearch = PineconeVectorStore.from_existing_index(index_name=index_name, embedding=embeddings_query) # query 임베딩으로 변경
query = "범죄의 성립요건 세가지는?"
docs = docsearch.similarity_search(query=query)
print(docs)
```

 다음은 LLM의 답변을 RAG의 유무에 따라 비교해보자. LLM은 Upstage의 Chat API를 활용했다.

```python
from langchain_upstage import ChatUpstage
llm = ChatUpstage(api_key=os.environ.get("UPSTAGE_API_KEY"), temperature=0)

response_llm = llm.invoke(query)
print(response_llm.content)

prompt = f"Question: {query}\n Reference: {docs[0][0].page_content}\n Answer:"
response_llm_with_RAG = llm.invoke(prompt)
print(response_llm_with_RAG.content)
```

 **LLM만 활용한** **답변**:'범죄의 성립요건은 크게 세 가지로 나눌 수 있습니다:\\n\\n1. 구성요건(범죄의 요소): 범죄가 성립하기 위해서는 특정한 행위가 있어야 합니다. 이 행위는 범죄의 구성요건에 해당해야 합니다. 예를 들어, 살인의 구성요건은 사람을 죽이는 행위입니다.\\n\\n2. 고의(범죄의 의도): 범죄를 저지른 사람은 그 행위가 범죄임을 알고 있어야 합니다. 즉, 범죄의 고의가 있어야 합니다. 예를 들어, 살인의 고의는 사람을 죽이려는 의도를 가지고 있어야 합니다.\\n\\n3. 책임능력: 범죄를 저지른 사람은 책임능력이 있어야 합니다. 이는 범죄 행위를 이해하고 그 행위의 잘못을 인지할 수 있는 정신적 능력을 의미합니다. 예를 들어, 정신적으로 미숙한 사람이나 정신적으로 심각한 장애를 가진 사람은 책임능력이 없을 수 있습니다.\\n\\n이 세 가지 요건이 모두 충족되어야 범죄가 성립됩니다.'

 **RAG를 통한 답변**: '범죄의 성립요건 세가지는 구성 요건 해당성, 위법성, 책임입니다.'

 **참고 Chunk Conten\*\***t\*\*: '자유 의지가 작동한다면, 책임과 비난도 당연히 함께 작동하며, \\n법과 도덕의 기초도 그와 더불어 세워져야 한다.\\x08\\n- 줄리언 바지니, 『자유 의지』\\n범죄의 성립과 불성립\\n어떤 행위가 범죄가 되려면 그 행위가 법률에서 금지하고 \\n있는 행위에 해당해야 하고(구성 요건 해당성), 그 행위가 법\\n질서 전체의 관점에서 부정적이라는 판단이 있어야 하며(위법\\n성), 마지막으로 그 행위를 한 사람에게 그 행위에 대한 비난 \\n가능성(책임)이 인정되어야 한다. 즉, 어떤 행위가 구성 요건 해당성, 위법성, 책\\n임의 요건을 모두 충족해야 범죄로 인정되는데, 이를 범죄의 성립 요건이라 한다.\\n구성 요건 해당성\\n범죄가 성립하려면 구체적으로 어떤 행위를 해서는 안 되는지 법률에 미리 정\\n해져 있어야 한다. 예를 들어 사람을 폭행한 행위가 범죄가 되려면 법률에 폭행\\n을 금지하는 규정과 폭행을 하면 형벌로 처벌한다는 내용의 규정이 있어야 한다.'

## Evaluation Dataset

 RAG의 성능 평가를 위해서는 평가 데이터셋이 필요하다. 평가 데이터셋은 LLM을 통해 구축해보자. 동일하게 upstage Chat API를 사용하였다. [AWS](https://aws.amazon.com/ko/blogs/tech/korean-reranker-rag/) [한국어 Reranker를 활용한 검색 증강 생성(RAG) 성능 올리기](https://aws.amazon.com/ko/blogs/tech/korean-reranker-rag/)를 참고하여 문서-질문-답 데이터셋을 구축했다.

```python
# import library
from pinecone import Pinecone
from langchain_upstage import ChatUpstage, UpstageEmbeddings
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import pandas as pd
import os

load_dotenv()

index_name = "quickstart"
client = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"), source_tag="langchain")
llm_upstage = ChatUpstage(api_key=os.environ.get("UPSTAGE_API_KEY"), temperature=0)
embeddings_query = UpstageEmbeddings(model="embedding-query") #4096

retriever_prompt_template = """
\n\nHuman: Here is the context information, inside <context></context> XML tags.

<context>
{context}
</context>

Given the context information and not prior knowledge.
generate only questions based on the below query.

You are a Professor. Your task is to setup \
{num_questions_per_chunk} questions for an upcoming \
quiz/examination. The questions should be diverse in nature \
across the document. The questions should not contain options, start with "-"
Restrict the questions to the context information provided.

\n\nAssistant:"""

PROMPT_RETRIEVER = PromptTemplate(
    template=retriever_prompt_template, input_variables=["context", "num_questions_per_chunk"]
)

generation_prompt_template = """
Here is the context, inside <context></context> XML tags.

<context>
{context}
</context>

Only using the context as above, answer the following question with the rules as below:
    - Don't insert XML tag such as <context> and </context> when answering.
    - Write as much as you can
    - Be courteous and polite
    - Only answer the question if you can find the answer in the context with certainty.
    - Skip the preamble
    - Use three sentences maximum and keep the answer concise.
    - If the answer is not in the context, just say "Could not find answer in given contexts."

Question:
{question}

Answer:"""

PROMPT_GENERATION = PromptTemplate(
    template=generation_prompt_template, input_variables=["context", "question"]
)


def GTGenerator(index, llm_retriever, llm_generation, prompt_retriever, prompt_generation, batch_size=50, max_batch=2, num_questions_per_chunk=1):

    llm_chain_retriever = LLMChain(llm=llm_retriever, prompt=prompt_retriever)
    llm_chain_generation = LLMChain(llm=llm_generation, prompt=prompt_generation)
    gt = [] # [question, 정답 id, 정답 text]

    all_ids = list(index.list(limit=batch_size))

    if max_batch < len(all_ids):
        all_ids = all_ids[:max_batch]    

    # ID를 기반으로 데이터를 하나씩 가져오기
    for fetched_ids in all_ids:
        fetched_docs = index.fetch(ids=fetched_ids)
        fetched_docs = fetched_docs.vectors

        for doc_id in fetched_ids:
            doc_text =  fetched_docs[doc_id]["metadata"]["text"]

            questions = llm_chain_retriever.predict(context=doc_text, num_questions_per_chunk=str(num_questions_per_chunk))

            questions = questions.split("\n\n-")
            if len(questions) <= num_questions_per_chunk + 1:

                if len(questions) == num_questions_per_chunk:
                    questions = list(map(lambda x:x.strip(), questions))
                else:
                    questions = list(map(lambda x:x.strip(), questions[1:]))
                for q in questions:
                    answer = llm_chain_generation.predict(question=q, context=doc_text)
                    answer = answer.strip()
                    gt.append([q, answer, doc_id, doc_text])
            else:
                print ("err")
                print (questions)

    return gt

index = client.Index(index_name)
gt = GTGenerator(
    index = index,
    llm_retriever=llm_upstage,
    llm_generation=llm_upstage,
    prompt_retriever=PROMPT_RETRIEVER,
    prompt_generation=PROMPT_GENERATION,
    batch_size=50,
    max_batch=3,
    num_questions_per_chunk=1
)

eval_dataset_retriever = pd.DataFrame(gt, columns=["question", "answer", "doc_id", "doc"])
eval_dataset_retriever.to_csv("eval_dataset.csv", index=False)
```

 생성한 평가 데이터셋의 품질이 생각보다 나빴다. 직접 확인한 질문 목록은 프롬프트로 요청한 질문의 개수와 다르게 각 Chunk마다 상이하게 생성되었다. 또한 질문을 생성하기에 애매한 Chunk들이 다수 존재했다. 교과서에서 질문, 토론하기 페이지 등이 해당한다. 평가 데이터셋을 구축하기 위해서는 사람이 직접 후처리를 하는 과정이 필요해보인다.

## 참고자료

### Pinecone

테디노트: [https://github.com/teddylee777/langchain-kr/blob/main/09-VectorStore/03-Pinecone.ipynb](https://github.com/teddylee777/langchain-kr/blob/main/09-VectorStore/03-Pinecone.ipynb)  
랭체인: [https://python.langchain.com/v0.1/docs/modules/data\_connection/vectorstores/](https://python.langchain.com/v0.1/docs/modules/data_connection/vectorstores/)  
유투브: [https://www.youtube.com/watch?v=kXDKyod2LKY&list=PLRLVhGQeJDTJs80myZIgCBxD3rL2jz77U&index=1](https://www.youtube.com/watch?v=kXDKyod2LKY&list=PLRLVhGQeJDTJs80myZIgCBxD3rL2jz77U&index=1)

### Langchain Upstage

랭체인 업스테이지 API: [https://python.langchain.com/docs/integrations/providers/upstage/](https://python.langchain.com/docs/integrations/providers/upstage/)

### hybrid retrieval

하이브리드 서치 논문: [https://arxiv.org/abs/2210.11934](https://arxiv.org/abs/2210.11934)  
pinecone 설명: [https://docs.pinecone.io/guides/data/understanding-hybrid-search](https://docs.pinecone.io/guides/data/understanding-hybrid-search)

### RAG 성능 평가

[https://aws.amazon.com/ko/blogs/tech/korean-reranker-rag/](https://aws.amazon.com/ko/blogs/tech/korean-reranker-rag/)  
[https://colab.research.google.com/drive/1TxDVA\_\_uimVPOJiMEQgP5fwHiqgKqm4-?usp=sharing](https://colab.research.google.com/drive/1TxDVA__uimVPOJiMEQgP5fwHiqgKqm4-?usp=sharing)  
[https://docs.llamaindex.ai/en/stable/examples/evaluation/retrieval/retriever\_eval/](https://docs.llamaindex.ai/en/stable/examples/evaluation/retrieval/retriever_eval/)
[https://github.com/aws-samples/aws-ai-ml-workshop-kr/blob/master/genai/aws-gen-ai-kr/20\_applications/02\_qa\_chatbot/05\_evaluation/01\_create\_ground\_truth.ipynb](https://github.com/aws-samples/aws-ai-ml-workshop-kr/blob/master/genai/aws-gen-ai-kr/20_applications/02_qa_chatbot/05_evaluation/01_create_ground_truth.ipynb)