import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Shield, Lightbulb, Users, MapPin } from "lucide-react";

const KeyInsights = () => {
  const insights = [
    {
      icon: Brain,
      title: "AI Experience Levels",
      description: "Current usage and comfort with AI technology",
      stats: [
        { label: "Never used AI", value: 45, color: "bg-ai-orange" },
        { label: "Basic usage", value: 35, color: "bg-ai-blue" },
        { label: "Regular users", value: 20, color: "bg-ai-green" }
      ]
    },
    {
      icon: TrendingUp,
      title: "Economic Impact Concerns",
      description: "How AI will affect jobs and economy in BC",
      stats: [
        { label: "Job displacement fears", value: 68, color: "bg-destructive" },
        { label: "Economic opportunities", value: 45, color: "bg-ai-green" },
        { label: "Neutral outlook", value: 32, color: "bg-muted-foreground" }
      ]
    },
    {
      icon: Shield,
      title: "Trust & Governance",
      description: "Attitudes toward AI regulation and oversight",
      stats: [
        { label: "Want more regulation", value: 72, color: "bg-ai-purple" },
        { label: "Trust in AI systems", value: 38, color: "bg-ai-cyan" },
        { label: "Democratic participation", value: 56, color: "bg-primary" }
      ]
    }
  ];

  const geographicData = [
    { region: "Vancouver", percentage: 76.6, population: "766 responses" },
    { region: "Victoria", percentage: 13.7, population: "137 responses" },
    { region: "Rural BC", percentage: 9.7, population: "98 responses" }
  ];

  return (
    <section id="insights" className="py-12 sm:py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            <Lightbulb className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
            Key Findings
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gradient leading-tight">
            What British Columbians Think About AI
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive insights from across the province reveal diverse perspectives on artificial intelligence's role in society.
          </p>
        </div>

        {/* Main Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {insights.map((insight, index) => (
            <Card key={index} className="border-gradient hover:glow-primary transition-smooth group">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-1.5 sm:p-2 rounded-lg gradient-primary flex-shrink-0">
                    <insight.icon className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-smooth leading-tight">
                    {insight.title}
                  </CardTitle>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {insight.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium truncate pr-2">{stat.label}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">{stat.value}%</span>
                      </div>
                      <Progress value={stat.value} className="h-1.5 sm:h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Geographic Distribution */}
        <Card className="border-gradient">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 sm:p-2 rounded-lg gradient-accent flex-shrink-0">
                <MapPin className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">Geographic Distribution</CardTitle>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Survey responses from across British Columbia
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {geographicData.map((region, index) => (
                <div key={index} className="text-center p-4 sm:p-6 rounded-lg bg-card border border-border">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">
                    {region.percentage}%
                  </div>
                  <div className="text-base sm:text-lg font-semibold mb-1 truncate">
                    {region.region}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {region.population}
                  </div>
                  <div className="mt-2 sm:mt-3">
                    <Progress value={region.percentage} className="h-2 sm:h-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
            <Users className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            <span className="text-primary font-medium text-sm sm:text-base">1,001 voices from across BC</span>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Each data point represents real perspectives from British Columbians about our AI future.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyInsights;