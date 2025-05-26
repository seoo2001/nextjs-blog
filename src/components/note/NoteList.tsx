import type { NoteInfo } from '@/types/note';
import NoteCard from './NoteCard';

interface NoteListProps {
  notes: NoteInfo[];
  category?: string;
}

export default function NoteList({ notes }: NoteListProps) {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
      data-animate 
      data-animate-speed="slow"
      data-animate-wait="1"
    >
      {notes.map((note) => (
        <div 
          key={note.href} 
        >
          <NoteCard note={note} />
        </div>
      ))}
    </div>
  );
} 