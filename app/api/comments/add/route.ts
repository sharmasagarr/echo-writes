import { client } from '@/app/sanity/lib/client'
import { writeClient } from "@/app/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";
import { AUTHOR_QUERY_BY_EMAIL } from '@/app/sanity/lib/queries'
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const { postId, authorEmail, commentText } = await req.json();

    if (!postId || !authorEmail || !commentText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const author = await client.fetch(AUTHOR_QUERY_BY_EMAIL, { email: authorEmail });

    if (!author?._id) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Create comment
    const newComment = await writeClient.create({
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

    // Fetch expanded comment by ID with author populated
    const expandedComment = await client.fetch(
      `*[_type == "comment" && _id == $id][0]{
        _id,
        text,
        _createdAt,
        author->{_id, name, image}
      }`,
      { id: newComment._id }
    );

    revalidatePath(`/blogs/${postId}`);

    return NextResponse.json({ success: true, comment: expandedComment }, { status: 201 });

  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
