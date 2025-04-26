import LogoBlue from "@/public/logo-blue.svg"
import LogoWhite from "@/public/logo-white.svg"
import Image from "next/image"
import { Button } from "./ui/button"

const HeroSection = () => {
  return (
    <div className="p-10 flex justify-center items-center dark:bg-gray-700 dark:bg-none bg-gradient-to-r from-[#c1daff] via-[#bfd9ff] to-[#8fbcff]">
        <div className="p-5 w-200 h-auto flex flex-col items-center gap-5">
            <Image src={LogoBlue} alt="logo-blue" width={150} height={150} className="block dark:hidden" />
            <Image src={LogoWhite} alt="logo-blue" width={150} height={150} className="hidden dark:block"/>
            <div className="niconne text-4xl text-center">Resonate, Write, Inspire</div>
            <div className="text-center text-gray-500 dark:text-gray-300">Your ultimate platform for creating, editing, and sharing engaging blogs. Empower your voice, connect with readers, and turn your ideas into captivating stories. Start your blogging journey today!</div>
            <div className="flex justify-center gap-2">
                <Button className="bg-[#0066ff] hover:bg-[#7266cb] dark:bg-white dark:text-black dark:hover:bg-white">Get Started</Button>
                <Button className="bg-trans border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">Explore</Button>
            </div>
        </div>

    </div>
  )
}

export default HeroSection