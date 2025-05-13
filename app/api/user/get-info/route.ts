import { client } from "@/app/sanity/lib/client";
import { AUTHOR_QUERY_BY_USERNAME } from "@/app/sanity/lib/queries";
import { type Author } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const { username } = await req.json()

        const result: Author = await client.fetch(
            AUTHOR_QUERY_BY_USERNAME,
            { username: username },
        );        
        if (!result) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, user: result }, { status: 200 });
    } catch(error: unknown){
        console.error("Error fetching user information:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
