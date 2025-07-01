'use client'
import { SendHorizontal } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { useSession } from "next-auth/react"
import { type Comment } from "@/lib/definitions"
import { refFor } from "@/app/sanity/lib/image"
import { useRouter } from "next/navigation"

export default function AddComment({postId, setComments} : {postId: string, setComments: Dispatch<SetStateAction<Comment[]>>}){
  const [ commentText, setCommentText ] = useState("")
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const {data: session} = useSession()
  const authorEmail = session?.user?.email
  const router = useRouter()

  async function addNewComment() {
    if (!session) {
      router.push("?modal=login");
      return;
    }
    if (!commentText.trim()) return;
    setIsSubmitting(true)
  
    const tempComment: Comment = {
      _id: `temp-${Date.now()}`,
      text: commentText,
      _createdAt: new Date().toISOString(),
      author: {
        name: session?.user?.name ?? "Anonymous",
        image: undefined
        // image: session?.user?.image ? refFor(session?.user?.image) : undefined,
      },
    };
  
    // Optimistically updating UI
    setComments((prev) => [tempComment, ...prev]);
    setCommentText("");
  
    try {
      const res = await fetch("/api/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, authorEmail, commentText }),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.error ?? "Unknown error");
      }
  
      const realComment = result.comment;
  
      // Replacing temp comment with real one (optional, if IDs matter)
      setComments((prev) =>
        prev.map((c) => (c._id === tempComment._id ? realComment : c))
      );
      setIsSubmitting(false)
    } catch (err) {
      console.error("Failed to save comment:", err);
  
      // Remove the temp comment on failure
      setComments((prev) => prev.filter((c) => c._id !== tempComment._id));
      setIsSubmitting(false)
  
      // Optionally show an error message
      alert("Failed to save your comment. Please try again.");
    }
  }
   
  return(
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          addNewComment();
        }} 
        className="flex gap-1"
      >
      <input type="hidden" />
      <input 
        type="text" 
        name="comment" 
        id="comment"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..." 
        className="w-full border-2 rounded-xl p-1 text-xs pl-2" 
      />
      <button 
        type="submit" 
        className="rounded-2xl p-2 text-xs bg-[#0066ff] text-white cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={isSubmitting || commentText.trim().length === 0}
        >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ): (
          <SendHorizontal className="w-4 h-4" />
        )}
      </button>
    </form>
  )
}