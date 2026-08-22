# Prompts สำหรับออกแบบระบบหลังบ้าน (CMS) ใน Google Stitch

ชุด prompt สำหรับให้ Google Stitch ออกแบบหน้าจอระบบหลังบ้านของ
**Infinite Material & Technology** ที่ให้ลูกค้าแก้ข้อความและรูปภาพเองได้ทั้งเว็บ
ทุก prompt อิงจากโครงเว็บจริงในโปรเจคนี้ (Next.js 14 · `web/app/`)

---

## วิธีใช้ไฟล์นี้

1. **ทำทีละหน้าจอ** — Stitch ให้ผลดีที่สุดเมื่อ prompt ครอบคลุม 1 หน้าจอ ไม่ใช่ทั้งระบบรวดเดียว
2. **เริ่มที่ Prompt 0 เสมอ** เพื่อวาง design system ก่อน แล้วหน้าถัดไปทุกอันขึ้นต้นด้วย
   `Same design system, sidebar and top bar as the previous screen.` ในโปรเจคเดียวกัน
3. **เขียน prompt เป็นอังกฤษ แต่บังคับให้ UI เป็นไทย** — Stitch ตีความอังกฤษแม่นกว่ามาก
   ทุก prompt จึงมีบรรทัด `ALL UI text must be in Thai` และใส่คำไทยจริงที่ต้องการให้แล้ว
4. **หน้าซับซ้อน (Prompt 3) ให้ใช้ Experimental mode** (Gemini 2.5 Pro) ส่วนหน้าอื่นใช้ Standard mode พอ
5. **แก้ด้วยประโยคสั้นต่อท้าย** ไม่ต้องเขียน prompt ใหม่ทั้งก้อน เช่น
   `Make the right panel wider and add a sticky save bar at its bottom.`
6. **แนบภาพหน้าเว็บจริง** (screenshot หน้าแรกของเว็บ) เป็น reference image ได้ ช่วยให้โทนสีตรงขึ้น
7. ถ้าผลลัพธ์รกหรือหลุดโครง ให้ตัด prompt นั้นเป็นสองท่อน: ท่อนแรก layout+navigation, ท่อนสองเนื้อหาใน main content

---

## ขอบเขตที่ระบบต้องครอบคลุม (นับจากเว็บจริง)

| ส่วน | ของจริงในโปรเจค | จำนวน |
|---|---|---|
| หน้าเว็บหลัก | หน้าแรก, สินค้า, บริการ, มาตรฐาน, บทความ, เกี่ยวกับเรา, ติดต่อ | 7 |
| หน้าแลนดิ้ง | neocoat, four-plus, thinner, fireproof-cement, fire-blanket, roof-shield, engineering | 7 |
| สินค้า | `_data/products.js` + `_content/products/*.html` | 14 |
| บทความ | `_content/articles/*.html` | 7 |
| รูปภาพ | `public/images/` (+ articles, clients, gallery) | ~60 |
| ใบขอราคา | `app/api/quote` → name, phone, company, contact, jobType, area, hours, detail, source | – |
| ค่าคงที่ทั้งเว็บ | เบอร์โทร 3 เบอร์, อีเมล, เวลาทำการ, LINE, เมนู, ส่วนท้าย | – |

---

## Prompt 0 — Design system + หน้าแดชบอร์ด

