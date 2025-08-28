import Hero from "@/components/Hero";
import VisionBanner from "@/components/VisionBanner";
import AudioExperienceSection from "@/components/AudioExperienceSection";
import AIMusicAnalytics from "@/components/AIMusicAnalytics";
import KeyInsights from "@/components/KeyInsights";
import QuestionCategories from "@/components/QuestionCategories";
import DataVisualization from "@/components/DataVisualization";
import Methodology from "@/components/Methodology";
import Footer from "@/components/Footer";
import OptimizedAudioPlayerProvider from "@/components/OptimizedAudioPlayerProvider";
import NowPlayingBanner from "@/components/NowPlayingBanner";


import PhilippeSpecialEffects from "@/components/PhilippeSpecialEffects";


const Index = () => {
  return (
    <OptimizedAudioPlayerProvider>
      <PhilippeSpecialEffects type="page" disabled={true}>
        <div className="min-h-screen bg-background pt-20">
        <div className="pt-0">
          <Hero />
          <AudioExperienceSection />
          <VisionBanner />
          
          <AIMusicAnalytics />
          <KeyInsights />
          <QuestionCategories />
          <DataVisualization />
          <Methodology />
          <Footer />
        </div>
        </div>
      </PhilippeSpecialEffects>
    </OptimizedAudioPlayerProvider>
  );
};

export default Index;
