import React from 'react';
import { PostInfo } from '@/types/post';
import Link from 'next/link';
import { format } from 'date-fns';

interface PostListProps {
  posts: PostInfo[];
}

export const PostList = ({ posts }: PostListProps) => {
  // 포스트를 년도별로 그룹화
  const postsByYear = posts.reduce((acc, post) => {
    const year = format(new Date(post.date), 'yyyy');
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, PostInfo[]>);

  // 년도를 내림차순으로 정렬
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6">

      {years.map((year) => (
        <React.Fragment key={year}>
          <div className="mt-3">
            <div className="mb-1 text-lg font-medium text-[var(--text-second)]" data-animate data-animate-speed="fast">{year}</div>
            <div className="my-3 border-t border-[var(--border)]" />
            <ul className="space-y-2" data-animate data-animate-speed="fast" data-animate-wait="1">
              {postsByYear[year].map((post) => (
                <li key={post.href} className="flex items-center">
                  <Link href={post.href} className="flex-1 hover:underline text-[var(--text-body)]">
                    {post.title}
                  </Link>
                  <span className="text-sm text-[var(--text-second)]">
                    {format(new Date(post.date), 'MM. dd.')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </React.Fragment>
      ))}
      <div className="my-3 border-t border-[var(--border)]" />

    </div>
  );
}; 