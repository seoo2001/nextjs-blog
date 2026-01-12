import React from 'react';
import Link from 'next/link';
import type { PostInfo } from '@/types/post';
import { formatDate } from '@/lib/content';

interface PostListProps {
  posts: PostInfo[];
}

export const PostList = ({ posts }: PostListProps) => {
  // 포스트를 년도별로 그룹화
  const postsByYear = posts.reduce((acc, post) => {
    const year = formatDate.year(new Date(post.date));
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {} as Record<string, PostInfo[]>);

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year} className="mt-3">
          <div
            className="mb-1 text-lg font-medium text-[var(--muted)]"
            data-animate
            data-animate-speed="fast"
          >
            {year}
          </div>
          <div className="my-3 border-t border-[var(--border)]" />
          <ul
            className="space-y-2"
            data-animate
            data-animate-speed="fast"
            data-animate-wait="1"
          >
            {postsByYear[year].map((post) => (
              <li key={post.href} className="flex items-center">
                <Link
                  href={post.href}
                  className="flex-1 hover:underline text-[var(--foreground)]"
                >
                  {post.title}
                </Link>
                <span className="text-sm text-[var(--muted)]">
                  {formatDate.short(new Date(post.date))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="my-3 border-t border-[var(--border)]" />
    </div>
  );
};
