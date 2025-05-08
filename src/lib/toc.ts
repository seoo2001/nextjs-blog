/** table-of-content */
export type TOCSection = TOCSubSection & {
  subSections: TOCSubSection[];
};

export type TOCSubSection = {
  slug: string;
  text: string;
};

export const parseToc = (source: string) => {
  let inCodeBlock = false;
  let hasMainSection = false;
  return source
    .split('\n')
    .filter((line) => {
      const trimmedLine = line.trim();
      // 코드 블록 시작/종료 감지 - 한 줄에 여러 개의 ```가 있는 경우도 처리
      const backtickCount = (trimmedLine.match(/```/g) || []).length;
      if (backtickCount > 0) {
        // 홀수 개의 ```가 있으면 코드 블록 상태가 변경됨
        if (backtickCount % 2 === 1) {
          inCodeBlock = !inCodeBlock;
        }
        return false;
      }
      // 코드 블록 내부는 무시
      if (inCodeBlock) {
        return false;
      }
      return line.match(/(^#{1,2})\s/);
    })
    .reduce<TOCSection[]>((ac, rawHeading) => {
      const nac = [...ac];
      const removeMdx = rawHeading
        .replace(/^##*\s/, '')
        .replace(/[*,~]{2,}/g, '')
        .replace(/(?<=\])\((.*?)\)/g, '')
        .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '');

      const section = {
        slug: removeMdx
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣 -]/g, '')
          .replace(/\s/g, '-'),
        text: removeMdx,
      };

      const isSubTitle = rawHeading.startsWith('##');

      if (isSubTitle && hasMainSection) {
        nac.at(-1)?.subSections.push(section);
      } else {
        hasMainSection = true;
        nac.push({ ...section, subSections: [] });
      }

      return nac;
    }, []);
};
