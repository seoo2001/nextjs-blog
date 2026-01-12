/**
 * 포트폴리오 관련 함수
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { sortByDate, contentToDescription, formatDate, ContentCache, isProduction } from './content';
import type { Portfolio, PortfolioInfo } from '@/types/portfolio';

// ====================================================
// 설정
// ====================================================

const portfolioDirectory = path.join(process.cwd(), 'src/portfolio');
const portfolioCache = new ContentCache<Portfolio>();

// ====================================================
// 유틸리티 (re-export)
// ====================================================

export { formatDate };

// ====================================================
// 포트폴리오 데이터 함수
// ====================================================

/**
 * 전체 포트폴리오 목록 가져오기
 * @param includeDrafts draft 포함 여부 (기본: production에서는 제외)
 */
export const getAllPortfolios = async (includeDrafts = false): Promise<Portfolio[]> => {
  const cached = portfolioCache.get();
  if (cached) {
    return filterDrafts(cached, includeDrafts);
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
            description: data.description || contentToDescription(content, 100),
            tags: data.tags || [],
            thumbnail: data.thumbnail || null,
            content,
            draft: data.draft || false,
            category: data.category || 'uncategorized',
          } as Portfolio;
        })
    );

    const sortedPortfolios = portfolios.sort(sortByDate.desc);
    portfolioCache.set(sortedPortfolios);
    
    return filterDrafts(sortedPortfolios, includeDrafts);
  } catch (error) {
    console.error('Error reading portfolios:', error);
    const cached = portfolioCache.get();
    if (cached) return filterDrafts(cached, includeDrafts);
    throw error;
  }
};

/**
 * 특정 슬러그로 포트폴리오 가져오기
 */
export const getPortfolioBySlug = async (slug: string): Promise<Portfolio | null> => {
  try {
    const cachedPortfolio = portfolioCache.find(p => p.slug === slug);
    if (cachedPortfolio) {
      if (isProduction() && cachedPortfolio.draft) return null;
      return cachedPortfolio;
    }

    const filePath = path.join(portfolioDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const portfolio: Portfolio = {
      slug,
      title: data.title,
      date: new Date(data.date),
      description: data.description || contentToDescription(content, 100),
      tags: data.tags || [],
      thumbnail: data.thumbnail || null,
      content,
      draft: data.draft || false,
      category: data.category || 'uncategorized',
    };

    if (isProduction() && portfolio.draft) return null;

    return portfolio;
  } catch {
    return null;
  }
};

// ====================================================
// PortfolioInfo 함수
// ====================================================

/**
 * 포트폴리오 목록 정보 가져오기 (리스트 표시용)
 */
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

/**
 * 특정 태그의 포트폴리오 목록 가져오기
 */
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

/**
 * 카테고리별 포트폴리오 목록 가져오기
 */
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

// ====================================================
// 내부 헬퍼 함수
// ====================================================

/**
 * Draft 포트폴리오 필터링
 */
const filterDrafts = (portfolios: Portfolio[], includeDrafts: boolean): Portfolio[] => {
  if (includeDrafts || !isProduction()) {
    return portfolios;
  }
  return portfolios.filter((portfolio) => !portfolio.draft);
};
