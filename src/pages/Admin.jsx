import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getSnippets, addSnippet, updateSnippet, uploadFile, addSite, updateSite, getSites, LANGUAGES } from '../data/snippets';
import { useAuth } from '../context/AuthContext';

const ALLOWED_EXT = ['rar', 'zip', 'exe', '7z', 'tar', 'gz', 'msi', 'apk', 'dmg'];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const editSiteId = searchParams.get('editSite');

  // mode: 'snippet' veya 'site' (sadece admin site ekleyebilir)
  const [mode, setMode] = useState('snippet');

  // Site form state
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDesc, setSiteDesc] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [siteTags, setSiteTags] = useState('');
  const [siteImage, setSiteImage] = useState('');
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteError, setSiteError] = useState('');

  const handleSiteImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSiteImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    if (!siteTitle.trim()) { setSiteError('Başlık zorunlu.'); return; }
    if (!siteUrl.trim()) { setSiteError('URL zorunlu.'); return; }
    let url = siteUrl.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    setSiteSaving(true);
    try {
      if (editSiteId) {
        await updateSite(editSiteId, { title: siteTitle, description: siteDesc, url, tags: siteTags.split(',').map(t => t.trim()).filter(Boolean), image: siteImage || null });
      } else {
        await addSite({ title: siteTitle, description: siteDesc, url, tags: siteTags.split(',').map(t => t.trim()).filter(Boolean), image: siteImage || null });
      }
      navigate('/');
    } catch (err) {
      setSiteError('Hata: ' + err.message);
    } finally { setSiteSaving(false); }
  };

  const [type, setType] = useState('snippet');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    // Site düzenleme modunda mevcut veriyi yükle
    if (editSiteId) {
      setMode('site');
      getSites().then(all => {
        const s = all.find(x => String(x.id) === String(editSiteId));
        if (!s) return;
        setSiteTitle(s.title || '');
        setSiteDesc(s.description || '');
        setSiteUrl(s.url || '');
        setSiteTags(s.tags?.join(', ') || '');
        setSiteImage(s.image || '');
      });
    }
    if (editId) {
      getSnippets().then(all => {
        const s = all.find(x => x.id === editId);
        if (!s) return;
        if (s.created_by !== user.username && user.role !== 'admin') { navigate('/'); return; }
        setType(s.type || 'snippet');
        setTitle(s.title || '');
        setDescription(s.description || '');
        setLanguage(s.language || 'javascript');
        setCode(s.code || '');
        setTags(s.tags?.join(', ') || '');
        setImage(s.image || '');
        setFileUrl(s.file_url || '');
        setFileName(s.file_name || '');
      });
    }
  }, [editId, editSiteId, user, navigate]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) { setError(`Desteklenen: ${ALLOWED_EXT.join(', ')}`); return; }
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setFileUrl(result.url);
      setFileName(result.name);
      setError('');
    } catch (err) {
      setError('Dosya yüklenemedi: ' + err.message);
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Başlık zorunlu.'); return; }
    if (type === 'snippet' && !code.trim()) { setError('Kod zorunlu.'); return; }
    if (type === 'app' && !fileUrl) { setError('Dosya yüklemek zorunlu.'); return; }
    setSaving(true);
    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { title, description, language, code, tags: tagArr, image, type, file_url: fileUrl, file_name: fileName };
    try {
      if (editId) { await updateSnippet(editId, payload); navigate(`/snippet/${editId}`); }
      else { await addSnippet(payload, user?.username); navigate('/'); }
    } catch (err) {
      setError('Hata: ' + err.message);
    } finally { setSaving(false); }
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
        <Link to="/" className="text-xs font-mono text-[#6b6b8a] hover:text-[#e2e2f0] transition-colors">← İptal</Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
        <h1 className="text-xl font-semibold text-[#e2e2f0] mb-8 tracking-tight">
          {editSiteId ? 'Siteyi Düzenle' : editId ? 'Düzenle' : 'Yeni İçerik'}
        </h1>

        {/* Tür seçimi - snippet/app/site tek satırda */}
        {!editId && !editSiteId && (
          <div className="flex gap-2 mb-8">
            <button type="button" onClick={() => { setMode('snippet'); setType('snippet'); }}
              className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all duration-200 ${mode === 'snippet' && type === 'snippet' ? 'bg-[#7c3aed] border-[#7c3aed] text-white' : 'border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0]'}`}>
              Snippet
            </button>
            <button type="button"
              onClick={() => user?.role === 'admin' ? (setMode('snippet'), setType('app')) : null}
              className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all duration-200 ${mode === 'snippet' && type === 'app' ? 'bg-[#7c3aed] border-[#7c3aed] text-white' : 'border-[#1e1e2e] text-[#6b6b8a]'} ${user?.role !== 'admin' ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#e2e2f0]'}`}>
              Uygulama
            </button>
            {user?.role === 'admin' && (
              <button type="button" onClick={() => setMode('site')}
                className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all duration-200 ${mode === 'site' ? 'bg-[#7c3aed] border-[#7c3aed] text-white' : 'border-[#1e1e2e] text-[#6b6b8a] hover:text-[#e2e2f0]'}`}>
                Site
              </button>
            )}
          </div>
        )}

        {/* Site Formu */}
        {(mode === 'site' && !editId) || editSiteId ? (
          <form onSubmit={handleSiteSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Başlık *</label>
              <input value={siteTitle} onChange={e => setSiteTitle(e.target.value)} placeholder="Site adı"
                className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">URL *</label>
              <input value={siteUrl} onChange={e => setSiteUrl(e.target.value)} placeholder="https://example.com"
                className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] font-mono focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Açıklama</label>
              <input value={siteDesc} onChange={e => setSiteDesc(e.target.value)} placeholder="Kısa açıklama"
                className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Etiketler</label>
              <input value={siteTags} onChange={e => setSiteTags(e.target.value)} placeholder="tool, referans, docs (virgülle ayır)"
                className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] font-mono focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Resim (Opsiyonel)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border border-dashed border-[#1e1e2e] bg-[#0d0d14] cursor-pointer hover:border-[#7c3aed]/60 transition-colors group overflow-hidden">
                {siteImage ? (
                  <img src={siteImage} alt="Önizleme" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-mono text-[#3f3f5a] group-hover:text-[#6b6b8a] transition-colors">Tıkla veya Sürükle</span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleSiteImage} />
              </label>
              {siteImage && (
                <button type="button" onClick={() => setSiteImage('')}
                  className="mt-2 text-xs font-mono text-red-500/60 hover:text-red-400 transition-colors">
                  Resmi Kaldır
                </button>
              )}
            </div>
            {siteError && <p className="text-xs text-red-400 font-mono">{siteError}</p>}
            <button type="submit" disabled={siteSaving}
              className="w-full py-3 rounded-lg bg-[#7c3aed] text-white text-sm font-mono font-medium hover:bg-[#6d28d9] active:scale-[0.99] transition-all duration-200 disabled:opacity-50">
              {siteSaving ? 'Kaydediliyor...' : editSiteId ? 'Güncelle' : 'Site Ekle'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

          {/* Başlık */}
          <div>
            <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Başlık *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Başlık"
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Açıklama</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Kısa açıklama"
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
          </div>

          {/* SNIPPET alanları */}
          {type === 'snippet' && <>
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Dil</label>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#6b6b8a] font-mono focus:outline-none focus:border-[#7c3aed]/60 transition-colors cursor-pointer">
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Kod *</label>
              <textarea value={code} onChange={e => setCode(e.target.value)}
                placeholder="// Kodunu buraya yapıştır" rows={12} spellCheck={false}
                className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] font-mono leading-relaxed focus:outline-none focus:border-[#7c3aed]/60 transition-colors resize-y" />
            </div>
          </>}

          {/* UYGULAMA alanları */}
          {type === 'app' && (
            <div>
              <label className="block text-xs font-mono text-[#6b6b8a] mb-2">
                Dosya * ({ALLOWED_EXT.join(', ')})
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 rounded-lg border border-dashed border-[#1e1e2e] bg-[#0d0d14] cursor-pointer hover:border-[#7c3aed]/60 transition-colors group">
                {fileName ? (
                  <div className="text-center">
                    <p className="text-sm font-mono text-[#7c3aed]">✓ {fileName}</p>
                    <p className="text-[10px] font-mono text-[#3f3f5a] mt-1">Değiştirmek için tıkla</p>
                  </div>
                ) : uploading ? (
                  <span className="text-xs font-mono text-[#6b6b8a] animate-pulse">Yükleniyor...</span>
                ) : (
                  <div className="text-center">
                    <p className="text-xs font-mono text-[#3f3f5a] group-hover:text-[#6b6b8a] transition-colors">Dosya Seç</p>
                    <p className="text-[10px] font-mono text-[#2a2a3e] mt-1">{ALLOWED_EXT.map(e => `.${e}`).join(' ')}</p>
                  </div>
                )}
                <input type="file" accept={ALLOWED_EXT.map(e => `.${e}`).join(',')} className="hidden" onChange={handleFileUpload} />
              </label>
              {fileName && (
                <button type="button" onClick={() => { setFileUrl(''); setFileName(''); }}
                  className="mt-2 text-xs font-mono text-red-500/60 hover:text-red-400 transition-colors">
                  Dosyayı Kaldır
                </button>
              )}
            </div>
          )}

          {/* Etiketler */}
          <div>
            <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Etiketler</label>
            <input value={tags} onChange={e => setTags(e.target.value)}
              placeholder="utility, tool, windows (virgülle ayır)"
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-[#e2e2f0] placeholder-[#3f3f5a] font-mono focus:outline-none focus:border-[#7c3aed]/60 transition-colors" />
          </div>

          {/* Resim */}
          <div>
            <label className="block text-xs font-mono text-[#6b6b8a] mb-2">Resim (Opsiyonel)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border border-dashed border-[#1e1e2e] bg-[#0d0d14] cursor-pointer hover:border-[#7c3aed]/60 transition-colors group overflow-hidden">
              {image ? (
                <img src={image} alt="Önizleme" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-mono text-[#3f3f5a] group-hover:text-[#6b6b8a] transition-colors">Tıkla veya Sürükle</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {image && (
              <button type="button" onClick={() => setImage('')}
                className="mt-2 text-xs font-mono text-red-500/60 hover:text-red-400 transition-colors">
                Resmi Kaldır
              </button>
            )}
          </div>

          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

          <button type="submit" disabled={saving || uploading}
            className="w-full py-3 rounded-lg bg-[#7c3aed] text-white text-sm font-mono font-medium hover:bg-[#6d28d9] active:scale-[0.99] transition-all duration-200 disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : editId ? 'Kaydet' : 'Ekle'}
          </button>
          </form>
        )}
      </main>
    </div>
  );
}
