-- Mevcut snippets tablosuna yeni kolonlar ekle
alter table snippets add column if not exists pinned boolean default false;
alter table snippets add column if not exists type text default 'snippet';

-- Views ve likes kolonları
alter table snippets add column if not exists views integer default 0;
alter table snippets add column if not exists likes integer default 0;

-- RPC fonksiyonları: views ve likes artırma/azaltma
create or replace function increment_views(row_id text)
returns void language sql as $$
  update snippets set views = coalesce(views, 0) + 1 where id = row_id;
$$;

create or replace function increment_likes(row_id text)
returns void language sql as $$
  update snippets set likes = coalesce(likes, 0) + 1 where id = row_id;
$$;

create or replace function decrement_likes(row_id text)
returns void language sql as $$
  update snippets set likes = greatest(coalesce(likes, 0) - 1, 0) where id = row_id;
$$;
