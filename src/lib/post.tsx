import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { compareTwoStrings } from './dice-coefficient-kr';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Post, PostInfo } from '@/types/post';
import { sortDateAsc, sortDateDesc } from './utils';

// ====================================================
// Utils
// ====================================================

const postsDirectory = path.join(process.cwd(), 'src/posts');

// 캐시 추가
let postsCache: Post[] | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 300 * 1000; // 5분

/**
 * 글 Description 자동 파싱
 */
export const contentToDescription = (content: string) => {
  const parsedContent = content
    .replace(/(?<=\])\((.*?)\)/g, '')
    .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')
    .replace(/[#*|[\]]|(-{3,})|(`{3})(\S*)(?=\s)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 157);

  return `${parsedContent}...`;
};

/**
 * 날짜 포맷팅
 */
export const formatDate = (date: Date) => {
  return format(date, 'yyyy년 MM월 dd일', { locale: ko });
};

// ====================================================
// Post
// ====================================================

/** 전체 글 정보 가져오기 */
export const getAllPosts = async (): Promise<Post[]> => {
  const now = Date.now();
  
  // 캐시가 있고 유효한 경우 캐시된 데이터 반환
  if (postsCache && (now - lastCacheTime) < CACHE_DURATION) {
    return postsCache;
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
          };
        })
    );

    const sortedPosts = posts.sort(sortDateDesc);
    
    // 캐시 업데이트
    postsCache = sortedPosts;
    lastCacheTime = now;
    
    return sortedPosts;
  } catch (error) {
    console.error('Error reading posts:', error);
    // 에러 발생 시 캐시된 데이터가 있으면 반환
    if (postsCache) return postsCache;
    throw error;
  }
};

/** 특정 글 가져오기 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    // 캐시된 데이터가 있으면 캐시에서 검색
    if (postsCache) {
      const post = postsCache.find(p => p.slug === slug);
      if (post) return post;
    }

    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      date: new Date(data.date),
      description: data.description || contentToDescription(content),
      tags: data.tags || [],
      content,
      draft: data.draft || false,
    };
  } catch {
    return null;
  }
};

/** 연관 글 추출 */
export const getRelatedPosts = (post: Post, postList: Post[]) => {
  // 태그 기반으로 먼저 필터링
  const tagFilteredPosts = postList
    .filter((p) => p.slug !== post.slug)
    .filter((p) => {
      if (!post.tags || !p.tags) return false;
      return post.tags.some(tag => p.tags.includes(tag));
    });

  // 태그 매칭된 포스트가 3개 이상이면 태그 매칭 결과만 반환
  if (tagFilteredPosts.length >= 3) {
    return tagFilteredPosts.slice(0, 3);
  }

  // 태그 매칭이 부족한 경우 제목 유사도 계산
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
// PostInfo
// ====================================================

/** 전체 글 정보 리스트 가져오기 */
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

/** 특정 태그의 글 목록 가져오기 */
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
