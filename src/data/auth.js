import { supabase } from '../lib/supabase';

export const ADMIN_USERNAME = 'YunusLo1545';
export const ADMIN_PASSWORD = 'Ye!12Emre';

const USER_KEY = 'codeshare_user';

export async function login(username, password) {
  // Admin kontrolü
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const user = { username, role: 'admin' };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user };
  }
  // Normal kullanıcı
  const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .eq('password', password)
    .single();
  if (error || !data) return { error: 'Kullanıcı adı veya şifre hatalı.' };
  const user = { username: data.username, role: 'user' };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { user };
}

export async function register(username, password) {
  if (username === ADMIN_USERNAME) return { error: 'Bu kullanıcı adı alınmış.' };
  const { data: existing } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single();
  if (existing) return { error: 'Bu kullanıcı adı zaten alınmış.' };
  const { error } = await supabase.from('users').insert([{ username, password }]);
  if (error) return { error: 'Kayıt başarısız.' };
  const user = { username, role: 'user' };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { user };
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}
