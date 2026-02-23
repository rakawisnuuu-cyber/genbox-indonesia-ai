import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SocialProofBar from "@/components/SocialProofBar";
import DibuatUntukSection from "@/components/DibuatUntukSection";
import FiturSection from "@/components/FiturSection";
import CaraKerjaSection from "@/components/CaraKerjaSection";
import HasilNyataSection from "@/components/HasilNyataSection";
import HargaSection from "@/components/HargaSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <SocialProofBar />
      <DibuatUntukSection />
      <FiturSection />
      <CaraKerjaSection />
      <HasilNyataSection />
      <HargaSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
};

export default Index;
