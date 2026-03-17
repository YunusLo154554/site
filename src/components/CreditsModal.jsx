import { useEffect, useRef, useState } from 'react';

const YT_API_KEY = import.meta.env.VITE_YT_API_KEY;
const YT_CHANNEL_ID = import.meta.env.VITE_YT_CHANNEL_ID;

function TypeWriter({ text }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span className="font-mono text-xs text-[#6b6b8a]">
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[0.85em] bg-[#7c3aed] ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

function formatSubs(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

const YT_SUBS = import.meta.env.VITE_YT_SUBS || '0';

const SOCIALS = (subs) => [
  {
    name: 'YouTube',
    handle: '@YunusLoXploit',
    url: 'https://www.youtube.com/@YunusLoXploit',
    sub: subs !== null ? `${formatSubs(subs)} abone` : '...',
    color: '#ff0000',
    bg: 'rgba(255,0,0,0.08)',
    border: 'rgba(255,0,0,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    handle: 'yunus154524',
    url: 'https://github.com/yunus154524',
    sub: null,
    color: '#e2e2f0',
    bg: 'rgba(226,226,240,0.06)',
    border: 'rgba(226,226,240,0.12)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    name: 'Discord',
    handle: 'Sunucuya Katıl',
    url: 'https://discord.gg/6v7sjsPPvz',
    sub: null,
    color: '#5865f2',
    bg: 'rgba(88,101,242,0.08)',
    border: 'rgba(88,101,242,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
];

export default function CreditsModal({ onClose }) {
  const overlayRef = useRef(null);
  const [subs, setSubs] = useState(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (!YT_API_KEY || !YT_CHANNEL_ID) return;
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YT_CHANNEL_ID}&key=${YT_API_KEY}`
    )
      .then(r => r.json())
      .then(data => {
        const count = data?.items?.[0]?.statistics?.subscriberCount;
        if (count) setSubs(Number(count));
      })
      .catch(() => {});
  }, []);

  const socials = SOCIALS(subs);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#1e1e2e]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-[#e2e2f0] font-mono">YunusLo1545</h2>
              <p className="text-xs text-[#3f3f5a] font-mono mt-0.5">Full-stack developer · content creator</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#7c3aed] flex items-center justify-center">
              <span className="text-white text-xs font-mono font-bold">&lt;/&gt;</span>
            </div>
          </div>
          <TypeWriter text="Merhaba, ben Yunus 👨‍💻 — kod yazıyor, içerik üretiyorum." />
        </div>

        {/* Social links */}
        <div className="px-4 py-4 space-y-2">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] group"
              style={{ backgroundColor: s.bg, borderColor: s.border }}
            >
              <span style={{ color: s.color }} className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                {s.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-medium text-[#e2e2f0]">{s.name}</p>
                <p className="text-[10px] font-mono text-[#6b6b8a] truncate">{s.handle}</p>
              </div>
              {s.sub && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0"
                  style={{ color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
                  {s.sub}
                </span>
              )}
              <svg className="w-3 h-3 text-[#3f3f5a] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <button onClick={onClose}
            className="w-full py-2 rounded-xl border border-[#1e1e2e] text-xs font-mono text-[#3f3f5a] hover:text-[#e2e2f0] hover:border-[#3f3f5a] transition-all duration-200">
            kapat
          </button>
        </div>
      </div>
    </div>
  );
}
