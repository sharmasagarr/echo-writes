"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditProfilePage({oldName, oldImage, oldBio}: {oldName: string, oldImage: string, oldBio: string}) {
    const [name, setName] = useState<string>(oldName);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(oldImage);
    const [bio, setBio] = useState<string>(oldBio);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

        const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.size > MAX_FILE_SIZE) {
            toast.error('File is too large. Max 2MB allowed.');
            event.target.value = '';
            return;
        }
        setImage(file || null);
        const url = file ? URL.createObjectURL(file) : '';
        setPreviewUrl(url);
    };
    console.log(previewUrl)
    const clearImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Profile:", name, image, bio);
    };

  return (
    <form onSubmit={handleSubmit}>
        <div className="mb-5">
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
            Name
            </label>
            <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow-sm border rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-[1px]"
            placeholder="Enter your name"
            />
        </div>

        {/* Image Input */}
        <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="image" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold">
                Avatar
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                Max size: 2MB
                </p>
            </div>

            <div className="flex items-center justify-between">
                <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 cursor-pointer"
                />
                {(image || previewUrl) && (
                    <button
                        type="button"
                        onClick={clearImage}
                        className=" text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition duration-200 ease-in-out cursor-pointer"
                    >
                        <X size={23} />
                    </button>
                )}
            </div>
            {previewUrl && (
                <div className="border rounded-lg flex justify-center items-center shadow-sm p-2 mt-2">
                    <div className="w-40 h-40 border rounded-full bg-white dark:bg-gray-700 flex justify-center items-center shadow-sm overflow-hidden">
                    <Image
                        src={previewUrl}
                        alt="Preview"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                    />
                    </div>
                </div>
            )}
        </div>

        {/* Bio Input */}
        <div className="mb-5">
            <label htmlFor="bio" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
            Bio
            </label>
            <textarea
            id="bio"
            value={bio ?? ""}
            onChange={(e) => setBio(e.target.value)}
            className="shadow-sm border rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-[1px]"
            placeholder="Enter your bio"
            rows={4}
            />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center mt-6">
            <button
            type="submit"
            className="flex justify-center items-center bg-blue-600 w-4/6 text-sm lg:text-[20px] lg:w-1/2 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 lg:py-3 lg:px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-200 ease-in-out cursor-pointer"
            >
            Save
            </button>
        </div>
    </form>
  );
}
