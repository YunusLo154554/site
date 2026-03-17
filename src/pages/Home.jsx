import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SnippetCard from '../components/SnippetCard';
import CreditsModal from '../components/CreditsModal';
import SearchModal from '../components/SearchModal';
import ChatPanel from '../components/ChatPanel';
import { getSnippets, getSites, toggleSitePin, deleteSite, LANGUAGES } from '../data/snippets';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const USEFUL_SNIPPETS = [
  {
    id: 'u1', title: 'useLocalStorage Hook', language: 'typescript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['react', 'hook', 'storage'],
    description: 'localStorage ile senkronize React state hook / React state hook synced with localStorage',
    code: `import { useState } from 'react';

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });

  const set = (v: T) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  };

  const remove = () => {
    setValue(initial);
    localStorage.removeItem(key);
  };

  return [value, set, remove] as const;
}

// Kullanım / Usage:
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark');`,
  },
  {
    id: 'u2', title: 'Debounce & Throttle', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['utility', 'performance'],
    description: 'Fonksiyon çağrısını geciktir veya sınırla / Delay or limit function calls',
    code: `// Debounce - son çağrıdan sonra bekler / waits after last call
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Throttle - belirli aralıkta bir çalışır / runs at most once per interval
function throttle(fn, limit) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}

// Kullanım / Usage:
const debouncedSearch = debounce((q) => fetchResults(q), 300);
const throttledScroll = throttle(() => updateHeader(), 100);`,
  },
  {
    id: 'u3', title: 'Deep Clone & Merge', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['object', 'utility'],
    description: 'Nesne derin kopyalama ve birleştirme / Deep clone and merge objects',
    code: `// Deep clone
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}

// Deep merge
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Kullanım / Usage:
const clone = deepClone({ a: 1, b: { c: 2 } });
const merged = deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 });`,
  },
  {
    id: 'u4', title: 'Python Timer Decorator', language: 'python', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['python', 'decorator', 'utility'],
    description: 'Fonksiyon çalışma süresini ölçen decorator / Decorator that measures execution time',
    code: `import time
from functools import wraps
from typing import Callable, Any

def timer(fn: Callable) -> Callable:
    @wraps(fn)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"[timer] {fn.__name__} → {elapsed:.4f}s")
        return result
    return wrapper

def retry(times: int = 3, delay: float = 1.0):
    def decorator(fn: Callable) -> Callable:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    if attempt == times - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

@timer
@retry(times=3, delay=0.5)
def fetch_data(url: str) -> dict:
    import urllib.request, json
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read())`,
  },
  {
    id: 'u5', title: 'Async Queue', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['async', 'utility', 'queue'],
    description: 'Sıralı async görev kuyruğu / Sequential async task queue',
    code: `class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  async run() {
    if (this.running >= this.concurrency || this.queue.length === 0) return;
    this.running++;
    const { task, resolve, reject } = this.queue.shift();
    try {
      resolve(await task());
    } catch (err) {
      reject(err);
    } finally {
      this.running--;
      this.run();
    }
  }
}

// Kullanım / Usage:
const queue = new AsyncQueue(2); // 2 concurrent tasks
const results = await Promise.all([
  queue.add(() => fetch('/api/1').then(r => r.json())),
  queue.add(() => fetch('/api/2').then(r => r.json())),
  queue.add(() => fetch('/api/3').then(r => r.json())),
]);`,
  },
  {
    id: 'u6', title: 'CSS Modern Layout', language: 'css', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['css', 'layout', 'grid'],
    description: 'Modern CSS grid ve flex layout kalıpları / Modern CSS grid and flex layout patterns',
    code: `/* Holy Grail Layout */
.holy-grail {
  display: grid;
  grid-template:
    "header header header" auto
    "nav    main   aside" 1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
  min-height: 100vh;
}

/* Auto-fill responsive grid */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 1rem;
}

/* Centered content */
.center {
  display: grid;
  place-items: center;
}

/* Fluid typography */
.fluid-text {
  font-size: clamp(1rem, 2.5vw, 2rem);
}

/* Truncate multiline */
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`,
  },
  {
    id: 'u7', title: 'Fetch with Retry', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['fetch', 'async', 'utility'],
    description: 'Otomatik yeniden deneme ve timeout ile fetch / Fetch with auto-retry and timeout',
    code: `async function fetchWithRetry(url, options = {}, retries = 3, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 300)); // exponential backoff
    }
  }
}

// Kullanım / Usage:
const data = await fetchWithRetry('https://api.example.com/data', {
  headers: { 'Authorization': 'Bearer TOKEN' }
}, 3, 8000);`,
  },
  {
    id: 'u8', title: 'Event Emitter', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['events', 'pattern', 'utility'],
    description: 'Hafif event emitter implementasyonu / Lightweight event emitter implementation',
    code: `class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, listener) {
    (this._events[event] ??= []).push(listener);
    return () => this.off(event, listener); // returns unsubscribe fn
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, listener) {
    this._events[event] = (this._events[event] || []).filter(l => l !== listener);
  }

  emit(event, ...args) {
    (this._events[event] || []).forEach(l => l(...args));
  }
}

// Kullanım / Usage:
const bus = new EventEmitter();
const unsub = bus.on('data', (payload) => console.log(payload));
bus.emit('data', { id: 1, value: 'hello' });
unsub(); // unsubscribe`,
  },
];

