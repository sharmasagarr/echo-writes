'use client'

import Link from 'next/link';
import { use ,useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, ThumbsUp, Eye, MessageCircleMore, Share2 } from 'lucide-react';
import UpdateViews from "@/components/UpdateViews";
import AddComment from "@/components/AddComment";
import { urlFor } from "@/app/sanity/lib/image";
import { formatDate } from '@/lib/utils';
import AvatarElement from '@/components/AvatarElement';
import Comments from '@/components/AllComments';
import { type Post, type Comment } from '@/lib/definitions';
import PostPageSkeleton from '@/components/PostPageSkeleton';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@/components/styles/custom-md-preview.css';
import { useTheme } from 'next-themes';

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post>()
  const [ comments, setComments ] = useState<Comment[]>([])
  const { theme } = useTheme();
  const resolvedTheme = theme === "system" ? ( window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" ) : ( theme );


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/post/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id })
        });
        const json = await res.json();
        setPost(json.post);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
  },[])

  if (!post) return <PostPageSkeleton />;

  return (
    <main className="dark:bg-gray-700">
      <div className="flex flex-col justify-center gap-2 lg:gap-3 items-center pattern dark:pattern h-30 lg:h-50">
        <div className='text-[0.5rem] lg:text-[0.75rem] text-black bg-amber-300 p-1 lg:p-2 rounded-br-lg rounded-tl-lg border-2 font-light dark:text-black'>{formatDate(post._createdAt)}</div>
        <div className='p-3 font-semibold lg:tracking-wider lg:leading-snug lg:text-4xl text-center bg-gray-800 text-white shadow-lg border-2 border-black-400'>{post.title}</div>
      </div>
      <div className='flex flex-col lg:flex-row justify-center gap-3 lg:gap-6 lg:p-2'>
        <div className="flex flex-col justify-center gap-4 w-fit lg:w-130 h-auto bg-white lg:rounded-sm p-4 lg:p-7 shadow-2xl dark:bg-gray-800">
          {post.image && (
            <Image
              src={urlFor(post.image)!.width(650).height(350).url()}
              alt={post.title}
              className="aspect-video w-full rounded-sm border-2"
              width="650"
              height="350"
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
                <p className="text-[0.9rem]">{post.author?.name}</p>
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
        <div className="flex flex-col gap-3 w-full lg:w-80 h-fit bg-white rounded-sm p-5 shadow-2xl dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <h1>Comments</h1>
            <div className="flex items-center gap-1 text-sm"><Eye />{post.views}</div>
          </div>
          
          <div className="flex justify-between mt-2 p-2">
            <div className="flex items-center"><AvatarElement width={30} height={30} /><ChevronDown className="w-3 h-3"/></div>
            <div className="flex gap-1"><ThumbsUp />{post.likes}</div>
            <div className="flex items-center gap-1"><MessageCircleMore />{comments.length}</div>
            <div className="flex items-center gap-1"><Share2 />Share</div>
          </div>
          <AddComment
            postId={id}
            setComments={setComments}
          />
          <Comments
            postId={id}
            comments={comments}
            setComments={setComments}
          />
        </div>
        <UpdateViews id={id} />
      </div>
    </main>
  );
}