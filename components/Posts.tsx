"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Post } from "@/lib/definitions";
import { Eye } from "lucide-react";
import { urlFor } from "@/app/sanity/lib/image";
import { formatDate} from "@/lib/utils/formatDate";
import { getDescription } from "@/lib/utils/getDescription";
import PostSkeleton from "@/components/PostSkeleton";
import { useRouter } from "next/navigation";

export default function Posts() {
  const [ posts, setPosts ] = useState<Post[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch("/api/post/get-all");
        const json = await res.json();
        setPosts(json.post);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchAllPosts();
  }, []);
  
  return (
    <main className="mx-[0.7rem] lg:mx-[5rem] mt-[1rem] lg:mt-[2rem]">
      <h1 className="text-xl lg:text-2xl font-bold">Featured Blogs</h1>
      <div className="flex flex-col lg:grid grid-cols-3 gap-6 mt-4">
        { posts.length === 0 ? (
          Array.from({ length: 6 }).map((_, idx) => <PostSkeleton key={idx} />)
        ):( 
        posts.map((post: Post) => (
          <div
            key={post._id}
            className="border-4 border-gray-600 p-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 dark:border-gray-700 transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
            onClick={(event) => {
              const target = event.target as HTMLElement;
              const authorLink = target.closest('a[href^="/user/"]');

              if (!authorLink) {
                event.preventDefault();
                event.stopPropagation();
                router.push(`/blog/${post._id}`);
              }
            }}
          >
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
                  <Link href={`/user/${post.author?.username}`}>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hover:underline">{post.author?.name}</span>
                  </Link>
                  <h3 className="font-semibold">{post.title}</h3>
                </div>
                <div>
                  <Link href={`/user/${post.author?.username}`}>
                    {post.author?.image && urlFor(post.author.image) ? (
                        <Image
                          src={urlFor(post.author.image)!.width(45).height(45).url()}
                          alt={post.author.name ?? "Author image"}
                          width={45}
                          height={45}
                          className="w-7 h-7 rounded-full object-cover border border-black"
                        />
                      ): (
                        <div className="w-7 h-7 shrink-0 flex items-center text-black justify-center bg-white text-sm rounded-xl font-md border-2">
                          {post.author?.name?.charAt(0).toUpperCase()}
                        </div>
                      )
                    }
                  </Link>
                </div>
              </div>

              <div className="text-sm mt-2 text-gray-700 h-18 dark:text-gray-300">
                {getDescription(post.body)}
              </div>
              {post.image && urlFor(post.image) && (
                <Image
                  src={urlFor(post.image)!.width(400).height(150).url()}
                  alt="post-image"
                  width={400}
                  height={150}
                  className="w-full aspect-[8/3] rounded-lg border-2 dark:border-gray-200"
                />
              )}
              <div className="flex justify-between items-center mt-2 text-xs">
                <div className="text-gray-800 dark:text-gray-300">
                  {post.category?.title}
                </div>
                <div className="bg-black text-white rounded-lg px-3 py-1 dark:bg-white dark:text-black">
                  Read
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </main>
  );
}