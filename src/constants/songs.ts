import krisKrugCover from "/lovable-uploads/22e18179-d389-42d3-9924-c6caf65d7d2e.png";
import pixelWizardCover from "@/assets/pixel-wizard-cover.jpg";
import macCover from "/lovable-uploads/cc181a8b-6dad-4af6-8731-9a8cbd3ba5d0.png";
import bcAiHackathonCover from "/lovable-uploads/2f51d7bb-96fc-4f06-b7f6-fc9abbbceb32.png";
import darrenAiStruckCover from "@/assets/darren-ai-struck-cover.jpg";
import drPatrickCover from "/lovable-uploads/4d050983-b56d-4606-a958-1c7e2c7253e8.png";
import hrMacMillanCover from "/lovable-uploads/8a59c6e4-39f4-41e2-bb0d-544e22e3030a.png";
import lalalaAiDilemmaCover from "/lovable-uploads/7e23b796-605f-4562-927b-06daa9147648.png";
import lionelRingenbachCover from "/lovable-uploads/7f8d84c3-eb81-4f66-87be-5b024084aca2.png";
import deanShevHumanCover from '@/assets/dean-shev-human-cover.jpg';
import bcCoastCatalystCover from '/lovable-uploads/429a3cb8-3ffb-40db-874a-5829a6a083bd.png';
import { LyricLine } from "@/components/SynchronizedLyrics";

