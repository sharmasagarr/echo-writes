'use client'
import { SendHorizontal } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function AddComment({postId} : {postId: string}){
    const [ commentText, setCommentText ] = useState("")
    const {data: session} = useSession()
    const authorId = session?.user?.id

    async function addNewComment(){
        try {
            await fetch("/api/comment/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ postId, authorId, commentText }),
            });
    
          } catch (error) {
            console.error("Failed to add the comment:", error)
          }
    }

    return(
        <form onSubmit={(e) => {
            e.preventDefault(); // prevent reload
            addNewComment();    // your function
          }} className="flex gap-1">
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
        <button type="submit" className="rounded-2xl p-2 text-xs bg-[#0066ff] text-white cursor-pointer">
          <SendHorizontal className="w-4 h-4"/>
        </button>
      </form>
    )
}