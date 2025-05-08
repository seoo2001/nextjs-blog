import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compareTwoStrings } from './dice-coefficient-kr';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Post, PostInfo } from '@/types/post';

// ====================================================
// Utils
// ====================================================

const postsDirectory = path.join(process.cwd(), 'src/posts');

export const sortDateDesc = (a: { date: Date }, b: { date: Date }) => {
  return b.date.getTime() - a.date.getTime();
};

export const sortDateAsc = (a: { date: Date }, b: { date: Date }) => {
  return a.date.getTime() - b.date.getTime();
};

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
  const files = fs.readdirSync(postsDirectory);
  
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(postsDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
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
    .sort(sortDateDesc);

  return posts;
};

/** 특정 글 가져오기 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
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
