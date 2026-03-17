import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function ChatPanel() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetch = () => {
      supabase.from('messages').select('*').order('created_at', { ascending: true })
        .then(({ data }) => { setMessages(data || []); setLoading(false); });
    };
    fetch();
    const interval = setInterval(fetch, 2000);
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

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-[600px] bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {loading ? (
          <p className="text-center text-[#3f3f5a] font-mono text-sm animate-pulse pt-10">{t.loading}</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-[#3f3f5a] font-mono text-sm pt-10">{t.noMessages}</p>
        ) : (
          <>
            {messages.map((msg) => {
              const isMe = user?.username === msg.username;
              const isAdmin = msg.username === 'YunusLo1545';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${isAdmin ? 'bg-[#7c3aed]' : 'bg-[#1e1e2e]'}`}>
                    {msg.username[0].toUpperCase()}
                  </div>
                  <div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
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
                        : 'bg-[#0d0d14] border border-[#1e1e2e] text-[#e2e2f0]'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#1e1e2e] px-4 py-3">
        {user ? (
          <form onSubmit={send} className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.sendMsg}
              maxLength={500}
              className="flex-1 bg-[#0d0d14] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
            />
            <button type="submit" disabled={!input.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-mono hover:bg-[#6d28d9] transition-all duration-200 disabled:opacity-40">
              {t.send}
            </button>
          </form>
        ) : (
          <p className="text-center text-xs font-mono text-[#3f3f5a] py-1">
            {t.loginToChat}{' '}
            <Link to="/login" className="text-[#7c3aed] hover:underline">{t.loginLink}</Link>
          </p>
        )}
      </div>
    </div>
  );
}
