import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "data", "leads.json");

function readLeads() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const name = (body.name || "").toString().trim();
  const phone = (body.phone || "").toString().trim();
  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "กรุณากรอกชื่อและเบอร์โทร" },
      { status: 422 }
    );
  }

  const lead = {
    id: Date.now(),
    name,
    phone,
    company: (body.company || "").toString().trim(),
    contact: (body.contact || "").toString().trim(),
    jobType: (body.jobType || "").toString().trim(),
    area: (body.area || "").toString().trim(),
    hours: (body.hours || "").toString().trim(),
    detail: (body.detail || "").toString().trim(),
    receivedAt: new Date().toISOString(),
  };

  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    const leads = readLeads();
    leads.push(lead);
    fs.writeFileSync(FILE, JSON.stringify(leads, null, 2), "utf8");
  } catch (e) {
    // still acknowledge to the user; log server-side
    console.error("lead persist failed:", e);
  }

  return NextResponse.json({ ok: true, id: lead.id });
}

export async function GET() {
  const leads = readLeads();
  return NextResponse.json({ count: leads.length, leads });
}
