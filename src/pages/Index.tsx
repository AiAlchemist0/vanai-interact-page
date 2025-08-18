import Hero from "@/components/Hero";
import VisionBanner from "@/components/VisionBanner";
import AIMusicAnalytics from "@/components/AIMusicAnalytics";
import KeyInsights from "@/components/KeyInsights";
import QuestionCategories from "@/components/QuestionCategories";
import DataVisualization from "@/components/DataVisualization";
import Methodology from "@/components/Methodology";
import Footer from "@/components/Footer";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";
import NowPlayingBanner from "@/components/NowPlayingBanner";
import EnhancedAnalytics from "@/components/EnhancedAnalytics";
import PhilippeSpecialEffects from "@/components/PhilippeSpecialEffects";

const Index = () => {
  return (
    <AudioPlayerProvider>
      <PhilippeSpecialEffects type="page">
        <div className="min-h-screen bg-background pt-20">
        <div className="pt-0">
          <Hero />
          <VisionBanner />
          <AIMusicAnalytics />
          <KeyInsights />
          <QuestionCategories />
          <DataVisualization />
          <section className="py-16 sm:py-20 lg:py-24">
            <div className="container mx-auto px-4">
              <EnhancedAnalytics />
            </div>
          </section>
          <Methodology />
          <Footer />
        </div>
        </div>
      </PhilippeSpecialEffects>
    </AudioPlayerProvider>
  );
};

export default Index;
