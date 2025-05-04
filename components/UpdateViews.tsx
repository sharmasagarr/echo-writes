"use client";

import { useEffect } from "react";

export default function UpdateViews({ id }: { id: string }) {
  useEffect(() => {
    const viewedKey = `viewed_${id}`;

    // If already viewed in this browser, do not update
    if (localStorage.getItem(viewedKey)) return;

    const updateViews = async () => {
      try {
        await fetch("/api/views/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        // Mark as viewed
        localStorage.setItem(viewedKey, "true");
      } catch (error) {
        console.error("Failed to update views:", error);
      }
    };

    updateViews();
  }, [id]);

  return null;
}
