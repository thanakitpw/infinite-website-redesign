# Internal link targets

`publish-article.py` resolves every `[text](/path)` against these, so a guessed slug fails
the publish instead of shipping as a 404. The lists below were current on 2026-10-26; the
source of truth is the code, and the commands at the bottom regenerate them.

## Products — `/product/<slug>`

| Slug | Product |
|---|---|
| `neocoat-intumescent-paint-s` | สีกันไฟ Neocoat สูตรน้ำมัน (Paint-S) — target of "สีกันไฟ", "สีกันไฟโครงสร้างเหล็ก" |
| `neocoat-intumescent-paint-w` | สีกันไฟ Neocoat สูตรน้ำ (Paint-W) — target of "สีกันไฟสูตรน้ำ / Low VOC" |
| `neocoat-primer-grey-oxide` | สีรองพื้นเทา Neocoat Primer Grey Oxide |
| `neogloss-enamel` | สีทับหน้า / สีน้ำมันทาเหล็ก Neogloss |
| `thinner-3a-intanin` | ทินเนอร์ 3A อินทนิล |
| `thinner-2k` | ทินเนอร์ 2K |
| `turpentine-intanin` | น้ำมันสน อินทนิล |
| `mandolite-cp2` | ซีเมนต์กันไฟ Mandolite CP-2 (ภายใน) |
| `fendolite-m2` | ซีเมนต์กันไฟ Fendolite M II (ภายนอก) |
| `fiberglass-cloth` | ผ้ากันไฟ Fiberglass Cloth |
| `roof-shield-ceramic` | สีเซรามิคสะท้อนความร้อน Roof Shield |
| `four-plus-pro-masonry-sealer` · `four-plus-exterior` · `four-plus-pro-interior` | สีน้ำพลาสติก Four Plus |

## Services — `/services/<slug>`

| Slug | Service |
|---|---|
| `fireproof-certification` | รับรองงานสีกันไฟโดยวุฒิวิศวกร — the money page for most articles |
| `fireproof-supervision` | ควบคุมงานสีกันไฟ, หนังสือ น.4-5 / น.4-9 |
| `structural-design-review` | ตรวจสอบงานออกแบบโครงสร้าง |

## Pages

`/` · `/about` · `/products` · `/services` · `/standards` (test reports, ISO 9001) · `/articles` · `/contact`

Landing pages (`/neocoat`, `/fireproof-cement`, …) canonicalise to the product pages —
link the product page instead.

## Articles — `/articles/<slug>`

Hand-written: `what-is-fireproof-paint`, `fire-rating-hours`, `water-vs-solvent-based`,
`calculate-fireproof-paint`, `iso834-astm-e119`, `fireproof-application-steps`,
`cement-vs-fireproof-paint`.

SEO programme (`_meta.json`): `fireproof-paint-price`, `fire-protection-building-law`,
`section-factor-hp-a`, `dft-measurement`, `fireproofing-handover-documents`,
`fireproof-paint-topcoat`, `fiberglass-fire-blanket-550-1000`, `steel-surface-preparation`,
`low-voc-fireproof-paint-green-building`, `spray-vs-roller-fireproof-paint`,
`thinner-3a-2k-turpentine`, `fireproofing-contractor-questions`.

## Regenerating

```bash
cd web
grep -o 'slug: *"[^"]*"' app/_data/products.js app/_data/services.js
grep -o 'slug: *"[^"]*"' app/_content/articles/_shell.js
python3 -c "import json;[print(a['publishAt'],a['slug']) for a in json.load(open('app/_content/articles/_meta.json'))]"
```
