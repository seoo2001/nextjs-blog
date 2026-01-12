import Link from 'next/link';
import Image from 'next/image';
import type { PortfolioInfo } from '@/types/portfolio';
import { formatDate } from '@/lib/content';

interface PortfolioCardProps {
  portfolio: PortfolioInfo;
}

export default function PortfolioCard({ portfolio }: PortfolioCardProps) {
  return (
    <Link href={portfolio.href} className="group flex flex-col">
      <div className="relative h-48 w-full rounded-lg overflow-hidden bg-[var(--gray-100)]">
        {portfolio.thumbnail ? (
          <Image
            src={portfolio.thumbnail}
            alt={portfolio.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[var(--muted)]">No Image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-3 px-1">
        <h3 className="line-clamp-2 text-lg">{portfolio.title}</h3>
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <div className="flex flex-wrap gap-1">
            {portfolio.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
          <time>{formatDate.portfolio(portfolio.date)}</time>
        </div>
      </div>
    </Link>
  );
}
