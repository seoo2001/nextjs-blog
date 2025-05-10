---
title: 'Kafka'
date: '2025-04-04'
tags: ['CS']
---




[Kafka In Action](https://product.kyobobook.co.kr/detail/S000209587240) 책의 내용을 바탕으로 핵심 개념을 정리한 글입니다.

 - 배달 방식
   - at-least-once semantics
   - at-most-once semantics
   - exactly-once semantics


### 구성
 - record: 카프카를 통해 흐르는 데이터의 기본 요소
 - broker: 카프카의 서버 측면
 - zookeeper: 브로커 관리. 구조가 복잡해지기 때문에 이 영역을 줄이기 위해 노력 중임.
   - 브로커 간, 레플리카를 교차로 가지고 있기 때문에, 브로커 간 통신이 필요함.
   - **레플리카**: 각 파티션은 하나의 leader와 여러개의 follower로 구성되어 있고, 이 follower들을 레플리카라고 한다. 리더 파티션의 장애나 데이터 유실을 방지할 수 있다.
### 실행

 - topic 생성

```bash
kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --replication-factor 1 \
  --partitions 1 \
  --topic test-topic
```


 - producer

```kafka-console-producer --bootstrap-server localhost:9092 --topic test-topic```


 - consumer

```kafka-console-consumer --bootstrap-server localhost:9092 --topic test-topic --from-beginning```

--from-beginning 인자가 없으면, consumer 생성 이후에 producer에서 생성한 메세지만 받음.


 - 특징
   - 운영체제의 페이지 캐시를 사용한다.
   - 커밋 로그: 메시지를 읽은 후, 시스템에서 제거하지 않는다.
   - 카프카 스트림즈: 독립된 프로세싱 클러스터 없이, 애플리케이션에서 라이브러리로 기존 코어 기능을 적용.
   - 카프카 커넥트: 자체 프로듀서와 컨슈머 없이 카프카 안팎으로 데이터 이동을 돕는 용도. 기존 데이터베이스에서 카프카로 데이터를 옮겨야 하는 상황에 사용..


수평 확장이 필요한 서비스, 지속적으로 메세지 처리가 필요한 서비스에 적합. 메세지의 크기가 작고 페이지 캐시에 할애 가능한 메모리양이 많을 수록 성능 유지하는 데 좋음.

 - 설계 시, 고려 사항
   - 시스템에서 메시지를 잃어도 괜찮은가?
   - 데이터를 어떤 방식으로 그룹화 할 것인가?
   - 순서대로 데이터를 전달해야 하는가?
   - 마지막 값이 중요한가, 아니면 이력이 중요한가?
   - 얼마나 많은 컨슈머가 필요한가?



### Avro
스키마 기반 데이터 직렬화가 필요할 때 사용한다.
	-	스키마 기반: 데이터를 쓰기 전/읽기 전에 JSON 형식의 스키마 정의가 필요함
	-	빠른 직렬화/역직렬화 속도
	-	이식성: 다양한 언어에서 사용 가능 (Java, Python, C 등)
	-	압축률이 높음 (바이너리 포맷 사용)
	-	스키마 진화 지원: 데이터 포맷이 바뀌더라도 호환 가능 (ex. 필드 추가/삭제 등)


# Producer

### acks
메세지 전달이 성공했는지를 확인하기 위해 필요한 속성 acknowledgements. (all, -1, 1, 0)
- 0이면 가장 낮은 대기 시간, 하지만 안전한 배달은 아님.
- all 또는 -1 이면, 가장 강력한 배달 보장 기능. 파티션 리더의 레플리카가 ISR(In-Sync Replica)의 전체 목록에 대해 복제 완료를 확인함. 즉, 프로듀서는 파티션에 대한 모든 레플리카가 성공하기 전까지 성공 확인을 받지 못함. 따라서 가장 느림.
- 1 이면, 메시지 수신자(특정 파티션의 리더 레플리카)가 확인(ack)을 프로듀서에게 보낸다. 다른 브로커들이 메세지를 복사하지 못할 가능성이 있다.


# Consumer

컨슈머가 데이터를 사용해도 토픽에서 제거되지 않는다.

### 오프셋
- 브로커에 존재하는 커밋 로그의 레코드 위치.
- 오프셋은 항상 각 파티션에 대해 증가하고, 해당 매시지가 제거되더라도 오프셋 번호는 다시 사용되지 않음.
- 처음부터 다시 읽기, 최신 오프셋 부터 읽기, 타임스탬프 기준으로 시작점 찾기 등의 읽기 옵션이 있다.

### 코디네이터
- 각 컨슈머 그룹에 대해 특정 브로커가 그룹 코디네이터 역할을 수행함.
- 컨슈머 클라리언트는 메세지를 읽기 위해 코디네이터와 대화함.

> **파티션 컨슈머 개수**: 
파티션, 컨슈머를 무한정 늘리면 동시 처리 수가 늘어나서 성능이 좋아지는 것을 기대할 수 있지만, 
브로커 간 파티션 복제를 기다리는 시간이 증가해서 오히려 대기 시간이 늘어날 수 있음. 
 

> **컨슈머 수 < 파티션 수**: 
하나의 컨슈머에 다수의 파티션이 할당되어 컨슈머의 메모리 요구가 증가할 수 있음.

### 컨슈머 그룹
- 일반적으로 컨슈머 그룹당 하나의 컨슈머만 하나의 파티션을 읽을 수 있다. 즉, 하나의 파티션을 동시에 많은 컨슈머가 읽을 수 있지만, 모두 다른 그룹이여야 한다.
- 그룹 내 하나의 컨슈머가 실패할 때, 그룹 내 다른 컨슈머가 그 파티션을 대신 읽는다.

### commit 옵션
- enable.auto.commit (기본값: true)
-	자동으로 주기적으로 오프셋을 커밋함.
-	주기: auto.commit.interval.ms (기본값 5000ms)
-	문제: 메시지를 처리하기 전에 커밋될 수 있어 at-most-once 위험 있음.
- enable.auto.commit=false
- 최소 한 번 배달을 보장 가능. 최대 한 번은 보장 못함.
  
# Broker 

### zookeepr
- Kafka 2.8.0 (2021년)에서 프리뷰로 도입,
- Kafka 3.3.0부터는 Zookeeper 없는 모드가 프로덕션 준비 완료
- Kafka 3.5 이상에서는 Zookeeper 기반 기능이 점점 deprecated 상태

클러스터 내부에서 하나의 브로커만 컨트롤러 역할을 수행한다. 컨트롤러는 클러스터를 관리한다. 파티션 재할당 등의 작업을 수행한다.


### 브로커 추가
고유한 ID로 새 카프카 브로커를 시작하기만 하면 됨.
하지만, 이전에 생성한 토픽, 파티션이 새 브로커에 자동으로 추가되지는 않음.

### 백업
Apache Kafka의 데이터 백업은 일반적인 RDBMS처럼 내장된 백업 기능이 없기 때문에, 목적과 인프라 환경에 따라 적절한 방식으로 설계 필요.

 - Kafka MirrorMaker
	 - Kafka 간 데이터를 실시간으로 복제함.
	 - 다른 클러스터에 복제해두고 이를 백업 클러스터로 활용.
	 - 장점: 실시간 복제, 장애 시 failover 가능.
	 - 단점: 운영 비용 증가, 클러스터 이중화 필요.

# Topic & Partition
토픽은 물리적인 구조가 아닌, 추상적인 개념이다.

나중에 파티션 수를 줄이는 것은 권장하지 않기 때문에, 신중해야 함. 수평 확장을 고려.

레플리카 수는 브로커 수보다 작거나 같아야 한다. 아니면 오류 발생.

### segment
   - 1개의 파티션 = 여러 개의 로그 세그먼트
   - 읽기/쓰기 효율 향상, 오래된 데이터의 손쉬운 삭제 (retention), 파일 시스템 효율 최적화 등의 이점.
   - .log: 실제 메시지 데이터를 담고 있음
   - .index: 오프셋과 실제 파일 위치를 빠르게 찾기 위한 인덱스
   - .timeindex: 타임스탬프 기반 인덱스 (타임라인 기준 조회용)

### Compaction Topic
Kafka의 Compaction Topic은 오래된 데이터를 지우는 대신, 가장 최신의 값만 유지하는 방식의 로그 유지 정책.

오래된 key의 value는 삭제되고, 최신 value만 남김.

compaction이 “언제” 끝나는지는 보장 안됨. 비동기 작업임. 즉시 삭제/압축되는 게 아님. 설계 시 유의.

```bash
# 토픽 생성 시
kafka-topics --create \
  --topic my-compacted-topic \
  --partitions 3 \
  --config cleanup.policy=compact \
  --bootstrap-server localhost:9092
```

### tombstone 메시지
- 만약 value = null인 메시지를 보내면, Kafka는 delete marker (무덤 표시, tombstone)로 인식.
- compaction은 해당 key에 대해 모든 레코드를 제거함
- key-value 캐시처럼 활용 가능

---
**Reference**

[실시간 추천 시스템을 위한 Feature Store 구현기](https://tv.naver.com/v/33862901)

[카프카(Kafka)를 통한 로그(Log) 관리 방법\|브레인즈컴퍼니](https://blog.naver.com/brainzsquare/223215946934)

[Kafka in Action](https://product.kyobobook.co.kr/detail/S000209587240)
