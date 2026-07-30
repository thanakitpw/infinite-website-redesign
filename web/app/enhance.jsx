"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LINE_MAIN = "https://lin.ee/N3VgCj5";
const LINE = { imat999: "https://line.me/ti/p/~imat999", blue999: "https://line.me/ti/p/~blue999" };
const FB = "https://www.facebook.com/yootimc";
const TDS = "/docs/neocoat-tds.pdf";
const NEOCOAT_S = "/product/neocoat-intumescent-paint-s";

const timers = [];
function clearTimers() { while (timers.length) clearInterval(timers.pop()); }

const observers = [];
function clearObservers() { while (observers.length) observers.pop().disconnect(); }

// listener ที่ผูกไว้กับ document ต้องถอนเองตอน unmount ไม่งั้นสะสมทุกครั้งที่เปลี่ยนหน้า
const disposers = [];
function clearDisposers() { while (disposers.length) disposers.pop()(); }
function onDoc(type, fn) {
  document.addEventListener(type, fn);
  disposers.push(() => document.removeEventListener(type, fn));
}

const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const leaves = () => $$("div,span,a,button").filter((el) => el.children.length === 0);
const txt = (el) => (el.textContent || "").trim();

function bindNav(el, url, opt = {}) {
  el.style.cursor = "pointer";
  el.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (opt.download) {
      const a = document.createElement("a");
      a.href = url; a.setAttribute("download", "");
      document.body.appendChild(a); a.click(); a.remove();
    } else if (opt.external) {
      window.open(url, "_blank", "noopener");
    } else {
      window.location.assign(url);
    }
  });
}

function linkifyButtons() {
  leaves().forEach((el) => {
    /* อยู่ใน <a href> อยู่แล้วห้ามผูกทับเด็ดขาด — bindNav เรียก stopPropagation()
       ลิงก์จริงของ ancestor จะตายทันที เคสจริงคือปุ่ม "ดูรายละเอียด" ในการ์ด
       สินค้าหน้า /products ทั้ง 11 ใบ การ์ดชี้ /product/<slug> ของตัวเอง แต่ถูก
       กติกา startsWith("ดูรายละเอียด") ลากไป /product หมด กดสินค้าใดก็ได้
       Neocoat-S ตัวเดียว (เดิมเช็คแค่ el เป็น <a> เอง ซึ่งไม่พอ เพราะปุ่มเป็น
       <div> ที่ "อยู่ข้างใน" <a> อีกที) */
    if (el.dataset.enhb || el.closest("a[href]")) return;
    const t = txt(el);
    let url = null, opt = {};
    if (["ขอใบเสนอราคา", "ขอใบเสนอราคาฟรี", "ขอใบเสนอราคาโครงการ", "ปรึกษาวิศวกร", "ขอคำนวณ & ใบเสนอราคา"].includes(t)) url = "/contact";
    else if (t.startsWith("ปรึกษา") && t.includes("LINE")) { url = LINE_MAIN; opt.external = true; }
    else if (t === "LINE: imat999") { url = LINE.imat999; opt.external = true; }
    else if (t === "LINE: blue999") { url = LINE.blue999; opt.external = true; }
    else if (t.startsWith("ดูสินค้าทั้งหมด") || t.startsWith("ดูทั้งหมด")) url = "/products";
    // ชี้ slug ตรงๆ ไม่ผ่าน /product ที่เป็น redirect จะได้ไม่เสียจังหวะโหลดฟรีหนึ่งรอบ
    else if (t.startsWith("ดูรายละเอียด")) url = NEOCOAT_S;
    else if (t.startsWith("ดาวน์โหลด")) { url = TDS; opt.download = true; }
    else if (t.startsWith("อ่านต่อ") || t.startsWith("อ่านบทความ")) url = "/articles";
    else if (t === "หน้าแรก") url = "/";
    if (url) { bindNav(el, url, opt); el.dataset.enhb = "1"; }
  });
  // home category tiles (01..06) -> products
  leaves().filter((e) => /^0[1-6]$/.test(txt(e))).forEach((e) => {
    const card = e.parentElement;
    if (card && !card.dataset.enhb) { card.dataset.enhb = "1"; bindNav(card, "/products"); }
  });
}

