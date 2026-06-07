import { timingSafeEqual, createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

  // Read body and enforce size limit after auth (content-length header can be
  // absent or spoofed, so we measure the actual body).
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ message: "Failed to read request body" }, { status: 400 });
  }
  if (rawBody.length > 10_000) {
    return NextResponse.json({ message: "Request too large" }, { status: 413 });
  }

  let body: Record<string, unknown> | null = null;
  if (rawBody) {
    try {
      body = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      body = null;
    }
  }

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
  revalidatePath("/sitemap.xml");
  revalidatePath("/opengraph-image");

  return NextResponse.json({ revalidated: true });
}
