'use client'

import { use ,useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, ThumbsUp, Eye, MessageCircleMore, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import UpdateViews from "@/components/UpdateViews";
import AddComment from "@/components/AddComment";
import { urlFor } from "@/app/sanity/lib/image";
import { formatDate } from '@/lib/utils';
import AvatarElement from '@/components/AvatarElement';
import Comments from '@/components/Comments';
import { type Post, type Comment } from '@/lib/definitions';

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post>()
  const [ comments, setComments ] = useState<Comment[]>([])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/blog/get", {
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

  if (!post) return <div className="p-10 text-center">Loading post...</div>;

  return (
    <main className="  dark:bg-gray-700">
      <div className="flex flex-col justify-center gap-2 lg:gap-3 items-center pattern dark:pattern h-40 lg:h-50">
        <div className='bg-amber-300 p-2 border-2 rounded-lg text-xs'>{formatDate(post._createdAt)}</div>
        <div className='bg-gray-800 text-4xl text-white rounded-lg border-2 p-3'>{post.title}</div>
      </div>
      <div className='flex flex-col lg:flex-row justify-center gap-3 lg:gap-6 p-3 lg:p-5'>
        <div className="flex flex-col justify-center gap-4 w-fit lg:w-130 h-auto bg-white rounded-sm p-4 lg:p-7 shadow-2xl">
          {post.image && (
            <Image
              src={urlFor(post.image)!.width(650).height(350).url()}
              alt={post.title}
              className="aspect-video rounded-sm border-2"
              width="650"
              height="350"
            />
          )}
          <div className='flex justify-between items-center rounded-md bg-gray-100 p-2'>
            <div className='flex items-center gap-2'>
              <Image
                src={post.author?.image ? urlFor(post.author.image)!.width(45).height(45).url() : ''}
                alt='post-author-image' 
                width={45}
                height={45}
                className='rounded-full'
              />
              <div>
                <p className="text-[0.9rem]">{post.author?.name}</p>
                <p className='text-[0.7rem] -mt-1'>@{post.author?.username}</p>
              </div>
            </div>
            <button className='text-[0.7rem] w-15 h-7 rounded-full bg-gray-400 text-amber-100'>Travel</button>
          </div>
          <hr />
          <div className="text-[1rem]">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full lg:w-80 h-fit bg-white rounded-lg p-5 shadow-2xl">
          <div className="flex justify-between items-center">
            <h1>Comments</h1>
            <div className="flex gap-1 text-sm"><Eye />{post.views}</div>
          </div>
          
          <div className="flex justify-between mt-2 p-2">
            <div className="flex items-center"><AvatarElement /><ChevronDown className="w-3 h-3"/></div>
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