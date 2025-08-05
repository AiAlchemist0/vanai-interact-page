import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Briefcase, 
  Palette, 
  GraduationCap, 
  Scale, 
  Telescope,
  ChevronRight,
  Users
} from "lucide-react";

const QuestionCategories = () => {
  const categories = [
    {
      icon: Brain,
      title: "AI Experience",
      description: "Usage levels, comfort, and learning patterns",
      gradient: "gradient-primary",
      topics: ["Current AI usage", "Comfort levels", "Learning preferences", "Technology adoption"],
      sampleSize: "1,001 responses",
      keyInsight: "45% have never used AI tools"
    },
    {
      icon: Briefcase,
      title: "Job Impact",
      description: "Economic fears, opportunities, and displacement concerns",
      gradient: "gradient-secondary",
      topics: ["Job displacement", "Economic opportunities", "Skills retraining", "Industry impact"],
      sampleSize: "1,001 responses",
      keyInsight: "68% worry about job displacement"
    },
    {
      icon: Palette,
      title: "Creative Impact",
      description: "Authenticity, artistic value, and human expression",
      gradient: "gradient-accent",
      topics: ["Artistic authenticity", "Creative value", "Human expression", "Cultural impact"],
      sampleSize: "1,001 responses",
      keyInsight: "Mixed views on AI creativity"
    },
    {
      icon: GraduationCap,
      title: "Sector Applications",
      description: "Healthcare, education, government, and environment",
      gradient: "gradient-warm",
      topics: ["Healthcare AI", "Educational tools", "Government services", "Environmental solutions"],
      sampleSize: "1,001 responses",
      keyInsight: "Healthcare shows highest acceptance"
    },
    {
      icon: Scale,
      title: "Governance",
      description: "Regulation, trust, and democratic participation",
      gradient: "gradient-secondary",
      topics: ["AI regulation", "Trust in systems", "Democratic participation", "Oversight mechanisms"],
      sampleSize: "1,001 responses",
      keyInsight: "72% want more regulation"
    },
    {
      icon: Telescope,
      title: "Future Vision",
      description: "Hopes, concerns, and advice for leaders",
      gradient: "gradient-primary",
      topics: ["Future hopes", "Key concerns", "Leadership advice", "Vision for BC"],
      sampleSize: "5,000+ text responses",
      keyInsight: "Optimistic but cautious outlook"
    }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Users className="w-4 h-4 mr-2" />
            Survey Categories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Comprehensive Question Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our survey explored six key areas to understand British Columbians' perspectives on AI's impact across society.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="border-gradient hover:glow-primary transition-smooth group h-full">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${category.gradient} flex items-center justify-center mb-4`}>
                  <category.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-smooth">
                  {category.title}
                </CardTitle>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {category.sampleSize}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6 flex-1">
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    Key Topics
                  </h4>
                  <ul className="space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center gap-2 text-sm">
                        <ChevronRight className="w-3 h-3 text-primary" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-border pt-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Key Insight
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {category.keyInsight}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block border-gradient bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Dive Deeper Into the Data
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl">
                Each category contains rich qualitative and quantitative data, including sentiment analysis 
                of over 5,000 open-ended responses from British Columbians.
              </p>
              <Button 
                size="lg" 
                className="gradient-primary hover:glow-primary transition-smooth"
                onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Full Methodology
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuestionCategories;