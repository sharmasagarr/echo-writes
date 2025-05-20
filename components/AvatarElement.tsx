'use client';

import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { CircleUserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { urlFor } from "@/app/sanity/lib/image";

const AvatarElement = ({ width, height }: { width: number; height: number }) => {
    const { user, loadingUser } = useUser();
    const { data: session, status } = useSession();

    if (loadingUser && status === "loading") {
        return (
            <div 
                className="rounded-full bg-gray-100 dark:bg-gray-200 animate-pulse"
                style={{ width: `${width}px`, height: `${height}px` }}
            />
        );
    }

    if (!session) {
        return (
            <CircleUserIcon 
                className="text-black dark:text-white" 
                style={{ width: `${width}px`, height: `${height}px` }} 
            />
        );
    }

    return (
        <div 
            className="relative shrink-0 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600"
            style={{ width: `${width}px`, height: `${height}px` }}
        >
            {user?.image ? (
                <Image
                    src={urlFor(user.image)!.width(width).height(height).url()}
                    alt={`${user.name}'s avatar`}
                    fill
                    className="object-cover"
                    sizes="100%"
                    quality={100} // <--- Set the quality to 100 for better image quality
                    priority
                />
            ) : (
                <div
                    className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium"
                >
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    );
};

export default AvatarElement;
