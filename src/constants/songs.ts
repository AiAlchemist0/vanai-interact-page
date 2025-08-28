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
    coverArt: "/lovable-uploads/b56415f7-ad61-43e6-8d05-54452f44a5be.png",
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
    id: "mac",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Mindful Collective",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: macCover,
    description: `A deep philosophical journey exploring the intersection of human consciousness and artificial intelligence. This thoughtful track delves into the profound questions surrounding the nature of mind, awareness, and what it means to be conscious in an age of increasingly sophisticated AI. Created by the Mindful Collective, it serves as both meditation and exploration, inviting listeners to contemplate the boundaries between human and artificial consciousness while considering the implications for our understanding of intelligence, sentience, and the very essence of being.`,
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
  }
];