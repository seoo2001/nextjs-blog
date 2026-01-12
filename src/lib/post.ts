/**
 * 블로그 포스트 관련 함수
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { compareTwoStrings } from './dice-coefficient-kr';
import { sortByDate, contentToDescription, formatDate, ContentCache, isProduction } from './content';
import type { Post, PostInfo } from '@/types/post';

// ====================================================
// 설정
// ====================================================

const postsDirectory = path.join(process.cwd(), 'src/posts');
const postsCache = new ContentCache<Post>();

// ====================================================
// 유틸리티 (re-export)
// ====================================================

export { formatDate };

// ====================================================
// 포스트 데이터 함수
// ====================================================

/**
 * 전체 포스트 목록 가져오기
 * @param includeDrafts draft 포함 여부 (기본: production에서는 제외)
 */
export const getAllPosts = async (includeDrafts = false): Promise<Post[]> => {
  // 캐시 확인
  const cached = postsCache.get();
  if (cached) {
    return filterDrafts(cached, includeDrafts);
  }

  try {
    const files = await fs.readdir(postsDirectory);
    
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(postsDirectory, file);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          return {
            slug: file.replace(/\.md$/, ''),
            title: data.title,
            date: new Date(data.date),
            description: data.description || contentToDescription(content),
            tags: data.tags || [],
            content,
            draft: data.draft || false,
          } as Post;
        })
    );

    const sortedPosts = posts.sort(sortByDate.desc);
    postsCache.set(sortedPosts);
    
    return filterDrafts(sortedPosts, includeDrafts);
  } catch (error) {
    console.error('Error reading posts:', error);
    const cached = postsCache.get();
    if (cached) return filterDrafts(cached, includeDrafts);
    throw error;
  }
};

/**
 * 특정 슬러그로 포스트 가져오기
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    // 캐시에서 먼저 검색
    const cachedPost = postsCache.find(p => p.slug === slug);
    if (cachedPost) {
      // Production에서 draft 포스트 접근 차단
      if (isProduction() && cachedPost.draft) return null;
      return cachedPost;
    }

    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const post: Post = {
      slug,
      title: data.title,
      date: new Date(data.date),
      description: data.description || contentToDescription(content),
      tags: data.tags || [],
      content,
      draft: data.draft || false,
    };

    // Production에서 draft 포스트 접근 차단
    if (isProduction() && post.draft) return null;

    return post;
  } catch {
    return null;
  }
};

/**
 * 연관 포스트 추출
 * 태그 매칭 우선, 부족하면 제목 유사도로 보완
 */
export const getRelatedPosts = (post: Post, postList: Post[]): Post[] => {
  // 태그 기반 필터링
  const tagFilteredPosts = postList
    .filter((p) => p.slug !== post.slug)
    .filter((p) => {
      if (!post.tags || !p.tags) return false;
      return post.tags.some(tag => p.tags.includes(tag));
    });

  // 태그 매칭 3개 이상이면 태그 결과만 반환
  if (tagFilteredPosts.length >= 3) {
    return tagFilteredPosts.slice(0, 3);
  }

  // 부족하면 제목 유사도로 보완
  return postList
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const tagPoint = post.tags
        ? post.tags.filter((tag) => p.tags.includes(tag)).length
        : 0;
      const titlePoint = compareTwoStrings(post.title, p.title);
      return {
        post: p,
        similarity: tagPoint + 3.0 * titlePoint,
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .map((p) => p.post)
    .slice(0, 3);
};

// ====================================================
// PostInfo 함수
// ====================================================

/**
 * 포스트 목록 정보 가져오기 (리스트 표시용)
 */
export const getPostInfoList = async (): Promise<PostInfo[]> => {
  const posts = await getAllPosts();
  
  return posts.map<PostInfo>((post) => ({
    title: post.title,
    description: post.description,
    href: `/blog/${post.slug}`,
    date: post.date,
    tags: post.tags,
    draft: post.draft,
  }));
};

/**
 * 특정 태그의 포스트 목록 가져오기
 */
export const getPostsByTag = async (tag: string): Promise<PostInfo[]> => {
  const posts = await getAllPosts();
  
  return posts
    .filter((post) => post.tags.includes(tag))
    .map<PostInfo>((post) => ({
      title: post.title,
      description: post.description,
      href: `/blog/${post.slug}`,
      date: post.date,
      tags: post.tags,
      draft: post.draft,
    }));
};

// ====================================================
// 내부 헬퍼 함수
// ====================================================

/**
 * Draft 포스트 필터링
 */
const filterDrafts = (posts: Post[], includeDrafts: boolean): Post[] => {
  if (includeDrafts || !isProduction()) {
    return posts;
  }
  return posts.filter((post) => !post.draft);
};
