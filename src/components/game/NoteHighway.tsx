import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { NotePattern } from '@/pages/Game';
import Note3D from './Note3D';

interface NoteHighwayProps {
  activeNotes: NotePattern[];
  currentTime: number;
  pressedFrets: Set<number>;
}

const NoteHighway = ({ activeNotes, currentTime, pressedFrets }: NoteHighwayProps) => {
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
      {/* Lane Dividers - Subtle guidelines */}
      {fretPositions.map((x, index) => (
        <group key={`lane-${index}`}>
          {/* Subtle lane divider */}
          <mesh position={[x + 0.6, -2, -10]}>
            <boxGeometry args={[0.02, 0.1, 40]} />
            <meshBasicMaterial 
              color="#333366"
              transparent
              opacity={0.3}
            />
          </mesh>

          {/* Hit zone platform - rectangular to match notes */}
          <mesh position={[x, -2.8, 5]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.8, 0.8, 0.1]} />
            <meshBasicMaterial 
              color={fretColors[index]}
              transparent
              opacity={pressedFrets.has(index) ? 0.9 : 0.4}
            />
          </mesh>

          {/* Hit zone glow when pressed */}
          {pressedFrets.has(index) && (
            <mesh position={[x, -2.8, 5]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[1.2, 1.2, 0.05]} />
              <meshBasicMaterial 
                color={fretColors[index]}
                transparent
                opacity={0.8}
              />
            </mesh>
          )}

          {/* Lane highlight when pressed */}
          {pressedFrets.has(index) && (
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
      ))}

      {/* Hit line - clear visual indicator where to strum */}
      <mesh position={[0, -2.7, 5]}>
        <boxGeometry args={[7, 0.05, 0.1]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Notes */}
      {activeNotes.map((note, noteIndex) => 
        note.frets.map((fret, fretIndex) => {
          // Calculate note position: notes start far away and move toward hit zone
          const timeToHit = (note.time - currentTime) / 1000; // Time in seconds until hit
          const noteZ = -25 + (5 - timeToHit) * 8; // Notes start at Z=-25, hit zone at Z=5
          
          // Only render notes that are in visible range
          if (noteZ < -30 || noteZ > 10) return null;
          
          return (
            <Note3D
              key={`${note.time}-${fret}-${noteIndex}-${fretIndex}`}
              position={[fretPositions[fret], -1, noteZ]}
              fret={fret}
              isChord={note.type === 'chord'}
              noteTime={note.time}
              currentTime={currentTime}
            />
          );
        })
      )}
    </group>
  );
};

export default NoteHighway;