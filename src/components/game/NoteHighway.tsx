import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { NotePattern } from '@/pages/Game';
import Note3D from './Note3D';
import ComboEffects from './ComboEffects';

interface NoteHighwayProps {
  activeNotes: NotePattern[];
  currentTime: number;
  pressedFrets: Set<number>;
  combo?: number;
  noteSpeed?: number;
  hitWindow?: {
    perfect: number;
    good: number;
    okay: number;
  };
}

const NoteHighway = ({ activeNotes, currentTime, pressedFrets, combo = 0, noteSpeed = 1.0, hitWindow }: NoteHighwayProps) => {
  const highwayRef = useRef<any>();

  useFrame(() => {
    // Add subtle highway animation
    if (highwayRef.current) {
      highwayRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.01;
    }
  });

  // Fret positions (X coordinates) - Guitar Hero standard spacing
  const fretPositions = [-2.4, -1.2, 0, 1.2, 2.4];
  
  // Guitar Hero accurate fret colors
  const fretColors = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#f97316']; // Green, Red, Yellow, Blue, Orange

  return (
    <group ref={highwayRef}>
      {/* Enhanced Lane System */}
      {fretPositions.map((x, index) => {
        const isPressed = pressedFrets.has(index);
        const comboGlow = combo >= 10;
        
        return (
          <group key={`lane-${index}`}>
            {/* Clearer lane divider with depth */}
            <mesh position={[x + 0.6, -2, -10]}>
              <boxGeometry args={[0.04, 0.1, 40]} />
              <meshBasicMaterial 
                color="#4a5568"
                transparent
                opacity={0.6}
              />
            </mesh>
            
            {/* Lane depth markers for better perception */}
            {[-15, -10, -5, 0].map((z, idx) => (
              <mesh key={idx} position={[x + 0.6, -2.1, z]}>
                <boxGeometry args={[0.1, 0.05, 0.2]} />
                <meshBasicMaterial 
                  color="#6b7280"
                  transparent
                  opacity={0.4}
                />
              </mesh>
            ))}

            {/* Enhanced hit zone cavity - much more visible */}
            <mesh position={[x, -2.5, 5]}>
              <cylinderGeometry args={[0.6, 0.4, 0.3, 16]} />
              <meshStandardMaterial 
                color={fretColors[index]}
                emissive={fretColors[index]}
                emissiveIntensity={isPressed ? 1.2 : (comboGlow ? 0.5 : 0.3)}
                metalness={0.4}
                roughness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Hit zone rim - makes the cavity more obvious */}
            <mesh position={[x, -2.3, 5]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.8, 16]} />
              <meshBasicMaterial 
                color={fretColors[index]}
                transparent
                opacity={isPressed ? 0.8 : 0.5}
                side={2}
              />
            </mesh>

            {/* Hit zone glow when pressed */}
            {isPressed && (
              <mesh position={[x, -2.8, 5]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[1.2, 1.2, 0.05]} />
                <meshBasicMaterial 
                  color={fretColors[index]}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {/* Combo energy ring around fret */}
            {comboGlow && (
              <mesh position={[x, -2.8, 5]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.6, 0.8, 16]} />
                <meshBasicMaterial 
                  color={combo >= 30 ? "#ffff00" : "#ff8800"}
                  transparent
                  opacity={0.4 + Math.sin(Date.now() * 0.005) * 0.2}
                  side={2}
                />
              </mesh>
            )}

            {/* Lane highlight when pressed */}
            {isPressed && (
              <mesh position={[x, -2, -10]}>
                <boxGeometry args={[1.0, 0.05, 40]} />
                <meshBasicMaterial 
                  color={fretColors[index]}
                  transparent
                  opacity={0.3}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Hit line - much more prominent */}
      <mesh position={[0, -2.2, 5]}>
        <boxGeometry args={[8, 0.1, 0.2]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Hit line glow */}
      <mesh position={[0, -2.2, 5]}>
        <boxGeometry args={[8.5, 0.2, 0.3]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Notes with improved positioning and depth cues */}
      {activeNotes.map((note, noteIndex) => 
        note.frets.map((fret, fretIndex) => {
          // Enhanced note positioning with better depth perception
          const timeToHit = (note.time - currentTime) / 1000;
          const adjustedSpeed = noteSpeed || 1.0;
          const noteZ = -30 + (5 - timeToHit) * (9 * adjustedSpeed);
          
          // Only render notes in visible range with buffer
          if (noteZ < -35 || noteZ > 8) return null;
          
          // Add depth-based scaling for better perception
          const depthScale = Math.max(0.3, Math.min(1.2, (noteZ + 35) / 40));
          
          return (
            <Note3D
              key={`${note.time}-${fret}-${noteIndex}-${fretIndex}`}
              position={[fretPositions[fret], -1 - (noteZ < -10 ? (noteZ + 10) * 0.02 : 0), noteZ]}
              fret={fret}
              isChord={note.type === 'chord'}
              noteTime={note.time}
              currentTime={currentTime}
              noteSpeed={adjustedSpeed}
              hitWindow={hitWindow}
              scale={depthScale}
            />
          );
        })
      )}

      {/* Combo Effects at the hit line */}
      {combo >= 10 && (
        <ComboEffects 
          combo={combo}
          position={[0, -1.5, 5]}
        />
      )}
    </group>
  );
};

export default NoteHighway;