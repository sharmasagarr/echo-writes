'use client'

import { useState, useEffect, JSX } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { type Author } from "@/lib/definitions"
import { client } from '@/app/sanity/lib/client'
import { AUTHOR_QUERY_BY_EMAIL } from "@/app/sanity/lib/queries"
import { urlFor } from "@/app/sanity/lib/image"
import { CircleUserIcon } from "lucide-react"

const AvatarElement = () => {
    const [author, setAuthor] = useState<Author | null>(null);
    const [isAuthorLoading, setIsAuthorLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchAuthor() {
            if (status === "authenticated" && session?.user?.email) {
            try {
                const authorData: Author = await client.fetch(AUTHOR_QUERY_BY_EMAIL, {
                email: session.user.email,
                });
                setAuthor(authorData);
            } catch (err) {
                console.error("Failed to fetch author:", err);
            } finally {
                setIsAuthorLoading(false);
            }
            }
        }
        fetchAuthor();
    }, [status, session])

let avatarElement: JSX.Element | null = <CircleUserIcon className="w-6 h-6" />;

if (!isAuthorLoading) {
  if (author?.image && urlFor(author.image)) {
    avatarElement = (
      <Image
        src={urlFor(author.image)!.width(30).height(30).url()}
        alt={session?.user?.name ?? "profile picture"}
        className="rounded-full border"
        width={30}
        height={30}
      />
    );
  } else {
    avatarElement = (
        <div className="w-6 h-6 flex items-center text-white justify-center bg-amber-500 text-sm rounded-xl shrink-0 border-2">
            {session?.user?.name?.charAt(0).toUpperCase()}
        </div>
    );
  }
}

    return (
        <>
            {avatarElement}
        </>
    )
}

export default AvatarElement