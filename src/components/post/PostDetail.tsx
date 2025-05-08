import type { Post } from '@/types/post';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

interface PostDetailProps {
    post: Post;
}

export const PostDetail = ({ post }: PostDetailProps) => {


    return (
        <div className="post-detail">
            <MDXRemote
                source={post.content}
                options={{
                mdxOptions: {
                    remarkPlugins: [
                        remarkGfm,
                        remarkMath,
                    ],
                    rehypePlugins: [
                        [rehypeSlug, { behavior: 'wrap' }],
                        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                        [rehypeKatex, { output: 'htmlAndMathml', throwOnError: false }],
                    ],
                },
                }}
            />
        </div>
    )
}