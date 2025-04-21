"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <form
      action="/"
      className="relative group w-35 h-9 bg-white rounded-xl flex pr-2 transition-all duration-300 focus-within:w-50 dark:bg-gray-800 dark:border dark:border-white"
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-full rounded-xl pl-2 flex-1 bg-white outline-none text-black text-[18px] font-normal caret-blue-600 overflow-hidden dark:bg-gray-800 dark:text-white"
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
        <Search className="w-6 h-5 text-blue-600 ml-1 border-l border-blue-600 pl-1" />
      </button>
    </form>
  );
}
