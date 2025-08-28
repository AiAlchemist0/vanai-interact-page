import { LyricLine } from "@/components/SynchronizedLyrics";

export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  coverArt: string;
  description?: string;
  lyrics?: LyricLine[];
}

// Supabase Storage URLs for audio files
const SUPABASE_URL = "https://oojckbecymzrrdtvcmqi.supabase.co";
const getAudioUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/audio-files/${encodeURIComponent(filename)}`;

export const SONGS: Song[] = [
  {
    id: "bc-ai-hackathon",
    title: "BC AI Hackathon by Rival Tech",
    artist: "Official Anthem",
    src: getAudioUrl("BC AI Hackathon by Rival Tech.mp3"),
    coverArt: "/lovable-uploads/b56415f7-ad61-43e6-8d05-54452f44a5be.png",
    description: `The official anthem of the BC AI Survey project, this dynamic track by Rival Technologies encapsulates the entire vision of our community-driven research initiative.`,
    lyrics: [
      { time: 0, text: "In Vancouver's buzzing scene, where coders dream big," },
      { time: 4, text: "The BC AI Hackathon calls, time to dig." },
      { time: 8, text: "Innovate, create, with passion and might," },
      { time: 12, text: "Together we build, into the night." },
      { time: 16, text: "From data to code, our spirits ignite," },
      { time: 20, text: "BC AI Hackathon, shining bright." },
    ] as LyricLine[]
  },
  {
    id: "lionel-ringenbach",
    title: "ChatGPT: Est-ce que ma facture va exploser?",
    artist: "Lionel Ringenbach",
    src: getAudioUrl("Lionel Ringenbach.mp3"),
    coverArt: "/lovable-uploads/7f8d84c3-eb81-4f66-87be-5b024084aca2.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "Who says AI says innovation," },
      { time: 6, text: "But will my bill cause frustration?" },
      { time: 10, text: "ChatGPT, mon ami, dis-moi la vérité," },
      { time: 14, text: "Est-ce que ma facture va exploser?" },
      { time: 18, text: "Je pose la question, dans ce monde digital," },
      { time: 22, text: "L'IA avance, mais à quel prix final?" },
    ] as LyricLine[]
  },
  {
    id: "kris-krug-circles",
    title: "Circles in the AI Glow",
    artist: "Kris Krüg & BC + AI Crew",
    src: getAudioUrl("Kris Krug Circles in the AI Glow.mp3"),
    coverArt: "/lovable-uploads/de844c7f-f953-4326-aba2-c4344918c873.png",
    lyrics: [
      { time: 0, text: "(Intro / Pre-Verse 1)" },
      { time: 2, text: "Humanity... yeah, that's the start..." },
      { time: 6, text: "Circles spinning in the AI glow," },
      { time: 10, text: "Data streams and dreams that flow." },
      { time: 14, text: "We build the future, line by line," },
      { time: 18, text: "In this digital age, we intertwine." },
    ] as LyricLine[]
  },
  {
    id: "pixel-wizard",
    title: "Mr. Pixel Wizard BC AI",
    artist: "Kevin Friel",
    src: getAudioUrl("Mr_Pixel_Wizard BC AI.mp3"),
    coverArt: "/lovable-uploads/2c251b22-3f09-4812-bc92-ad7c64062f4b.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 3, text: "In a digital realm where dreams take flight," },
      { time: 7, text: "Mr. Pixel Wizard casts his light." },
      { time: 11, text: "Coding spells and magic code," },
      { time: 15, text: "Guiding AI down the road." },
    ] as LyricLine[]
  },
  {
    id: "mac-mind-ai-consciousness",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "The Algorithm Whisperer",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: "/lovable-uploads/cc181a8b-6dad-4af6-8731-9a8cbd3ba5d0.png",
    lyrics: [
      { time: 0, text: "(Intro)" },
      { time: 2, text: "Welcome to the frontier of mind..." },
      { time: 6, text: "Where AI and consciousness bind." },
      { time: 10, text: "Exploring thoughts, both real and fake," },
      { time: 14, text: "The future's path we now partake." },
    ] as LyricLine[]
  },
  {
    id: "darren-ai-struck",
    title: "AI Struck by Lightning",
    artist: "Darren McConchie",
    src: getAudioUrl("Darren AI Struck.mp3"),
    coverArt: "/lovable-uploads/cf89c28f-23f5-4188-a5aa-e50f28daa5c2.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "I remember the day data changed my world..." },
      { time: 6, text: "AI struck by lightning, flags unfurled." },
      { time: 10, text: "From zeros and ones to thoughts anew," },
      { time: 14, text: "A digital spark that grew and grew." },
    ] as LyricLine[]
  },
  {
    id: "dr-patrick-cover",
    title: "Neural Networks & Coffee Dreams",
    artist: "Dr. Patrick Parra Pennefather",
    src: getAudioUrl("Dr. Patrick Parra Pennefather.mp3"),
    coverArt: "/lovable-uploads/4d050983-b56d-4606-a958-1c7e2c7253e8.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "In the lab where neurons fire..." },
      { time: 6, text: "Coffee fuels the neural wire." },
      { time: 10, text: "Patterns form and thoughts align," },
      { time: 14, text: "Dreams of AI, so divine." },
    ] as LyricLine[]
  },
  {
    id: "hr-macmillan-alien",
    title: "Alien Abduction at H.R. MacMillan",
    artist: "Space Centre Stories",
    src: getAudioUrl("H.R MacMillan Space Centre _ Alian Abduction.mp3"),
    coverArt: "/lovable-uploads/8a59c6e4-39f4-41e2-bb0d-544e22e3030a.png",
    lyrics: [
      { time: 0, text: "(Intro)" },
      { time: 2, text: "The stars aligned that fateful night..." },
      { time: 6, text: "Alien abduction, a strange sight." },
      { time: 10, text: "H.R. MacMillan, tales untold," },
      { time: 14, text: "Mysteries in the cold." },
    ] as LyricLine[]
  },
  {
    id: "lalala-ai-dilemma",
    title: "La La La AI Dilemma",
    artist: "Michelle Diamond",
    src: getAudioUrl("La La La AI Dilemma_Michelle_Diamond.mp3"),
    coverArt: "/lovable-uploads/7e23b796-605f-4562-927b-06daa9147648.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "La la la, the algorithms sing..." },
      { time: 6, text: "Dilemmas in the AI ring." },
      { time: 10, text: "Ethics, data, and the code," },
      { time: 14, text: "Walking down this winding road." },
    ] as LyricLine[]
  },
  {
    id: "dean-shev-human",
    title: "Still Human",
    artist: "Dean Shev",
    src: getAudioUrl("Dean Shev - Still Human.mp3"),
    coverArt: "/lovable-uploads/749e260e-38aa-4528-b1a6-a4c62cc10020.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "In this digital age, I'm still human..." },
      { time: 6, text: "Heart and soul, no algorithm." },
      { time: 10, text: "Through the noise, I find my way," },
      { time: 14, text: "Still human at the end of day." },
    ] as LyricLine[]
  },
  {
    id: "bc-coast-catalyst",
    title: "BC Coast Catalyst",
    artist: "Coastal AI Collective",
    src: getAudioUrl("BC Coast Catalyst.mp3"),
    coverArt: "/lovable-uploads/429a3cb8-3ffb-40db-874a-5829a6a083bd.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "From the Pacific shores to mountain peaks..." },
      { time: 6, text: "BC Coast Catalyst speaks." },
      { time: 10, text: "Innovation flows like the tide," },
      { time: 14, text: "Together we stand, side by side." },
    ] as LyricLine[]
  },
  {
    id: "deepfakes-in-the-rain",
    title: "Deepfakes in the Rain",
    artist: "Kris Krüg",
    src: getAudioUrl("Deepfakes in the Rain_KK_BCAI.mp3"),
    coverArt: "/lovable-uploads/22e18179-d389-42d3-9924-c6caf65d7d2e.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "Rain falls on Vancouver's streets..." },
      { time: 6, text: "Deepfakes blur the faces we meet." },
      { time: 10, text: "Truth and fiction intertwine," },
      { time: 14, text: "In the digital rain, we redefine." },
    ] as LyricLine[]
  }
];
