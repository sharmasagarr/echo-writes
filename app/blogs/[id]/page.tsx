import Image from 'next/image';
import { CircleUser, ChevronDown, ThumbsUp, Eye, MessageCircleMore, Share2 } from 'lucide-react';
import { POST_QUERY_BY_ID, COMMENT_QUERY } from "@/app/sanity/lib/queries";
import { sanityFetch, SanityLive } from "../../sanity/lib/live";
import { type Comment } from "@/lib/definitions";
import ReactMarkdown from 'react-markdown';
import UpdateViews from "@/components/UpdateViews";
import AddComment from "@/components/AddComment";
import { urlFor } from "@/app/sanity/lib/image";
import { formatDate, timeAgo } from '@/lib/utils';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1: Fetching the live post using the slug
  const { data: post } = await sanityFetch({
    query: POST_QUERY_BY_ID, 
    params: {id}
  });
  
  // 2: Using post._id to fetch comments
  const { data: comments }: { data: Comment[] } = await sanityFetch({
    query: COMMENT_QUERY,
    params: {id}
  });

  return (
    <main className="flex flex-col lg:flex-row justify-center gap-3 lg:gap-6 p-3 lg:p-15 dark:bg-gray-700">
      <div className="flex flex-col justify-center gap-2 w-fit lg:w-130 h-auto bg-white rounded-2xl p-4 lg:p-10 shadow-2xl">
        {post.image && (
          <Image
            src={urlFor(post.image)!.width(650).height(350).url()}
            alt={post.title}
            className="aspect-video rounded-xl border-2"
            width="650"
            height="350"
          />
        )}
        <div>
          <h1 className="text-2xl lg:text-4xl font-semibold">{post.title}</h1>
          <p className="text-xs text-gray-500">By <span className="text-[#0066ff] font-semibold">{post.author?.name}</span> · {formatDate(post._createdAt)}</p>
        </div>
        <div className="text-[1rem]">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-80 h-fit bg-white rounded-2xl p-5 shadow-2xl">
        <div className="flex justify-between items-center">
          <h1>Comments</h1>
          <div className="flex gap-1 text-sm"><Eye />{post.views}</div>
        </div>
        
        <div className="flex justify-between mt-2 p-2">
          <div className="flex items-center"><CircleUser /><ChevronDown className="w-3 h-3"/></div>
          <div className="flex gap-1"><ThumbsUp />{post.likes}</div>
          <div className="flex items-center gap-1"><MessageCircleMore />{comments.length}</div>
          <div className="flex items-center gap-1"><Share2 />Share</div>
        </div>
        <AddComment
          postId={post._id}
        />
          {comments.map((comment) => (
            <div key={comment._id} className="flex flex-col border-t pt-2">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <CircleUser className="w-4 h-4" />
                {comment.author?.name ?? "Anonymous"}
              </div>
              <div className="text-sm text-gray-600">{comment.text}</div>
              <div className="text-[12px] text-gray-400">{timeAgo(comment._createdAt)}</div>
            </div>
          ))}
      </div>
      <SanityLive />
      <UpdateViews id={id} />
    </main>
  );
}