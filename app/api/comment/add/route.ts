import { writeClient } from "@/app/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { postId, authorId, commentText } = await req.json();

    // Basic input validation
    if (!postId || !authorId || !commentText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await writeClient.create({
      _type: "comment",
      text: commentText,
      post: {
        _type: "reference",
        _ref: postId,
      },
      author: {
        _type: "reference",
        _ref: authorId,
      },
    });

    return NextResponse.json({ success: true, comment: result }, { status: 201 });

  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
