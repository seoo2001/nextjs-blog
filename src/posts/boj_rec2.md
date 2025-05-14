---
title: 'BOJ 추천 프로젝트 (2)'
date: '2025-05-13'
tags: ['project']
---


## 유저 메타 정보 제거

entity를 아래 그림처럼 정의하고 유저의 메타 정보를 활용할 계획이었다. 하지만 rating과 같은 값은 유저의 문제 풀이 sequence에 종속적인 값이기 때문에 train, test 데이터를 split했을 때, data leakage가 발생한다.

![bojrec2](/img/bojrec2.png)

어차피 유저의 문제 풀이 sequence를 통해 유저의 meta 정보의 대부분을 복원 가능하기 때문에, 유저 메타정보는 제거했다.