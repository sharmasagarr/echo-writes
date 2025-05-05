import { client } from '@/app/sanity/lib/client'
import { writeClient } from "@/app/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";
import { AUTHOR_QUERY_BY_EMAIL } from '@/app/sanity/lib/queries'

export async function POST(req: NextRequest) {
  try {
    const { postId, authorEmail, commentText } = await req.json();
console.log({ postId, authorEmail, commentText }); // 👈 add this

    // Basic input validation
    if (!postId || !authorEmail || !commentText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch author ID based on email
    const author = await client.fetch(AUTHOR_QUERY_BY_EMAIL, { email: authorEmail });

    if (!author?._id) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 })
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
        _ref: author._id,
      },
    });

    return NextResponse.json({ success: true, comment: result }, { status: 201 });

  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
