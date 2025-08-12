import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, BarChart3, MapPin, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-ai-survey.jpg";
const Hero = () => {
  const navigate = useNavigate();
  
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient leading-tight">
          BC AI Survey
          <br />
          Insights
        </h1>

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
          <Button size="lg" className="gradient-primary hover:glow-primary transition-smooth group text-lg px-8 py-6" onClick={() => document.getElementById('insights')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            Explore Survey Data
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button 
            size="lg" 
            className="gradient-accent hover:glow-accent transition-smooth group text-lg px-8 py-6" 
            onClick={() => navigate('/game')}
          >
            <Gamepad2 className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            PLAY BC AI GAME
          </Button>
          
          <Button variant="outline" size="lg" className="border-gradient text-lg px-8 py-6 hover:bg-primary/10 transition-smooth" onClick={() => document.getElementById('methodology')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            View Methodology
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          
        </div>
      </div>
    </section>;
};
export default Hero;