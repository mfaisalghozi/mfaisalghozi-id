import { timingSafeEqual, createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
  if (contentLength > 10_000) {
    return NextResponse.json({ message: "Request too large" }, { status: 413 });
  }

  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const expected = process.env.REVALIDATE_SECRET;
  // Hash both values to a fixed length before comparing — avoids leaking
  // secret length through the length pre-check that timingSafeEqual requires.
  const isValid =
    secret !== null &&
    expected !== undefined &&
    expected.length > 0 &&
    timingSafeEqual(
      createHash("sha256").update(secret).digest(),
      createHash("sha256").update(expected).digest(),
    );

  if (!isValid) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  // Notion webhook verification challenge
  if (body?.challenge) {
    return NextResponse.json({ challenge: body.challenge });
  }

  revalidatePath("/", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/month/[month]", "page");
  revalidatePath("/blog/tag/[tag]", "page");
  revalidatePath("/projects", "page");
  revalidatePath("/projects/[slug]", "page");

  return NextResponse.json({ revalidated: true });
}