export default function Home() {
  const { user, logout } = useAuth();
  const { t, lang, toggle } = useLang();
  const navigate = useNavigate();
  const [allSnippets, setAllSnippets] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [activeTab, setActiveTab] = useState('snippet');
  const [showCredits, setShowCredits] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Ctrl+K kısayolu
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const TABS = [
    { id: 'snippet', label: t.snippets },
    { id: 'app', label: t.apps },
    { id: 'sites', label: t.sites },
    { id: 'chat', label: t.chat },
  ];

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
        s.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchLang = filterLang === 'all' || s.language === filterLang;
      return matchSearch && matchLang;
    });
  }, [allSnippets, search, filterLang, activeTab]);

  const pinned = filtered.filter(s => s.pinned);
  const unpinned = filtered.filter(s => !s.pinned);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {showCredits && <CreditsModal onClose={() => setShowCredits(false)} />}
      {showSearch && <SearchModal snippets={allSnippets} onClose={() => setShowSearch(false)} />}
      <header className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
            <span className="text-white text-xs font-mono font-bold">&lt;/&gt;</span>
          </div>
          <span className="font-mono font-medium text-[#e2e2f0] tracking-tight">YunusLo1545</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] transition-all">
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          <button onClick={() => setShowCredits(true)}
            className="text-[10px] font-mono px-3 py-1.5 rounded-lg border border-[#7c3aed]/40 text-[#7c3aed] hover:bg-[#7c3aed]/10 hover:border-[#7c3aed]/70 transition-all duration-200">
            ✦ Credits
          </button>{user ? (
            <>
              <span className="text-xs font-mono text-[#6b6b8a]">{user.username}</span>
              {user.role === 'admin' && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30">{t.admin}</span>
              )}
              <Link to="/admin" className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-all duration-200 hidden">
                {t.add}
              </Link>
              <button onClick={logout} className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] transition-all duration-200">
                {t.logout}
              </button>
            </>
          ) : (
            <Link to="/login" className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#7c3aed]/40 text-[#7c3aed] hover:bg-[#7c3aed]/10 transition-all duration-200">
              {t.login}
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#e2e2f0] mb-1 tracking-tight">{t.codeArchive}</h1>
          <p className="text-[#6b6b8a] text-sm">{allSnippets.length} {t.archiveDesc}</p>
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
          {user && (
            <Link to="/admin" className="px-5 py-2 text-xs font-mono rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-all duration-200">
              {t.add}
            </Link>
          )}
        </div>

        {activeTab !== 'sites' && activeTab !== 'chat' && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] font-mono focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
            <select value={filterLang} onChange={e => setFilterLang(e.target.value)}
              className="bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#6b6b8a] font-mono focus:outline-none focus:border-[#7c3aed]/60 transition-colors cursor-pointer">
              <option value="all">{t.allLangs}</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}

        {activeTab === 'sites' && (
          loading ? (
            <div className="text-center py-20 text-[#3f3f5a] font-mono text-sm animate-pulse">{t.loading}</div>
          ) : sites.length === 0 ? (
            <div className="text-center py-20 text-[#3f3f5a] font-mono text-sm">{t.noSites}</div>
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
                          <button onClick={() => navigate(`/admin?editSite=${site.id}`)}
                            className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] hover:border-[#3f3f5a] transition-all">
                            {t.edit}
                          </button>
                          <button onClick={async () => { await toggleSitePin(site.id, site.pinned); loadSites(); }}
                            className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#7c3aed] hover:border-[#7c3aed]/40 transition-all">
                            {site.pinned ? t.unpin : t.pin}
                          </button>
                          <button onClick={async () => { await deleteSite(site.id); loadSites(); }}
                            className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-red-400 hover:border-red-500/30 transition-all">
                            {t.delete}
                          </button>
                        </div>
                      )}
                    </div>
                    {site.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {site.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1e2e] text-[#3f3f5a]">{tag}</span>
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

        {activeTab === 'chat' && <ChatPanel />}

        {activeTab !== 'sites' && activeTab !== 'chat' && (
          loading ? (
            <div className="text-center py-20 text-[#3f3f5a] font-mono text-sm animate-pulse">{t.loading}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[#3f3f5a] font-mono text-sm">{t.notFound}</div>
          ) : (
            <>
              {pinned.length > 0 && (
                <div className="mb-8">
                  <p className="text-[10px] font-mono text-[#3f3f5a] mb-3 uppercase tracking-widest">📌 {t.pinned}</p>
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
