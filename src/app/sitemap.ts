import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/post';
import { getAllPortfolios } from '@/lib/portfolio';
import { META, createUrl } from '@/constants/metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지 URL
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: META.url,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: createUrl.blog(),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: createUrl.portfolioList(),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 포스트 페이지 URL
  const posts = await getAllPosts();
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: createUrl.post(post.slug),
    lastModified: post.date,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 포트폴리오 페이지 URL
  const portfolios = await getAllPortfolios();
  const portfolioPages: MetadataRoute.Sitemap = portfolios.map((portfolio) => ({
    url: createUrl.portfolio(portfolio.slug),
    lastModified: portfolio.date,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...portfolioPages];
}
