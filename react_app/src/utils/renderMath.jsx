/**
 * renderMath.js — Proper KaTeX math rendering for React
 * Renders all $$...$$ and $...$ formulas inside a DOM element
 * using the katex npm package directly (no CDN window globals needed).
 */
import katex from 'katex';
import 'katex/dist/katex.min.css';

const DISPLAY_REGEX = /\$\$([\s\S]+?)\$\$/g;
const INLINE_REGEX = /\$([^\n$]+?)\$/g;

/**
 * Render all math in a string → returns HTML string with KaTeX rendered spans
 */
export function renderMathInString(text) {
  if (!text) return '';

  // First pass: display math $$...$$
  let result = text.replace(DISPLAY_REGEX, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return `<span class="katex-error">${formula}</span>`;
    }
  });

  // Second pass: inline math $...$
  result = result.replace(INLINE_REGEX, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return `<span class="katex-error">${formula}</span>`;
    }
  });

  return result;
}

/**
 * Walk every text node in a DOM element and replace math delimiters
 * with rendered KaTeX HTML. Call after setting innerHTML.
 */
export function renderMathInElement(element) {
  if (!element) return;

  // Find all elements that may contain raw TeX
  const allText = element.innerHTML;
  if (!allText.includes('$$') && !allText.includes('$')) return;

  element.innerHTML = renderMathInString(allText);
}

/**
 * React hook: auto-render math in a ref after content changes
 */
import { useEffect } from 'react';

export function useMathRenderer(ref, deps = []) {
  useEffect(() => {
    if (ref?.current) {
      renderMathInElement(ref.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * MathFormula component — renders a single KaTeX formula inline or display
 */
export function MathFormula({ formula, display = false, className = '' }) {
  try {
    const html = katex.renderToString(formula, {
      displayMode: display,
      throwOnError: false,
      output: 'html',
    });
    return (
      <span
        className={`katex-formula ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span className={`katex-error font-mono text-red-400 ${className}`}>{formula}</span>;
  }
}

/**
 * MathBlock component — renders a display-mode formula in a styled box
 */
export function MathBlock({ formula, className = '' }) {
  return (
    <div
      className={`math-display-block ${className}`}
      style={{
        background: 'rgba(0,0,0,0.4)',
        borderLeft: '3px solid #00f0ff',
        borderRadius: '8px',
        padding: '1rem 1.5rem',
        margin: '1.25rem 0',
        overflowX: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      <MathFormula formula={formula} display={true} />
    </div>
  );
}
