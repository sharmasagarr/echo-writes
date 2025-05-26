"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SignUpForm from "@/components/SignUpForm";
import { cn } from "@/lib/utils/cn";

export default function SignUpModal() {
  const router = useRouter();
  const url = new URL(window.location.href);
  url.searchParams.delete('modal');
  const cleanUrl = url.toString();

  const closeModal = () => {
    router.push(cleanUrl, { scroll: false });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={closeModal}
        key="modal-background"
      />

      <motion.div
        className={cn(
          "w-[450px] max-w-full fixed top-1/2 left-1/2 bg-white border shadow-4xl rounded-xl p-6 z-50",
          "transform -translate-x-1/2 -translate-y-1/2 will-change-transform dark:bg-gray-900"
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        key="modal-content"
      >
        <SignUpForm />
      </motion.div>
    </AnimatePresence>
  );
}