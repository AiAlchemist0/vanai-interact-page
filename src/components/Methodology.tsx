import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  MapPin, 
  BarChart3, 
  Clock,
  ExternalLink,
  Download,
  CheckCircle
} from "lucide-react";

const Methodology = () => {
  const methodologySteps = [
    {
      step: "01",
      title: "Survey Design",
      description: "17 core questions covering AI experience, attitudes, and concerns across 6 key categories",
      details: ["Mixed methodology approach", "Quantitative and qualitative questions", "Sentiment analysis framework"]
    },
    {
      step: "02", 
      title: "Participant Recruitment",
      description: "1,001 complete responses from across British Columbia with demographic diversity",
      details: ["Geographic representation", "Age group diversity", "Income and education spread"]
    },
    {
      step: "03",
      title: "Data Collection",
      description: "Comprehensive survey responses with over 5,000 open-ended text responses",
      details: ["Online survey platform", "Quality control measures", "Response validation"]
    },
    {
      step: "04",
      title: "Analysis & Processing",
      description: "Advanced sentiment analysis and statistical processing of all responses",
      details: ["Automated sentiment scoring", "Statistical analysis", "Pattern recognition"]
    }
  ];

  const dataQuality = [
    { metric: "Response Rate", value: "100%", description: "Complete survey responses" },
    { metric: "Geographic Coverage", value: "Province-wide", description: "Urban, suburban, and rural BC" },
    { metric: "Data Points", value: "100,000+", description: "Individual response elements" },
    { metric: "Text Analysis", value: "5,000+", description: "Open-ended responses analyzed" }
  ];

  return (
    <section id="methodology" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <FileText className="w-4 h-4 mr-2" />
            Survey Methodology
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Rigorous Research Approach
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive methodology ensures reliable, representative insights from British Columbians about AI's impact on society.
          </p>
        </div>

        {/* Methodology Steps */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {methodologySteps.map((step, index) => (
            <Card key={index} className="border-gradient hover:glow-primary transition-smooth">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {step.step}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-ai-green" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Quality Metrics */}
        <Card className="border-gradient mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Data Quality & Coverage
            </CardTitle>
            <p className="text-muted-foreground">
              Comprehensive metrics ensuring data reliability and representativeness
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {dataQuality.map((quality, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-muted/50 border border-border">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {quality.value}
                  </div>
                  <div className="font-semibold mb-1">
                    {quality.metric}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {quality.description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-gradient">
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Representative Sample</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                1,001 participants across all regions of British Columbia with diverse demographics ensuring provincial representation.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Age range: 18-75+</li>
                <li>• Urban/Rural distribution</li>
                <li>• Education levels</li>
                <li>• Income brackets</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gradient">
            <CardHeader>
              <MapPin className="w-8 h-8 text-ai-cyan mb-2" />
              <CardTitle>Geographic Spread</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Province-wide coverage ensuring perspectives from Vancouver, Victoria, and rural communities are represented.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Vancouver: 76.6%</li>
                <li>• Victoria: 13.7%</li>
                <li>• Rural BC: 9.7%</li>
                <li>• Other regions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gradient">
            <CardHeader>
              <Clock className="w-8 h-8 text-ai-green mb-2" />
              <CardTitle>Data Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Advanced sentiment analysis and statistical processing provide deep insights into participant responses.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Automated sentiment scoring</li>
                <li>• Statistical validation</li>
                <li>• Pattern recognition</li>
                <li>• Quality assurance</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Access Data */}
        <Card className="border-gradient bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Access the Full Dataset
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              The complete dataset, methodology documentation, and analysis scripts are available 
              through our open-source repository for researchers and developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gradient-primary hover:glow-primary transition-smooth"
                onClick={() => window.open('https://github.com/AiAlchemist0/vanai-hackathon-003', '_blank')}
              >
                <Download className="mr-2 w-5 h-5" />
                Download Dataset
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gradient hover:bg-primary/10 transition-smooth"
                onClick={() => window.open('https://github.com/AiAlchemist0/vanai-hackathon-003/blob/main/BC_AI_Survey_Updated.docx', '_blank')}
              >
                <ExternalLink className="mr-2 w-5 h-5" />
                View Documentation
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Licensed under CC0-1.0 for open research and development
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Methodology;