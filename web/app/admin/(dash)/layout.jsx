import { redirect } from "next/navigation";
import Shell from "../../../components/admin/shell";
import { currentCmsUser } from "../../../lib/supabase/server";
import { isCmsEnabled } from "../../../lib/supabase/config";
import SetupNotice from "../../../components/admin/setup-notice";
import { newLeadCount } from "../../../lib/leads/store";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }) {
  if (!isCmsEnabled()) return <SetupNotice />;

  const user = await currentCmsUser();
  /* middleware กันคนที่ยังไม่ล็อกอินไว้แล้ว มาถึงตรงนี้แต่ไม่มี user แปลว่า
     ล็อกอิน Supabase ผ่าน แต่ยังไม่ถูกเพิ่มเข้า cms_users — คนนอกระบบ */
  if (!user) redirect("/admin/login?reason=no-access");

  const newLeads = await newLeadCount();
  return <Shell user={user} newLeads={newLeads}>{children}</Shell>;
}
