"use client";

import Link from "next/link";
import Image from "next/image";
import LogoWhite from "@/public/logo-white.svg"
import SearchBarMobile from "@/components/SearchBarMobile";
import UserProfile from "@/components/UserProfile";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from "clsx";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    
    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Disable scrolling on both body and html
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.addEventListener('mousedown', handler);
        } else {
            // Re-enable scrolling on both body and html
            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener('mousedown', handler);
            document.body.style.overflow = "auto"; // Ensure scroll is re-enabled
            document.documentElement.style.overflow = "auto"; // Ensure scroll is re-enabled
        };
    }, [isOpen]);

    return (
        <header className="flex items-center w-full h-[4rem] lg:h-[5rem] dark:bg-gray-800 bg-[#0066ff] text-white dark:text-black shadow-xl border-b-3">
            <nav className="flex justify-between items-center w-screen mx-[1.5rem] lg:mx-[5rem]">
                {/* Logo Section */}
                <div className={clsx(
                    "flex justify-center items-center gap-2 lg:gap-3",
                    { "hidden": showSearch }
                )}>
                    <Image
                        src={LogoWhite}
                        alt="logo-white"
                        width={40}
                        height={40}
                        className="w-[40px] lg:w-[72px] "
                    />
                    <span className="mynerve text-white text-xl lg:text-3xl ">echoWrites</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden lg:flex justify-between items-center gap-6 text-white text-lg">
                    <Link href="/">Home</Link>
                    <Link href="/">Explore</Link>
                    <Link href="/blog/write">Write</Link>
                    <Link href="/">About</Link>
                    <UserProfile />
                    <ThemeToggle />
                    
                </div>

                {/* Mobile Nav Area */}
                <div className={clsx(
                    "lg:hidden flex items-center gap-2 h-full overflow:hidden",
                    { "w-full": showSearch }
                )}>
                    {/* Mobile Search Bar */}
                    <div className="w-full flex items-center">
                        <SearchBarMobile
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                        />
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        ref={menuButtonRef}
                        className={clsx(
                            "flex items-center",
                            { "hidden": showSearch }
                        )}
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        {!isOpen? <Menu className="w-6 h-6 dark:text-white"/>: <X className="w-6 h-6 dark:text-white"/>}
                    </button>

                    {/* Mobile Menu Dropdown */}
                    <div
                        ref={menuRef}
                        className={clsx(
                            "h-[calc(100dvh-4rem)] flex flex-col justify-between gap-3 absolute top-[4rem] left-0 w-full bg-[#0066ff] dark:bg-gray-800 dark:text-white px-4 py-3 shadow-md space-y-3 transition-opacity duration-300 ease-in-out", // Use calc for height, adjust top offset, add transitions
                            {
                                'flex opacity-100': isOpen,
                                'opacity-0 pointer-events-none': !isOpen
                            },
                            "lg:hidden z-10"
                        )}
                    >
                        <div className="flex flex-col justify-start gap-3">
                            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link><hr /> {/* Optional: Close menu on link click */}
                            <Link href="/" onClick={() => setIsOpen(false)}>Explore</Link><hr />
                            <Link href="/blog/write" onClick={() => setIsOpen(false)}>Write</Link><hr />
                            <Link href="/" onClick={() => setIsOpen(false)}>About</Link><hr />
                            <ThemeToggle /><hr />
                        </div>
                        <div className="flex flex-col gap-3 mb-3"><hr /><UserProfile /></div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;