```
Design a desktop web admin dashboard (a content management system) for "Infinite Material & Technology", a Thai manufacturer of fireproof paint for steel structures. The system lets non-technical office staff edit the text and images of every page on the company website by themselves.

STYLE: clean, professional, calm and data-dense. Light theme, 1440px desktop. Brand deep green #018438 for primary buttons and active states. Dark forest green #06351F for the sidebar. Text #0E1A14, secondary text #5C6B62, borders #E7EAE4, page background #F6F8F5, white cards with 12px radius and very soft shadows. Font: IBM Plex Sans Thai. Use small uppercase monospace labels (IBM Plex Mono, 11px, letter-spacing) for metadata such as URLs and timestamps. 8px spacing grid, generous white space, no gradients, no illustrations.

ALL UI text must be in Thai.

LAYOUT: fixed dark green sidebar 260px wide, company logo and the name "INFINITE MATERIAL" at the top, then menu items with line icons: แดชบอร์ด (active), หน้าเว็บไซต์, สินค้า, บทความ, คลังรูปภาพ, ใบขอราคา, ตั้งค่าเว็บไซต์. At the bottom of the sidebar a user row: avatar, "คุณสมชาย", "ผู้ดูแลระบบ", and a log-out icon.

Top bar (white, 64px): page title "แดชบอร์ด" on the left; on the right a ghost button "ดูเว็บไซต์จริง" with an external-link icon, a bell icon with a red dot, and a green primary button "เผยแพร่การเปลี่ยนแปลง" with a small white counter chip showing "3".

MAIN CONTENT: a row of 4 stat cards — หน้าเว็บทั้งหมด 15, สินค้า 14, บทความ 7, ใบขอราคาใหม่ 5 — each with a line icon and a small green "+2 สัปดาห์นี้" delta.
Below, a two-column layout. Left column (2/3): a card titled "แก้ไขล่าสุด" listing 6 rows, each with a small page thumbnail, the Thai page name, its URL in monospace, the editor's name, a relative timestamp, and a "แก้ไข" text link on the right.
Right column (1/3): two stacked cards — "ใบขอราคาล่าสุด" with 4 compact rows (customer name, phone number, product of interest, time ago, and an unread green dot), and "ทางลัด" containing 4 large icon buttons in a 2x2 grid: แก้ไขหน้าแรก, เพิ่มสินค้าใหม่, อัปโหลดรูปภาพ, เขียนบทความ.
```

---

## Prompt 1 — หน้าเข้าสู่ระบบ

```
Same visual style, colors and fonts as the previous screen. ALL UI text must be in Thai.

Design a login screen for the same admin system. Split layout: the left 55% is a dark forest green #06351F panel with a subtle photo of a steel structure at 15% opacity, the company logo, the headline "ระบบจัดการเนื้อหาเว็บไซต์" and a subline "แก้ไขข้อความและรูปภาพได้เองทุกหน้า ไม่ต้องรอโปรแกรมเมอร์". The right 45% is white and centered: heading "เข้าสู่ระบบ", an email field labelled "อีเมล", a password field labelled "รหัสผ่าน" with a show/hide eye icon, a "จำฉันไว้" checkbox on the left and a "ลืมรหัสผ่าน?" link on the right, a full-width green button "เข้าสู่ระบบ", and small grey helper text at the bottom "มีปัญหาการเข้าใช้งาน ติดต่อผู้ดูแลระบบ 02-041-0119". Show one field in an error state with red text below it: "อีเมลหรือรหัสผ่านไม่ถูกต้อง".
```

---

## Prompt 2 — รายการหน้าเว็บทั้งหมด

```
Same design system, sidebar and top bar as the previous screen, with "หน้าเว็บไซต์" active in the sidebar. ALL UI text must be in Thai.

Design a page-list screen. Above the table: a search input with a magnifier icon and placeholder "ค้นหาหน้าเว็บ", three filter pills (ทั้งหมด · เผยแพร่แล้ว · มีร่างที่ยังไม่เผยแพร่), and a sort dropdown "แก้ไขล่าสุด".

A white card containing a table with the columns: ชื่อหน้า, ประเภท, จำนวนบล็อก, แก้ไขล่าสุด, สถานะ, and an actions column.
Each row shows a 40x28px page thumbnail, the Thai page name in bold and its URL underneath in small monospace grey.
Rows to show: หน้าแรก /, สินค้าทั้งหมด /products, บริการ /services, มาตรฐานและการรับรอง /standards, บทความ /articles, เกี่ยวกับเรา /about, ติดต่อเรา /contact, สีกันไฟ NEOCOAT /neocoat, สีน้ำ Four Plus /four-plus, ทินเนอร์ /thinner, ซีเมนต์กันไฟ /fireproof-cement, ผ้ากันไฟ /fire-blanket, Roof Shield /roof-shield, งานวิศวกรรม /engineering.
The ประเภท column uses small grey outline badges: หน้าหลัก or แลนดิ้งเพจ.
The สถานะ column uses pill badges: green "เผยแพร่แล้ว" or amber "มีร่าง 2 จุด".
The actions column has a green text button "แก้ไข", an eye icon "ดูตัวอย่าง", and a three-dot menu.
Group the landing pages under a small section divider row labelled "แลนดิ้งเพจสินค้า".
```

