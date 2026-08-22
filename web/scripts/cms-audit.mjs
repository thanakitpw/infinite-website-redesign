/* ตรวจว่าตัวสกัดเนื้อหาอ่านทุกหน้าออกจริงไหม และได้ช่องแก้ไขกี่ช่อง
   รันด้วย: npm run cms:audit */
import fs from "node:fs";
import path from "node:path";
import { PAGES } from "../lib/cms/pages.js";
import { extractBlocks, applyOverrides } from "../lib/cms/html.js";

const root = path.join(process.cwd(), "app", "_content");
const read = (frag) => fs.readFileSync(path.join(root, frag), "utf8");

let totalText = 0, totalImg = 0, problems = [];
const seenFrag = new Set();

for (const page of PAGES) {
  let text = 0, img = 0, blocks = 0;
  for (const frag of page.fragments) {
    let html;
    try { html = read(frag); } catch { problems.push(`${page.key}: อ่านไฟล์ ${frag} ไม่ได้`); continue; }
    const bs = extractBlocks(html);
    blocks += bs.length;
    for (const b of bs) for (const f of b.fields) (f.kind === "text" ? text++ : img++);

    // ตรวจว่า apply แล้ว HTML ไม่เพี้ยน: ทับค่าเดิมกลับเข้าไปต้องได้ผลเท่าเดิม
    if (!seenFrag.has(frag)) {
      seenFrag.add(frag);
      const ov = {};
      for (const b of bs) for (const f of b.fields) ov[f.key] = { value: f.value, hash: f.hash, alt: f.alt };
      const out = applyOverrides(html, ov);
      if (out.stale.length) problems.push(`${frag}: stale ${out.stale.length} ช่อง`);
      /* ทับค่าเดิมกลับเข้าไป ต้องได้ไฟล์เดิมเป๊ะทุก byte ถ้าไม่เป๊ะแปลว่าตัว apply
         ไปแตะอะไรที่ไม่ควรแตะ ซึ่งบนเว็บจริงคือดีไซน์เพี้ยนแบบหาสาเหตุยาก */
      if (out.html !== html) {
        let i = 0; while (i < Math.min(html.length, out.html.length) && html[i] === out.html[i]) i++;
        problems.push(`${frag}: apply แล้วไม่ตรงต้นฉบับ ที่ตำแหน่ง ${i} — ${JSON.stringify(html.slice(i - 30, i + 50))} → ${JSON.stringify(out.html.slice(i - 30, i + 50))}`);
      }
    }
  }
  totalText += text; totalImg += img;
  console.log(
    `${page.key.padEnd(38)} blocks=${String(blocks).padStart(3)}  ข้อความ=${String(text).padStart(4)}  รูป=${String(img).padStart(3)}`
  );
}

console.log(`\nรวม ${PAGES.length} หน้า · ข้อความ ${totalText} ช่อง · รูป ${totalImg} ช่อง`);
if (problems.length) { console.log("\nปัญหา:"); problems.forEach((p) => console.log("  - " + p)); process.exit(1); }
console.log("ผ่านทุกหน้า: สกัดได้ และทับค่าเดิมกลับแล้ว HTML ไม่เพี้ยน");
