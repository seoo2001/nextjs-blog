export interface Note {
  slug: string;
  title: string;
  date: Date;
  description: string;
  tags: string[];
  thumbnail: string | null;
  content: string;
  draft: boolean;
  category: string;
}

export interface NoteInfo {
  title: string;
  description: string;
  href: string;
  date: Date;
  tags: string[];
  thumbnail: string | null;
  draft: boolean;
  category: string;
}