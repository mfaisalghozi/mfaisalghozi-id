import { timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const expected = process.env.REVALIDATE_SECRET;
  const isValid =
    secret !== null &&
    expected !== undefined &&
    expected.length > 0 &&
    secret.length === expected.length &&
    timingSafeEqual(Buffer.from(secret), Buffer.from(expected));

  if (!isValid) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  // Notion webhook verification challenge
  if (body?.challenge) {
    return NextResponse.json({ challenge: body.challenge });
  }

  revalidatePath("/blog", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/", "page");

  return NextResponse.json({ revalidated: true });
}
