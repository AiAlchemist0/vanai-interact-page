import { Database, Lightbulb, Music, Heart, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const VisionBanner = () => {
  const visionSteps = [{
    icon: Database,
    text: "Data",
    description: "Raw Numbers",
    color: "from-blue-500 to-cyan-500",
  }, {
    icon: Lightbulb,
    text: "Insights",
    description: "Understanding",
    color: "from-yellow-400 to-orange-500",
  }, {
    icon: Music,
    text: "Music",
    description: "Creative Expression",
    color: "from-purple-500 to-pink-500",
  }, {
    icon: Heart,
    text: "Dancing",
    description: "Human Connection",
    color: "from-pink-500 to-red-500",
  }, {
    icon: Users,
    text: "Community",
    description: "Shared Love",
    color: "from-green-500 to-emerald-500",
  }];

  return (
    <section id="vision" className="py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-6">
        {/* Enhanced Vision Overview */}
        <div className="text-center max-w-6xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-8">
            Our Vision: Transforming Data Into Human Connection
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-4">
            Where numbers become melodies, and statistics become stories
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            We believe in a <span className="text-primary font-semibold">revolutionary concept</span>: transforming dry survey data into engaging musical experiences that bring communities together through the universal language of music.
          </p>
        </div>

        {/* Transformation Journey */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gradient">
            The Journey of Transformation
          </h3>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            {visionSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col lg:flex-row items-center">
                  <Card className="w-48 h-48 hover-scale transition-all duration-300">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                      <div className={`w-16 h-16 mb-4 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-foreground">{step.text}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  
                  {index < visionSteps.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-primary mx-4 my-4 lg:my-0 hidden lg:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
export default VisionBanner;