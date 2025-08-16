// Game Constants - Standardized across all components
export const FRET_POSITIONS = [-5, -2.5, 0, 2.5, 5]; // 3D visual positions
export const FRET_COLORS = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#f97316']; // Green, Red, Yellow, Blue, Orange

// Hit Detection Constants
export const HIT_WINDOW_SETTINGS = {
  perfect: 50,    // Tightened for better gameplay
  good: 100,      // Reduced from 150
  okay: 200       // Reduced from 250
};

// Timing Constants
export const NOTE_SPEED_MULTIPLIER = 9; // Consistent speed calculation
export const NOTE_VIEW_DISTANCE = 30;   // Distance notes appear ahead
export const HIT_LINE_Z = 5;            // Z position of hit line
export const STRUM_COOLDOWN = 50;       // Reduced from 100ms for better responsiveness

// Visual Constants
export const HIT_EFFECT_DURATION = 600;
export const FLOATING_TEXT_DURATION = 1500;
export const NOTE_FLASH_DURATION = 150;

// Audio Constants
export const AUDIO_LATENCY_COMPENSATION = 0; // ms - can be adjusted per system
export const VISUAL_LATENCY_COMPENSATION = 0; // ms - can be adjusted per system