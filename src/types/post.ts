import type { BaseContent, BaseContentInfo } from './content';

/** 블로그 포스트 */
export interface Post extends BaseContent {}

/** 포스트 목록 표시용 정보 */
export interface PostInfo extends BaseContentInfo {}
