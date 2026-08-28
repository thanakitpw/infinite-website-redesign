/* สถานะของใบขอราคา — ต้องตรงกับ check constraint ของคอลัมน์ status
   ในตาราง leads (migration 0004) เป๊ะๆ ไม่งั้น update จะเด้งที่ฝั่ง Postgres

   ไฟล์นี้ตั้งใจไม่ import อะไรจากฝั่ง server เพราะทั้ง server component
   และ client component เรียกใช้ร่วมกัน */

export const STATUSES = [
  { key: "new",       label: "ใหม่",           chip: "bg-amber-tint text-amber" },
  { key: "contacted", label: "ติดต่อแล้ว",     chip: "bg-brand-tint text-brand-dark" },
  { key: "quoted",    label: "เสนอราคาแล้ว",   chip: "bg-brand-tint text-brand-dark" },
  { key: "won",       label: "ปิดการขาย",      chip: "bg-brand text-white" },
  { key: "lost",      label: "ไม่สำเร็จ",       chip: "bg-danger-tint text-danger" },
];

export const STATUS_KEYS = STATUSES.map((s) => s.key);

export const statusOf = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];

/* ฟิลด์ที่ลูกค้ากรอกมา เรียงตามลำดับที่อยากให้อ่านในหน้ารายละเอียด
   ตัวที่ไม่มีค่าจะไม่ถูกแสดง ไม่ต้องโชว์ช่องว่างให้รก */
export const LEAD_FIELDS = [
  ["บริษัท/หน่วยงาน", "company"],
  ["LINE ID / อีเมล", "contact"],
  ["ประเภทงาน", "job_type"],
  ["พื้นที่โดยประมาณ", "area"],
  ["ชั่วโมงกันไฟ", "hours"],
  ["รายละเอียดเพิ่มเติม", "detail"],
];
