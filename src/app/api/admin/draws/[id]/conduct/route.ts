import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { conductDraw } from "@/lib/draw-engine";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const result = await conductDraw(id);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.redirect(
      new URL("/admin?draw=completed", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Draw failed" }, { status: 500 });
  }
}
