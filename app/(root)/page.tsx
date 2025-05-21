import HeroSection from "@/components/HeroSection";
import Posts from "@/components/Posts";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Posts />
      <div className="mt-10 lg:mt-15"></div>
    </main>
  );
}
