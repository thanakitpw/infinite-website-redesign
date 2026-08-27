import { PRODUCTS } from "../../app/_data/products.js";
import { SERVICES } from "../../app/_data/services.js";
import { ARTICLES } from "../../app/_content/articles/_shell.js";

/* ── ทะเบียนหน้าเว็บที่แก้ได้จากหลังบ้าน ─────────────────────────────────────
   หนึ่งหน้า = การต่อ "ชิ้นส่วน" (fragment) จาก _content ตามลำดับ ซึ่งตรงกับที่
   page.jsx แต่ละหน้าทำอยู่แล้ว ค่าที่ลูกค้าแก้ผูกกับ *ชิ้นส่วน* ไม่ใช่ *หน้า*
   เพราะ _product-head/_product-foot ใช้ร่วมกันทั้ง 14 หน้าสินค้า — แก้ครั้งเดียว
   ต้องมีผลทุกหน้าที่ใช้ไฟล์นั้นจริง ไม่ใช่หน้าที่เผอิญเปิดอยู่

   ข้อจำกัดที่ต้องรู้: เว็บนี้ก๊อปเมนู/ส่วนท้ายไว้ในไฟล์ของแต่ละหน้าเอง (home.html
   มีเมนูของตัวเอง about.html ก็มีของตัวเอง) การแก้เบอร์โทรบนหน้าแรกจึงไม่ลาม
   ไปหน้าอื่น เรื่องนี้แก้ที่เฟส "ตั้งค่าเว็บไซต์" ซึ่งจะดึงค่าร่วมออกมาที่เดียว */

export const SHARED_FRAGMENTS = new Set(["_product-head.html", "_product-foot.html"]);

const MAIN = [
  ["home", "หน้าแรก", "/", "home.html"],
  ["products", "สินค้าทั้งหมด", "/products", "products.html"],
  ["services", "บริการด้านวิศวกรรม", "/services", "services.html"],
  ["standards", "มาตรฐานและการรับรอง", "/standards", "standards.html"],
  ["articles", "บทความ", "/articles", "articles.html"],
  ["about", "เกี่ยวกับเรา", "/about", "about.html"],
  ["contact", "ติดต่อเรา", "/contact", "contact.html"],
];

const LANDING = [
  ["neocoat", "สีกันไฟ NEOCOAT", "/neocoat", "neocoat.html"],
  ["four-plus", "สีน้ำพลาสติก Four Plus", "/four-plus", "lp/four-plus.html"],
  ["thinner", "ทินเนอร์/น้ำมันสน", "/thinner", "lp/thinner.html"],
  ["fireproof-cement", "ซีเมนต์กันไฟ", "/fireproof-cement", "lp/fireproof-cement.html"],
  ["fire-blanket", "ผ้ากันไฟ", "/fire-blanket", "lp/fire-blanket.html"],
  ["roof-shield", "Roof Shield", "/roof-shield", "lp/roof-shield.html"],
  ["engineering", "งานวิศวกรรม", "/engineering", "lp/engineering.html"],
];

export const PAGES = [
  ...MAIN.map(([key, label, url, frag]) => ({
    key, label, url, group: "main", groupLabel: "หน้าเว็บหลัก", fragments: [frag],
  })),
  ...LANDING.map(([key, label, url, frag]) => ({
    key, label, url, group: "landing", groupLabel: "แลนดิ้งเพจ", fragments: [frag],
  })),
  ...SERVICES.map((s) => ({
    key: `service/${s.slug}`,
    label: s.name,
    url: `/services/${s.slug}`,
    group: "service",
    groupLabel: "หน้าบริการ",
    fragments: ["_product-head.html", `services/${s.slug}.html`, "_product-foot.html"],
  })),
  ...PRODUCTS.map((p) => ({
    key: `product/${p.slug}`,
    label: p.name,
    url: `/product/${p.slug}`,
    group: "product",
    groupLabel: "หน้าสินค้า",
    fragments: ["_product-head.html", `products/${p.slug}.html`, "_product-foot.html"],
  })),
  ...ARTICLES.map((a) => ({
    key: `article/${a.slug}`,
    label: a.title,
    url: `/articles/${a.slug}`,
    group: "article",
    groupLabel: "บทความ",
    /* เมนูกับส่วนท้ายของหน้าบทความถูกประกอบใน _shell.js ด้วย template string
       ไม่ใช่ไฟล์ HTML จึงยังแก้จากหลังบ้านไม่ได้ในเฟสนี้ — เนื้อบทความแก้ได้ */
    fragments: [`articles/${a.slug}.html`],
  })),
];

const BY_KEY = Object.fromEntries(PAGES.map((p) => [p.key, p]));
export const pageByKey = (key) => BY_KEY[key] || null;

export const GROUPS = [
  { id: "main", label: "หน้าเว็บหลัก" },
  { id: "landing", label: "แลนดิ้งเพจ" },
  { id: "service", label: "หน้าบริการ" },
  { id: "product", label: "หน้าสินค้า" },
  { id: "article", label: "บทความ" },
];