function linkifyContacts() {
  leaves().forEach((el) => {
    if (el.dataset.enhc) return;
    let h = el.innerHTML;
    if (!h || !/[@0-9]/.test(h)) return;
    let changed = false;
    h = h.replace(/([\w.\-]+@[\w.\-]+\.\w{2,})/g, (m) => { changed = true; return `<a href="mailto:${m}" style="color:inherit;text-decoration:none">${m}</a>`; });
    h = h.replace(/(0\d{1,2}-\d{3}-\d{4})/g, (m) => { changed = true; return `<a href="tel:${m.replace(/-/g, "")}" style="color:inherit;text-decoration:none">${m}</a>`; });
    h = h.replace(/\bimat999\b/g, () => { changed = true; return `<a href="${LINE.imat999}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">imat999</a>`; });
    h = h.replace(/\bblue999\b/g, () => { changed = true; return `<a href="${LINE.blue999}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">blue999</a>`; });
    if (changed) { el.innerHTML = h; el.dataset.enhc = "1"; }
  });
}

function slider() {
  let slides = $$('[data-slide]');
  if (slides.length < 2) slides = $$('[style*="animation:imgcycle"]');
  if (slides.length < 2) return;
  slides.forEach((s, i) => { s.dataset.slide = String(i); s.style.animation = "none"; s.style.transition = "opacity .6s ease"; });
  const wrap = slides[0].parentElement;
  const dotsWrap = document.querySelector('[style*="bottom:20px"][style*="left:72px"]');
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  let idx = 0;
  const show = (i) => {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === idx;
      s.style.opacity = on ? "1" : "0";
      s.style.zIndex = on ? "2" : "1";
      // ถอดคลาสออกจากสไลด์ที่ไม่ active เพื่อรีเซ็ตซูม/ตัวหนังสือให้เริ่มใหม่รอบหน้า
      s.classList.toggle("hero-on", on);
    });
    dots.forEach((d, k) => { d.style.width = k === idx ? "30px" : "10px"; d.style.background = k === idx ? "#12b459" : "rgba(255,255,255,.4)"; d.style.cursor = "pointer"; });
  };
  show(0);
  const auto = () => { clearTimers(); timers.push(setInterval(() => show(idx + 1), 5000)); };
  const arrowL = leaves().find((e) => txt(e) === "‹");
  const arrowR = leaves().find((e) => txt(e) === "›");
  if (arrowL) { arrowL.style.cursor = "pointer"; arrowL.onclick = () => { show(idx - 1); auto(); }; }
  if (arrowR) { arrowR.style.cursor = "pointer"; arrowR.onclick = () => { show(idx + 1); auto(); }; }
  dots.forEach((d, k) => (d.onclick = () => { show(k); auto(); }));
  auto();
}

const ICONS = [
  '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#018438" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#018438" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#018438" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
];
function solutionIcons() {
  $$('div[style*="width:74px"][style*="repeating-linear-gradient(135deg,#e9efe9"]').forEach((c, i) => {
    if (c.dataset.enh) return; c.dataset.enh = "1";
    c.style.background = "#e7f3ec";
    c.style.display = "flex"; c.style.alignItems = "center"; c.style.justifyContent = "center";
    c.innerHTML = ICONS[i % ICONS.length];
  });
}

