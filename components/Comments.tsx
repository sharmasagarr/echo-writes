import Image from "next/image";
import { sanityFetch } from "@/app/sanity/lib/live";
import { COMMENT_QUERY } from "@/app/sanity/lib/queries";
import { type Comment } from "@/lib/definitions";
import { urlFor } from "@/app/sanity/lib/image";
import { CircleUser } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const Comments = async ({ postId }: { postId: string }) => {
  const { data: comments }: { data: Comment[] } = await sanityFetch({
    query: COMMENT_QUERY,
    params: { id: postId },
  });

  return (
    <>
      {comments.map((comment) => {
        const authorImage = comment.author?.image ? (
          <Image
            src={urlFor(comment.author.image)!.width(20).height(20).url()}
            alt="comment's author's image"
            width={20}
            height={20}
            className="rounded-full border-1 border-gray-600"
          />
        ) : (
          <CircleUser className="w-4 h-4" />
        );

        return (
          <div key={comment._id} className="flex flex-col border-t pt-2">
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              {authorImage}
              {comment.author?.name ?? "Anonymous"}
            </div>
            <div className="text-sm text-gray-600">{comment.text}</div>
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
