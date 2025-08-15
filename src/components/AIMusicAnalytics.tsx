import { Music, Radio, Mic, Heart, Users, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const AIMusicAnalytics = () => {
  const musicGenres = [
    {
      genre: "Rap",
      emotion: "Raw Energy",
      description: "Expressing urgency and passion around AI concerns",
      icon: Mic,
      color: "from-orange-500 to-red-500"
    },
    {
      genre: "Country",
      emotion: "Heartfelt Stories",
      description: "Sharing personal narratives about AI's impact on communities",
      icon: Heart,
      color: "from-yellow-500 to-orange-500"
    },
    {
      genre: "Electronic",
      emotion: "Future Vision",
      description: "Capturing the excitement of technological possibilities",
      icon: Radio,
      color: "from-blue-500 to-purple-500"
    },
    {
      genre: "Jazz",
      emotion: "Sophisticated Reflection",
      description: "Improvising complex thoughts about AI's nuanced implications",
      icon: Music,
      color: "from-purple-500 to-indigo-500"
    },
    {
      genre: "Folk",
      emotion: "Traditional Wisdom",
      description: "Grounding AI discussions in human values and heritage",
      icon: Users,
      color: "from-green-500 to-emerald-500"
    },
    {
      genre: "Rock",
      emotion: "Bold Determination",
      description: "Channeling resilience and strength in facing AI challenges",
      icon: Sparkles,
      color: "from-red-500 to-pink-500"
    }
  ];

  const transformationSteps = [
    {
      title: "Raw Data",
      description: "Survey responses & statistics",
      icon: TrendingUp,
      step: "01"
    },
    {
      title: "Emotional Context",
      description: "Understanding feelings behind numbers",
      icon: Heart,
      step: "02"
    },
    {
      title: "AI Lyrics",
      description: "Transforming insights into verses",
      icon: Sparkles,
      step: "03"
    },
    {
      title: "Musical Expression",
      description: "Creating emotional soundscapes",
      icon: Music,
      step: "04"
    },
    {
      title: "Community Connection",
      description: "Collective BC + AI voice",
      icon: Users,
      step: "05"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-background via-background/50 to-secondary/10 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-gradient glow-accent">
            <Music className="w-4 h-4 mr-2" />
            Novel Concept
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-6">
            AI-Music Powered Analytics
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-6">
            Transforming cold data into emotional connections through the universal language of music
          </p>
          
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-muted-foreground italic leading-relaxed max-w-5xl mx-auto">
            "Where <span className="text-primary font-medium">data</span> becomes <span className="text-accent font-medium">rhythm</span>, and <span className="text-primary font-medium">insights</span> become <span className="text-accent font-medium">community</span>"
          </p>
        </div>

        {/* Musical Genres Section */}
        <div className="mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gradient">
            Emotional Expression Through Genres
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {musicGenres.map((genre, index) => {
              const Icon = genre.icon;
              return (
                <Card key={index} className="p-4 sm:p-8 bg-gradient-subtle border-gradient hover:glow-accent transition-all duration-300 hover-scale">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${genre.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-foreground">{genre.genre}</h4>
                    <p className="text-primary font-semibold mb-3">{genre.emotion}</p>
                    <p className="text-muted-foreground">{genre.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>

        {/* Problem Statement */}
        <div className="mb-16">
          <Card className="p-8 sm:p-12 bg-gradient-subtle border-gradient">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
                The Challenge: Numbers Can't Capture Emotions
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                How do you translate <span className="text-primary font-semibold">fear</span>, 
                <span className="text-accent font-semibold"> excitement</span>, or 
                <span className="text-secondary font-semibold"> hope</span> into statistics? 
                Traditional analytics show us what people think, but they struggle to convey 
                <span className="text-gradient font-semibold"> how people feel</span>.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-6xl sm:text-8xl">
                <span className="text-muted-foreground/30">📊</span>
                <span className="text-muted-foreground/50">→</span>
                <span className="text-muted-foreground/30">❓</span>
                <span className="text-muted-foreground/50">→</span>
                <span className="text-primary">🎵</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Transformation Process */}
        <div className="mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gradient">
            The AI-Music Solution
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {transformationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="p-6 h-full bg-gradient-subtle border-gradient hover:glow-primary transition-all duration-300 hover-scale">
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-4 text-xs">
                        {step.step}
                      </Badge>
                      <Icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                      <h4 className="font-bold mb-2 text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </Card>
                  
                  {/* Arrow between steps */}
                  {index < transformationSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Impact */}
        <div className="text-center">
          <Card className="p-8 sm:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-gradient">
            <Users className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gradient">
              The Collective BC + AI Voice
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Each song becomes a vessel for our community's collective consciousness about AI. 
              Through rhythm, melody, and verse, we create an emotional map of how British Columbia 
              truly feels about artificial intelligence - beyond the numbers, into the <span className="text-primary font-semibold">heart</span> of our shared experience.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIMusicAnalytics;