---
name: infinite-blog-publish
description: Publish a Thai SEO article to the Infinite Material & Technology site (infinitematerialtech.com/articles) — bring the client's Google Doc edits in, write the article in the house SEO format under `seo/blog/`, convert it to the site's article HTML, register it with a cover image, FAQ schema and a publish date, verify, and deploy. Use it whenever the user says "เอาบทความขึ้นเว็บ", "ลงบทความ", "ทยอยลงบทความ", "ตั้งเวลาลงบทความ", hands over a Google Drive folder or Doc of articles, asks to format articles for SEO / add meta / FAQ schema / cover images, asks to fix or re-publish an existing article, or asks why a scheduled article has not appeared yet.
---

# Publishing an SEO article to infinitematerialtech.com

The site is Next.js 14 (App Router) in `web/`. Articles are **files in this repo**, not
database rows: there is no CMS form for creating an article. One article is:

| File | What it is | Who writes it |
|---|---|---|
| `seo/blog/NN-<keyword>.md` | the article in the house SEO format — **the source you edit** | you |
| `web/app/_content/articles/<slug>.html` | body fragment with the site's inline styles | `publish-article.py` |
| `web/app/_content/articles/_meta.json` | registry entry: title, SEO title, category, date, cover, related, FAQ | `publish-article.py` |
| `web/public/images/articles/<slug>.webp` | cover, 1600 wide | `publish-article.py --cover` |

Never edit the `.html` fragment or `_meta.json` by hand — the next run overwrites them.
Change the `.md` and re-run the script. (The eight older hand-written articles live in
`HAND_WRITTEN` inside `_shell.js`; an entry in `_meta.json` with the same slug replaces it.)

`content/articles/*.md` holds the editorial working notes for the 12-article programme
(sources, images to generate, questions for the client). It is not what gets published.

## Phase 1 — get the latest text

The client edits articles in Google Docs. **The Doc is newer than anything in the repo** —
in the 2026-10 batch, 7 of 12 Docs had edits (new numbers, a changed H1, deleted
sentences) made after the repo copy was written. Always pull before publishing.

Docs in a folder shared "anyone with the link" export without auth:

```bash
curl -sL "https://docs.google.com/document/d/<docId>/export?format=md" -o docNN.md
curl -sL "https://drive.google.com/uc?export=download&id=<imageId>" -o imgNN.png
```

Find the IDs with the Google Drive connector (`search_files` with `parentId = '<folderId>'`).
Put downloads in the scratchpad, not the repo.

Then fold each Doc into the working copy — this keeps the frontmatter, takes the Doc's
H1 as the new `title:`, and puts back the internal links that the Doc export lost:

```bash
python3 web/scripts/gdoc2md.py content/articles/NN-slug.md /path/to/docNN.md
```

It prints every link it could not put back. That means the client rewrote or deleted the
sentence the link sat in — decide whether the link belongs somewhere else, don't ignore it.

Read every Doc diff (`git diff --word-diff content/articles`). Client edits sometimes leave
numbers that contradict each other inside one article or across articles (e.g. microns per
coat). **Do not "fix" the client's numbers yourself** — publish what they wrote and list
each contradiction for the user to take back to the client.

## Phase 2 — write the house-format draft in `seo/blog/`

