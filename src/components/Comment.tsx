'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const giscusThemes = {
  light: 'https://giscus.app/themes/noborder_light.css',
  dark: 'https://giscus.app/themes/noborder_gray.css',
} as const;

export default function Comment() {
    const ref = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();

    const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
    const themeUrl = giscusThemes[theme];

    useEffect(() => {
        if (!ref.current || ref.current.hasChildNodes()) return;

        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://giscus.app/client.js';
        scriptElement.async = true;
        scriptElement.crossOrigin = 'anonymous';

        scriptElement.setAttribute('data-repo', 'seoo2001/nextjs-blog');
        scriptElement.setAttribute('data-repo-id', 'R_kgDOOmbckA');
        scriptElement.setAttribute('data-category', 'Comments');
        scriptElement.setAttribute('data-category-id', 'DIC_kwDOOmbckM4Cp_wo');
        scriptElement.setAttribute('data-mapping', 'pathname');
        scriptElement.setAttribute('data-strict', '0');
        scriptElement.setAttribute('data-reactions-enabled', '1');
        scriptElement.setAttribute('data-emit-metadata', '0');
        scriptElement.setAttribute('data-input-position', 'bottom');
        scriptElement.setAttribute('data-theme', themeUrl);
        scriptElement.setAttribute('data-lang', 'ko');

        ref.current.appendChild(scriptElement);
    }, [themeUrl]);

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