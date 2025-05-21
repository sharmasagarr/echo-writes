import { client } from '@/app/sanity/lib/client';
import { writeClient } from '@/app/sanity/lib/write-client';
import { POST_QUERY_BY_ID } from '@/app/sanity/lib/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return NextResponse.json({ error: 'Missing postId or userId' }, { status: 400 });
    }

    // Fetch post to validate the author matches
    const post = await client.fetch(
      POST_QUERY_BY_ID,
      { id: postId }
    );

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.author?._id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the post
    await writeClient.delete(postId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
