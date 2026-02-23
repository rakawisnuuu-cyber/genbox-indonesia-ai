import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SocialProofBar from "@/components/SocialProofBar";
import DibuatUntukSection from "@/components/DibuatUntukSection";
import FiturSection from "@/components/FiturSection";
import CaraKerjaSection from "@/components/CaraKerjaSection";
import HasilNyataSection from "@/components/HasilNyataSection";
import HargaSection from "@/components/HargaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SocialProofBar />
      <DibuatUntukSection />
      <FiturSection />
      <CaraKerjaSection />
      <HasilNyataSection />
      <HargaSection />
    </div>
  );
};

export default Index;
