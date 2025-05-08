import type { PostInfo } from '@/types/post';
import { formatDate } from '@/lib/post';

interface PostCardProps {
  post: PostInfo;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <article className="group relative flex flex-col space-y-2">
      <h2 className="text-2xl font-bold">
        <a href={post.href} className="hover:text-blue-500">
          {post.title}
        </a>
      </h2>
      <time className="text-sm text-gray-500">{formatDate(post.date)}</time>
      <p className="text-gray-600">{post.description}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}; 