import { getNoteInfoList } from '@/lib/note';
import NoteList from '@/components/note/NoteList';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: '노트',
  description: '개발 관련 짧은 기록들을 모아둔 공간입니다.',
};

interface NotePageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function NotePage({ searchParams }: NotePageProps) {
  const notes = await getNoteInfoList();
  const { category } = await searchParams;

  const filteredNotes = category
    ? notes.filter((note) => note.category === category)
    : notes;

  return (
    <>
      <Header title="Note" />
      <div className="mt-5">
        <NoteList notes={filteredNotes} category={category} />
      </div>
      <Footer />
    </>
  );
}
