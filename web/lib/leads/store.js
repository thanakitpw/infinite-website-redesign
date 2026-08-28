import { serverClient } from "../supabase/server";
import { isCmsEnabled } from "../supabase/config";

/* อ่านใบขอราคาสำหรับหลังบ้าน

   ใช้ serverClient() ที่ผูกกับ session ของคนล็อกอิน ไม่ใช่ publicClient() —
   RLS ของตาราง leads เปิด select ให้เฉพาะคนที่มีแถวใน cms_users เท่านั้น
   (migration 0004) ถ้าเผลอใช้ anon key จะได้ permission denied ซึ่งถูกแล้ว
   เพราะชื่อกับเบอร์ลูกค้าเป็นข้อมูลส่วนบุคคล */

// ยังไม่ทำ pagination — ลูกค้ารายนี้ได้ lead หลักสิบต่อเดือน ดึงทีเดียวจบ
// อ่านง่ายกว่าและกรอง/ค้นหาในเบราว์เซอร์ได้ทันทีโดยไม่ต้องยิงกลับมา
const LIMIT = 500;

export async function listLeads() {
  if (!isCmsEnabled()) return [];
  const sb = serverClient();
  if (!sb) return [];

  const { data, error } = await sb
    .from("leads")
    .select("id, name, phone, company, contact, job_type, area, hours, detail, source, status, note, created_at")
    .order("created_at", { ascending: false })
    .limit(LIMIT);

  if (error) {
    // หน้าอื่นของหลังบ้านต้องใช้ได้ต่อ ไม่ใช่ทั้งแดชบอร์ดล่มเพราะตารางเดียว
    console.error("[leads] อ่านรายการไม่สำเร็จ:", error.message);
    return [];
  }
  return data || [];
}

/* จำนวนใบที่ยังไม่ได้แตะ — แดชบอร์ดกับเมนูข้างเอาไปขึ้นตัวเลขเตือน */
export async function newLeadCount() {
  if (!isCmsEnabled()) return 0;
  const sb = serverClient();
  if (!sb) return 0;

  const { count, error } = await sb
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) {
    console.error("[leads] นับใบใหม่ไม่สำเร็จ:", error.message);
    return 0;
  }
  return count || 0;
}
