"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LINE_MAIN = "https://lin.ee/N3VgCj5";
const LINE = { imat999: "https://line.me/ti/p/~imat999", blue999: "https://line.me/ti/p/~blue999" };
const FB = "https://www.facebook.com/yootimc";
const TDS = "/docs/neocoat-tds.pdf";

const timers = [];
function clearTimers() { while (timers.length) clearInterval(timers.pop()); }

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
    if (el.dataset.enhb || (el.tagName === "A" && el.getAttribute("href"))) return;
    const t = txt(el);
    let url = null, opt = {};
    if (["ขอใบเสนอราคา", "ขอใบเสนอราคาฟรี", "ขอใบเสนอราคาโครงการ", "ปรึกษาวิศวกร", "ขอคำนวณ & ใบเสนอราคา"].includes(t)) url = "/contact";
    else if (t.startsWith("ปรึกษา") && t.includes("LINE")) { url = LINE_MAIN; opt.external = true; }
    else if (t === "LINE: imat999") { url = LINE.imat999; opt.external = true; }
    else if (t === "LINE: blue999") { url = LINE.blue999; opt.external = true; }
    else if (t.startsWith("ดูสินค้าทั้งหมด") || t.startsWith("ดูทั้งหมด")) url = "/products";
    else if (t.startsWith("ดูรายละเอียด")) url = "/product";
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
    slides.forEach((s, k) => { s.style.opacity = k === idx ? "1" : "0"; s.style.zIndex = k === idx ? "2" : "1"; });
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
  if (l.includes("พื้นที่")) return "area";
  if (l.includes("รายละเอียด")) return "detail";
  return "field";
}
function form() {
  const fields = $$('div[style*="#d9e0da"]').filter((d) => d.children.length === 0);
  fields.forEach((el) => {
    const ph = txt(el);
    const label = el.previousElementSibling ? txt(el.previousElementSibling) : "";
    const nm = nameFromLabel(label);
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
  // remove the non-functional numeric pagination
  const two = leaves().find((e) => txt(e) === "2" && (e.getAttribute("style") || "").includes("border-radius"));
  if (two && two.parentElement) two.parentElement.style.display = "none";
}

export default function Enhance() {
  const pathname = usePathname();
  useEffect(() => {
    const run = () => {
      clearTimers();
      const safe = (f) => { try { f(); } catch (e) { console.warn("[enhance]", f.name, e); } };
      safe(linkifyButtons);
      safe(linkifyContacts);
      safe(slider);
      safe(solutionIcons);
      if (pathname === "/contact") safe(form);
      if (pathname === "/products") safe(productFilter);
      if (pathname === "/articles") safe(articleFilter);
    };
    const t = setTimeout(run, 30);
    return () => { clearTimeout(t); clearTimers(); };
  }, [pathname]);
  return null;
}
