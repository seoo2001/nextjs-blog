import { Header } from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header title="SEO. DongJoon." />
      <div className="mt-3 min-h-[calc(100vh-var(--page-top)-240px)] space-y-8">
        Hello, there!
        {/* <section className="space-y-6">
          <h2 className="text-xl font-bold border-b border-gray-200 pb-2">Works</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">네이버</h3>
                <span className="text-sm text-[var(--text-second)]">2025.07 - 2025.08</span>
              </div>
              <p className="text-base text-[var(--text-second)]">AI 검색 개발 체험형 인턴</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text-second)] ml-2">
                <li>Knowledge Graph Schema Mapping Tool 개발</li>
                <li>LLM을 활용한 property 추천 모델 개발 및 성능 최적화</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">ACRYL AI</h3>
                <span className="text-sm text-[var(--text-second)]">2024.07</span>
              </div>
              <p className="text-base text-[var(--text-second)]">AI Modeling Intern</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text-second)] ml-2">
                <li>유사 데이터셋 수집 및 정제, Boosting 기반 AI 모델 실험</li>
                <li>FastAPI를 활용한 RAG search API 개발</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold border-b border-gray-200 pb-2">Education</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">서울시립대학교</h3>
                <span className="text-sm text-[var(--text-second)]">2020.03 - 2026.08 (예정)</span>
              </div>
              <p className="text-base text-[var(--text-second)]">컴퓨터과학부</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold border-b border-gray-200 pb-2">Experiments</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">네이버 부스트캠프</h3>
                <span className="text-sm text-[var(--text-second)]">2024.08 - 2025.02</span>
              </div>
              <p className="text-base text-[var(--text-second)]">AI Tech 추천시스템 Track</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text-second)] ml-2">
                <li>협업 필터링, 딥러닝 기반 추천 알고리즘 학습 및 구현</li>
                <li>RecSys Challenge 대회 참여 및 팀 프로젝트 진행</li>
                <li>PyTorch를 활용한 추천 모델 개발 및 실험</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">ICPC Asia Regional</h3>
                <span className="text-sm text-[var(--text-second)]">2023</span>
              </div>
              <p className="text-base text-[var(--text-second)]">본선 진출 (Seoul, 2023)</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">서울시립대학교 알고리즘 경진대회</h3>
                <span className="text-sm text-[var(--text-second)]">2023</span>
              </div>
              <p className="text-base text-[var(--text-second)]">1부 은상(3위)</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">SQLD</h3>
                <span className="text-sm text-[var(--text-second)]">2025</span>
              </div>
              <p className="text-base text-[var(--text-second)]">SQL 개발자 자격증</p>
            </div>
          </div>
        </section> */}
      </div>
    </>
  );
}
