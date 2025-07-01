import { NextRequest, NextResponse } from 'next/server';
import {auth}  from '@/lib/auth'
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Get the user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      // If already liked, remove the like
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId: user.id,
          },
        },
      });
      return NextResponse.json({ message: 'Unliked' }, { status: 200 });
    } else {
      // Otherwise, create a like
      await prisma.like.create({
        data: {
          postId,
          userId: user.id,
        },
      });
      return NextResponse.json({ message: 'Liked' }, { status: 201 });
    }
  } catch (error) {
    console.error('Like update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
