import { writeClient } from "@/app/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    // Fetch current views
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}?query=*[_id=="${id}"][0]{views}`
    );
    const { result } = await response.json();
    const currentViews = result?.views ?? 0;

    // Update views
    await writeClient
      .patch(id)
      .set({ views: currentViews + 1 })
      .commit();

    return NextResponse.json({ success: true, newViews: currentViews + 1 });
  } catch (err) {
    console.error("Error updating views:", err);
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
