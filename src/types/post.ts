export type Post = {
  slug: string;
  title: string;
  date: Date;
  description: string;
  tags: string[];
  content: string;
  draft?: boolean;
};

export type PostInfo = {
  title: string;
  description: string;
  href: string;
  date: Date;
  tags: string[];
  draft?: boolean;
}; 