---
title: 'Cloud Native (1)'
date: '2025-04-23'
tags: ['dev']
---

# Test 

## Spring

### Spring Context

스프링 애플리케이션의 중심 역할을 하는 컨테이너.

Bean(객체)를 생성하고 관리해주는 환경.

 - 객체 생명주기 관리
 - 의존성 주입
 - 설정 읽기
 - 이벤트 발행, 메시지 처리

### Spring Bean

 - 스프링 컨테이너에 의해 관리되는 객체
 - new 로 생성하는 것이 아니라, 스프링이 대신 생성하고 관리함
 - 애너테이션 (@) 를 통해 등록함
 - Bean으로 등록되면, 다른 객체에서 의존성 주입으로 사용할 수 있음.


### 의존성 주입

객체 간 의존 관계를 직접 New 하지 않고, 스프링이 알아서 주입

```java
@Component
public class MyService {
    private final MyRepository repository;

    @Autowired
    public MyService(MyRepository repository) {
        this.repository = repository;
    }
}
```

### Gradlew

```bash
# test
./gradlew test

# run
./gradlew bootRun

# Docker image 생성
./gradlew bootRunImage
```

## Docker

### Docker Host

도커 컨테이너가 실제로 실행되는 물리적 머신

### Docker Server

도커 데몬이 실행되는 서버
- Docker Daemon: 도커 컨테이너, 이미지 관리, 네트워크 처리 등의 역할

도커는 리눅스 커널의 기능에 의존한다. 따라서 리눅스 운영체제에서 도커를 설치하면 리눅스 호스트에 전체 도커 엔진이 제공된다.

맥에서는 어떻게 실행될까?

데스크톱 앱을 설치하면, 내부적으로 리눅스로 경량 가상 시스템이 구성되고, 도커 서버 구성 요소가 가상 시스템에 설치된다!

사용자 입장에서는 리눅스와 거의 차이가 없다. CLI로 도커에 작업 명령을 내릴 때, 실제로는 로컬 컴퓨터가 아닌, 다른 가상의 리눅스 컴퓨터에 명령을 내리는 것이다.

```docker version```을 통해 실행중인 OS를 확인할 수 있다.

```bash
Client:
  ...
  OS/Arch: darwin/arm64
  ...

Server: Docker Desktop
  ...
  OS/Arch: linux/arm64
  ...
```

## Kubernetes

### 클러스터(cluster)

컨테이너화된 애플리케이션을 실행하는 작업자 머신의 집합

### 노드(node)

작업자 머신. 모든 클러스터에는 적어도 하나의 노드가 존재.

### 작업자 노드(worker node)

컨테이너화된 애플리케이션이 배포되는 곳

### control plane

작업자 노드를 관리하는 컨테이너 오케스트레이션 계층.

컨테이너의 라이프사이클을 정의, 배포, 관리

### 작업 흐름

client에서 kubectl -> control plane -> worker node

### resource

- Pod: 가장 작은 배포 단위. 하나 이상의 컨테이너를 포함
- deployment: pod를 관리하는 상위 관리자. Pod를 자동으로 생성, 유지, 보수, 스케일링 등의 작업
- service: Pod 집합에 접근할 수 있는 네트워크 추상화

### resource manifest

Kubernetes 클러스터에 어떤 리소스를 생성할지 정의하는 파일

### 명령어

```bash
# 시작
minikube start --driver=docker

# config
minikube config set driver docker

# 다음에 시작할때는 그냥 
minikube start

# 상태확인
kubectl get nodes

# local hub에서 이미지 load
minikube image load {repository_name}

# deployment 생성
kubectl create deployment {name} --image={repository_name}

# 배포 객체 확인
kubectl get deployment

# 파드 객체 확인
kubectl get pod

# 클러스터에 노출
kubectl expose deployment {노출할 배포 이름} --name={서비스 이름} --port=8080

# 서비스 생성 확인
kubectl get service {서비스 이름}

# port-forwading
kubectl port-forward service/catalog-service 8000:8080

# 서비스 삭제
kubectl delete service {서비스 이름}

# deployment 삭제
kubectl delete deployment {서비스 이름}

# 실행 중지
minukube stop

```

# Cloud Native 개발 시작

## JAR 파일

- WAR vs JAR

  WAR로 패키징을 하면, 외부 서버가 필요하다. 즉, WAR로 배포된 애플리 케이션이 하나의 서버에 의존하는 관계가 된다. 반면에 스프링 부트는 **톰캣**을 통해 서버 기능을 내장할 수 있다. 이 때는 JAR 아티팩트로 패키징된다. 각 애플리케이션이 내장 톰캣 서버를 독립적으로 갖기 때문에, 클라우드 네이티브 애플리케이션 구성에 용이하다.

```bash
./gradlew bootJar

java -jar build/libs/{실행 파일}
```

애플리케이션 실행 과정에서 [Tomcat] 서비스를 자동으로 구성하여 톰캣 서버 인스턴스를 초기화하는 것을 볼 수 있다.
![alt text](/img/tomcat.png)


## 서블릿 컨테이너

서블릿 컨테이너는 자바 웹 애플리케이션을 실행하기 위한 환경이다.

HTTP 요청을 받아서 서블릿 객체에 전달하고, 응답을 다시 클라이언트에 반환하는 역할을 한다.

대표적으로 톰캣(Tomcat)이 사용되며, 스프링 부트에서는 내장 톰캣을 통해 별도 설치 없이 실행된다.

### 역할 정리

- 요청 수신: 클라이언트로부터 HTTP 요청 수신
- 서블릿 호출: 요청에 해당하는 서블릿 객체를 실행
- 응답 처리: 서블릿이 생성한 응답을 클라이언트에 반환
- 생명주기 관리: 서블릿 객체의 생성, 초기화, 실행, 제거 과정 관리


### 요청 당 스레드

톰캣은 기본적으로 스레드 풀(thread pool)을 초기화해서 보유한다.

클라이언트로부터 요청이 들어오면, 톰캣은 이 요청을 처리하기 위해 스레드 풀에서 스레드를 하나 꺼내 서블릿에 전달한다.

스레드 수는 동시에 들어오는 요청을 처리할 수 있는 상한선을 의미한다.

스레드 풀의 크기는 설정을 통해 조정할 수 있다.
