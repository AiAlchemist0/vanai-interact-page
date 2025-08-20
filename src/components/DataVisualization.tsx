import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Brain,
  Heart,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const DataVisualization = () => {
  const sentimentData = [
    { 
      category: "AI in Healthcare", 
      positive: 67, 
      neutral: 23, 
      negative: 10,
      icon: Heart,
      total: 1001
    },
    { 
      category: "Job Displacement", 
      positive: 15, 
      neutral: 25, 
      negative: 60,
      icon: AlertTriangle,
      total: 1001
    },
    { 
      category: "Educational AI", 
      positive: 52, 
      neutral: 31, 
      negative: 17,
      icon: CheckCircle,
      total: 1001
    },
    { 
      category: "AI Governance", 
      positive: 38, 
      neutral: 42, 
      negative: 20,
      icon: Brain,
      total: 1001
    }
  ];

  const demographicBreakdown = [
    { age: "18-29", aiUsage: 45, concern: 35, optimism: 60 },
    { age: "30-44", aiUsage: 38, concern: 55, optimism: 42 },
    { age: "45-59", aiUsage: 25, concern: 68, optimism: 28 },
    { age: "60+", aiUsage: 15, concern: 72, optimism: 25 }
  ];

  const regionalData = [
    { region: "Vancouver", population: 766, aiAdoption: 42, regulation: 70 },
    { region: "Victoria", population: 137, aiAdoption: 38, regulation: 75 },
    { region: "Rural BC", population: 98, aiAdoption: 28, regulation: 78 }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
            Data Visualization
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Survey Data at a Glance
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Interactive visualizations revealing patterns and insights from 1,001 British Columbians.
          </p>
        </div>

        <Tabs defaultValue="sentiment" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 md:mb-8 h-auto">
            <TabsTrigger value="sentiment" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-2 sm:py-3 min-h-[40px] sm:min-h-[44px]">
              <span className="hidden sm:inline">Sentiment Analysis</span>
              <span className="sm:hidden">Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="demographics" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-2 sm:py-3 min-h-[40px] sm:min-h-[44px]">
              <span className="hidden sm:inline">Demographics</span>
              <span className="sm:hidden">Demo</span>
            </TabsTrigger>
            <TabsTrigger value="regional" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-2 sm:py-3 min-h-[40px] sm:min-h-[44px]">
              <span className="hidden sm:inline">Regional Data</span>
              <span className="sm:hidden">Regional</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment" className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {sentimentData.map((data, index) => (
                <Card key={index} className="border-gradient hover:glow-primary transition-smooth">
                  <CardHeader className="pb-2 sm:pb-3 md:pb-6 p-3 sm:p-4 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1 sm:p-1.5 md:p-2 rounded-lg gradient-primary flex-shrink-0">
                        <data.icon className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-primary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm sm:text-base md:text-lg leading-tight truncate">{data.category}</CardTitle>
                        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{data.total} responses</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-3 sm:p-4 md:p-6">
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-ai-green"></div>
                            Positive
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground">{data.positive}%</span>
                        </div>
                        <Progress value={data.positive} className="h-1.5 sm:h-2" />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-ai-blue"></div>
                            Neutral
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground">{data.neutral}%</span>
                        </div>
                        <Progress value={data.neutral} className="h-1.5 sm:h-2" />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-ai-orange"></div>
                            Negative
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground">{data.negative}%</span>
                        </div>
                        <Progress value={data.negative} className="h-1.5 sm:h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4 sm:space-y-6 md:space-y-8">
            <Card className="border-gradient">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <Users className="w-4 sm:w-5 h-4 sm:h-5" />
                  Age Group Analysis
                </CardTitle>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  AI usage, concerns, and optimism across different age groups
                </p>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {demographicBreakdown.map((demo, index) => (
                    <div key={index} className="p-3 sm:p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">Age Group: {demo.age}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">AI Usage</div>
                          <div className="text-2xl font-bold text-ai-blue mb-2">{demo.aiUsage}%</div>
                          <Progress value={demo.aiUsage} className="h-2" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Concern Level</div>
                          <div className="text-2xl font-bold text-ai-orange mb-2">{demo.concern}%</div>
                          <Progress value={demo.concern} className="h-2" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Optimism</div>
                          <div className="text-2xl font-bold text-ai-green mb-2">{demo.optimism}%</div>
                          <Progress value={demo.optimism} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {regionalData.map((region, index) => (
                <Card key={index} className="border-gradient hover:glow-primary transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-lg">{region.region}</CardTitle>
                    <p className="text-sm text-muted-foreground">{region.population} responses</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">AI Adoption</span>
                          <span className="text-sm text-muted-foreground">{region.aiAdoption}%</span>
                        </div>
                        <Progress value={region.aiAdoption} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Want Regulation</span>
                          <span className="text-sm text-muted-foreground">{region.regulation}%</span>
                        </div>
                        <Progress value={region.regulation} className="h-2" />
                      </div>

                      <div className="pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                          {((region.population / 1001) * 100).toFixed(1)}% of total responses
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">17</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Core Questions</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-ai-cyan mb-1 sm:mb-2">5,000+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Text Responses</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-ai-green mb-1 sm:mb-2">100+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Data Fields</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-ai-orange mb-1 sm:mb-2">6</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Key Categories</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataVisualization;