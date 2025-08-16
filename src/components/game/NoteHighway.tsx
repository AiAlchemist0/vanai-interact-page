import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { NotePattern } from '@/pages/Game';
import Note3D from './Note3D';
import ComboEffects from './ComboEffects';
import { FRET_POSITIONS, FRET_COLORS, NOTE_SPEED_MULTIPLIER, HIT_LINE_Z } from '@/game/constants';

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
  isStarPowerActive: boolean;
}

const NoteHighway = ({ activeNotes, currentTime, pressedFrets, combo = 0, noteSpeed = 1.0, hitWindow, hitFlashTimes, isStarPowerActive }: NoteHighwayProps) => {
  const highwayRef = useRef<any>();

  useFrame(() => {
    // Disable wobble for clarity
    if (highwayRef.current) {
      highwayRef.current.rotation.z = 0;
    }
  });

  // Use standardized constants
  const fretPositions = FRET_POSITIONS;
  const fretColors = FRET_COLORS;

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

            {/* Enhanced hit zone cavity - positioned at standardized HIT_LINE_Z */}
            {/* Socket base */}
            <mesh position={[x, -2.65, HIT_LINE_Z]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.6, 32]} />
              <meshBasicMaterial color="#111111" transparent opacity={0.8} />
            </mesh>

            {/* Glowing cavity core */}
            <mesh position={[x, -2.6, HIT_LINE_Z]}>
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
            <mesh position={[x, -2.4, HIT_LINE_Z]} rotation={[Math.PI / 2, 0, 0]}>
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
              <mesh position={[x, -2.9, HIT_LINE_Z]} rotation={[Math.PI / 2, 0, 0]}>
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
              <mesh position={[x, -2.85, HIT_LINE_Z]} rotation={[Math.PI / 2, 0, 0]}>
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


      {/* Notes with improved positioning and depth cues */}
      {activeNotes.map((note, noteIndex) => 
        note.frets.map((fret, fretIndex) => {
          // Standardized note positioning calculation
          const timeToHit = (note.time - currentTime) / 1000;
          const adjustedSpeed = noteSpeed || 1.0;
          const noteZ = -30 + (HIT_LINE_Z - timeToHit) * (NOTE_SPEED_MULTIPLIER * adjustedSpeed);
          
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
              isHit={hitFlashTimes.has(note.time)}
            />
          );
        })
      )}

      {/* Combo Effects at the standardized hit line */}
      {combo >= 10 && (
        <ComboEffects 
          combo={combo}
          position={[0, -1.5, HIT_LINE_Z]}
        />
      )}
    </group>
  );
};

export default NoteHighway;