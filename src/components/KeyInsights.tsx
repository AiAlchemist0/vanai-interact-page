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
    <section id="insights" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Lightbulb className="w-4 h-4 mr-2" />
            Key Findings
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            What British Columbians Think About AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive insights from across the province reveal diverse perspectives on artificial intelligence's role in society.
          </p>
        </div>

        {/* Main Insights Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {insights.map((insight, index) => (
            <Card key={index} className="border-gradient hover:glow-primary transition-smooth group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg gradient-primary">
                    <insight.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                    {insight.title}
                  </CardTitle>
                </div>
                <p className="text-muted-foreground">
                  {insight.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insight.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stat.label}</span>
                        <span className="text-sm text-muted-foreground">{stat.value}%</span>
                      </div>
                      <Progress value={stat.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Geographic Distribution */}
        <Card className="border-gradient">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg gradient-accent">
                <MapPin className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Geographic Distribution</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Survey responses from across British Columbia
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {geographicData.map((region, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-card border border-border">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {region.percentage}%
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    {region.region}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {region.population}
                  </div>
                  <div className="mt-3">
                    <Progress value={region.percentage} className="h-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">1,001 voices from across BC</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Each data point represents real perspectives from British Columbians about our AI future.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyInsights;