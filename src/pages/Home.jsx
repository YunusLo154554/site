import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SnippetCard from '../components/SnippetCard';
import { getSnippets, getSites, toggleSitePin, deleteSite, LANGUAGES } from '../data/snippets';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'snippet', label: 'Snippets' },
  { id: 'app', label: 'Uygulamalar' },
  { id: 'sites', label: 'Siteler' },
];

const USEFUL_SNIPPETS = [
  {
    id: 'u1', title: 'useLocalStorage Hook', description: 'localStorage ile senkronize React state hook',
    language: 'typescript', type: 'snippet', pinned: false, created_by: 'sistem', created_at: '2026-03-16',
    tags: ['react', 'hook', 'storage'],
    code: 'function useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = useState<T>(() => {\n    try { return JSON.parse(localStorage.getItem(key) || "") ?? initial; }\n    catch { return initial; }\n  });\n  const set = (v: T) => { setValue(v); localStorage.setItem(key, JSON.stringify(v)); };\n  return [value, set] as const;\n}',
  },
  {
    id: 'u2', title: 'Throttle', description: 'Fonksiyon çağrısını belirli aralıklarla sınırla',
    language: 'javascript', type: 'snippet', pinned: false, created_by: 'sistem', created_at: '2026-03-16',
    tags: ['utility', 'performance'],
    code: 'function throttle(fn, limit) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= limit) {\n      last = now;\n      fn(...args);\n    }\n  };\n}',
  },
  {
    id: 'u3', title: 'Flatten Array', description: 'İç içe diziyi düzleştir',
    language: 'javascript', type: 'snippet', pinned: false, created_by: 'sistem', created_at: '2026-03-16',
    tags: ['array', 'utility'],
    code: 'const flatten = (arr, depth = Infinity) => arr.flat(depth);\n\nfunction flattenDeep(arr) {\n  return arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []\n  );\n}',
  },
  {
    id: 'u4', title: 'Python Decorator', description: 'Fonksiyon çalışma süresini ölçen decorator',
    language: 'python', type: 'snippet', pinned: false, created_by: 'sistem', created_at: '2026-03-16',
    tags: ['python', 'decorator', 'utility'],
    code: 'import time\nfrom functools import wraps\n\ndef timer(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = fn(*args, **kwargs)\n        end = time.perf_counter()\n        print(f"{fn.__name__} took {end - start:.4f}s")\n        return result\n    return wrapper',
  },
  {
    id: 'u5', title: 'CSS Truncate Text', description: 'Tek satır ve çok satır metin kırpma',
    language: 'css', type: 'snippet', pinned: false, created_by: 'sistem', created_at: '2026-03-16',
    tags: ['css', 'typography'],
    code: '.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.line-clamp-3 {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}',
  },
];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [allSnippets, setAllSnippets] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [activeTab, setActiveTab] = useState('snippet');

  const loadSnippets = () =>
    getSnippets()
      .then(data => setAllSnippets([...USEFUL_SNIPPETS, ...data]))
      .catch(() => setAllSnippets(USEFUL_SNIPPETS));

  const loadSites = () => getSites().then(setSites).catch(() => {});

  useEffect(() => {
    Promise.all([loadSnippets(), loadSites()]).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return allSnippets.filter(s => {
      if (s.type !== activeTab) return false;
      const matchSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase()) ||
        s.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchLang = filterLang === 'all' || s.language === filterLang;
      return matchSearch && matchLang;
    });
  }, [allSnippets, search, filterLang, activeTab]);

  const pinned = filtered.filter(s => s.pinned);
  const unpinned = filtered.filter(s => !s.pinned);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
            <span className="text-white text-xs font-mono font-bold">&lt;/&gt;</span>
          </div>
          <span className="font-mono font-medium text-[#e2e2f0] tracking-tight">YunusLo1545</span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-xs font-mono text-[#6b6b8a]">{user.username}</span>
              {user.role === 'admin' && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30">Admin</span>
              )}
              <Link to="/chat" className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] transition-all duration-200">
                Sohbet
              </Link>
              <Link to="/admin" className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#7c3aed]/40 text-[#7c3aed] hover:bg-[#7c3aed]/10 transition-all duration-200">
                + Ekle
              </Link>
              <button onClick={logout} className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] transition-all duration-200">
                Çıkış
              </button>
            </>
          ) : (
            <Link to="/login" className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#7c3aed]/40 text-[#7c3aed] hover:bg-[#7c3aed]/10 transition-all duration-200">
              Giriş/Kayıt ol
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#e2e2f0] mb-1 tracking-tight">Kod Arşivim</h1>
          <p className="text-[#6b6b8a] text-sm">{allSnippets.length} içerik · Kişisel referans koleksiyonu</p>
        </div>

        <div className="flex gap-1 mb-6 bg-[#111118] border border-[#1e1e2e] rounded-xl p-1 w-fit">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 text-xs font-mono rounded-lg transition-all duration-200 ${
                activeTab === tab.id ? 'bg-[#7c3aed] text-white' : 'text-[#6b6b8a] hover:text-[#e2e2f0]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'sites' && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input type="text" placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] font-mono focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
            <select value={filterLang} onChange={e => setFilterLang(e.target.value)}
              className="bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#6b6b8a] font-mono focus:outline-none focus:border-[#7c3aed]/60 transition-colors cursor-pointer">
              <option value="all">Tüm Diller</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}

        {activeTab === 'sites' && (
          loading ? (
            <div className="text-center py-20 text-[#3f3f5a] font-mono text-sm animate-pulse">Yükleniyor...</div>
          ) : sites.length === 0 ? (
            <div className="text-center py-20 text-[#3f3f5a] font-mono text-sm">Henüz site eklenmemiş.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...sites.filter(s => s.pinned), ...sites.filter(s => !s.pinned)].map(site => (
                <div key={site.id} className="group bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden hover:border-[#7c3aed]/40 transition-all duration-200 flex flex-col">
                  {site.image && (
                    <div className="h-36 overflow-hidden">
                      <img src={site.image} alt={site.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {site.pinned && <span className="text-[10px] text-[#7c3aed]">📌</span>}
                          <h3 className="text-sm font-mono font-medium text-[#e2e2f0] truncate">{site.title}</h3>
                        </div>
                        {site.description && (
                          <p className="text-xs text-[#6b6b8a] leading-relaxed line-clamp-2">{site.description}</p>
                        )}
                      </div>
                      {user?.role === 'admin' && (
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => navigate(`/admin?editSite=${site.id}`)}
                            className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] hover:border-[#3f3f5a] transition-all">
                            Düzenle
                          </button>
                          <button
                            onClick={async () => { await toggleSitePin(site.id, site.pinned); loadSites(); }}
                            className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#7c3aed] hover:border-[#7c3aed]/40 transition-all">
                            {site.pinned ? 'Sabiti Kaldır' : 'Sabitle'}
                          </button>
                          <button
                            onClick={async () => { await deleteSite(site.id); loadSites(); }}
                            className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-red-400 hover:border-red-500/30 transition-all">
                            Sil
                          </button>
                        </div>
                      )}
                    </div>
                    {site.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {site.tags.map(t => (
                          <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1e2e] text-[#3f3f5a]">{t}</span>
                        ))}
                      </div>
                    )}
                    <a href={site.url} target="_blank" rel="noopener noreferrer"
                      className="mt-auto flex items-center gap-2 text-xs font-mono text-[#7c3aed] hover:text-[#a78bfa] transition-colors group/link">
                      <span className="truncate">{site.url}</span>
                      <span className="shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity">↗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab !== 'sites' && (
          loading ? (
            <div className="text-center py-20 text-[#3f3f5a] font-mono text-sm animate-pulse">Yükleniyor...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[#3f3f5a] font-mono text-sm">İçerik bulunamadı</div>
          ) : (
            <>
              {pinned.length > 0 && (
                <div className="mb-8">
                  <p className="text-[10px] font-mono text-[#3f3f5a] mb-3 uppercase tracking-widest">📌 sabitlenmiş</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pinned.map(s => (
                      <SnippetCard key={s.id} snippet={s} user={user} onPin={() => getSnippets().then(data => setAllSnippets([...USEFUL_SNIPPETS, ...data]))} />
                    ))}
                  </div>
                </div>
              )}
              {unpinned.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {unpinned.map(s => (
                    <SnippetCard key={s.id} snippet={s} user={user} onPin={() => getSnippets().then(data => setAllSnippets([...USEFUL_SNIPPETS, ...data]))} />
                  ))}
                </div>
              )}
            </>
          )
        )}
      </main>
    </div>
  );
}