const JOB_OPTIONS = ["สีกันไฟโครงสร้างเหล็ก", "ซีเมนต์กันไฟ", "ผ้ากันไฟ", "ทินเนอร์/น้ำมันสน", "สีรองพื้น/ทับหน้าเหล็ก", "สีเซรามิคสะท้อนความร้อน", "อื่นๆ"];
function nameFromLabel(l) {
  if (l.includes("ชื่อ")) return "name";
  if (l.includes("บริษัท")) return "company";
  if (l.includes("เบอร์โทร")) return "phone";
  if (l.includes("LINE") || l.includes("อีเมล")) return "contact";
  if (l.includes("ประเภทงาน")) return "jobType";
  // "รายละเอียด" ต้องมาก่อน "พื้นที่" — ฟอร์มหน้าแรกใช้ข้อความเดียวว่า
  // "รายละเอียดงาน (พื้นที่ ตร.ม. / ชั่วโมงกันไฟ)" ซึ่งมีทั้งสองคำ ถ้าเช็ค
  // พื้นที่ก่อน ช่องรายละเอียดจะถูกตั้งชื่อเป็น area แล้วข้อมูลไม่ถูกส่ง
  if (l.includes("รายละเอียด")) return "detail";
  if (l.includes("พื้นที่")) return "area";
  return "field";
}
function form() {
  const fields = $$('div[style*="#d9e0da"]').filter((d) => d.children.length === 0);
  // ช่องกรอกเองก็เข้าเงื่อนไข #d9e0da — ต้องแยกว่า element ก่อนหน้าเป็น "label"
  // จริง หรือเป็นอีกช่องกรอกที่วางติดกัน (ฟอร์มหน้าแรกไม่มี label เลย ช่องเรียง
  // ต่อกันเฉยๆ ถ้าเหมาว่าเป็น label ชื่อฟิลด์จะเลื่อนผิดกันหมดทั้งฟอร์ม)
  const isFieldBox = (n) => !!n && /#d9e0da/.test(n.getAttribute("style") || "");
  fields.forEach((el) => {
    const ph = txt(el);
    const prev = el.previousElementSibling;
    const label = prev && !isFieldBox(prev) ? txt(prev) : "";
    // ไม่มี label ก็ใช้ข้อความ placeholder ในช่องนั้นเป็นตัวบอกชนิดฟิลด์
    const nm = label ? nameFromLabel(label) : nameFromLabel(ph);
    const boxStyle = (el.getAttribute("style") || "")
      .replace(/color:#9aa79c/g, "color:#0e1a14")
      .replace(/color:#4a584f/g, "color:#0e1a14") + ";width:100%;background:#fff;outline:none;font-family:inherit";
    let ctrl;
    if (ph.includes("▾") || nm === "jobType") {
      ctrl = document.createElement("select");
      ctrl.setAttribute("style", boxStyle + ";cursor:pointer");
      JOB_OPTIONS.forEach((o) => { const op = document.createElement("option"); op.value = o; op.textContent = o; ctrl.appendChild(op); });
    } else if (nm === "detail") {
      ctrl = document.createElement("textarea");
      ctrl.rows = 4; ctrl.placeholder = ph;
      ctrl.setAttribute("style", boxStyle + ";resize:vertical;min-height:96px");
    } else {
      ctrl = document.createElement("input");
      ctrl.type = nm === "phone" ? "tel" : "text";
      if (nm === "area") ctrl.inputMode = "numeric";
      ctrl.placeholder = ph;
      ctrl.setAttribute("style", boxStyle);
    }
    ctrl.name = nm;
    ctrl.addEventListener("focus", () => (ctrl.style.borderColor = "#018438"));
    ctrl.addEventListener("blur", () => (ctrl.style.borderColor = "#d9e0da"));
    el.replaceWith(ctrl);
  });

  // fire-hour chips -> single choice
  const chipLabels = ["1 ชม.", "2 ชม.", "3 ชม.", "ยังไม่แน่ใจ"];
  const chips = leaves().filter((e) => chipLabels.includes(txt(e)));
  let hours = "1 ชม.";
  const paint = (sel) => chips.forEach((x) => {
    const on = x === sel;
    x.style.background = on ? "#eafaf0" : "#fff";
    x.style.borderColor = on ? "#018438" : "#d9e0da";
    x.style.color = on ? "#018438" : "#4a584f";
    x.style.fontWeight = on ? "600" : "500";
  });
  chips.forEach((c) => {
    if (c.dataset.enh) return; c.dataset.enh = "1";
    c.style.cursor = "pointer";
    c.addEventListener("click", () => { hours = txt(c); paint(c); });
  });
  if (chips[0]) paint(chips[0]);

  // submit
  const btn = leaves().find((e) => txt(e) === "ส่งขอใบเสนอราคา");
  if (btn && !btn.dataset.enh) {
    btn.dataset.enh = "1";
    btn.style.cursor = "pointer";
    const orig = btn.textContent;
    btn.addEventListener("click", async () => {
      const get = (n) => { const el = document.querySelector(`[name="${n}"]`); return el ? el.value.trim() : ""; };
      const payload = { name: get("name"), phone: get("phone"), company: get("company"), contact: get("contact"), jobType: get("jobType"), area: get("area"), hours, detail: get("detail") };
      if (!payload.name || !payload.phone) { alert("กรุณากรอกชื่อและเบอร์โทรติดต่อกลับ"); return; }
      btn.textContent = "กำลังส่ง…";
      try {
        const r = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const j = await r.json();
        if (j.ok) {
          let cont = btn.parentElement;
          while (cont && !cont.querySelector('[name="name"]')) cont = cont.parentElement;
          if (cont) {
            cont.innerHTML = '<div style="text-align:center;padding:48px 24px">' +
              '<div style="width:74px;height:74px;border-radius:50%;background:#eafaf0;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">' +
              '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#018438" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
              '<div style="font-size:22px;font-weight:700;margin-bottom:10px;color:#0e1a14">ส่งคำขอเรียบร้อยแล้ว</div>' +
              '<div style="font-size:15px;color:#5c6b62;line-height:1.6">ทีมวิศวกรจะติดต่อกลับพร้อมใบเสนอราคาภายใน 24 ชั่วโมง<br>ต้องการด่วน โทร <a href="tel:020410119" style="color:#018438;font-weight:600">02-041-0119</a> หรือแอด LINE ได้เลย</div></div>';
          }
        } else { alert(j.error || "ส่งไม่สำเร็จ กรุณาลองใหม่"); btn.textContent = orig; }
      } catch (e) { alert("เกิดข้อผิดพลาดในการส่ง กรุณาลองใหม่"); btn.textContent = orig; }
    });
  }
}

function productCat(t) {
  if (t.includes("Intumescent")) return "สีกันไฟ";
  if (t.includes("Primer") || t.includes("Neogloss")) return "สีรองพื้น/ทับหน้า";
  if (t.includes("ทินเนอร์") || t.includes("น้ำมันสน")) return "ทินเนอร์/น้ำมันสน";
  if (t.includes("ซีเมนต์") || t.includes("Fendolite")) return "ซีเมนต์กันไฟ";
  if (t.includes("ผ้ากันไฟ") || t.includes("Fiberglass")) return "ผ้ากันไฟ";
  if (t.includes("เซรามิค") || t.includes("Roof Shield")) return "เซรามิคสะท้อนร้อน";
  return "";
}
function productFilter() {
  const cards = $$('a[style*="border-radius:14px"][style*="overflow:hidden"]').filter((c) => c.textContent.includes("฿"));
  if (!cards.length) return;
  const grid = cards[0].parentElement;
  const items = $$('[style*="line-height:2.2"] > div');
  const countEl = leaves().find((e) => /^แสดง\s*\d+\s*รายการ$/.test(txt(e)));
  items.forEach((it) => {
    if (it.dataset.enh) return; it.dataset.enh = "1";
    it.style.cursor = "pointer";
    it.addEventListener("click", () => {
      const label = txt(it).replace(/^[■□]\s*/, "").replace(/\s*\(\d+\)$/, "");
      items.forEach((x) => {
        const on = x === it;
        const rest = txt(x).replace(/^[■□]\s*/, "");
        x.textContent = (on ? "■ " : "□ ") + rest;
        x.style.color = on ? "#018438" : "#4a584f";
        x.style.fontWeight = on ? "600" : "400";
      });
      let shown = 0;
      cards.forEach((c) => { const vis = label === "ทั้งหมด" || productCat(c.textContent) === label; c.style.display = vis ? "" : "none"; if (vis) shown++; });
      if (countEl) countEl.textContent = "แสดง " + shown + " รายการ";
    });
  });
  // มาจาก dropdown เมนูสินค้า (/products?cat=<หมวด>) → กดฟิลเตอร์ให้เลย
  // ค่า cat ต้องตรงกับข้อความในแถบหมวดหมู่เป๊ะ หลังตัด "□ " และ " (n)" ออก
  const wanted = new URLSearchParams(location.search).get("cat");
  if (wanted) {
    const label = (el) => txt(el).replace(/^[■□]\s*/, "").replace(/\s*\(\d+\)$/, "");
    const target = items.find((it) => label(it) === wanted);
    if (target) target.click();
  }

  // sort dropdown
  const sortEl = leaves().find((e) => txt(e).startsWith("เรียงตาม"));
  if (sortEl && !sortEl.dataset.enh) {
    sortEl.dataset.enh = "1";
    const sel = document.createElement("select");
    sel.setAttribute("style", (sortEl.getAttribute("style") || "") + ";cursor:pointer;background:#fff;font-family:inherit");
    [["pop", "ขายดี"], ["low", "ราคาต่ำ–สูง"], ["high", "ราคาสูง–ต่ำ"]].forEach(([v, l]) => { const o = document.createElement("option"); o.value = v; o.textContent = "เรียงตาม: " + l; sel.appendChild(o); });
    sortEl.replaceWith(sel);
    const orig = cards.slice();
    const price = (c) => { const m = c.textContent.match(/([\d,]+)฿/g); if (!m) return 0; return Math.min(...m.map((x) => +x.replace(/[^\d]/g, ""))); };
    sel.addEventListener("change", () => {
      let arr = orig.slice();
      if (sel.value === "low") arr.sort((a, b) => price(a) - price(b));
      else if (sel.value === "high") arr.sort((a, b) => price(b) - price(a));
      arr.forEach((c) => grid.appendChild(c));
    });
  }
}

function articleCat(t) {
  // read the card's category TAG (the label right before "· <date>"), not any body mention
  const m = t.match(/(ความรู้พื้นฐาน|มาตรฐาน|วิธีเลือก|วิธีคำนวณ|ขั้นตอนงาน|ขั้นตอน)\s*·/);
  const tag = m ? m[1] : "";
  if (tag === "ความรู้พื้นฐาน") return "ความรู้พื้นฐาน";
  if (tag === "มาตรฐาน") return "มาตรฐาน & กฎหมาย";
  if (tag === "วิธีเลือก" || tag === "วิธีคำนวณ") return "วิธีเลือก/คำนวณ";
  if (tag.startsWith("ขั้นตอน")) return "ขั้นตอนงานติดตั้ง";
  return "";
}
function articleFilter() {
  const chipLabels = ["ทั้งหมด", "ความรู้พื้นฐาน", "มาตรฐาน & กฎหมาย", "วิธีเลือก/คำนวณ", "ขั้นตอนงานติดตั้ง"];
  // select by text (robust: style attr gets re-serialized once .style is touched); exclude tags inside cards
  const chips = leaves().filter((s) => s.tagName === "SPAN" && chipLabels.includes(txt(s)) && /border-radius/.test(s.getAttribute("style") || "") && !s.closest("a"));
  const cards = $$('a[style*="border-radius:16px"][style*="overflow:hidden"]').filter((c) => c.textContent.includes("อ่านต่อ"));
  chips.forEach((chip) => {
    if (chip.dataset.enh) return; chip.dataset.enh = "1";
    chip.style.cursor = "pointer";
    chip.addEventListener("click", () => {
      const label = txt(chip);
      chips.forEach((c) => { const on = c === chip; c.style.background = on ? "#018438" : "#f0f7f2"; c.style.color = on ? "#fff" : "#2b382f"; c.style.fontWeight = on ? "600" : "500"; });
      cards.forEach((c) => { c.style.display = (label === "ทั้งหมด" || articleCat(c.textContent) === label) ? "" : "none"; });
    });
  });
  // แถบ pagination ปลอมถูกลบออกจาก articles.html แล้ว ไม่ต้องมาซ่อนตอน runtime
}

/* ฟอร์มหน้า /neocoat — เดิมปุ่ม "ส่งข้อมูลขอใบเสนอราคา" เป็น <button
   type="button"> ที่ไม่มี handler อยู่ที่ไหนเลยในโปรเจค กดแล้วไม่เกิดอะไรขึ้น
   ทั้งที่หน้านี้เป็นปลายทางของโฆษณา จึงรับ lead ไม่ได้แม้ใบเดียว */
const SUCCESS_HTML =
  '<div style="text-align:center;padding:34px 20px">' +
  '<div style="width:66px;height:66px;border-radius:50%;background:#eafaf0;display:flex;align-items:center;justify-content:center;margin:0 auto 18px">' +
  '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#018438" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
  '<div style="font-size:20px;font-weight:700;margin-bottom:9px;color:#0e1a14">ส่งคำขอเรียบร้อยแล้ว</div>' +
  '<div style="font-size:14.5px;color:#5c6b62;line-height:1.65">ทีมวิศวกรจะติดต่อกลับพร้อมใบเสนอราคาภายใน 24 ชั่วโมง<br>' +
  'ต้องการด่วน โทร <a href="tel:020410119" style="color:#018438;font-weight:600">02-041-0119</a></div></div>';

function landingForm() {
  const card = document.querySelector(".hero-card");
  if (!card || card.dataset.enh) return;
  // ปุ่มมี <svg> ข้างใน จับด้วยข้อความไม่ได้ ต้องจับด้วย selector
  const btn = card.querySelector("button.btn-primary, button.btn");
  if (!btn) return;
  card.dataset.enh = "1";

  const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };
  const flash = (msg) => {
    let box = card.querySelector("[data-lp-err]");
    if (!box) {
      box = document.createElement("div");
      box.setAttribute("data-lp-err", "1");
      box.setAttribute("role", "alert");
      box.style.cssText = "margin-top:10px;padding:10px 13px;border-radius:9px;background:#fdecea;color:#a3271b;font-size:13.5px;line-height:1.55";
      btn.insertAdjacentElement("afterend", box);
    }
    box.textContent = msg;
  };

  const orig = btn.innerHTML;
  btn.addEventListener("click", async () => {
    if (btn.disabled) return;
    const payload = {
      name: val("lp-name"),
      phone: val("lp-phone"),
      jobType: val("lp-interest"),
      detail: val("lp-msg"),
      // ระบุว่า lead มาจาก landing page ตัวไหน เผื่อมีหน้าที่สองในอนาคตจะได้แยกออก
      source: "neocoat-lp",
    };
    if (!payload.name || !payload.phone) {
      flash("กรุณากรอกชื่อและเบอร์โทรศัพท์ เพื่อให้ทีมงานติดต่อกลับได้");
      (document.getElementById(payload.name ? "lp-phone" : "lp-name") || {}).focus?.();
      return;
    }
    const err = card.querySelector("[data-lp-err]");
    if (err) err.remove();
    btn.disabled = true;
    btn.textContent = "กำลังส่ง…";
    try {
      const r = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) {
        card.innerHTML = SUCCESS_HTML;
        return;
      }
      // 503 = บันทึกไม่สำเร็จจริง ต้องบอกลูกค้า ไม่ใช่แกล้งว่าสำเร็จ
      flash(j.error || "ส่งไม่สำเร็จ กรุณาลองใหม่ หรือโทร 02-041-0119");
    } catch {
      flash("เชื่อมต่อไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่ หรือโทร 02-041-0119");
    }
    btn.disabled = false;
    btn.innerHTML = orig;
  });
}

