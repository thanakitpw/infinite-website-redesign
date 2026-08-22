-- view ที่ select จากตารางเดียวแบบตรงไปตรงมา Postgres ถือว่า "เขียนได้" โดยอัตโนมัติ
-- และ default privileges ของ schema public ใน Supabase แจก insert/update ให้ anon
-- มาตั้งแต่ตอนสร้าง view
--
-- ตอนนี้เขียนไม่เข้าอยู่แล้วเพราะติดสิทธิ์คอลัมน์กับ RLS ของตารางต้นทาง (ทดสอบด้วยการ
-- สวมบทบาท anon แล้ว insert จริง ได้ permission denied) แต่ไม่ควรเหลือสิทธิ์ที่ไม่ได้
-- ตั้งใจให้ค้างไว้ — เผลอเปลี่ยนอย่างอื่นทีหลังแล้วมันจะกลายเป็นช่องจริง
revoke all on public.published_content from anon, authenticated;
grant select on public.published_content to anon, authenticated;
