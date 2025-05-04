import SearchBarDesktop from "./SearchBarDesktop"

const HeroSection = () => {
  return (
    <div className="p-4 lg:p-10 flex justify-center items-center hero dark:hero">
      <div className="p-1 lg:p-5 w-200 h-auto flex flex-col items-center gap-2 lg:gap-5">
        <div className="p-6 font-semibold lg:tracking-wider lg:leading-snug lg:text-4xl text-center bg-gray-800 text-white shadow-lg border-2 border-black-400">Where <span className="text-orange-500">thoughts</span> become stories,<br /><span className="text-orange-500">Stories</span> that inspire minds</div>
        <div className="text-xs text-black bg-amber-300 p-2 rounded-sm border-2 font-medium lg:text-[1.2rem] dark:text-black"><p>"Resonate, Write, Inspire"</p></div>
        <SearchBarDesktop />
      </div>
    </div>
  )
}

export default HeroSection