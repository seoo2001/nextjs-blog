/**
 * 사이트 메타데이터 상수
 */

export const META = {
  /** 사이트 제목 */
  title: 'ilez.xyz',
  /** 사이트 이름 */
  siteName: 'ilez.xyz',
  /** 사이트 설명 */
  description: 'Developer, Designer, Creator, Writer.',
  /** SEO 키워드 */
  keyword: [
    'seoo2001',
    'ilez',
    'seodongjoon',
    'dongjoonseo',
    '서동준',
    'dongjoon',
    'blog',
    'ilez.xyz',
  ],
  /** 사이트 기본 URL */
  url: 'https://www.ilez.xyz',
  /** OpenGraph 이미지 */
  ogImage: '/opengraph.png',
  /** Google Search Console 인증 코드 */
  googleVerification: '-zitLknPv5kRbjZ4Mg8Dkjveiak80WHCT-clix5QThI',
  /** Naver Search Advisor 인증 코드 */
  naverVerification: '7a8835b3bcf06766aeb89a81adc8fbfffd76706f',
  /** Google AdSense 퍼블리셔 ID */
  googleAdsense: 'ca-pub-8355268904090742',
} as const;

/**
 * URL 생성 헬퍼
 */
export const createUrl = {
  /** 블로그 포스트 URL */
  post: (slug: string) => `${META.url}/blog/${slug}`,
  /** 포트폴리오 URL */
  portfolio: (slug: string) => `${META.url}/portfolio/${slug}`,
  /** 블로그 목록 URL */
  blog: () => `${META.url}/blog`,
  /** 포트폴리오 목록 URL */
  portfolioList: () => `${META.url}/portfolio`,
  /** 홈 URL */
  home: () => META.url,
} as const;
