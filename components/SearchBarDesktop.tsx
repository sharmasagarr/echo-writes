"use client"
import clsx from "clsx"
import { Search, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const SearchBarDesktop = () => {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null); // Specify type for ref

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the clicked element is outside the popupRef current element
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs only once on mount and cleans up on unmount

  return (
    <form action="/" className="hidden lg:flex justify-center items-center gap-2">
      <div
        className={clsx(
          "flex items-center gap-2 p-5 pr-2 bg-white dark:bg-gray-700 rounded-4xl w-110 h-13 border-2 border-black dark:border-gray-400",
          {
            "drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_0_4px_rgba(255,255,255,1)]": isFocused
          }
        )}
        ref={popupRef} // Attach ref to the container div
      >
        <input
          type="text"
          name="search"
          id="search"
          value={inputValue}
          placeholder="Search Blogs or Authors"
          onFocus={() => setIsFocused(true)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value)
          }}
          // Added flex-grow to allow input to take available space
          // Added flex-shrink-0 to prevent input from shrinking
          className="flex-grow flex-shrink-0 focus-within:outline-none text-lg"
        />
        <X
          onClick={() => {
            // Focus the input after clearing the value
            document.getElementById("search")?.focus()
            setInputValue("")
          }}
          // Added flex-shrink-0 to prevent icon from shrinking
          className={clsx("cursor-pointer w-6 h-6 flex-shrink-0", {"hidden": !inputValue})}
        />
        <button className="bg-gray-800 rounded-3xl w-9 h-9 flex items-center justify-center cursor-pointer flex-shrink-0">
          <Search
            className="w-4 h-4 text-white"
          />
        </button>
      </div>
    </form>
  )
}

export default SearchBarDesktop;
