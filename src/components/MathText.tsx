import { useEffect, useState } from 'react';

interface KatexApi {
  renderToString: (
    tex: string,
    options?: {
      displayMode?: boolean;
      throwOnError?: boolean;
      strict?: boolean;
    }
  ) => string;
}

declare global {
  interface Window {
    katex?: KatexApi;
  }
}

interface MathTextProps {
  text: string;
  className?: string;
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'inline-math'; content: string }
  | { type: 'block-math'; content: string };

function parseSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  const tokenRegex = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$|\*\*[^*]+?\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: input.slice(lastIndex, match.index),
      });
    }

    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      segments.push({
        type: 'block-math',
        content: token.slice(2, -2).trim(),
      });
    } else if (token.startsWith('$') && token.endsWith('$')) {
      segments.push({
        type: 'inline-math',
        content: token.slice(1, -1).trim(),
      });
    } else if (token.startsWith('**') && token.endsWith('**')) {
      segments.push({
        type: 'bold',
        content: token.slice(2, -2),
      });
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({
      type: 'text',
      content: input.slice(lastIndex),
    });
  }

  return segments;
}

export function MathText({ text, className = '' }: MathTextProps) {
  const [katexReady, setKatexReady] = useState<boolean>(() => typeof window !== 'undefined' && Boolean(window.katex));

  useEffect(() => {
    if (katexReady) return;
    const interval = window.setInterval(() => {
      if (window.katex) {
        setKatexReady(true);
        window.clearInterval(interval);
      }
    }, 50);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
    }, 5000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [katexReady]);

  const segments = parseSegments(text);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <span key={index}>{segment.content}</span>;
        }
        if (segment.type === 'bold') {
          return (
            <strong key={index} className="font-semibold text-slate-900">
              {segment.content}
            </strong>
          );
        }

        const isDisplay = segment.type === 'block-math';
        if (katexReady && window.katex) {
          const html = window.katex.renderToString(segment.content, {
            displayMode: isDisplay,
            throwOnError: false,
            strict: false,
          });
          return (
            <span
              key={index}
              className={isDisplay ? 'block my-2' : 'inline-block align-baseline mx-0.5'}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        return (
          <code key={index} className="font-mono text-[0.95em] text-blue-800 bg-blue-50 px-1 rounded">
            {segment.content}
          </code>
        );
      })}
    </span>
  );
}
