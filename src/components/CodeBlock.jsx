import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';

export default function CodeBlock({ code, language }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current) Prism.highlightElement(ref.current);
  }, [code, language]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative group">
      {/* Copy button */}
      <button
        onClick={copy}
        className={`absolute top-3 right-3 z-10 px-2.5 py-1 text-xs font-mono rounded border transition-all duration-200 ${
          copied
            ? 'bg-[#7c3aed]/20 border-[#7c3aed]/60 text-[#a78bfa]'
            : 'bg-[#1e1e2e] border-[#2a2a3e] text-[#6b6b8a] opacity-0 group-hover:opacity-100 hover:text-[#e2e2f0] hover:border-[#7c3aed]'
        }`}
      >
        {copied ? '✓ kopyalandı' : 'copy'}
      </button>

      {/* Kopyalandı overlay */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center rounded-lg pointer-events-none transition-opacity duration-300 ${
          copied ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-[#0d0d14]/90 border border-[#7c3aed]/40 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-mono text-[#a78bfa]">Kopyalandı</span>
        </div>
      </div>

      {/* Kod bloğu — tıklayınca kopyala */}
      <pre
        className={`language-${language} cursor-pointer select-text`}
        onClick={copy}
        title="Kopyalamak için tıkla"
      >
        <code ref={ref} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
