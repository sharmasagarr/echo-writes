import Image from "next/image";
import Link from "next/link";
import { type Post } from "@/lib/definitions";
import { sanityFetch, SanityLive } from "@/app/sanity/lib/live";
import {POSTS_QUERY} from "@/app/sanity/lib/queries";
import { Eye } from "lucide-react";
import { urlFor } from "@/app/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

export default async function IndexPage() {
  const {data: posts} = await sanityFetch({query: POSTS_QUERY});
  console.log(posts[0].category.title)

  function getDescription(text: string): string {
    const words = text.trim().split(/\s+/);
    const sliced = words.slice(0, 17).join(" ");
    return words.length > 15 ? sliced + "..." : sliced;
  }
  
  return (
    <main className="mx-[1.5rem] lg:mx-[5rem] mt-[1rem] lg:mt-[2rem]">
      <h1 className="text-xl lg:text-2xl font-bold">Featured Blogs</h1>
      <div className="flex flex-col lg:grid grid-cols-3 gap-6 mt-4">
        {posts.map((post: Post) => (
          <Suspense fallback={<Skeleton />} key={post._id}>
          <div className="border-4 border-gray-600 p-4 rounded-lg shadow-">
            <div>
              <div className="flex justify-between items-center">
                <p className="text-xs">{formatDate(post._createdAt)}</p>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Eye />
                  {post.views}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.author?.name}</span>
                  <h3 className="font-semibold">{post.title}</h3>
                </div>
                <div>
                {post.author?.image && (
                  <Image
                    src={urlFor(post.author.image)!.width(40).height(40).url()}
                    alt={post.author.name ?? "Author image"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border border-black"
                  />
                )}
                </div>
              </div>
              <div className="text-sm mt-2 text-gray-700 h-18 dark:text-gray-300">
                {getDescription(post.body)}
              </div>
              {post.image && (
                <Image 
                  src={urlFor(post.image)!.width(400).height(150).url()} 
                  alt="post-image"
                  width={400}
                  height={150}
                  className="rounded-lg border-2 dark:border-gray-200"
                />
              )}
              <div className="flex justify-between items-center mt-2 text-xs">
                <div className="text-gray-800 dark:text-gray-300">
                  {post.category?.title}
                </div>
                <Link
                  href={`/blogs/${post._id}`}
                  className="bg-black text-white rounded-lg px-3 py-1 dark:bg-white dark:text-black">
                  Read
                </Link>
              </div>
            </div>
          </div>
          </Suspense>
        ))}
      </div>
      <SanityLive />
    </main>
  );
}