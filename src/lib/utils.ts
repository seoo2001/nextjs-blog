export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export const sortDateDesc = (a: { date: Date }, b: { date: Date }) => {
  return b.date.getTime() - a.date.getTime();
};

export const sortDateAsc = (a: { date: Date }, b: { date: Date }) => {
  return a.date.getTime() - b.date.getTime();
};

