import { getPostBySlug, getRelatedPosts, getAllPosts, formatDate } from '@/lib/post';
import { RelatedPosts } from '@/components/post/RelatedPosts';
import { notFound } from 'next/navigation';
import { PostDetail } from '@/components/post/PostDetail';
import { Header } from '@/components/Header';
import '@/styles/mdx.css';

// 정적 경로 생성
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ISR 설정 (5분마다 재생성)
export const revalidate = 300;

type BlogPostPageProps = Promise<{ slug: string }>;

export async function generateMetadata({ params }: {params: BlogPostPageProps}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: {params: BlogPostPageProps}) {
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