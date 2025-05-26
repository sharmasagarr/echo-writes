import prisma from "@/lib/prisma";
import slugify from "slugify";
import { nanoid } from "nanoid";

// function to generate a unique slug for a post
export async function generateUniqueSlug(title: string) {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.post.findUnique({ where: { slug } }) && counter < 10) {
    slug = `${slugify(title, { lower: true, strict: true })}-${nanoid(counter++)}`;
  }

  return slug;
}