/* เมนูสินค้าแบบ dropdown — เปิดด้วย hover/โฟกัสคีย์บอร์ดจาก CSS อยู่แล้ว
   ที่ต้องพึ่ง JS คือจอสัมผัส เพราะไม่มี hover ถ้าไม่ทำอะไร แตะแล้วจะเด้งไป
   /products ทันทีโดยไม่เห็นเมนูเลย */
function navDropdown() {
  const dd = document.querySelector(".nav-dd");
  if (!dd || dd.dataset.enh) return;
  dd.dataset.enh = "1";

  const trigger = dd.querySelector(":scope > a");
  const touch = typeof matchMedia === "function" && matchMedia("(hover: none)").matches;
  if (touch && trigger) {
    trigger.addEventListener("click", (e) => {
      // แตะแรก = เปิดเมนู, แตะซ้ำที่ "สินค้า" = ไปหน้ารวมสินค้าตามปกติ
      if (!dd.classList.contains("nav-open")) {
        e.preventDefault();
        dd.classList.add("nav-open");
      }
    });
  }
  onDoc("click", (e) => { if (!dd.contains(e.target)) dd.classList.remove("nav-open"); });
  onDoc("keydown", (e) => { if (e.key === "Escape") dd.classList.remove("nav-open"); });
}

