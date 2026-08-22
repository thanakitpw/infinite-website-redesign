import { PAGES } from "./pages";
import { readFragment } from "./render";
import { extractBlocks } from "./html";

/* ไฟล์เนื้อหาเป็นของนิ่งใน repo เปลี่ยนได้ก็ต่อเมื่อ deploy ใหม่ จึงนับครั้งเดียว
   แล้วจำไว้ทั้งอายุของ process — ไม่งั้นแดชบอร์ดต้อง parse 35 หน้าใหม่ทุกครั้ง */
let memo = null;

export function contentStats() {
  if (memo) return memo;

  const perFragment = new Map();
  let text = 0, image = 0, blocks = 0;

  for (const page of PAGES) {
    for (const frag of page.fragments) {
      if (perFragment.has(frag)) continue;
      let bs;
      try { bs = extractBlocks(readFragment(frag)); } catch { continue; }
      let t = 0, i = 0;
      for (const b of bs) for (const f of b.fields) (f.kind === "text" ? t++ : i++);
      perFragment.set(frag, { blocks: bs.length, text: t, image: i });
      blocks += bs.length; text += t; image += i;
    }
  }

  memo = { pages: PAGES.length, fragments: perFragment.size, blocks, text, image, perFragment };
  return memo;
}
