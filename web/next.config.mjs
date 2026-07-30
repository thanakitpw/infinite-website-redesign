/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // หน้า landing ย้ายจาก /landing มาเป็น /neocoat — กันลิงก์เก่าที่อาจถูกตั้งไว้
      // ในแอดหรือ bookmark แล้วตาย ใช้ 307 ชั่วคราวไว้ก่อน ถ้าแน่ใจว่าไม่มีใคร
      // ชี้ /landing แล้วค่อยเปลี่ยนเป็น permanent: true
      { source: "/landing", destination: "/neocoat", permanent: false },
    ];
  },
};
export default nextConfig;
