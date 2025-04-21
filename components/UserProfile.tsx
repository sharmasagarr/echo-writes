"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleUserRound, ChevronDown } from 'lucide-react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton"
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
      <Skeleton className="w-24 h-8 rounded-lg" />
    );
  }

  return (
    <>
      {status !== "authenticated" ? (
        <div className="flex gap-2">
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
          <Button className="bg-transparent h-10 w-13 p-0 hover:bg-black/4 dark:hover:bg-gray-700 cursor-pointer">
            <CircleUserRound className="!h-6 !w-6 text-white" />
            <ChevronDown className="h-6 w-6 text-white -ml-2" />
          </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
