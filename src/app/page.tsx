import { Header } from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header title="SEO. DongJoon." />
      <div className="mt-3 min-h-[calc(100vh-var(--page-top)-240px)] space-y-8">
        Hello, there!
      </div>
    </>
  );
}
