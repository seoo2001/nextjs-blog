# 블로그 코드 리팩토링 가이드

> ✅ **리팩토링 완료** (2026-01-13)
> 
> 이 문서는 `my-blog` 코드베이스를 분석하여 발견한 리팩토링 포인트들과 적용된 개선 사항을 정리한 문서입니다.

## 📋 완료된 리팩토링 작업

### 1. ✅ 타입 시스템 정리
- **공통 베이스 타입 생성**: `src/types/content.ts`
  - `BaseContent`, `BaseContentInfo` 인터페이스 정의
  - `Dateable`, `SortFunction` 유틸리티 타입 추가
- **Post/Portfolio 타입 리팩토링**: 공통 타입 상속으로 중복 제거
- **일관성**: 모든 객체 타입을 `interface`로 통일

### 2. ✅ CSS 통합 및 정리
- **CSS 변수 단일화**: `src/styles/variables.css` - Single Source of Truth
- **파일 구조 재정리**:
  ```
  src/styles/
  ├── globals.css      # 진입점 (imports만)
  ├── tailwind.css     # Tailwind 설정
  ├── variables.css    # 모든 CSS 변수 (NEW)
  ├── base.css         # 기본 스타일 (NEW)
  ├── header.css       # 헤더 컴포넌트
  ├── theme-button.css # 테마 버튼
  ├── animations.css   # 애니메이션 (정리됨)
  └── mdx.css          # MDX 렌더링
  ```
- **변수 네이밍 통일**: `--text-second` → `--text-secondary`
- **애니메이션 CSS 최적화**: 33개 → 20개로 축소

### 3. ✅ lib 파일 리팩토링
- **공통 로직 추출**: `src/lib/content.ts`
  - `sortByDate` (desc/asc)
  - `contentToDescription`
  - `formatDate` (post/portfolio/short/year)
  - `ContentCache` 클래스
  - `isProduction` 헬퍼
- **파일 확장자 변경**: `.tsx` → `.ts` (JSX 미사용)
- **Draft 필터링 추가**: Production에서 draft 포스트/포트폴리오 자동 제외
- **미사용 파일 삭제**: `tf-idf.ts` 제거

### 4. ✅ constants 정리
- **URL 헬퍼 추가**: `src/constants/metadata.ts`
  - `createUrl.post(slug)`
  - `createUrl.portfolio(slug)`
  - `createUrl.blog()`
  - `createUrl.portfolioList()`
- **Giscus 설정 분리**: `src/constants/giscus.ts`
  - 하드코딩된 값들을 상수로 관리

### 5. ✅ 컴포넌트 리팩토링
- **불필요한 컴포넌트 삭제**:
  - `MainLayout.tsx` (단순히 `<main>` 래퍼)
  - `PostCard.tsx` (미사용)
- **Header 분리**:
  - `src/components/layout/Navigation.tsx`
  - `src/components/layout/PageHeader.tsx`
- **PostDetail 타입 수정**: `Post` → `BaseContent` (Portfolio와 공유)
- **Comment 개선**: Giscus 설정 상수화

### 6. ✅ 앱 페이지 수정
- **layout.tsx**: `MainLayout` 제거, 직접 `<main>` 사용
- **sitemap.ts**: 
  - 동기 fs API → 비동기 lib 함수 사용
  - 하드코딩 URL → `createUrl` 헬퍼 사용
- **모든 페이지**: URL 하드코딩 제거

### 7. ✅ 폴더명 변경
- `src/hook/` → `src/hooks/` (복수형 컨벤션)

### 8. ✅ 주석 코드 정리
- `src/app/page.tsx`: 대량의 주석 코드 제거

---

## 📁 최종 폴더 구조

```
src/
├── app/                      # Next.js App Router
│   ├── blog/
│   │   ├── [slug]/page.tsx
│   │   └── page.tsx
│   ├── portfolio/
│   │   ├── [slug]/page.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.txt
│   └── sitemap.ts
├── components/
│   ├── layout/               # 레이아웃 관련 (NEW)
│   │   ├── Navigation.tsx
│   │   └── PageHeader.tsx
│   ├── portfolio/
│   │   ├── PortfolioCard.tsx
│   │   └── PortfolioList.tsx
│   ├── post/
│   │   ├── PostDetail.tsx
│   │   ├── PostList.tsx
│   │   ├── RelatedPosts.tsx
│   │   └── TableOfContent.tsx
│   ├── Comment.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── ThemeButton.tsx
├── constants/
│   ├── giscus.ts             # NEW
│   └── metadata.ts           # 확장됨
├── hooks/                    # 폴더명 변경 (hook → hooks)
│   └── useTocScroll.ts
├── lib/
│   ├── content.ts            # NEW - 공통 유틸리티
│   ├── dice-coefficient-kr.ts
│   ├── post.ts               # 확장자 변경 (.tsx → .ts)
│   ├── portfolio.ts          # 확장자 변경 (.tsx → .ts)
│   ├── toc.ts
│   └── utils.ts
├── styles/
│   ├── animations.css        # 정리됨
│   ├── base.css              # NEW
│   ├── globals.css           # 구조 변경
│   ├── header.css
│   ├── mdx.css
│   ├── tailwind.css          # 간소화
│   ├── theme-button.css
│   └── variables.css         # NEW - CSS 변수 통합
├── types/
│   ├── content.ts            # NEW - 공통 타입
│   ├── portfolio.ts          # 상속 구조로 변경
│   └── post.ts               # 상속 구조로 변경
├── portfolio/                # 마크다운 콘텐츠
└── posts/                    # 마크다운 콘텐츠
```

---

## 🔧 주요 개선 사항 요약

| 항목 | Before | After |
|------|--------|-------|
| 타입 정의 | 중복된 Post/Portfolio 타입 | 공통 BaseContent 상속 |
| CSS 변수 | 여러 파일에 분산, 값 불일치 | 단일 파일(variables.css)로 통합 |
| lib 함수 | post.tsx/portfolio.tsx 중복 | content.ts로 공통 로직 추출 |
| URL 관리 | 하드코딩 | createUrl 헬퍼 사용 |
| Draft 필터링 | 없음 | Production 자동 제외 |
| 폴더명 | hook (단수) | hooks (복수) |
| 미사용 코드 | MainLayout, PostCard, tf-idf.ts | 삭제됨 |
| Giscus 설정 | 컴포넌트 내 하드코딩 | constants/giscus.ts로 분리 |

---

## 🚀 적용된 Best Practices

### Next.js 15 App Router
- Server Components 우선 사용
- ISR(Incremental Static Regeneration) 적용
- 정적 페이지 생성 (`generateStaticParams`)

### TypeScript
- 객체 형태: `interface` 사용
- 유니온/인터섹션: `type` 사용
- Props: `interface`로 명시적 정의

### Tailwind CSS v4
- 유틸리티 클래스 우선
- CSS 변수는 `@theme` 레이어에 해당하는 별도 파일로 관리
- 컴포넌트별 커스텀 CSS 최소화

### 코드 품질
- DRY 원칙 적용 (중복 제거)
- 단일 책임 원칙 (컴포넌트 분리)
- 명확한 네이밍 컨벤션
