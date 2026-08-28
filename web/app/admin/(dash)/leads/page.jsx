import LeadsBoard from "../../../../components/admin/leads-board";
import { listLeads } from "../../../../lib/leads/store";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  // เสิร์ฟข้อมูลชุดแรกมากับหน้าเลย เปิดมาเห็นรายการทันทีไม่ต้องรอ fetch รอบสอง
  const leads = await listLeads();
  return <LeadsBoard initial={leads} />;
}
