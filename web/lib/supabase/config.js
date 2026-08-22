/* ระบบหลังบ้านเป็นของเสริม ไม่ใช่ของที่เว็บหน้าบ้านขาดไม่ได้ — ถ้ายังไม่ได้ตั้งค่า
   Supabase เว็บต้องเสิร์ฟ HTML ต้นฉบับได้ตามปกติเหมือนก่อนมีระบบนี้ทุกประการ
   ทุกจุดที่แตะ Supabase จึงต้องเช็ค isCmsEnabled() ก่อนเสมอ */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isCmsEnabled = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
