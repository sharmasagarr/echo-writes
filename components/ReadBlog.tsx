import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { urlFor } from "@/app/sanity/lib/image"
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@/components/styles/custom-md-preview.css';
import { type Post } from "@/lib/definitions";
import { useSession } from "next-auth/react";
import { PenLine, Trash2, Copy } from 'lucide-react';

const ReadBlog = ({post}: {post: Post}) => {
    const { theme } = useTheme();
    const { data: session } = useSession();
    const resolvedTheme = theme === "system" ? ( window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" ) : ( theme );
    
    return (
        <div className="flex flex-col gap-1 lg:gap-2 items-center">
            {post.author?.username === session?.user?.username && (
                <div className="flex items-center justify-between w-full px-3 py-1 backdrop-blur-md rounded-sm border border-gray/100 dark:border-white/20 shadow-lg">
                    <div className="flex items-center justify-evenly md:justify-start gap-3 w-full md:w-fit">
                        <Link 
                            href={`/blog/edit/${post._id}`}
                            className="text-[0.8rem] text-blue-500 flex items-center justify-center"
                        >   
                            <PenLine className="w-3 h-3 inline-block mr-1" />
                            Edit
                        </Link>
                        <button
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/blog/${post._id}`)}
                            className="text-[0.8rem] text-gray-400 flex items-center mr-1 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                            >
                            <Copy className="w-3 h-3 inline-block mr-1" />
                            Copy Link
                        </button>
                        <Link 
                            href={`/blog/delete`}
                            className="text-[0.8rem] text-red-500 flex items-center justify-center"
                        >
                            <Trash2 className="w-3 h-3 inline-block mr-1" />
                            Delete
                        </Link>
                    </div>
                    <p className="text-[0.7rem] text-gray-500 dark:text-gray-400 hidden md:block">You are the author of this post</p>
                </div>
            )}
        <div className="flex flex-col justify-center gap-4 w-fit lg:w-130 h-auto bg-white lg:rounded-sm p-4 lg:p-7 dark:bg-gray-900 border border-gray/100 dark:border-white/20 shadow-lg">
            {post.image && (
            <Image
                src={urlFor(post.image)!.width(650).height(350).url()}
                alt={post.title}
                className="aspect-video w-full rounded-sm border-2"
                width="650"
                height="350"
                priority
            />
            )}
            <Link
            href={`/user/${post.author?.username}`} 
            className='flex justify-between items-center px-7 py-2 bg-gray-100 w-[calc(100%+2rem)] ml-[-1rem] lg:w-[calc(100%+3.5rem)] lg:ml-[-1.75rem] dark:bg-gray-700'
            >
            <div className='flex items-center gap-2'>
                {post.author?.image ? (
                <Image
                    src={urlFor(post.author.image)!.width(45).height(45).url()}
                    alt='post-author-image' 
                    width={45}
                    height={45}
                    className='w-9 h-9 rounded-full'
                />
                ): (
                <div className="w-[45px] h-[45px] flex items-center text-white justify-center bg-amber-500 rounded-full shrink-0 border-2">
                    {post.author?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                )}
                <div>
                <div className='flex items-center gap-1'>
                    <p className="text-[0.9rem]">{post.author?.name}</p>{" "}
                    {(session?.user?.username === post.author?.username) && (<p className='text-[0.7rem]'>(You)</p>)}
                </div>
                <p className='text-[0.7rem] -mt-[2px]'>@{post.author?.username}</p>
                </div>
            </div>
            <button className='text-[0.7rem] w-15 h-7 rounded-full bg-gray-400 text-amber-100 cursor-pointer'>Travel</button>
            </Link>
            <div className="text-[1rem] px-1 lg:px-0" data-color-mode={resolvedTheme}>
            <MarkdownPreview
                source={post.body}
            />
            </div>
        </div>
        </div>
    )
}

export default ReadBlog