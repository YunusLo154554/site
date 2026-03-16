import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) { setError('Tüm alanları doldur.'); return; }
    setLoading(true);
    const result = mode === 'login'
      ? await login(username, password)
      : await register(username, password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center">
            <span className="text-white text-xs font-mono font-bold">&lt;/&gt;</span>
          </div>
          <span className="font-mono font-medium text-[#e2e2f0] tracking-tight text-lg">YunusLo1545</span>
        </div>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
          <div className="flex gap-1 mb-8 bg-[#0d0d14] rounded-lg p-1">
            {[['login', 'Giriş'], ['register', 'Kayıt']].map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 text-xs font-mono rounded-md transition-all duration-200 ${mode === m ? 'bg-[#7c3aed] text-white' : 'text-[#6b6b8a] hover:text-[#e2e2f0]'}`}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Kullanıcı Adı</label>
              <input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username"
                className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] font-mono placeholder-[#3f3f5a] focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"
                className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] font-mono placeholder-[#3f3f5a] focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
            </div>
            {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#7c3aed] text-white text-sm font-mono hover:bg-[#6d28d9] transition-all duration-200 disabled:opacity-50">
              {loading ? 'Bekle...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-xs font-mono text-[#3f3f5a] hover:text-[#6b6b8a] transition-colors">
            ← Ana Sayfaya Dön
          </Link>
        </p>
      </div>
    </div>
  );
}
