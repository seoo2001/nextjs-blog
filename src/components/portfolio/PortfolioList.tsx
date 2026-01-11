import type { PortfolioInfo } from '@/types/portfolio';
import PortfolioCard from './PortfolioCard';

interface PortfolioListProps {
  portfolios: PortfolioInfo[];
  category?: string;
}

export default function PortfolioList({ portfolios }: PortfolioListProps) {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12" 
      data-animate 
      data-animate-speed="slow"
      data-animate-wait="1"
    >
      {portfolios.map((portfolio) => (
        <div 
          key={portfolio.href} 
        >
          <PortfolioCard portfolio={portfolio} />
        </div>
      ))}
    </div>
  );
}

