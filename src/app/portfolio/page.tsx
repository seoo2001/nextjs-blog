import { getPortfolioInfoList } from '@/lib/portfolio';
import PortfolioList from '@/components/portfolio/PortfolioList';
import { Metadata } from 'next';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: '포트폴리오',
  description: '프로젝트 모음.',
};

export const dynamic = 'force-static';
export const revalidate = 3600; // 1시간마다 재생성

export default async function PortfolioPage() {
  const portfolios = await getPortfolioInfoList();

  return (
    <>
      <Header title="Portfolio" />
      <div className="pt-10">
        <PortfolioList portfolios={portfolios} />
      </div>
    </>
  );
}
