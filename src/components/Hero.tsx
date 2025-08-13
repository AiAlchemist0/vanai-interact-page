import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, BarChart3, MapPin, Gamepad2, Headphones, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "@/contexts/AudioContext";
import heroImage from "@/assets/hero-ai-survey.jpg";
const Hero = () => {
  const navigate = useNavigate();
  const { playSpecificSong } = useAudio();
  
  const handlePlayBCAIHackathon = () => {
    playSpecificSong("bc-ai-hackathon");
    // Optional: scroll to audio player to show it's playing
    setTimeout(() => {
      const audioPlayer = document.querySelector('[class*="fixed bottom-4"]');
      if (audioPlayer) {
        audioPlayer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 200);
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="AI Survey Dashboard" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
        </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-primary rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-secondary rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <Badge variant="secondary" className="mb-6 border-gradient glow-primary">
          <BarChart3 className="w-4 h-4 mr-2" />
          Vancouver AI Hackathon Round 3
        </Badge>

        {/* Logo and Title Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
          <img 
            src="/lovable-uploads/6b65586a-63ba-48f1-9c56-1846ec800f39.png" 
            alt="BC+AI Ecosystem Logo" 
            className="w-40 md:w-48 h-auto filter drop-shadow-lg flex-shrink-0"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-gradient leading-tight text-center md:text-left">
            BC AI Survey
            <br />
            Insights
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
          Discover what <span className="text-primary font-semibold">1,001 British Columbians</span> think about artificial intelligence. 
          Explore comprehensive survey data covering AI experience, concerns, and future vision.
        </p>

        {/* Key Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg px-6 py-3">
            <Users className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground">1,001</div>
              <div className="text-sm text-muted-foreground">Respondents</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg px-6 py-3">
            <BarChart3 className="w-6 h-6 text-ai-cyan" />
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground">5,000+</div>
              <div className="text-sm text-muted-foreground">Text Responses</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg px-6 py-3">
            <MapPin className="w-6 h-6 text-ai-green" />
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground">17</div>
              <div className="text-sm text-muted-foreground">Core Questions</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gradient-primary hover:glow-primary transition-smooth group text-lg px-8 py-6" onClick={() => document.getElementById('vision')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            Project's Vision
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button size="lg" className="gradient-secondary hover:glow-secondary transition-smooth group text-lg px-8 py-6" onClick={() => document.getElementById('insights')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            <BarChart3 className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Survey Data Deep Dive
          </Button>

          <Button 
            size="lg" 
            className="gradient-accent hover:glow-accent transition-smooth group text-lg px-8 py-6" 
            onClick={() => navigate('/game')}
          >
            <Gamepad2 className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            PLAY BC AI GAME
          </Button>
        </div>

        {/* Enhanced Featured Song Section */}
        <div className="mt-8 space-y-4">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm rounded-xl p-6 border border-primary/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">🎵 Featured Audio Experience</h3>
                <p className="text-white/80 text-sm">Immerse yourself in our BC AI journey</p>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Headphones className="h-4 w-4" />
                <span>High Quality Audio</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button 
                  onClick={handlePlayBCAIHackathon}
                  size="lg"
                  className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg group"
                >
                  <Play className="h-6 w-6 text-primary-foreground ml-0.5 group-hover:scale-110 transition-transform" />
                </Button>
                <div className="absolute -inset-2 bg-primary/30 rounded-full animate-pulse opacity-60" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-semibold text-base">BC AI Hackathon</h4>
                <p className="text-white/70 text-sm">by Rival Tech</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
                    ))}
                  </div>
                  <span className="text-white/50 text-xs">Click to explore our audio journey</span>
                </div>
              </div>
              
              <div className="hidden sm:block">
                <Button 
                  onClick={handlePlayBCAIHackathon}
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Listening
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          
        </div>
      </div>
      </section>
  );
};
export default Hero;