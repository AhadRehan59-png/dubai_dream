import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTokenNumber } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { draws: true } } },
  });
  return NextResponse.json(categories);
}
