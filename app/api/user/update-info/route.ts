import { writeClient } from "@/app/sanity/lib/write-client";
import { deleteUnusedAsset } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const image = formData.get("image") as File | null;
    const bio = formData.get("bio") as string | null;
    const isAvatarDeleted = formData.get("isAvatarDeleted") === "true";

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch existing user to get old avatar asset ID
    const existingUser = await writeClient.getDocument(userId);
    const oldAssetId = existingUser?.image?.asset?._ref;

    let imageRef = null;
    let patch = writeClient.patch(userId);

    // Case 1: New image uploaded
    if (image) {
      const uploadedAsset = await writeClient.assets.upload("image", image, {
        contentType: image.type,
        filename: image.name,
      });

      imageRef = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: uploadedAsset._id,
        },
      };

      patch = patch.set({ image: imageRef });
    }

    // Case 2: Avatar marked for deletion
    if (isAvatarDeleted && !image) {
      patch = patch.unset(["image"]);
    }

    // Always update name/bio if present
    patch = patch.set({
      ...(name && { name }),
      ...(bio && { bio }),
    });

    const result = await patch.commit();

    // Cleanup: Delete old asset if it's not being reused
    if ((isAvatarDeleted || image) && oldAssetId && oldAssetId !== imageRef?.asset?._ref) {
      await deleteUnusedAsset(oldAssetId);
    }

    return NextResponse.json({ success: true, updatedUser: result }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