---

## Prompt 3 — หน้าแก้ไขเนื้อหา (หัวใจของระบบ) ★ ใช้ Experimental mode

```
Same design system as the previous screen. ALL UI text must be in Thai. This is the most important screen — make the three panels clearly separated with 1px #E7EAE4 dividers.

Design a visual page editor with three panels, no left sidebar (it is collapsed to a 64px icon rail).

Top bar: a back arrow with "กลับไปหน้ารายการ", the page name "หน้าแรก" with its URL "/" in monospace next to it, an amber chip "ยังไม่ได้เผยแพร่ 3 จุด" in the middle, and on the right: a "ดูตัวอย่าง" ghost button, a "ประวัติการแก้ไข" clock icon, and a green button "เผยแพร่".

LEFT PANEL (280px, white): a heading "บล็อกในหน้านี้" with an "+ เพิ่มบล็อก" text button, then a vertical list of draggable rows, each with a grip-dots handle on the left, a tiny block-type icon, the Thai block name, and an eye icon on the right to hide the block. The list: แถบติดต่อด้านบน, เมนูหลัก, สไลด์แบนเนอร์ (3 สไลด์), แถวหมวดสินค้า, แถบความน่าเชื่อถือ, สินค้าขายดี, แบนเนอร์โปรโมต, วิดีโอแนะนำ, บทความน่ารู้, ทำไมต้องเลือกเรา, ขั้นตอนการทำงาน, แถบขอใบเสนอราคา, ส่วนท้ายเว็บไซต์. The row "สไลด์แบนเนอร์" is selected with a light green background and a green left border. Two rows show a small amber dot meaning unsaved changes.

CENTER PANEL (flexible, grey #F6F8F5 background): a device toggle at the top (desktop / tablet / mobile icons, desktop active) and a zoom dropdown "100%". Below it, a live preview of the website homepage inside a light browser frame — a dark green hero banner with a Thai headline, a green badge, two buttons, and a photo background. The currently selected hero section is outlined with a 2px green border and has a small floating green chip at its top-left reading "กำลังแก้ไข: สไลด์แบนเนอร์". Other sections below are dimmed slightly, and hovering one shows a grey outline with a pencil icon.

RIGHT PANEL (380px, white): a tab bar at the top with three tabs — เนื้อหา (active), รูปภาพ, SEO. Under the เนื้อหา tab, the fields for the selected banner slide: a slide selector (three small numbered thumbnails, slide 1 selected); a text input "ป้ายกำกับเล็ก" with value "มาตรฐาน ISO 834 · ASTM E119"; a two-line textarea "หัวข้อใหญ่" with value "สีกันไฟโครงสร้างเหล็ก ทนไฟนาน 1–2 ชม. ราคาโรงงาน" and a character counter "62/90" underneath; a textarea "คำอธิบาย" with a counter; a labelled group "ปุ่มที่ 1" containing a text field "ข้อความบนปุ่ม" and a link field "ลิงก์ปลายทาง" with a chain icon; the same group for "ปุ่มที่ 2"; then an image field "รูปพื้นหลัง" showing a 100x64 thumbnail with the file name in monospace, a "เปลี่ยนรูป" outline button and a small grey link "แก้ไขข้อความ ALT".
At the very bottom of the right panel, a sticky white bar with a grey "ยกเลิก" button and a green "บันทึกร่าง" button, plus tiny grey text "บันทึกอัตโนมัติเมื่อ 2 นาทีที่แล้ว".
```

---

## Prompt 4 — หน้าต่างเลือกรูปภาพ (Media picker modal)

