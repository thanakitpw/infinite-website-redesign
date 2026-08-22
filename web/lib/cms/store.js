import { unstable_cache, revalidateTag } from "next/cache";
import { publicClient } from "../supabase/public";
import { serverClient } from "../supabase/server";
import { isCmsEnabled } from "../supabase/config";

export const CONTENT_TAG = "cms-content";

const groupByFragment = (rows) => {
  const map = {};
  for (const r of rows || []) {
    (map[r.fragment] ||= {})[r.field_key] = { value: r.value, alt: r.alt, hash: r.source_hash };
  }
  return map;
};

/* ── เนื้อหาที่เผยแพร่แล้ว (เว็บหน้าบ้านใช้) ────────────────────────────────
   cache ไว้ทั้งก้อนแล้วล้างด้วย revalidateTag ตอนกดเผยแพร่ — ถ้าไม่ cache
   ทุกหน้าจะกลายเป็น dynamic แล้วเสียความเร็วที่เว็บนี้มีอยู่เดิมไปฟรีๆ */
const loadPublished = unstable_cache(
  async () => {
    const sb = publicClient();
    if (!sb) return {};
    const { data, error } = await sb
      .from("published_content")
      .select("fragment, field_key, kind, source_hash, value, alt");
    if (error) {
      // เนื้อหาต้นฉบับยังเสิร์ฟได้ ห้ามให้ CMS ล่มแล้วลากเว็บลูกค้าล่มตาม
      console.error("[cms] อ่านเนื้อหาที่เผยแพร่ไม่สำเร็จ:", error.message);
      return {};
    }
    return groupByFragment(data);
  },
  ["cms-published-content"],
  { tags: [CONTENT_TAG], revalidate: 3600 }
);

export async function publishedOverrides() {
  if (!isCmsEnabled()) return {};
  try {
    return await loadPublished();
  } catch (e) {
    console.error("[cms]", e?.message || e);
    return {};
  }
}

/* ── ร่าง (หลังบ้านและหน้าดูตัวอย่างใช้) ────────────────────────────────────
   ห้าม cache — คนกำลังพิมพ์อยู่ ต้องเห็นของล่าสุดเสมอ */
export async function draftOverrides(fragments) {
  const sb = serverClient();
  if (!sb || !fragments?.length) return {};
  const { data, error } = await sb
    .from("content_overrides")
    .select("fragment, field_key, kind, source_hash, draft_value, draft_alt, published_value, published_alt")
    .in("fragment", fragments);
  if (error) { console.error("[cms] อ่านร่างไม่สำเร็จ:", error.message); return {}; }

  const map = {};
  for (const r of data || []) {
    // ยังไม่เคยแก้เป็นร่าง → ใช้ค่าที่เผยแพร่แล้ว จะได้เห็นหน้าตาจริง
    const value = r.draft_value ?? r.published_value;
    if (value == null) continue;
    (map[r.fragment] ||= {})[r.field_key] = {
      value,
      alt: r.draft_value != null ? r.draft_alt : r.published_alt,
      hash: r.source_hash,
    };
  }
  return map;
}

/* แถวดิบของหน้าหนึ่ง สำหรับฟอร์มแก้ไข — ต้องรู้ทั้งร่างและที่เผยแพร่แล้ว
   เพื่อบอกได้ว่าช่องไหน "มีร่างค้าง" */
export async function overrideRows(fragments) {
  const sb = serverClient();
  if (!sb || !fragments?.length) return {};
  const { data, error } = await sb
    .from("content_overrides")
    .select("*")
    .in("fragment", fragments);
  if (error) { console.error("[cms] อ่าน override ไม่สำเร็จ:", error.message); return {}; }
  const map = {};
  for (const r of data || []) (map[r.fragment] ||= {})[r.field_key] = r;
  return map;
}

export function revalidateContent() {
  revalidateTag(CONTENT_TAG);
}

/* ── สรุปสถานะร่างต่อชิ้นส่วน สำหรับหน้ารายการและแดชบอร์ด ──────────────────── */
export async function fragmentStatus() {
  const sb = serverClient();
  if (!sb) return {};
  const { data, error } = await sb
    .from("content_overrides")
    .select("fragment, draft_value, published_value, updated_at");
  if (error) { console.error("[cms] อ่านสถานะไม่สำเร็จ:", error.message); return {}; }

  const map = {};
  for (const r of data || []) {
    const s = (map[r.fragment] ||= { dirty: 0, total: 0, updatedAt: null });
    s.total++;
    if (r.draft_value != null && r.draft_value !== r.published_value) s.dirty++;
    if (!s.updatedAt || r.updated_at > s.updatedAt) s.updatedAt = r.updated_at;
  }
  return map;
}

/* รายการแก้ล่าสุด สำหรับการ์ด "แก้ไขล่าสุด" บนแดชบอร์ด */
export async function recentEdits(limit = 8) {
  const sb = serverClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("content_overrides")
    .select("fragment, field_key, kind, draft_value, published_value, updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) { console.error("[cms] อ่านรายการล่าสุดไม่สำเร็จ:", error.message); return []; }
  return data || [];
}
