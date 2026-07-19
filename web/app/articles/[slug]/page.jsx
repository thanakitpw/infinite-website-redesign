import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { ARTICLES, renderArticlePage } from "../../_content/articles/_shell";

const BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const a = BY_SLUG[params.slug];
  if (!a) return {};
  return {
    title: `${a.title} | Infinite Material & Technology`,
    description: a.excerpt,
  };
}

export default function Page({ params }) {
  const a = BY_SLUG[params.slug];
  if (!a) notFound();

  let body;
  try {
    body = fs.readFileSync(
      path.join(process.cwd(), "app", "_content", "articles", `${a.slug}.html`),
      "utf8"
    );
  } catch {
    notFound();
  }

  return <div dangerouslySetInnerHTML={{ __html: renderArticlePage(a, body) }} />;
}