```
Same design system as the previous screen. ALL UI text must be in Thai.

Design a modal dialog for choosing an image, shown over the page editor which is dimmed behind it. The modal is 1000x680px, white, 16px radius, centered.

Header: title "เลือกรูปภาพ" and a close X. Under it two tabs: คลังรูปภาพ (active) and อัปโหลดรูปใหม่. A toolbar with a search field "ค้นหาชื่อไฟล์", a category dropdown "ทุกหมวด" (options implied: สินค้า, หน้างาน, ใบรับรอง, ลูกค้า, แบนเนอร์), and a small grid/list toggle.

Body: a 5-column grid of image cards. Each card is a square thumbnail with, on hover, a dark overlay and a magnifier icon; under it the file name in small monospace and the dimensions in grey, e.g. "hero-fire-protection.webp · 1600x900". One card is selected with a 2px green border and a green check circle in the top-right corner. Show around 15 cards using realistic industrial subjects: steel beams, paint buckets, engineers inspecting, warehouses, certificates.

Right side of the body (280px column, separated by a divider): details of the selected image — a larger preview, the file name, size "248 KB", dimensions, upload date, a required text field "ข้อความ ALT (สำหรับ SEO)" with a value in Thai and helper text "อธิบายภาพสั้น ๆ ช่วยให้ Google เข้าใจรูป", and a red text link "ลบรูปนี้".

Footer bar: on the left small grey text "เลือกแล้ว 1 รูป", on the right a "ยกเลิก" ghost button and a green "ใช้รูปนี้" button.

Also show, as a second variant of the same modal, the อัปโหลดรูปใหม่ tab: a large dashed-border drop zone with a cloud-upload icon, the text "ลากไฟล์มาวางที่นี่ หรือ เลือกไฟล์จากเครื่อง", helper text "รองรับ JPG, PNG, WEBP ขนาดไม่เกิน 5 MB", and below it two rows showing files uploading with green progress bars.
```

---

## Prompt 5 — คลังรูปภาพ

```
Same design system, sidebar and top bar as before, with "คลังรูปภาพ" active. ALL UI text must be in Thai.

Design a media library screen. Top row: the heading "คลังรูปภาพ", a grey caption "ทั้งหมด 62 รูป · ใช้พื้นที่ 148 MB", and on the right a green button "+ อัปโหลดรูปภาพ".

A horizontal row of folder chips with counts: ทั้งหมด 62, สินค้า 18, หน้างาน 14, ใบรับรอง 6, โลโก้ลูกค้า 12, แบนเนอร์ 9, บทความ 3. Below, a search field and a sort dropdown "ใหม่ล่าสุด".

Main area: a 6-column grid of square image cards with the file name and dimensions underneath. Each card shows a checkbox in the top-left on hover. Three cards are checked, which reveals a floating dark action bar at the bottom center of the screen: "เลือกแล้ว 3 รูป" with the buttons ย้ายไปโฟลเดอร์, ดาวน์โหลด, and a red ลบ.

Show one card with an amber warning triangle and a tooltip "ยังไม่มีข้อความ ALT" to encourage filling it in.
```

---

## Prompt 6 — จัดการสินค้า (รายการ + ฟอร์มแก้ไข)

