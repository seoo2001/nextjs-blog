import type { Post } from '@/types/post';

interface RelatedPostsProps {
  posts: Post[];
}

export const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (posts.length === 0) return null;

  return (
    <div className="mt-10 mb-6">
      <h3 className="text-lg font-semibold mb-4">관련 글</h3>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-4 rounded-lg border border-[var(--border)] hover:border-[var(--gray-400)] transition-colors !no-underline hover:!opacity-100"
          >
            <div className="text-[var(--foreground)] font-medium">{post.title}</div>
            <div className="text-sm text-[var(--muted)] mt-1 line-clamp-2">
              {post.description}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
