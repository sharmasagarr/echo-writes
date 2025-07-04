'use client'

import { type Post } from "@/lib/definitions"
import Image from "next/image"
import { useState, useRef } from "react"
import CategoryInput from "./CategoryInput"
import MDEditor from "@uiw/react-md-editor"
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import '@/components/styles/custom-md-editor.css';
import { useTheme } from 'next-themes';
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Send, X } from 'lucide-react';
import { useRouter } from "next/navigation"
import { urlFor } from "@/app/sanity/lib/image"
import { cn } from "@/lib/utils/cn"

const EditBlogForm = ({ post } : { post: Post | null }) => {
    const [title, setTitle] = useState(post?.title);
    const [category, setCategory] = useState<{ value: string; label: string } | null>({value: post?.category?._id ?? "", label: post?.category?.title ?? ""});
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(post?.image ? urlFor(post.image)!.url() : null);
    const [body, setBody] = useState<string | undefined>(post?.body);
    const [ isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { data: session } = useSession();
    const authorId = session?.user?.id;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { theme } = useTheme();
    const resolvedTheme = theme === "system" ? ( window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" ) : ( theme );
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.size > MAX_FILE_SIZE) {
            toast.error('File is too large. Max 2MB allowed.');
            event.target.value = '';
            return;
        }
        setImage(file || null);
        const url = file ? URL.createObjectURL(file) : '';
        setPreviewUrl(url);
    };

    const clearImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(post?.author?._id !== authorId) {
            toast.error("You are not authorized to edit this post", { id: 'login-error' });
            router.push(`/blog/${post?._id}`, { scroll: false });
            return;
        }
        if (!title || !body || !category || (!image && !previewUrl)) {
            toast.error("Please fill in all fields.",  { id: 'validation-error' });
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('postId', post?._id ?? '');
        formData.append('title', title);
        formData.append('content', body ?? '');
        if (authorId) formData.append('authorId', authorId);
        if (category?.value) formData.append('category', category.value);
        if (image) formData.append('image', image);

        try {
            toast.loading('Updating post...', { id: 'update-post'});
            const response = await fetch('/api/post/update', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setIsSubmitting(false);

            setTitle('');
            setBody('');
            setCategory(null);
            setImage(null);
            setPreviewUrl(null);
            toast.success('Post updated successfully!', { id: 'update-post' });
            router.push(`/blog/${data.post._id}`);
        } catch (err) {
            setIsSubmitting(false);
            console.error(err);
            toast.error('Failed to update post.', { id: 'update-post' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="mb-5">
                <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Title
                </label>
                <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow-sm border rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-[1px]"
                placeholder="Enter blog title"
                />
            </div>
            {/* Category Input */}
            <CategoryInput
                category={category}
                setCategory={setCategory}
            />

            {/* Image Input */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="image" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold">
                    Feature Image
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    Max size: 2MB | Aspect ratio: 16:9
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 cursor-pointer"
                    />
                    {(image || previewUrl) && (
                        <button
                            type="button"
                            onClick={clearImage}
                            className=" text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition duration-200 ease-in-out cursor-pointer"
                            disabled={isSubmitting}
                        >
                            <X size={23} />
                        </button>
                    )}
                </div>
                {previewUrl && (
                    <div className="border rounded-sm flex justify-center items-center shadow-sm mt-2">
                        <div className="w-85 border bg-white dark:bg-gray-700 flex justify-center items-center shadow-sm overflow-hidden">
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                width={650}
                                height={350}
                                priority
                                className="w-auto h-auto aspect-video object-cover"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* MD Editor input */}
            <div data-color-mode={resolvedTheme}>
                <label htmlFor="body" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Content
                </label>
                <MDEditor
                    key={theme}
                    value={body}
                    onChange={setBody}
                    height={500}
                    className="shadow-lg border rounded-lg overflow-hidden"
                />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center mt-6">
                <button
                    type="submit"
                    className={cn("flex justify-center items-center bg-blue-600 w-4/6 text-sm lg:text-[20px] lg:w-1/2 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 lg:py-3 lg:px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-200 ease-in-out cursor-pointer",
                        isSubmitting && 'bg-gray-400 dark:bg-gray-400 dark:hover:bg-gray-400 hover:cursor-not-allowed hover:bg-gray-400'
                    )}
                disabled={isSubmitting}
                >
                {isSubmitting ? "Saving..." : "Save Changes"}
                <Send className="ml-2 text-white" />
                </button>
            </div>
        </form>
    )
}

export default EditBlogForm
