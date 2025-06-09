import { Header } from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header title="SEO. DongJoon." />
      <div className="mt-3 min-h-[calc(100vh-var(--page-top)-240px)]">
        <p>
          Hello, I&apos;m DongJoon. I&apos;m a software engineer.
        </p>
      </div>
    </>
  );
}
