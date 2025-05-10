---
title: 'Cloud Native (3)'
date: '2025-05-10'
tags: ['dev', 'cloud', 'spring']
---

책 [Cloud Native Spring in Action](https://m.yes24.com/Goods/Detail/125491840) 학습 내용을 정리한 글입니다.

# 외부화 설정 관리

테스트 환경과 프로덕션 환경에서 설정을 다르게 적용해야 한다면 어떤 구조가 필요할까?

일반적으로 설정 데이터를 포함하는 번들로 패키징하고 플래그를 통해 원하는 설정 값을 가져온다. 하지만 이러한 방식은 설정 데이터를 업데이트 할 때마다 애플리케이션을 새로 빌드해야 하는 번거로움이 있다.

클라우드 네이티브 애플리케이션은 환경이 달라져도 동일한 애플리케이션 아티팩트를 유지할 수 있다.

배포 환경에 따라 달라질 수 있는 값은 모두 설정 데이터로 저장해야 한다. 또한 크리덴셜 값들을 외부에 노출시키지 않는 것도 중요하다.

# Spring boot 속성 관리

스프링 부트는 여러 소스에서 속성을 자동으로 로드하고, 동일한 속성이 여러 소스에서 정의되면 우선순위 규칙에 따라 결정된다.

Environment 인터페이스를 사용해 속성 값에 접근할 수 있다. 그 외에도 @Value 애너테이션으로 속성을 주입하거나, @ConfigurationProperties 애너테이션으로 표시된 클래스나 레코드를 통해 속성에 접근 가능하다.

```java
@Autowired
private Environment environment;

public String getServerPort() {
    return environment.getProperty("server.port");
}

// 또는

@Value("${server.port}")
private String serverPort;

public String getServerPort() {
    return serverPort;
}
```

## 사용자 지정 속성 정의

```java title="CatalogServiceApplication"
@SpringBootApplication
@ConfigurationPropertiesScan // 스프링 콘텍스트에서 설정 데이터 빈을 로드
public class CatalogServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatalogServiceApplication.class, args);
    }
}
```

```java title="PolarProperties.java"
@Setter
@Getter
@ConfigurationProperties(prefix = "polar")
public class PolarProperties {
    private String greeting;
}
```


```java title="HomeController.java"
@RestController
public class HomeController {
    private final PolarProperties polarProperties;

    public HomeController(PolarProperties polarProperties) {
        this.polarProperties = polarProperties;
    }
    @GetMapping("/")
    public  String getGreeting() {
        return polarProperties.getGreeting();
    }
}

```