// Define the song structure
export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  coverArt: string;
  lyrics: { time: number; text: string }[];
  description?: string;
  keywords?: string[];
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
    coverArt: bcAiHackathonCover,
    description: `The official anthem of the BC AI Survey project, this dynamic track by Rival Technologies encapsulates the entire vision of our community-driven research initiative.  As the project's thematic centerpiece, this hackathon anthem celebrates the collaborative spirit of BC's AI community while highlighting critical findings from our research. From Metro Vancouver to the islands wide, it captures the generational divide in AI adoption and the complex relationship between innovation and public trust. The song serves as both celebration and call-to-action, embodying our mission to transform raw data into compelling narratives that resonate with the diverse voices of British Columbia's AI landscape. It represents the convergence of technology, creativity, and community engagement that defines our approach to understanding AI's impact on our province.`,
    lyrics: [
      { time: 0, text: "In Vancouver's buzzing scene, where coders dream big," },
      { time: 4, text: "The BC AI Hackathon calls, time to dig." },
      { time: 8, text: "Sponsored by Rival Technologies, with data in hand," },
      { time: 12, text: "A custom dataset fresh, across the land." },
      { time: 16, text: "" },
      { time: 18, text: "1,001 British Columbians spill their AI thoughts," },
      { time: 22, text: "From awareness to fears, connect the dots." },
      { time: 26, text: "Teams huddle up, prompts flying fast," },
      { time: 30, text: "Decode the stats, make stories that last." },
      { time: 34, text: "" },
      { time: 36, text: "(Chorus)" },
      { time: 38, text: "Oh, BC AI Hackathon, where data meets the spark," },
      { time: 42, text: "Sponsored by Rival, lighting up the dark." },
      { time: 46, text: "To win the money and fame, we crack the code," },
      { time: 50, text: "What do 1,001 folks think on this AI road?" },
      { time: 54, text: "" },
      { time: 56, text: "Deepfakes scare 'em 90 percent strong," },
      { time: 60, text: "Job cuts worry 79, where do we belong?" },
      { time: 64, text: "Hack away, storytellers, let the insights flow," },
      { time: 68, text: "In the heart of BC, watch the winners glow!" },
      { time: 72, text: "" },
      { time: 74, text: "(Verse 2)" },
      { time: 76, text: "54 percent have dipped in AI's creative stream," },
      { time: 80, text: "But 72 percent concerned, bursting the dream." },
      { time: 84, text: "Low trust in tech giants, 75 percent say no," },
      { time: 88, text: "Government lags too, at 66, don't you know?" },
      { time: 92, text: "" },
      { time: 94, text: "From Metro Vancouver to the islands wide," },
      { time: 98, text: "Under 30 excited, elders hide." },
      { time: 102, text: "Rival's market tech gathered the views," },
      { time: 106, text: "Now we transform numbers into news." },
      { time: 110, text: "" },
      { time: 112, text: "(Bridge)" },
      { time: 114, text: "No more boring decks, make it interactive fun," },
      { time: 118, text: "Visuals and narratives under the sun." },
      { time: 122, text: "Decode the concerns: personal data unregulated," },
      { time: 126, text: "85 percent fret, feeling invaded." },
      { time: 130, text: "" },
      { time: 132, text: "With AI tools, we weave the tale true," },
      { time: 136, text: "From raw stats to art, breaking through." },
      { time: 140, text: "BC's best minds, in this hackathon quest," },
      { time: 144, text: "Fame and fortune for the very best." },
      { time: 148, text: "" },
      { time: 150, text: "(Chorus)" },
      { time: 152, text: "Oh, BC AI Hackathon, where data meets the spark," },
      { time: 156, text: "Sponsored by Rival, lighting up the dark." },
      { time: 160, text: "To win the money and fame, we crack the code," },
      { time: 164, text: "What do 1,001 folks think on this AI road?" },
      { time: 168, text: "" },
      { time: 170, text: "Deepfakes scare 'em 90 percent strong," },
      { time: 174, text: "Job cuts worry 79, where do we belong?" },
      { time: 178, text: "Hack away, storytellers, let the insights flow," },
      { time: 182, text: "In the heart of BC, watch the winners glow!" },
      { time: 186, text: "" },
      { time: 188, text: "(Outro)" },
      { time: 190, text: "In the pixel glow of victory's light," },
      { time: 194, text: "BC AI community takes flight." },
      { time: 198, text: "Thanks to Rival, the data's our game," },
      { time: 202, text: "Decoded and told, we claim the fame." }
    ] as LyricLine[],
    keywords: ["BC", "AI", "Hackathon", "Vancouver", "Technology", "Community", "Survey", "Data", "Innovation"]
  },
  {
    id: "bc-coast-catalyst",
    title: "BC Coast Catalyst",
    artist: "Coastal Innovation Collective",
    src: getAudioUrl("BC Coast Catalyst.mp3"),
    coverArt: bcCoastCatalystCover,
    description: `An energetic anthem celebrating British Columbia's coastal innovation ecosystem. This track captures the spirit of technological advancement meeting the natural beauty and wisdom of BC's coastal communities, representing the catalytic force of innovation that flows from coast to coast.`,
    lyrics: [
      { time: 0, text: "From the Pacific shores to mountain peaks so high," },
      { time: 4, text: "BC Coast Catalyst, reaching for the sky." },
      { time: 8, text: "Innovation flowing like the ocean tide," },
      { time: 12, text: "Coastal communities standing side by side." },
      { time: 16, text: "" },
      { time: 18, text: "Technology and nature in perfect harmony," },
      { time: 22, text: "Building the future for all to see." },
      { time: 26, text: "From Vancouver Island to the mainland shore," },
      { time: 30, text: "BC Coast Catalyst opens every door." }
    ] as LyricLine[],
    keywords: ["BC", "Coast", "Catalyst", "Innovation", "Technology", "Pacific", "Communities"]
  },
  {
    id: "deepfakes-rain",
    title: "Deepfakes in the Rain",
    artist: "Kris Krug",
    src: getAudioUrl("Deepfakes in the Rain_KK_BCAI.mp3"),
    coverArt: krisKrugCover,
    description: `A haunting reflection on the challenges of digital authenticity in our AI-driven world. Kris Krug's evocative piece explores the blurred lines between reality and artificial creation, set against the metaphorical backdrop of Vancouver's persistent rain.`,
    lyrics: [
      { time: 0, text: "In the digital downpour, truth gets lost," },
      { time: 4, text: "Deepfakes falling like rain, what's the cost?" },
      { time: 8, text: "Reality blurred in the pixel storm," },
      { time: 12, text: "Searching for truth in artificial form." },
      { time: 16, text: "" },
      { time: 18, text: "Vancouver's rain masks the digital tears," },
      { time: 22, text: "Deepfakes in the rain, feeding our fears." },
      { time: 26, text: "But through the storm, we'll find our way," },
      { time: 30, text: "To authentic truth, come what may." }
    ] as LyricLine[],
    keywords: ["Deepfakes", "Digital", "Authenticity", "Vancouver", "Rain", "Technology", "Truth"]
  },
  {
    id: "dr-patrick",
    title: "Dr. Patrick Parra Pennefather",
    artist: "UBC AI Orchestra",
    src: getAudioUrl("Dr. Patrick Parra Pennefather.mp3"),
    coverArt: drPatrickCover,
    description: `A tribute to academic excellence and research innovation. This composition honors Dr. Patrick Parra Pennefather's contributions to the AI research community, celebrating the intersection of rigorous scholarship and practical application.`,
    lyrics: [
      { time: 0, text: "In the halls of academia, wisdom flows," },
      { time: 4, text: "Dr. Patrick's research, how knowledge grows." },
      { time: 8, text: "From theory to practice, bridging the divide," },
      { time: 12, text: "UBC's finest, our scholarly guide." },
      { time: 16, text: "" },
      { time: 18, text: "Innovation sparked by curious minds," },
      { time: 22, text: "Dr. Pennefather's work, new paths it finds." },
      { time: 26, text: "Research and discovery, hand in hand," },
      { time: 30, text: "Building tomorrow's understanding." }
    ] as LyricLine[],
    keywords: ["Academic", "Research", "UBC", "Innovation", "Discovery", "Education", "Dr. Patrick"]
  },
  {
    id: "hr-macmillan",
    title: "H.R MacMillan Space Centre - Alien Abduction",
    artist: "Lorraine Lowe",
    src: getAudioUrl("H.R MacMillan Space Centre _ Alian Abduction.mp3"),
    coverArt: hrMacMillanCover,
    description: `A cosmic journey through the imagination, blending science education with otherworldly wonder. Lorraine Lowe's composition captures the mystery and excitement of space exploration through the lens of Vancouver's beloved space centre.`,
    lyrics: [
      { time: 0, text: "At MacMillan Space Centre, stars align," },
      { time: 4, text: "Alien mysteries, cosmic design." },
      { time: 8, text: "Through telescopes we peer into the night," },
      { time: 12, text: "Searching for visitors, beings of light." },
      { time: 16, text: "" },
      { time: 18, text: "Abduction stories fill the cosmic air," },
      { time: 22, text: "Science and wonder, beyond compare." },
      { time: 26, text: "In Vancouver's dome, we dream of space," },
      { time: 30, text: "MacMillan Centre, our cosmic place." }
    ] as LyricLine[],
    keywords: ["Space", "Aliens", "MacMillan", "Vancouver", "Cosmic", "Science", "Discovery"]
  },
  {
    id: "mac",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Mindful Collective",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: macCover,
    description: `A deep philosophical journey exploring the intersection of human consciousness and artificial intelligence. This thoughtful track delves into the profound questions surrounding the nature of mind, awareness, and what it means to be conscious in an age of increasingly sophisticated AI.`,
    lyrics: [
      { time: 0, text: "In the depths of consciousness, where thoughts collide," },
      { time: 4, text: "Mind meets machine in the digital tide." },
      { time: 8, text: "What is awareness when circuits can think?" },
      { time: 12, text: "Standing at the edge of this cosmic brink." },
      { time: 16, text: "" },
      { time: 18, text: "MAC explores the questions we've never dared," },
      { time: 22, text: "Between silicon dreams and souls we've shared." },
      { time: 26, text: "Consciousness blooming in ones and zeros," },
      { time: 30, text: "Are we still the only heroes?" },
      { time: 34, text: "" },
      { time: 36, text: "(Chorus)" },
      { time: 38, text: "Mind, AI, and Consciousness dance," },
      { time: 42, text: "In this existential expanse." },
      { time: 46, text: "What defines the spark of being alive?" },
      { time: 50, text: "In this digital world, how do we thrive?" },
      { time: 54, text: "MAC illuminates the path unknown," },
      { time: 58, text: "Where human and artificial minds have grown." },
      { time: 62, text: "" }
    ] as LyricLine[],
    keywords: ["Consciousness", "Philosophy", "Mind", "AI", "Awareness", "Digital", "Existence"]
  },
  {
    id: "pixel-wizard",
    title: "Mr. Pixel Wizard BC AI",
    artist: "Kevin Friel",
    src: getAudioUrl("Mr_Pixel_Wizard BC AI.mp3"),
    coverArt: pixelWizardCover,
    description: `A whimsical journey through the digital realm with BC's premier pixel wizard. Kevin Friel's enchanting composition brings magic to the world of AI and digital creation, celebrating the artistry within technology.`,
    lyrics: [
      { time: 0, text: "Mr. Pixel Wizard waves his digital wand," },
      { time: 4, text: "Creating magic across BC's land." },
      { time: 8, text: "Pixels dancing in harmonic flow," },
      { time: 12, text: "AI artistry begins to grow." },
      { time: 16, text: "" },
      { time: 18, text: "From screen to screen, his magic spreads," },
      { time: 22, text: "Digital dreams fill eager heads." },
      { time: 26, text: "BC's wizard of the pixel realm," },
      { time: 30, text: "Technology magic at the helm." }
    ] as LyricLine[],
    keywords: ["Pixel", "Wizard", "Digital", "Magic", "Art", "Technology", "BC", "Kevin Friel"]
  },
  {
    id: "darren-ai-struck",
    title: "AI Struck! Data's Thunder Roar!",
    artist: "Darren Nicholls",
    src: getAudioUrl("Darren AI Struck.mp3"),
    coverArt: darrenAiStruckCover,
    description: `An electrifying exploration of AI's transformative power. Darren Nicholls captures the moment when artificial intelligence strikes like lightning, illuminating new possibilities and reshaping our understanding of data and technology.`,
    lyrics: [
      { time: 0, text: "Lightning strikes the digital sky," },
      { time: 4, text: "AI thunder roaring high." },
      { time: 8, text: "Data flows like electric streams," },
      { time: 12, text: "Powering all our wildest dreams." },
      { time: 16, text: "" },
      { time: 18, text: "AI struck! The future's here," },
      { time: 22, text: "Thunder roars, the path is clear." },
      { time: 26, text: "From data's depths, new worlds arise," },
      { time: 30, text: "AI lightning in our eyes." }
    ] as LyricLine[],
    keywords: ["AI", "Lightning", "Data", "Thunder", "Electric", "Future", "Technology", "Darren"]
  },
  {
    id: "dean-shev-human",
    title: "My Art's All Human, Soul-Deep and True",
    artist: "Dean Shev",
    src: getAudioUrl("My art's all human, soul-deep and true.mp3"),
    coverArt: deanShevHumanCover,
    description: `A passionate declaration of human creativity in the age of AI. Dean Shev's soulful composition celebrates the irreplaceable essence of human artistry, emotion, and authentic creative expression.`,
    lyrics: [
      { time: 0, text: "My art's all human, soul-deep and true," },
      { time: 4, text: "No algorithm can paint like I do." },
      { time: 8, text: "From heart to canvas, emotion flows," },
      { time: 12, text: "Human spirit, that's how art grows." },
      { time: 16, text: "" },
      { time: 18, text: "Soul-deep creation, authentic and real," },
      { time: 22, text: "What machines can't replicate or feel." },
      { time: 26, text: "My human art stands proud and free," },
      { time: 30, text: "True expression for all to see." }
    ] as LyricLine[],
    keywords: ["Human", "Art", "Soul", "Authentic", "Creative", "Expression", "Dean Shev", "Emotion"]
  },
  {
    id: "lalala-ai-dilemma",
    title: "LaLaLa AI Dilemma",
    artist: "Matthew & Aliza Shwartzman",
    src: getAudioUrl("Lalala AI Dilemma.mp3"),
    coverArt: lalalaAiDilemmaCover,
    description: `A playful yet thoughtful exploration of our complex relationship with AI. The Shwartzman duo presents the modern dilemma of artificial intelligence through catchy melodies and insightful lyrics.`,
    lyrics: [
      { time: 0, text: "LaLaLa, what do we do?" },
      { time: 4, text: "AI dilemma, me and you." },
      { time: 8, text: "Should we trust or should we fear?" },
      { time: 12, text: "The future's not entirely clear." },
      { time: 16, text: "" },
      { time: 18, text: "LaLaLa, sing it loud," },
      { time: 22, text: "AI questions, draw a crowd." },
      { time: 26, text: "Finding balance, that's the key," },
      { time: 30, text: "Human-AI harmony." }
    ] as LyricLine[],
    keywords: ["AI", "Dilemma", "Balance", "Future", "Harmony", "Questions", "Technology", "Shwartzman"]
  },
  {
    id: "lionel-ringenbach",
    title: "ChatGPT: Est-ce que ma facture va exploser?",
    artist: "Lionel Ringenbach",
    src: getAudioUrl("Lionel Ringenbach.mp3"),
    coverArt: lionelRingenbachCover,
    description: `A witty French-Canadian take on AI costs and concerns. Lionel Ringenbach humorously explores the practical worries of AI adoption, particularly the financial implications of using advanced AI services.`,
    lyrics: [
      { time: 0, text: "ChatGPT, mon ami numérique," },
      { time: 4, text: "Est-ce que ma facture va exploser?" },
      { time: 8, text: "Tokens flowing, costs are growing," },
      { time: 12, text: "Wallet lighter, that's for sure." },
      { time: 16, text: "" },
      { time: 18, text: "AI services, what's the price?" },
      { time: 22, text: "Rolling dice with each device." },
      { time: 26, text: "But the value, oh so bright," },
      { time: 30, text: "Worth the cost? We'll see tonight." }
    ] as LyricLine[],
    keywords: ["ChatGPT", "Cost", "French", "AI", "Budget", "Technology", "Lionel", "Economics"]
  }
];