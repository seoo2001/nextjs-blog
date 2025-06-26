import Link from 'next/link';
import Image from 'next/image';
import type { NoteInfo } from '@/types/note';
import { formatDate } from '@/lib/note';

interface NoteCardProps {
  note: NoteInfo;
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <Link
      href={note.href}
      className="group flex flex-col"
    >
      <div className="relative h-76 w-full rounded-lg overflow-hidden">
        {note.thumbnail ? (
          <Image
            src={note.thumbnail}
            alt={note.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-130"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {/* <div className="absolute bottom-2 right-2">
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-100 opacity-90">
            {note.category}
          </span>
        </div> */}
      </div>

      <div className="flex flex-1 flex-col gap-2 pt-3 px-2">
        <h3 className="line-clamp-2 text-lg text-gray-900 dark:text-gray-100">
          {note.title}
        </h3>
        {/* <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {note.description}
        </p> */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="pr-1 text-xs text-gray-600 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
          <time className="text-xs text-gray-500 dark:text-gray-500">
            {formatDate(note.date)}
          </time>
        </div>
      </div>
    </Link>
  );
} 
