/* แหล่งข้อมูลสินค้าชุดเดียวของเว็บ — ชื่อและคำบรรยายสั้นทุกตัวคัดมาจาก
   เว็บเดิม www.infinitematerialtech.com ตรงตัว (หน้า รายละเอียด-*-<id>) ไม่ได้แต่งเพิ่ม
   ตัวเลข id ท้ายแต่ละรายการคือ id ของหน้าเดิม เก็บไว้เพื่อตามรอยกลับได้

   เนื้อหายาวของแต่ละสินค้าอยู่ใน _content/products/<slug>.html — คัดจากหน้า ข่าว-*
   ของเว็บเดิม ซึ่งเป็นที่ที่เนื้อหาสินค้าตัวจริงอยู่ (หน้า รายละเอียด-* ของเว็บเดิม
   มีแค่ชื่อกับราคา ช่องรายละเอียดถูกซ่อนด้วย class="hide") */

export const PRODUCTS = [
  {
    slug: "neocoat-intumescent-paint-s",
    oldId: 14,
    name: "สีกันไฟ Neocoat สูตรน้ำมัน Intumescent Paint-S",
    short: "สูตรน้ำมัน สีขาว น้ำหนัก 22 กก. ทาได้ 23–25 ตร.ม. หนา 500 ไมครอน",
    cat: "สีกันไฟ",
    image: "/images/neocoat-paint-s.png",
    badge: "ขายดี",
    title: "สีกันไฟ Neocoat Intumescent Paint-S สูตรน้ำมัน | ราคาโรงงาน",
    description:
      "สีกันไฟ Neocoat Intumescent Paint-S สูตรน้ำมัน (Solvent Base) 22 กก. ทาได้ 23–25 ตร.ม. ทดสอบตาม ASTM E119 · ISO 834 พร้อมเอกสารวุฒิวิศวกรโยธารับรอง",
  },
  {
    slug: "neocoat-intumescent-paint-w",
    oldId: 13,
    name: "สีกันไฟ Neocoat สูตรน้ำ Intumescent Paint-W",
    short: "สูตรน้ำ สีขาว น้ำหนัก 22 กก. ทาได้ 23–25 ตร.ม. หนา 500 ไมครอน",
    cat: "สีกันไฟ",
    image: "/images/neocoat-paint-w.png",
    title: "สีกันไฟ Neocoat Intumescent Paint-W สูตรน้ำ Low VOC | ราคาโรงงาน",
    description:
      "สีกันไฟ Neocoat Intumescent Paint-W สูตรผสมด้วยน้ำ ค่า VOC ต่ำ เหมาะกับอาคารเขียว (Green Building) ไม่ใช้ทินเนอร์เป็นตัวทำละลาย 22 กก. ทาได้ 23–25 ตร.ม.",
  },
  {
    slug: "neocoat-primer-grey-oxide",
    oldId: 11,
    name: "สีรองพื้นเทา Neocoat Primer Grey Oxide",
    short: "ทาเหล็กสีแดง และ สีเทา น้ำหนัก 25 กก. ปริมาณ 5 Gl.",
    cat: "สีรองพื้น/ทับหน้า",
    image: "/images/neocoat-primer.png",
    title: "สีรองพื้นเทา Neocoat Primer Grey Oxide 25 กก. | ราคาโรงงาน",
    description:
      "สีรองพื้นกันสนิม Neocoat Primer Grey Oxide สำหรับทาเหล็กก่อนทาสีกันไฟ มีสีแดงและสีเทา น้ำหนัก 25 กก. ปริมาณ 5 Gl.",
  },
  {
    slug: "neogloss-enamel",
    oldId: 6,
    name: "สีน้ำมันทาเหล็ก Neogloss",
    short: "Steel Surface Overlay Dosage 5 Gl.",
    cat: "สีรองพื้น/ทับหน้า",
    image: "/images/neogloss-enamel.png",
    title: "สีน้ำมันทาเหล็ก Neogloss สีทับหน้า 5 Gl. | ราคาโรงงาน",
    description:
      "สีน้ำมันทับหน้าผิวเหล็ก Neogloss (Steel Surface Overlay) ปริมาณ 5 Gl. ใช้ทับหน้าชั้นสีกันไฟเพื่อกันความชื้นและฝุ่น",
  },
  {
    slug: "thinner-3a-intanin",
    oldId: 3,
    name: "ทินเนอร์ 3A ผสมสี อินทนิล",
    short: "ผสมสีทาเหล็ก ขนาดบรรจุ 15 กก.",
    cat: "ทินเนอร์/น้ำมันสน",
    image: "/images/thinner-aaa.webp",
    title: "ทินเนอร์ AAA (3A) ผสมสี อินทนิล 15 กก. | พร้อมส่ง ราคาถูก",
    description:
      "ทินเนอร์ AAA (3A) อินทนิล คุณภาพสูง ขนาดบรรจุ 15 กก. ใช้เป็นตัวทำละลายผสมสีสูตรน้ำมัน สีรองพื้น สีทับหน้า และสีชนิดโซลเวนต์",
  },
  {
    slug: "thinner-2k",
    oldId: 21,
    name: "ทินเนอร์ 2K ทินเนอร์ 3A",
    short: "ทินเนอร์ 2K งานสีรถยนต์ · ทินเนอร์ 3A ผสมสีอุตสาหกรรม · ทินเนอร์ล้างเครื่องมือ",
    cat: "ทินเนอร์/น้ำมันสน",
    image: "/images/thinner-2k.jpg",
    title: "ทินเนอร์ 2K · ทินเนอร์ 3A ผสมสีอุตสาหกรรม | ราคาโรงงาน",
    description:
      "ทินเนอร์ 2K สำหรับงานสีรถยนต์ สีพ่นแห้งช้า กระจายตัวเรียบเนียนสม่ำเสมอ ไม่เป็นฝ้า พร้อมทินเนอร์ 3A ผสมสีอุตสาหกรรม และทินเนอร์ล้างเครื่องมือ",
  },
  {
    slug: "turpentine-intanin",
    oldId: 2,
    name: "น้ำมันสนผสมสี อินทนิล",
    short: "ผสมสีทาเหล็ก ขนาด 15 กก.",
    cat: "ทินเนอร์/น้ำมันสน",
    image: "/images/turpentine.webp",
    title: "น้ำมันสนผสมสี อินทนิล 15 กก. น้ำมันสนเชียงใหม่ | ราคาถูก",
    description:
      "น้ำมันสนผสมสี อินทนิล (น้ำมันสนเชียงใหม่) ขนาด 15 กก. ใช้เป็นตัวทำละลายผสมสีสูตรน้ำมันชนิดต่างๆ พร้อมส่ง",
  },
  {
    slug: "roof-shield-ceramic",
    oldId: 1,
    name: "สีเซรามิคสะท้อนความร้อน Roof Shield White",
    short: "สีเซรามิคโค๊ตติ้งสะท้อนความร้อน ลดความร้อนได้สูงสุด 93%",
    cat: "เซรามิคสะท้อนร้อน",
    image: "/images/roof-shield.png",
    title: "สีเซรามิคสะท้อนความร้อน Roof Shield White ลดร้อน 93% | ราคาโรงงาน",
    description:
      "สีเซรามิคโค๊ตติ้งสะท้อนความร้อน Roof Shield White อะคริลิคสูตรน้ำ สะท้อนรังสีอินฟราเรด ลดความร้อนสูงสุด 93% ลดอุณหภูมิผิวหลังคาเกิน 10 องศา ประหยัดค่าไฟกว่า 30%",
  },
  {
    slug: "mandolite-cp2",
    oldId: 15,
    name: "ซีเมนต์กันไฟ Mandolite CP-2 สำหรับภายในอาคาร",
    short: "น้ำหนัก 12.5 กก. ทนไฟได้ 1–3 ชม. สำหรับงานภายใน",
    cat: "ซีเมนต์กันไฟ",
    image: "/images/cafco-400.png",
    title: "ซีเมนต์พ่นกันไฟ Mandolite CP-2 งานภายใน ทนไฟ 1–3 ชม. | ราคาโรงงาน",
    description:
      "ซีเมนต์พ่นกันไฟ CAFCO Mandolite CP-2 ชนิด Medium density 12.5 กก. ส่วนผสมแร่เวอร์มิคูไลท์และซีเมนต์ ปราศจาก Asbestos และ Fiber ผ่านการทดสอบ U.L.",
  },
  {
    slug: "fendolite-m2",
    oldId: 18,
    name: "ซีเมนต์กันไฟ Fendolite M II",
    short: "น้ำหนัก 20 กก. ทนไฟได้ 1–3 ชม. สำหรับงานภายนอก",
    cat: "ซีเมนต์กันไฟ",
    image: "/images/fendolite-m2.png",
    title: "ซีเมนต์พ่นกันไฟ Fendolite M II งานภายนอก High density | ราคาโรงงาน",
    description:
      "ซีเมนต์พ่นกันไฟ Fendolite M II ชนิด High density 20 กก. ส่วนผสมแร่เวอร์มิคูไลท์และซีเมนต์ ปราศจาก Asbestos และ Fiber ใช้ได้กับผิวเหล็ก พื้นซีเมนต์ และช่องชาร์ปงานระบบ",
  },
  {
    slug: "fiberglass-cloth",
    oldId: 19,
    name: "ผ้ากันไฟ Fiberglass Cloth",
    short: "ขนาด กว้าง 1 ม. ยาว 1 ม. · ทนอุณหภูมิใช้งาน 550°C และ 1000°C",
    cat: "ผ้ากันไฟ",
    image: "/images/fabric-fiberglass.jpg",
    title: "ผ้ากันไฟ ผ้ากันสะเก็ดไฟ Fiberglass Cloth ทน 550°C | พร้อมส่งทั่วไทย",
    description:
      "ผ้ากันไฟ Fiberglass Cloth เนื้อสีทอง หนา 1 มม. ทอแบบซาติน ผ่านการอบ 2 ครั้ง (Double Heat Treatment) ทนความร้อน 550°C และ 1000°C ตัดเย็บตามขนาด มีบริการเจาะรูตาไก่",
  },
  /* สามตัวล่างเป็นสินค้ากลุ่ม Four Plus ของ Unique Products — ไม่มีในเว็บเดิม
     จึงไม่มี oldId ข้อมูลสเปกคัดจาก uniqueproducts.co.th/product/<slug> */
  {
    slug: "four-plus-pro-masonry-sealer",
    name: "สีรองพื้นปูน Four Plus Pro Masonry Sealer",
    short: "สีรองพื้นปูนใหม่ อะคริลิก 100% ทนด่างสูง ขนาด 18.925 ลิตร ทาได้ 150 ตร.ม./เที่ยว",
    cat: "สีน้ำพลาสติก",
    image: "/images/four-plus-masonry-sealer.webp",
    title: "สีรองพื้นปูน Four Plus Pro Masonry Sealer 18.925 ลิตร | ราคาโรงงาน",
    description:
      "สีรองพื้นปูนใหม่ Four Plus Pro Masonry Sealer อะคริลิกอิมัลชั่น 100% ทนด่างจากผนังปูนใหม่ เพิ่มการยึดเกาะให้สีทับหน้า ขนาด 18.925 ลิตร ทาได้ 150 ตร.ม. ต่อเที่ยว",
  },
  {
    slug: "four-plus-exterior",
    name: "สีน้ำพลาสติกทาภายนอก Four Plus Exterior",
    short: "อะคริลิก 100% ผิวด้าน ทนแดดทนฝน กันเชื้อราและตะไคร่น้ำ 18.925 ลิตร",
    cat: "สีน้ำพลาสติก",
    image: "/images/four-plus-exterior.webp",
    title: "สีน้ำพลาสติกทาภายนอก Four Plus Exterior 18.925 ลิตร | ราคาโรงงาน",
    description:
      "สีน้ำพลาสติกทาภายนอก Four Plus Exterior อะคริลิกอิมัลชั่น 100% ผิวด้าน ทนแดดจัด กันเชื้อราและตะไคร่น้ำ ทนด่าง ขนาด 18.925 ลิตร ทาได้ 150 ตร.ม. ต่อเที่ยว",
  },
  {
    slug: "four-plus-pro-interior",
    name: "สีน้ำพลาสติกทาภายใน Four Plus Pro Interior",
    short: "อะคริลิก 100% ผิวด้าน กันเชื้อรา ทนด่าง เฉดสีตามการ์ดสี 18.925 ลิตร",
    cat: "สีน้ำพลาสติก",
    image: "/images/four-plus-pro-interior.webp",
    title: "สีน้ำพลาสติกทาภายใน Four Plus Pro Interior 18.925 ลิตร | ราคาโรงงาน",
    description:
      "สีน้ำพลาสติกทาภายใน Four Plus Pro Interior อะคริลิกอิมัลชั่น 100% ผิวด้าน กันเชื้อรา ทนด่างจากผนังปูน เม็ดสีทนแสง ขนาด 18.925 ลิตร ทาได้ 150 ตร.ม. ต่อเที่ยว",
  },
];

export const bySlug = (slug) => PRODUCTS.find((p) => p.slug === slug);
