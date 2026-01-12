/**
 * 콘텐츠 관련 공통 타입 정의
 * Post와 Portfolio의 공통 베이스 타입
 */

/** 마크다운 콘텐츠의 기본 구조 */
export interface BaseContent {
  slug: string;
  title: string;
  date: Date;
  description: string;
  tags: string[];
  content: string;
  draft: boolean;
}

/** 콘텐츠 목록 표시용 기본 정보 */
export interface BaseContentInfo {
  title: string;
  description: string;
  href: string;
  date: Date;
  tags: string[];
  draft: boolean;
}

/** 날짜 정렬 가능한 객체 타입 */
export interface Dateable {
  date: Date;
}

/** 정렬 함수 타입 */
export type SortFunction<T extends Dateable> = (a: T, b: T) => number;
