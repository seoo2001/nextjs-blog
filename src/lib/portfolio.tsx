import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Portfolio, PortfolioInfo } from '@/types/portfolio'

// ====================================================
// Utils
// ====================================================

const portfolioDirectory = path.join(process.cwd(), 'src/portfolio');

// 캐시 추가
let portfolioCache: Portfolio[] | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 300 * 1000; // 5분

export const sortDateDesc = (a: { date: Date }, b: { date: Date }) => {
  return b.date.getTime() - a.date.getTime();
};

export const sortDateAsc = (a: { date: Date }, b: { date: Date }) => {
  return a.date.getTime() - b.date.getTime();
};

/**
 * 포트폴리오 Description 자동 파싱
 */
export const contentToDescription = (content: string) => {
  const parsedContent = content
    .replace(/(?<=\])\((.*?)\)/g, '')
    .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')
    .replace(/[#*|[\]]|(-{3,})|(`{3})(\S*)(?=\s)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);

  return `${parsedContent}...`;
};

/**
 * 날짜 포맷팅
 */
export const formatDate = (date: Date) => {
  return format(date, 'yyyy. MM. dd.', { locale: ko });
};

// ====================================================
// Portfolio
// ====================================================

/** 전체 포트폴리오 정보 가져오기 */
export const getAllPortfolios = async (): Promise<Portfolio[]> => {
  const now = Date.now();
  
  if (portfolioCache && (now - lastCacheTime) < CACHE_DURATION) {
    return portfolioCache;
  }

  try {
    const files = await fs.readdir(portfolioDirectory);
    
    const portfolios = await Promise.all(
      files
        .filter((file) => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(portfolioDirectory, file);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          return {
            slug: file.replace(/\.md$/, ''),
            title: data.title,
            date: new Date(data.date),
            description: data.description || contentToDescription(content),
            tags: data.tags || [],
            thumbnail: data.thumbnail || null,
            content,
            draft: data.draft || false,
            category: data.category || 'uncategorized',
          };
        })
    );

    const sortedPortfolios = portfolios.sort(sortDateDesc);
    
    portfolioCache = sortedPortfolios;
    lastCacheTime = now;
    
    return sortedPortfolios;
  } catch (error) {
    console.error('Error reading portfolios:', error);
    if (portfolioCache) return portfolioCache;
    throw error;
  }
};

/** 특정 포트폴리오 가져오기 */
export const getPortfolioBySlug = async (slug: string): Promise<Portfolio | null> => {
  try {
    if (portfolioCache) {
      const portfolio = portfolioCache.find(p => p.slug === slug);
      if (portfolio) return portfolio;
    }

    const filePath = path.join(portfolioDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      date: new Date(data.date),
      description: data.description || contentToDescription(content),
      tags: data.tags || [],
      thumbnail: data.thumbnail || null,
      content,
      draft: data.draft || false,
      category: data.category || 'uncategorized',
    };
  } catch {
    return null;
  }
};

// ====================================================
// PortfolioInfo
// ====================================================

/** 전체 포트폴리오 정보 리스트 가져오기 */
export const getPortfolioInfoList = async (): Promise<PortfolioInfo[]> => {
  const portfolios = await getAllPortfolios();
  
  return portfolios.map<PortfolioInfo>((portfolio) => ({
    title: portfolio.title,
    description: portfolio.description,
    href: `/portfolio/${portfolio.slug}`,
    date: portfolio.date,
    tags: portfolio.tags,
    thumbnail: portfolio.thumbnail,
    draft: portfolio.draft,
    category: portfolio.category,
  }));
};

/** 특정 태그의 포트폴리오 목록 가져오기 */
export const getPortfoliosByTag = async (tag: string): Promise<PortfolioInfo[]> => {
  const portfolios = await getAllPortfolios();
  
  return portfolios
    .filter((portfolio) => portfolio.tags.includes(tag))
    .map<PortfolioInfo>((portfolio) => ({
      title: portfolio.title,
      description: portfolio.description,
      href: `/portfolio/${portfolio.slug}`,
      date: portfolio.date,
      tags: portfolio.tags,
      thumbnail: portfolio.thumbnail,
      draft: portfolio.draft,
      category: portfolio.category,
    }));
};

/** 카테고리별 포트폴리오 목록 가져오기 */
export const getPortfoliosByCategory = async (category: string): Promise<PortfolioInfo[]> => {
  const portfolios = await getAllPortfolios();
  
  return portfolios
    .filter((portfolio) => portfolio.category === category)
    .map<PortfolioInfo>((portfolio) => ({
      title: portfolio.title,
      description: portfolio.description,
      href: `/portfolio/${portfolio.slug}`,
      date: portfolio.date,
      tags: portfolio.tags,
      thumbnail: portfolio.thumbnail,
      draft: portfolio.draft,
      category: portfolio.category,
    }));
};

