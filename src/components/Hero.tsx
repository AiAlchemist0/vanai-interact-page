import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Lightbulb, Users, BarChart3, MapPin, Gamepad2, Sparkles, Shield, Video, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import heroImage from "@/assets/hero-ai-survey.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  
  const handleSmoothScroll = (elementId: string) => {
    document.getElementById(elementId)?.scrollIntoView({ 
      behavior: prefersReducedMotion ? 'auto' : 'smooth' 
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden" role="banner" aria-label="BC AI Survey Hero Section">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AI Survey Dashboard visualization showing data analytics interface" 
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" />
      </div>

      {/* Animated Background Elements - Reduced for users with motion sensitivity */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 z-10" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 gradient-primary rounded-full opacity-5 blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 gradient-secondary rounded-full opacity-5 blur-3xl animate-[pulse_4s_ease-in-out_infinite] [animation-delay:2s]" />
          <div className="absolute bottom-32 left-8 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 gradient-accent rounded-full opacity-3 blur-3xl animate-[pulse_4s_ease-in-out_infinite] [animation-delay:1s]" />
        </div>
      )}

      {/* Main Content Container - Unified Responsive Layout */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col justify-center min-h-screen space-y-8 sm:space-y-12 lg:space-y-16 max-w-7xl mx-auto">
          
          {/* Header Badges */}
          <header className="text-center space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <Badge variant="secondary" className="border-gradient glow-primary px-3 sm:px-4 py-2 text-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Vancouver AI Hackathon Round 3
              </Badge>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="text-sm font-medium">AI-Music Powered Analytics</span>
              </div>
            </div>
          </header>

          {/* Main Title Section */}
          <div className="text-center space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gradient font-bold leading-[1.1] tracking-tight">
              <span className="block">BC + AI Survey</span>
              <span className="block">Insights</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-5xl mx-auto px-4">
              Where numbers become melodies and{" "}
              <span className="text-primary font-semibold">1,001 British Columbians</span>{" "}
              share their AI perspectives through revolutionary music-powered analytics. 
              Experience the breakthrough concept that transforms survey data into engaging musical stories.
            </p>
          </div>

          {/* Logo and Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* BC+AI Logo Section */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 lg:p-8 text-center flex items-center justify-center min-h-[120px] sm:min-h-[140px]">
              <a 
                href="https://vancouver.bc-ai.net/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-2 focus:outline-primary rounded-lg"
                aria-label="Visit BC+AI Ecosystem website"
              >
                <img 
                  src="/lovable-uploads/6b65586a-63ba-48f1-9c56-1846ec800f39.png" 
                  alt="BC+AI Ecosystem Logo" 
                  className="w-20 sm:w-24 lg:w-28 h-auto filter drop-shadow-lg" 
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>

            {/* Rival Technologies Logo Section */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 lg:p-8 text-center flex items-center justify-center min-h-[120px] sm:min-h-[140px]">
              <a 
                href="https://rival.tech" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-2 focus:outline-primary rounded-lg"
                aria-label="Visit Rival Technologies website"
              >
                <img 
                  src="/lovable-uploads/c69d28bd-ec46-4488-95b0-bb57fd96b104.png" 
                  alt="Rival Technologies Logo" 
                  className="w-20 sm:w-24 lg:w-28 h-auto filter drop-shadow-lg" 
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>

            {/* Stats Cards */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 lg:p-8 text-center min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Users className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">1,001</div>
              <div className="text-sm text-muted-foreground">Respondents</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 lg:p-8 text-center min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <BarChart3 className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-ai-cyan" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">5,000+</div>
              <div className="text-sm text-muted-foreground">Text Responses</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 lg:p-8 text-center min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <MapPin className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-ai-green" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">17</div>
              <div className="text-sm text-muted-foreground">Core Questions</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 lg:p-8 text-center min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Sparkles className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-ai-purple" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">16</div>
              <div className="text-sm text-muted-foreground">AI Songs</div>
            </div>
          </div>

          {/* Secondary Action Buttons */}
          <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-4" aria-label="Quick navigation">
            <div className="flex items-center gap-2">
              <Button 
                size="lg" 
                variant="secondary"
                className="min-h-[48px] px-4 sm:px-6 gap-2 hover:scale-105 transition-all duration-300 focus:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-secondary bg-gradient-to-r from-ai-cyan/20 to-primary/20 hover:from-ai-cyan/30 hover:to-primary/30 border-ai-cyan/30 text-ai-cyan hover:text-white hover:shadow-lg hover:shadow-ai-cyan/20"
                onClick={() => handleSmoothScroll('vision')}
                aria-label="View project vision and watch video"
              >
                <Lightbulb className="w-5 h-5" />
                <span className="hidden sm:inline">Vision</span>
              </Button>
              
              <Button 
                size="icon" 
                variant="outline"
                className="min-h-[48px] min-w-[48px] hover:scale-105 transition-all duration-300 focus:scale-105 focus:outline-2 focus:outline-offset-2 border-ai-cyan/30 text-ai-cyan hover:bg-ai-cyan/10 hover:border-ai-cyan/50 hover:text-ai-cyan hover:shadow-md"
                onClick={() => handleSmoothScroll('vision')}
                aria-label="Watch vision video"
              >
                <Video className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="lg" 
                variant="secondary"
                className="min-h-[48px] px-4 sm:px-6 gap-2 hover:scale-105 transition-all duration-300 focus:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-secondary bg-gradient-to-r from-ai-purple/20 to-ai-green/20 hover:from-ai-purple/30 hover:to-ai-green/30 border-ai-purple/30 text-ai-purple hover:text-white hover:shadow-lg hover:shadow-ai-purple/20"
                onClick={() => handleSmoothScroll('insights')}
                aria-label="View survey insights and analytics"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Insights</span>
              </Button>
              
              <Button 
                size="icon" 
                variant="outline"
                className="min-h-[48px] min-w-[48px] hover:scale-105 transition-all duration-300 focus:scale-105 focus:outline-2 focus:outline-offset-2 border-ai-purple/30 text-ai-purple hover:bg-ai-purple/10 hover:border-ai-purple/50 hover:text-ai-purple hover:shadow-md"
                onClick={() => navigate('/ai-analytics')}
                aria-label="Go to AI Analytics dashboard"
              >
                <Bot className="w-5 h-5" />
              </Button>
            </div>

            <Button 
              size="lg" 
              variant="secondary"
              className="min-h-[48px] px-4 sm:px-6 gap-2 hover:scale-105 transition-all duration-300 focus:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-secondary bg-gradient-to-r from-ai-green/20 to-ai-cyan/20 hover:from-ai-green/30 hover:to-ai-cyan/30 border-ai-green/30 text-ai-green hover:text-white hover:shadow-lg hover:shadow-ai-green/20"
              onClick={() => navigate('/game')}
              aria-label="Play BC AI interactive game"
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="hidden sm:inline">Play Game</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline"
                  className="min-h-[48px] min-w-[48px] hover:scale-105 transition-all duration-300 focus:scale-105 focus:outline-2 focus:outline-offset-2 border-muted-foreground/30 text-muted-foreground hover:bg-muted-foreground/10 hover:border-muted-foreground/50 hover:text-foreground hover:shadow-md"
                  aria-label="View legal disclaimer and project information"
                >
                  <Shield className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4 sm:mx-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Legal Disclaimer
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Document Information</h4>
                    <p>
                      <strong>Date:</strong> August 15, 2025<br />
                      <strong>For concerns, contact:</strong> <a href="mailto:Deanshev@gmail.com" className="text-primary hover:underline">Deanshev@gmail.com</a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Legal Jurisdiction</h4>
                    <p>
                      This project and all associated materials are governed by the laws of British Columbia, Canada. Any legal disputes or matters arising from this project shall be subject to the exclusive jurisdiction of the courts of Vancouver, British Columbia, Canada.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Educational Purpose & Concept Rights</h4>
                    <p>
                      The intent of this project is within educational content only as per hackathon guidelines and falls under fair dealing provisions of the Canadian Copyright Act for educational purposes. This project introduces the concept of AI-Music Powered Analytics. The author of the project holds the right to the concept and can release the rights to BC + AI and Rival Tech for further exploration and usage. Copying the concept apart from these two parties must be contacted to the author Dean Shev directly.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Copyright & Intellectual Property</h4>
                    <p>
                      All original content, including but not limited to code, design, concepts, and methodologies, are protected under Canadian copyright law. The use of any copyrighted materials in this project falls under the fair dealing exception of the Copyright Act (R.S.C., 1985, c. C-42) for educational, research, and non-commercial purposes only.
                    </p>
                    <p>
                      Any third-party content, data, or materials used are either licensed appropriately, fall under fair dealing provisions, or are used with permission. All rights to original survey data and analysis belong to the project author and designated parties as outlined above.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Song Creation Intent</h4>
                    <p>
                      All songs are created without an intent to offend, upset or commit any defamatory act of any sorts to the individuals in the songs. The songs are created as artistic expression and community engagement pieces.
                    </p>
                    <p>
                      The intent of the songs is to connect wonderful individuals, "artists" of the BC + AI community and cherish their participation and support and not to defame or cause harm to any individual's reputation.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Post-Hackathon Usage & Distribution</h4>
                    <p>
                      Beyond the hackathon, all songs will not be released, distributed, or used in any capacity without first obtaining explicit written permission and consent from the person(s) featured or referenced in the content.
                    </p>
                    <p>
                      This includes but is not limited to: commercial use, public performance, streaming platforms, broadcast media, or any form of monetization.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Social Media & Public Sharing</h4>
                    <p>
                      Songs will not be shared on social media platforms, posted publicly, or distributed through any digital channels unless explicitly approved by written consent from the associated artist or individual featured in the content.
                    </p>
                    <p>
                      This policy protects individual privacy rights and ensures compliance with Canadian privacy legislation and personal information protection standards.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Limitation of Liability</h4>
                    <p>
                      This project is provided "as is" for educational and demonstration purposes. The author and associated parties disclaim any warranties and shall not be liable for any damages arising from the use of this project or its content.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </nav>

          {/* Main CTA Button */}
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={() => handleSmoothScroll('audio-experience')}
              className="gradient-primary hover:glow-primary transition-all duration-300 hover:scale-105 focus:scale-105 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg lg:text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl animate-fade-in min-h-[56px] sm:min-h-[64px] group focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              aria-label="Explore BC AI Album - Navigate to audio experience section"
            >
              <span className="flex items-center gap-2 sm:gap-3">
                🎵 Explore BC AI Album Now
                <span className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
              </span>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;