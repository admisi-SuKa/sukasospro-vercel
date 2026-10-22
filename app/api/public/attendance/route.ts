import { NextResponse } from "next/server";
import { callGas } from "@/lib/gas";

// Allow enough time for Google Apps Script cold-start on the first request.
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { eventId, name, phone, institution } = body;
  if (!eventId || !name || !phone || !institution) return NextResponse.json({ ok: false, error: "Lengkapi seluruh data presensi." }, { status: 400 });
  if (!process.env.DATABASE_URL && process.env.NEXT_PUBLIC_DEMO_MODE === "1") {
    return NextResponse.json({ ok: true, data: { attendanceId: `DEMO-${Date.now()}` }, demo: true });
  }
  try {
    const data = await callGas("submitAttendance", { eventId, name, phone, institution });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Presensi gagal disimpan." }, { status: 500 });
  }
}
