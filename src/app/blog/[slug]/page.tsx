import { getPostBySlug, getRelatedPosts, getAllPosts, formatDate } from '@/lib/post';
import { RelatedPosts } from '@/components/post/RelatedPosts';
import { notFound } from 'next/navigation';
import { PostDetail } from '@/components/post/PostDetail';
import { Header } from '@/components/Header';
import '@/styles/mdx.css';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post, await getAllPosts());

  return (
    <>
      <Header title={post.title} date={formatDate(post.date)} />
      <div className="mdx">
        <PostDetail post={post} />
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}