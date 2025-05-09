import { client } from "./client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return source ? builder.image(source) : undefined;
}

export function refFor(url: string) {
  const regex = /images\/([^/]+)\/([^/]+)\/([^-.]+)-(\d+x\d+)\.([a-z]+)/;
  const match = url.match(regex);

  if (!match) {
    throw new Error("Invalid Sanity image URL format");
  }

  const [, , , assetId, dimensions, extension] = match;

  return `image-${assetId}-${dimensions}-${extension}`;
}