`seo/blog/01-สีกันไฟ-ราคา.md` is the reference. The shape (same as hometools' `seo/blogs/`):

```
<!--
========================================================
SEO META (สำหรับทีมเว็บใส่ในระบบ / CMS)
========================================================
URL slug     : /articles/<english-kebab-slug>
Primary KW   : <keyword> (ประเภท: …, คู่แข่งหน้าแรก: …, ปริมาณค้นหา: …)
Secondary KW : a, b, c

Title tag (NN) : <SEO title> | Infinite Material & Technology
Meta desc (NN): <120–170 chars, primary keyword near the front>

หมวด         : ความรู้พื้นฐาน | มาตรฐาน & กฎหมาย | วิธีเลือก/คำนวณ | ขั้นตอนงานติดตั้ง
เวลาอ่าน      : 7 นาที
วันเผยแพร่     : YYYY-MM-DD
รูปปก        : /images/articles/<slug>.webp
เกี่ยวข้อง     : slug-a, slug-b, slug-c
========================================================
-->

# H1 (shown on the page)

**Lead paragraph — answers the title's question directly, numbers included.**

Second intro paragraph.

---

## Section …            (sections separated by ---)

---

## ขั้นตอนถัดไป          (closing CTA paragraph)

---

## คำถามที่พบบ่อย (FAQ)

**Q: question?**
A: answer

<!-- INTERNAL LINKS … / FAQ SCHEMA … (notes for humans; the script ignores comments) -->
```

The script reads the META block by label, so keep the labels exactly. The last five
labels (`หมวด` … `เกี่ยวข้อง`) exist only on this site; hometools drafts don't have them.

**Keywords** come from the client-facing plan at `/reports/seo-keywords`
(`web/app/reports/seo-keywords/page.jsx`): one primary keyword per page, with its type
(ซื้อ/บริการ/ความรู้/กฎหมาย) and the competitors seen on page one. The plan has no search
volumes yet — write `รอยืนยันด้วย Keyword Planner` rather than inventing a number.

**Title tag**: primary keyword at the front. The page appends `| Infinite Material &
Technology` itself (`generateMetadata` in `app/articles/[slug]/page.jsx`); the script strips
the brand from the META line, so writing it there is harmless. Thai renders narrow — judge
length by pixel width, not character count.

**Before writing a new article, check it does not duplicate a live one.** Compare its
primary keyword and H2 outline with every article in `ARTICLES` (`_shell.js` +
`_meta.json`). Known overlaps that are acceptable because the angle differs, each linking
to the other: price (บทที่ 1) vs `calculate-fireproof-paint`; building law (บทที่ 2) vs
`fire-rating-hours` (both carry the 1/2/3-hour table); low-VOC (บทที่ 9) vs
`water-vs-solvent-based`; DFT/topcoat/spray articles vs `fireproof-application-steps`.
A new article that would take the *same* primary keyword as a live one should instead be
a rewrite of the live one.

**Internal links** must point at pages that exist — see `references/internal-links.md`.
Linking to an article scheduled for later is fine (see Phase 4).

## Phase 3 — publish

```bash
python3 web/scripts/publish-article.py seo/blog/*.md --dry          # check the whole batch
python3 web/scripts/publish-article.py seo/blog/06-*.md --cover ~/Downloads/cover.png
python3 web/scripts/publish-article.py seo/blog/*.md                 # write
```

The script checks the whole batch before writing anything: slug format, H1 present, date
format, FAQ present, every internal link resolves (products/services from `app/_data`,
articles from the registry), related articles exist and are not scheduled after this one,
cover file exists. Fix the article, not the check.

It converts the body with `md2article.convert()` — the same converter as the older
articles, so the new ones look identical — and stores the FAQ in `_meta.json`. The article
page emits FAQPage JSON-LD from that, so never paste a `<script type="application/ld+json">`
into the article.

### Covers

Client covers arrive as ~2 MB PNGs (1731×909) with the Thai headline burned in. `--cover`
resizes to 1600 wide and encodes WebP q80 (~100–180 KB). The same file is the in-page cover,
the `og:image`, and the listing/related card background (cropped to 170 px tall from the
centre), so keep key text away from the top and bottom edges.

Map art to articles by **reading the headline in the image**, not by trusting file names.
Drive names in this project are prefixed with the article number, which has matched so far.

## Phase 4 — scheduling ("ทยอยลง")

`วันเผยแพร่` in the future = scheduled. `isLive()` in `app/_content/articles/schedule.js`
compares it against midnight Bangkok time (the server runs in UTC). Until that date:

- **`middleware.js` answers 404** for `/articles/<slug>` (rewrite to a non-existent path);
- the article is left out of `/articles`, the sitemap, and every "related" list;
- links to it inside other articles render as plain text (`unlinkUnpublished`), so live
  articles never carry a dead link — the link turns on by itself.

The article page itself always prerenders the full article, scheduled or not.

⚠️ **Never gate a scheduled article with `notFound()` inside the page.** Tested 2026-10-26
on a local production build: an ISR page that rendered `notFound()` kept serving the cached
404 long after its time had passed and its `revalidate` had expired — it would never have
gone live without a redeploy. Middleware runs on every request in front of the cache,
so the 404 lifts the moment the date arrives (same test: 404 → 200 within a second of the
time). `/articles`, `sitemap.xml` and the other article pages are ordinary 200 ISR pages
with `revalidate = 3600`, so the card, sitemap entry and inbound links follow within an
hour (the listing updated on the second request after its revalidate window in the test).

So the whole batch is deployed once, up front. For "one article every 2 days", give
consecutive articles dates two days apart. To test a schedule locally, `publishAt` also
accepts a full ISO time (`2026-10-26T09:55:00+07:00`) — put it back to a date afterwards.

When the user asks why a scheduled article has not appeared: check the date in `_meta.json`,
then whether the deploy that contains it actually reached production.

## Phase 5 — verify

```bash
cd web && npm run build          # must stay green
npx next start -p 3100 &
curl -s -o /dev/null -w '%{http_code}\n' localhost:3100/articles/<slug>   # 200 live / 404 scheduled
curl -s localhost:3100/articles/<slug> | grep -c '<h1'                    # expect 1
curl -s localhost:3100/articles/<slug> | grep -o FAQPage                  # expect a hit
curl -s localhost:3100/articles | grep -c 'href="/articles/<slug>"'       # card listed
```

⚠️ `next build` writes `.next` and silently breaks a running `next dev` (hydration dies, no
console error). Stop dev first; after building, `rm -rf web/.next` before starting dev again.

The user checks the look in their own browser — don't take screenshots to verify.

## Phase 6 — deploy

Read `references/deploy.md`. Short version: commit, push `main`, the Vercel project
`infinite-material` (team `thanakit-dev`, Root Directory **`web`**) builds production in
~30 s. Then curl the live article URLs once each — not in a tight loop, Vercel's firewall
challenges bursts with 403 for the whole IP.

## Converter pitfalls already hit

- **Empty headings in a Doc** (a blank line styled as Heading 2) export as `##`. The older
  `md2article.py` looped forever on them; it now skips them and `gdoc2md.py` drops them.
  If a publish run hangs, look for a line that is only `#` characters.
- **Indented list items** export as `> 1.` / `> *`, which would become callouts.
  `gdoc2md.py` strips that.
- **List items separated by blank lines** became one `<ol>` per item, every number "1".
  `gdoc2md.py` joins them.
- **Middleware matcher `"/articles/:slug"` compiled to a regex that only matched `/articles`
  itself**, so the schedule gate silently did nothing. Use `"/articles/:path+"` and confirm
  in `.next/server/middleware-manifest.json` after building.
- A Doc whose H1 changed changes the article title. `gdoc2md.py` updates `title:`; carry it
  into the `seo/blog` H1 too.

## Reference files

- `references/internal-links.md` — every product, service, page and article slug that can be linked
- `references/deploy.md` — the Vercel project, Root Directory trap, and post-deploy checks
