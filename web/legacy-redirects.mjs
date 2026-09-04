/* URL ของเว็บเดิม (ระบบสำเร็จรูปที่ใช้พาธภาษาไทย) ทุกตัวตายตอนย้ายมา Next.js
   ทำให้แอดที่ยังชี้ URL เก่าโดน Google ตีตกด้วย HTTP 404 และลิงก์เก่าที่คนอื่น
   ทำไว้ก็ตายหมด รายการนี้คัดจาก Wayback Machine ของโดเมนเดิมทั้งหมด

   โครง URL เดิมมีสามตระกูล
     รายละเอียด-<ชื่อ>-<id>   หน้าสินค้ารายตัว — id ตรงกับ oldId ใน _data/products.js
     จำหน่ายสีกันไฟ-<ชื่อ>-<id>  หน้าหมวด (ตัวที่ขึ้นต้นด้วย "-" เฉย ๆ คือหน้าเดียวกัน
                                 เว็บเดิมมันสร้าง URL ซ้ำสองแบบ)
     ข่าว-<ชื่อ>-<id>          หน้าเนื้อหายาวของแต่ละกลุ่มสินค้า

   หน้าสินค้ารายตัวส่งไป /product/<slug> ที่เนื้อหาตรงกัน ส่วนหน้าหมวดกับหน้าข่าว
   ส่งไป landing page ของกลุ่มนั้นเพราะมีฟอร์มขอใบเสนอราคาอยู่ ตรงกับที่คนคลิกมา
   จากแอดต้องการ ตัวที่ของเลิกขายแล้ว (ฉนวน เมทัลชีท ระบบกันซึม) ส่งไป /products */
const MAP = {
  // หน้าสินค้ารายตัว
  "/รายละเอียด-สีกันไฟNeocoatสูตรน้ำมันintumescent-14": "/product/neocoat-intumescent-paint-s",
  "/รายละเอียด-สีกันไฟNeocoatสูตรน้ำintumescentPai-13": "/product/neocoat-intumescent-paint-w",
  "/รายละเอียด-สีรองพื้นเทาNeocoatPrimerGreyOxide-11": "/product/neocoat-primer-grey-oxide",
  "/รายละเอียด-สีน้ำมันทาเหล็กNeogloss-6": "/product/neogloss-enamel",
  "/รายละเอียด-ทินเนอร์3Aผสมสีอินทนิล-3": "/product/thinner-3a-intanin",
  "/รายละเอียด-ทินเนอร์2Kทินเนอร์3A-21": "/product/thinner-2k",
  "/รายละเอียด-น้ำมันสนผสมสีอินทนิล-2": "/product/turpentine-intanin",
  "/รายละเอียด-สีเซรามิคสะท้อนความร้อน-1": "/product/roof-shield-ceramic",
  "/รายละเอียด-ซีเมนต์กันไฟMandoliteCP2สำหรับภายใน-15": "/product/mandolite-cp2",
  "/รายละเอียด-ซีเมนต์กันไฟFendoliteM2-18": "/product/fendolite-m2",
  "/รายละเอียด-ผ้ากันไฟFiberglassCloth-19": "/product/fiberglass-cloth",

  // หน้าหมวดของเว็บเดิม
  "/รายละเอียด-สีกันไฟสีทนไฟ-1": "/neocoat",
  "/รายละเอียด-สีกันความร้อน-2": "/roof-shield",
  "/รายละเอียด-สีทั่วไปและสีอุตสาหกรรม-3": "/products",
  "/รายละเอียด-ซีเมนต์พ่นกันไฟ,ซีเมนต์กันไฟลาม-4": "/fireproof-cement",
  "/รายละเอียด-แผ่นหลังคาเหล็กเมทัลชีท-5": "/products",
  "/รายละเอียด-ระบบกันซึมและงานพื้น-6": "/products",
  "/รายละเอียด-ฉนวนกันความร้อน-7": "/products",

  // หน้าข่าว — เนื้อหายาวของแต่ละกลุ่ม ตรงกับ landing page ปัจจุบัน
  "/ข่าว-สีกันไฟNeocoatIntumescentPaintทาพ่น-187": "/neocoat",
  "/ข่าว-ซีเมนต์กันไฟ,ซีเมนต์กันไฟลาม-184": "/fireproof-cement",
  "/ข่าว-ผ้ากันไฟผ้ากันสะเก็ดไฟ-183": "/fire-blanket",
  "/ข่าว-สีกันความร้อนเซรามิคโค๊ตติ้ง-186": "/roof-shield",
  "/ข่าว-ทินเนอร์AAAน้ำมันสนสีอุตสาหกรรม-185": "/thinner",
  "/ข่าว-งานบริการออกแบบตรวจสอบและดัดแปลงโคร-181": "/engineering",

  // หน้าหมวดสินค้า เว็บเดิมสร้างไว้สองแบบ ทั้งมีและไม่มีคำนำหน้า "จำหน่ายสีกันไฟ"
  "/จำหน่ายสีกันไฟ-สีกันไฟNeocoatIntumescentPaint-245": "/neocoat",
  "/-สีกันไฟNeocoatIntumescentPaint-245": "/neocoat",
  "/จำหน่ายสีกันไฟ-ซีเมนต์พ่นกันไฟ-270": "/fireproof-cement",
  "/-ซีเมนต์พ่นกันไฟ-270": "/fireproof-cement",
  "/จำหน่ายสีกันไฟ-ซีเมนต์กันไฟลาม-271": "/fireproof-cement",
  "/-ซีเมนต์กันไฟลาม-271": "/fireproof-cement",
  "/จำหน่ายสีกันไฟ-ผ้ากันไฟFiberglassCloth-272": "/fire-blanket",
  "/-ผ้ากันไฟFiberglassCloth-272": "/fire-blanket",
  "/จำหน่ายสีกันไฟ-สีเซรามิคสะท้อนความร้อน-269": "/roof-shield",
  "/-สีเซรามิคสะท้อนความร้อน-269": "/roof-shield",
  "/จำหน่ายสีกันไฟ-ทินเนอร์Thiner3A-267": "/thinner",
  "/-ทินเนอร์Thiner3A-267": "/thinner",
  "/จำหน่ายสีกันไฟ-น้ำมันสน-268": "/thinner",
  "/-น้ำมันสน-268": "/thinner",
  "/จำหน่ายสีกันไฟ-สีรองพื้นทาเหล็ก-265": "/product/neocoat-primer-grey-oxide",
  "/-สีรองพื้นทาเหล็ก-265": "/product/neocoat-primer-grey-oxide",
  "/จำหน่ายสีกันไฟ-สีน้ำมันทับหน้าผิวเหล็ก-266": "/product/neogloss-enamel",
  "/-สีน้ำมันทับหน้าผิวเหล็ก-266": "/product/neogloss-enamel",

  // หน้ารวมสินค้าและหน้าทั่วไป
  "/จำหน่ายสีกันไฟ-สินค้าทั้งหมด-245": "/products",
  "/จำหน่ายสีกันไฟ-สีกันไฟ": "/products",
  "/จำหน่ายสีกันไฟ-": "/products",
  "/จำหน่ายสีกันไฟ--4": "/products",
  "/สีกันไฟ-สีกันไฟ": "/products",
  "/-สีกันไฟ": "/products",
  "/ระบบกันซึม-สีกันไฟ": "/products",
  "/สีกันความร้อน-เซรามิคโค": "/roof-shield",
  "/ฟื้นฟูผู้ป่วย-สีกันไฟ": "/",
  "/ติดต่อเรา-สีกันไฟ": "/contact",
  "/ติดต่อเรา-1": "/contact",
};

