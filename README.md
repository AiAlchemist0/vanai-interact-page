# BC AI Survey Insights & Music Platform

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 🎵 Innovative way to inspire and connect Vancouver AI community
### DATA into Insights > Insights into Music > Music leads to Dancing > Dancing leads to loving AI Community

**Created by Dean Shev (aka Chazz)**  
**Live Demo**: [https://bcai.dev/](https://bcai.dev/)

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Local Development Setup](#-local-development-setup)
- [Technical Architecture](#-technical-architecture)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

This innovative platform explores the intersection of artificial intelligence, consciousness, and interactive media through a unique combination of audio content curation and gamified music experiences.

### 🎨 What Makes This Special

• **Educational AI Resource**: Curated podcast content from leading AI researchers, philosophers, and technologists
• **Interactive Learning**: Guitar Hero-style rhythm game that makes AI concepts engaging and memorable
• **Data Visualization**: Complex AI survey results presented in accessible, interactive formats
• **Consciousness Exploration**: Testing ground for AI consciousness manifestation in digital experiences
• **Community Building**: Connecting Vancouver's AI community through music and shared learning

### 🎧 Content Highlights

• **Expert Interviews**: Dr. Patrick Parra Pennefather and other AI thought leaders
• **Event Coverage**: BC AI Hackathon presentations and discussions
• **Diverse Topics**: AI ethics, deepfake technology, space exploration, machine consciousness
• **Interactive Surveys**: Public sentiment analysis on AI advancement and societal impact

### 🎮 Gaming Experience

• **3D Visualizations**: Immersive note highways and performance tracking
• **Mobile Optimized**: Touch-friendly controls with haptic feedback
• **Real-time Scoring**: Combo systems and performance analytics
• **Adaptive Difficulty**: Multiple skill levels for all players

---

## ✨ Key Features

- [x] **Advanced Audio Player**
  - [x] Multi-stream audio management
  - [x] Synchronized playbook with real-time analysis
  - [x] Mobile-responsive controls with marquee animations
  - [x] Dynamic audio file loading

- [x] **3D Rhythm Game Engine**
  - [x] Guitar Hero-style gameplay mechanics
  - [x] Three.js 3D graphics rendering
  - [x] Physics-based note detection
  - [x] Mobile touch input calibration

- [x] **Interactive Data Visualization**
  - [x] AI survey results dashboard
  - [x] Real-time chart updates
  - [x] Methodology explanations
  - [x] Key insights presentation

- [x] **Cross-Platform Compatibility**
  - [x] Desktop and mobile optimization
  - [x] Responsive design system
  - [x] Touch and keyboard input support
  - [x] 60fps smooth animations

---

## 🛠 Technology Stack

### **Frontend Framework**
• **React 18** - Modern component-based architecture
• **TypeScript** - Type-safe development experience
• **Vite** - Lightning-fast development and optimized builds

### **Styling & UI**
• **Tailwind CSS** - Utility-first CSS framework
• **Radix UI** - Accessible component primitives
• **Custom Design System** - Semantic tokens and consistent theming

### **3D Graphics & Game Engine**
• **Three.js** - 3D graphics rendering
• **React Three Fiber** - Declarative 3D scene management
• **React Three Cannon** - Physics simulations
• **React Three Drei** - Useful helpers and abstractions

### **Data & State Management**
• **React Query** - Server state management
• **Custom Hooks** - Audio player, game mechanics, mobile detection
• **Context Providers** - Global state for audio and game systems

### **Audio & Media**
• **Web Audio API** - Advanced audio processing
• **Custom AudioContext** - Multi-stream management
• **Real-time Analysis** - Audio visualization and synchronization

### **Data Visualization**
• **Recharts** - Interactive charts and graphs
• **Custom Components** - Survey data presentation
• **Responsive Charts** - Mobile-optimized visualizations

---

## 🚀 Local Development Setup

### **Prerequisites**

Ensure you have the following installed on your system:
- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher) or **yarn** (version 1.22 or higher)
- **Git** for version control

### **Installation Steps**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/bc-ai-survey-platform.git
   cd bc-ai-survey-platform
   ```

2. **Install Dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

3. **Start Development Server**
   ```bash
   # Using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:8080`
   - The development server will automatically reload when you make changes

### **Build for Production**

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### **Environment Setup**

No environment variables are required for basic functionality. The app works out of the box with the included audio files and demo data.

### **Troubleshooting**

**Port Already in Use:**
- Change the port in `vite.config.ts` or use `npm run dev -- --port 3000`

**Audio Files Not Loading:**
- Ensure audio files are in the `public/` directory
- Check browser console for CORS or file path issues

**3D Graphics Performance Issues:**
- Try using a different browser (Chrome recommended)
- Ensure hardware acceleration is enabled
- Check if WebGL is supported: visit `chrome://gpu/`

---

## 🏗 Technical Architecture

### **Frontend Architecture**
• **Component-Based Design**: Modular, reusable React components
• **Custom Hook System**: Specialized hooks for audio, game mechanics, and mobile detection
• **Context Providers**: Centralized state management for audio and game systems
• **Type Safety**: Full TypeScript implementation with strict type checking

### **Audio Management System**
• **Web Audio API Integration**: Low-level audio processing and analysis
• **Multi-Stream Support**: Simultaneous audio file management
• **Real-Time Synchronization**: Audio-visual sync with game mechanics
• **Mobile Optimization**: Touch-friendly controls and adaptive layouts

### **3D Game Engine**
• **React Three Fiber**: Declarative 3D scene composition
• **Physics Simulation**: Realistic note movement and collision detection
• **Performance Optimization**: 60fps animations with efficient rendering
• **Input Calibration**: Touch and keyboard input with timing adjustment

### **Data Visualization Layer**
• **Interactive Charts**: Real-time data updates with Recharts
• **Responsive Design**: Mobile-first approach with adaptive layouts
• **Custom Components**: Specialized survey data presentation
• **Performance Metrics**: Optimized rendering for large datasets

### **State Management Patterns**
• **Custom Hooks**: Domain-specific state logic isolation
• **Context API**: Global state for cross-component communication
• **Local State**: Component-specific state management
• **Derived State**: Computed values for performance optimization

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── game/            # Game-specific components
│   ├── AudioPlayer.tsx  # Main audio player
│   └── DataVisualization.tsx
├── hooks/               # Custom React hooks
│   ├── useAudioPlayer.ts
│   ├── useGameCalibration.ts
│   └── useMobileGameInput.ts
├── contexts/            # React context providers
├── pages/               # Page components
├── assets/              # Static assets (images, covers)
├── lib/                 # Utility functions
└── integrations/        # External service integrations
```

---

## 🤝 Contributing

We welcome contributions to improve the BC AI Survey Platform! Here's how you can get involved:

### **Ways to Contribute**
• 🐛 **Bug Reports**: Submit detailed issue reports
• ✨ **Feature Requests**: Suggest new functionality
• 🔧 **Code Contributions**: Submit pull requests
• 📚 **Documentation**: Improve README and code comments
• 🎵 **Content**: Suggest new AI-related audio content

### **Development Process**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request with detailed description

### **Code Standards**
• Follow existing TypeScript and React patterns
• Use semantic commit messages
• Maintain responsive design principles
• Ensure cross-browser compatibility
• Add comments for complex game mechanics

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

• **Vancouver AI Community** - For inspiration and feedback
• **BC AI Hackathon** - For providing platform and community
• **Audio Contributors** - Dr. Patrick Parra Pennefather and other featured speakers
• **Open Source Libraries** - React, Three.js, and the entire ecosystem

---

**Built with ❤️ by Dean Shev (aka Chazz) for the Vancouver AI Community**