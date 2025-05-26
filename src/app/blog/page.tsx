import { getPostInfoList } from '@/lib/post';
import { PostList } from '@/components/post/PostList';
import { Header } from '@/components/Header';

export const metadata = {
  title: '블로그',
  description: '블로그입니다.',
};

export default async function BlogPage() {
  const posts = await getPostInfoList();

  return (
    <>
      <Header title="Blog" />
      <PostList posts={posts} />
    </>
  );
} 