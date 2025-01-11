import CtaSection from "@/components/views/sections/cta/ca-section";
import FaqSection from "@/components/views/sections/faq/faq-section";
import FeaturesSection from "@/components/views/sections/features/features-section";
import HeroSection from "@/components/views/sections/hero/hero-section";


export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
