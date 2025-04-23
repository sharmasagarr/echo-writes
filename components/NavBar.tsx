"use client";

import Link from "next/link";
import Image from "next/image"
import SearchBar from "@/components/SearchBar";
import UserProfile from "@/components/UserProfile";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        };
        if (isOpen) {
          document.addEventListener('mousedown', handler);
        }
        return () => {
          document.removeEventListener('mousedown', handler);
        };
    }, [isOpen]);

    return (
        <header className="flex items-center max-w-full h-[3rem] lg:h-[5rem] dark:bg-gray-800 bg-[#0066ff] text-white dark:text-black shadow-xl">
            <nav className="flex justify-between items-center w-full mx-[1.5rem] lg:mx-[5rem]">
                <div className="logo flex justify-center items-center gap-2 lg:gap-3">
                <Image
                    src="/logo-white.svg"
                    alt="logo-white"
                    width={72}
                    height={72}
                    className="w-[40px] lg:w-[72px] "
                />
                <span className="mynerve text-xl lg:text-3xl ">echoWrites</span>
                </div>
                <div className="hidden lg:flex justify-between items-center gap-6 text-white text-lg">
                    <Link href="/">Home</Link>
                    <Link href="/">Explore</Link>
                    <Link href="/">Write</Link>
                    <Link href="/">About</Link>
                    <SearchBar />
                    <UserProfile />
                    <ThemeToggle />
                </div>

                <div className="lg:hidden flex">
                    <SearchBar />
                    <button
                        className="flex items-center"
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        <Menu className="w-6 h-6 dark:text-white"/>
                    </button>

                    <div
                        ref={menuRef}
                        className={`absolute top-13 left-0 w-full bg-[#0066ff] dark:bg-gray-800 dark:text-white px-4 py-3 shadow-md flex-col space-y-3 ${
                            isOpen ? 'flex opacity-100' : 'opacity-0 pointer-events-none'
                        } lg:hidden z-10`}
                        
                    >
                    <Link href="/">Home</Link>
                    <Link href="/">Explore</Link>
                    <Link href="/">Write</Link>
                    <Link href="/">About</Link>
                    <UserProfile />
                    <ThemeToggle />
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;