```
Same design system, sidebar and top bar as before, with "สินค้า" active. ALL UI text must be in Thai. Design TWO screens side by side in one flow.

SCREEN A — product list: heading "สินค้า" with caption "14 รายการ" and a green button "+ เพิ่มสินค้าใหม่". A row of category filter pills: ทั้งหมด, สีกันไฟ, สีรองพื้น/ทับหน้า, ซีเมนต์กันไฟ, ผ้ากันไฟ, เซรามิคสะท้อนร้อน, ทินเนอร์/น้ำมันสน, สีน้ำพลาสติก. A white card with a table: columns รูป, ชื่อสินค้า, หมวดหมู่, ป้าย, สถานะ, แก้ไขล่าสุด, actions. Rows show a paint-bucket product photo, the Thai product name in bold with a grey one-line description underneath, a category badge, a red "ขายดี" badge on two rows, a green "แสดงบนเว็บ" toggle switch, and a "แก้ไข" link. Use real-sounding rows such as "สีกันไฟ Neocoat สูตรน้ำมัน Intumescent Paint-S", "สีกันไฟ Neocoat สูตรน้ำ Intumescent Paint-W", "สีรองพื้นเทา Neocoat Primer Grey Oxide", "Fendolite M2 ซีเมนต์พ่นกันไฟ", "ผ้าไฟเบอร์กลาส กันไฟ", "ทินเนอร์ 3A อินทนิล".

SCREEN B — product edit form: a back link "กลับไปรายการสินค้า" and the title "แก้ไขสินค้า". Two columns. The left column (2/3) is a white card with a tab bar — ข้อมูลสินค้า (active), รายละเอียดแบบยาว, SEO — and the fields: ชื่อสินค้า (text), คำโปรยสั้น (textarea with a 120-character counter), หมวดหมู่ (dropdown), ป้ายกำกับ (dropdown: ไม่มี / ขายดี / สินค้าใหม่ / แนะนำ), ลิงก์ของหน้า (a URL field prefixed with the grey monospace text "infinitematerialtech.com/product/"), and ราคา (text with a "ติดต่อสอบถาม" checkbox next to it).
The right column (1/3) has two stacked cards: "รูปสินค้า" showing a large square image placeholder with a "เปลี่ยนรูป" button and a "+ เพิ่มรูปเพิ่มเติม" dashed slot; and "การแสดงผล" with a "แสดงบนเว็บไซต์" toggle, a "แสดงในสินค้าขายดีหน้าแรก" toggle, and a numeric "ลำดับการแสดง" field.
A sticky bottom bar spanning the content: on the left a red text link "ลบสินค้านี้", on the right "ดูตัวอย่าง", "บันทึกร่าง" and a green "บันทึกและเผยแพร่".
```

---

## Prompt 7 — เขียน/แก้ไขบทความ

```
Same design system, sidebar and top bar as before, with "บทความ" active. ALL UI text must be in Thai.

Design an article editor screen. Top bar: back link "กลับไปรายการบทความ", the article title, an amber chip "ร่าง", and buttons ดูตัวอย่าง / บันทึกร่าง / green เผยแพร่บทความ.

Main area, two columns. The left column (about 68%) is a white card acting as the writing surface: a large borderless title input showing "สีกันไฟคืออะไร ทำงานอย่างไร ทำไมอาคารต้องใช้", a slim formatting toolbar (bold, italic, H2, H3, bullet list, numbered list, link, quote, image, table) that is sticky at the top of the card, and below it Thai body text with a H2 subheading, a paragraph, a bullet list, an inserted image with a caption below it, and a highlighted callout box. Show a text selection with a small floating format popover above it.

The right column (32%) is a stack of small white cards:
- "ตั้งค่าการเผยแพร่": สถานะ dropdown (ร่าง / เผยแพร่แล้ว), วันที่เผยแพร่ date field, ผู้เขียน dropdown.
- "รูปหน้าปก": a 16:9 image thumbnail with a "เปลี่ยนรูปหน้าปก" button.
- "หมวดหมู่และแท็ก": category dropdown "ความรู้สีกันไฟ" and a tag input with removable chips: สีกันไฟ, ISO 834, ASTM E119, โครงสร้างเหล็ก.
- "SEO": a Google search-result preview box showing the blue title, green URL and grey description, then a "หัวข้อ SEO" field with counter 58/60, a "คำอธิบาย SEO" textarea with counter 148/160, and a green score chip "ดี".
```

---

## Prompt 8 — กล่องใบขอราคา (Leads)

