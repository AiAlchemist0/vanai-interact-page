import { Database, Lightbulb, Music, Heart, Users } from "lucide-react";

const VisionBanner = () => {
  const visionSteps = [
    {
      icon: Database,
      text: "Data",
      description: "Raw Numbers",
      color: "text-ai-cyan",
      glow: "glow-cyan"
    },
    {
      icon: Lightbulb,
      text: "Insights",
      description: "Understanding",
      color: "text-ai-yellow",
      glow: "glow-yellow"
    },
    {
      icon: Music,
      text: "Music",
      description: "Creative expression",
      color: "text-ai-purple",
      glow: "glow-purple"
    },
    {
      icon: Heart,
      text: "Dancing",
      description: "Human connection",
      color: "text-ai-pink",
      glow: "glow-pink"
    },
    {
      icon: Users,
      text: "AI Community",
      description: "Shared love",
      color: "text-ai-green",
      glow: "glow-green"
    }
  ];

  return (
    <div id="vision" className="relative py-6 sm:py-8 px-4 sm:px-6 bg-gradient-to-r from-background/95 via-primary/5 to-background/95 backdrop-blur-sm border-b border-primary/10">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{animationDelay: '0s'}} />
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-accent/40 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="container mx-auto">
        {/* Vision Statement */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gradient mb-3 sm:mb-4 animate-fade-in leading-tight">
            Our Vision: The Journey from Data to Community
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-fade-in px-4" style={{animationDelay: '0.3s'}}>
            Transform raw data into meaningful connections that bring us together
          </p>
        </div>

        {/* Vision Flow - Mobile */}
        <div className="md:hidden flex flex-col items-center gap-6 max-w-md mx-auto">
          {visionSteps.map((step, index) => (
            <div key={step.text} className="flex flex-col items-center w-full">
              <div className="flex flex-col items-center">
                <div 
                  className={`relative p-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20 transition-all duration-300 animate-scale-in ${step.glow}`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                  
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-75" style={{animationDelay: `${index * 0.5}s`}} />
                </div>
                
                <h3 className="text-base font-semibold text-foreground mt-3 text-center">
                  {step.text}
                </h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  {step.description}
                </p>
              </div>

              {/* Vertical arrow connector */}
              {index < visionSteps.length - 1 && (
                <div className="flex flex-col items-center mt-4">
                  <svg 
                    className="w-6 h-8 text-primary/40 animate-pulse" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{animationDelay: `${index * 0.3 + 0.5}s`}}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  
                  {/* Flowing particle */}
                  <div 
                    className="w-1 h-1 bg-primary/60 rounded-full animate-bounce mt-1"
                    style={{
                      animationDelay: `${index * 0.4 + 1}s`,
                      animationDuration: '2s'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default VisionBanner;