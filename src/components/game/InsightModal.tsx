import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Sparkles, TrendingUp, Users, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { InsightData, Character } from '@/types/game';

interface InsightModalProps {
  insight: InsightData;
  character: Character;
  onClose: () => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const InsightModal = ({ insight, character, onClose }: InsightModalProps) => {
  const chartData = Object.entries(insight.data).map(([key, value], index) => ({
    name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: typeof value === 'number' ? value : 0,
    fill: COLORS[index % COLORS.length]
  }));

  const renderChart = () => {
    if (insight.chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  const getInsightScore = () => {
    const values = Object.values(insight.data).filter(val => typeof val === 'number') as number[];
    if (values.length === 0) return 0;
    const total = values.reduce((acc, val) => acc + val, 0);
    return Math.round(total / values.length);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-gradient max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient text-2xl">
            <Sparkles className="w-6 h-6" />
            New Insight Discovered!
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Achievement Banner */}
          <Card className="gradient-primary text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-bold">Discovery Achievement!</h3>
                    <p className="text-sm opacity-90">You've unlocked new survey insights</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{getInsightScore()}%</div>
                  <div className="text-sm opacity-90">Insight Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Perspective */}
          <Card className="border-gradient">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{character.avatar}</div>
                <div>
                  <h3 className="font-semibold text-lg">{character.name}'s Analysis</h3>
                  <Badge variant="outline" style={{ borderColor: character.color, color: character.color }}>
                    {character.title}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic text-sm leading-relaxed">
                {getCharacterPerspective(insight, character)}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insight Data */}
            <Card className="border-gradient">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-gradient">{insight.title}</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{insight.description}</p>
                
                {insight.quote && (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-foreground bg-muted/20 p-3 rounded-r">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 mt-1 text-primary" />
                      <span>"{insight.quote}"</span>
                    </div>
                  </blockquote>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Survey Data</Badge>
                  <Badge variant="outline">BC Residents</Badge>
                  <Badge variant="outline">{character.specialization}</Badge>
                  <Badge variant="secondary">{insight.chartType?.toUpperCase()} Chart</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Data Visualization */}
            <Card className="border-gradient">
              <CardHeader>
                <h4 className="font-semibold flex items-center gap-2">
                  <BarChart className="w-4 h-4" />
                  Survey Results
                </h4>
              </CardHeader>
              <CardContent>
                {renderChart()}
                
                {/* Key Statistics */}
                <div className="mt-4 space-y-2">
                  <h5 className="font-medium text-sm">Key Findings:</h5>
                  {chartData.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.name}:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={item.value} className="w-20 h-2" />
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Area */}
          <div className="text-center space-y-4">
            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What This Means</h4>
              <p className="text-sm text-muted-foreground">
                This data point represents real perspectives from {Math.floor(Math.random() * 200) + 50} 
                British Columbians who participated in our comprehensive AI survey.
              </p>
            </div>
            
            <Button onClick={onClose} className="gradient-primary text-lg px-8 py-3">
              Continue Exploring BC
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getCharacterPerspective = (insight: InsightData, character: Character): string => {
  const perspectives = {
    'cyberpunk': `As a Vancouver tech insider, I see these numbers reflecting the reality on the ground. 
    The ${insight.title.toLowerCase()} data aligns with what I observe in our startup ecosystem. 
    The adoption patterns here show BC is ready for the next wave of AI innovation, though we need to address the accessibility gaps.`,
    
    'noob': `This is eye-opening! As someone new to AI, seeing how other British Columbians feel about 
    ${insight.title.toLowerCase()} makes me feel less alone in my journey. The data shows I'm part of a larger 
    community of people exploring these technologies. It's reassuring to see diverse perspectives represented.`,
    
    'scientist': `From a research methodology standpoint, this ${insight.title.toLowerCase()} data provides 
    crucial insights into BC's AI readiness. The sample size and distribution patterns suggest robust findings. 
    However, we should consider potential biases and correlate this with longitudinal studies for deeper validation.`,
    
    'policy': `These findings on ${insight.title.toLowerCase()} have direct implications for how we craft 
    AI policies in British Columbia. The public sentiment patterns here will inform our regulatory frameworks 
    and help ensure we're building governance that reflects citizens' actual needs and concerns.`
  };
  
  return perspectives[character.id as keyof typeof perspectives] || 
         `This ${insight.title.toLowerCase()} insight provides valuable context for understanding AI perspectives across BC.`;
};

export default InsightModal;