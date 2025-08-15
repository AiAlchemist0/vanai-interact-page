import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Lightbulb, Users, BarChart3, MapPin, Gamepad2, Sparkles, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
      <div className="relative z-20 container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center min-h-screen">
          
          {/* Left Side - Content */}
          <div className="space-y-4 sm:space-y-8 lg:pr-8">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mb-3 sm:mb-6">
              <Badge variant="secondary" className="border-gradient glow-primary text-xs sm:text-sm">
                <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                Vancouver AI Hackathon Round 3
              </Badge>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">AI-Music Powered Analytics</span>
              </div>
            </div>

            {/* Logo and Title Section */}
            <div className="space-y-3 sm:space-y-6">
              <div className="flex flex-row items-center justify-start gap-4 sm:gap-8">
                <img src="/lovable-uploads/6b65586a-63ba-48f1-9c56-1846ec800f39.png" alt="BC+AI Ecosystem Logo" className="w-40 sm:w-48 lg:w-56 h-auto filter drop-shadow-lg flex-shrink-0" />
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-7xl xl:text-8xl text-gradient leading-tight text-left font-bold">
                    BC + AI Survey
                    <br />
                    Insights
                  </h1>
                </div>
              </div>

              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed text-center sm:text-left lg:text-xl">
                Discover what <span className="text-primary font-semibold">1,001 British Columbians</span> think about artificial intelligence. 
                Explore comprehensive survey data covering AI experience, concerns, and future vision.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-2 sm:px-4 py-3 sm:py-4 text-center min-h-[80px] sm:min-h-[100px]">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Users className="w-4 sm:w-6 h-4 sm:h-6 text-primary" />
                </div>
                <div className="text-lg sm:text-2xl font-bold text-foreground">1,001</div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Respondents</div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-2 sm:px-4 py-3 sm:py-4 text-center min-h-[80px] sm:min-h-[100px]">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <BarChart3 className="w-4 sm:w-6 h-4 sm:h-6 text-ai-cyan" />
                </div>
                <div className="text-lg sm:text-2xl font-bold text-foreground">5,000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Text Responses</div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-2 sm:px-4 py-3 sm:py-4 text-center min-h-[80px] sm:min-h-[100px]">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <MapPin className="w-4 sm:w-6 h-4 sm:h-6 text-ai-green" />
                </div>
                <div className="text-lg sm:text-2xl font-bold text-foreground">17</div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Core Questions</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 sm:space-y-4">
              {/* Mobile View - Square Icon Buttons */}
              <div className="flex sm:hidden justify-center gap-3">
                <Button size="icon" className="gradient-primary hover:glow-primary transition-smooth w-16 h-16" onClick={() => document.getElementById('novel-concept')?.scrollIntoView({
                behavior: 'smooth'
              })} aria-label="Project's Vision">
                  <Lightbulb className="w-6 h-6" />
                </Button>

                <Button size="icon" className="gradient-secondary hover:glow-secondary transition-smooth w-16 h-16" onClick={() => document.getElementById('insights')?.scrollIntoView({
                behavior: 'smooth'
              })} aria-label="Survey Deep Dive">
                  <BarChart3 className="w-6 h-6" />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline" className="border-muted-foreground/30 hover:border-muted-foreground transition-smooth w-16 h-16" aria-label="Legal Disclaimer">
                      <Shield className="w-6 h-6" />
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

                <Button size="icon" className="gradient-accent hover:glow-accent transition-smooth w-16 h-16" onClick={() => navigate('/game')} aria-label="Play BC AI Game">
                  <Gamepad2 className="w-6 h-6" />
                </Button>
              </div>

              {/* Desktop View - Text Buttons */}
              <div className="hidden sm:flex flex-col sm:grid sm:grid-cols-3 gap-3">
                <Button size="lg" className="gradient-primary hover:glow-primary transition-smooth group px-4 py-4 sm:px-4 sm:py-3 min-h-[48px] text-sm sm:text-sm font-medium" onClick={() => document.getElementById('novel-concept')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  Project's Vision
                  <Lightbulb className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button size="lg" className="gradient-secondary hover:glow-secondary transition-smooth group px-4 py-4 sm:px-4 sm:py-3 min-h-[48px] text-sm sm:text-sm font-medium" onClick={() => document.getElementById('insights')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  <BarChart3 className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                  Survey Deep Dive
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="border-muted-foreground/30 hover:border-muted-foreground transition-smooth group px-4 py-4 sm:px-4 sm:py-3 min-h-[48px] text-sm sm:text-sm font-medium">
                      <Shield className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                      Legal Disclaimer
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
              </div>

              <Button size="lg" className="hidden sm:flex gradient-accent hover:glow-accent transition-smooth group w-full px-4 py-4 sm:px-6 sm:py-3 min-h-[52px] text-base sm:text-base font-semibold" onClick={() => navigate('/game')}>
                <Gamepad2 className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                PLAY BC AI GAME
              </Button>
            </div>
          </div>

          {/* Right Side - Audio Player */}
          <div className="lg:pl-8 mt-4 lg:mt-0">
            <HeroAudioPlayer />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      
    </section>;
};
export default Hero;