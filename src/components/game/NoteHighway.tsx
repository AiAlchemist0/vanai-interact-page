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
  hitFlashTimes: Set<number>;
}

const NoteHighway = ({ activeNotes, currentTime, pressedFrets, combo = 0, noteSpeed = 1.0, hitWindow, hitFlashTimes }: NoteHighwayProps) => {
  const highwayRef = useRef<any>();

  useFrame(() => {
    // Disable wobble for clarity
    if (highwayRef.current) {
      highwayRef.current.rotation.z = 0;
    }
  });

  // Fret positions (X coordinates) - Guitar Hero standard spacing
  const fretPositions = [-1.5, -0.75, 0, 0.75, 1.5];
  
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
            <mesh position={[x + 0.9, -2, -10]}>
              <boxGeometry args={[0.05, 0.1, 40]} />
              <meshBasicMaterial 
                color="#4a5568"
                transparent
                opacity={0.6}
              />
            </mesh>
            
            {/* Lane depth markers for better perception */}
            {[-15, -10, -5, 0].map((z, idx) => (
              <mesh key={idx} position={[x + 0.9, -2.1, z]}>
                <boxGeometry args={[0.1, 0.05, 0.2]} />
                <meshBasicMaterial 
                  color="#6b7280"
                  transparent
                  opacity={0.4}
                />
              </mesh>
            ))}

            {/* Enhanced hit zone cavity - much more visible */}
            {/* Socket base */}
            <mesh position={[x, -2.65, 5]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.6, 32]} />
              <meshBasicMaterial color="#111111" transparent opacity={0.8} />
            </mesh>

            {/* Glowing cavity core */}
            <mesh position={[x, -2.6, 5]}>
              <cylinderGeometry args={[1.1, 0.9, 0.3, 24]} />
              <meshStandardMaterial 
                color={fretColors[index]}
                emissive={fretColors[index]}
                emissiveIntensity={isPressed ? 1.6 : (comboGlow ? 0.8 : 0.5)}
                metalness={0.4}
                roughness={0.15}
                transparent
                opacity={0.95}
              />
            </mesh>

            {/* Hit zone rim - thick and bright */}
            <mesh position={[x, -2.4, 5]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.1, 1.45, 32]} />
              <meshBasicMaterial 
                color={fretColors[index]}
                transparent
                opacity={isPressed ? 0.95 : 0.7}
                side={2}
              />
            </mesh>

            {/* Hit zone glow when pressed */}
            {isPressed && (
              <mesh position={[x, -2.9, 5]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.6, 32]} />
                <meshBasicMaterial 
                  color={fretColors[index]}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            )}

            {/* Combo energy ring around fret */}
            {comboGlow && (
              <mesh position={[x, -2.85, 5]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.95, 1.25, 32]} />
                <meshBasicMaterial 
                  color={combo >= 30 ? "#ffff00" : "#ff8800"}
                  transparent
                  opacity={0.5 + Math.sin(Date.now() * 0.005) * 0.25}
                  side={2}
                />
              </mesh>
            )}

            {/* Lane highlight when pressed */}
            {isPressed && (
              <mesh position={[x, -2, -10]}>
                <boxGeometry args={[2.0, 0.05, 40]} />
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
        <boxGeometry args={[16, 0.12, 0.25]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Hit line glow */}
      <mesh position={[0, -2.2, 5]}>
        <boxGeometry args={[17, 0.22, 0.35]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Notes with improved positioning and depth cues */}
      {activeNotes.map((note, noteIndex) => 
        note.frets.map((fret, fretIndex) => {
          // Fixed note positioning - notes flow from far to near
          const timeToHit = (note.time - currentTime) / 1000;
          const adjustedSpeed = noteSpeed || 1.0;
          const noteZ = timeToHit * 8 * adjustedSpeed; // Positive Z starts far, moves to 0
          
          // Only render notes in visible range
          if (noteZ < -2 || noteZ > 20) return null;
          
          // Simplified scaling - minimal depth effect
          const depthScale = Math.max(0.8, Math.min(1.0, 1 - (noteZ / 50)));
          
          return (
            <Note3D
              key={`${note.time}-${fret}-${noteIndex}-${fretIndex}`}
              position={[fretPositions[fret], -1, noteZ]}
              fret={fret}
              isChord={note.type === 'chord'}
              noteTime={note.time}
              currentTime={currentTime}
              noteSpeed={adjustedSpeed}
              hitWindow={hitWindow}
              scale={depthScale}
              isHit={hitFlashTimes.has(note.time)}
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