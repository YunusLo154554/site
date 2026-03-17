import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LANG_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', cpp: '#00599c',
  lua: '#000080', typescript: '#3178c6', css: '#264de4', html: '#e34f26', bash: '#4eaa25',
};

export default function SearchModal({ snippets, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim().length < 1 ? [] : snippets.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.description?.toLowerCase().includes(query.toLowerCase()) ||
    s.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 8);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, results.length - 1));
      if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0));
      if (e.key === 'Enter' && results[selected]) {
        navigate(`/snippet/${results[selected].id}`);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [results, selected, navigate, onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1e2e]">
          <svg className="w-4 h-4 text-[#3f3f5a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Snippet ara..."
            className="flex-1 bg-transparent text-sm text-[#e2e2f0] placeholder-[#3f3f5a] font-mono focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#1e1e2e] text-[#3f3f5a]">ESC</kbd>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {results.map((s, i) => {
              const color = LANG_COLORS[s.language] || '#7c3aed';
              return (
                <li key={s.id}>
                  <button
                    onClick={() => { navigate(`/snippet/${s.id}`); onClose(); }}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      selected === i ? 'bg-[#7c3aed]/10' : 'hover:bg-[#111118]'
                    }`}
                  >
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0"
                      style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
                      {s.language}
                    </span>
                    <span className="text-sm text-[#e2e2f0] font-mono truncate">{s.title}</span>
                    {s.description && (
                      <span className="text-xs text-[#3f3f5a] truncate hidden sm:block">{s.description}</span>
                    )}
                    {selected === i && (
                      <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#1e1e2e] text-[#3f3f5a] shrink-0">↵</kbd>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : query.trim().length > 0 ? (
          <p className="px-4 py-6 text-center text-xs font-mono text-[#3f3f5a]">Sonuç bulunamadı</p>
        ) : (
          <p className="px-4 py-6 text-center text-xs font-mono text-[#2a2a3e]">Aramak için yazmaya başla...</p>
        )}

        <div className="px-4 py-2 border-t border-[#1e1e2e] flex items-center gap-4">
          <span className="text-[10px] font-mono text-[#2a2a3e]">↑↓ gezin</span>
          <span className="text-[10px] font-mono text-[#2a2a3e]">↵ aç</span>
          <span className="text-[10px] font-mono text-[#2a2a3e]">ESC kapat</span>
        </div>
      </div>
    </div>
  );
}
