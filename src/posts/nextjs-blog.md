---
title: 'NextJS로 Blog 만들기'
date: '2025-05-10'
tags: ['nextjs', 'blog']
---

기존 [jekyll blog](https://seoo2001.github.io)에서, nextJS로 새롭게 블로그를 제작했습니다. 기존의 블로그와 동일하게 markdown 형식의 포스팅을 유지하면서, 자유도를 높이기 위해 처음부터 새로 제작하게 되었습니다.

### 참고 블로그

- [bepyan](https://github.com/bepyan/bepyan.me.v2)

- [d5br5](https://github.com/d5br5/nextjs-tailwind-blog)

# NextJS 세팅하기

```bash
npx create-next-app@latest
```

typescript, tailwindCSS, App Router를 적용했습니다.

# Markdown

## Meta Data

메타 데이터 parsing에는 gray-matter를 활용했습니다.

```md
---
title: '추천 시스템 정리 (3)'
date: '2025-04-14'
tags: ['AI']
---

main content...
```

위와 같은 형식으로 md 파일을 작성하면, gray-matter를 통해 post의 meta 정보를 파싱할 수 있습니다.

```ts
import matter from 'gray-matter';

const files = await fs.readdir(postsDirectory);
const posts = await Promise.all(
    files
    .filter((file) => file.endsWith('.md'))
    .map(async (file) => {
        const filePath = path.join(postsDirectory, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        return {
        slug: file.replace(/\.md$/, ''),
        title: data.title,
        date: new Date(data.date),
        description: data.description || contentToDescription(content),
        tags: data.tags || [],
        content,
        draft: data.draft || false,
        };
    })
);
```

## Markdown 렌더링

next mdx remote는 .md 파일을 런타임에 가져와서 클라이언트에서 동적으로 렌더링을 할 수 있게 해주는 라이브러리 입니다. remark-gfm은 GitHub가 사용하는 확장된 markdown 문법을 처리하는 역할을 합니다. 추가적으로 수식 렌더링을 위해 remark-math, rehype-katex를 추가했습니다. 그리고 codeblock 처리를 위해 rehype-pretty-code를 사용했습니다.

```ts
import { MDXRemote } from 'next-mdx-remote/rsc';
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
```

# Dark Mode

next-themes를 통해 다크모드를 간단하게 구현했습니다. 

먼저 global.css 파일에 다음과 같이 dark mode 설정을 추가합니다.

```css
@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

[data-theme="dark"] {
    ...
}
```

theme 변경은 위 방법으로 theme 값을 변경하면 됩니다. 

```ts
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
```

마지막으로 themeprovider로 감싸주면 됩니다.

```ts
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
    <div className="container">
    <main>
        {children}
        <Footer />
    </main>
    </div>
</ThemeProvider>
```

# Table of Content

목차는 마크다운 문서의 헤더를 파싱하여 구현했습니다. 크게 세 가지 부분으로 나누어 구현했습니다:

1. 헤더 파싱 및 TOC 데이터 구조 생성
2. TOC 컴포넌트 구현
3. 스크롤 위치에 따른 현재 섹션 추적

## 헤더 파싱

`toc.ts`에서 마크다운 문서의 헤더를 파싱하여 계층 구조로 만듭니다. 코드 블록 내부의 헤더는 무시하고, 실제 헤더만 추출하여 계층 구조를 만듭니다.

```ts
// lib/toc.ts
export type TOCSection = {
  text: string;
  slug: string;
  subSections: TOCSection[];
};

export const parseToc = (source: string) => {
  let inCodeBlock = false;
  let hasMainSection = false;
  
  return source
    .split('\n')
    .filter((line) => {
      // 코드 블록 내부의 헤더는 무시
      ...
      return line.match(/(^#{1,2})\s/);
    })
    .reduce<TOCSection[]>((ac, rawHeading) => {
      const nac = [...ac];
      // 마크다운 문법 제거 (링크, 강조 등)
      const removeMdx = rawHeading
        .replace(/^##*\s/, '')
        .replace(/[*,~]{2,}/g, '')
        .replace(/(?<=\])\((.*?)\)/g, '')
        .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '');

      const section = {
        slug: removeMdx
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣 -]/g, '')
          .replace(/\s/g, '-'),
        text: removeMdx,
      };

      // h1은 최상위 섹션, h2는 하위 섹션으로 처리
      const isSubTitle = rawHeading.startsWith('##');
      if (isSubTitle && hasMainSection) {
        nac.at(-1)?.subSections.push(section);
      } else {
        hasMainSection = true;
        nac.push({ ...section, subSections: [] });
      }

      return nac;
    }, []);
};
```

## TOC 컴포넌트

`TableOfContent` 컴포넌트는 파싱된 TOC 데이터를 받아 렌더링합니다. 각 섹션은 클릭 가능한 링크로 표시되며, 현재 보고 있는 섹션은 다른 색상으로 하이라이트됩니다.

```tsx
// components/post/TableOfContent.tsx
export default function TableOfContent({ toc, className }: { toc: TOCSection[]; className?: string }) {
  const { currentSectionSlug } = useTocScroll(toc);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={cn('font-sans text-sm', className)}>
      {toc.map((section, i) => (
        <div key={i} className="mt-2">
          <a
            className={cn(
              'link transition-colors',
              currentSectionSlug === section.slug 
                ? 'text-[var(--gray-800)]' 
                : 'text-[var(--gray-500)] hover:text-[var(--gray-800)]'
            )}
            href={`#${section.slug}`}
            onClick={(e) => handleClick(e, section.slug)}
          >
            {section.text}
          </a>
          {section.subSections.length > 0 && (
            <div className="ml-4">
              {section.subSections.map((sub, j) => (
                <div key={j} className="mt-1">
                  <a
                    className={cn(
                      'link transition-colors',
                      currentSectionSlug === sub.slug 
                        ? 'text-[var(--gray-800)]' 
                        : 'text-[var(--gray-500)] hover:text-[var(--gray-800)]'
                    )}
                    href={`#${sub.slug}`}
                    onClick={(e) => handleClick(e, sub.slug)}
                  >
                    {sub.text}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

## 스크롤 위치 추적

`useTocScroll` 훅은 Intersection Observer API를 사용하여 현재 보고 있는 섹션을 추적합니다.

```ts
// hook/useTocScroll.ts
export default function useTocScroll(toc: TOCSection[]) {
  const [currentSectionSlug, setCurrentSectionSlug] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSectionSlug(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    toc.forEach((section) => {
      const element = document.getElementById(section.slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  return { currentSectionSlug };
}
```

# 구현 예정

- 댓글 기능
- sitemap
- 소개 페이지 작성

# 마치며

javascript는 물론, react조차 익숙하지 않아서 react에 대한 핵심만 빠르게 공부하고 제작을 했습니다. [React Foundations](https://nextjs.org/learn/react-foundations)를 참고했습니다. 또한 cursor의 학생 1년 무료 프로모션도 큰 도움이 됐습니다. "잘 만들어 놓은 블로그가 있으면 글을 더 자주 쓰고 싶어지지 않을까"라는 소망으로 제작하게 되었습니다.

![next_blog_시행착오](/img/nextblog_1.png)
> 제작 과정에서 갈려 나간 이전 버전 흔적들..

