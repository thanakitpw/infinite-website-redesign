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
    /* ปุ่ม "ปรึกษาผ่าน LINE" (hero หน้าแรก + product.html) ชี้ไลน์ส่วนตัว imat999
       ไม่ใช่ LINE OA — ตรงกับปุ่มชื่อเดียวกันในหน้าสินค้าทั้ง 14 หน้า ซึ่งเขียน
       <a href="line.me/ti/p/~imat999"> ไว้ใน HTML อยู่แล้ว จึงไม่ผ่านกติกานี้ */
    else if (t.startsWith("ปรึกษา") && t.includes("LINE")) { url = LINE.imat999; opt.external = true; }
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
  /* เดิมมีบล็อกจับตัวเลข 01–06 ของแถบหมวดหมู่หน้าแรกมาผูกลิงก์ /products ให้
     ตอนนี้แถบนั้นเปลี่ยนเป็นไอคอน และแต่ละใบเป็น <a href="/products?cat=…">
     ใน home.html แล้ว จึงไม่ต้องผูกจาก JS อีก */
}

function linkifyContacts() {
  leaves().forEach((el) => {
    if (el.dataset.enhc) return;
    /* el เป็น <a> อยู่แล้ว (เช่นปุ่ม "ทัก LINE @imat999" ที่ทั้งปุ่มเป็นลิงก์
       เดียวอยู่แล้ว) ห้ามยัด <a> ซ้อนเข้าไปอีกชั้น — นอกจากเป็น HTML ที่ผิด
       สเปกแล้ว ปุ่มที่ใช้ .btn (display:inline-flex;gap:10px) จะเห็นช่องว่าง
       โผล่ขึ้นมาระหว่างข้อความเดิมกับลิงก์ที่เพิ่งสร้าง เพราะกลายเป็นคนละ flex
       item ทันที (บั๊กจริงที่เจอกับปุ่ม LINE ในหน้า /thinner) */
    if (el.tagName === "A") return;
    let h = el.innerHTML;
    if (!h || !/[@0-9]/.test(h)) return;
    let changed = false;
    h = h.replace(/([\w.\-]+@[\w.\-]+\.\w{2,})/g, (m) => { changed = true; return `<a href="mailto:${m}" style="color:inherit;text-decoration:none">${m}</a>`; });
    h = h.replace(/(0\d{1,2}-\d{3}-\d{4})/g, (m) => { changed = true; return `<a href="tel:${m.replace(/-/g, "")}" style="color:inherit;text-decoration:none">${m}</a>`; });
    /* @imat คือ LINE OA ชี้ไปลิงก์ lin.ee (LINE_MAIN) ซึ่งตอนนี้เหลือที่ใช้ที่เดียวคือตรงนี้
       ต้องมาก่อน imat999 และห้ามใส่ \b หน้า @ (space→@ ไม่ใช่ขอบเขตคำ จะไม่แมตช์)
       ส่วน \b ท้ายกัน "@imat999" ถูกตัดครึ่งเป็น @imat */
    h = h.replace(/@imat\b/g, () => { changed = true; return `<a href="${LINE_MAIN}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">@imat</a>`; });
    h = h.replace(/\bimat999\b/g, () => { changed = true; return `<a href="${LINE.imat999}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">imat999</a>`; });
    h = h.replace(/\bblue999\b/g, () => { changed = true; return `<a href="${LINE.blue999}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">blue999</a>`; });
    if (changed) { el.innerHTML = h; el.dataset.enhc = "1"; }
  });
}

/* สไลด์ hero เลื่อนแนวนอน — ใบใหม่เข้ามาจากขวา ใบเก่าออกไปทางซ้าย
   (กลับทิศเมื่อกดลูกศรย้อนกลับ) ทั้งใบขยับด้วย transform ใบเดียว ตัวหนังสือกับ
   ภาพจึงไปด้วยกันเป็นก้อนเดียว ไม่ใช่ crossfade แบบเดิม */
const SLIDE_MS = 720;
const SLIDE_EASE = "cubic-bezier(.45,.05,.15,1)";

