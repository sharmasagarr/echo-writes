"use client";

import NavBar from "@/components/NavBar";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session, status} = useSession();
  return (
    <main>
      <NavBar />
      <div>
        Hello {status==="authenticated"? session?.user?.name: "user"}!
      </div>
    </main>
  );
}
