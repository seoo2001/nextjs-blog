import type { Post } from '@/types/post';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import rehypePrettyCode from 'rehype-pretty-code';

interface PostDetailProps {
    post: Post;
}

export const PostDetail = ({ post }: PostDetailProps) => {
    const customTheme = {
        "name": "my-custom-theme",
        "type": "dark",
        "colors": {
          "editor.background": "var(--code-background)",
          "editor.foreground": "var(--code-foreground)"
        },
        "tokenColors": [
          {
            "scope": "constant",
            "settings": {
              "foreground": "var(--code-token-constant)"
            }
          },
          {
            "scope": "string",
            "settings": {
              "foreground": "var(--code-token-string)"
            }
          },
          {
            "scope": "comment",
            "settings": {
              "foreground": "var(--code-token-comment)"
            }
          },
          {
            "scope": "keyword",
            "settings": {
              "foreground": "var(--code-token-keyword)"
            }
          },
          {
            "scope": "parameter",
            "settings": {
              "foreground": "var(--code-token-parameter)"
            }
          },
          {
            "scope": "function",
            "settings": {
              "foreground": "var(--code-token-function)"
            }
          },
          {
            "scope": "string.expression",
            "settings": {
              "foreground": "var(--code-token-string-expression)"
            }
          },
          {
            "scope": "punctuation",
            "settings": {
              "foreground": "var(--code-token-punctuation)"
            }
          },
          {
            "scope": "link",
            "settings": {
              "foreground": "var(--code-token-link)"
            }
          }
        ]
      }

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
                        [rehypePrettyCode, { theme: customTheme }]
                    ],
                },
                }}
            />
        </div>
    )
}