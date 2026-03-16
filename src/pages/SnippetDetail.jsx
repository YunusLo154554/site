import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CodeBlock from '../components/CodeBlock';
import { getSnippets, deleteSnippet } from '../data/snippets';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const STATIC_SNIPPETS = {
  u1: {
    id: 'u1', title: 'useLocalStorage Hook', language: 'typescript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['react', 'hook', 'storage'],
    description: 'localStorage ile senkronize React state hook',
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

// Kullanım:
const [theme, setTheme] = useLocalStorage('theme', 'dark');`,
  },
  u2: {
    id: 'u2', title: 'Debounce & Throttle', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['utility', 'performance'],
    description: 'Fonksiyon çağrısını geciktir veya sınırla',
    code: `// Debounce - son çağrıdan sonra bekler
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Throttle - belirli aralıkta bir çalışır
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

const debouncedSearch = debounce((q) => fetchResults(q), 300);
const throttledScroll = throttle(() => updateHeader(), 100);`,
  },
  u3: {
    id: 'u3', title: 'Deep Clone & Merge', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['object', 'utility'],
    description: 'Nesne derin kopyalama ve birleştirme',
    code: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}

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
}`,
  },
  u4: {
    id: 'u4', title: 'Python Timer + Retry Decorator', language: 'python', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['python', 'decorator', 'utility'],
    description: 'Süre ölçen ve otomatik yeniden deneyen decorator',
    code: `import time
from functools import wraps

def timer(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        print(f"[timer] {fn.__name__} -> {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

def retry(times=3, delay=1.0):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception:
                    if attempt == times - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

@timer
@retry(times=3, delay=0.5)
def fetch_data(url: str):
    import urllib.request, json
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read())`,
  },
  u5: {
    id: 'u5', title: 'Async Queue', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['async', 'utility', 'queue'],
    description: 'Sıralı async görev kuyruğu',
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
    if (this.running >= this.concurrency || !this.queue.length) return;
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

const queue = new AsyncQueue(2);
await Promise.all([
  queue.add(() => fetch('/api/1').then(r => r.json())),
  queue.add(() => fetch('/api/2').then(r => r.json())),
]);`,
  },
  u6: {
    id: 'u6', title: 'CSS Modern Layout', language: 'css', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['css', 'layout', 'grid'],
    description: 'Modern CSS grid ve flex layout kalıpları',
    code: `.holy-grail {
  display: grid;
  grid-template:
    "header header header" auto
    "nav    main   aside"  1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
  min-height: 100vh;
}

.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 1rem;
}

.fluid-text {
  font-size: clamp(1rem, 2.5vw, 2rem);
}

.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`,
  },
  u7: {
    id: 'u7', title: 'Fetch with Retry + Timeout', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['fetch', 'async', 'utility'],
    description: 'Otomatik yeniden deneme ve timeout ile fetch',
    code: `async function fetchWithRetry(url, options = {}, retries = 3, timeout = 5000) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (err) {
      clearTimeout(id);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 300));
    }
  }
}`,
  },
  u8: {
    id: 'u8', title: 'Event Emitter', language: 'javascript', type: 'snippet',
    pinned: false, created_by: 'sistem', created_at: '2026-03-16', tags: ['events', 'pattern', 'utility'],
    description: 'Hafif event emitter implementasyonu',
    code: `class EventEmitter {
  constructor() { this._events = {}; }

  on(event, listener) {
    (this._events[event] ??= []).push(listener);
    return () => this.off(event, listener);
  }

  once(event, listener) {
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }

  off(event, listener) {
    this._events[event] = (this._events[event] || []).filter(l => l !== listener);
  }

  emit(event, ...args) {
    (this._events[event] || []).forEach(l => l(...args));
  }
}

const bus = new EventEmitter();
const unsub = bus.on('data', (payload) => console.log(payload));
bus.emit('data', { id: 1, value: 'hello' });
unsub();`,
  },
};

const LANG_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', cpp: '#00599c',
  lua: '#000080', typescript: '#3178c6', css: '#264de4', html: '#e34f26', bash: '#4eaa25',
};

export default function SnippetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang, toggle } = useLang();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id.startsWith('u') && STATIC_SNIPPETS[id]) {
      setSnippet(STATIC_SNIPPETS[id]);
      setLoading(false);
      return;
    }
    getSnippets().then(all => {
      setSnippet(all.find(s => s.id === id) || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <p className="text-[#3f3f5a] font-mono text-sm animate-pulse">{t.loading}</p>
    </div>
  );

  if (!snippet) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#3f3f5a] font-mono mb-4">{t.notFound}</p>
        <Link to="/" className="text-[#7c3aed] text-sm font-mono hover:underline">{t.back}</Link>
      </div>
    </div>
  );

  const canEdit = user && (user.role === 'admin' || user.username === snippet.created_by);
  const color = LANG_COLORS[snippet.language] || '#7c3aed';

  const handleDelete = async () => {
    if (confirm(lang === 'tr' ? 'Bu snippet silinsin mi?' : 'Delete this snippet?')) {
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
          <span className="font-mono font-medium text-[#e2e2f0] tracking-tight">{t.siteTitle}</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggle}
            className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] transition-all">
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          {canEdit && (
            <>
              <Link to={`/admin?edit=${id}`}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] hover:border-[#3f3f5a] transition-all duration-200">
                {t.edit}
              </Link>
              <button onClick={handleDelete}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-900/40 text-red-500/60 hover:text-red-400 hover:border-red-500/40 transition-all duration-200">
                {t.delete}
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
        <Link to="/" className="text-xs font-mono text-[#3f3f5a] hover:text-[#6b6b8a] transition-colors mb-8 inline-block">
          {t.back}
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
            className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg border border-[#1e1e2e] bg-[#111118] hover:border-[#7c3aed]/50 transition-all duration-200 group w-fit">
            <span className="text-lg">📦</span>
            <div>
              <p className="text-xs font-mono text-[#e2e2f0] group-hover:text-white transition-colors">{snippet.file_name}</p>
              <p className="text-[10px] font-mono text-[#3f3f5a]">{lang === 'tr' ? 'İndir' : 'Download'}</p>
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
