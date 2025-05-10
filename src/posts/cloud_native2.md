---
title: 'Cloud Native (2)'
date: '2025-04-26'
tags: ['dev', 'cloud', 'spring']
---

책 [Cloud Native Spring in Action](https://m.yes24.com/Goods/Detail/125491840) 학습 내용을 정리한 글입니다.

## Spring

에러를 발생시키는 부분과 에러를 처리하는 부분을 분리
```java
// 에러 발생
// BookAlreadyExistsException.java
package com.polarbookshop.catalogservice.domain;

public class BookAlreadyExistsException extends RuntimeException {

    public BookAlreadyExistsException(String isbn) {
        super("A book with ISBN " + isbn + " already exists.");
    }

}


// 에러 처리
// BookControllerAdvice.java
@RestControllerAdvice
public class BookControllerAdvice {

    @ExceptionHandler(BookNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String bookNotFoundHandler(BookNotFoundException ex) {
        return ex.getMessage();
    }
    ...


```

# Test-Driven development (TDD)

- unit Test
- 통합 테스트
- MVC 테스트
- JSON 직렬화 테스트

# 배포 파이프 라인

푸시 -> 소스 코드 체크아웃 -> 소스 코드 취약성 스캔 -> 빌드 -> 단위 테스트, 통합 테스트

 - grype
  - 취약성 스캐너
