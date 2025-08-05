import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  ExternalLink, 
  Heart,
  Code,
  Database
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Project Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">
              BC AI Survey Project
            </h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive insights from 1,001 British Columbians about artificial intelligence's 
              impact on society, economy, and future.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Open Source</Badge>
              <Badge variant="secondary">CC0-1.0 License</Badge>
              <Badge variant="secondary">Public Dataset</Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore Data</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  className="text-muted-foreground hover:text-primary transition-smooth"
                  onClick={() => document.getElementById('insights')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Key Insights
                </button>
              </li>
              <li>
                <button 
                  className="text-muted-foreground hover:text-primary transition-smooth"
                  onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Methodology
                </button>
              </li>
              <li>
                <a 
                  href="https://github.com/AiAlchemist0/vanai-hackathon-003/blob/main/Hackathon%20round%203%20with%20demos%5B48%5D.csv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Raw Dataset
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/AiAlchemist0/vanai-hackathon-003/blob/main/BC_AI_Survey_Updated.docx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Repository Access */}
          <div>
            <h4 className="font-semibold mb-4">Access & Contribute</h4>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.open('https://github.com/AiAlchemist0/vanai-hackathon-003', '_blank')}
              >
                <Github className="mr-2 w-4 h-4" />
                GitHub Repository
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.open('https://github.com/AiAlchemist0/vanai-hackathon-003/blob/main/explore-data-starter.py', '_blank')}
              >
                <Code className="mr-2 w-4 h-4" />
                Analysis Scripts
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.open('https://github.com/AiAlchemist0/vanai-hackathon-003/blob/main/Hackathon%20round%203%20with%20demos%5B48%5D.csv', '_blank')}
              >
                <Database className="mr-2 w-4 h-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for Vancouver AI Hackathon Round 3</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                AiAlchemist Outlook
              </Badge>
              <a 
                href="https://github.com/AiAlchemist0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Survey data represents opinions and perspectives of 1,001 British Columbians. 
            Use responsibly and respect participant privacy.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;