"use client";

import { type Post } from "@/lib/definitions";
import { use, useState, useEffect } from "react";
import EditBlogForm from "@/components/EditBlogForm";
import BlogFormSkeleton from "@/components/BlogFormSkeleton";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const [post, setPost] = useState<Post | null>(null);
    const [loadingPost, setLoadingPost] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();


    useEffect(() => {
        setMounted(true);
    }, []);
    
    useEffect(() => {
        setLoadingPost(true);
        const fetchPost = async () => {
        try {
            const res = await fetch("/api/post/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
            });
            const json = await res.json();
            setPost(json.post);
            setLoadingPost(false);
        } catch (error) {
            setLoadingPost(false);
            console.error("Error fetching post:", error);
        }
        };
    
        fetchPost();
    }, [id]);

    useEffect(() => {
    if (status !== "loading" && !session) {
        toast.error("Login first to edit a post.", {
            id: "auth-error",
        });
        router.push(`/blog/${id}?modal=login`);
    } else if (post && post.author?._id !== session?.user.id) {
        toast.error("Unauthorized", {
            id: "auth-error",
        });
        router.push(`/blog/${id}`);
    }
    }, [session, post, router, id]);

    return (
        <div>
        {/* Header Section */}
        <div className="flex flex-col justify-center gap-2 lg:gap-3 items-center pattern dark:pattern h-30 lg:h-50">
            <div className='p-3 font-semibold lg:tracking-wider lg:leading-snug lg:text-4xl text-center bg-gray-800 text-white shadow-lg border-2 border-black-400'>Edit Your Blog Post</div>
        </div>
    
        {/* Main Content Area */}
        <div className="flex items-center justify-center lg:p-2 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 p-4 lg:p-8 rounded-xl shadow-lg w-full max-w-3xl">
                {!loadingPost && mounted ? 
                <EditBlogForm 
                    post={post} 
                /> : 
                <BlogFormSkeleton />}
            </div>
        </div>
        </div>
    );
    }