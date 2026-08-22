import { PAGES, GROUPS, SHARED_FRAGMENTS } from "../../../../lib/cms/pages";
import { fragmentStatus } from "../../../../lib/cms/store";
import PageList from "../../../../components/admin/page-list";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
  const status = await fragmentStatus();

  const rows = PAGES.map((p) => {
    let dirty = 0;
    let updatedAt = null;
    for (const f of p.fragments) {
      const s = status[f];
      if (!s) continue;
      dirty += s.dirty;
      if (!updatedAt || (s.updatedAt && s.updatedAt > updatedAt)) updatedAt = s.updatedAt;
    }
    return {
      key: p.key,
      label: p.label,
      url: p.url,
      group: p.group,
      groupLabel: p.groupLabel,
      shared: p.fragments.some((f) => SHARED_FRAGMENTS.has(f)),
      dirty,
      updatedAt,
    };
  });

  return <PageList rows={rows} groups={GROUPS} />;
}
