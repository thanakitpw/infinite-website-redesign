# Deploying

## Content vs. code

Everything here is code: a new or edited article is a change to files in `web/`, so it
needs a deploy. The exception is a **scheduled** article that is already deployed — it
goes live on its date by itself (ISR, `revalidate = 3600`), no deploy needed.

## The project

- Vercel project `infinite-material` in team `thanakit-dev`, GitHub-connected: a push to
  `main` builds production (~30 s to READY).
- The Next.js app is in `web/`, so the project's **Root Directory must be `web`**. It has
  been reset to `.` twice; with `.` every git push fails in ~5 s with "Couldn't find any
  `pages` or `app` directory", while manual `vercel --prod` from `web/` still works and
  hides the problem. If a push does not show up live, check this first:

  ```bash
  npx vercel project inspect infinite-material --scope thanakit-dev
  ```

- Use the logged-in `vercel` CLI with `--scope thanakit-dev`.

## Before pushing

```bash
git fetch origin && git status -sb          # main must not be behind origin/main
cd web && npm run build                     # must be green
```

Only commit what belongs to the article: `seo/blog/*.md`, the fragment, `_meta.json`, the
cover `.webp`, and any code change. Leave unrelated working-tree changes out.

## After deploying

Wait for READY, then check each URL **once** — Vercel's firewall answers bursts from one
IP with a 403 challenge for every page, which looks like the site is down but is not.

```bash
for s in <live-slug> <scheduled-slug>; do
  curl -s -o /dev/null -w "%{http_code} $s\n" https://www.infinitematerialtech.com/articles/$s
  sleep 2
done
curl -s https://www.infinitematerialtech.com/sitemap.xml | grep -c '/articles/'
```

Expect 200 for live articles and 404 for scheduled ones.

## Domain note

DNS is on Cloudflare and the site on Vercel, but **mail still runs on the old host
(27.254.62.136)**. Never touch MX/mail records while working on the site.
