import { Link } from 'react-router-dom';
import { togglePin } from '../data/snippets';

const LANG_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', cpp: '#00599c',
  lua: '#000080', typescript: '#3178c6', css: '#264de4', html: '#e34f26', bash: '#4eaa25',
};

export default function SnippetCard({ snippet, user, onPin }) {
  const color = LANG_COLORS[snippet.language] || '#7c3aed';
  const isAdmin = user?.role === 'admin';

  const handlePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Statik (USEFUL_SNIPPETS) kartlar için id 'u' ile başlar, pinlenemez
    if (snippet.id.startsWith('u')) return;
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

      {/* Pin button - sadece admin görür */}
      {isAdmin && !snippet.id.startsWith('u') && (
        <button onClick={handlePin}
          className={`absolute top-3 right-3 text-sm transition-all duration-200 z-10 ${
            snippet.pinned ? 'opacity-100 text-[#7c3aed]' : 'opacity-0 group-hover:opacity-100 text-[#3f3f5a] hover:text-[#7c3aed]'
          }`}
          title={snippet.pinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}>
          📌
        </button>
      )}

      {snippet.pinned && (
        <span className="absolute top-3 right-3 text-xs font-mono text-[#7c3aed]">📌</span>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-medium text-[#e2e2f0] group-hover:text-white transition-colors leading-tight">
          {snippet.title}
        </h3>
        <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
          {snippet.language}
        </span>
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
        <span className="text-[11px] text-[#3f3f5a] font-mono">{snippet.created_at}</span>
      </div>
    </Link>
  );
}
