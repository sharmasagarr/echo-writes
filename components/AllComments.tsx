'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/app/sanity/lib/image";
import { timeAgo } from "@/lib/utils/timeAgo";
import { type Comment } from "@/lib/definitions";

const Comments = ({ postId, comments, setComments }: { postId: string, comments: Comment[], setComments: Dispatch<SetStateAction<Comment[]>> }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/comments/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId })
        });
        const json = await res.json();
        setComments(json.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  },[postId])

  if (isLoading) return (
    <div className="w-full h-40 flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-gray-600 dark:border-gray-300 dark:border-t-transparent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (comments.length === 0) return (
    
    <div className="flex flex-col items-center justify-center mb-2">
      <div className="relative w-full h-40">
        <Image
          src="/no-comments.svg"
          alt="No comments"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-center text-gray-500 dark:text-gray-300 text-sm px-2 -mt-2">No comments yet. <br /> Be the first to start a conversation!</p>
    </div>
  );

  return (
    <>
      {comments.map((comment) => {
        const authorImage = comment.author?.image ? (
          <Image
            src={urlFor(comment.author.image)!.width(20).height(20).url()}
            alt="comment-author-image"
            width={20}
            height={20}
            className="rounded-full border-1 border-gray-600"
          />
        ) : (
          <div className="w-4 h-4 flex items-center text-white justify-center bg-amber-500 text-[0.5rem] font-light rounded-xl shrink-0 border-2">
            {comment?.author?.name?.charAt(0).toUpperCase()}
          </div>
        );

        return (
          <div key={comment._id} className="flex flex-col border-t pt-2">
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
              {authorImage}
              {comment.author?.name ?? "Anonymous"}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-200">{comment.text}</div>
            <div className="text-[12px] text-gray-400">
              {timeAgo(comment._createdAt)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Comments;
