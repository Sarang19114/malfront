import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Use `server` import for API routes
import { db } from "@/lib/db";
import { users, reports } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    // ✅ Await `auth(req)` since it returns a Promise
    const authData = await auth();
    const { userId, sessionClaims } = authData || {};

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, pdfUrl } = await req.json();

    // Ensure the user exists in the database
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: userId,
        email: sessionClaims?.email ?? "",
      });
    }

    // Store PDF metadata
    await db.insert(reports).values({
      id: uuidv4(),
      userId,
      fileName,
      pdfUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}
