import { getPortfolioBySlug, getAllPortfolios, formatDate } from '@/lib/portfolio';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { PostDetail } from '@/components/post/PostDetail';
import '@/styles/mdx.css';

type PortfolioPageProps = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PortfolioPageProps }) {
    const { slug } = await params;
    const portfolio = await getPortfolioBySlug(slug);
    if (!portfolio) return {};

    return {
        title: portfolio.title,
        description: portfolio.description,
        openGraph: {
            title: `${portfolio.title}`,
            description: portfolio.description,
            type: 'article',
            publishedTime: portfolio.date.toISOString(),
            url: `https://ilez.xyz/portfolio/${slug}`,
        },
        twitter: {
            card: 'summary',
            title: portfolio.title,
            description: portfolio.description,
        },
        alternates: {
            canonical: `https://ilez.xyz/portfolio/${slug}`,
        },
    };
}

export async function generateStaticParams() {
    const portfolios = await getAllPortfolios();

    return portfolios.map((portfolio) => ({
        slug: portfolio.slug,
    }));
}

export default async function PortfolioPage({ params }: { params: PortfolioPageProps }) {
    const { slug } = await params;
    const portfolio = await getPortfolioBySlug(slug);

    if (!portfolio) {
        notFound();
    }

    return (
        <>
            <Header title={portfolio.title} date={formatDate(portfolio.date)} tags={portfolio.tags} />
            <article className="mx-auto space-y-8 pt-10">
                {/* 썸네일 이미지 */}
                {portfolio.thumbnail && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                            src={portfolio.thumbnail}
                            alt={portfolio.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* 포트폴리오 본문 */}
                <div className="mdx">
                    <PostDetail post={portfolio} />
                </div>
            </article>
        </>
    );
}