/* ── ANIMATION ────────────────────────────────────────────────────────────
   คลาสทั้งหมดถูกเติมจาก JS ไม่ได้อยู่ใน HTML — ถ้า JS ไม่ทำงานหรือผู้ใช้ตั้ง
   prefers-reduced-motion ไว้ เนื้อหาจะแสดงปกติทันที ไม่มีทางที่ opacity:0
   จะค้างจนอ่านอะไรไม่ได้ */
const reduceMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* หน่วงเวลาแบบทยอย ต้องทำผ่านคลาสเท่านั้น ห้ามใช้ el.style.transitionDelay
   เหตุผล: การเขียน el.style.* ทำให้เบราว์เซอร์ serialize attribute style ใหม่
   (border-radius:14px → border-radius: 14px) แล้ว selector แบบ [style*="..."]
   จะหาไม่เจอ — ทั้ง globals.css และฟังก์ชันอื่นในไฟล์นี้พึ่ง selector ชนิดนั้น
   ทั้งหมด ถ้าแตะ inline style เข้าไป layout การ์ด ฟิลเตอร์สินค้า และขนาดฟอนต์
   บนมือถือจะพังพร้อมกัน */
const DELAY_STEPS = 7;
const delayClass = (i) => `rv-d${Math.min(i, DELAY_STEPS)}`;

