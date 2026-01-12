/**
 * 콘텐츠 관련 공통 유틸리티
 * Post와 Portfolio에서 공유하는 로직
 */

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Dateable } from '@/types/content';

/**
 * 날짜 정렬 함수
 */
export const sortByDate = {
  /** 내림차순 (최신순) */
  desc: <T extends Dateable>(a: T, b: T) => b.date.getTime() - a.date.getTime(),
  /** 오름차순 (오래된순) */
  asc: <T extends Dateable>(a: T, b: T) => a.date.getTime() - b.date.getTime(),
};

/**
 * 마크다운 콘텐츠에서 Description 자동 생성
 * @param content 마크다운 원본 텍스트
 * @param maxLength 최대 글자 수 (기본값: 157)
 */
export const contentToDescription = (content: string, maxLength = 157): string => {
  const parsedContent = content
    .replace(/(?<=\])\((.*?)\)/g, '')                              // 링크 URL 제거
    .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')      // 독립 URL 제거
    .replace(/[#*|[\]]|(-{3,})|(`{3})(\S*)(?=\s)/g, '')           // 마크다운 기호 제거
    .replace(/\s+/g, ' ')                                          // 공백 정규화
    .trim()
    .slice(0, maxLength);

  return `${parsedContent}...`;
};

/**
 * 날짜 포맷팅 함수
 */
export const formatDate = {
  /** 블로그 포스트용: yyyy년 MM월 dd일 */
  post: (date: Date) => format(date, 'yyyy년 MM월 dd일', { locale: ko }),
  /** 포트폴리오용: yyyy. MM. dd. */
  portfolio: (date: Date) => format(date, 'yyyy. MM. dd.', { locale: ko }),
  /** 목록용: MM. dd. */
  short: (date: Date) => format(date, 'MM. dd.'),
  /** 년도만: yyyy */
  year: (date: Date) => format(date, 'yyyy'),
};

/**
 * 제네릭 캐시 클래스
 * 서버 컴포넌트에서 메모리 캐싱용
 */
export class ContentCache<T> {
  private cache: T[] | null = null;
  private lastCacheTime = 0;
  private readonly duration: number;

  constructor(durationMs = 300 * 1000) { // 기본 5분
    this.duration = durationMs;
  }

  get(): T[] | null {
    if (this.cache && Date.now() - this.lastCacheTime < this.duration) {
      return this.cache;
    }
    return null;
  }

  set(data: T[]): void {
    this.cache = data;
    this.lastCacheTime = Date.now();
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.cache?.find(predicate);
  }

  clear(): void {
    this.cache = null;
    this.lastCacheTime = 0;
  }
}

/**
 * Production 환경 여부 확인
 */
export const isProduction = () => process.env.NODE_ENV === 'production';
