import { Link } from 'react-router-dom';
import { togglePin } from '../data/snippets';

const LANG_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', cpp: '#00599c',
  lua: '#000080', typescript: '#3178c6', css: '#264de4', html: '#e34f26', bash: '#4eaa25',
};

// Devicon CDN map
const DEVICONS = {
  javascript: 'devicon-javascript-plain colored',
  typescript: 'devicon-typescript-plain colored',
  python: 'devicon-python-plain colored',
  css: 'devicon-css3-plain colored',
  html: 'devicon-html5-plain colored',
  bash: 'devicon-bash-plain',
  cpp: 'devicon-cplusplus-plain colored',
  lua: 'devicon-lua-plain colored',
};

export default function SnippetCard({ snippet, user, onPin }) {
  const color = LANG_COLORS[snippet.language] || '#7c3aed';
  const isAdmin = user?.role === 'admin';
  const isStatic = snippet.id.startsWith('u');
  const deviconClass = DEVICONS[snippet.language];

  const handlePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isStatic) return;
    await togglePin(snippet.id, snippet.pinned);
    onPin?.();
  };

  return (
    <Link to={`/snippet/${snippet.id}`}
      className="block group p-5 rounded-xl border border-[#1e1e2e] bg-[#111118]
        hover:border-[#7c3aed]/50 hover:bg-[#13131c] transition-all duration-300 animate-slide-up relative">

      {snippet.image && (
        <div className="mb-4 -mx-5 -mt-5 overflow-hidden rounded-t-xl h-36">
          <img src={snippet.image} alt={snippet.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}

      {/* Pin button - sadece admin */}
      {isAdmin && !isStatic && (
        <button onClick={handlePin}
          className={`absolute top-3 right-3 text-sm transition-all duration-200 z-10 ${
            snippet.pinned ? 'opacity-100 text-[#7c3aed]' : 'opacity-0 group-hover:opacity-100 text-[#3f3f5a] hover:text-[#7c3aed]'
          }`}>
          📌
        </button>
      )}
      {snippet.pinned && isStatic && (
        <span className="absolute top-3 right-3 text-xs font-mono text-[#7c3aed]">📌</span>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-medium text-[#e2e2f0] group-hover:text-white transition-colors leading-tight">
          {snippet.title}
        </h3>
        {/* Dil ikonu + badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {deviconClass && (
            <i className={`${deviconClass} text-base`} />
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
            {snippet.language}
          </span>
        </div>
      </div>

      {snippet.description && (
        <p className="text-sm text-[#6b6b8a] mb-4 leading-relaxed line-clamp-2">{snippet.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-mono text-[#3f3f5a] bg-[#0d0d14] px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {!isStatic && snippet.views > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-[#2a2a3e]">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {snippet.views}
            </span>
          )}
          {!isStatic && snippet.likes > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-pink-500/50">
              ♥ {snippet.likes}
            </span>
          )}
          <span className="text-[11px] text-[#3f3f5a] font-mono">{snippet.created_at}</span>
        </div>
      </div>
    </Link>
  );
}
