import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CodeBlock from '../components/CodeBlock';
import { getSnippets, deleteSnippet } from '../data/snippets';
import { useAuth } from '../context/AuthContext';

const LANG_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', cpp: '#00599c',
  lua: '#000080', typescript: '#3178c6', css: '#264de4', html: '#e34f26', bash: '#4eaa25',
};

export default function SnippetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSnippets().then(all => {
      setSnippet(all.find(s => s.id === id) || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <p className="text-[#3f3f5a] font-mono text-sm animate-pulse">yükleniyor...</p>
    </div>
  );

  if (!snippet) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#3f3f5a] font-mono mb-4">snippet bulunamadı</p>
        <Link to="/" className="text-[#7c3aed] text-sm font-mono hover:underline">← geri dön</Link>
      </div>
    </div>
  );

  const canEdit = user && (user.role === 'admin' || user.username === snippet.created_by);
  const color = LANG_COLORS[snippet.language] || '#7c3aed';

  const handleDelete = async () => {
    if (confirm('Bu snippet silinsin mi?')) {
      await deleteSnippet(id);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-sm z-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
            <span className="text-white text-xs font-mono font-bold">&lt;/&gt;</span>
          </div>
          <span className="font-mono font-medium text-[#e2e2f0] tracking-tight">YunusLo1545</span>
        </Link>
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <Link
                to={`/admin?edit=${id}`}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#1e1e2e]
                  text-[#6b6b8a] hover:text-[#e2e2f0] hover:border-[#3f3f5a] transition-all duration-200"
              >
                Düzenle
              </Link>
              <button
                onClick={handleDelete}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-900/40
                  text-red-500/60 hover:text-red-400 hover:border-red-500/40 transition-all duration-200"
              >
                Sil
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
        <Link to="/" className="text-xs font-mono text-[#3f3f5a] hover:text-[#6b6b8a] transition-colors mb-8 inline-block">
          ← Geri
        </Link>
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-3">
            <h1 className="text-2xl font-semibold text-[#e2e2f0] tracking-tight flex-1">{snippet.title}</h1>
            <span className="shrink-0 mt-1 text-[10px] font-mono px-2.5 py-1 rounded-full border"
              style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
              {snippet.language}
            </span>
          </div>
          {snippet.description && (
            <p className="text-sm text-[#6b6b8a] leading-relaxed">{snippet.description}</p>
          )}
        </div>

        <CodeBlock code={snippet.code} language={snippet.language} />

        {snippet.image && (
          <div className="mt-6 rounded-xl overflow-hidden border border-[#1e1e2e]">
            <img src={snippet.image} alt={snippet.title} className="w-full object-cover max-h-80" />
          </div>
        )}

        {snippet.file_url && (
          <a href={snippet.file_url} download={snippet.file_name}
            className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg border border-[#1e1e2e] bg-[#111118]
              hover:border-[#7c3aed]/50 transition-all duration-200 group w-fit">
            <span className="text-lg">📦</span>
            <div>
              <p className="text-xs font-mono text-[#e2e2f0] group-hover:text-white transition-colors">{snippet.file_name}</p>
              <p className="text-[10px] font-mono text-[#3f3f5a]">İndir</p>
            </div>
          </a>
        )}

        {snippet.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {snippet.tags.map(tag => (
              <span key={tag} className="text-xs font-mono text-[#3f3f5a] bg-[#111118] border border-[#1e1e2e] px-2.5 py-1 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs font-mono text-[#2a2a3e] mt-8">
          {snippet.created_at}
          {snippet.created_by && <span className="ml-3 text-[#3f3f5a]">by {snippet.created_by}</span>}
        </p>
      </main>
    </div>
  );
}
