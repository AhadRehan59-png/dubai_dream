import { NextRequest, NextResponse } from "next/server";
import { checkAndRunPendingDraws } from "@/lib/draw-engine";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await checkAndRunPendingDraws();
  return NextResponse.json({ success: true, results });
}
