import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, BarChart3, MapPin, Gamepad2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-ai-survey.jpg";
import HeroAudioPlayer from "./HeroAudioPlayer";
const Hero = () => {
  const navigate = useNavigate();
  return <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="AI Survey Dashboard" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 gradient-primary rounded-full opacity-5 blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 gradient-secondary rounded-full opacity-5 blur-3xl animate-[pulse_4s_ease-in-out_infinite] [animation-delay:2s]" />
        <div className="absolute bottom-32 left-8 w-80 h-80 gradient-accent rounded-full opacity-3 blur-3xl animate-[pulse_4s_ease-in-out_infinite] [animation-delay:1s]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 container mx-auto px-2 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen">
          
          {/* Left Side - Content */}
          <div className="space-y-6 sm:space-y-8 lg:pr-8">
            <Badge variant="secondary" className="mb-4 sm:mb-6 border-gradient glow-primary text-xs sm:text-sm">
              <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
              Vancouver AI Hackathon Round 3
            </Badge>

            {/* Logo and Title Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-6">
                <img src="/lovable-uploads/6b65586a-63ba-48f1-9c56-1846ec800f39.png" alt="BC+AI Ecosystem Logo" className="w-40 sm:w-36 lg:w-40 h-auto filter drop-shadow-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl sm:text-3xl font-bold text-gradient leading-tight mb-2 sm:mb-3 text-justify lg:text-6xl">
                    BC + AI Survey
                    <br />
                    Insights
                  </h1>
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="text-xs sm:text-sm font-medium">AI-Music Powered Analytics</span>
                  </div>
                </div>
              </div>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-justify lg:text-xl">
                Discover what <span className="text-primary font-semibold">1,001 British Columbians</span> think about artificial intelligence. 
                Explore comprehensive survey data covering AI experience, concerns, and future vision.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Users className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">1,001</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Respondents</div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-ai-cyan" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">5,000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Text Responses</div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-ai-green" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">17</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Core Questions</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-row gap-3">
                <Button size="lg" className="gradient-primary hover:glow-primary transition-smooth group flex-1 px-4 py-3 sm:px-6 sm:py-3 min-h-[44px] text-sm sm:text-base" onClick={() => document.getElementById('vision')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  Project's Vision
                  <ArrowRight className="ml-2 w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button size="lg" className="gradient-secondary hover:glow-secondary transition-smooth group flex-1 px-4 py-3 sm:px-6 sm:py-3 min-h-[44px] text-sm sm:text-base" onClick={() => document.getElementById('insights')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  <BarChart3 className="mr-2 w-3 sm:w-4 h-3 sm:h-4 group-hover:scale-110 transition-transform" />
                  Survey Deep Dive
                </Button>
              </div>

              <Button size="lg" className="gradient-accent hover:glow-accent transition-smooth group w-full px-4 py-3 sm:px-6 sm:py-3 min-h-[44px] text-sm sm:text-base" onClick={() => navigate('/game')}>
                <Gamepad2 className="mr-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform" />
                PLAY BC AI GAME
              </Button>
            </div>
          </div>

          {/* Right Side - Audio Player */}
          <div className="lg:pl-8">
            <HeroAudioPlayer />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      
    </section>;
};
export default Hero;