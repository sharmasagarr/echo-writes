'use client'

import { use ,useState, useEffect } from 'react';
import { ChevronDown, Eye, MessageCircleMore, Share2 } from 'lucide-react';
import ReadBlog from "@/components/ReadBlog";
import UpdateViews from "@/components/UpdateViews";
import AddComment from "@/components/AddComment";
import { formatDate } from '@/lib/utils/formatDate';
import AvatarElement from '@/components/AvatarElement';
import Comments from '@/components/AllComments';
import { type Post, type Comment } from '@/lib/definitions';
import PostPageSkeleton from '@/components/PostPageSkeleton';
import Like from '@/components/Like';

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
    <main className="dark:bg-gray-800">
      <div className="flex flex-col justify-center gap-2 lg:gap-3 items-center pattern dark:pattern h-30 lg:h-50">
        <div className='text-[0.5rem] lg:text-[0.75rem] text-black bg-amber-300 p-1 lg:p-2 rounded-br-lg rounded-tl-lg border-2 font-light dark:text-black'>{formatDate(post._createdAt)}</div>
        <div className='p-3 font-semibold lg:tracking-wider lg:leading-snug lg:text-4xl text-center bg-gray-800 text-white shadow-lg border-2 border-black-400'>{post.title}</div>
      </div>
      <div className='flex flex-col lg:flex-row justify-center gap-3 lg:gap-6 lg:py-2'>
        <ReadBlog post={post} />
        <div className="flex flex-col gap-3 w-full lg:w-80 h-fit bg-white rounded-sm p-5 dark:bg-gray-900 border border-gray/100 dark:border-white/20 shadow-lg">
          <div className="flex justify-between items-center">
            <h1>Comments</h1>
            <div className="flex items-center gap-1 text-sm"><Eye />{post.views}</div>
          </div>
          
          <div className="flex justify-between mt-2 p-2">
            <div className="flex items-center"><AvatarElement width={30} height={30} /><ChevronDown className="w-3 h-3"/></div>
            <Like postId={id} />
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