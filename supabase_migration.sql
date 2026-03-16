-- Mevcut snippets tablosuna yeni kolonlar ekle
alter table snippets add column if not exists pinned boolean default false;
alter table snippets add column if not exists type text default 'snippet';
