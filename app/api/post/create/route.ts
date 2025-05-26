import { writeClient } from '@/app/sanity/lib/write-client';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { generateUniqueSlug } from '@/lib/utils/getUniqueSlug';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const authorId = formData.get('authorId') as string;
    const categoryId = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !content || !authorId || !categoryId || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Generate a unique slug for the post
    const generatedSlug = await generateUniqueSlug(title);
    if (!generatedSlug) {
      return NextResponse.json({ error: 'Failed to generate a unique slug' }, { status: 500 });
    }

    let imageRef = null;

    if (imageFile) {
      const uploadedAsset = await writeClient.assets.upload('image', imageFile, {
        contentType: imageFile.type,
        filename: imageFile.name,
      });

      imageRef = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: uploadedAsset._id,
        },
      };
    }

    // Create the new post document in Sanity
    const newPost = await writeClient.create({
      _type: 'post',
      title,
      slug: {
        _type: 'slug',
        current: generatedSlug,
      },
      body: content,
      author: {
        _type: 'reference',
        _ref: authorId,
      },
      image: imageRef,
      category: {
        _type: 'reference',
        _ref: categoryId,
      },
    });
    //Create the post details in database
    await prisma.post.create({
      data: {
        sanityId: newPost._id,
        slug: generatedSlug,
        authorId
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