```
Same design system, sidebar and top bar as before, with "ใบขอราคา" active and a red badge "5" on that menu item. ALL UI text must be in Thai.

Design a leads inbox screen. Heading "ใบขอราคา" with caption "ทั้งหมด 128 รายการ · ใหม่ 5 รายการ". Filter row: status pills (ทั้งหมด, ใหม่, ติดต่อแล้ว, เสนอราคาแล้ว, ปิดการขาย, ไม่สนใจ), a date-range picker "1–31 ส.ค. 2568", a source dropdown "ทุกช่องทาง", and a ghost button "ส่งออก Excel" with a download icon.

A white card with a table: columns วันที่/เวลา, ชื่อผู้ติดต่อ, เบอร์โทร, บริษัท, ประเภทงาน, พื้นที่ (ตร.ม.), ช่องทางที่มา, สถานะ. Unread rows have a bold name and a small green dot at the far left. The สถานะ column uses coloured pill badges. The ประเภทงาน column shows values like "ทาสีกันไฟโครงสร้างเหล็ก", "พ่นซีเมนต์กันไฟ", "ขอราคาสินค้า". The ช่องทางที่มา column shows small badges: ฟอร์มหน้าติดต่อ, แลนดิ้ง NEOCOAT, LINE.

Show a right-side detail drawer (440px) sliding over the table for the selected lead: the customer name as the heading, a status dropdown at the top right, then labelled read-only fields — ชื่อผู้ติดต่อ, เบอร์โทร (with a call icon and a copy icon), บริษัท, ช่องทางติดต่ออื่น, ประเภทงาน, พื้นที่โดยประมาณ, ชั่วโมงการทนไฟที่ต้องการ, and a รายละเอียดเพิ่มเติม paragraph in a grey box. Below that a "บันทึกภายใน" section with a small comment thread and a text box "เพิ่มบันทึก...". At the bottom, buttons: green "โทรกลับ", outline "ส่ง LINE", and a text link "ทำเครื่องหมายว่าไม่สนใจ".
```

---

## Prompt 9 — ตั้งค่าเว็บไซต์ (ข้อมูลที่ใช้ร่วมทุกหน้า)

```
Same design system, sidebar and top bar as before, with "ตั้งค่าเว็บไซต์" active. ALL UI text must be in Thai.

Design a website settings screen with a secondary vertical tab list on the left of the content area (200px): ข้อมูลติดต่อ (active), เมนูนำทาง, ส่วนท้ายเว็บไซต์, SEO ทั่วไป, ผู้ใช้งานและสิทธิ์.

Under ข้อมูลติดต่อ, show white cards with clearly labelled fields and small grey helper text saying where each value appears on the website:
- Card "แถบติดต่อด้านบน" — three phone fields (เบอร์โทรหลัก 02-041-0119, เบอร์มือถือ 1, เบอร์มือถือ 2) each with a drag handle and a delete icon plus a "+ เพิ่มเบอร์โทร" link; อีเมล field; เวลาทำการ field "จ–ส 8:00–17:00". Helper text: "แสดงบนแถบสีเขียวด้านบนสุดของทุกหน้า".
- Card "LINE และโซเชียล" — LINE ID field, LINE OA link field, Facebook link, YouTube link, each with the platform icon on the left.
- Card "ที่อยู่บริษัท" — a multiline address textarea, a Google Maps embed link field, and a small map preview thumbnail.
- Card "โลโก้" — the current logo image with a "เปลี่ยนโลโก้" button, and a favicon slot.

At the top right of the content area, a green "บันทึกการตั้งค่า" button, and a small amber inline notice bar above the cards: "การเปลี่ยนแปลงในหน้านี้จะมีผลกับทุกหน้าของเว็บไซต์".

Also show a second variant of the same screen for the เมนูนำทาง tab: a nestable drag-and-drop menu builder — parent rows (หน้าแรก, สินค้า, บริการ, มาตรฐาน, บทความ, เกี่ยวกับเรา, ติดต่อ) with the สินค้า row expanded to show 7 indented child rows for the product categories, each row having a grip handle, an editable label, a link field and a delete icon, plus a "+ เพิ่มเมนู" dashed button at the bottom.
```

---

## Prompt 10 — ยืนยันการเผยแพร่ + ประวัติการแก้ไข

