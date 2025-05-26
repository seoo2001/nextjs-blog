import { Header } from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header title="Me" />
      <div className="mt-3 min-h-[calc(100vh-var(--page-top)-240px)]">
        <p>
          <a href="https://github.com/seoo2001">GitHub</a>
        </p>
      </div>
    </>
  );
}
