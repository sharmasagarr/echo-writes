import HeroSection from "@/components/HeroSection";
import Posts from "@/components/Posts";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Posts />
      <div className="mt-20"></div>
    </main>
  );
}
