-- ═══════════════════════════════════════════════════════════════════════════
-- ระบบหลังบ้าน Infinite Material — เฟส 1: แก้ข้อความและรูปภาพได้ทุกหน้า
--
-- แนวคิด: ไม่แตะ HTML ใน web/app/_content/ เลย แต่เก็บ "ค่าที่ถูกแก้" เป็นราย
-- ช่อง แล้วทับกลับตอนเสิร์ฟ (ดู web/lib/cms/html.js)
--
--   fragment  = ชื่อไฟล์ใน _content เช่น "home.html" หรือ "products/thinner-2k.html"
--   field_key = กุญแจของช่องในไฟล์นั้น เช่น "3/0.1.2#t0"
--   source_hash = hash ของข้อความต้นทางตอนที่กดแก้ ใช้ตรวจว่านักพัฒนาแก้ HTML
--                 ทับทีหลังหรือยัง ถ้าไม่ตรงจะไม่ทับ (กันข้อความไปโผล่ผิดที่)
--
-- ค่าผูกกับ fragment ไม่ใช่ page เพราะ _product-head/_product-foot ใช้ร่วมกัน
-- ทั้ง 14 หน้าสินค้า แก้ทีเดียวต้องมีผลทุกหน้าที่ใช้ไฟล์นั้นจริง
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── ผู้ใช้หลังบ้าน ─────────────────────────────────────────────────────────
create table if not exists public.cms_users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  role         text not null default 'editor' check (role in ('editor', 'admin')),
  created_at   timestamptz not null default now()
);

-- ── ค่าที่ลูกค้าแก้ ────────────────────────────────────────────────────────
-- draft_* คือที่กำลังแก้ยังไม่เผยแพร่ · published_* คือที่ขึ้นเว็บจริงแล้ว
create table if not exists public.content_overrides (
  fragment        text not null,
  field_key       text not null,
  kind            text not null check (kind in ('text', 'image')),
  source_hash     text not null,
  draft_value     text,
  draft_alt       text,
  published_value text,
  published_alt   text,
  updated_at      timestamptz not null default now(),
  updated_by      uuid references auth.users(id) on delete set null,
  published_at    timestamptz,
  published_by    uuid references auth.users(id) on delete set null,
  primary key (fragment, field_key)
);

create index if not exists content_overrides_fragment_idx on public.content_overrides (fragment);
-- ใช้หาว่ามีร่างค้างกี่จุดในหน้าไหน (แถบ "ยังไม่ได้เผยแพร่ N จุด")
create index if not exists content_overrides_dirty_idx on public.content_overrides (fragment)
  where draft_value is not null and draft_value is distinct from published_value;

-- ── ประวัติการแก้ไข ────────────────────────────────────────────────────────
-- บันทึกทุกครั้งที่กดเผยแพร่ เพื่อให้ย้อนกลับได้ในเฟสถัดไป
create table if not exists public.content_revisions (
  id         bigserial primary key,
  fragment   text not null,
  field_key  text not null,
  value      text,
  alt        text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists content_revisions_field_idx
  on public.content_revisions (fragment, field_key, created_at desc);

-- ── คลังรูปภาพ ─────────────────────────────────────────────────────────────
create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  path       text not null unique,          -- path ใน storage bucket "media"
  url        text not null,
  filename   text not null,
  mime       text,
  bytes      bigint,
  width      int,
  height     int,
  alt        text,
  folder     text not null default 'ทั่วไป',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists media_created_idx on public.media (created_at desc);
create index if not exists media_folder_idx  on public.media (folder);

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS — ปิดหมดก่อน แล้วเปิดเฉพาะที่จำเป็น
-- ═══════════════════════════════════════════════════════════════════════════
alter table public.cms_users         enable row level security;
alter table public.content_overrides enable row level security;
alter table public.content_revisions enable row level security;
alter table public.media             enable row level security;

-- คนที่ถูกเพิ่มเข้า cms_users เท่านั้นถึงเข้าหลังบ้านได้
-- (สมัครเองใน Supabase Auth ไม่พอ ต้องมีแถวใน cms_users ด้วย)
create or replace function public.is_cms_user()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.cms_users u where u.id = auth.uid());
$$;

drop policy if exists cms_users_self on public.cms_users;
create policy cms_users_self on public.cms_users
  for select to authenticated using (id = auth.uid() or public.is_cms_user());

drop policy if exists overrides_rw on public.content_overrides;
create policy overrides_rw on public.content_overrides
  for all to authenticated using (public.is_cms_user()) with check (public.is_cms_user());

drop policy if exists revisions_rw on public.content_revisions;
create policy revisions_rw on public.content_revisions
  for all to authenticated using (public.is_cms_user()) with check (public.is_cms_user());

drop policy if exists media_rw on public.media;
create policy media_rw on public.media
  for all to authenticated using (public.is_cms_user()) with check (public.is_cms_user());

-- ── สิ่งที่เว็บหน้าบ้านอ่านได้ ─────────────────────────────────────────────
-- เปิดเฉพาะค่าที่ "เผยแพร่แล้ว" ผ่าน view เพื่อไม่ให้ร่างที่ยังไม่เสร็จหลุดออกไป
-- (RLS คุมได้แค่ระดับแถว จึงต้องซ่อนคอลัมน์ draft_* ด้วย view แทน)
create or replace view public.published_content
with (security_invoker = off) as
  select fragment, field_key, kind, source_hash,
         published_value as value, published_alt as alt, published_at
    from public.content_overrides
   where published_value is not null;

grant select on public.published_content to anon, authenticated;

-- ── Storage bucket สำหรับรูป ───────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select to public using (bucket_id = 'media');

drop policy if exists media_cms_write on storage.objects;
create policy media_cms_write on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_cms_user());

drop policy if exists media_cms_delete on storage.objects;
create policy media_cms_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_cms_user());
