import { getPostBySlug, getRelatedPosts, getAllPosts, formatDate } from '@/lib/post';
import { RelatedPosts } from '@/components/post/RelatedPosts';
import { notFound } from 'next/navigation';
import { PostDetail } from '@/components/post/PostDetail';
import { Header } from '@/components/Header';
import '@/styles/mdx.css';
import TableOfContent from '@/components/post/TableOfContent';
import { parseToc } from '@/lib/toc';

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

export async function generateMetadata({ params }: { params: BlogPostPageProps }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: BlogPostPageProps }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post, await getAllPosts());
  const toc = parseToc(post.content);

  return (
    <>
      <Header title={post.title} date={formatDate(post.date)} tags={post.tags} />
      <div className="mdx flex gap-8 relative">
        <main className="flex-1 min-w-0">
          <PostDetail post={post} />
          <RelatedPosts posts={relatedPosts} />
        </main>
        <aside className="absolute -top-[300px] left-full hidden h-[calc(100%-400px)] xl:block mt-[200px]">
          <div className="sticky bottom-0 top-[200px] z-10 ml-[2.5rem] pl-[1rem] mt-[300px] w-[300px] border-l border-[var(--gray-200)]">
            <TableOfContent toc={toc} />
          </div>
        </aside>
      </div>
    </>
  );
}