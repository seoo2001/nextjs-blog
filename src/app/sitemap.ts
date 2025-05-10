import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOMAIN = 'https://www.ilez.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
  // 정적 페이지 URL
  const staticPages = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${DOMAIN}/blog`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/note`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },

  ];

  // posts 폴더에서 모든 마크다운 파일 읽기
  const postsDirectory = path.join(process.cwd(), 'src/posts');
  const files = fs.readdirSync(postsDirectory);

  // 각 포스트의 URL 생성
  const postPages = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(postsDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      const slug = file.replace(/\.md$/, '');

      return {
        url: `${DOMAIN}/blog/${slug}`,
        lastModified: data.date ? new Date(data.date) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

  return [...staticPages, ...postPages];
} 