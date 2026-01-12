/**
 * Giscus 댓글 시스템 설정
 * @see https://giscus.app
 */

export const GISCUS_CONFIG = {
  /** GitHub 저장소 (owner/repo) */
  repo: 'seoo2001/nextjs-blog',
  /** 저장소 ID */
  repoId: 'R_kgDOOmbckA',
  /** Discussions 카테고리 */
  category: 'Comments',
  /** 카테고리 ID */
  categoryId: 'DIC_kwDOOmbckM4Cp_wo',
  /** 매핑 방식 */
  mapping: 'pathname',
  /** 엄격 모드 */
  strict: '0',
  /** 리액션 활성화 */
  reactionsEnabled: '1',
  /** 메타데이터 전송 */
  emitMetadata: '0',
  /** 입력창 위치 */
  inputPosition: 'bottom',
  /** 언어 */
  lang: 'ko',
} as const;

/**
 * 테마별 Giscus 스타일시트 URL
 */
export const GISCUS_THEMES = {
  light: 'https://giscus.app/themes/noborder_light.css',
  dark: 'https://giscus.app/themes/noborder_gray.css',
} as const;

export type GiscusTheme = keyof typeof GISCUS_THEMES;
