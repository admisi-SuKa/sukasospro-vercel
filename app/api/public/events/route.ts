import { NextResponse } from "next/server";
import { callGas } from "@/lib/gas";
import { demoEvents } from "@/data/demo-events";

// Allow enough time for Google Apps Script cold-start on the first request.
export const maxDuration = 60;

export async function GET() {
  try {
    if (!process.env.DATABASE_URL && process.env.NEXT_PUBLIC_DEMO_MODE === "1") {
      return NextResponse.json({ ok: true, data: demoEvents });
    }
    const data = await callGas("listPublicEvents");
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "1") return NextResponse.json({ ok: true, data: demoEvents, demo: true });
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Gagal memuat kegiatan." }, { status: 500 });
  }
}
