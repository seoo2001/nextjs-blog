import type { BaseContent } from '@/types/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Options } from 'rehype-pretty-code';

interface PostDetailProps {
  post: BaseContent;
}

/**
 * rehype-pretty-code 설정
 * 두 테마를 지정하면 각 span에 --shiki-light, --shiki-dark CSS 변수가 생성됨
 * CSS에서 현재 모드에 맞는 변수를 선택
 */
const prettyCodeOptions: Options = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  keepBackground: false, // CSS로 배경 제어
};

export const PostDetail = ({ post }: PostDetailProps) => {
  return (
    <div className="post-detail">
      <MDXRemote
        source={post.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [
              [rehypeSlug, { behavior: 'wrap' }],
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              [rehypeKatex, { output: 'htmlAndMathml', throwOnError: false }],
              [rehypePrettyCode, prettyCodeOptions],
            ],
          },
        }}
      />
    </div>
  );
};