/* เว็บเดิมสนใจแค่เลข id ท้าย URL ส่วนชื่อตรงกลางเป็นของประดับ แก้ชื่อบทความ
   เมื่อไหร่ URL ก็เปลี่ยนตาม แต่หน้าเดิมยังเปิดได้ทุกแบบ แอดเก่าบางตัวเลยค้าง
   ชื่อรุ่นที่ Wayback ไม่ได้เก็บไว้ อย่าง /ข่าว-สีกันไฟสีทนไฟ-187 ที่ลูกค้าแจ้ง
   เข้ามา (ตัวที่เก็บไว้คือ /ข่าว-สีกันไฟNeocoatIntumescentPaintทาพ่น-187 หน้า
   เดียวกันคนละชื่อ) ชุดนี้เลยจับจากเลขท้ายอย่างเดียวไม่สนชื่อ กันไล่ตามทีละ URL

   ใส่เฉพาะ id ที่ไม่ซ้ำ — 1, 2, 3, 6 เว็บเดิมใช้ซ้ำทั้งหน้าสินค้าและหน้าหมวด
   ส่วน 245 ใช้ทั้งหน้ารวมสินค้าและหน้า Neocoat เดาไม่ได้ว่าชื่อที่ไม่รู้จักเป็น
   อันไหน ปล่อยให้ match ตรง ๆ ข้างบนอย่างเดียว */
const BY_ID = {
  181: "/engineering",
  183: "/fire-blanket",
  184: "/fireproof-cement",
  185: "/thinner",
  186: "/roof-shield",
  187: "/neocoat",
  265: "/product/neocoat-primer-grey-oxide",
  266: "/product/neogloss-enamel",
  267: "/thinner",
  268: "/thinner",
  269: "/roof-shield",
  270: "/fireproof-cement",
  271: "/fireproof-cement",
  272: "/fire-blanket",
  4: "/fireproof-cement",
  5: "/products",
  7: "/products",
  11: "/product/neocoat-primer-grey-oxide",
  13: "/product/neocoat-intumescent-paint-w",
  14: "/product/neocoat-intumescent-paint-s",
  15: "/product/mandolite-cp2",
  18: "/product/fendolite-m2",
  19: "/product/fiberglass-cloth",
  21: "/product/thinner-2k",
};

/* source ต้อง encodeURI ก่อน — Next.js เทียบ redirect กับพาธที่ยัง percent-encoded
   อยู่ ไม่ได้ decode ให้ก่อน ใส่ตัวอักษรไทยดิบลงไปตรง ๆ จะไม่ match สักตัว
   (ลองมาแล้ว 404 ทั้ง 52 ตัว) ส่วน destination ใส่ดิบได้เพราะเป็น ASCII ล้วน

   เว็บเดิมไม่กลับมาแล้ว ใช้ permanent เพื่อให้ค่าลิงก์เดิมไหลมาหน้าใหม่ด้วย
   ถ้าจะเติมพาธใหม่ ระวัง ":" กับ "*" — path-to-regexp อ่านเป็น pattern ไม่ใช่
   ตัวอักษรธรรมดา ชุดที่มีอยู่ตอนนี้ไม่มีสองตัวนั้นเลยใส่ตรง ๆ ได้ */
/* ลำดับสำคัญ — Next.js เอาตัวแรกที่ match ชุดที่เทียบ URL เต็มต้องมาก่อนชุดที่
   จับเลขท้าย ไม่งั้น id ที่ชื่อคนละแบบจะถูกดักไปก่อน */
export const legacyRedirects = [
  ...Object.entries(MAP).map(([source, destination]) => ({
    source: encodeURI(source),
    destination,
    permanent: true,
  })),
  ...Object.entries(BY_ID).map(([id, destination]) => ({
    source: `/:slug-${id}`,
    destination,
    permanent: true,
  })),
];
