import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import UserProfile from "@/components/UserProfile";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main>
      <header className="flex items-center dark:bg-gray-800 bg-[#0066ff] text-white dark:text-black shadow-lg">
        <nav className="flex justify-between items-center">
          <div className="logo flex justify-center items-center gap-3">
            <img src="/logo-white.svg" alt="logo-white" width="73" />
            <span className="mynerve">echoWrites</span>
          </div>
          <div className="flex justify-between items-center gap-6 text-white text-lg">
            <Link href="/">Home</Link>
            <Link href="/">Explore</Link>
            <Link href="/">Write</Link>
            <Link href="/">About</Link>
            <SearchBar />
            <UserProfile />
            <ThemeToggle />
          </div>
        </nav>
      </header>
    </main>
  );
}
