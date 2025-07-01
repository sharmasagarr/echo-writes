import { writeClient } from "@/app/sanity/lib/write-client";

// Utility to delete an asset only if it's unused
export async function deleteUnusedAsset(assetId: string) {
  try {
    // Check for references to the asset
    const references = await writeClient.fetch(
      `*[_type != "sanity.imageAsset" && references($assetId)]`,
      { assetId }
    );

    if (references.length === 0) {
      // Safe to delete
      await writeClient.delete(assetId);
      // console.log(`✅ Deleted unused asset: ${assetId}`);
      return { deleted: true };
    } else {
      console.warn(`⚠️ Asset ${assetId} is still in use. Not deleting.`);
      return { deleted: false, references };
    }
  } catch (error) {
    console.error("❌ Error checking or deleting asset:", error);
    return { deleted: false, error };
  }
}