import { getPortfolioBySlug, getAllPortfolios } from '@/lib/portfolio';
import { formatDate } from '@/lib/content';
import { createUrl } from '@/constants/metadata';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { PostDetail } from '@/components/post/PostDetail';
import '@/styles/mdx.css';

type PortfolioPageProps = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PortfolioPageProps }) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return {};

  const url = createUrl.portfolio(slug);

  return {
    title: portfolio.title,
    description: portfolio.description,
    openGraph: {
      title: portfolio.title,
      description: portfolio.description,
      type: 'article',
      publishedTime: portfolio.date.toISOString(),
      url,
    },
    twitter: {
      card: 'summary',
      title: portfolio.title,
      description: portfolio.description,
    },
    alternates: {
      canonical: url,
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
      <Header 
        title={portfolio.title} 
        date={formatDate.portfolio(portfolio.date)} 
        tags={portfolio.tags} 
      />
      <div className="mdx">
        <PostDetail post={portfolio} />
      </div>
    </>
  );
}
