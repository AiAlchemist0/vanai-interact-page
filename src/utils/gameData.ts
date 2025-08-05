import type { District, InsightData } from '@/types/game';

export const gameDistricts: District[] = [
  {
    id: 'tech-hub',
    name: 'Tech Hub',
    description: 'Vancouver\'s AI innovation center',
    color: '#3B82F6',
    position: { x: 150, y: 150 },
    unlocked: true,
    buildings: [
      {
        id: 'ai-research-center',
        name: 'AI Research Center',
        type: 'data-center',
        position: { x: 180, y: 120 },
        visited: false,
        insight: {
          title: 'AI Experience Levels in BC',
          description: 'Most British Columbians are just beginning their AI journey',
          data: { 
            beginner: 45,
            intermediate: 35,
            advanced: 20
          },
          quote: 'AI feels like magic until you understand it - then it becomes a tool.',
          chartType: 'pie'
        }
      },
      {
        id: 'startup-incubator',
        name: 'AI Startup Incubator',
        type: 'npc',
        position: { x: 120, y: 180 },
        visited: false,
        insight: {
          title: 'AI Startup Sentiment',
          description: 'BC entrepreneurs are optimistic about AI opportunities',
          data: {
            optimistic: 78,
            concerned: 15,
            neutral: 7
          },
          quote: 'AI is not replacing humans, it\'s amplifying human potential.',
          chartType: 'bar'
        }
      }
    ]
  },
  {
    id: 'business-quarter',
    name: 'Business District',
    description: 'Corporate AI adoption hub',
    color: '#F59E0B',
    position: { x: 450, y: 150 },
    unlocked: false,
    buildings: [
      {
        id: 'corporate-tower',
        name: 'Corporate AI Center',
        type: 'data-center',
        position: { x: 480, y: 120 },
        visited: false,
        insight: {
          title: 'Job Impact Concerns',
          description: 'Mixed feelings about AI\'s effect on employment',
          data: {
            'will-create-jobs': 35,
            'will-eliminate-jobs': 45,
            'no-significant-change': 20
          },
          quote: 'The future belongs to those who can work alongside AI.',
          chartType: 'bar'
        }
      },
      {
        id: 'training-center',
        name: 'AI Skills Training',
        type: 'mini-game',
        position: { x: 420, y: 180 },
        visited: false,
        insight: {
          title: 'Reskilling Priorities',
          description: 'What skills workers want to develop',
          data: {
            'prompt-engineering': 55,
            'data-analysis': 42,
            'ai-ethics': 38,
            'automation-tools': 65
          },
          quote: 'Learning to prompt AI effectively is like learning a new language.',
          chartType: 'bar'
        }
      }
    ]
  },
  {
    id: 'creative-district',
    name: 'Creative Arts District',
    description: 'AI creativity and artistic expression',
    color: '#8B5CF6',
    position: { x: 150, y: 350 },
    unlocked: false,
    buildings: [
      {
        id: 'digital-studio',
        name: 'AI Art Studio',
        type: 'insight',
        position: { x: 180, y: 320 },
        visited: false,
        insight: {
          title: 'Creative AI Adoption',
          description: 'Artists embrace AI as a creative partner',
          data: {
            'enhances-creativity': 62,
            'threatens-originality': 28,
            'neutral': 10
          },
          quote: 'AI doesn\'t replace the artist\'s vision, it expands the canvas.',
          chartType: 'pie'
        }
      },
      {
        id: 'media-lab',
        name: 'AI Media Lab',
        type: 'data-center',
        position: { x: 120, y: 380 },
        visited: false,
        insight: {
          title: 'Content Creation Trends',
          description: 'How BC creators use AI tools',
          data: {
            'writing-assistance': 67,
            'image-generation': 58,
            'video-editing': 34,
            'music-composition': 23
          },
          quote: 'AI helps me iterate faster, but the creative spark is still mine.',
          chartType: 'bar'
        }
      }
    ]
  },
  {
    id: 'government-center',
    name: 'Government Center',
    description: 'AI policy and regulation hub',
    color: '#10B981',
    position: { x: 450, y: 350 },
    unlocked: false,
    buildings: [
      {
        id: 'policy-building',
        name: 'AI Policy Institute',
        type: 'data-center',
        position: { x: 480, y: 320 },
        visited: false,
        insight: {
          title: 'Regulation Preferences',
          description: 'BC residents want balanced AI governance',
          data: {
            'strong-regulation': 42,
            'moderate-oversight': 48,
            'minimal-interference': 10
          },
          quote: 'We need guardrails, not roadblocks, for AI development.',
          chartType: 'pie'
        }
      },
      {
        id: 'ethics-committee',
        name: 'AI Ethics Committee',
        type: 'npc',
        position: { x: 420, y: 380 },
        visited: false,
        insight: {
          title: 'Ethical Priorities',
          description: 'Top AI ethics concerns for British Columbians',
          data: {
            'privacy-protection': 78,
            'bias-prevention': 65,
            'job-displacement': 52,
            'misinformation': 71
          },
          quote: 'Ethics isn\'t a constraint on AI - it\'s the foundation for trust.',
          chartType: 'bar'
        }
      }
    ]
  },
  {
    id: 'medical-campus',
    name: 'Medical Campus',
    description: 'Healthcare AI innovation',
    color: '#06B6D4',
    position: { x: 300, y: 100 },
    unlocked: false,
    buildings: [
      {
        id: 'ai-hospital',
        name: 'AI-Enhanced Hospital',
        type: 'data-center',
        position: { x: 330, y: 70 },
        visited: false,
        insight: {
          title: 'Healthcare AI Acceptance',
          description: 'Trust in AI for medical applications',
          data: {
            'diagnostic-assistance': 72,
            'treatment-planning': 45,
            'surgery-robotics': 38,
            'drug-discovery': 68
          },
          quote: 'AI can see patterns in data that human doctors might miss.',
          chartType: 'bar'
        }
      },
      {
        id: 'research-lab',
        name: 'Medical AI Research',
        type: 'insight',
        position: { x: 270, y: 130 },
        visited: false,
        insight: {
          title: 'Patient Data Concerns',
          description: 'Privacy vs. medical advancement trade-offs',
          data: {
            'privacy-first': 55,
            'research-benefits': 32,
            'case-by-case': 13
          },
          quote: 'My health data could save lives, but who controls how it\'s used?',
          chartType: 'pie'
        }
      }
    ]
  },
  {
    id: 'education-zone',
    name: 'Education Zone',
    description: 'AI learning and future skills',
    color: '#EF4444',
    position: { x: 300, y: 400 },
    unlocked: false,
    buildings: [
      {
        id: 'ai-university',
        name: 'AI University',
        type: 'data-center',
        position: { x: 330, y: 370 },
        visited: false,
        insight: {
          title: 'Educational AI Integration',
          description: 'How AI is transforming BC education',
          data: {
            'personalized-learning': 58,
            'automated-grading': 34,
            'research-assistance': 67,
            'language-learning': 71
          },
          quote: 'AI tutors never get impatient, but they can\'t replace human inspiration.',
          chartType: 'bar'
        }
      },
      {
        id: 'future-skills-center',
        name: 'Future Skills Center',
        type: 'mini-game',
        position: { x: 270, y: 430 },
        visited: false,
        insight: {
          title: 'Future Workforce Preparation',
          description: 'Skills BC students need for an AI-powered future',
          data: {
            'critical-thinking': 89,
            'ai-literacy': 76,
            'emotional-intelligence': 82,
            'adaptability': 94
          },
          quote: 'The most important skill is learning how to learn alongside AI.',
          chartType: 'bar'
        }
      }
    ]
  }
];

export const getCharacterInsights = (characterId: string) => {
  const characterPerspectives = {
    'cyberpunk': {
      focus: 'Technical implementation and developer experience',
      tone: 'Optimistic about AI capabilities, concerned about accessibility'
    },
    'noob': {
      focus: 'Practical applications and ease of use',
      tone: 'Curious but cautious, values simple explanations'
    },
    'scientist': {
      focus: 'Data quality, research methodology, and ethics',
      tone: 'Evidence-based, concerned about bias and validation'
    },
    'policy': {
      focus: 'Governance, regulation, and societal impact',
      tone: 'Balanced, focused on public good and risk management'
    }
  };

  return characterPerspectives[characterId as keyof typeof characterPerspectives] || {
    focus: 'General AI exploration',
    tone: 'Balanced perspective on AI development'
  };
};