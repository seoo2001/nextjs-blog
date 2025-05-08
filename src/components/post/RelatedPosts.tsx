import React from 'react';
import type { Post } from '@/types/post';

interface RelatedPostsProps {
  posts: Post[];
}

export const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  return (
    <div className="related-posts">
      <div className="related-posts-title">관련 글</div>
      <div className="related-posts-list">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="related-posts-item"
          >
            <div>{post.title}</div>
            <div className="desc">{post.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}; 