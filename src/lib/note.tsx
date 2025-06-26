import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Note, NoteInfo } from '@/types/note';
import { sortDateAsc, sortDateDesc } from './utils';

// ====================================================
// Utils
// ====================================================

const notesDirectory = path.join(process.cwd(), 'src/notes');

// 캐시 추가
let notesCache: Note[] | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 300 * 1000; // 5분

/**
 * 노트 Description 자동 파싱
 */
export const contentToDescription = (content: string) => {
  const parsedContent = content
    .replace(/(?<=\])\((.*?)\)/g, '')
    .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')
    .replace(/[#*|[\]]|(-{3,})|(`{3})(\S*)(?=\s)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);

  return `${parsedContent}...`;
};

/**
 * 날짜 포맷팅
 */
export const formatDate = (date: Date) => {
  return format(date, 'yyyy. MM. dd.', { locale: ko });
};

// ====================================================
// Note
// ====================================================

/** 전체 노트 정보 가져오기 */
export const getAllNotes = async (): Promise<Note[]> => {
  const now = Date.now();
  
  if (notesCache && (now - lastCacheTime) < CACHE_DURATION) {
    return notesCache;
  }

  try {
    const files = await fs.readdir(notesDirectory);
    
    const notes = await Promise.all(
      files
        .filter((file) => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(notesDirectory, file);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          return {
            slug: file.replace(/\.md$/, ''),
            title: data.title,
            date: new Date(data.date),
            description: data.description || contentToDescription(content),
            tags: data.tags || [],
            thumbnail: data.thumbnail || null, // 썸네일 이미지 추가
            content,
            draft: data.draft || false,
            category: data.category || 'uncategorized', // 카테고리 추가
          };
        })
    );

    const sortedNotes = notes.sort(sortDateDesc);
    
    notesCache = sortedNotes;
    lastCacheTime = now;
    
    return sortedNotes;
  } catch (error) {
    console.error('Error reading notes:', error);
    if (notesCache) return notesCache;
    throw error;
  }
};

/** 특정 노트 가져오기 */
export const getNoteBySlug = async (slug: string): Promise<Note | null> => {
  try {
    if (notesCache) {
      const note = notesCache.find(n => n.slug === slug);
      if (note) return note;
    }

    const filePath = path.join(notesDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      date: new Date(data.date),
      description: data.description || contentToDescription(content),
      tags: data.tags || [],
      thumbnail: data.thumbnail || null,
      content,
      draft: data.draft || false,
      category: data.category || 'uncategorized',
    };
  } catch {
    return null;
  }
};

// ====================================================
// NoteInfo
// ====================================================

/** 전체 노트 정보 리스트 가져오기 */
export const getNoteInfoList = async (): Promise<NoteInfo[]> => {
  const notes = await getAllNotes();
  
  return notes.map<NoteInfo>((note) => ({
    title: note.title,
    description: note.description,
    href: `/note/${note.slug}`,
    date: note.date,
    tags: note.tags,
    thumbnail: note.thumbnail,
    draft: note.draft,
    category: note.category,
  }));
};

/** 특정 태그의 노트 목록 가져오기 */
export const getNotesByTag = async (tag: string): Promise<NoteInfo[]> => {
  const notes = await getAllNotes();
  
  return notes
    .filter((note) => note.tags.includes(tag))
    .map<NoteInfo>((note) => ({
      title: note.title,
      description: note.description,
      href: `/note/${note.slug}`,
      date: note.date,
      tags: note.tags,
      thumbnail: note.thumbnail,
      draft: note.draft,
      category: note.category,
    }));
};

/** 카테고리별 노트 목록 가져오기 */
export const getNotesByCategory = async (category: string): Promise<NoteInfo[]> => {
  const notes = await getAllNotes();
  
  return notes
    .filter((note) => note.category === category)
    .map<NoteInfo>((note) => ({
      title: note.title,
      description: note.description,
      href: `/note/${note.slug}`,
      date: note.date,
      tags: note.tags,
      thumbnail: note.thumbnail,
      draft: note.draft,
      category: note.category,
    }));
}; 
