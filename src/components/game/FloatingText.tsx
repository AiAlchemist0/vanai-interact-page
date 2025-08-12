import { useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { HitGrade } from './HitEffects';

interface FloatingTextItem {
  id: string;
  text: string;
  grade: HitGrade;
  position: [number, number, number];
  age: number;
  maxAge: number;
}

interface FloatingTextProps {
  texts: FloatingTextItem[];
  onTextComplete: (id: string) => void;
}

const FloatingText = ({ texts, onTextComplete }: FloatingTextProps) => {
  const getTextStyle = (text: FloatingTextItem) => {
    const progress = text.age / text.maxAge;
    const opacity = Math.max(0, 1 - progress);
    const scale = 1 + progress * 0.5;
    const yOffset = progress * 50;

    const colors = {
      perfect: '#ffd700',
      good: '#00ff00', 
      okay: '#ffaa00',
      miss: '#ff0000'
    };

    return {
      color: colors[text.grade],
      opacity,
      transform: `scale(${scale}) translateY(-${yOffset}px)`,
      fontWeight: 'bold',
      fontSize: text.grade === 'perfect' ? '18px' : '16px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
      transition: 'none'
    };
  };

  const getScoreText = (grade: HitGrade, points: number) => {
    switch (grade) {
      case 'perfect': return `+${points} PERFECT!`;
      case 'good': return `+${points} GOOD`;
      case 'okay': return `+${points} OKAY`;
      case 'miss': return 'MISS';
    }
  };

  // Update ages and remove completed texts
  useEffect(() => {
    const interval = setInterval(() => {
      texts.forEach(text => {
        text.age += 16; // ~60fps
        if (text.age >= text.maxAge) {
          onTextComplete(text.id);
        }
      });
    }, 16);

    return () => clearInterval(interval);
  }, [texts, onTextComplete]);

  return (
    <>
      {texts.map((text) => (
        <Html
          key={text.id}
          position={text.position}
          center
          distanceFactor={10}
          style={getTextStyle(text)}
        >
          <div className="whitespace-nowrap">
            {text.text}
          </div>
        </Html>
      ))}
    </>
  );
};

export default FloatingText;
export type { FloatingTextItem };