"use client";

import { MoveLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function SearchBar({showSearch, setShowSearch}: {showSearch: boolean, setShowSearch: (value: boolean) => void}) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
          className="relative group w-full h-9 lg:w-35 bg-white rounded-xl flex pr-2 transition-all duration-300 lg:focus-within:w-50 dark:bg-gray-800 dark:border dark:border-white"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full h-full rounded-xl pl-2 flex-1 bg-white outline-none text-black text-[18px] font-normal caret-blue-600 overflow-hidden dark:bg-gray-800 dark:text-white dark:caret-white"
          />
          <span
            className={clsx(
              "text-[18px] absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[75%]",
              {
                "opacity-0": inputValue !== "",
              }
            )}
          >
            {isFocused ? "Search Blogs or Author" : "Search Blogs"}
          </span>

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
