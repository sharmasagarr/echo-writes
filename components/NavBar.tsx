"use client";

import Link from "next/link";
import Image from "next/image"
import SearchBar from "@/components/SearchBar";
import UserProfile from "@/components/UserProfile";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="flex items-center max-w-full dark:bg-gray-800 bg-[#0066ff] text-white dark:text-black shadow-xl">
            <nav className="flex justify-between items-center w-full">
                <div className="logo flex justify-center items-center gap-3">
                <Image
                    src="/logo-white.svg"
                    alt="logo-white"
                    width={72}
                    height={72}
                    className="sm:w-[72px] w-[48px]" // Smaller logo only on mobile
                />
                <span className="mynerve">echoWrites</span>
                </div>
                <div className="hidden md:flex justify-between items-center gap-6 text-white text-lg">
                    <Link href="/">Home</Link>
                    <Link href="/">Explore</Link>
                    <Link href="/">Write</Link>
                    <Link href="/">About</Link>
                    <SearchBar />
                    <UserProfile />
                    <ThemeToggle />
                </div>

                <div className="md:hidden ml-auto">
                    <button
                        className="text-2xl"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        ☰
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;