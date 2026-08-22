-- ═══════════════════════════════════════════════════════════════════════════
-- แก้ตามที่ Supabase advisor รายงานหลังรัน 0001
--
--   ERROR  security_definer_view — view published_content เป็น security definer
--   WARN   ฟังก์ชัน security definer ใน schema public ถูกเรียกผ่าน /rest/v1/rpc/ ได้
--
-- ทั้งสองข้อแก้ให้ "ปลอดภัยกว่าเดิมจริง" ไม่ใช่แค่ทำให้ advisor เงียบ
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. ย้าย is_cms_user() ไป schema private ────────────────────────────────
-- ยังต้องเป็น security definer เพราะ policy ของ cms_users เองก็เรียกมัน ถ้าเป็น
-- invoker จะวนซ้ำไม่รู้จบ แต่พอย้ายออกจาก public แล้วก็เรียกผ่าน REST ไม่ได้อีก
-- เพราะ private ไม่ได้ถูกเปิดให้ Data API
create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.is_cms_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.cms_users u where u.id = (select auth.uid()));
$$;

revoke all on function private.is_cms_user() from public, anon;
grant execute on function private.is_cms_user() to authenticated;

-- ── 2. ผูก policy ใหม่กับฟังก์ชันตัวใหม่ ───────────────────────────────────
-- cms_users อ่านได้เฉพาะแถวของตัวเอง — เฟสนี้ยังไม่มีหน้าจัดการผู้ใช้ จึงไม่ต้อง
-- เปิดให้ทีมงานเห็นกันเอง ให้สิทธิ์เท่าที่ใช้จริงไปก่อน
drop policy if exists cms_users_self on public.cms_users;
create policy cms_users_self on public.cms_users
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists overrides_rw on public.content_overrides;
create policy overrides_rw on public.content_overrides
  for all to authenticated using (private.is_cms_user()) with check (private.is_cms_user());

drop policy if exists revisions_rw on public.content_revisions;
create policy revisions_rw on public.content_revisions
  for all to authenticated using (private.is_cms_user()) with check (private.is_cms_user());

drop policy if exists media_rw on public.media;
create policy media_rw on public.media
  for all to authenticated using (private.is_cms_user()) with check (private.is_cms_user());

drop policy if exists media_cms_write on storage.objects;
create policy media_cms_write on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and private.is_cms_user());

drop policy if exists media_cms_delete on storage.objects;
create policy media_cms_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media' and private.is_cms_user());

drop function if exists public.is_cms_user();

-- ── 3. view เปลี่ยนเป็น security invoker ───────────────────────────────────
-- 0001 ใช้ definer เพื่อข้าม RLS ให้เว็บหน้าบ้านอ่านได้ วิธีนี้ดีกว่า:
-- ให้ anon อ่านตารางต้นทางได้ "เฉพาะคอลัมน์ที่เผยแพร่แล้ว" ด้วย column-level grant
-- และ "เฉพาะแถวที่เผยแพร่แล้ว" ด้วย RLS
-- ผลคือต่อให้ยิงตรงเข้าตารางต้นทางผ่าน REST ก็ยังเห็นแค่ของที่อยู่บนเว็บอยู่แล้ว
-- ส่วน draft_* ติด permission denied ตั้งแต่ระดับคอลัมน์
create or replace view public.published_content
with (security_invoker = true) as
  select fragment, field_key, kind, source_hash,
         published_value as value, published_alt as alt, published_at
    from public.content_overrides
   where published_value is not null;

drop policy if exists overrides_published_read on public.content_overrides;
create policy overrides_published_read on public.content_overrides
  for select to anon using (published_value is not null);

revoke all on public.content_overrides from anon;
grant select (fragment, field_key, kind, source_hash, published_value, published_alt, published_at)
  on public.content_overrides to anon;

grant select on public.published_content to anon, authenticated;
