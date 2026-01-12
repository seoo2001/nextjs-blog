import type { BaseContent, BaseContentInfo } from './content';

/** 포트폴리오 프로젝트 */
export interface Portfolio extends BaseContent {
  thumbnail: string | null;
  category: string;
}

/** 포트폴리오 목록 표시용 정보 */
export interface PortfolioInfo extends BaseContentInfo {
  thumbnail: string | null;
  category: string;
}
