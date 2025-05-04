"use client";

import { MoveLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar({showSearch, setShowSearch}: {showSearch: boolean, setShowSearch: (value: boolean) => void}) {
  const [inputValue, setInputValue] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div className="w-full flex justify-between items-center gap-2">
      {showSearch && 
        <div className="w-8 h-7 border flex items-center justify-center border-white rounded-3xl">
          <MoveLeft onClick={() => setShowSearch(false)} className="p-1 dark:text-white"/>
        </div>}
      {(showSearch || isDesktop) && (
        <form
          action="/"
          className="relative group w-full h-9 bg-white rounded-xl flex pr-2 transition-all duration-300 dark:bg-gray-800 dark:border dark:border-white"
        >
          <input
            type="text"
            value={inputValue}
            placeholder="Search Blogs or Authors"
            onChange={handleInputChange}
            className="w-full h-full rounded-xl pl-2 flex-1 bg-white outline-none text-black text-[18px] font-normal caret-blue-600 overflow-hidden dark:bg-gray-800 dark:text-white dark:caret-white"
          />
          <button className="cursor-pointer" type="submit">
            <Search className="w-6 h-5 text-blue-600 ml-1 pl-1 border-l border-blue-600 dark:border-white dark:text-white" />
          </button>
        </form>
      )}
      </div>

      {!showSearch && !isDesktop && (
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setShowSearch(true)}
        >
          <Search className="w-6 h-5 text-white" />
        </button>
      )}
    </>
  );
}
