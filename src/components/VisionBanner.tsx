import { Database, Lightbulb, Music, Heart, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import aiMusicDashboard from "@/assets/ai-music-dashboard.jpg";
import soundToDataTransformation from "@/assets/sound-to-data-transformation.jpg";
import communityMusicConnection from "@/assets/community-music-connection.jpg";
import aiBrainMusic from "@/assets/ai-brain-music.jpg";

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

        {/* Creative Image Gallery */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            {/* Large featured image */}
            <div className="md:col-span-6 relative group overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={aiMusicDashboard} 
                alt="AI-powered music analytics dashboard with colorful data visualizations" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-xl font-bold mb-2">AI-Music Dashboard</h4>
                <p className="text-sm opacity-90">Data visualization meets musical creativity</p>
              </div>
            </div>
            
            {/* Tall vertical image */}
            <div className="md:col-span-3 relative group overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={soundToDataTransformation} 
                alt="Abstract visualization of sound waves transforming into data points and statistics" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-4 text-white">
                <h4 className="text-lg font-bold mb-1">Sound to Data</h4>
                <p className="text-xs opacity-90">Transformation magic</p>
              </div>
            </div>
            
            {/* Square image */}
            <div className="md:col-span-3 relative group overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={aiBrainMusic} 
                alt="AI brain visualization with neural networks shaped like musical staff lines" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-4 text-white">
                <h4 className="text-lg font-bold mb-1">AI Innovation</h4>
                <p className="text-xs opacity-90">Neural music networks</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Our Innovation Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Lightbulb className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-4xl font-bold text-gradient">The Breakthrough: AI-Music Analytics</h3>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Our revolutionary 5-step process transforms data into musical experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { title: "Collect Data", description: "Gather survey responses & statistics", icon: Database },
              { title: "Analyze Context", description: "Understanding emotions behind numbers", icon: Heart },
              { title: "Generate Lyrics", description: "AI transforms insights into verses", icon: Lightbulb },
              { title: "Create Music", description: "Producing emotional soundscapes", icon: Music },
              { title: "Build Community", description: "Connecting voices across BC", icon: Users }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="p-6 h-full hover-scale transition-all duration-300 bg-gradient-subtle border-gradient">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-8 h-8 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </Card>
                  
                  {index < 4 && (
                    <ArrowRight className="hidden md:block w-6 h-6 text-primary absolute top-1/2 -right-9 transform -translate-y-1/2" />
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