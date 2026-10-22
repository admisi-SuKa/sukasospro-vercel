import { NextRequest, NextResponse } from "next/server";
import { getOfficeRequest, validOrigin } from "@/lib/office";
import { callGas } from "@/lib/gas";
import { demoEvents } from "@/data/demo-events";

// Allow enough time for Google Apps Script cold-start on the first request.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const actor = getOfficeRequest(req);
  if (actor?.role !== "admin") return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    if (!process.env.DATABASE_URL && process.env.NEXT_PUBLIC_DEMO_MODE === "1") return NextResponse.json({ ok: true, data: demoEvents, demo: true });
    const data = await callGas("listAdminEvents", {actor}, true);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Gagal memuat kegiatan." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!validOrigin(req)) return NextResponse.json({ ok: false, error: "Origin ditolak" }, { status: 403 });
  const actor = getOfficeRequest(req);
  if (actor?.role !== "admin") return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!process.env.DATABASE_URL && process.env.NEXT_PUBLIC_DEMO_MODE === "1") return NextResponse.json({ ok: true, data: { ...body, id: `DEMO-${Date.now()}` }, demo: true });
  try {
    const data = await callGas(body.id ? "updateEvent" : "createEvent", { event: body, actor }, true);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Gagal menyimpan kegiatan." }, { status: 500 });
  }
}
