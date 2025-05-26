import { getNoteInfoList } from '@/lib/note';
import NoteList from '@/components/note/NoteList';
import { Metadata } from 'next';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: '노트',
  description: '프로젝트 모음.',
};

export const dynamic = 'force-static';
export const revalidate = 3600; // 1시간마다 재생성



export default async function NotePage() {
  const notes = await getNoteInfoList();

  return (
    <>
      <Header title="Note" />
      <div className="mt-5">
        <NoteList notes={notes} />
      </div>
    </>
  );
}
