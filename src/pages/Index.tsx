import Hero from "@/components/Hero";
import VisionBanner from "@/components/VisionBanner";
import KeyInsights from "@/components/KeyInsights";
import QuestionCategories from "@/components/QuestionCategories";
import DataVisualization from "@/components/DataVisualization";
import Methodology from "@/components/Methodology";
import Footer from "@/components/Footer";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";
import NowPlayingBanner from "@/components/NowPlayingBanner";
import AudioPlayerEnhanced from "@/components/AudioPlayerEnhanced";

const Index = () => {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-background">
        <NowPlayingBanner />
        <div className="pt-0">
          <Hero />
          <VisionBanner />
          
          {/* Enhanced Audio Integration Section */}
          <div className="container mx-auto px-4 -mt-8 mb-8 relative z-10">
            <AudioPlayerEnhanced 
              variant="contextual" 
              songId="bc-ai-hackathon"
              className="max-w-md mx-auto shadow-lg"
            />
          </div>
          
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
