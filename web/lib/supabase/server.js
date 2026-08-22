import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isCmsEnabled } from "./config";

/* client ที่ผูกกับ session ของคนที่ล็อกอินหลังบ้าน ใช้ใน server component และ
   route handler — สิทธิ์ทั้งหมดถูกคุมด้วย RLS ฝั่ง Supabase ไม่ใช่ฝั่งนี้ */
export function serverClient() {
  if (!isCmsEnabled()) return null;
  const store = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* เรียกจาก server component ที่เขียน cookie ไม่ได้ — middleware ต่ออายุให้แล้ว */
        }
      },
    },
  });
}

/* คืนผู้ใช้หลังบ้านที่ล็อกอินอยู่ พร้อมข้อมูลจาก cms_users
   ไม่มีแถวใน cms_users = ไม่ใช่คนของระบบนี้ ถือว่าไม่ได้ล็อกอิน */
export async function currentCmsUser() {
  const sb = serverClient();
  if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("cms_users").select("*").eq("id", user.id).maybeSingle();
  if (!data) return null;
  return { ...data, email: data.email || user.email };
}
