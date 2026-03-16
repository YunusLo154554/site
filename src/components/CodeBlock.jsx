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
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute top-3 right-3 z-10 px-2.5 py-1 text-xs font-mono rounded
          bg-[#1e1e2e] border border-[#2a2a3e] text-[#6b6b8a]
          hover:text-[#e2e2f0] hover:border-[#7c3aed] transition-all duration-200
          opacity-0 group-hover:opacity-100"
      >
        {copied ? 'copied!' : 'copy'}
      </button>
      <pre className={`language-${language}`}>
        <code ref={ref} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
