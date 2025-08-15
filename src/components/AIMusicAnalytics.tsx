import { Music, Radio, Mic, Heart, Users, ArrowRight, Sparkles, TrendingUp, AlertTriangle, Target, Globe, MessageSquare, BrainCircuit, Music2, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
      title: "Collect Data",
      description: "Gather survey responses & statistics",
      icon: BarChart3,
    },
    {
      title: "Analyze Context",
      description: "Understanding emotions behind numbers",
      icon: Heart,
    },
    {
      title: "Generate Lyrics",
      description: "AI transforms insights into verses",
      icon: Sparkles,
    },
    {
      title: "Create Music",
      description: "Producing emotional soundscapes",
      icon: Music2,
    },
    {
      title: "Build Community",
      description: "Connecting voices across BC",
      icon: Users,
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 text-sm px-4 py-2 border-primary/20 bg-primary/5">
            <BrainCircuit className="w-4 h-4 mr-2" />
            Revolutionary AI-Music Analytics
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-gradient">
            Where Data Meets Melody
          </h2>
          
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-muted-foreground italic leading-relaxed max-w-5xl mx-auto">
            "Where <span className="text-primary font-medium">data</span> becomes <span className="text-accent font-medium">rhythm</span>, and <span className="text-primary font-medium">insights</span> become <span className="text-accent font-medium">community</span>"
          </p>
        </div>

        {/* The Challenge Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
              <h3 className="text-4xl font-bold text-gradient">The Problem: Lost in Translation</h3>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Traditional analytics miss the human story behind the numbers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-slate-800 to-gray-800 border-slate-600">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                <h4 className="text-2xl font-bold mb-4 text-white">Traditional Analytics</h4>
                <ul className="text-left space-y-3 text-gray-300">
                  <li>• Cold numbers and statistics</li>
                  <li>• Disconnected from human emotion</li>
                  <li>• Hard to relate to personally</li>
                  <li>• Limited community engagement</li>
                  <li>• Boring presentation formats</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-slate-700 to-gray-700 border-slate-500">
              <div className="text-center">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <h4 className="text-2xl font-bold mb-4 text-white">What We Need</h4>
                <ul className="text-left space-y-3 text-gray-300">
                  <li>• Emotional resonance and connection</li>
                  <li>• Personal and relatable experiences</li>
                  <li>• Community building and sharing</li>
                  <li>• Engaging and memorable formats</li>
                  <li>• Universal language of expression</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Our Innovation Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-4xl font-bold text-gradient">The Breakthrough: AI-Music Analytics</h3>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Our revolutionary 5-step process transforms data into musical experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {transformationSteps.map((step, index) => {
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
                  
                  {index < transformationSteps.length - 1 && (
                    <ArrowRight className="hidden md:block w-6 h-6 text-primary absolute top-1/2 -right-9 transform -translate-y-1/2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Musical Expression Gallery */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Music2 className="w-8 h-8 text-accent mr-3" />
              <h3 className="text-4xl font-bold text-gradient">Genres as Emotional Languages</h3>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Each musical genre becomes a unique voice for different community sentiments and experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {musicGenres.map((genre, index) => {
              const Icon = genre.icon;
              return (
                <Card key={index} className="group p-6 bg-gradient-subtle border-gradient hover:shadow-xl transition-all duration-500 hover-scale overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${genre.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">{genre.genre}</h4>
                    <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                      <p className="text-primary font-semibold text-sm">{genre.emotion}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{genre.description}</p>
                    
                    {/* Audio Visualization Placeholder */}
                    <div className="mt-6 flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1 bg-gradient-to-t ${genre.color} rounded-full animate-pulse`} 
                             style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 100}ms` }}></div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Community Impact Showcase */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-4xl font-bold text-gradient">Building BC's Collective Voice</h3>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              When individual voices become songs, and songs become community, we create something unprecedented
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
              <Mic className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">1,000+</h4>
              <p className="text-sm text-muted-foreground">Individual Voices</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <Music2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2">500+</h4>
              <p className="text-sm text-muted-foreground">Unique Songs Generated</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">50+</h4>
              <p className="text-sm text-muted-foreground">Community Sessions</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <MessageSquare className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-2">2,000+</h4>
              <p className="text-sm text-muted-foreground">Community Interactions</p>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-gradient">
            <div className="text-center">
              <Target className="w-16 h-16 text-primary mx-auto mb-6" />
              <h4 className="text-3xl font-bold mb-6 text-gradient">Our Impact Vision</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div>
                  <h5 className="font-semibold text-primary mb-3">🎵 Musical Democracy</h5>
                  <p className="text-muted-foreground">Every survey response becomes a unique musical voice, ensuring no opinion is lost in aggregated data</p>
                </div>
                <div>
                  <h5 className="font-semibold text-primary mb-3">🤝 Community Connection</h5>
                  <p className="text-muted-foreground">Shared listening experiences create bonds between strangers who discover their similar AI perspectives</p>
                </div>
                <div>
                  <h5 className="font-semibold text-primary mb-3">🌍 Provincial Dialogue</h5>
                  <p className="text-muted-foreground">A living, breathing soundtrack of BC's relationship with AI that evolves with our collective understanding</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIMusicAnalytics;