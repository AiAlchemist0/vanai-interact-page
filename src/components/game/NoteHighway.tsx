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

  // Fret positions (X coordinates) - spread them out more
  const fretPositions = [-3, -1.5, 0, 1.5, 3];
  
  // Fret colors matching the game
  const fretColors = ['#00ff00', '#ff0000', '#ffff00', '#0000ff', '#ff8800'];

  return (
    <group ref={highwayRef}>
      {/* Clean Hit Zones Only */}
      {fretPositions.map((x, index) => (
        <group key={index}>
          {/* Fret Base (where notes hit) - Clean and minimal */}
          <mesh position={[x, -2.5, 5]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2]} />
            <meshBasicMaterial 
              color={fretColors[index]}
              transparent
              opacity={pressedFrets.has(index) ? 1.0 : 0.6}
            />
          </mesh>

          {/* Hit zone glow when pressed */}
          {pressedFrets.has(index) && (
            <mesh position={[x, -2.5, 5]}>
              <cylinderGeometry args={[0.8, 0.8, 0.05]} />
              <meshBasicMaterial 
                color={fretColors[index]}
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Notes */}
      {activeNotes.map((note, noteIndex) => 
        note.frets.map((fret, fretIndex) => {
          // Calculate note position: notes start far away (negative Z) and move toward camera (positive Z)
          const timeToHit = (note.time - currentTime) / 1000; // Time in seconds until hit
          const noteZ = -30 + (5 - timeToHit) * 10; // Notes start at Z=-30, hit zone at Z=5
          
          // Debug logging for first few notes
          if (noteIndex < 2 && fretIndex === 0) {
            console.log(`Note ${noteIndex}: time=${note.time}, currentTime=${currentTime}, timeToHit=${timeToHit.toFixed(2)}s, noteZ=${noteZ.toFixed(2)}`);
          }
          
          // Only render notes that are in visible range
          if (noteZ < -35 || noteZ > 15) return null;
          
          return (
            <Note3D
              key={`${note.time}-${fret}-${noteIndex}-${fretIndex}`}
              position={[fretPositions[fret], 0, noteZ]}
              fret={fret}
              isChord={note.type === 'chord'}
              noteTime={note.time}
              currentTime={currentTime}
            />
          );
        })
      )}

      {/* Test note to verify visibility */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

export default NoteHighway;