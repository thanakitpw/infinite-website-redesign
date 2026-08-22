import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isCmsEnabled } from "./config";

/* client สำหรับ "อ่านเนื้อหาที่เผยแพร่แล้ว" ของเว็บหน้าบ้าน — ไม่มี session
   ไม่มี cookie จึง cache ได้ และเห็นได้แค่ view published_content เท่านั้น
   ร่างที่ยังไม่เผยแพร่ไม่มีทางหลุดออกทางนี้ */
let cached = null;

export function publicClient() {
  if (!isCmsEnabled()) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
