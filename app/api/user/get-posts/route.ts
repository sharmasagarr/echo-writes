import { client } from "@/app/sanity/lib/client";
import { USER_POSTS_QUERY } from "@/app/sanity/lib/queries";
import { type Post } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const { userId } = await req.json()

        const result: Post[] = await client.fetch(
            USER_POSTS_QUERY,
            { id : userId },
        );        
        if (!result) {
            return NextResponse.json({ error: "No post made by the user" }, { status: 404 });
        }
        return NextResponse.json({ success: true, posts: result }, { status: 200 });
    } catch(error: unknown){
        console.error("Error fetching user posts:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
