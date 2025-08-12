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
      highwayRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.02;
    }
  });

  // Fret positions (X coordinates)
  const fretPositions = [-2, -1, 0, 1, 2];
  
  // Fret colors matching the game
  const fretColors = ['#00ff00', '#ff0000', '#ffff00', '#0000ff', '#ff8800'];

  return (
    <group ref={highwayRef}>
      {/* Highway Rails */}
      {fretPositions.map((x, index) => (
        <group key={index}>
          {/* Fret Rail */}
          <mesh position={[x, -1, -20]}>
            <boxGeometry args={[0.1, 2, 40]} />
            <meshStandardMaterial 
              color={fretColors[index]}
              emissive={fretColors[index]}
              emissiveIntensity={pressedFrets.has(index) ? 0.5 : 0.1}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Fret Base (where notes hit) */}
          <mesh position={[x, -2, 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2]} />
            <meshStandardMaterial 
              color={fretColors[index]}
              emissive={fretColors[index]}
              emissiveIntensity={pressedFrets.has(index) ? 1 : 0.3}
            />
          </mesh>

          {/* Hit zone glow when pressed */}
          {pressedFrets.has(index) && (
            <mesh position={[x, -2, 2]}>
              <cylinderGeometry args={[0.8, 0.8, 0.1]} />
              <meshStandardMaterial 
                color={fretColors[index]}
                emissive={fretColors[index]}
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Highway Floor */}
      <mesh position={[0, -3, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 40]} />
        <meshStandardMaterial 
          color="#000011"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Notes */}
      {activeNotes.map((note, noteIndex) => 
        note.frets.map((fret, fretIndex) => {
          // Calculate note position: notes start far away (positive Z) and move toward camera (negative Z)
          const timeToHit = (note.time - currentTime) / 1000; // Time in seconds
          const noteZ = timeToHit * 8 - 2; // Notes travel at 8 units per second, hit zone at Z=-2
          
          // Debug logging for first few notes
          if (noteIndex < 3 && fretIndex === 0) {
            console.log(`Note ${noteIndex}: time=${note.time}, currentTime=${currentTime}, timeToHit=${timeToHit.toFixed(2)}s, noteZ=${noteZ.toFixed(2)}`);
          }
          
          // Only render notes that are in visible range (camera is at Z=8, looking toward negative Z)
          if (noteZ < -5 || noteZ > 25) return null;
          
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
    </group>
  );
};

export default NoteHighway;