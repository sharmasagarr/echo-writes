"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const Like = ({ postId }: { postId: string }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const likedKey = `liked_${postId}`;

  useEffect(() => {
    const alreadyLiked = localStorage.getItem(likedKey) === "true";
    setLiked(alreadyLiked);
  }, [postId]);

  const handleLike = async () => {
    const newLikedState = !liked;
    const newLikesCount = likesCount + (newLikedState ? 1 : -1);

    setLiked(newLikedState);
    setLikesCount(newLikesCount);

    // Store locally to prevent duplicate likes
    if (newLikedState) {
      localStorage.setItem(likedKey, "true");
    } else {
      localStorage.removeItem(likedKey);
    }

    // API call to update likes on server
    try {
      await fetch("/api/likes/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, liked: newLikedState }),
      });
    } catch (err) {
      console.error("Failed to update likes:", err);
    }
  };

  return (
    <div className="w-fit">
      <button
        className="flex items-center gap-1 cursor-pointer"
        onClick={handleLike}
      >
        <Heart
          className={`
            w-5 h-5
            transition-all duration-300 ease-in-out
            ${liked ? "fill-red-500 stroke-red-500 scale-110" : "fill-transparent stroke-gray-500"}
          `}
        />
        <span className="inline-block min-w-[3ch] text-left tabular-nums">
            {likesCount}
        </span>
      </button>
    </div>
  );
};

export default Like;
