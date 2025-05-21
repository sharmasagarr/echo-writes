'use client'

import { useUser } from "@/context/UserContext";
import EditProfileForm from "@/components/EditProfileForm";
import { urlFor } from "@/app/sanity/lib/image";
import EditProfileFormSkeleton from "@/components/EditProfileFormSkeleton";

const EditProfilePage = () => {
    const { user, loadingUser } = useUser();

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col justify-center gap-2 lg:gap-3 items-center pattern dark:pattern h-30 lg:h-50">
                <div className='p-3 font-semibold lg:tracking-wider lg:leading-snug lg:text-4xl text-center bg-gray-800 text-white shadow-lg border-2 border-black-400'>Edit Your Profile</div>
            </div>

            {/* Main Content Area */}
            <div className="flex items-center justify-center lg:p-2 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                <div className="bg-white dark:bg-gray-800 p-4 lg:p-8 rounded-xl shadow-lg w-full max-w-3xl mb-6 lg:mb-10">
                {!loadingUser ? ( 
                    <EditProfileForm
                        oldName={user?.name ?? ""}
                        oldImage={user?.image ? urlFor(user.image)!.url() : ""}
                        oldBio={user?.bio ?? ""}
                    />
                ) : (
                    <EditProfileFormSkeleton />
                )}
                </div>
            </div>
        </div>
    )
}

export default EditProfilePage