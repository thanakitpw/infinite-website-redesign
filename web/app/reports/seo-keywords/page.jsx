/* หน้ารายงานแผนคีย์เวิร์ดสำหรับส่งลูกค้าดู ไม่ใช่หน้าเว็บหน้าบ้าน
   ปิด index ไว้ ไม่อยู่ใน sitemap ไม่ผ่าน CMS และไม่ติดปุ่ม LINE (ดู site-chrome.jsx) */

export const metadata = {
  title: "แผนคีย์เวิร์ด SEO | Infinite Material & Technology",
  description: "รายการคีย์เวิร์ดและหน้าเป้าหมายของเว็บ infinitematerialtech.com",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const HTML = `
<style>
#kw{
  --ground:#fafbfa; --surface:#ffffff; --surface-2:#f3f6f3; --ink:#1a221c; --ink-2:#4f5b53; --ink-3:#7c8a81;
  --line:#e1e7e2; --accent:#018438; --accent-soft:#e6f4ea;
  --tech:#4c6a7d; --tech-soft:#e8eff4; --law:#9c6a17; --law-soft:#fbf1dc; --know:#5b5f8a; --know-soft:#ececf6;
  background:var(--ground); color:var(--ink); font-family:'IBM Plex Sans Thai',system-ui,sans-serif;
  font-size:15.5px; line-height:1.78; -webkit-font-smoothing:antialiased; min-height:100vh;
}
#kw h1,#kw h2{font-family:'Anuphan','IBM Plex Sans Thai',sans-serif; text-wrap:balance; margin:0}
#kw .wrap{max-width:1040px; margin:0 auto; padding:0 24px}
#kw section{padding:44px 0 4px}
#kw .sec-head h2{font-size:24px; font-weight:700; letter-spacing:-.3px; line-height:1.35; margin-bottom:6px}
#kw .sec-lead{color:var(--ink-2); margin:6px 0 22px; max-width:68ch}
#kw .rule{height:1px; background:var(--line); border:0; margin:0}

#kw .mast{padding:54px 0 36px}
#kw .eyebrow{font-family:'IBM Plex Mono',monospace; font-size:11.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); font-weight:600; margin-bottom:14px}
#kw .mast h1{font-size:38px; font-weight:700; letter-spacing:-.8px; line-height:1.22; max-width:20ch}
#kw .mast p{color:var(--ink-2); font-size:16.5px; margin:14px 0 0; max-width:62ch}
#kw .meta{display:flex; flex-wrap:wrap; margin:28px 0 0; border:1px solid var(--line); border-radius:10px; background:var(--surface); overflow:hidden}
#kw .meta div{padding:13px 20px; flex:1 1 150px; border-inline-end:1px solid var(--line)}
#kw .meta div:last-child{border-inline-end:0}
#kw .meta dt{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-3); margin:0 0 3px}
#kw .meta dd{margin:0; font-size:14.5px; font-weight:500}

#kw .rules{list-style:none; padding:0; margin:0; display:grid; grid-template-columns:repeat(3,1fr); gap:14px}
#kw .rules li{background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:18px 20px 16px}
#kw .rules b{display:block; font-family:'Anuphan',sans-serif; font-size:16px; font-weight:700; margin-bottom:6px}
#kw .rules span{color:var(--ink-2); font-size:14.5px; line-height:1.7}

#kw .legend{display:flex; flex-wrap:wrap; gap:8px 18px; margin:0 0 14px; font-size:13.5px; color:var(--ink-2); align-items:center}
#kw .legend span{display:inline-flex; align-items:center; gap:7px}

#kw .tw{overflow-x:auto; border:1px solid var(--line); border-radius:12px; background:var(--surface)}
#kw table{border-collapse:collapse; width:100%; min-width:680px; font-size:14px}
#kw th,#kw td{text-align:start; padding:11px 15px; border-bottom:1px solid var(--line); vertical-align:top}
#kw th{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-3); font-weight:600; background:var(--surface-2); white-space:nowrap}
#kw tr:last-child td{border-bottom:0}
#kw td.k{font-weight:500}
#kw td.u{font-family:'IBM Plex Mono',monospace; font-size:12.5px; color:var(--accent)}
#kw td.n{font-family:'IBM Plex Mono',monospace; font-variant-numeric:tabular-nums; color:var(--ink-3); white-space:nowrap}
#kw td.sub{color:var(--ink-2); font-size:13.5px}
#kw .tag{font-family:'IBM Plex Mono',monospace; font-style:normal; font-size:10.5px; padding:2px 7px; border-radius:4px; white-space:nowrap; font-weight:600}
#kw .tag.buy{background:var(--accent-soft); color:var(--accent)}
#kw .tag.tech{background:var(--tech-soft); color:var(--tech)}
#kw .tag.law{background:var(--law-soft); color:var(--law)}
#kw .tag.know{background:var(--know-soft); color:var(--know)}

#kw .note{border:1px solid var(--line); border-inline-start:3px solid var(--accent); background:var(--surface); border-radius:10px; padding:16px 20px; margin:22px 0 0; font-size:14.5px; color:var(--ink-2)}
#kw .note b{color:var(--ink); font-weight:600}
#kw footer{padding:40px 0 56px; color:var(--ink-3); font-size:13px; border-top:1px solid var(--line); margin-top:48px}
#kw footer p{margin:0 0 6px}
@media (max-width:820px){ #kw .rules{grid-template-columns:1fr} #kw .mast h1{font-size:30px} }
</style>

<div id="kw">
<div class="wrap mast">
  <div class="eyebrow">SEO Keyword Plan · ก.ย. 2569</div>
  <h1>คีย์เวิร์ด SEO เว็บ infinitematerialtech.com</h1>
  <p>รายการคำค้นที่วางแผนให้เว็บติดอันดับ พร้อมหน้าเป้าหมายของแต่ละคำ และคีย์เวิร์ดของบทความทั้ง 12 บทที่กำลังเขียน</p>
  <dl class="meta">
    <div><dt>จัดทำสำหรับ</dt><dd>Infinite Material &amp; Technology</dd></div>
    <div><dt>วันที่</dt><dd>10 ก.ย. 2569</dd></div>
    <div><dt>คีย์เวิร์ดหลัก</dt><dd>16 คำ · 16 หน้าเป้าหมาย</dd></div>
    <div><dt>บทความ</dt><dd>12 บท · 12 คีย์เวิร์ดหลัก</dd></div>
  </dl>
</div>

<hr class="rule">

<section><div class="wrap">
  <div class="sec-head"><h2>หลักที่ใช้เลือกคีย์เวิร์ด</h2></div>
  <ul class="rules">
    <li><b>หนึ่งคำหลักต่อหนึ่งหน้า</b><span>แต่ละคีย์เวิร์ดมีหน้าเป้าหมายหน้าเดียว เพื่อไม่ให้หน้าในเว็บเดียวกันแย่งอันดับกันเอง</span></li>
    <li><b>เก็บคำที่ชนะได้เร็วก่อน</b><span>ชื่อสินค้าอย่าง Mandolite CP-2, Fendolite M II, Neocoat, อินทนิล แทบไม่มีคู่แข่ง ติดอันดับหนึ่งได้เร็วและได้ลูกค้าที่ตั้งใจซื้อ</span></li>
    <li><b>คำใหญ่ใช้เวลา</b><span>กลุ่มคำ "สีกันไฟ" ต้องแข่งกับ TOA ซึ่งลงเนื้อหาไว้มาก จะเห็นผลหลังสะสมน้ำหนักจากบทความและคำเล็กก่อน</span></li>
  </ul>
</div></section>

<section><div class="wrap">
  <div class="sec-head"><h2>คีย์เวิร์ดหลักและหน้าเป้าหมาย</h2></div>
  <p class="sec-lead">คู่แข่งที่ระบุมาจากการตรวจผลค้นหาจริงใน Google ปริมาณการค้นหาของแต่ละคำจะยืนยันอีกครั้งด้วย Google Keyword Planner ก่อนเริ่มงานออนเพจ</p>
  <div class="legend">
    <span><i class="tag buy">ซื้อ</i> คนที่กำลังหาซื้อสินค้า</span>
    <span><i class="tag tech">บริการ</i> คนที่ต้องการวิศวกรรับรอง</span>
    <span><i class="tag know">ความรู้</i> คนที่กำลังหาข้อมูลก่อนตัดสินใจ</span>
    <span><i class="tag law">กฎหมาย</i> คนที่ต้องทำตามข้อกำหนด</span>
  </div>
  <div class="tw"><table>
    <thead><tr><th>คีย์เวิร์ดหลัก</th><th>ประเภท</th><th>หน้าเป้าหมาย</th><th>คู่แข่งที่พบบนหน้าแรก</th></tr></thead>
    <tbody>
      <tr><td class="k">สีกันไฟ · สีทนไฟ</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/neocoat-intumescent-paint-s</td><td class="sub">TOA Fire Shield, Yamamoto, Duracrete</td></tr>
      <tr><td class="k">สีกันไฟโครงสร้างเหล็ก</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/neocoat-intumescent-paint-s</td><td class="sub">TOA, Pro-Act</td></tr>
      <tr><td class="k">สีกันไฟ ราคา · ราคาต่อตารางเมตร</td><td><span class="tag buy">ซื้อ</span></td><td class="u">บทความ 1 → หน้าสินค้า Neocoat</td><td class="sub">TOA ลงราคาไว้ชัด</td></tr>
      <tr><td class="k">สีกันไฟสูตรน้ำ · Low VOC</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/neocoat-intumescent-paint-w</td><td class="sub">TOA Fire Shield</td></tr>
      <tr><td class="k">สีทับหน้า สีกันไฟ</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/neogloss-enamel + บทความ 6</td><td class="sub">ยังไม่ได้สำรวจ</td></tr>
      <tr><td class="k">ซีเมนต์พ่นกันไฟ · Mandolite CP-2</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/mandolite-cp2</td><td class="sub">แทบไม่มี · เก็บได้เร็วที่สุด</td></tr>
      <tr><td class="k">Fendolite M II</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/fendolite-m2</td><td class="sub">แทบไม่มี</td></tr>
      <tr><td class="k">ผ้ากันไฟ · ผ้ากันสะเก็ดไฟ</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/fiberglass-cloth</td><td class="sub">ร้านอุปกรณ์งานเชื่อม</td></tr>
      <tr><td class="k">สีสะท้อนความร้อนหลังคา</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/roof-shield-ceramic</td><td class="sub">TOA, Jotun, Nippon</td></tr>
      <tr><td class="k">ทินเนอร์ 3A · น้ำมันสน อินทนิล</td><td><span class="tag buy">ซื้อ</span></td><td class="u">/product/thinner-3a-intanin</td><td class="sub">ร้านค้าปลีก, มาร์เก็ตเพลส</td></tr>
      <tr><td class="k">วุฒิวิศวกรรับรองสีกันไฟ</td><td><span class="tag tech">บริการ</span></td><td class="u">/services/fireproof-certification</td><td class="sub">น้อยมาก · มูลค่างานสูงสุด</td></tr>
      <tr><td class="k">วิศวกรควบคุมงาน น.4-5 · น.4-9</td><td><span class="tag tech">บริการ</span></td><td class="u">/services/fireproof-supervision</td><td class="sub">น้อยมาก</td></tr>
      <tr><td class="k">ผู้รับเหมาทาสีกันไฟ</td><td><span class="tag tech">บริการ</span></td><td class="u">บทความ 12 → หน้าบริการ</td><td class="sub">ยังไม่ได้สำรวจ</td></tr>
      <tr><td class="k">ISO 834 · ASTM E119 คืออะไร</td><td><span class="tag know">ความรู้</span></td><td class="u">/articles/iso834-astm-e119 + /standards</td><td class="sub">น้อย</td></tr>
      <tr><td class="k">Hp/A · Section Factor</td><td><span class="tag know">ความรู้</span></td><td class="u">บทความ 3</td><td class="sub">แทบไม่มีเนื้อหาภาษาไทย</td></tr>
      <tr><td class="k">กฎกระทรวง ทนไฟ โครงสร้างเหล็ก</td><td><span class="tag law">กฎหมาย</span></td><td class="u">บทความ 2 + /standards</td><td class="sub">เว็บราชการ, บล็อกผู้รับเหมา</td></tr>
    </tbody>
  </table></div>
</div></section>

<section><div class="wrap">
  <div class="sec-head"><h2>คีย์เวิร์ดของบทความทั้ง 12 บท</h2></div>
  <p class="sec-lead">คีย์เวิร์ดหลักคือคำที่ชื่อเรื่องและย่อหน้าแรกของบทเขียนตอบโดยตรง คีย์เวิร์ดรองคือคำใกล้เคียงที่บทเดียวกันเก็บได้โดยไม่ต้องเขียนบทแยก</p>
  <div class="tw"><table>
    <thead><tr><th>บท</th><th>ชื่อเรื่อง</th><th>คีย์เวิร์ดหลัก</th><th>คีย์เวิร์ดรอง</th></tr></thead>
    <tbody>
      <tr><td class="n">1</td><td class="k">ราคาสีกันไฟต่อตารางเมตร คำนวณจากความหนาฟิล์ม</td><td>สีกันไฟ ราคา</td><td class="sub">ราคาสีกันไฟ ต่อตารางเมตร · สีกันไฟ ราคาต่อถัง · ค่าแรงพ่นสีกันไฟ · ประเมินราคาสีกันไฟ</td></tr>
      <tr><td class="n">2</td><td class="k">อาคาร 7 ประเภทที่กฎกระทรวงกำหนดให้กันไฟโครงสร้างเหล็ก</td><td>กฎกระทรวง ทนไฟ</td><td class="sub">กฎหมายสีกันไฟ · อาคารที่ต้องกันไฟโครงสร้างเหล็ก · อัตราการทนไฟ โครงสร้างหลัก · พ.ร.บ. ควบคุมอาคาร ทนไฟ</td></tr>
      <tr><td class="n">3</td><td class="k">ค่า Hp/A (Section Factor) และวิธีใช้กำหนดความหนาสีกันไฟ</td><td>Hp/A section factor</td><td class="sub">ค่า Hp/A คือ · Section Factor สีกันไฟ · คำนวณความหนาสีกันไฟ · ตารางความหนาสีกันไฟ</td></tr>
      <tr><td class="n">4</td><td class="k">การวัดความหนาฟิล์มแห้ง (DFT) ของสีกันไฟให้ผ่านการตรวจรับ</td><td>DFT วัดความหนาสี</td><td class="sub">ความหนาฟิล์มแห้ง สีกันไฟ · เกจวัดความหนาสี · ตรวจรับงานสีกันไฟ · Dry Film Thickness</td></tr>
      <tr><td class="n">5</td><td class="k">เอกสารรับรองสีกันไฟ ตั้งแต่ผลทดสอบ ISO 834 ถึงหนังสือ น.4-9</td><td>เอกสารรับรองสีกันไฟ</td><td class="sub">เอกสารส่งมอบงานสีกันไฟ · น.4-5 น.4-9 สีกันไฟ · ใบรับรองวุฒิวิศวกร สีกันไฟ · เอกสารขออนุญาต กนอ. วัสดุทนไฟ</td></tr>
      <tr><td class="n">6</td><td class="k">สีทับหน้าสีกันไฟ ป้องกันฟิล์มบวมและร่อนจากความชื้น</td><td>สีทับหน้า สีกันไฟ</td><td class="sub">Neogloss สีทับหน้า · สีกันไฟ บวม ร่อน · ระบบสีกันไฟ 3 ชั้น · สีน้ำมันทับหน้าเหล็ก</td></tr>
      <tr><td class="n">7</td><td class="k">ผ้ากันไฟใยแก้ว 550°C กับ 1000°C ข้อแตกต่างและการเลือกใช้ตามลักษณะงาน</td><td>ผ้ากันไฟ ราคา</td><td class="sub">ผ้ากันสะเก็ดไฟ · ผ้ากันไฟ 1000 องศา · ผ้าใยแก้วกันไฟ · ผ้ากันไฟงานเชื่อม</td></tr>
      <tr><td class="n">8</td><td class="k">การเตรียมผิวเหล็กก่อนทาสีกันไฟตามมาตรฐาน Sa 2.5 และ St 2</td><td>เตรียมผิวเหล็ก Sa 2.5</td><td class="sub">Sa 2.5 คือ · St 2 St 3 เตรียมผิว · ISO 8501-1 · พ่นทรายก่อนทาสีกันไฟ · สีรองพื้นกันสนิม สีกันไฟ</td></tr>
      <tr><td class="n">9</td><td class="k">สีกันไฟสูตรน้ำ VOC ต่ำ กับข้อกำหนดอาคารเขียว LEED และ TREES</td><td>สีกันไฟ VOC ต่ำ</td><td class="sub">สีกันไฟสูตรน้ำ · สีกันไฟ อาคารเขียว · LEED สีทาอาคาร VOC · TREES วัสดุปล่อยสารระเหยต่ำ</td></tr>
      <tr><td class="n">10</td><td class="k">สีสะท้อนความร้อนหลังคาโรงงาน วิธีคำนวณระยะคืนทุนจากค่าไฟ</td><td>สีสะท้อนความร้อน คุ้มไหม</td><td class="sub">สีสะท้อนความร้อนหลังคา ระยะคืนทุน · สีเซรามิคกันร้อน โรงงาน · ลดค่าไฟ โรงงาน หลังคา · Roof Shield</td></tr>
      <tr><td class="n">11</td><td class="k">ทินเนอร์ 3A ทินเนอร์ 2K และน้ำมันสน การเลือกใช้ให้ตรงกับประเภทงานสี</td><td>ทินเนอร์ 3A กับ 2K</td><td class="sub">ทินเนอร์ 3A ใช้กับอะไร · น้ำมันสน กับ ทินเนอร์ ต่างกัน · ทินเนอร์ผสมสีอุตสาหกรรม · ทินเนอร์ อินทนิล</td></tr>
      <tr><td class="n">12</td><td class="k">ผู้รับเหมาทาสีกันไฟ 8 คำถามที่ต้องถามก่อนจ้าง</td><td>ผู้รับเหมาทาสีกันไฟ</td><td class="sub">จ้างทาสีกันไฟ · เลือกผู้รับเหมาสีกันไฟ · ใบเสนอราคาสีกันไฟ · ทาสีกันไฟ เจ้าไหนดี</td></tr>
    </tbody>
  </table></div>
  <div class="note">
    <b>ทุกบทลิงก์กลับเข้าหน้าสินค้าและหน้าบริการ</b> คนที่เข้ามาจากคำค้นความรู้ เช่น "ค่า Hp/A คือ" จะมีทางไปต่อถึงหน้า Neocoat และหน้าบริการรับรองงานในบทเดียวกัน คำเหล่านี้จึงสร้างลูกค้าได้ แม้ไม่ใช่คำที่คนพิมพ์เพื่อซื้อโดยตรง
  </div>
</div></section>

<footer><div class="wrap">
  <p>จัดทำสำหรับ Infinite Material &amp; Technology · 10 กันยายน 2569</p>
  <p>ปริมาณการค้นหาและอันดับปัจจุบันจะรายงานแยกหลังตั้งค่า Google Search Console เสร็จ</p>
</div></footer>
</div>
`;

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
