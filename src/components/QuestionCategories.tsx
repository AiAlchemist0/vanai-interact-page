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
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            <Users className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
            Survey Categories
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Comprehensive Question Categories
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our survey explored six key areas to understand British Columbians' perspectives on AI's impact across society.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="border-gradient hover:glow-primary transition-smooth group h-full">
              <CardHeader className="pb-3 sm:pb-6">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg ${category.gradient} flex items-center justify-center mb-3 sm:mb-4`}>
                  <category.icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl mb-2 group-hover:text-primary transition-smooth leading-tight">
                  {category.title}
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {category.sampleSize}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0">
                <div className="mb-4 sm:mb-6 flex-1">
                  <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                    Key Topics
                  </h4>
                  <ul className="space-y-1 sm:space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center gap-2 text-xs sm:text-sm">
                        <ChevronRight className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="truncate">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-border pt-3 sm:pt-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Key Insight
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-primary leading-tight">
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
        <div className="text-center mt-12 sm:mt-16">
          <Card className="inline-block border-gradient bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 leading-tight">
                Dive Deeper Into the Data
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl leading-relaxed">
                Each category contains rich qualitative and quantitative data, including sentiment analysis 
                of over 5,000 open-ended responses from British Columbians.
              </p>
              <Button 
                size="lg" 
                className="gradient-primary hover:glow-primary transition-smooth px-4 py-3 sm:px-6 sm:py-3 min-h-[44px] text-sm sm:text-base"
                onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Full Methodology
                <ChevronRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuestionCategories;