import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
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
