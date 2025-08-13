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
      description: "Shared future",
      color: "text-ai-green",
      glow: "glow-green"
    }
  ];

  return (
    <div id="vision" className="relative py-8 px-6 bg-gradient-to-r from-background/95 via-primary/5 to-background/95 backdrop-blur-sm border-b border-primary/10">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{animationDelay: '0s'}} />
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-accent/40 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="container mx-auto">
        {/* Vision Statement */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-4 animate-fade-in">
            Our Vision: The Journey from Data to Community
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in" style={{animationDelay: '0.3s'}}>
            Transform raw data into meaningful connections that bring us together
          </p>
        </div>

        {/* Vision Flow - Desktop */}
        <div className="hidden md:flex items-center justify-center gap-3 lg:gap-6 max-w-5xl mx-auto">
          {visionSteps.map((step, index) => (
            <div key={step.text} className="flex items-center">
              {/* Step */}
              <div 
                className="flex flex-col items-center group cursor-pointer animate-scale-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className={`relative p-3 lg:p-4 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105 ${step.glow} group-hover:shadow-lg`}>
                  <step.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${step.color} group-hover:scale-110 transition-transform duration-300`} />
                  
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-75 group-hover:opacity-100" style={{animationDelay: `${index * 0.5}s`}} />
                </div>
                
                <h3 className="text-sm lg:text-base font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">
                  {step.text}
                </h3>
                <p className="text-sm text-muted-foreground hidden lg:block">
                  {step.description}
                </p>
              </div>

              {/* Arrow connector */}
              {index < visionSteps.length - 1 && (
                <div className="flex items-center mx-2 lg:mx-4">
                  {/* Flowing arrow */}
                  <div className="relative">
                    <svg 
                      className="w-8 lg:w-12 h-4 text-primary/40 animate-pulse" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{animationDelay: `${index * 0.3 + 0.5}s`}}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    
                    {/* Flowing particle */}
                    <div 
                      className="absolute top-1/2 left-0 w-1 h-1 bg-primary/60 rounded-full animate-bounce"
                      style={{
                        animationDelay: `${index * 0.4 + 1}s`,
                        animationDuration: '2s'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vision Flow - Mobile */}
        <div className="md:hidden grid grid-cols-5 gap-2 max-w-sm mx-auto">
          {visionSteps.map((step, index) => (
            <div key={step.text} className="flex flex-col items-center">
              <div 
                className={`relative p-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20 transition-all duration-300 animate-scale-in`}
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <step.icon className={`w-4 h-4 ${step.color}`} />
                
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-75" style={{animationDelay: `${index * 0.5}s`}} />
              </div>
              
              <h3 className="text-sm font-medium text-foreground mt-1 text-center leading-tight">
                {step.text}
              </h3>
            </div>
          ))}
        </div>

        {/* Elegant subtitle */}
        <div className="text-center mt-6 animate-fade-in" style={{animationDelay: '1.5s'}}>
          <p className="text-lg md:text-xl text-muted-foreground italic">
            "Where <span className="text-primary font-medium">data</span> becomes <span className="text-accent font-medium">rhythm</span>, and <span className="text-primary font-medium">insights</span> become <span className="text-accent font-medium">community</span>"
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisionBanner;