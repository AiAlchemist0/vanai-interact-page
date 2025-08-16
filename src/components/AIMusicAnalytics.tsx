import { Music, Radio, Mic, Heart, Users, ArrowRight, Sparkles, TrendingUp, AlertTriangle, Target, Globe, MessageSquare, BrainCircuit, Music2, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import communityMusicConnection from "@/assets/community-music-connection.jpg";
import bcCollectiveVoice from "@/assets/bc-collective-voice.jpg";

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {musicGenres.map((genre, index) => {
              const Icon = genre.icon;
              return (
                <Card key={index} className="group p-4 bg-gradient-subtle border-gradient hover:shadow-xl transition-all duration-500 hover-scale overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${genre.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">{genre.genre}</h4>
                    <div className="inline-block px-2 py-1 bg-primary/10 rounded-full mb-2">
                      <p className="text-primary font-semibold text-xs">{genre.emotion}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{genre.description}</p>
                    
                    {/* Compact Audio Visualization */}
                    <div className="mt-3 flex justify-center space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-1 bg-gradient-to-t ${genre.color} rounded-full animate-pulse`} 
                             style={{ height: `${Math.random() * 12 + 6}px`, animationDelay: `${i * 100}ms` }}></div>
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
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              When individual voices become songs, and songs become community, we create something unprecedented
            </p>
            
            {/* BC Collective Voice Image */}
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl max-w-4xl mx-auto">
              <img 
                src={bcCollectiveVoice} 
                alt="Diverse voices from across British Columbia transforming into a collective musical symphony that connects communities from mountains to ocean" 
                className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-2xl font-bold mb-2">BC's Collective Voice</h4>
                <p className="text-base opacity-90">Individual stories becoming a shared symphony</p>
              </div>
            </div>
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

          {/* Community Impact Image */}
          <div className="mt-12 relative group overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src={communityMusicConnection} 
              alt="Diverse community connected through music and technology in British Columbia" 
              className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h4 className="text-2xl font-bold mb-2">Community Impact</h4>
              <p className="text-base opacity-90">Bringing British Columbia together through the universal language of music</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIMusicAnalytics;