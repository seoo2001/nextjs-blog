'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { GISCUS_CONFIG, GISCUS_THEMES, type GiscusTheme } from '@/constants/giscus';

export default function Comment() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const theme: GiscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const themeUrl = GISCUS_THEMES[theme];

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://giscus.app/client.js';
    scriptElement.async = true;
    scriptElement.crossOrigin = 'anonymous';

    // Giscus 설정 적용
    scriptElement.setAttribute('data-repo', GISCUS_CONFIG.repo);
    scriptElement.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    scriptElement.setAttribute('data-category', GISCUS_CONFIG.category);
    scriptElement.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    scriptElement.setAttribute('data-mapping', GISCUS_CONFIG.mapping);
    scriptElement.setAttribute('data-strict', GISCUS_CONFIG.strict);
    scriptElement.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled);
    scriptElement.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata);
    scriptElement.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition);
    scriptElement.setAttribute('data-theme', themeUrl);
    scriptElement.setAttribute('data-lang', GISCUS_CONFIG.lang);

    ref.current.appendChild(scriptElement);
  }, [themeUrl]);

  // 테마 변경 시 Giscus 테마도 업데이트
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage({
      giscus: {
        setConfig: { theme: themeUrl }
      }
    }, 'https://giscus.app');
  }, [themeUrl]);

  return <section ref={ref} />;
}
