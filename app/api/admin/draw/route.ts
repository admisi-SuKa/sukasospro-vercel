import { NextRequest, NextResponse } from "next/server";
import { getOfficeRequest, validOrigin } from "@/lib/office";
import { callGas } from "@/lib/gas";

export async function POST(req: NextRequest) {
  if (!validOrigin(req)) return NextResponse.json({ ok: false, error: "Origin ditolak" }, { status: 403 });
  const actor = getOfficeRequest(req);
  if (actor?.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body.eventId) {
    return NextResponse.json({ ok: false, error: "Pilih kegiatan terlebih dahulu." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL && process.env.NEXT_PUBLIC_DEMO_MODE === "1") {
    const i = Math.floor(Math.random() * 24) + 1;
    return NextResponse.json({
      ok: true,
      data: {
        id: `WIN-DEMO-${i}`,
        participantId: `P${i}`,
        name: `Peserta Demo ${i}`,
        institution: `Instansi ${1 + (i % 5)}`,
        prize: body.prize || "Doorprize",
      },
      demo: true,
    });
  }

  try {
    const data = await callGas("drawWinner", {
      eventId: body.eventId,
      prize: body.prize || "Doorprize",
      actor,
    }, true);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Pengundian gagal." },
      { status: 500 }
    );
  }
}
