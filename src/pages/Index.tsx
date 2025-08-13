import Hero from "@/components/Hero";
import KeyInsights from "@/components/KeyInsights";
import QuestionCategories from "@/components/QuestionCategories";
import DataVisualization from "@/components/DataVisualization";
import Methodology from "@/components/Methodology";
import Footer from "@/components/Footer";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";

const Index = () => {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-background">
        <Hero />
        <KeyInsights />
        <QuestionCategories />
        <DataVisualization />
        <Methodology />
        <Footer />
      </div>
    </AudioPlayerProvider>
  );
};

export default Index;
