import { getNoteBySlug, getAllNotes, formatDate } from '@/lib/note';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { PostDetail } from '@/components/post/PostDetail';
import '@/styles/mdx.css';

type NotePageProps = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: NotePageProps }) {
    const { slug } = await params;
    const note = await getNoteBySlug(slug);
    if (!note) return {};

    return {
        title: note.title,
        description: note.description,
        openGraph: {
            title: `${note.title}`,
            description: note.description,
            type: 'article',
            publishedTime: note.date.toISOString(),
            url: `https://ilez.xyz/note/${slug}`,
        },
        twitter: {
            card: 'summary',
            title: note.title,
            description: note.description,
        },
        alternates: {
            canonical: `https://ilez.xyz/note/${slug}`,
        },
    };
}

export async function generateStaticParams() {
    const notes = await getAllNotes();

    return notes.map((note) => ({
        slug: note.slug,
    }));
}

export default async function NotePage({ params }: { params: NotePageProps }) {
    const { slug } = await params;
    const note = await getNoteBySlug(slug);

    if (!note) {
        notFound();
    }

    return (
        <>
            <Header title={note.title} date={formatDate(note.date)} tags={note.tags} />
            <article className="mx-auto space-y-8 pt-10">
                {/* 썸네일 이미지 */}
                {note.thumbnail && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                            src={note.thumbnail}
                            alt={note.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* 노트 본문 */}
                <div className="mdx">
                    <PostDetail post={note} />
                </div>
            </article>
        </>
    );
}