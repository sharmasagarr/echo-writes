import { writeClient } from '@/app/sanity/lib/write-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const authorId = formData.get('authorId') as string;
    const categoryId = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !content || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    const newPost = await writeClient.create({
      _type: 'post',
      title,
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
      likes: 0,
      views: 0,
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
