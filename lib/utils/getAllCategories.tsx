import { client } from "@/app/sanity/lib/client";

// function to get all categories
export async function getAllCategories() {
  const allCategories = await client.fetch(
    `*[_type == "category"]`,
  );
  return allCategories.map((category: { title: string; _id: string }) => ({
    label: category.title,
    value: category._id,
  }));
}