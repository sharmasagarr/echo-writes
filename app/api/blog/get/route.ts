import { sanityFetch } from "@/app/sanity/lib/live";
import { POST_QUERY_BY_ID } from "@/app/sanity/lib/queries";
import { type Post } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const { id } = await req.json()

        const { data: result }: { data: Post } = await sanityFetch({
            query: POST_QUERY_BY_ID,
            params: { id },
        });

        return NextResponse.json({ success: true, post: result }, { status: 200 });
    } catch(error: unknown){
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
