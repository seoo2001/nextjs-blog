---
title: 'Real MySQL 8.0 (2)'
date: '2025-04-09'
tags: ['CS']
---




## 인덱스

### n-gram: 키워드 검색 인덱싱 알고리즘

k-gram이면, 단어를 k글자로 분리하여 각 토큰을 인덱스에 저장.

불용어와 동일하거나 불용어를 포함하는 경우는 버린다.

컬럼 생성
```sql
doc_body TEXT,
FULLTEXT KEY fx_docbody (doc_body) WITH PARSER ngram
```

쿼리
```sql
SELECT * FROM tb WHERE MATCH(doc_body) AGAINST ('apple' IN BOOLEAN MODE);
```

### 함수 기반 인덱스
성, 이름을 각각의 컬럼에 저장하고, 성, 이름을 합쳐서 인덱스로 관리하고 싶은 상황에서 활용할 수 있다.

```sql
CREATE TABLE user (
  user_id BIGINT,
  first_name VARCHAR(10),
  last_name VARCHAR(10),
  PRIMARY KEY (user_id),
  INDEX ix_fullname ((CONCAT(first_name, ' ', last_name)))
);
```

쿼리의 조건절은 함수 기반 인덱스에 명시된 표현식과 동일하게 작성해야 한다. 결과가 같더라도 표현식이 다르면 옵티마이저가 인식하지 못한다.

```sql
SELECT * FROM user WHERE CONCAT(first_name, ' ', last_name)='dongjoon seo';
```

### 클러스터링 인덱스

테이블의 레코드를 비슷한 것들끼리 묶어서 저장하는 것이다. 이는 테이블의 primary key에 대해서만 적용된다.

primary key에 의해 저장 위치가 결정된다. 클러스터링 테이블과 동일한 의미이다.

구조 자체는 B-Tree와 동일하지만, B-Tree의 리프 노드는 인덱스의 컬럼 데이터만 저장되는 반면에, 클러스터링 인덱스는 모든 컬럼의 값이 저장된다.

명시적으로 primary key를 지정하지 않으면 어떻게 될까? 다음과 같은 순서로 클러스터링 인덱스를 정하게 된다.

1. primary key가 있으면 기본 클러스터링 인덱스로 사용.
2. NOT NULL 옵션 + unique index 중에서 첫 번째 index를 클러스터링 인덱스로 사용.
3. 자동으로 unique 값을 가지도록 증가되는 컬럼을 내부적으로 추가하고, 이를 클러스터링 인덱스로 사용. -> 이는 사용자에게 노출되지 않는다.(아무런 혜택이 없음)

따라서 primary key를 명시적으로 생성하는 것이 좋다.

### clustering table과 secondary index

클러스터링 되지 않은 테이블은 처음 insert 한 위치에서 절대 이동하지 않는다. 그리고 secondary index의 키는 저장된 주소의 record id를 통해 데이터 레코드를 찾아온다. 하지만, 클러스터링 인덱스를 사용하면, 키 값이 변경될 때마다 데이터 레코드의 주소가 변경되고, 모든 secondary index의 저장된 주소값을 바꿔줘야 할 것이다. 이러한 오버헤드를 줄이기 위해, secondary index는 레코드의 주소가 아닌, primary key 값을 저장한다.

모든 secondary index가 primary key 값을 저장하기 때문에, primary key의 크기는 매우 중요하다.

### unique index

일단, 일반 secondary key와 구조적으로 다른 게 없다.

성능 측면에서 unique 키의 읽기가 더 빠르다고 생각할 수 있지만, 사실상 똑같다. 1개의 레코드를 읽느냐, 2개 이상의 레코드를 읽느냐의 차이일 뿐이다. 읽어야 할 레코드 건수가 같다면 성능 차이는 미미하다.

쓰기 측면에서는 unique 키가 느리다. 키 값을 쓸 때, 중복된 값이 있는지 체크하는 과정에서 읽기 잠금, 쓰는 과정에서 쓰기 잠금이 발생하여 이 과정에서 데드락도 빈번히 발생한다.

## Optimizer

대부분의 RDBMS는 쿼리를 처리하기 위한 여러가지 방법을 만들고 예측된 통계정보를 바탕으로 최소 비용의 실행 계획을 세우는, 비용 기반의 옵티마이저를 채택하고 있다.

**한번에 대량의 데이터 페이지 읽기는 어떻게 처리할까?**

처음 몇개의 페이지는 포그라운드 스레드에서 읽어오지만, 특정 시점부터는 백그라운드 스레드가 한번에 여러개의 페이지를 읽으면서 점점 많은 수의 데이터를 버퍼에 올려둔다. 포그라운드 스레드는 버퍼 풀에서 준비된 데이터를 가져오는 방식으로 매우 빠르게 처리한다.

이외에도 병렬 처리, ORDER BY, GROUP BY, DISTINCT 처리 등에서 활용되는 다양한 최적화 기법들이 있다. 또한 옵티마이저 힌트 옵션이나 통계 정보를 활용한 실행 계획 수립 방식에 대해서도 책에서는 자세히 설명하고 있다. 다만, 뒷부분으로 갈수록 내용이 너무 지엽적으로 느껴져서 중도 하차했다.