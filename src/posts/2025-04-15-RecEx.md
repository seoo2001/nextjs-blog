---
title: 'Recsys Use cases'
date: '2025-04-15'
tags: ['AI']
---




부스트캠프 AI Tech RecSys Track에서 학습한 강의들을 바탕으로 정리한 글입니다.

# Recommender System Examples

## Youtube

[Deep Neural Networks for YouTube Recommendations](https://dl.acm.org/doi/pdf/10.1145/2959100.2959190)

>  **1. Candidate Generation → 2. Ranking**


### 문제 상황

- **Scale**  
    - 수천만 개 이상의 비디오 중에서 수백 개만 보여줘야 함

- **Freshness**  
    - 사용자 취향과 콘텐츠는 계속 변함  
    - 빠른 업데이트와 실시간성 필요

- **Noise**  
    - 명시적 피드백 부족, **암묵적 피드백(클릭, 시청 시간 등)** 위주
    - 유저 행동 로그는 매우 **희소**하고, **노이즈**가 많음


### 1. Candidate Generation (수백만 → 수천)

**사용자에게 보여줄 Top-N 후보 아이템을 먼저 뽑음**

- **문제 정의:**  
    - extreme multiclass classification  
    - 전체 비디오 중에서 적절한 수천 개의 후보를 선택

- **User Vector 생성 방식**  
    - Watch history, search query, context info 등의 feature vector를 concatenate 후 dense layer 통과
    - 학습 시점 기준의 예시(Example Age) 정보 포함

- **Output Layer**  
    - 학습: Softmax로 각 비디오에 대한 확률 분포 학습  
    - 서빙: ANN(Approximate Nearest Neighbor) 방식으로 빠르게 최근접 후보 검색


### 2. Ranking (수천 → 수백)

**Candidate로 뽑힌 비디오들을 정교하게 정렬하여 실제 추천 리스트를 생성 단계**

- **풍부한 feature 사용**  
    - 유저 + 비디오 관련 feature들을 모두 활용
    - ex) 사용자 위치, 디바이스, 시청 시간, 콘텐츠 유형 등

- **학습 목표**  
    - 단순한 클릭이 아닌 **시청 시간(view time)** 등을 기반으로 학습
    - **Weighted Cross Entropy Loss** 사용  
        → 비디오 시청 시간에 따라 label의 weight 조정
    - 낚시성/광고성 콘텐츠에 높은 점수를 주지 않도록 **시청 시간**에 기반한 정교한 Loss 설계

- **Feature Engineering 중심의 구조**  
    - Deep Learning 모델 구조보다는 도메인 지식이 중요  
    - **Feature selection/engineering**에 따라 성능 편차 큼

## Taobao

[Contextual User Browsing Bandits for Large-Scale Online Mobile Recommendation](https://arxiv.org/abs/2008.09368)

## Netflix artwork

[Artwork Personalization at Netflix](https://netflixtechblog.com/artwork-personalization-c589f074ad76)