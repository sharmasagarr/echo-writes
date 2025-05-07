import { client } from "@/app/sanity/lib/client";
import { COMMENT_QUERY } from "@/app/sanity/lib/queries";
import { type Comment } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const { postId } = await req.json()

        const result: Comment[] = await client.fetch(
            COMMENT_QUERY,
            { id: postId },
        );        

        return NextResponse.json({ success: true, comments: result }, { status: 200 });
    } catch(error: unknown){
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

