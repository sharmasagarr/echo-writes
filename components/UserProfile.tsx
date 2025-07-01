"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from 'lucide-react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import AvatarElement from "./AvatarElement";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import slugify from "slugify";
import { nanoid } from "nanoid";

export default function UserProfile() {
  const [hasMounted, setHasMounted] = useState(false);
  const { data: session, status } = useSession();
  const { user, loadingUser } = useUser();
  const router = useRouter();
  const currentUrl = usePathname();
  // console.log(session)

  const slug = `${slugify('hey there i am using echo-writes', { lower: true, strict: true })}-${nanoid(1)}`;
  // console.log("Slug:", slug);

  useEffect(() => setHasMounted(true), []);

  if (!hasMounted || status === "loading") {
    return (
      <div className="w-10 h-8 rounded-lg bg-gray-100 dark:bg-gray-400 animate-pulse" />
    );
  }

  return (
    <>
      {status !== "authenticated" ? (
        <div className="flex flex-col lg:flex-row gap-2">
          <Button
            onClick={() => {
              router.push(`?modal=login`, { scroll: false });
            }}
            className="flex items-center bg-transparent border shadow-none rounded-3xl cursor-pointer hover:bg-white hover:text-black dark:border-white dark:text-white"
          >
            Login
          </Button>
          <Button
            onClick={() => {
              router.push(`?modal=signup`, { scroll: false });
            }}
            className="flex items-center bg-white text-black shadow-none rounded-3xl cursor-pointer hover:bg-white"
          >
            SignUp
          </Button>
        </div>
      ):(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2">
            {/* Mobile View*/}
            <Button className="lg:hidden bg-transparent text-white h-full !p-0 hover:bg-black/4 dark:hover:bg-gray-700 cursor-pointer shadow-none flex flex-col items-start justify-center">
              <div className="flex gap-0">
                <div className="flex items-center gap-2">
                  <AvatarElement width={40} height={40} />
                  <div className="flex flex-col items-start">
                    <h1 className="text-sm">{!loadingUser ? user?.name : session.user.name }</h1>
                    <small className="text-[0.6rem] opacity-80 -mt-1">{session.user.email}</small>
                  </div>
                  <ChevronDown className="!h-3 !w-3 text-white" />
                </div>
              </div>
            </Button>

            {/* Desktop: Show user icon + dropdown */}
            <button className="hidden lg:flex items-center gap-0 bg-transparent w-fit h-10 p-0 hover:bg-transparent cursor-pointer shadow-none">
              <AvatarElement
                width={35}
                height={35}
              />
              <ChevronDown className="!w-3 !h-3 text-white" />
            </button>
          </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="mb-3 lg:mt-2 w-fit top-1/2 left-1/2 lg:left-auto lg:-right-15 lg:absolute"
          >
            <DropdownMenuItem>
              <div>
                <p className="font-medium">{!loadingUser ? user?.name : session.user.name }</p>
                <small>{session.user.email}</small>
              </div>
            </DropdownMenuItem><hr className="mb-1"/>
            <DropdownMenuItem onClick={() => router.push(`/profile`)} className="cursor-pointer hover:!text-blue-500">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({redirectTo: `${currentUrl}`})} className="cursor-pointer hover:!text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> 
      )}
    </>
  );
}
