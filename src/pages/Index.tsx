import Hero from "@/components/Hero";
import VisionBanner from "@/components/VisionBanner";
import KeyInsights from "@/components/KeyInsights";
import QuestionCategories from "@/components/QuestionCategories";
import DataVisualization from "@/components/DataVisualization";
import Methodology from "@/components/Methodology";
import Footer from "@/components/Footer";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";
import NowPlayingBanner from "@/components/NowPlayingBanner";

const Index = () => {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-background pt-20">
        <div className="pt-0">
          <Hero />
          <VisionBanner />
          <KeyInsights />
          <QuestionCategories />
          <DataVisualization />
          <Methodology />
          <Footer />
        </div>
      </div>
    </AudioPlayerProvider>
  );
};

export default Index;
