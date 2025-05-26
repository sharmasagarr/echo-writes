"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { type Author, type Post } from "@/lib/definitions";
import { urlFor } from "@/app/sanity/lib/image";
import { format } from 'date-fns'; // Import date formatting library
import Link from 'next/link'; // Import Link component for navigation
import { formatDate} from "@/lib/utils/formatDate";
import { getDescription } from "@/lib/utils/getDescription";
import { Eye } from "lucide-react";

export default function UserPortfolio({ username }: { username: string }) {
    const [user, setUser] = useState<Author | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);
    const [postsError, setPostsError] = useState<string | null>(null);

    // Fetching user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoadingUser(true);
            setUserError(null);
            try {
                const res = await fetch("/api/user/get-info", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username }),
                });
                const json = await res.json();
                if (json.error) {
                    console.error("Error fetching user information:", json.error);
                    setUserError(json.error);
                } else {
                    setUser(json.user);
                }
            } catch (error: any) {
                console.error("Error fetching user information:", error);
                setUserError(error.message ?? "Failed to fetch user info.");
            } finally {
                setLoadingUser(false);
            }
        }
        fetchUserInfo();
    }, [username]);

    // Fetching user posts once user is loaded
    useEffect(() => {
        if (!user?._id) {
            if (!loadingUser && !userError) {
                 setPosts([]);
                 setLoadingPosts(false);
            }
            return;
        }

        const fetchUserPosts = async () => {
            setLoadingPosts(true);
            setPostsError(null);
            try {
                const res = await fetch("/api/user/get-posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user._id }), // Use user._id
                });
                const json = await res.json();
                if (json.error) {
                    console.error("Error fetching user posts:", json.error);
                    setPostsError(json.error);
                } else {
                    setPosts(json.posts ?? []);
                }
            } catch (error: any) { 
                 console.error("Error fetching user posts:", error);
                 setPostsError(error.message ?? "Failed to fetch posts.");
            } finally {
                setLoadingPosts(false);
            }
        }
        fetchUserPosts();
    }, [user?._id, loadingUser, userError]);


    // Loading and Error States
    if (loadingUser) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center text-gray-600 dark:text-gray-400">Loading user data...</div>
            </section>
        );
    }

    if (userError || !user) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center text-red-500 dark:text-red-400">
                    {userError ?? `User "${username}" not found.`}
                </div>
            </section>
        );
    }

    // Rendering the profile once user data is available
    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 antialiased overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-[5rem]">
                {/* Profile Header */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-5 lg:gap-12 mb-16 pt-12">
                {/* Avatar */}
                <div className="relative shrink-0 group">
                    <div className="w-40 h-40 md:w-50 md:h-50 relative rounded-full overflow-hidden ring-8 ring-white dark:ring-gray-800 shadow-xl transition-all duration-500 group-hover:scale-105">
                    {user?.image ? (
                        <Image
                        src={urlFor(user.image)!.width(240).height(240).url()}
                        alt={`${user.name}'s avatar`}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 240px) 100vw, 240px"
                        priority
                        quality={100}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-6xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    </div>
                </div>

                {/* User Info */}
                <div className="relative flex-grow text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 dark:text-white leading-tight mb-2 transition-colors duration-300 group-hover:text-primary">
                    {user.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">@{user.username}</p>

                    {user?.bio && (
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-md max-w-3xl md:max-w-none mx-auto md:mx-0 font-light leading-relaxed">
                        {user.bio}
                    </p>
                    )}

                    {/* Metadata */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                    {user.email && (
                        <a
                        href={`mailto:${user.email}`}
                        className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                        <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {user.email}
                        </a>
                    )}
                    {user._createdAt && (
                        <span className="inline-flex items-center">
                        <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                            />
                        </svg>
                        Joined on {format(new Date(user._createdAt), 'PPP')}
                        </span>
                    )}
                    </div>
                </div>
                </div>

                {/* Posts Section */}
                <div className="mt-10">
                <div className="flex items-center gap-4 mb-12">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
                    Showcase
                    </h2>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                </div>

                {loadingPosts && <div className="text-center text-gray-500">Loading posts...</div>}

                {postsError && <div className="text-center text-red-500">{postsError}</div>}

                {!loadingPosts && !postsError && posts.length === 0 && (
                    <div className="text-center text-gray-500">No posts found for this user.</div>
                )}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                    {posts.map((post) => (
                    <Link
                        key={post._id}
                        href={`/blog/${post._id}`}
                        className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-500">{formatDate(post._createdAt)}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            {post.views}
                        </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{getDescription(post.body)}</p>

                        {post.image && urlFor(post.image) && (
                        <Image
                            src={urlFor(post.image)!.width(400).height(150).url()}
                            alt="post-image"
                            width={400}
                            height={150}
                            className="w-full rounded-lg border dark:border-gray-700 transition duration-300"
                        />
                        )}

                        <div className="mt-2 text-xs text-gray-500">{post.category?.title}</div>
                    </Link>
                    ))}
                </div>
                </div>
            </div>

            <div className="mt-24"></div>
        </section>
    );
}
// This component fetches and displays a user's portfolio, including their profile information and posts.