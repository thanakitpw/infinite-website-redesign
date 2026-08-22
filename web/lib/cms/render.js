import fs from "node:fs";
import path from "node:path";
import { applyOverrides, markBlocks } from "./html";
import { publishedOverrides, draftOverrides } from "./store";
import { pageByKey } from "./pages";

const CONTENT_DIR = path.join(process.cwd(), "app", "_content");

export const readFragment = (frag) => fs.readFileSync(path.join(CONTENT_DIR, frag), "utf8");

/* ต่อชิ้นส่วนของหน้าหนึ่งเข้าด้วยกัน โดยทับค่าที่ลูกค้าแก้ทีละชิ้น
   ต้องทับ *ก่อน* ต่อสตริง ไม่ใช่หลัง เพราะเลขบล็อกในกุญแจนับจากรากของแต่ละ
   ชิ้นส่วน ถ้าต่อก่อนแล้วค่อยทับ เลขจะเลื่อนทันทีที่หน้ามีมากกว่าหนึ่งชิ้น */
async function composeFragments(fragments, overridesByFragment) {
  return fragments
    .map((frag) => {
      const html = readFragment(frag);
      const ov = overridesByFragment[frag];
      if (!ov) return html;
      return applyOverrides(html, ov).html;
    })
    .join("");
}

/* เว็บหน้าบ้าน — เห็นเฉพาะที่เผยแพร่แล้ว */
export async function renderFragments(fragments) {
  const all = await publishedOverrides();
  return composeFragments(fragments, all);
}

/* หน้าดูตัวอย่างในหลังบ้าน — เห็นร่างด้วย */
export async function renderDraftFragments(fragments) {
  const all = await draftOverrides(fragments);
  return composeFragments(fragments, all);
}

export async function renderPage(pageKey, { draft = false } = {}) {
  const page = pageByKey(pageKey);
  if (!page) return null;
  return draft ? renderDraftFragments(page.fragments) : renderFragments(page.fragments);
}

export function hasFragment(frag) {
  try {
    return fs.statSync(path.join(CONTENT_DIR, frag)).isFile();
  } catch {
    return false;
  }
}

/* ── สำหรับหน้าดูตัวอย่างในหลังบ้านเท่านั้น ─────────────────────────────────
   เห็นร่าง + ติดป้าย data-cms-block ให้คลิกเลือกบล็อกจากตัวอย่างได้
   ห้ามเรียกจากหน้าเว็บจริง */
export async function renderPreview(pageKey) {
  const page = pageByKey(pageKey);
  if (!page) return null;
  const all = await draftOverrides(page.fragments);
  return page.fragments
    .map((frag) => {
      const src = readFragment(frag);
      const ov = all[frag];
      const html = ov ? applyOverrides(src, ov).html : src;
      return markBlocks(html, frag);
    })
    .join("");
}