/* hero: แยกภาพพื้นหลังออกมาเป็นเลเยอร์ของตัวเอง เพื่อซูมด้วย transform ได้
   (ถ้าซูมที่ตัวสไลด์ ตัวหนังสือจะถูกซูมไปด้วย และการขยับ background-size
   ทำให้เบราว์เซอร์ repaint ทุกเฟรม — transform ใช้ GPU ลื่นกว่ามาก) */
function heroMotion() {
  // ใช้ selector ชุดเดียวกับ slider() เพราะ motion() รันก่อน — data-slide ยังไม่ถูกใส่
  let slides = $$("[data-slide]");
  if (slides.length < 2) slides = $$('[style*="animation:imgcycle"]');
  if (slides.length < 2) return;

  slides.forEach((s, i) => {
    if (s.dataset.mo) return;
    s.dataset.mo = "1";
    // ปักหมุด data-slide ตรงนี้เลย: ด้านล่างเราแตะ .style ซึ่งทำให้เบราว์เซอร์
    // เขียน attribute style ใหม่ (animation:imgcycle → animation: imgcycle)
    // ทำให้ selector สำรองของ slider() หาไม่เจอ ถ้าไม่มี data-slide ไว้ก่อน
    // สไลด์ hero จะตายทั้งหมด
    s.dataset.slide = String(i);
    const img = getComputedStyle(s).backgroundImage;
    if (img && img !== "none") {
      const layer = document.createElement("div");
      layer.className = "hero-kb";
      layer.style.backgroundImage = img;
      s.style.backgroundImage = "none";
      s.insertBefore(layer, s.firstChild);
    }
    // ทยอยโผล่: ป้าย → หัวเรื่อง → คำโปรย → ปุ่ม
    // หน่วงเวลาใช้ "คลาส" ไม่ใช่ el.style.transitionDelay — ดูเหตุผลที่ delayClass ด้านบน
    const copy = Array.from(s.children).find((c) => c.querySelector("h1,p"));
    if (copy) {
      Array.from(copy.children).forEach((el, i) => {
        el.dataset.heroCopy = "1";
        el.classList.add(delayClass(i + 1));
      });
    }
  });
}

