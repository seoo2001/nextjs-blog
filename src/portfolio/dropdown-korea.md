---
title: 'Dropdown Korea'
date: '2025-05-21'
tags: ['project']
thumbnail: /dropdown-th.png
---

외국 사이트에서 회원가입을 할 때, 국가를 선택하는 드롭다운에서 **한국 표시를 찾기 어려운 경험**이 있어서 만들어 봤어요.  
South Korea인 경우도 있고, Korea South, Republic of Korea 등 표기가 제각각이라 한 번에 찾기 어렵다는 문제를 해결하고자 했습니다.

![dropdown](/dropdown-th.png)

---
사이트: [KoreaDropdown](https://dropdown.ilez.xyz/)

GitHub: [seoo2001/korean-dropdown](https://github.com/seoo2001/korean-dropdown/)

공동제작: [Dodolist](https://github.com/Dodolist)

크롬 익스텐션: [Chrome Web Store](https://chromewebstore.google.com/detail/koreadropdown/mfnlknmbkfnlgcjebdogolbakcekohfj)

파이어폭스 익스텐션: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/koreadropdown/)

## 스토어 현황

- **Chrome**: 평점 4.8(8), 728 users, v1.4.0 (2025-10-27 업데이트)
- **Firefox**: 6 Users, v1.3 (2025-06-19 업데이트)

## 배경

해외 서비스들은 국가 목록이 길고, 한국 표기가 여러 방식으로 섞여 있습니다. (예: South Korea / Korea, South / Republic of Korea …)  
이 때문에 “K” 구간까지 스크롤을 내리거나 검색을 반복하게 되는데, 회원가입/주소 입력 흐름에서 이게 은근히 스트레스였습니다.

## 해결 방식

**드롭다운을 열었을 때 한국에 해당하는 옵션을 자동으로 찾아 선택**하는 브라우저 확장 프로그램을 만들었습니다.  
표기 방식이 다를 수 있다는 점을 전제로, 흔히 등장하는 한국 표기들을 폭넓게 인식하도록 구성했습니다.

## 구현

### 확장 프로그램

Cursor로 크롬 익스텐션을 개발했고, 국가 선택 드롭다운(`<select>`)이 등장하는 상황에서 자동 선택이 동작하도록 만들었습니다.

### 랜딩 페이지

랜딩 페이지는 v0(사용하신 표현 기준 vO)로 빠르게 만들고, 사용자가 “무엇이 달라지는지”를 한 눈에 보도록 데모 중심으로 구성했습니다.

## 사용 방법

1. 크롬/파이어폭스 스토어에서 확장 프로그램을 설치합니다.
2. 회원가입/주소 입력 등에서 국가 선택 드롭다운을 클릭합니다.
3. 가능한 경우 자동으로 한국이 선택됩니다.

## 한계

사이트에 따라 `<select>`가 아닌 커스텀 드롭다운 UI를 쓰는 경우가 있어, 이런 경우에는 동작하지 않을 수 있습니다.