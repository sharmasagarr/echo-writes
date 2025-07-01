import { writeClient } from '@/app/sanity/lib/write-client';
import { deleteUnusedAsset } from '@/lib/utils/deleteUnusedAsset';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const postId = formData.get('postId') as string;
    const title = formData.get('title') as string;
    const body = formData.get('content') as string;
    const authorId = formData.get('authorId') as string;
    const categoryId = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;

    if (!postId || !title || !body || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch existing post to get old image asset ID
    const existingPost = await writeClient.getDocument(postId);
    const oldAssetId = existingPost?.image?.asset?._ref;

    if (existingPost?.author?._ref !== authorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // If a new image is uploaded, upload it to Sanity and delete the old one
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
      await deleteUnusedAsset(oldAssetId); // Delete old asset if a new one is uploaded
    }

    const updatedPost = await writeClient.patch(postId)
      .set({
        ...(title && { title }),
        ...(body && { body }),
        ...(imageRef && { image: imageRef }),
        category: {
            _type: 'reference',
            _ref: categoryId,
        },
      })
      .commit();

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
