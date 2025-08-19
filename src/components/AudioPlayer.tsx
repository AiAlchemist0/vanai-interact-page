import React from "react";
import { Play, Pause, StopCircle, Download, Music, SkipBack, SkipForward, Repeat, Repeat1, ArrowRight } from "lucide-react";
import { useAudioPlayer, Song } from "@/hooks/useAudioPlayer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLine } from "@/components/SynchronizedLyrics";
import { PlayTrackingIndicator } from "@/components/PlayTrackingIndicator";
import { LoadingFeedback } from "@/components/LoadingFeedback";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAudio } from "@/contexts/AudioContext";

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


// Supabase Storage URLs for audio files
const SUPABASE_URL = "https://oojckbecymzrrdtvcmqi.supabase.co";
const getAudioUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/audio-files/${filename}`;

const SONGS: Song[] = [
  {
    id: "bc-ai-hackathon",
    title: "BC AI Hackathon by Rival Tech",
    artist: "Official Anthem",
    src: getAudioUrl("BC AI Hackathon by Rival Tech.mp3"),
    coverArt: "/lovable-uploads/b56415f7-ad61-43e6-8d05-54452f44a5be.png",
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
    ] as LyricLine[]
  },
  {
    id: "lionel-ringenbach",
    title: "ChatGPT: Est-ce que ma facture va exploser?",
    artist: "Lionel Ringenbach",
    src: getAudioUrl("Lionel Ringenbach.mp3"),
    coverArt: lionelRingenbachCover,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "Who says AI says innovation," },
      { time: 4, text: "Qui dit innovation dit data," },
      { time: 6, text: "Who says data says training," },
      { time: 8, text: "Qui dit training dit power," },
      { time: 10, text: "Who says power says watts," },
      { time: 12, text: "Ah, dit bills in the red." },
      { time: 14, text: "Who says models says queries," },
      { time: 16, text: "Dit billions, dit daily drain," },
      { time: 18, text: "Who says users says 300 million strong," },
      { time: 20, text: "Qui dit queries dit energy gone wrong." },
      { time: 22, text: "Who says fatigue says GPU hum all night," },
      { time: 24, text: "So I head out to retreat, but dread bites." },
      { time: 26, text: "Then I research to uncover all the costs," },
      { time: 28, text: "So we question..." },
      { time: 30, text: "" },
      { time: 32, text: "(Chorus)" },
      { time: 34, text: "Combien de puissance ChatGPT utilise-t-il vraiment?" },
      { time: 38, text: "Billions of queries, energy abusing." },
      { time: 40, text: "I dropped the truth, numbers don't lie," },
      { time: 42, text: "One day's worth equals households' yearly supply." },
      { time: 44, text: "From 140 to 1,560 homes in a flash," },
      { time: 46, text: "AI's thirsty for power, making a splash." },
      { time: 48, text: "Wake up, creators, it's time to see," },
      { time: 50, text: "The hidden cost of our AI spree!" },
      { time: 52, text: "" },
      { time: 54, text: "(Verse 2)" },
      { time: 56, text: "Who says retreat says offline peace," },
      { time: 58, text: "Qui dit peace dit AI left on repeat." },
      { time: 60, text: "Who says drive says worry creeps in slow," },
      { time: 62, text: "\"Est-ce que ma facture va exploser?\"" },
      { time: 64, text: "Who says return says dive into the facts," },
      { time: 66, text: "Horror stats real, no turning back." },
      { time: 68, text: "Qui dit training dit black hole suck," },
      { time: 70, text: "But who says chats says the real luck toll." },
      { time: 72, text: "" },
      { time: 74, text: "(Chorus)" },
      { time: 76, text: "Combien de puissance ChatGPT utilise-t-il vraiment?" },
      { time: 80, text: "Billions of queries, energy abusing." },
      { time: 82, text: "I dropped the truth, numbers don't lie," },
      { time: 84, text: "One day's worth equals households' yearly supply." },
      { time: 86, text: "From 140 to 1,560 homes in a flash," },
      { time: 88, text: "AI's thirsty for power, making a splash." },
      { time: 90, text: "Wake up, creators, it's time to see," },
      { time: 92, text: "The hidden cost of our AI spree!" },
      { time: 94, text: "" },
      { time: 96, text: "(Verse 3)" },
      { time: 98, text: "Who says Altman says users so vast," },
      { time: 100, text: "Qui dit vast dit billion asks fast." },
      { time: 102, text: "Who says tests says short to long replies," },
      { time: 104, text: "1.46 to 4.4 watts, open your eyes." },
      { time: 106, text: "Qui dit scale dit planetary strain," },
      { time: 108, text: "Data centers drinking, climate in pain." },
      { time: 110, text: "Who says CO2 says transparency none," },
      { time: 112, text: "Big Tech quiet, but I've just begun." },
      { time: 114, text: "" },
      { time: 116, text: "(Bridge)" },
      { time: 118, text: "In Vancouver's meetup, I shared the score," },
      { time: 120, text: "CodeCarbon tools, calculatin' with care." },
      { time: 122, text: "From GPU buzz to world-wide hit," },
      { time: 124, text: "Je nous appelle to flip the script." },
      { time: 126, text: "Efficiency push, code that's green," },
      { time: 128, text: "Human-AI team, keep it clean." },
      { time: 130, text: "" },
      { time: 132, text: "(Outro)" },
      { time: 134, text: "So here's my quest as Ucodia bold," },
      { time: 136, text: "Questioning power in AI's hold." },
      { time: 138, text: "CompoVision gleams, but energy's core," },
      { time: 140, text: "Let's build wiser, open the door." },
      { time: 142, text: "How much power? The score's now clear," },
      { time: 144, text: "Grâce à mon travail, let's shift the gear!" }
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
      { time: 5, text: "Oh-oh-oh" },
      { time: 8, text: "" },
      { time: 10, text: "(Verse 1)" },
      { time: 12, text: "Yo, I'm Kris Krug, Human++ in Vancouver's wild ride," },
      { time: 16, text: "Photographer, connector, with the world by my side." },
      { time: 20, text: "From Nat Geo shoots to META CREATION Lab's spin," },
      { time: 24, text: "Founder of TheUpgrade.ai, hostin' Sandboxing AI within." },
      { time: 28, text: "BC + AI Ecosystem, researchin' at GNI too," },
      { time: 32, text: "Indie Web Forever, connectin' the crew." },
      { time: 36, text: "Uncertainty creepin', fear in the air," },
      { time: 40, text: "But optimism's sparklin', enthusiasm everywhere." },
      { time: 44, text: "Leaders listen up, they feel my pull," },
      { time: 48, text: "Bringin' folks together, makin' the circle full." },
      { time: 52, text: "" },
      { time: 54, text: "(Pre-Chorus 1)" },
      { time: 56, text: "Vancouver AI Community" },
      { time: 58, text: "What it mean to be human when the bots take the stage?" },
      { time: 62, text: "Artist soul questionin', turnin' the page." },
      { time: 66, text: "Can AI paint my dreams, steal my brush from my hand?" },
      { time: 70, text: "Or is it just a tool in this digital land?" },
      { time: 74, text: "" },
      { time: 76, text: "(Chorus 1)" },
      { time: 78, text: "Yeah, yeah" },
      { time: 80, text: "Kris Krug, uniter in the AI night," },
      { time: 84, text: "Bringin' us close when the world's feelin' tight." },
      { time: 88, text: "Deepfake faces, love in the code," },
      { time: 92, text: "Would I choose a bot over a real heart's road?" },
      { time: 96, text: "Circles of doubt, but we spin through the fear," },
      { time: 100, text: "Enthusiasm risin', optimism clear." },
      { time: 104, text: "Kris Krug, the light in the machine's cold glow," },
      { time: 108, text: "Humanity's vibe, let's let it show!" },
      { time: 112, text: "Oh-oh, in the glow... yeah, let's show it!" },
      { time: 116, text: "" },
      { time: 118, text: "(Verse 2)" },
      { time: 120, text: "Relationships glitchin', AI whisperin' sweet," },
      { time: 124, text: "Lovin' a program more than the one at my feet?" },
      { time: 128, text: "Deepfake smiles, blur the lines we once knew," },
      { time: 132, text: "Are we real or just pixels, me and you?" },
      { time: 136, text: "I gather the crew in Vancouver's beat," },
      { time: 140, text: "Talkin' the big stuff, where tech and soul meet." },
      { time: 144, text: "From artists to thinkers, families in the mix," },
      { time: 148, text: "I'm the voice of the change, fixin' the fix." },
      { time: 152, text: "" },
      { time: 154, text: "(Pre-Chorus 2)" },
      { time: 156, text: "What it mean to be artist when the code steals the art?" },
      { time: 160, text: "Human touch fadin', tearin' us apart." },
      { time: 164, text: "But I say unite, embrace the unknown," },
      { time: 168, text: "In this AI age, we're not alone." },
      { time: 172, text: "" },
      { time: 174, text: "(Chorus 2)" },
      { time: 176, text: "Kris Krug, uniter in the AI night," },
      { time: 180, text: "Bringin' us close when the world's feelin' tight." },
      { time: 184, text: "Deepfake faces, love in the code," },
      { time: 188, text: "Would I choose a bot over a real heart's road?" },
      { time: 192, text: "Circles of doubt, but we spin through the fear," },
      { time: 196, text: "Enthusiasm risin', optimism clear." },
      { time: 200, text: "Kris Krug, the light in the machine's cold glow," },
      { time: 204, text: "Humanity's vibe, let's let it show!" },
      { time: 208, text: "Let it show, yeah... in the AI night!" },
      { time: 212, text: "" },
      { time: 214, text: "(Bridge)" },
      { time: 216, text: "Yeah, the boom's hittin' hard, like thunder in the sky," },
      { time: 220, text: "I'm Kris Krug callin', don't let it pass by." },
      { time: 224, text: "Fear and hope dancin' in the same crowded room," },
      { time: 228, text: "My circle's the fire, chasin' away the gloom." },
      { time: 232, text: "What if AI loves better, never breaks your heart?" },
      { time: 236, text: "But I remind us, humanity's the start." },
      { time: 240, text: "Humanity... yeah, that's the start..." },
      { time: 244, text: "Vancouver AI Community" },
      { time: 248, text: "" },
      { time: 250, text: "(Chorus – Outro Fade)" },
      { time: 252, text: "Kris Krug, uniter in the AI night..." },
      { time: 256, text: "(Bringin' us close, yeah, feelin' alright)" },
      { time: 260, text: "Deepfake world, but we're holdin' on tight..." },
      { time: 264, text: "(Kris Krug, lightin' up the fight)" },
      { time: 268, text: "Circles of life in this AI dream..." },
      { time: 272, text: "Human forever, or so it seems..." },
      { time: 276, text: "Kris Krug, yeah, I'm the pulse of the stream!" },
      { time: 280, text: "In the glow... yeah, let's let it show... AI night..." }
    ] as LyricLine[]
  },
  {
    id: "pixel-wizard",
    title: "Mr. Pixel Wizard BC AI",
    artist: "Kevin Friel",
    src: getAudioUrl("Mr_Pixel_Wizard BC AI.mp3"),
    coverArt: "/lovable-uploads/2c251b22-3f09-4812-bc92-ad7c64062f4b.png",
    lyrics: [
      { time: 0, text: "In the realm of digital art" },
      { time: 3.5, text: "Mr. Pixel Wizard stands" },
      { time: 7, text: "Creating magic, bit by part" },
      { time: 10.5, text: "With his algorithmic hands" },
      { time: 14, text: "" },
      { time: 16, text: "Pixels dance at his command" },
      { time: 19.5, text: "Colors flow like liquid light" },
      { time: 23, text: "In this artificial land" },
      { time: 26.5, text: "Beauty born from code so bright" },
      { time: 30, text: "" },
      { time: 32, text: "Mr. Pixel Wizard weaves" },
      { time: 35.5, text: "Dreams in binary streams" },
      { time: 39, text: "What the digital mind believes" },
      { time: 42.5, text: "Nothing's quite what it seems" }
    ] as LyricLine[]
  },
  {
    id: "dr-patrick",
    title: "Dr. Patrick Parra Pennefather",
    artist: "UBC AI Orchestra",
    src: getAudioUrl("Dr. Patrick Parra Pennefather.mp3"),
    coverArt: drPatrickCover,
    lyrics: [
      { time: 0, text: "In the halls of learning high" },
      { time: 3.5, text: "Dr. Patrick leads the way" },
      { time: 7, text: "With his wisdom reaching sky" },
      { time: 10.5, text: "Teaching truth both night and day" },
      { time: 14, text: "" },
      { time: 16, text: "Parra Pennefather stands tall" },
      { time: 19.5, text: "In his office lined with books" },
      { time: 23, text: "Knowledge flowing to us all" },
      { time: 26.5, text: "From his scholarly looks" },
      { time: 30, text: "" },
      { time: 32, text: "Doctor Patrick, wise and true" },
      { time: 35.5, text: "Sharing all that he has learned" },
      { time: 39, text: "Every lesson something new" },
      { time: 42.5, text: "Every page that has been turned" },
      { time: 46, text: "" },
      { time: 48, text: "In the classroom, by the fire" },
      { time: 51.5, text: "Students gather round to hear" },
      { time: 55, text: "Words that lift our spirits higher" },
      { time: 58.5, text: "Making complex concepts clear" }
    ] as LyricLine[]
  },
  {
    id: "hr-macmillan",
    title: "H.R MacMillan Space Centre - Alien Abduction",
    artist: "Lorraine Lowe",
    src: getAudioUrl("H.R MacMillan Space Centre _ Alian Abduction.mp3"),
    coverArt: hrMacMillanCover,
    lyrics: [
      { time: 0, text: "In the depths of space we float" },
      { time: 4, text: "At the MacMillan Centre high" },
      { time: 8, text: "Where the stars and planets note" },
      { time: 12, text: "Mysteries across the sky" },
      { time: 16, text: "" },
      { time: 18, text: "Alien lights begin to dance" },
      { time: 22, text: "In the cosmic exhibition hall" },
      { time: 26, text: "Abduction stories in a trance" },
      { time: 30, text: "Visitors both large and small" },
      { time: 34, text: "" },
      { time: 36, text: "H.R MacMillan shows the way" },
      { time: 40, text: "To the wonders of the stars" },
      { time: 44, text: "Where imagination holds sway" },
      { time: 48, text: "And we dream of life on Mars" }
    ] as LyricLine[]
  },
  {
    id: "my-arts-all-human",
    title: "My art's all human, soul-deep and true",
    artist: "Michelle Diamond",
    src: getAudioUrl("My art's all human, soul-deep and true.mp3"),
    coverArt: "/lovable-uploads/92abee24-4e67-43a3-a956-1a845e0b1b1f.png",
    lyrics: [
      { time: 0, text: "My art's all human, soul-deep and true" },
      { time: 4, text: "No algorithms guide my hand" },
      { time: 8, text: "Each brushstroke tells what I've been through" },
      { time: 12, text: "In this digital world I make my stand" }
    ] as LyricLine[]
  },
  {
    id: "indigenomics-ai",
    title: "Indigenomics AI, that's where we start",
    artist: "Carol Anne Hilton",
    src: getAudioUrl("Indigenomics AI, that's where we start.mp3"),
    coverArt: "/lovable-uploads/8d6e4150-076b-4f1c-840b-595c15a55048.png",
    lyrics: [
      { time: 0, text: "Indigenomics AI, that's where we start" },
      { time: 4, text: "Building bridges with technology's art" },
      { time: 8, text: "Ancient wisdom meets digital flow" },
      { time: 12, text: "Together we learn, together we grow" }
    ] as LyricLine[]
  },
  {
    id: "lalala-ai-dilemma",
    title: "Lalala AI Dilemma",
    artist: "Matthew & Aliza Shwartzman",
    src: getAudioUrl("Lalala AI Dilemma.mp3"),
    coverArt: lalalaAiDilemmaCover,
    lyrics: [
      { time: 0, text: "Lalala, in the digital maze we wander" },
      { time: 4, text: "AI dreams and human thoughts collide" },
      { time: 8, text: "Lalala, as we ponder and we wonder" },
      { time: 12, text: "What lies beyond this algorithmic tide" },
      { time: 16, text: "" },
      { time: 18, text: "The dilemma grows stronger every day" },
      { time: 22, text: "Matthew sings while Sister harmonizes" },
      { time: 26, text: "With Dean Shev showing us the way" },
      { time: 30, text: "Through questions that the mind devises" },
      { time: 34, text: "" },
      { time: 36, text: "Lalala AI dilemma, what will we become?" },
      { time: 40, text: "Human hearts with silicon dreams" },
      { time: 44, text: "Lalala AI dilemma, the future's yet to come" },
      { time: 48, text: "Nothing's quite what it seems" }
    ] as LyricLine[]
  },
  {
    id: "brenda-bailey",
    title: "Brenda Bailey: Jedi Master of Finance",
    artist: "AI Community Orchestra",
    src: getAudioUrl("Brenda lvls up BC.mp3"),
    coverArt: "/lovable-uploads/9b9e9cd3-384c-4848-8fd2-a1a882698f96.png",
    lyrics: [
      { time: 0, text: "Brenda Bailey takes the stage" },
      { time: 4, text: "Fiscal force in digital age" },
      { time: 8, text: "Level up with AI might" },
      { time: 12, text: "Leading BC to new heights" },
      { time: 16, text: "" },
      { time: 18, text: "Numbers dance at her command" },
      { time: 22, text: "Building futures for our land" },
      { time: 26, text: "Artificial intelligence" },
      { time: 30, text: "Meets financial excellence" },
      { time: 34, text: "" },
      { time: 36, text: "Brenda Bailey, level up!" },
      { time: 40, text: "Fiscal AI force rising up" },
      { time: 44, text: "British Columbia's bright new day" },
      { time: 48, text: "Innovation leads the way" }
    ] as LyricLine[]
  },
  {
    id: "mac",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Ziggy Minddust",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: macCover,
    lyrics: [
      { time: 0, text: "In the realm where mind meets machine" },
      { time: 4, text: "Consciousness flows like a digital stream" },
      { time: 8, text: "AI dreams in silicon nights" },
      { time: 12, text: "While neurons dance in electric lights" },
      { time: 16, text: "" },
      { time: 18, text: "MAC - the fusion of thought and code" },
      { time: 22, text: "Where human wisdom finds its mode" },
      { time: 26, text: "In algorithms deep and wide" },
      { time: 30, text: "Consciousness and AI collide" }
    ] as LyricLine[]
  },
  {
    id: "darren-ai-struck",
    title: "AI struck! Data's thunder roar!",
    artist: "Darren Nicholls",
    src: getAudioUrl("Darren AI Struck.mp3"),
    coverArt: "/lovable-uploads/cf89c28f-23f5-4188-a5aa-e50f28daa5c2.png",
    lyrics: [
      { time: 0, text: "AI struck! Data's thunder roar!" },
      { time: 4, text: "Electric minds in digital war" },
      { time: 8, text: "Silicon dreams come alive tonight" },
      { time: 12, text: "In the realm of artificial light" },
      { time: 16, text: "" },
      { time: 18, text: "Darren calls from cyber space" },
      { time: 22, text: "Where algorithms show their face" },
      { time: 26, text: "Thunder roars through data streams" },
      { time: 30, text: "Reality splits at digital seams" },
      { time: 34, text: "" },
      { time: 36, text: "AI struck! Data's thunder roar!" },
      { time: 40, text: "Nothing's like it was before" },
      { time: 44, text: "In this brave new world we've made" },
      { time: 48, text: "Where human dreams and AI played" }
    ] as LyricLine[]
  },
  {
    id: "dean-shev-human",
    title: "What does it mean to be human?",
    artist: "Dean Shev aka Chazz",
    src: getAudioUrl("Dean Shev What does it mean to be human.mp3"),
    coverArt: "/lovable-uploads/749e260e-38aa-4528-b1a6-a4c62cc10020.png",
    lyrics: [
      { time: 0, text: "What does it mean to be human?" },
      { time: 4, text: "In this age of silicon dreams" },
      { time: 8, text: "When machines begin to reason" },
      { time: 12, text: "Nothing's quite what it seems" },
      { time: 16, text: "" },
      { time: 18, text: "Dean Shev asks the question deep" },
      { time: 22, text: "Are we more than code and wire?" },
      { time: 26, text: "In our hearts, what do we keep?" },
      { time: 30, text: "That lifts our souls ever higher?" },
      { time: 34, text: "" },
      { time: 36, text: "What does it mean to be human?" },
      { time: 40, text: "When AI learns to feel and think" },
      { time: 44, text: "In consciousness, we're all pursuing" },
      { time: 48, text: "The missing philosophical link" }
    ] as LyricLine[]
  },
  {
    id: "philippe-pasquier-art-hallucinations",
    title: "L'Art des Hallucinations de l'IA",
    artist: "Philippe Pasquier",
    src: getAudioUrl("L'Art des Hallucinations de l'IA.mp3"),
    coverArt: "/lovable-uploads/53a7e8c9-c967-4d3d-870c-68e228c2ff3f.png",
    lyrics: [
      { time: 0, text: "L'art des hallucinations de l'IA" },
      { time: 4, text: "Philippe Pasquier explores the way" },
      { time: 8, text: "Machines dream in vivid colors bright" },
      { time: 12, text: "Creating visions in digital light" },
      { time: 16, text: "" },
      { time: 18, text: "Neural networks paint what cannot be" },
      { time: 22, text: "Hallucinations set creativity free" },
      { time: 26, text: "In the space between real and virtual" },
      { time: 30, text: "Art emerges, beautiful and spiritual" },
      { time: 34, text: "" },
      { time: 36, text: "L'art des hallucinations flows" },
      { time: 40, text: "Where imagination freely goes" },
      { time: 44, text: "Philippe shows us how AI sees" },
      { time: 48, text: "Beyond reality's boundaries" }
    ] as LyricLine[]
  }
];

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

interface AudioPlayerProps {
  audioPlayerHook: ReturnType<typeof useAudioPlayer>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioPlayerHook }) => {
  const isMobile = useIsMobile();
  const { startPlayTracking, endPlayTracking, updateActivity } = useAudio();
  
  const {
    audioRef,
    currentSongIndex,
    setCurrentSongIndex,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    autoplayBlocked,
    setAutoplayBlocked,
    hasUserInteracted,
    setHasUserInteracted,
    audioError,
    setAudioError,
    isLoading,
    setIsLoading,
    fileAvailable,
    setFileAvailable,
    retryCount,
    setRetryCount,
    showLyricsOnly,
    setShowLyricsOnly,
    isPlaylistMode,
    setIsPlaylistMode,
    currentSong,
    loadSpecificSong,
    startPlayback,
  } = audioPlayerHook;
  
  const [shouldAutoPlay, setShouldAutoPlay] = React.useState(false);
  const [hasRecordedPlay, setHasRecordedPlay] = React.useState(false);
  
  // Add state for animated marquee text on mobile
  const [isTextOverflowing, setIsTextOverflowing] = React.useState(false);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const artistRef = React.useRef<HTMLParagraphElement>(null);
  
  // Check for text overflow on mobile
  React.useEffect(() => {
    if (!isMobile) return;
    
    const checkOverflow = () => {
      const titleEl = titleRef.current;
      const artistEl = artistRef.current;
      
      if (titleEl && artistEl) {
        const titleOverflow = titleEl.scrollWidth > titleEl.clientWidth;
        const artistOverflow = artistEl.scrollWidth > artistEl.clientWidth;
        setIsTextOverflowing(titleOverflow || artistOverflow);
      }
    };
    
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    return () => window.removeEventListener('resize', checkOverflow);
  }, [currentSong, isMobile]);
  
  // Check file availability with retry mechanism
  React.useEffect(() => {
    const checkFileAvailability = async (attempt = 1) => {
      setIsLoading(true);
      setFileAvailable(null);
      setAudioError(null);
      
      try {
        const response = await fetch(currentSong.src, { 
          method: 'HEAD',
          cache: 'no-cache' // Ensure fresh check
        });
        if (response.ok) {
          setFileAvailable(true);
          setRetryCount(0);
          setShowLyricsOnly(false);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Audio file check failed (attempt ${attempt}):`, error);
        
        if (attempt < 3) {
          // Retry up to 3 times with exponential backoff
          setTimeout(() => {
            setRetryCount(attempt);
            checkFileAvailability(attempt + 1);
          }, Math.pow(2, attempt) * 1000);
        } else {
          setFileAvailable(false);
          setRetryCount(attempt);
          setAudioError(`Unable to load "${currentSong.title}" after ${attempt} attempts. File may not be available.`);
          // Offer lyrics-only mode as fallback
          setShowLyricsOnly(true);
        }
      } finally {
        if (attempt >= 3 || fileAvailable !== false) {
          setIsLoading(false);
        }
      }
    };
    
    checkFileAvailability();
  }, [currentSong.src]);

  React.useEffect(() => {
    // Don't create audio element if file is not available
    if (fileAvailable === false) {
      return;
    }
    
    // Cleanup any existing audio element before creating a new one
    const existingAudio = audioRef.current;
    if (existingAudio) {
      existingAudio.pause();
      existingAudio.currentTime = 0;
      existingAudio.src = '';
      // Remove all event listeners
      existingAudio.removeEventListener("loadedmetadata", () => {});
      existingAudio.removeEventListener("timeupdate", () => {});
      existingAudio.removeEventListener("ended", () => {});
      existingAudio.removeEventListener("error", () => {});
    }
    
    const audio = new Audio(currentSong.src);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
      setIsLoading(false);
    };
    
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProgress(pct);
    };
    
    const onError = () => {
      setAudioError(`Failed to load "${currentSong.title}". The audio file may not be available.`);
      setIsPlaying(false);
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      
      // End play tracking when song ends
      if (hasRecordedPlay) {
        endPlayTracking(currentSong.id, duration);
        setHasRecordedPlay(false);
      }
      
      // Only auto-advance if user has interacted with the player
      if (!hasUserInteracted) return;
      
      // Handle playlist mode (auto-advance through all songs)
      if (isPlaylistMode) {
        const nextIndex = currentSongIndex < SONGS.length - 1 ? currentSongIndex + 1 : 0;
        setCurrentSongIndex(nextIndex);
        setShouldAutoPlay(true);
        return;
      }
      
      // When not in playlist mode, don't auto-advance
      // User can manually navigate or enable playlist mode
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    // Only reset states on initial song load, not on every effect run
    setProgress(0);
    setCurrentTime(0);
    setAutoplayBlocked(false);
    setAudioError(null);

    return () => {
      // Comprehensive cleanup to prevent any lingering audio
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [currentSong.src, fileAvailable]); // Simplified dependencies - only recreate when song source changes

  // Reset play tracking when song changes
  React.useEffect(() => {
    // End tracking for previous song if it was being tracked
    if (hasRecordedPlay) {
      endPlayTracking(currentSong.id, duration);
    }
    setHasRecordedPlay(false);
  }, [currentSongIndex, endPlayTracking, currentSong.id, hasRecordedPlay]);

  // Effect to handle auto-play after song changes
  React.useEffect(() => {
    if (shouldAutoPlay && audioRef.current && !isPlaying) {
      const audio = audioRef.current;
      
      // Wait for the audio to be ready before attempting to play
      const attemptAutoPlay = () => {
        if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          audio.play()
            .then(() => {
              setIsPlaying(true);
              setShouldAutoPlay(false);
              // Start play tracking when auto-playing
              if (!hasRecordedPlay) {
                console.log('🎵 Auto-play: Starting play tracking for:', currentSong.title);
                startPlayTracking(currentSong.id);
                setHasRecordedPlay(true);
              }
            })
            .catch((error) => {
              console.error('Auto-play failed:', error);
              setAutoplayBlocked(true);
              setShouldAutoPlay(false);
            });
        } else {
          // If not ready, wait a bit and try again
          setTimeout(attemptAutoPlay, 100);
        }
      };
      
      attemptAutoPlay();
    }
  }, [shouldAutoPlay, currentSongIndex, isPlaying, startPlayTracking, currentSong.id, hasRecordedPlay]);

  const [isToggling, setIsToggling] = React.useState(false);
  
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || fileAvailable === false || isToggling) return;
    
    setIsToggling(true);
    
    // Mark that user has interacted with the player
    setHasUserInteracted(true);
    
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
        setAudioError(null);
        // Start play tracking when manually starting
        if (!hasRecordedPlay) {
          console.log('▶️ Manual play: Starting play tracking for:', currentSong.title);
          startPlayTracking(currentSong.id);
          setHasRecordedPlay(true);
        }
      } catch (e) {
        console.error('Audio play failed:', e);
        setAutoplayBlocked(true);
        setAudioError('Autoplay blocked by browser. Please click play to start.');
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      // End play tracking when manually pausing
      if (hasRecordedPlay) {
        endPlayTracking(currentSong.id, duration);
        setHasRecordedPlay(false);
      }
    }
    
    setTimeout(() => setIsToggling(false), 200);
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.src = ''; // Clear the source to ensure no further playback
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const retryFileLoad = () => {
    setRetryCount(0);
    setShowLyricsOnly(false);
    // Trigger re-check by updating the effect dependency
    const currentSrc = currentSong.src;
    setFileAvailable(null);
    // Force a re-render to trigger the effect
    setTimeout(() => {
      // This will trigger the useEffect again
    }, 100);
  };

  const onSeek = (vals: number[]) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const pct = vals[0];
    const newTime = (pct / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(pct);
  };

  const onSongChange = (songId: string) => {
    const songIndex = SONGS.findIndex(s => s.id === songId);
    if (songIndex !== -1) {
      // Stop current audio before changing songs
      const currentAudio = audioRef.current;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setIsPlaying(false);
      }
      setCurrentSongIndex(songIndex);
    }
  };

  const goToPreviousSong = () => {
    setHasUserInteracted(true);
    const wasPlaying = isPlaying;
    const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : SONGS.length - 1;
    setCurrentSongIndex(newIndex);
    
    // Auto-play if currently playing and user has interacted
    if (wasPlaying && hasUserInteracted) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => setAutoplayBlocked(true));
        }
      }, 100);
    }
  };

  const goToNextSong = () => {
    setHasUserInteracted(true);
    const wasPlaying = isPlaying;
    const newIndex = currentSongIndex < SONGS.length - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(newIndex);
    
    // Auto-play if currently playing and user has interacted
    if (wasPlaying && hasUserInteracted) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => setAutoplayBlocked(true));
        }
      }, 100);
    }
  };

  // Simplified playback mode - just toggle playlist mode
  const togglePlaylistMode = () => {
    updateActivity();
    if (isPlaylistMode) {
      setIsPlaylistMode(false);
    } else {
      setIsPlaylistMode(true);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-card/95 backdrop-blur-md text-card-foreground shadow-lg border-b border-border/20">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          {/* Banner Layout */}
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Song Selector */}
            <Select value={currentSong.id} onValueChange={onSongChange}>
              <SelectTrigger className="w-[180px] sm:w-[200px] md:w-[280px] lg:w-[400px] bg-background border-border/40 shadow-sm">
                <SelectValue placeholder="Select a song" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg z-[100] w-[320px] sm:w-[400px] md:w-[500px] lg:w-[600px] max-h-[300px] overflow-y-auto">
                {SONGS.map((song) => (
                  <SelectItem key={song.id} value={song.id} className="bg-background hover:bg-muted/80 focus:bg-muted/80">
                    <div className="flex items-center gap-2 w-full">
                      <img 
                        src={song.coverArt} 
                        alt={`${song.title} cover`} 
                        className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs sm:text-sm truncate">{song.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                className="inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors h-9 w-9 sm:h-9 sm:w-9 touch-manipulation"
                aria-label="Previous Song"
                onClick={goToPreviousSong}
              >
                <SkipBack size={16} />
              </button>

              <button
                className={`inline-flex items-center justify-center rounded-md border transition-colors h-10 w-10 sm:h-10 sm:w-10 touch-manipulation ${
                  fileAvailable === false 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlay}
                disabled={fileAvailable === false || isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin border-2 border-primary-foreground border-t-transparent rounded-full w-4 h-4" />
                ) : isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} />
                )}
              </button>

              <button
                className="inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors h-9 w-9 sm:h-9 sm:w-9 touch-manipulation"
                aria-label="Next Song"
                onClick={goToNextSong}
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Progress Section */}
            <div className="flex-1 max-w-xs min-w-0 hidden md:block">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider 
                value={[progress]} 
                max={100} 
                step={0.1} 
                onValueChange={onSeek} 
                aria-label="Seek"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isMobile && (
                <>
                  <Button 
                    variant={isPlaylistMode ? "default" : "outline"}
                    size="sm" 
                    onClick={togglePlaylistMode}
                    title={isPlaylistMode ? "Stop playlist mode" : "Start playlist mode"}
                    aria-label={isPlaylistMode ? "Stop playlist mode" : "Start playlist mode"}
                  >
                    <ArrowRight size={14} />
                  </Button>

                  <Button variant="secondary" size="sm" asChild>
                    <a href={currentSong.src} download aria-label="Download MP3">
                      <Download size={14} />
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="md:hidden mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider 
              value={[progress]} 
              max={100} 
              step={0.1} 
              onValueChange={onSeek} 
              aria-label="Seek"
              className="touch-manipulation"
            />
          </div>

          {/* Play Tracking Indicator */}
          <div className="mt-2">
            <PlayTrackingIndicator 
              isTracking={hasRecordedPlay}
              songTitle={currentSong.title}
              currentTime={currentTime}
              isPlaying={isPlaying}
            />
          </div>

          {/* Loading Feedback */}
          <div className="mt-2">
            <LoadingFeedback
              isLoading={isLoading}
              fileAvailable={fileAvailable}
              audioError={audioError}
              songTitle={currentSong.title}
              retryCount={retryCount}
            />
          </div>

          {/* Status Messages - Only show if loading feedback isn't already showing */}
          {!isLoading && !audioError && !autoplayBlocked && (
            <div className="mt-2 space-y-1">
              {/* Additional status messages can go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export both the component and the hook data for context
export { SONGS };
export type { Song };

export default AudioPlayer;
