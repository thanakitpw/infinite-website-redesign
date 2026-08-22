/* Tailwind ใช้เฉพาะหน้าจอหลังบ้าน (app/admin) — preflight ปิดไว้เพราะเว็บหน้าบ้าน
   เป็น inline style ล้วนบน globals.css ถ้าเปิด reset ของ Tailwind จะรีเซ็ตทับจนดีไซน์เดิมพัง */
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