```
Same design system as before. ALL UI text must be in Thai.

Design two dialogs for the same admin system, shown side by side.

DIALOG A — "เผยแพร่การเปลี่ยนแปลง" (560px wide): a heading, a grey subline "ตรวจสอบก่อนนำขึ้นเว็บไซต์จริง", then a list of 3 pending changes. Each item shows a block-type icon, the page name and block name (e.g. "หน้าแรก · สไลด์แบนเนอร์"), what changed in small grey text ("แก้หัวข้อ และเปลี่ยนรูปพื้นหลัง"), the editor name and time, and a "ดูความต่าง" text link on the right. Under the list, a checkbox "ฉันตรวจสอบเนื้อหาแล้ว". Footer: a ghost "ยกเลิก" and a green "เผยแพร่ทั้งหมด" button with a globe icon.

DIALOG B — "ประวัติการแก้ไข" (720px wide): a left column listing versions as a vertical timeline — each entry has a coloured dot, a version time "22 ส.ค. 2568 14:32", the editor's avatar and name, and a summary line; the newest entry is labelled with a green "ใช้งานอยู่" chip. The right column shows a side-by-side before/after text comparison with removed text on a light red background and added text on a light green background. Footer buttons: "ปิด" and an outline "กู้คืนเวอร์ชันนี้" with a rotate-back icon.
```

---

## Prompt 11 — เวอร์ชันมือถือ/แท็บเล็ต

```
Same design system as before. ALL UI text must be in Thai.

Design the mobile version (390px wide) of this admin system, showing three screens side by side:
1. Dashboard — a compact top bar with a hamburger icon, the title "แดชบอร์ด" and a bell icon; the 4 stat cards stacked as a 2x2 grid; then the "แก้ไขล่าสุด" list as full-width rows; and a fixed bottom tab bar with 5 icons: หน้าเว็บ, สินค้า, บทความ, รูปภาพ, ใบขอราคา.
2. Page list — a searchable list of pages as cards with a thumbnail, name, URL and status badge.
3. Block editor on mobile — the block list as a full screen list; when a block is tapped, the field form opens as a bottom sheet covering 85% of the screen with a drag handle at the top, the Thai form fields, and a sticky green "บันทึกร่าง" button at the bottom.
Keep the same colours, fonts and iconography as the desktop screens.
```

---

## Prompt สำรอง — อยากได้ทั้งระบบรวดเดียว

ถ้าอยากให้ Stitch ร่างหลายหน้าจอในครั้งเดียว (คุมรายละเอียดได้น้อยกว่า แต่เห็นภาพรวมเร็ว):

```
Design a complete Thai-language web CMS admin for a fireproof-paint manufacturer, covering these screens: login, dashboard, page list, visual page editor with a block list on the left, live preview in the middle and a field form on the right, media library, product manager, article editor, quotation-request inbox, and website settings. Light theme, brand deep green #018438, dark green #06351F sidebar, IBM Plex Sans Thai font, white cards on a #F6F8F5 background, professional and data-dense. ALL UI text in Thai. Desktop 1440px.
```

---

## หมายเหตุด้านการนำไปทำจริง

เนื้อหาปัจจุบันเป็น HTML ที่เขียนมือใน `web/app/_content/*.html` ตัวแก้ไขจึงควรออกแบบเป็น
**ฟอร์มรายฟิลด์ต่อบล็อก** (ตาม Prompt 3) ไม่ใช่ WYSIWYG เสรี เพราะ:

- ลูกค้าแก้ได้เฉพาะจุดที่เปิดให้แก้ ดีไซน์ไม่พัง
- ต้องแปลง `_content/*.html` แต่ละไฟล์เป็น JSON แบบบล็อกก่อน (hero, cards, band, footer ฯลฯ)
- รูปภาพควรย้ายจาก `public/images/` ไปที่ blob storage (เช่น Vercel Blob) เพราะ Vercel เขียนไฟล์ลง repo ไม่ได้
- ใบขอราคาตอนนี้ยิงเข้า `LEAD_WEBHOOK_URL` เท่านั้น — ถ้าจะมีหน้า Leads ในหลังบ้านจริงต้องมี DB
