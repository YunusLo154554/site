import { supabase } from '../lib/supabase';

export const LANGUAGES = ['javascript', 'python', 'cpp', 'lua', 'typescript', 'css', 'html', 'bash'];

// --- Sites ---
export async function getSites() {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addSite(site) {
  const { data, error } = await supabase
    .from('sites')
    .insert([{
      title: site.title,
      description: site.description || '',
      url: site.url,
      tags: site.tags || [],
      image: site.image || null,
      pinned: false,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSite(id) {
  const { error } = await supabase.from('sites').delete().eq('id', id);
  if (error) throw error;
}

export async function updateSite(id, site) {
  const { error } = await supabase.from('sites').update({
    title: site.title,
    description: site.description || '',
    url: site.url,
    tags: site.tags || [],
    image: site.image || null,
  }).eq('id', id);
  if (error) throw error;
}

export async function toggleSitePin(id, pinned) {
  const { error } = await supabase.from('sites').update({ pinned: !pinned }).eq('id', id);
  if (error) throw error;
}

export async function getSnippets() {
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function uploadFile(file) {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('files')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('files').getPublicUrl(fileName);
  return { url: urlData.publicUrl, name: file.name };
}

export async function addSnippet(snippet, username) {
  const { data, error } = await supabase
    .from('snippets')
    .insert([{
      id: Date.now().toString(),
      title: snippet.title,
      description: snippet.description || '',
      language: snippet.language,
      code: snippet.code || '',
      tags: snippet.tags || [],
      image: snippet.image || null,
      file_url: snippet.file_url || null,
      file_name: snippet.file_name || null,
      created_by: username || 'anonim',
      created_at: new Date().toISOString().split('T')[0],
      type: snippet.type || 'snippet',
      pinned: false,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSnippet(id, snippet) {
  const { error } = await supabase
    .from('snippets')
    .update({
      title: snippet.title,
      description: snippet.description || '',
      language: snippet.language,
      code: snippet.code || '',
      tags: snippet.tags || [],
      image: snippet.image || null,
      file_url: snippet.file_url || null,
      file_name: snippet.file_name || null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function togglePin(id, pinned) {
  const { error } = await supabase
    .from('snippets')
    .update({ pinned: !pinned })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteSnippet(id) {
  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
