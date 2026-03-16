import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function Chat() {
  const { user } = useAuth();
  const { t, lang, toggle } = useLang();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMessages = () => {
      supabase.from('messages').select('*').order('created_at', { ascending: true })
        .then(({ data }) => { setMessages(data || []); setLoading(false); });
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    const content = input.trim();
    setInput('');
    await supabase.from('messages').insert([{ username: user.username, content }]);
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <header className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] hover:border-[#3f3f5a] transition-all duration-200">
            {t.back}
          </Link>
          <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
            <span className="text-white text-xs font-mono font-bold">&lt;/&gt;</span>
          </div>
          <span className="font-mono font-medium text-[#e2e2f0] tracking-tight">{t.siteTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle}
            className="text-[10px] font-mono px-2 py-1 rounded border border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0] transition-all">
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          <span className="text-xs font-mono text-[#6b6b8a]">{t.generalChat}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto">
        {loading ? (
          <p className="text-center text-[#3f3f5a] font-mono text-sm animate-pulse">{t.loading}</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-[#3f3f5a] font-mono text-sm">{t.noMessages}</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMe = user?.username === msg.username;
              const isAdmin = msg.username === 'YunusLo1545';
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${isAdmin ? 'bg-[#7c3aed]' : 'bg-[#1e1e2e]'}`}>
                    {msg.username[0].toUpperCase()}
                  </div>
                  <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono ${isAdmin ? 'text-[#7c3aed]' : 'text-[#6b6b8a]'}`}>
                        {msg.username}
                        {isAdmin && <span className="ml-1 text-[9px] bg-[#7c3aed]/20 border border-[#7c3aed]/30 px-1 rounded">{t.admin}</span>}
                      </span>
                      <span className="text-[10px] font-mono text-[#2a2a3e]">{formatTime(msg.created_at)}</span>
                    </div>
                    <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#e2e2f0]'
                        : 'bg-[#111118] border border-[#1e1e2e] text-[#e2e2f0]'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-[#1e1e2e] px-4 py-4 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto">
          {user ? (
            <form onSubmit={send} className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={t.sendMsg}
                maxLength={500}
                className="flex-1 bg-[#111118] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
              />
              <button type="submit" disabled={!input.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-mono hover:bg-[#6d28d9] transition-all duration-200 disabled:opacity-40">
                {t.send}
              </button>
            </form>
          ) : (
            <p className="text-center text-xs font-mono text-[#3f3f5a]">
              {t.loginToChat} <Link to="/login" className="text-[#7c3aed] hover:underline">{t.loginLink}</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
