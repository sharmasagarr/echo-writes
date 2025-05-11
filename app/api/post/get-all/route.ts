import { client } from "@/app/sanity/lib/client";
import { POSTS_QUERY } from "@/app/sanity/lib/queries";
import { type Post } from "@/lib/definitions";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const result: Post[]= await client.fetch(POSTS_QUERY);

        return NextResponse.json({ success: true, post: result }, { status: 200 });
    } catch(error: unknown){
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
