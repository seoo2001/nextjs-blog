/**
 * TF-IDF (Term Frequency-Inverse Document Frequency) 기반 문서 유사도 계산
 * 한국어 텍스트 처리에 특화된 구현
 */

// 불용어 리스트 (한국어)
const STOP_WORDS = new Set([
  '그', '그것', '그리고', '그런', '그러나', '그래서', '그렇다', '그래', '그냥',
  '이', '이것', '이런', '이렇게', '이제', '있다', '없다', '또', '또한', '때문',
  '수', '중', '등', '같은', '다른', '많은', '좋은', '새로운', '큰', '작은',
  '하다', '되다', '있다', '없다', '말하다', '보다', '나다', '가다', '오다',
  '그리고', '하지만', '그러나', '따라서', '그래서', '그런데', '그러면',
  '것', '수', '때', '곳', '점', '면', '경우', '방법', '문제', '결과',
  '를', '을', '가', '이', '에', '의', '로', '으로', '와', '과', '도', '만',
  '는', '은', '한', '할', '함', '해', '하는', '된', '되는', '인', '일',
]);

// 단어 추출 및 정규화
export function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ') // 특수문자 제거
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word))
    .filter(word => !/^\d+$/.test(word)); // 숫자만 있는 단어 제거
}

// 문서의 단어 빈도 계산
export function calculateTermFrequency(words: string[]): Map<string, number> {
  const termFreq = new Map<string, number>();
  
  words.forEach(word => {
    termFreq.set(word, (termFreq.get(word) || 0) + 1);
  });
  
  // TF 정규화 (로그 스케일링)
  const totalWords = words.length;
  termFreq.forEach((count, term) => {
    termFreq.set(term, Math.log(1 + count / totalWords));
  });
  
  return termFreq;
}

// 역문서빈도 계산
export function calculateInverseDocumentFrequency(
  documents: string[][], 
  vocabulary: Set<string>
): Map<string, number> {
  const idf = new Map<string, number>();
  const totalDocs = documents.length;
  
  vocabulary.forEach(term => {
    const docsContainingTerm = documents.filter(doc => doc.includes(term)).length;
    const idfValue = Math.log(totalDocs / (1 + docsContainingTerm));
    idf.set(term, idfValue);
  });
  
  return idf;
}

// 문서를 TF-IDF 벡터로 변환
export function documentToTfIdfVector(
  words: string[],
  idf: Map<string, number>,
  vocabulary: string[]
): number[] {
  const tf = calculateTermFrequency(words);
  
  return vocabulary.map(term => {
    const tfValue = tf.get(term) || 0;
    const idfValue = idf.get(term) || 0;
    return tfValue * idfValue;
  });
}

// 코사인 유사도 계산
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * TF-IDF 기반 문서 유사도 계산 클래스
 */
export class TfIdfCalculator {
  private vocabulary: string[] = [];
  private idf: Map<string, number> = new Map();
  private documentVectors: Map<string, number[]> = new Map();
  
  constructor(documents: { id: string; content: string }[]) {
    this.buildVocabulary(documents);
    this.calculateIdf(documents);
    this.buildDocumentVectors(documents);
  }
  
  private buildVocabulary(documents: { id: string; content: string }[]) {
    const vocabularySet = new Set<string>();
    
    documents.forEach(doc => {
      const words = extractWords(doc.content);
      words.forEach(word => vocabularySet.add(word));
    });
    
    this.vocabulary = Array.from(vocabularySet);
  }
  
  private calculateIdf(documents: { id: string; content: string }[]) {
    const documentsWords = documents.map(doc => extractWords(doc.content));
    this.idf = calculateInverseDocumentFrequency(documentsWords, new Set(this.vocabulary));
  }
  
  private buildDocumentVectors(documents: { id: string; content: string }[]) {
    documents.forEach(doc => {
      const words = extractWords(doc.content);
      const vector = documentToTfIdfVector(words, this.idf, this.vocabulary);
      this.documentVectors.set(doc.id, vector);
    });
  }
  
  /**
   * 두 문서 간의 유사도 계산
   */
  calculateSimilarity(docId1: string, docId2: string): number {
    const vec1 = this.documentVectors.get(docId1);
    const vec2 = this.documentVectors.get(docId2);
    
    if (!vec1 || !vec2) return 0;
    
    return cosineSimilarity(vec1, vec2);
  }
  
  /**
   * 특정 문서와 유사한 문서들을 찾기
   */
  findSimilarDocuments(
    targetDocId: string, 
    candidateDocIds: string[], 
    topK: number = 3
  ): { docId: string; similarity: number }[] {
    const similarities = candidateDocIds
      .filter(docId => docId !== targetDocId)
      .map(docId => ({
        docId,
        similarity: this.calculateSimilarity(targetDocId, docId)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    return similarities;
  }
} 