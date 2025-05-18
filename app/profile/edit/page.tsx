'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EditProfileForm from "@/components/EditProfileForm";
import { urlFor } from "@/app/sanity/lib/image";

const EditProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [oldName, setOldName] = useState<string>("");
    const [oldImage, setOldImage] = useState<string>("");
    const [oldBio, setOldBio] = useState<string>("");
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.username) return;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/user/get-info", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: session?.user.username }),
                });
                const json = await res.json();
                setOldName(json.user.name);
                setOldImage(json.user.image ? urlFor(json.user.image)!.url() : "");
                setOldBio(json.user.bio);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [session?.user.username]);
    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col justify-center gap-2 lg:gap-3 items-center pattern dark:pattern h-30 lg:h-50">
                <div className='p-3 font-semibold lg:tracking-wider lg:leading-snug lg:text-4xl text-center bg-gray-800 text-white shadow-lg border-2 border-black-400'>Edit Your Profile</div>
            </div>

            {/* Main Content Area */}
            <div className="flex items-center justify-center lg:p-2 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                <div className="bg-white dark:bg-gray-800 p-4 lg:p-8 rounded-xl shadow-lg w-full max-w-3xl">
                {!loading && 
                    <EditProfileForm
                        oldName={oldName}
                        oldImage={oldImage}
                        oldBio={oldBio}
                    />
                }
                </div>
            </div>
        </div>
    )
}

export default EditProfilePage