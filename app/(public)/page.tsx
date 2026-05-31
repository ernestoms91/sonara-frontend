import { FeaturesSection } from "@/components/features/hero/FeaturesSection";
import { HeroSection } from "@/components/features/hero/HeroSection";
import { HeroVisual } from "@/components/features/hero/HeroVisual";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HeroVisual />
      <FeaturesSection />
    </>
  );
}