function slider() {
  let slides = $$('[data-slide]');
  if (slides.length < 2) slides = $$('[style*="animation:imgcycle"]');
  if (slides.length < 2) return;
  const reduce = reduceMotion();
  /* anim=false ใช้ตอน "วางตำแหน่งตั้งต้น" ของใบที่กำลังจะเข้า ต้องไม่มี transition
     ไม่งั้นมันจะวิ่งจากตำแหน่งเดิมข้ามจอมาก่อนแล้วค่อยวิ่งเข้า = เห็นสองจังหวะ */
  const place = (s, x, anim) => {
    s.style.transition = anim && !reduce ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}` : "none";
    s.style.transform = `translateX(${x}%)`;
  };
  slides.forEach((s, i) => {
    s.dataset.slide = String(i);
    s.style.animation = "none";
    // ตำแหน่งคุมด้วย transform แล้ว opacity ที่ HTML ตั้งไว้ให้ crossfade ต้องเปิดทุกใบ
    s.style.opacity = "1";
    s.style.zIndex = i === 0 ? "2" : "1";
    place(s, i === 0 ? 0 : 100, false);
  });
  const dotsWrap = document.querySelector('[style*="bottom:20px"][style*="left:72px"]');
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  let idx = 0;
  let settle = 0;
  const paintDots = () => dots.forEach((d, k) => {
    d.style.width = k === idx ? "30px" : "10px";
    d.style.background = k === idx ? "#12b459" : "rgba(255,255,255,.4)";
    d.style.cursor = "pointer";
  });
  const show = (i, dir) => {
    const next = (i + slides.length) % slides.length;
    if (next === idx) return;
    const cur = slides[idx];
    const nxt = slides[next];
    place(nxt, dir * 100, false);
    nxt.style.zIndex = "2";
    void nxt.offsetWidth;   // บังคับ reflow ให้ตำแหน่งตั้งต้นมีผลก่อน ไม่งั้นเบราว์เซอร์ยุบสองสเต็ปเหลือก้าวเดียว
    place(nxt, 0, true);
    place(cur, -dir * 100, true);
    cur.style.zIndex = "1";
    nxt.classList.add("hero-on");
    idx = next;
    paintDots();
    /* ถอด hero-on ของใบเก่าหลังเลื่อนจบ ไม่ใช่ตอนเริ่ม — คลาสนี้คุมตัวหนังสือใน hero
       ถ้าถอดทันทีข้อความจะวูบหายตั้งแต่ยังเลื่อนออกไม่พ้นจอ */
    clearTimeout(settle);
    settle = setTimeout(() => slides.forEach((s, k) => s.classList.toggle("hero-on", k === idx)), reduce ? 0 : SLIDE_MS);
  };
  slides[0].classList.add("hero-on");
  /* ลูกศรกับจุดเขียนไว้ใน HTML หลังตัวสไลด์ แต่พอสไลด์ถูกตั้ง z-index (1/2) ตอนสลับใบ
     ของที่ z-index:auto จะจมอยู่ใต้สไลด์ทันที ต้องดันขึ้นมาด้วยคลาส .hero-ctl
     ใช้คลาส ไม่ใช่ el.style.zIndex — กล่องจุดถูก globals.css เกาะด้วย
     [style*="left:72px"] ถ้าแตะ inline style เบราว์เซอร์จะ serialize ใหม่ selector หลุด */
  if (dotsWrap) dotsWrap.classList.add("hero-ctl");
  paintDots();
  const auto = () => { clearTimers(); timers.push(setInterval(() => show(idx + 1, 1), 5000)); };
  const arrowL = leaves().find((e) => txt(e) === "‹");
  const arrowR = leaves().find((e) => txt(e) === "›");
  const bindArrow = (el, dir, label) => {
    if (!el) return;
    el.classList.add("hero-ctl", "hero-arrow");
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", label);
    const go = () => { show(idx + dir, dir); auto(); };
    el.onclick = go;
    el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
  };
  bindArrow(arrowL, -1, "สไลด์ก่อนหน้า");
  bindArrow(arrowR, 1, "สไลด์ถัดไป");
  dots.forEach((d, k) => (d.onclick = () => { show(k, k > idx ? 1 : -1); auto(); }));
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

  // submit
  const btn = leaves().find((e) => txt(e) === "ส่งขอใบเสนอราคา");
  if (btn && !btn.dataset.enh) {
    btn.dataset.enh = "1";
    btn.style.cursor = "pointer";
    const orig = btn.textContent;
    btn.addEventListener("click", async () => {
      const get = (n) => { const el = document.querySelector(`[name="${n}"]`); return el ? el.value.trim() : ""; };
      const payload = { name: get("name"), phone: get("phone"), company: get("company"), contact: get("contact"), jobType: get("jobType"), area: get("area"), detail: get("detail") };
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

/* หมวดของการ์ดอ่านจาก data-cat ที่ฝังไว้ใน products.html ซึ่งเจนจาก _data/products.js
   ตรงๆ — เดิมเดาหมวดจากข้อความในการ์ด ซึ่งไม่มีเงื่อนไขไหนครอบ Four Plus ทั้ง 3 ใบเลย
   กดหมวด "สีน้ำพลาสติก" (หรือเข้ามาทาง /products?cat=สีน้ำพลาสติก) จึงได้ 0 รายการ
   เงื่อนไขข้อความเก็บไว้เป็นทางสำรอง เผื่อการ์ดที่ยังไม่ได้ติด data-cat */
function productCat(card) {
  const tagged = card.dataset && card.dataset.cat;
  if (tagged) return tagged;
  const t = card.textContent || "";
  if (t.includes("Intumescent")) return "สีกันไฟ";
  if (t.includes("Primer") || t.includes("Neogloss")) return "สีรองพื้น/ทับหน้า";
  if (t.includes("ทินเนอร์") || t.includes("น้ำมันสน")) return "ทินเนอร์/น้ำมันสน";
  if (t.includes("ซีเมนต์") || t.includes("Fendolite")) return "ซีเมนต์กันไฟ";
  if (t.includes("ผ้ากันไฟ") || t.includes("Fiberglass")) return "ผ้ากันไฟ";
  if (t.includes("เซรามิค") || t.includes("Roof Shield")) return "เซรามิคสะท้อนร้อน";
  if (t.includes("Four Plus") || t.includes("สีน้ำพลาสติก")) return "สีน้ำพลาสติก";
  return "";
}
function productFilter() {
  /* เดิมคัดการ์ดสินค้าด้วย "ในกล่องมีเครื่องหมาย ฿ ไหม" พอเอาราคาออกทั้งเว็บ
     เงื่อนไขนั้นไม่เหลืออะไรให้จับ ฟิลเตอร์หมวดหมู่เลยตายทั้งหน้า — ใช้ปลายทาง
     ของลิงก์แทน ซึ่งเป็นสิ่งที่การ์ดสินค้าต่างจากการ์ดอื่นจริงๆ */
  const cards = $$('a[style*="border-radius:14px"][style*="overflow:hidden"]')
    .filter((c) => (c.getAttribute("href") || "").startsWith("/product/"));
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
      cards.forEach((c) => { const vis = label === "ทั้งหมด" || productCat(c) === label; c.style.display = vis ? "" : "none"; if (vis) shown++; });
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

  /* เดิมมี dropdown "เรียงตาม" ที่เรียงได้แค่ตามราคา (ต่ำ–สูง / สูง–ต่ำ) พอเอา
     ราคาออกก็ไม่เหลือเกณฑ์ให้เรียง เหลือแต่ "ขายดี" ซึ่งเป็นลำดับตั้งต้นอยู่แล้ว
     จึงถอดทั้งตัวควบคุมใน products.html และโค้ดส่วนนี้ออกพร้อมกัน */
}

/* ── หน้าสินค้า: แกลเลอรีรูป ───────────────────────────────────────────────
   กดรูปย่อยแล้วเปลี่ยนรูปหลักจริง — เดิมเป็นภาพนิ่ง กดไม่ได้
   ต้องก๊อป background-size ไปด้วย เพราะรูปย่อยบางใบใช้ cover บางใบใช้ contain
   ถ้าไม่ก๊อป รูปจะถูกยืดผิดสัดส่วน

   เกณฑ์เลือก: cover = รูปถ่ายจริง (steel-frame/steel-truss) ครอบไม่เสียความหมาย
   contain = รูปสินค้า/ใบเซอร์/แบนเนอร์ที่มีตัวหนังสือ — กรอบหลักสูง 420px แต่กว้าง
   กว่านั้น ถ้าใส่ cover กับแบนเนอร์จัตุรัสจะโดนตัดหัวท้ายจนอ่านไม่ครบ */
function productGallery() {
  const main = document.querySelector("[data-gal-main]");
  const thumbs = $$("[data-gal-thumb]");
  if (!main || thumbs.length < 2) return;

  thumbs.forEach((t) => {
    if (t.dataset.enh) return; t.dataset.enh = "1";
    t.addEventListener("click", () => {
      const cs = getComputedStyle(t);
      main.style.backgroundImage = cs.backgroundImage;
      main.style.backgroundSize = cs.backgroundSize;
      thumbs.forEach((x) => x.classList.toggle("on", x === t));
    });
  });
}

/* ── หน้าสินค้า: แท็บหัวข้อ ────────────────────────────────────────────────
   แท็บชี้ไปที่หัวข้อในเนื้อหาด้านล่าง กดแล้วเลื่อนไปหา + ไฮไลต์ตามตำแหน่งที่อ่านอยู่
   จำนวนแท็บไม่เท่ากันในแต่ละหน้า (2–5 อัน) จึงจับคู่จากข้อความ ไม่ใช่ลิสต์ตายตัว */
const TAB_OFFSET = 110;   // เผื่อความสูง header ที่ตรึงอยู่ด้านบน

function productTabs() {
  const tabs = $$(".ptab");
  if (!tabs.length) return;
  const bar = tabs[0].parentElement;
  const after = (el) =>
    bar.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING;

  const heads = $$("h3").filter(after);
  const leafAfter = leaves().filter(after);

  const pairs = tabs.map((tab, i) => {
    const label = txt(tab);
    // แท็บแรก ("รายละเอียด") ไม่ตรงกับหัวข้อไหน — ให้ชี้หัวข้อแรกของโซนเนื้อหา
    // ที่เหลือจับจากหัวข้อที่ขึ้นต้นด้วยชื่อแท็บ ครอบเคส "การติดตั้ง (Installation)"
    let target = i === 0 ? heads[0] : heads.find((h) => txt(h).startsWith(label));
    // บางแท็บ (เช่น "คำถามที่พบบ่อย") หัวข้อเป็น div ในคอลัมน์ขวา ไม่ใช่ h3
    if (!target) target = leafAfter.find((e) => txt(e) === label);
    return { tab, target };
  }).filter((p) => p.target);

  if (!pairs.length) return;

  pairs.forEach(({ tab, target }) => {
    if (tab.dataset.enh) return; tab.dataset.enh = "1";
    tab.addEventListener("click", () => {
      const y = target.getBoundingClientRect().top + window.scrollY - TAB_OFFSET;
      window.scrollTo({ top: y, behavior: reduceMotion() ? "auto" : "smooth" });
    });
  });

  // ไฮไลต์แท็บตามหัวข้อที่เลื่อนผ่านล่าสุด
  const sync = () => {
    let active = pairs[0];
    for (const p of pairs) {
      if (p.target.getBoundingClientRect().top <= TAB_OFFSET + 4) active = p;
    }
    pairs.forEach((p) => p.tab.classList.toggle("on", p === active));
  };
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; sync(); });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  disposers.push(() => window.removeEventListener("scroll", onScroll));
  sync();
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

/* ── เมนูแฮมเบอร์เกอร์บนมือถือ ─────────────────────────────────────────────
   ปุ่มถูกสร้างจากที่นี่ ไม่ได้เขียนไว้ใน _content/*.html สักหน้า ตั้งใจให้เป็น
   progressive enhancement แบบเดียวกับ standardsModal(): ถ้า JS ไม่ทำงาน จะไม่มี
   ทั้งปุ่มและคลาส .hdr-js กฎซ่อนเมนูใน globals.css ผูกกับ .hdr-js ทั้งชุด เมนูจึง
   กลับไปโชว์เต็มแบบห่อบรรทัดเหมือนเดิม ไม่มีทางเจอหน้าที่เข้าเมนูไม่ได้เลย

   ไม่เช็ค matchMedia ปล่อยให้ CSS ที่ ≤720px เป็นคนตัดสินใจว่าจะโชว์ปุ่ม/ซ่อน
   เมนูหรือไม่ — ถ้าตัดสินจาก JS ตอนโหลด พอผู้ใช้หมุนจอหรือย่อหน้าต่างจะได้
   header ที่ไม่ตรงกับ CSS ทันที

   หมายเหตุ: ห้ามแตะ hd.style เด็ดขาด ด้วยเหตุผลเดียวกับ stickyHeader() ท้ายไฟล์ */
const BURGER_SVG =
  '<svg class="nav-burger-bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
  '<svg class="nav-burger-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

function mobileNav() {
  const hd = document.querySelector(HEADER_SEL);   // แถว header (โลโก้ + ปุ่มขอใบเสนอราคา)
  if (!hd || hd.dataset.mnav) return;
  const nav = hd.querySelector(':scope > div[style*="font-size:15px;font-weight:500"]');
  if (!nav) return;
  /* หน้าบทความ (/articles/<slug>) ใช้ลิงก์ "สินค้า" ธรรมดา ไม่มี .nav-dd
     ทุกจุดที่แตะ dd ต่อจากนี้ต้องเช็ค null ก่อนเสมอ */
  const dd = nav.querySelector(".nav-dd");
  hd.dataset.mnav = "1";
  hd.classList.add("hdr-js");

  if (!nav.id) nav.id = "site-nav";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nav-burger";
  btn.setAttribute("aria-label", "เมนู");
  btn.setAttribute("aria-controls", nav.id);
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = BURGER_SVG;
  hd.appendChild(btn);

  const setOpen = (on) => {
    hd.classList.toggle("mnav-open", on);
    btn.setAttribute("aria-expanded", on ? "true" : "false");
    if (!on && dd) dd.classList.remove("nav-open");   // ปิดแผงสินค้าที่กางค้างอยู่ข้างในด้วย
  };
  btn.addEventListener("click", () => setOpen(!hd.classList.contains("mnav-open")));

  /* แตะลิงก์ในเมนูแล้วต้องปิดเอง — Next.js เปลี่ยนหน้าแบบ client-side ถ้าไม่ปิด
     เมนูจะค้างกางข้ามหน้า ยกเว้นปุ่ม "สินค้า" ที่เป็นตัวกางแผงหมวดหมู่
     (navDropdown() ด้านบนดูแลการแตะครั้งแรกของมันอยู่แล้ว) */
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a && a.parentElement !== dd) setOpen(false);
  });

  onDoc("click", (e) => { if (!hd.contains(e.target)) setOpen(false); });
  onDoc("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

/* ── หน้า /standards: การ์ดมาตรฐาน → popup ────────────────────────────────
   การ์ดโชว์แค่รูปใหญ่ + หัวข้อ ส่วนคำอธิบายเต็มยังอยู่ใน [data-std-body] ใน DOM
   ตลอดเวลา (ดีต่อ SEO และคนที่ปิด JS) — ซ่อนด้วย CSS ก็ต่อเมื่อฟังก์ชันนี้ติด
   คลาส .std-js ให้กริดสำเร็จแล้วเท่านั้น ถ้า JS ไม่ทำงาน คลาสไม่ถูกติด =
   คำอธิบายแสดงเต็มเหมือนเดิม ไม่มีทางเจอการ์ดที่กดไม่ได้และอ่านอะไรไม่ได้

   ปุ่ม "ดูรายละเอียด" ก็เติมจากที่นี่ด้วยเหตุผลเดียวกัน — ถ้าใส่ไว้ใน HTML
   แล้ว JS ตาย มันจะกลายเป็นปุ่มหลอกที่กดแล้วไม่มีอะไรเกิดขึ้น */
function standardsModal() {
  const cards = $$("[data-std]");
  if (!cards.length) return;
  const grid = cards[0].parentElement;
  if (!grid || grid.dataset.stdJs) return;
  grid.dataset.stdJs = "1";
  grid.classList.add("std-js");

  const modal = document.createElement("div");
  modal.className = "std-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.hidden = true;
  modal.innerHTML =
    '<div class="std-modal-back"></div>' +
    '<div class="std-modal-panel">' +
      '<button type="button" class="std-modal-x" aria-label="ปิด">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<div class="std-modal-cover"></div>' +
      '<div class="std-modal-text"></div>' +
    '</div>';
  document.body.appendChild(modal);

  const panel = modal.querySelector(".std-modal-panel");
  const cover = modal.querySelector(".std-modal-cover");
  const text = modal.querySelector(".std-modal-text");
  const closeBtn = modal.querySelector(".std-modal-x");
  let opener = null;

  const close = () => {
    if (modal.hidden) return;
    modal.classList.remove("std-modal-on");
    document.documentElement.style.overflow = "";
    // รอ transition จบก่อนค่อย hidden ไม่งั้นจะหายวับไม่มี fade ออก
    const done = () => { modal.hidden = true; text.innerHTML = ""; };
    if (reduceMotion()) done();
    else setTimeout(done, 220);
    if (opener) { opener.focus(); opener = null; }
  };

  const open = (card) => {
    const pad = card.querySelector('[style*="padding:24px 22px"]') || card;
    const body = card.querySelector("[data-std-body]");
    const head = pad.querySelector("h2");
    const eyebrow = pad.querySelector('[style*="IBM Plex Mono"]');
    const src = card.querySelector(".std-cover");
    if (!body) return;

    opener = card;
    // ปกเอกสาร: ก๊อป background ทั้งชุดมา ไม่ใช่แค่ image เพราะบางใบเป็นแผ่น
    // ตัวอักษร (ยังไม่มีปกจริง) ที่ใช้ flex + ตัวหนังสือข้างในแทนรูป
    cover.innerHTML = src ? src.innerHTML : "";
    const cs = src ? getComputedStyle(src) : null;
    cover.style.backgroundImage = cs ? cs.backgroundImage : "none";
    cover.style.backgroundColor = cs ? cs.backgroundColor : "";
    cover.style.backgroundSize = cs ? cs.backgroundSize : "";
    cover.style.backgroundPosition = "center";
    cover.style.backgroundRepeat = "no-repeat";

    // ปุ่มดาวน์โหลดสร้างจาก data-std-doc ที่ปักไว้ใน HTML — ถ้าใบไหนยังไม่มีไฟล์
    // ก็ไม่ขึ้นปุ่ม ไม่ต้องแก้ JS
    const href = card.dataset.stdDoc;
    const dl = href
      ? '<a class="std-modal-dl" href="' + href + '" target="_blank" rel="noopener">' +
        "↓ ดาวน์โหลดเอกสาร<span>" + (card.dataset.stdDocLabel || "") + "</span></a>"
      : "";

    text.innerHTML =
      (eyebrow ? '<div class="std-modal-eyebrow">' + eyebrow.textContent + "</div>" : "") +
      (head ? "<h3>" + head.textContent + "</h3>" : "") +
      body.innerHTML + dl;
    modal.setAttribute("aria-label", head ? txt(head) : "รายละเอียดมาตรฐาน");

    modal.hidden = false;
    document.documentElement.style.overflow = "hidden";
    // บังคับให้เบราว์เซอร์คิด layout รอบนึงก่อน ไม่งั้นติดคลาสในเฟรมเดียวกับ
    // ที่เพิ่งเอา hidden ออก transition จะไม่ทำงาน
    void panel.offsetWidth;
    modal.classList.add("std-modal-on");
    closeBtn.focus();
  };

  cards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    const more = document.createElement("span");
    more.className = "std-more";
    more.textContent = card.dataset.stdDoc ? "ดูรายละเอียด · ดาวน์โหลดเอกสาร →" : "ดูรายละเอียด →";
    const pad = card.querySelector('[style*="padding:24px 22px"]');
    (pad || card).appendChild(more);

    card.addEventListener("click", () => open(card));
    card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();          // Space ไม่งั้นหน้าเลื่อนลงไปด้วย
      open(card);
    });
  });

  closeBtn.addEventListener("click", close);
  modal.querySelector(".std-modal-back").addEventListener("click", close);
  onDoc("keydown", (e) => { if (e.key === "Escape") close(); });
  disposers.push(() => { modal.remove(); document.documentElement.style.overflow = ""; });
}

/* ── หน้า /services: การ์ดบริการ 3 ใบแรก → popup รูป + คำอธิบายเต็ม ─────────
   ใช้โครง modal เดียวกับ standardsModal() ทุกคลาส (.std-modal ฯลฯ) เพราะเป็น
   popup แสดงรูป+ข้อความแบบเดียวกันเป๊ะ ต่างแค่ว่าการ์ดหน้านี้ไม่มีรูปปกอยู่ใน
   การ์ดเอง (โชว์แค่เลข+หัวข้อ+ย่อหน้าสั้นตามดีไซน์เดิม) จึงเก็บ path รูปไว้ใน
   data-svc-img แล้วตั้ง background ให้ป๊อปอัพตรงๆ แทนการก๊อปจาก element ในการ์ด
   คำอธิบายเต็มอยู่ใน [data-svc-body] ในการ์ดตลอดเวลาเหมือนหน้า standards —
   ซ่อนด้วย .std-js (คลาสเดียวกัน) ต่อเมื่อฟังก์ชันนี้ติดสำเร็จเท่านั้น ถ้า JS
   ไม่ทำงานผู้ใช้ยังอ่านคำอธิบายเต็มได้ในการ์ดตามปกติ */
function servicesModal() {
  const cards = $$("[data-svc]");
  if (!cards.length) return;
  const grid = cards[0].parentElement;
  if (!grid || grid.dataset.svcJs) return;
  grid.dataset.svcJs = "1";
  grid.classList.add("std-js");

  const modal = document.createElement("div");
  modal.className = "std-modal svc-modal-lg";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.hidden = true;
  modal.innerHTML =
    '<div class="std-modal-back"></div>' +
    '<div class="std-modal-panel">' +
      '<button type="button" class="std-modal-x" aria-label="ปิด">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<div class="std-modal-cover"></div>' +
      '<div class="std-modal-text"></div>' +
    '</div>';
  document.body.appendChild(modal);

  const panel = modal.querySelector(".std-modal-panel");
  const cover = modal.querySelector(".std-modal-cover");
  const text = modal.querySelector(".std-modal-text");
  const closeBtn = modal.querySelector(".std-modal-x");
  let opener = null;

  const close = () => {
    if (modal.hidden) return;
    modal.classList.remove("std-modal-on");
    document.documentElement.style.overflow = "";
    const done = () => { modal.hidden = true; text.innerHTML = ""; };
    if (reduceMotion()) done();
    else setTimeout(done, 220);
    if (opener) { opener.focus(); opener = null; }
  };

  const open = (card) => {
    const body = card.querySelector("[data-svc-body]");
    // การ์ดหน้า /services ใช้ inline style ล้วน แต่การ์ด "01" ของ /engineering
    // เป็นการ์ด .layer เดิม (คลาส .layer-t) จึงต้องเช็คสองแบบ
    const head = card.querySelector('[style*="font-size:19px"]') || card.querySelector(".layer-t");
    if (!body) return;

    opener = card;
    cover.innerHTML = "";
    cover.style.backgroundImage = card.dataset.svcImg ? "url('" + card.dataset.svcImg + "')" : "none";
    cover.style.backgroundColor = "#f6f7f3";
    cover.style.backgroundSize = "contain";
    cover.style.backgroundPosition = "center";
    cover.style.backgroundRepeat = "no-repeat";

    text.innerHTML = (head ? "<h3>" + head.textContent + "</h3>" : "") + body.innerHTML;
    modal.setAttribute("aria-label", head ? txt(head) : "รายละเอียดบริการ");

    modal.hidden = false;
    document.documentElement.style.overflow = "hidden";
    void panel.offsetWidth;
    modal.classList.add("std-modal-on");
    closeBtn.focus();
  };

  cards.forEach((card) => {
    card.classList.add("std-card");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    const more = document.createElement("span");
    more.className = "std-more";
    more.textContent = "ดูรายละเอียด →";
    card.appendChild(more);

    card.addEventListener("click", () => open(card));
    card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      open(card);
    });
  });

  closeBtn.addEventListener("click", close);
  modal.querySelector(".std-modal-back").addEventListener("click", close);
  onDoc("keydown", (e) => { if (e.key === "Escape") close(); });
  disposers.push(() => { modal.remove(); document.documentElement.style.overflow = ""; });
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

/* hero: เตรียมตัวหนังสือให้ทยอยโผล่ทีละบรรทัดตอนสไลด์เข้ามา
   (เดิมแยกภาพออกเป็นเลเยอร์ต่างหากเพื่อซูมช้าๆ แบบ Ken Burns ตอนนี้เอาซูมออกแล้ว
   เหลือแค่เลื่อนทั้งใบด้วย transform ที่ slider() จึงไม่ต้องแยกเลเยอร์อีก) */
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

/* Carousel รูปหน้างานใน landing page — ตัว .car-track เลื่อนได้เองด้วย CSS
   scroll-snap อยู่แล้ว ฟังก์ชันนี้เติมแค่ปุ่มลูกศรกับจุดบอกตำแหน่งให้คนใช้เมาส์
   จับจาก [data-carousel] ไม่ผูกกับ pathname เพราะ landing page มีหลายหน้าและ
   จะเพิ่มอีก ถ้าหน้าไหนไม่มี carousel ฟังก์ชันนี้ก็ไม่ทำอะไร */
function lpCarousel() {
  document.querySelectorAll("[data-carousel]").forEach((car) => {
    if (car.dataset.carOn) return;
    const stage = car.querySelector(".car-stage");
    const track = car.querySelector(".car-track");
    if (!stage || !track) return;
    const items = Array.from(track.children);
    if (items.length < 2) return;   // รูปเดียวไม่ต้องมีปุ่ม
    car.dataset.carOn = "1";

    const path = (d) => (d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6");
    const btn = (cls, label, d) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = cls;
      b.setAttribute("aria-label", label);
      b.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path(d) + '"/></svg>';
      return b;
    };

    // อ่านตำแหน่งจาก scrollLeft จริง ไม่เก็บ index ไว้เอง เพราะผู้ใช้ปัดนิ้วเองได้
    const cur = () => Math.round(track.scrollLeft / (track.clientWidth || 1));
    const go = (i) => {
      const k = Math.max(0, Math.min(items.length - 1, i));
      track.scrollTo({ left: items[k].offsetLeft - items[0].offsetLeft, behavior: reduceMotion() ? "auto" : "smooth" });
    };

    const prev = btn("car-btn car-prev", "รูปก่อนหน้า", -1);
    const next = btn("car-btn car-next", "รูปถัดไป", 1);
    prev.addEventListener("click", () => go(cur() - 1));
    next.addEventListener("click", () => go(cur() + 1));

    const dots = document.createElement("div");
    dots.className = "car-dots";
    const dotEls = items.map((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "car-dot";
      d.setAttribute("aria-label", "ไปที่รูปที่ " + (i + 1));
      d.addEventListener("click", () => go(i));
      dots.appendChild(d);
      return d;
    });

    let raf = 0;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = cur();
        dotEls.forEach((d, k) => d.classList.toggle("is-on", k === i));
        prev.disabled = i <= 0;
        next.disabled = i >= items.length - 1;
      });
    };
    track.addEventListener("scroll", sync, { passive: true });
    disposers.push(() => {
      track.removeEventListener("scroll", sync);
      cancelAnimationFrame(raf);
    });

    stage.appendChild(prev);
    stage.appendChild(next);
    car.appendChild(dots);
    sync();
  });
}

function motion() {
  if (reduceMotion()) return;
  heroMotion();
  revealOnScroll();
}

/* ── STICKY HEADER — ย่อลงตอนเลื่อนหน้าลง ──────────────────────────────────
   ตัว sticky/ขนาดที่ย่อ/ช่วง transition อยู่ใน globals.css ทั้งหมด ตรงนี้ทำแค่
   ติด–ถอดคลาส .hdr-min ตามตำแหน่ง scroll

   ห้ามแตะ el.style ของ header เด็ดขาด — ทั้ง rule ใน globals.css และฟังก์ชัน
   อื่นในไฟล์นี้เกาะ element ด้วย [style*="..."] ถ้าเขียน el.style.* attribute
   จะถูก serialize ใหม่แล้ว selector หลุดหมดทั้งชุด (เหตุผลเดียวกับที่ .rv-d*
   ต้องเป็นคลาส) */
const HEADER_SEL =
  'div[style*="width:1440px"] > div[style*="padding:16px 56px"][style*="border-bottom:1px solid #e7eae4"]';

function stickyHeader() {
  const hd = document.querySelector(HEADER_SEL);
  if (!hd) return;   // /neocoat ใช้ .lp .header ของตัวเอง ไม่เข้าเงื่อนไขนี้

  // ใช้สองเส้น (ย่อที่ 90 / คลายที่ 40) กันคลาสกระพริบตอน scroll ค้างพอดีที่เส้นแบ่ง
  const ON = 90, OFF = 40;
  let min = false;
  const sync = () => {
    const y = window.scrollY || 0;
    if (!min && y > ON) { min = true; hd.classList.add("hdr-min"); }
    else if (min && y < OFF) { min = false; hd.classList.remove("hdr-min"); }
  };

  // scroll ยิงถี่มาก — รวบให้เหลือเฟรมละครั้ง
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; sync(); });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  disposers.push(() => window.removeEventListener("scroll", onScroll));

  // เปิดหน้ามาแล้วเบราว์เซอร์กู้ตำแหน่ง scroll เดิมไว้กลางหน้า ต้องเข้าโหมดย่อทันที
  sync();
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
      safe(mobileNav);
      safe(stickyHeader);
      safe(motion);   // ต้องมาก่อน slider() เพราะ slider จะสั่งเล่น animation ของสไลด์
      safe(slider);
      safe(solutionIcons);
      safe(lpCarousel);   // no-op ถ้าหน้านั้นไม่มี [data-carousel]
      // หน้าแรกก็มีฟอร์มขอใบเสนอราคาใน QUOTE BAND — เดิม form() รันแค่ /contact
      // ทำให้ฟอร์มหน้าแรกกดส่งไม่ได้เลย
      if (pathname === "/contact" || pathname === "/") safe(form);
      if (pathname === "/products") safe(productFilter);
      // เช็คแบบนี้เพราะ "/products" ก็ startsWith("/product") เหมือนกัน
      if (pathname === "/product" || pathname.startsWith("/product/")) {
        safe(productGallery);
        safe(productTabs);
      }
      if (pathname === "/articles") safe(articleFilter);
      if (pathname === "/standards") safe(standardsModal);
      if (pathname === "/services" || pathname === "/engineering") safe(servicesModal);
    };
    const t = setTimeout(run, 30);
    return () => { clearTimeout(t); clearTimers(); clearObservers(); clearDisposers(); };
  }, [pathname]);
  return null;
}
