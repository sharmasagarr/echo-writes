"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleUserRound, ChevronDown } from 'lucide-react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import SignUp from "@/components/SignUp";
import Login from "@/components/Login";
import { signOut, useSession } from "next-auth/react";

export default function PopupMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClickedLogin, setIsClickedLogin] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!hasMounted || status === "loading") {
    return (
      <Skeleton className="w-24 h-8 rounded-lg dark:text-white" />
    );
  }

  return (
    <>
      {status !== "authenticated" ? (
        <div className="flex flex-col lg:flex-row gap-2">
          <Button
            onClick={() => {
              setIsOpen(true);
              setIsClickedLogin(true);
            }}
            className="flex items-center bg-transparent border shadow-none rounded-3xl cursor-pointer hover:bg-white hover:text-black dark:border-white dark:text-white"
          >
            Login
          </Button>
          <Button
            onClick={() => {
              setIsOpen(true);
              setIsClickedLogin(false);
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
            {/* Mobile: Show "My Account" + icon */}
            <Button className="lg:hidden bg-transparent text-white h-full !p-0 hover:bg-black/4 dark:hover:bg-gray-700 cursor-pointer shadow-none flex flex-col items-start justify-center">
              <div className="flex items-center gap-0">
                <h1 className="text-small">{session.user.name}</h1>
                <ChevronDown className="!h-3 !w-3 text-white" />
              </div>
              <small className="text-xs opacity-80 -mt-1">{session.user.email}</small>
            </Button>


            {/* Desktop: Show user icon + dropdown */}
            <Button className="hidden lg:flex bg-transparent h-10 w-14 p-0 hover:bg-black/4 dark:hover:bg-gray-700 cursor-pointer shadow-none">
              <CircleUserRound className="!h-7 !w-7 text-white" />
              <ChevronDown className="text-white -ml-2" />
            </Button>
          </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="mb-3 lg:mt-2 w-fit top-1/2 left-1/2 lg:left-auto lg:-right-15 lg:absolute"
          >
            <DropdownMenuItem>
              <div>
                <p className="font-medium">{session.user.name}</p>
                <small>{session.user.email}</small>
              </div>
              </DropdownMenuItem><hr />
            <DropdownMenuItem onClick={() => signOut({redirectTo: "/"})}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> 
      )}

      {!session &&  <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              ref={popupRef}
              className={cn(
                "w-[450px] max-w-full fixed top-1/2 left-1/2 bg-white border shadow-4xl rounded-xl p-6 z-50",
                "transform -translate-x-1/2 -translate-y-1/2 will-change-transform dark:bg-gray-900"
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {isClickedLogin ? (
                <Login setIsClickedLogin={setIsClickedLogin} />
              ) : (
                <SignUp setIsClickedLogin={setIsClickedLogin} />
              )}
            </motion.div>
          </>
        )}
        </AnimatePresence>
      }
    </>
  );
}
