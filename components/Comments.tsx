'use client'

import { Dispatch, SetStateAction, useEffect } from "react";
import { timeAgo } from "@/lib/utils";
import { type Comment } from "@/lib/definitions";
import AvatarElement from "./AvatarElement";

const Comments = ({ postId, comments, setComments }: { postId: string, comments: Comment[], setComments: Dispatch<SetStateAction<Comment[]>> }) => {

  useEffect(() => {
    const fetchComments = async () => {
      try {
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
      }
    };

    fetchComments();
  },[])

  return (
    <>
      {comments.map((comment) => {
        return (
          <div key={comment._id} className="flex flex-col border-t pt-2">
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <AvatarElement
                width={20}
                height={20}
              />
              {comment.author?.name ?? "Anonymous"}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{comment.text}</div>
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
