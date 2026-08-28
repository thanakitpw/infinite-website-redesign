-- ═══════════════════════════════════════════════════════════════════════════
-- เก็บ lead จากฟอร์มขอใบเสนอราคา
--
-- เดิม /api/quote ยิงไป LEAD_WEBHOOK_URL อย่างเดียว ซึ่งไม่เคยถูกตั้งบน Vercel
-- ฟอร์มจึงตอบ 503 มาตลอดและข้อมูลลูกค้าหายทุกใบ (มีแต่ใน Vercel logs)
--
-- ตารางนี้เป็น "ที่เก็บถาวร" ส่วนอีเมลแจ้งเตือนผ่าน Resend เป็น "ตัวปลุก" —
-- แยกกันตั้งใจ ถ้าเมลล้ม lead ต้องไม่หาย และถ้า DB ล้มก็ยังได้เมล
--
-- สิทธิ์: ทำแบบเดียวกับ 0002 คือ column-level grant ให้ anon ไม่ใช่เปิดทั้งตาราง
--   anon          → insert ได้เฉพาะคอลัมน์ที่ลูกค้ากรอก · อ่านไม่ได้เลย
--   cms user      → อ่านและอัปเดตสถานะได้ทั้งหมด
-- id/created_at/emailed_at ไม่ได้ grant ให้ anon จึงปลอมค่าไม่ได้ ต้องใช้ default
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  name       text not null check (length(name) between 1 and 120),
  phone      text not null check (length(phone) between 1 and 40),
  company    text check (length(company) <= 160),
  contact    text check (length(contact) <= 120),
  job_type   text check (length(job_type) <= 80),
  area       text check (length(area) <= 40),
  hours      text check (length(hours) <= 40),
  detail     text check (length(detail) <= 2000),
  source     text not null default 'web' check (length(source) <= 40),
  -- สถานะการติดตาม ให้ทีมขายกดเปลี่ยนในหลังบ้านทีหลัง
  status     text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  note       text,
  -- ส่งเมลแจ้งทีมขายสำเร็จเมื่อไหร่ · null = ยังไม่ได้ส่งหรือส่งไม่ผ่าน
  emailed_at timestamptz,
  created_at timestamptz not null default now()
);

-- หลังบ้านเปิดมาต้องเห็นใบล่าสุดก่อนเสมอ
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status) where status = 'new';

alter table public.leads enable row level security;

-- ── ฝั่งลูกค้า (anon) ──────────────────────────────────────────────────────
-- กรอกฟอร์มได้ แต่ห้ามอ่านของคนอื่น: มี policy เฉพาะ for insert ไม่มี for select
-- ชื่อกับเบอร์ของคนอื่นเป็นข้อมูลส่วนบุคคล หลุดไม่ได้เด็ดขาด
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert to anon, authenticated with check (true);

revoke all on public.leads from anon;
grant insert (name, phone, company, contact, job_type, area, hours, detail, source)
  on public.leads to anon;

-- ── ฝั่งหลังบ้าน ───────────────────────────────────────────────────────────
drop policy if exists leads_cms_read on public.leads;
create policy leads_cms_read on public.leads
  for select to authenticated using (private.is_cms_user());

drop policy if exists leads_cms_update on public.leads;
create policy leads_cms_update on public.leads
  for update to authenticated using (private.is_cms_user()) with check (private.is_cms_user());

grant select, update on public.leads to authenticated;
