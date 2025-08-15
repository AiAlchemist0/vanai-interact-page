import { Database, Lightbulb, Music, Heart, Users } from "lucide-react";
const VisionBanner = () => {
  const visionSteps = [{
    icon: Database,
    text: "Data",
    description: "Raw Numbers",
    color: "text-ai-cyan",
    glow: "glow-cyan"
  }, {
    icon: Lightbulb,
    text: "Insights",
    description: "Understanding",
    color: "text-ai-yellow",
    glow: "glow-yellow"
  }, {
    icon: Music,
    text: "Music",
    description: "Creative expression",
    color: "text-ai-purple",
    glow: "glow-purple"
  }, {
    icon: Heart,
    text: "Dancing",
    description: "Human connection",
    color: "text-ai-pink",
    glow: "glow-pink"
  }, {
    icon: Users,
    text: "AI Community",
    description: "Shared love",
    color: "text-ai-green",
    glow: "glow-green"
  }];
  return (
    <section id="vision" className="py-16 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gradient mb-6">Our Vision</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe in a <span className="text-primary font-semibold" id="novel-concept">novel concept</span>: transforming dry survey data into engaging musical experiences that bring communities together.
          </p>
        </div>
      </div>
    </section>
  );
};
export default VisionBanner;