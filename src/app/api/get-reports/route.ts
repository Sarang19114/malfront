import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server"; // Clerk auth
import { db } from "@/lib/db";
import { reports } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req); // Pass `req` to getAuth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userReports = await db.select().from(reports).where(eq(reports.userId, userId));

  return NextResponse.json(userReports);
}