/* เลื่อนมาถึงแล้วค่อยโผล่ — section ทั้งก้อนขึ้นมาก่อน แล้วการ์ดในกริดทยอยตามทีละใบ */
function revealOnScroll() {
  if (!("IntersectionObserver" in window)) return;
  // หน้าปกติห่อด้วย div 1440px, หน้า landing ห่อด้วย .lp
  const root = document.querySelector('[style*="width:1440px"]') || document.querySelector(".lp");
  if (!root) return;

  const fold = window.innerHeight * 0.85;
  const skip = (el) => {
    if (!(el instanceof HTMLElement)) return true;            // <style>/<script>/text node
    if (/^(STYLE|SCRIPT|LINK)$/.test(el.tagName)) return true;
    // position:fixed/sticky — ถ้า ancestor มี transform ตำแหน่งจะเพี้ยน (ปุ่มลอย/แถบ CTA ล่าง)
    const pos = getComputedStyle(el).position;
    if (pos === "fixed" || pos === "sticky") return true;
    // อยู่ในจอตอนโหลดอยู่แล้ว (แถบติดต่อ, เมนู, hero) — ต้องเห็นทันที
    // ถ้า fade เข้า จะกิน LCP ฟรีๆ ทั้งที่ผู้ใช้ยังไม่ได้เลื่อนหน้าเลย
    return el.getBoundingClientRect().top < fold;
  };
  const sections = Array.from(root.children).filter((el) => !skip(el));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("rv-in");
        io.unobserve(e.target); // โผล่แล้วจบ ไม่ต้องเฝ้าอีก
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );
  observers.push(io);

  const tag = (el, step) => {
    if (el.dataset.rv) return;
    el.dataset.rv = "1";
    el.classList.add("rv");
    if (step) el.classList.add(delayClass(step));
    io.observe(el);
  };

  sections.forEach((sec) => {
    if (sec.querySelector("[data-slide]")) return;      // hero มี animation ของตัวเองแล้ว
    if (sec.querySelector(".clients-track")) return;    // carousel เลื่อนอยู่ตลอดแล้ว

    // กริดการ์ดที่เป็นลูกตรงของ section → ทยอยทีละใบ ส่วนที่เหลือขึ้นมาทั้งก้อน
    const grids = Array.from(sec.children).filter(
      (c) => /display:grid/.test(c.getAttribute("style") || "") && c.children.length > 1
    );
    if (grids.length) {
      Array.from(sec.children).forEach((c) => { if (!grids.includes(c)) tag(c, 0); });
      grids.forEach((g) => Array.from(g.children).forEach((k, i) => tag(k, i)));
    } else {
      tag(sec, 0);
    }
  });
}

function motion() {
  if (reduceMotion()) return;
  heroMotion();
  revealOnScroll();
}

export default function Enhance() {
  const pathname = usePathname();
  useEffect(() => {
    const run = () => {
      clearTimers();
      const safe = (f) => { try { f(); } catch (e) { console.warn("[enhance]", f.name, e); } };
      safe(linkifyButtons);
      safe(linkifyContacts);
      safe(navDropdown);
      safe(motion);   // ต้องมาก่อน slider() เพราะ slider จะสั่งเล่น animation ของสไลด์
      safe(slider);
      safe(solutionIcons);
      // หน้าแรกก็มีฟอร์มขอใบเสนอราคาใน QUOTE BAND — เดิม form() รันแค่ /contact
      // ทำให้ฟอร์มหน้าแรกกดส่งไม่ได้เลย
      if (pathname === "/contact" || pathname === "/") safe(form);
      if (pathname === "/neocoat") safe(landingForm);
      if (pathname === "/products") safe(productFilter);
      if (pathname === "/articles") safe(articleFilter);
    };
    const t = setTimeout(run, 30);
    return () => { clearTimeout(t); clearTimers(); clearObservers(); clearDisposers(); };
  }, [pathname]);
  return null;
}
