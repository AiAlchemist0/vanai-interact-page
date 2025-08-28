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
    id: "dr-patrick-cover",
    title: "Dr. Patrick Parra Pennefather",
    artist: "UBC AI Orchestra",
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
    title: "H.R MacMillan Space Centre - Alien Abduction",
    artist: "Lorraine Lowe",
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
    id: "my-arts-all-human",
    title: "My art's all human, soul-deep and true",
    artist: "Michelle Diamond",
    src: getAudioUrl("My art's all human, soul-deep and true.mp3"),
    coverArt: "/lovable-uploads/ce458784-2685-46f2-a7ea-3c2e6e1143ea.png",
    description: `A humorous photographer's anthem about maintaining creative authenticity in the AI age.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "In Vancouver's AI whirl, where ideas spark and spin," },
      { time: 6, text: "I'm Photographer Michelle, capturing it all from within." },
      { time: 10, text: "At every event, my camera's my trusty sword," },
      { time: 14, text: "Snapping Kris Krug leading, and the crowd's roaring chord." },
      { time: 54, text: "My art's all human, soul-deep and true," },
    ] as LyricLine[]
  },
  {
    id: "indigenomics-ai",
    title: "Indigenomics AI, that's where we start",
    artist: "Carol Anne Hilton",
    src: getAudioUrl("Indigenomics AI, that's where we start.mp3"),
    coverArt: "/lovable-uploads/8d6e4150-076b-4f1c-840b-595c15a55048.png",
    lyrics: [
      { time: 0, text: "I'm Carol Anne Hilton, with a sparkle and a plan," },
      { time: 54, text: "Indigenomics AI, that's where we start—" },
    ] as LyricLine[]
  },
  {
    id: "lalala-ai-dilemma",
    title: "Lalala AI Dilemma",
    artist: "Matthew & Aliza Shwartzman",
    src: getAudioUrl("Lalala AI Dilemma.mp3"),
    coverArt: "/lovable-uploads/7e23b796-605f-4562-927b-06daa9147648.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "La la la, the algorithms sing..." },
      { time: 6, text: "Dilemmas in the AI ring." },
    ] as LyricLine[]
  },
  {
    id: "brenda-bailey-jedi",
    title: "Brenda Bailey: Jedi Master of Finance",
    artist: "AI Community Orchestra",
    src: getAudioUrl("Brenda Bailey Jedi Master of Finance.mp3"),
    coverArt: "/lovable-uploads/749e260e-38aa-4528-b1a6-a4c62cc10020.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "In the halls of power, where budgets align..." },
      { time: 6, text: "Brenda Bailey stands, with force divine." },
    ] as LyricLine[]
  },
  {
    id: "mac-mind-ai-consciousness",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Ziggy Minddust",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: "/lovable-uploads/cc181a8b-6dad-4af6-8731-9a8cbd3ba5d0.png",
    lyrics: [
      { time: 0, text: "(Intro)" },
      { time: 2, text: "Welcome to the frontier of mind..." },
      { time: 6, text: "Where AI and consciousness bind." },
    ] as LyricLine[]
  },
  {
    id: "darren-ai-struck",
    title: "AI struck! Data's thunder roar!",
    artist: "Darren Nicholls",
    src: getAudioUrl("Darren AI Struck.mp3"),
    coverArt: "/lovable-uploads/cf89c28f-23f5-4188-a5aa-e50f28daa5c2.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 6, text: "AI struck! Data's thunder roar!" },
    ] as LyricLine[]
  },
  {
    id: "dean-shev-human",
    title: "What does it mean to be human?",
    artist: "Dean Shev aka Chazz",
    src: getAudioUrl("Dean Shev What does it mean to be human.mp3"),
    coverArt: "/lovable-uploads/749e260e-38aa-4528-b1a6-a4c62cc10020.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "What does it mean to be human?" },
    ] as LyricLine[]
  },
  {
    id: "philippe-pasquier-art-hallucinations",
    title: "L'Art des Hallucinations de l'IA",
    artist: "Philippe Pasquier",
    src: getAudioUrl("L'Art des Hallucinations de l'IA.mp3"),
    coverArt: "/lovable-uploads/53a7e8c9-c967-4d3d-870c-68e228c2ff3f.png",
    lyrics: [
      { time: 4, text: "Je suis Philippe, dans le labo de rêves..." },
      { time: 52, text: "L'art des hallucinations de l'IA" },
    ] as LyricLine[]
  },
  {
    id: "bc-coast-catalyst",
    title: "BC Coast Catalyst",
    artist: "Kassandra Linklater",
    src: getAudioUrl("BC Coast Catalyst.mp3"),
    coverArt: "/lovable-uploads/429a3cb8-3ffb-40db-874a-5829a6a083bd.png",
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "From the Pacific shores to mountain peaks..." },
      { time: 6, text: "BC Coast Catalyst speaks." },
    ] as LyricLine[]
  },
  {
    id: "smells-like-reids-spirit",
    title: "Smells Like Reid's Spirit",
    artist: "Andrew Reid",
    src: getAudioUrl("Smells Like Reid Spirit.mp3"),
    coverArt: "/lovable-uploads/81af0807-f304-42cc-88f3-989ff1413436.png",
    lyrics: [
      { time: 40, text: "Smells like Reid's spirit (Yeah!)" },
    ] as LyricLine[]
  },
  {
    id: "eagle-watch-inlet",
    title: "Eagle's Watch Over the Inlet",
    artist: "Gabriel George Sr.",
    src: getAudioUrl("Eagle's Watch Over the Inlet.mp3"),
    coverArt: "/lovable-uploads/6b65586a-63ba-48f1-9c56-1846ec800f39.png",
    lyrics: [
      { time: 0, text: "Hey-ya, hey-ya, the wings beat strong," },
      { time: 120, text: "Kway-tal-us puk-wus, the eagle is watching over us," },
    ] as LyricLine[]
  }
];