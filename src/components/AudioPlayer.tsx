import React from "react";
import { Play, Pause, StopCircle, Download, Music, SkipBack, SkipForward, Repeat, Repeat1, ArrowRight } from "lucide-react";
import { useAudioPlayer, Song } from "@/hooks/useAudioPlayer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLine } from "@/components/SynchronizedLyrics";
// PlayTrackingIndicator removed - tracking continues in background

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
import bcCoastCatalystCover from '/lovable-uploads/429a3cb8-3ffb-40db-874a-5829a6a083bd.png';


// Supabase Storage URLs for audio files
const SUPABASE_URL = "https://oojckbecymzrrdtvcmqi.supabase.co";
const getAudioUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/audio-files/${encodeURIComponent(filename)}`;

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
      { time: 0, text: "(Verse 1)" },
      { time: 3, text: "In a digital realm where dreams take flight," },
      { time: 7, text: "Lives Mr. Pixel Wizard, master of light." },
      { time: 11, text: "From Vancouver's AI community so bright," },
      { time: 15, text: "He weaves tales with VanAI, pure delight." },
      { time: 19, text: "" },
      { time: 20, text: "No more heavy cameras, no endless crews," },
      { time: 24, text: "Just prompts and pixels, breaking the news." },
      { time: 28, text: "Grammy nods whisper in his ear," },
      { time: 32, text: "But now he's conjuring worlds without fear." },
      { time: 36, text: "" },
      { time: 38, text: "(Chorus)" },
      { time: 40, text: "Oh, Mr. Pixel Wizard, storyteller bold," },
      { time: 44, text: "With AI as your wand, turning ideas to gold." },
      { time: 48, text: "Filmmaker's heart in a virtual hold," },
      { time: 52, text: "Creating art where the future's untold." },
      { time: 56, text: "Pixels dance, stories ignite," },
      { time: 60, text: "In the glow of the screen, under moonlight." },
      { time: 64, text: "Mr. Pixel Wizard, let the magic unfold!" },
      { time: 68, text: "" },
      { time: 70, text: "(Verse 2)" },
      { time: 72, text: "From scripts that sparkle to shots that stun," },
      { time: 76, text: "AI whispers secrets, the work's just begun." },
      { time: 80, text: "In Vancouver's hub, where innovators run," },
      { time: 84, text: "VanAI sparks the symphony's spun." },
      { time: 88, text: "" },
      { time: 90, text: "No code to crack, no barriers high," },
      { time: 94, text: "Conversational spells make the visions fly." },
      { time: 98, text: "Previs trailers, extras digital and sly," },
      { time: 102, text: "Music videos born under AI sky." },
      { time: 106, text: "" },
      { time: 108, text: "(Bridge)" },
      { time: 110, text: "He breaks down budgets, defies the cost," },
      { time: 114, text: "Democratizes dreams that once were lost." },
      { time: 118, text: "From analog tapes to digital frost," },
      { time: 122, text: "Now full features rise, no treasures exhaust." },
      { time: 126, text: "A wizard's journey, from VHS past," },
      { time: 130, text: "To Vancouver's AI empires, built to last." },
      { time: 134, text: "" },
      { time: 136, text: "(Chorus)" },
      { time: 138, text: "Oh, Mr. Pixel Wizard, storyteller bold," },
      { time: 142, text: "With AI as your wand, turning ideas to gold." },
      { time: 146, text: "Filmmaker's heart in a virtual hold," },
      { time: 150, text: "Creating art where the future's untold." },
      { time: 154, text: "Pixels dance, stories ignite," },
      { time: 158, text: "In the glow of the screen, under moonlight." },
      { time: 162, text: "Mr. Pixel Wizard, let the magic unfold!" },
      { time: 166, text: "" },
      { time: 168, text: "(Outro)" },
      { time: 170, text: "In the pixel kingdom, he's king of the art," },
      { time: 174, text: "Storyteller supreme, with a tech-savvy heart." },
      { time: 178, text: "From Vancouver's AI community, forever you'll start," },
      { time: 182, text: "New worlds with VanAI, a true work of heart." }
    ] as LyricLine[]
  },
  {
    id: "dr-patrick",
    title: "Dr. Patrick Parra Pennefather",
    artist: "UBC AI Orchestra",
    src: getAudioUrl("Dr. Patrick Parra Pennefather.mp3"),
    coverArt: drPatrickCover,
    lyrics: [
      { time: 0, text: "From the vibrant halls of UBC so grand," },
      { time: 4, text: "Dr. Patrick Parra Pennefather takes his stand." },
      { time: 8, text: "Within the Faculty of Arts, he led the way," },
      { time: 12, text: "To the Emerging Media Lab, where innovations play." },
      { time: 16, text: "" },
      { time: 18, text: "Sound designer, composer, disruptor true," },
      { time: 22, text: "Mentoring minds in XR, making dreams anew." },
      { time: 26, text: "Now he's journeyed to the AI Community's light," },
      { time: 30, text: "Inspiring all with wisdom, burning bright." },
      { time: 34, text: "" },
      { time: 36, text: "(Chorus)" },
      { time: 38, text: "Oh, Dr. Patrick Parra Pennefather, visionary bold," },
      { time: 42, text: "From UBC's embrace to AI worlds untold." },
      { time: 46, text: "With tech as your ally, igniting the fight," },
      { time: 50, text: "Emerging Media roots, now AI's delight." },
      { time: 54, text: "" },
      { time: 56, text: "There is an AI for that, he inspires with glee," },
      { time: 60, text: "Turning sound to stories, setting spirits free." },
      { time: 64, text: "Dr. Parra Pennefather, let the magic ignite!" },
      { time: 68, text: "" },
      { time: 70, text: "(Verse 2)" },
      { time: 72, text: "Fun Palace carnivals in mixed realities bloom," },
      { time: 76, text: "Immersive soundscapes chasing away the gloom." },
      { time: 80, text: "Virtual anatomy labs, learning redefined," },
      { time: 84, text: "AI collaborations, boundaries left behind." },
      { time: 88, text: "" },
      { time: 90, text: "No silos to hinder, just bridges he builds," },
      { time: 94, text: "Interdisciplinary wonders, with creativity filled." },
      { time: 98, text: "From theatre echoes to digital roars," },
      { time: 102, text: "He composes the future, opening new doors." },
      { time: 106, text: "" },
      { time: 108, text: "(Bridge)" },
      { time: 110, text: "He came from UBC to the AI Community's call," },
      { time: 114, text: "Defying old norms, embracing it all." },
      { time: 118, text: "Project-based journeys for the inspired crew," },
      { time: 122, text: "From analog tapes to AI's endless view." },
      { time: 126, text: "" },
      { time: 128, text: "A connector's path, from notes to code's grace," },
      { time: 132, text: "Inspiring us forward, in this emerging space." },
      { time: 136, text: "" },
      { time: 138, text: "(Chorus)" },
      { time: 140, text: "Oh, Dr. Patrick Parra Pennefather, visionary bold," },
      { time: 144, text: "From UBC's embrace to AI worlds untold." },
      { time: 148, text: "With tech as your ally, igniting the fight," },
      { time: 152, text: "Emerging Media roots, now AI's delight." },
      { time: 156, text: "" },
      { time: 158, text: "There is an AI for that, he inspires with glee," },
      { time: 162, text: "Turning sound to stories, setting spirits free." },
      { time: 166, text: "Dr. Parra Pennefather, let the magic ignite!" },
      { time: 170, text: "" },
      { time: 172, text: "(Outro)" },
      { time: 174, text: "In the realm of media, he's the sound sorcerer king," },
      { time: 178, text: "Innovator eternal, with AI on wing." },
      { time: 182, text: "Dr. Patrick Parra Pennefather, from UBC you'll inspire," },
      { time: 186, text: "New worlds in the AI Community, lifting us higher." }
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
      // Verse 1
      { time: 0, text: "I'm Carol Anne Hilton, with a sparkle and a plan," },
      { time: 4, text: "Hesquiaht roots run deep, from Ahousaht and Makah land." },
      { time: 8, text: "Indigenomics rising, AI hummin' like a band," },
      { time: 12, text: "Blending ancient wisdom with tech in my hand." },
      { time: 16, text: "" },
      { time: 18, text: "Numbers with a heartbeat, policy with a grin," },
      { time: 22, text: "Economic empowerment, let the journey begin—" },
      { time: 26, text: "Who wants to play Indigenomics? Come on in!" },
      { time: 30, text: "" },
      
      // Chorus
      { time: 32, text: "Oh, Indigenomics, take a seat at the table so grand," },
      { time: 36, text: "Relationships weaving, stewardship across the land." },
      { time: 40, text: "Sovereign data dancing, stories in the code," },
      { time: 44, text: "Future's bright and bold on this Indigenous road." },
      { time: 48, text: "" },
      { time: 50, text: "Care for all, commerce with heart," },
      { time: 54, text: "Indigenomics AI, that's where we start—" },
      { time: 58, text: "Everybody sing, let the movement ignite!" },
      { time: 62, text: "" },
      
      // Verse 2
      { time: 64, text: "Land says \"hello,\" we answer \"we see you,\"" },
      { time: 68, text: "Value in our stories, not just revenue." },
      { time: 72, text: "Sovereign data governance keepin' perfect time," },
      { time: 76, text: "Dashboards wink-wink, lookin' mighty fine." },
      { time: 80, text: "" },
      { time: 82, text: "From boardrooms to communities, breaking old chains," },
      { time: 86, text: "Indigenous economies flowing like rains." },
      { time: 90, text: "AI tools empowering, voices amplified," },
      { time: 94, text: "In the circle of growth, no one's left behind." },
      { time: 98, text: "" },
      
      // Chorus
      { time: 100, text: "Oh, Indigenomics, take a seat at the table so grand," },
      { time: 104, text: "Relationships weaving, stewardship across the land." },
      { time: 108, text: "Sovereign data dancing, stories in the code," },
      { time: 112, text: "Future's bright and bold on this Indigenous road." },
      { time: 116, text: "" },
      { time: 118, text: "Care for all, commerce with heart," },
      { time: 122, text: "Indigenomics AI, that's where we start—" },
      { time: 126, text: "Everybody sing, let the movement ignite!" },
      { time: 130, text: "" },
      
      // Verse 3
      { time: 132, text: "Scoot up a chair, make room for the crew," },
      { time: 136, text: "We braid care and commerce like we always do." },
      { time: 140, text: "Future in good hands, bright as cedar rings," },
      { time: 144, text: "Books like \"Taking a Seat,\" where the truth sings." },
      { time: 148, text: "" },
      { time: 150, text: "Global Centre calling, Institute leading the way," },
      { time: 154, text: "Economic liberation, day by day." },
      { time: 158, text: "Who wants to play Indigenomics? Everybody sings!" },
      { time: 162, text: "" },
      
      // Bridge
      { time: 164, text: "From Hesquiaht shores to the world's wide stage," },
      { time: 168, text: "I'm Carol Anne, turning the page." },
      { time: 172, text: "No more margins, we're center and strong," },
      { time: 176, text: "Indigenomics AI, where we all belong." },
      { time: 180, text: "" },
      { time: 182, text: "Multigenerational dreams, resources in trust," },
      { time: 186, text: "Building empires from the ground up, we must." },
      { time: 190, text: "Join the rise, feel the power unfold," },
      { time: 194, text: "Indigenous futures, in stories retold." },
      { time: 198, text: "" },
      
      // Final Chorus
      { time: 200, text: "Oh, Indigenomics, take a seat at the table so grand," },
      { time: 204, text: "Relationships weaving, stewardship across the land." },
      { time: 208, text: "Sovereign data dancing, stories in the code," },
      { time: 212, text: "Future's bright and bold on this Indigenous road." },
      { time: 216, text: "" },
      { time: 218, text: "Care for all, commerce with heart," },
      { time: 222, text: "Indigenomics AI, that's where we start—" },
      { time: 226, text: "Everybody sing, let the movement ignite!" },
      { time: 230, text: "" },
      
      // Outro
      { time: 232, text: "I'm Carol Anne Hilton, with vision so clear," },
      { time: 236, text: "Indigenomics forever, drawing us near." },
      { time: 240, text: "Who wants to play? The invitation's for you," },
      { time: 244, text: "In this economic dance, we'll see it through." }
    ] as LyricLine[]
  },
  {
    id: "lalala-ai-dilemma",
    title: "Lalala AI Dilemma",
    artist: "Matthew & Aliza Shwartzman",
    src: getAudioUrl("Lalala AI Dilemma.mp3"),
    coverArt: lalalaAiDilemmaCover,
    lyrics: [
      { time: 0, text: "Yo, I'm Matthew Schwartzman, fresh outta high school grind" },
      { time: 4, text: "Vancouver AI scene got my mind on fire, one of a kind" },
      { time: 8, text: "Podcastin' on Teen2Life, talkin' rebels who win" },
      { time: 12, text: "Non-traditional paths, where the real hustle begins" },
      { time: 16, text: "But uni's callin', or is it? Feels like a trap in the system" },
      { time: 20, text: "AI's my jam, codin' futures, why waste time listenin'?" },
      { time: 24, text: "Uncertain tomorrow, rebel heart beatin' fast" },
      { time: 28, text: "New gen risin', breakin' chains from the past" },
      { time: 32, text: "(Chorus)" },
      { time: 34, text: "All my friends tell me not to go to school" },
      { time: 38, text: "Lalala, lalala, play it cool" },
      { time: 42, text: "AI dreams poppin', no need for that rule" },
      { time: 46, text: "Lalala, lalala, I'm no fool" },
      { time: 50, text: "(Verse 1)" },
      { time: 52, text: "Doubts in my head, like should I enroll or nah?" },
      { time: 56, text: "Degrees collect dust while AI's blowin' up, raw" },
      { time: 60, text: "68% already fear job displacement's bite" },
      { time: 64, text: "Gettin' a degree only to be displaced overnight?" },
      { time: 68, text: "Hostin' AI meetups in Surrey, with Ryv and the crew" },
      { time: 72, text: "Hustlin' in sales right now, cash stackin' true" },
      { time: 76, text: "Think that's enough money, no uni debt blues" },
      { time: 80, text: "Vancouver's buzzin', what uni gonna do?" },
      { time: 84, text: "Future's foggy, jobs shiftin' in the wind" },
      { time: 88, text: "Rebel against the norm, where do I begin?" },
      { time: 92, text: "Love the tech, the hacks, the Kris Krug community vibe" },
      { time: 96, text: "But pressure's mountin', gotta decide my tribe" },
      { time: 100, text: "(Verse 2)" },
      { time: 102, text: "My mentor Dean Shev said to me this: 'Hey kiddo, let me mentor on this'" },
      { time: 106, text: "I'm too old to be young, young to be old" },
      { time: 110, text: "Three degrees under his belt, two masters bold" },
      { time: 114, text: "Harvard exchange opened doors untold" },
      { time: 118, text: "Sat with the big shots, million-a-month crew at the table" },
      { time: 122, text: "AI strategy leader, healthcare fables, keepin' it stable" },
      { time: 126, text: "But listen up, Matthew, uni's not just a chore—it's prestige" },
      { time: 130, text: "A social elevator to soar" },
      { time: 134, text: "Not 'bout raw knowledge, it's the lift to the prime" },
      { time: 138, text: "Investment in networks, stackin' skills over time" },
      { time: 142, text: "Make friends for life, screw up and learn the game" },
      { time: 146, text: "Fall in love with a girl that breaks your heart, feel the flame" },
      { time: 150, text: "Safe space to grow, ignite that inner flame" },
      { time: 154, text: "(Chorus)" },
      { time: 156, text: "Все мои друзья говорят мне не ходить в школу" },
      { time: 160, text: "Lalala, lalala, будь крутым" },
      { time: 164, text: "AI dreams poppin', no need for that rule" },
      { time: 168, text: "Lalala, lalala, я не дурак" },
      { time: 172, text: "(Bridge)" },
      { time: 174, text: "Questions swirlin', doubts in the night" },
      { time: 178, text: "Uni or straight to AI fights?" },
      { time: 182, text: "Dean told me, 'Trust me, young gun, I've walked the line'" },
      { time: 186, text: "Degree's your armor, makes the climb fine" },
      { time: 190, text: "Rebel soul, uncertain fate" },
      { time: 194, text: "New gen pushin', can't wait" },
      { time: 198, text: "He said, 'Friends, mistakes, growth in the hall'" },
      { time: 202, text: "Safe haven learnin', standin' tall" },
      { time: 206, text: "(Outro Verse)" },
      { time: 208, text: "Maybe Dean's right, blend the old with the new" },
      { time: 212, text: "AI passion burnin', uni could be the glue" },
      { time: 216, text: "Vancouver's callin', community strong and true" },
      { time: 220, text: "Matthew Schwartzman risin', whatever I do" },
      { time: 224, text: "Indecisive no more, rebel with a plan" },
      { time: 228, text: "New generation flexin', takin' a stand" },
      { time: 232, text: "(Chorus Fade)" },
      { time: 234, text: "All my friends tell me not to go to school" },
      { time: 238, text: "Lalala, lalala, but now I'm cool" },
      { time: 242, text: "Будущее мое, ломая все правила" },
      { time: 246, text: "Lalala, lalala, AI топливо" },
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
      // Male Lead (Narrator) - Verse 1
      { time: 0, text: "In the halls of Victoria, where the budgets align," },
      { time: 4, text: "Brenda Bailey takes the helm, with a force so divine." },
      { time: 8, text: "From Vancouver-False Creek, she rose to the fight," },
      { time: 12, text: "Minister of Finance, balancing dark and light." },
      { time: 16, text: "" },
      { time: 18, text: "She saw Star Wars first, dressed as Leia so bold," },
      { time: 22, text: "With buns in her hair, a story retold." },
      { time: 26, text: "Now she's wielding the ledger like a lightsaber bright," },
      { time: 30, text: "Cutting through deficits, making everything right." },
      { time: 34, text: "" },
      
      // Chorus (Both or Group)
      { time: 36, text: "Oh, Brenda, Brenda, Jedi of the coin," },
      { time: 40, text: "May the Force be with your fiscal join!" },
      { time: 44, text: "From JEDI to Finance, you're leading the way," },
      { time: 48, text: "Happy Star Wars Day, every single May!" },
      { time: 52, text: "" },
      { time: 54, text: "Balancing books like the Force in the stars," },
      { time: 58, text: "Against the Empire of debt, you're the czar." },
      { time: 62, text: "Brenda Bailey, our hero so grand," },
      { time: 66, text: "Minister of might in this BC land!" },
      { time: 70, text: "" },
      
      // Female Lead (Brenda) - Verse 2
      { time: 72, text: "I've journeyed from tech, founding paths of my own," },
      { time: 76, text: "To the cabinet table, where the real power's grown." },
      { time: 80, text: "Appointed in November, twenty-twenty-four's call," },
      { time: 84, text: "I swapped innovation for the fiscal hall." },
      { time: 88, text: "" },
      { time: 90, text: "With Yoda's wisdom and Leia's fire in my veins," },
      { time: 94, text: "I craft the policies, breaking economic chains." },
      { time: 98, text: "No Sith inflation will darken my sight," },
      { time: 102, text: "I'll fight for the people, from morning till night." },
      { time: 106, text: "" },
      
      // Chorus (Both or Group)
      { time: 108, text: "Oh, Brenda, Brenda, Jedi of the coin," },
      { time: 112, text: "May the Force be with your fiscal join!" },
      { time: 116, text: "From JEDI to Finance, you're leading the way," },
      { time: 120, text: "Happy Star Wars Day, every single May!" },
      { time: 124, text: "" },
      { time: 126, text: "Balancing books like the Force in the stars," },
      { time: 130, text: "Against the Empire of debt, you're the czar." },
      { time: 134, text: "Brenda Bailey, our hero so grand," },
      { time: 138, text: "Minister of might in this BC land!" },
      { time: 142, text: "" },
      
      // Male Lead (Narrator) - Bridge
      { time: 144, text: "No dark side temptation can sway her true path," },
      { time: 148, text: "She audits the shadows, masters the math." },
      { time: 152, text: "With Percy Jackson nods and Star Wars at heart," },
      { time: 156, text: "She's building tomorrow, playing her part." },
      { time: 160, text: "Dressed up for the cons, JEDI team by her side," },
      { time: 164, text: "From LinkedIn to legislature, she takes it in stride!" },
      { time: 168, text: "" },
      
      // Female Lead (Brenda) - Bridge Response
      { time: 170, text: "Yes, I've faced the storms, the deficits deep," },
      { time: 174, text: "But with rebel spirit, promises I keep." },
      { time: 178, text: "For families and futures, I'll stand tall and true," },
      { time: 182, text: "In this galaxy of governance, I'll see us through." },
      { time: 186, text: "May the Force guide us all in the fight," },
      { time: 190, text: "For a brighter BC, shining so bright!" },
      { time: 194, text: "" },
      
      // Final Chorus (Both, Fading Out)
      { time: 196, text: "Oh, Brenda, Brenda, master of the game," },
      { time: 200, text: "In the galaxy of finance, forever your name!" },
      { time: 204, text: "May the Force guide your every decree," },
      { time: 208, text: "Brenda Bailey, the legend of BC!" },
      { time: 212, text: "" }
    ] as LyricLine[]
  },
  {
    id: "mac",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Ziggy Minddust",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: macCover,
    lyrics: [
      // Verse 1
      { time: 0, text: "In Vancouver's AI scene, where ideas collide" },
      { time: 5, text: "Rises MAC, the working group, with curiosity as guide" },
      { time: 10, text: "Mind, AI, & Consciousness, that's the name they bear" },
      { time: 15, text: "Diving deep into questions, beyond the surface layer" },
      { time: 20, text: "What sets human smarts apart from machines so sly?" },
      { time: 25, text: "How do we grasp consciousness, under the endless sky?" },
      { time: 30, text: "From hand-waving chit-chat to papers profound" },
      { time: 35, text: "MAC gathers thinkers, where true insights are found" },
      
      // Chorus
      { time: 40, text: "Oh, MAC, Mind, AI, & Consciousness bold" },
      { time: 45, text: "Unraveling mysteries, in stories untold" },
      { time: 50, text: "Reading through the syllabus, two hours at a time" },
      { time: 55, text: "Exploring the frontiers, where thoughts intertwine" },
      { time: 60, text: "What makes us human in this digital age?" },
      { time: 65, text: "AI's rise challenges, turning the page" },
      { time: 70, text: "MAC, light the way, let the wisdom unfold!" },
      
      // Verse 2
      { time: 75, text: "Syllabus stacked with readings that challenge the mind" },
      { time: 80, text: "Philosophers, scientists, leaving no stone behind" },
      { time: 85, text: "Debates on intelligence, artificial and real" },
      { time: 90, text: "Consciousness puzzles, what do we feel?" },
      { time: 95, text: "In Vancouver's hub, innovators unite" },
      { time: 100, text: "Bridging the gaps in the dead of night" },
      { time: 105, text: "No more vague notions, it's rigorous quest" },
      { time: 110, text: "MAC leads the charge, putting theories to test" },
      
      // Bridge
      { time: 115, text: "They stop the hand-waving, dive into the core" },
      { time: 120, text: "Sessions that spark, opening every door" },
      { time: 125, text: "From neural networks to the soul's deep call" },
      { time: 130, text: "Questioning everything, breaking down walls" },
      { time: 135, text: "A community forged in AI's bright flame" },
      { time: 140, text: "Consciousness awakened, forever changed" },
      
      // Chorus (repeat)
      { time: 145, text: "Oh, MAC, Mind, AI, & Consciousness bold" },
      { time: 150, text: "Unraveling mysteries, in stories untold" },
      { time: 155, text: "Reading through the syllabus, two hours at a time" },
      { time: 160, text: "Exploring the frontiers, where thoughts intertwine" },
      { time: 165, text: "What makes us human in this digital age?" },
      { time: 170, text: "AI's rise challenges, turning the page" },
      { time: 175, text: "MAC, light the way, let the wisdom unfold!" },
      
      // Outro
      { time: 180, text: "In the heart of Vancouver, MAC stands tall" },
      { time: 185, text: "Mind, AI, Consciousness, answering the call" },
      { time: 190, text: "Inspiring futures, with every paper turned" },
      { time: 195, text: "A working group eternal, where knowledge is earned" }
    ] as LyricLine[]
  },
  {
    id: "darren-ai-struck",
    title: "AI struck! Data's thunder roar!",
    artist: "Darren Nicholls",
    src: getAudioUrl("Darren AI Struck.mp3"),
    coverArt: "/lovable-uploads/cf89c28f-23f5-4188-a5aa-e50f28daa5c2.png",
    lyrics: [
      // Verse 1
      { time: 0, text: "I was codin' sites back in the .com days" },
      { time: 4, text: "University kid with fire in my gaze" },
      { time: 8, text: "Dot-com boom, crash and burn, I rode the wave" },
      { time: 12, text: "Built empires high, then watched 'em cave" },
      { time: 16, text: "Became a CEO, suits and ties so tight" },
      { time: 20, text: "But life's a storm, hittin' day and night" },
      { time: 24, text: "Father to my kids, watchin' 'em grow tall" },
      { time: 28, text: "Grandpa now, answerin' the call" },
      
      // Chorus
      { time: 32, text: "AI struck! Yeah, I felt the boom" },
      { time: 36, text: "Tech's changin' lives, fillin' up the room" },
      { time: 40, text: "Adopt or embrace, or you'll perish away" },
      { time: 44, text: "Old wolf howlin', AI's here to stay!" },
      { time: 48, text: "AI struck! Data's thunder roar" },
      { time: 52, text: "From the gym to the green, I'm cravin' more" },
      { time: 56, text: "Family man, CEO, now spinnin' companies new" },
      { time: 60, text: "In the AI community, that's where I breakthrough!" },
      
      // Verse 2
      { time: 64, text: "Golfin' on the greens, pumpin' iron at the gym" },
      { time: 68, text: "Healthy life's my ride, keepin' body trim" },
      { time: 72, text: "Bought a camper van, hit the road this summer heat" },
      { time: 76, text: "Campfires burnin', stars above my feet" },
      { time: 80, text: "But AI's callin', droppin' truth bombs loud" },
      { time: 84, text: "Newsletter blastin', Data-guy.ai proud" },
      { time: 88, text: "Hundreds subscribin', hangin' on my word" },
      { time: 92, text: "Old dog's sniffin' change, the future's stirred" },
      
      // Chorus
      { time: 96, text: "AI struck! Yeah, I felt the boom" },
      { time: 100, text: "Tech's changin' lives, fillin' up the room" },
      { time: 104, text: "Adopt or embrace, or you'll perish away" },
      { time: 108, text: "Old wolf howlin', AI's here to stay!" },
      { time: 112, text: "AI struck! Data's thunder roar" },
      { time: 116, text: "From the gym to the green, I'm cravin' more" },
      { time: 120, text: "Family man, CEO, now spinnin' companies new VHT.ai, Bizzer.ai" },
      { time: 124, text: "In the AI community, that's where I breakthrough!" },
      
      // Bridge
      { time: 128, text: "Been a long road, from crashes to kids' first cries" },
      { time: 132, text: "Tech booms come and go, under stormy skies" },
      { time: 136, text: "But this AI wave? It's the biggest yet" },
      { time: 140, text: "Father, golfer, coder – no regrets" },
      { time: 144, text: "Spun off two companies, thrivin' in the scene" },
      { time: 148, text: "Vancouver's callin', livin' the dream" },
      { time: 152, text: "Embrace the change, feel the power surge" },
      { time: 156, text: "Or fade away – that's the edge we verge!" },
      
      // Final Chorus
      { time: 160, text: "AI struck! Yeah, I felt the boom" },
      { time: 164, text: "Tech's changin' lives, fillin' up the room" },
      { time: 168, text: "Adopt or embrace, or you'll perish away" },
      { time: 172, text: "Old wolf howlin', AI's here to stay!" },
      { time: 176, text: "AI struck! Data's thunder roar" },
      { time: 180, text: "From the gym to the green, I'm cravin' more" },
      { time: 184, text: "Family man, CEO, now spinnin' companies new VHT.ai, Bizzer.ai" },
      { time: 188, text: "In the AI community, that's where I breakthrough!" },
      
      // Outro
      { time: 192, text: "AI struck... yeah, struck me down" },
      { time: 196, text: "But I'm risin' up, ownin' this town" },
      { time: 200, text: "Darren Nicholls, ridin' the storm" },
      { time: 204, text: "AI forever, keepin' it warm!" },
      { time: 208, text: "AI struck! (AI struck!)" },
      { time: 212, text: "Yeah, AI struck!" },
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
      // Verse 1
      { time: 0, text: "From the time I was fourteen, I dreamed of becoming a musician." },
      { time: 4, text: "I imagined myself playing instruments, writing songs, and sharing my music with friends." },
      { time: 8, text: "But I grew up in a family of engineers, where everything was grounded in math and logic." },
      { time: 12, text: "That environment shaped my path, and I ended up becoming a health care data analyst, and an entrepreneur." },
      { time: 16, text: "It was practical—it put food on the table and provided stability—but deep down, my passion for music never faded." },
      { time: 20, text: "" },
      
      // Pre-Verse 2
      { time: 22, text: "My name is Dean Shev, but friends call me Chazz." },
      { time: 24, text: "" },
      
      // Verse 2  
      { time: 26, text: "Then, artificial intelligence burst onto the scene, changing the world almost overnight." },
      { time: 30, text: "It brought a mix of fear and optimism." },
      { time: 34, text: "Many people worried about losing their jobs, being replaced by machines that could do things faster and more efficiently." },
      { time: 38, text: "Others saw hope in the technology, believing it could solve big problems and open up new opportunities." },
      { time: 42, text: "Amid all this, we started questioning our very existence: Who are we? What makes us conscious?" },
      { time: 46, text: "" },
      
      // Pre-Verse 3
      { time: 48, text: "What does it mean to be human?" },
      { time: 50, text: "" },
      
      // Verse 3
      { time: 52, text: "More than ever, people came together to grapple with these deep questions, seeking answers and validation from one another." },
      { time: 56, text: "That's why public surveys are becoming more powerful than ever." },
      { time: 60, text: "The data they collect shows us that we're not alone in our struggles—others are asking the same important questions too." },
      { time: 64, text: "" },
      
      // Pre-Verse 4
      { time: 66, text: "Social media posts are bursting with questions. Every new and improved AI model creates big risks and opportunities." },
      { time: 70, text: "From military robots to fake OnlyFans models—money is driving innovation, but at what price for humanity?" },
      { time: 74, text: "" },
      
      // Verse 4
      { time: 76, text: "The big question: How do we actually feel about AI and its impact on our lives?" },
      { time: 80, text: "This seems like the last frontier that separates us from perfect AI machines, the thing that truly makes us human." },
      { time: 84, text: "" },
      
      // Verse 5
      { time: 86, text: "That's why I've dedicated this project to a vision: \"Transforming Data Into Human Connection.\"" },
      { time: 90, text: "It's about turning numbers into melodies and statistics into stories." },
      { time: 94, text: "I believe that by converting dry survey data into engaging musical experiences, we can bring communities together through the universal language of music." },
      { time: 98, text: "" },
      
      // Verse 6
      { time: 100, text: "By using the collected answers from the BC AI Survey, we can gain profound insights." },
      { time: 104, text: "Not like traditional analytics that focus on cold numbers and statistics, but on emotional resonance and genuine connection." },
      { time: 108, text: "Music is the universal language of expression, generating personal and relatable experiences that touch the heart." },
      { time: 112, text: "" },
      
      // Pre-Verse 7
      { time: 114, text: "Can machines feel?" },
      { time: 116, text: "" },
      
      // Verse 7
      { time: 118, text: "Using data provided by Rivals and converting it into songs, I uncovered emotions and stories that reflect the thoughts of leaders in our Vancouver AI community who have a deep passion for these very subjects." },
      { time: 122, text: "Each leader chooses to stand strong and raise awareness of the changes and the impact that AI is having on us." },
      { time: 126, text: "From art and science, Indigenomics, to the effects on our energy and environment—these are important voices that must be shared and heard." },
      { time: 130, text: "Because without them creating awareness, we just might be too late. The risks are just too high..." },
      { time: 134, text: "" }
    ] as LyricLine[]
  },
  {
    id: "philippe-pasquier-art-hallucinations",
    title: "L'Art des Hallucinations de l'IA",
    artist: "Philippe Pasquier",
    src: getAudioUrl("L'Art des Hallucinations de l'IA.mp3"),
    coverArt: "/lovable-uploads/53a7e8c9-c967-4d3d-870c-68e228c2ff3f.png",
    lyrics: [
      { time: 0, text: "(Intro – Building synth loops, male voice whispers in French over rising arpeggios)" },
      { time: 4, text: "Je suis Philippe, dans le labo de rêves..." },
      { time: 8, text: "Hallucinations of AI, reality fades away..." },
      { time: 12, text: "" },
      { time: 14, text: "(Verse 1 – Funky bass drop, male lead raps/sings in blended French-English)" },
      { time: 16, text: "From Laval to SFU, my journey begins" },
      { time: 20, text: "PhD en IA, systems that dance" },
      { time: 24, text: "Metacreation Lab, I direct the fire" },
      { time: 28, text: "Générative art, blending real with the new" },
      { time: 32, text: "Who knew? Ancestral patterns in code" },
      { time: 36, text: "French roots in Quebec, now Vancouver's road" },
      { time: 40, text: "From music to visuals, AI takes the stage" },
      { time: 44, text: "Hallucinations bloom, turning the page" },
      { time: 48, text: "" },
      { time: 50, text: "(Chorus – Big drop: Crazy synth loops swirling up and down)" },
      { time: 52, text: "L'art des hallucinations de l'IA" },
      { time: 56, text: "Blending reality, other worlds in play" },
      { time: 60, text: "Systems I build, creative and wild" },
      { time: 64, text: "Human-machine, like a dream undefiled" },
      { time: 68, text: "Hallucinations! (Female: Hallucinations!)" },
      { time: 72, text: "Dans le chaos, je crée le feu" },
      { time: 76, text: "AI art rising, breaking through!" },
      { time: 80, text: "L'art des hallucinations... oh yeah!" },
      { time: 84, text: "" },
      { time: 86, text: "(Verse 2 – Groove intensifies, male voice deeper with French emphasis)" },
      { time: 88, text: "Interactive installs, MIDI-GPT sings" },
      { time: 92, text: "Générative sounds, what the machine brings" },
      { time: 96, text: "De la musique à la danse, AI en performance" },
      { time: 100, text: "Blurring lines, human essence in trance" },
      { time: 104, text: "I refuse to strip our humanity away" },
      { time: 108, text: "Systems for chaos, meaningful and free" },
      { time: 112, text: "From GNI to labs, provoking the spark" },
      { time: 116, text: "Digital alchemist, lighting the dark" },
      { time: 120, text: "" },
      { time: 122, text: "(Chorus – Repeat with added glitch effects)" },
      { time: 124, text: "L'art des hallucinations de l'IA" },
      { time: 128, text: "Blending reality, other worlds in play" },
      { time: 132, text: "Systems I build, creative and wild" },
      { time: 136, text: "Human-machine, like a dream undefiled" },
      { time: 140, text: "Hallucinations! (Female: Hallucinations!)" },
      { time: 144, text: "Dans le chaos, je crée le feu" },
      { time: 148, text: "AI art rising, breaking through!" },
      { time: 152, text: "L'art des hallucinations... c'est moi!" },
      { time: 156, text: "" },
      { time: 158, text: "(Bridge – Slow build: Synth loops go wild, up-down frenzy)" },
      { time: 160, text: "Part digital hacker, part cultural flame" },
      { time: 164, text: "From Quebec's wisdom to AI's game" },
      { time: 168, text: "Je tisse Indigenous keys into code's embrace" },
      { time: 172, text: "Ancestral protocols, in this digital space" },
      { time: 176, text: "Hallucinations rise, reality bends" },
      { time: 180, text: "But humanity stays, where the journey ends" },
      { time: 184, text: "(Female: Rêves... hallucinations... réalité...)" },
      { time: 188, text: "" },
      { time: 190, text: "(Outro – Final drop: Loops peak in chaotic up-down waves)" },
      { time: 192, text: "L'art des hallucinations, my life's grand quest" },
      { time: 196, text: "Philippe Pasquier, blending east and west" },
      { time: 200, text: "AI hallucinations, forever we play..." },
      { time: 204, text: "(Female: Hallucinations... l'art de l'IA...)" },
      { time: 208, text: "Fade into dreams, where realities meet..." },
      { time: 212, text: "Oh, l'art des hallucinations!" }
    ] as LyricLine[]
  },
  {
    id: "bc-coast-catalyst",
    title: "BC Coast Catalyst",
    artist: "Kassandra Linklater", 
    src: getAudioUrl("BC Coast Catalyst.mp3"),
    coverArt: "/lovable-uploads/65a91080-e861-4e4a-87d4-099d1cc015b0.png",
    lyrics: [
      // Intro
      { time: 0, text: "In the BC mist, where rain weaves dreams..." },
      { time: 4, text: "They got a fire, if you're not shapin', you're not gleamin'..." },
      { time: 8, text: "She's the spark, threading futures through her veins, don't you?" },
      { time: 12, text: "" },
      
      // Verse 1
      { time: 16, text: "On the BC Coast, they hum a prophecy," },
      { time: 20, text: "\"Vancouver's risin', code's the new alchemy.\"" },
      { time: 24, text: "She's got starlight circuits, AI in her soul, yeah you." },
      { time: 28, text: "In the cedar haze, I catch this vision clear," },
      { time: 32, text: "Worlds could collide here, she's the pioneer." },
      { time: 36, text: "Frontier Collective, conjurin' dreams, Kassandra, yeah you." },
      { time: 40, text: "" },
      
      // Pre-Chorus
      { time: 44, text: "She pitched the summit, pulled the stars to shore," },
      { time: 48, text: "Web lights blazin', billion-dollar lore." },
      { time: 52, text: "From youth envoy to global tides," },
      { time: 56, text: "She's the weaver, spinnin' code to skies." },
      { time: 60, text: "" },
      
      // Chorus
      { time: 64, text: "She's craftin' futures, ecosystems dance, wired to the core," },
      { time: 68, text: "You call her name, she whispers back, \"I need this spark to soar.\"" },
      { time: 72, text: "Somethin' keeps her electric, she's alive, she's a storm," },
      { time: 76, text: "Her hub, her hub, Vancouver's hub," },
      { time: 80, text: "(I see my city glowin' from the mist to the AI dawn.)" },
      { time: 84, text: "Her hub, her hub, her flame." },
      { time: 88, text: "" },
      
      // Verse 2
      { time: 92, text: "On the BC Coast, frontiers bloom like tides," },
      { time: 96, text: "AI and biotech, chasin' fears aside." },
      { time: 100, text: "She's the bridge, Tenacious Ventures singin', don't you?" },
      { time: 104, text: "In the neon rain, the summit carves its arc," },
      { time: 108, text: "From G20 echoes to Vancouver's spark." },
      { time: 112, text: "Civic dreamer, investin' in the night, Star Blue, yeah you." },
      { time: 116, text: "" },
      
      // Pre-Chorus 2
      { time: 120, text: "Legacy carved, from Rotary to Trade," },
      { time: 124, text: "University Confidential, futures she's laid." },
      { time: 128, text: "Top 25 fire, Justice Hack's glow," },
      { time: 132, text: "She's the current, pullin' tides to flow." },
      { time: 136, text: "" },
      
      // Chorus 2
      { time: 140, text: "She's craftin' futures, ecosystems dance, wired to the core," },
      { time: 144, text: "You call her name, she whispers back, \"I need this spark to soar.\"" },
      { time: 148, text: "Somethin' keeps her electric, she's alive, she's a storm," },
      { time: 152, text: "Her hub, her hub, Vancouver's hub," },
      { time: 156, text: "(I see my city glowin' from the mist to the AI dawn.)" },
      { time: 160, text: "Her hub, her hub, her flame." },
      { time: 164, text: "" },
      
      // Bridge
      { time: 168, text: "Ooh darlin', ooh darlin', I'm lost... in the pulse," },
      { time: 172, text: "Ooh darlin', ooh darlin', futures call..." },
      { time: 176, text: "Glidin' through YVR's glow, quantum dreams in her car," },
      { time: 180, text: "Hummin' her name... Kassandra..." },
      { time: 184, text: "" },
      
      // Outro
      { time: 188, text: "On the BC Coast, they crown their seers," },
      { time: 192, text: "But she's the one, yeah, she's the one..." },
      { time: 196, text: "Her hub, her hub, her flame..." },
      { time: 200, text: "(Vancouver's risin', AI eternal, don't you?)" }
    ] as LyricLine[]
  },
  {
    id: "smells-like-reid-spirit",
    title: "Smells Like Reid's Spirit",
    artist: "Andrew Reid",
    src: getAudioUrl("Smells Like Reid Spirit.mp3"),
    coverArt: "/lovable-uploads/4db32d20-cc6e-472e-b7eb-2386c131e5e4.png",
    lyrics: [
      { time: 0, text: "Ignite the signal, spark the new wave" },
      { time: 4, text: "Vancouver's buzzing, tech's what I crave" },
      { time: 8, text: "Innovation's fire, I carved my own track" },
      { time: 12, text: "Rival's my engine, no turning back" },
      { time: 16, text: "With AI and voice, we're shifting the game" },
      { time: 20, text: "Conversations ignite, insights fan the flame" },
      { time: 24, text: "Snowmobiles howl, rip through the frost" },
      { time: 28, text: "North Van's my pulse, where freedom's the cost" },
      { time: 32, text: "Here we are now, innovators rise!" },
      { time: 36, text: "Code the future, break the old lies!" },
      { time: 40, text: "Family's my root, my drive's burning heat" },
      { time: 44, text: "Smells like Reid's spirit, never retreat!" },
      { time: 48, text: "CrossFit at dawn, power through the grind" },
      { time: 52, text: "Data's my canvas, AI reads the mind" },
      { time: 56, text: "Mobile-first insights, we're rewriting the lore" },
      { time: 60, text: "Chat and video spark, we're opening the door" },
      { time: 64, text: "From Vision to Rival, I'm leading the fight" },
      { time: 68, text: "YPO's my crew, where dreamers unite" },
      { time: 72, text: "Engines and algorithms, racing through snow" },
      { time: 76, text: "Chasing the truth, where bold insights grow" },
      { time: 80, text: "Here we are now, innovators rise!" },
      { time: 84, text: "Code the future, break the old lies!" },
      { time: 88, text: "Family's my root, my drive's burning heat" },
      { time: 92, text: "Smells like Reid's spirit, never retreat!" },
      { time: 96, text: "Yeah, I'm fearless, yeah, I'm free" },
      { time: 100, text: "Chat and circuits, they're wired in me" },
      { time: 104, text: "No stale surveys, just a rebel's command" },
      { time: 108, text: "Built a platform, with truth in my hand" },
      { time: 112, text: "Defy the old ways, spark a new call" },
      { time: 116, text: "Rival's my fire, AI's my all!" },
      { time: 120, text: "Here we are now, innovators rise!" },
      { time: 124, text: "Code the future, break the old lies!" },
      { time: 128, text: "Family's my root, my drive's burning heat" },
      { time: 132, text: "Smells like Reid's spirit, never retreat!" },
      { time: 136, text: "A mulatto, a mosquito, my libido, yeah!" },
      { time: 140, text: "Innovation, Rival's mission, liberation, yeah!" },
      { time: 144, text: "Hey! Hey! Hey!" }
    ] as LyricLine[]
  },
  {
    id: "gabriel-george-sr-eagles-watch",
    title: "Eagle's Watch Over the Inlet",
    artist: "Gabriel George Sr.",
    src: getAudioUrl("Eagle's Watch Over the Inlet.mp3"),
    coverArt: "/lovable-uploads/248e8b56-a755-4cdf-9bd0-dfcc8af06211.png",
    lyrics: [
      { time: 0, text: "[Spoken Intro – Welcoming the Circle]" },
      { time: 10, text: "To all of you, my dear friends and family," },
      { time: 15, text: "I welcome you to this village of suh-nak," },
      { time: 20, text: "The inlet where waters whisper ancient truths." },
      { time: 25, text: "I give gratitude to the ancestors—" },
      { time: 30, text: "mus-kwee-um, skwaw-mish, and my ts-lay-wah-tooth kin." },
      { time: 35, text: "Our families have walked these lands since time out of mind," },
      { time: 40, text: "Rooted like the cedars, flowing like the tides." },
      { time: 50, text: "[Verse 1: Stories of the Changing Land]" },
      { time: 55, text: "My late uncle shared tales of the elk herds," },
      { time: 60, text: "Gathering high on Burnaby Mountain—sul-ts-munt suh-suh-nuk, we call it." },
      { time: 65, text: "They'd descend to suh-nak-w, into False Creek's embrace," },
      { time: 70, text: "Where our hunters waited, bows drawn in respect." },
      { time: 75, text: "But oh, how the land has shifted under our feet—" },
      { time: 80, text: "False Creek once stretched to Clark Avenue, up to Terminal's edge," },
      { time: 85, text: "Entering the inlet from the south at high tide, not this narrowed path." },
      { time: 90, text: "Giant cedars once pierced the sky, an ancient rainforest we sustained," },
      { time: 95, text: "For thousands of years, in harmony we remained." },
      { time: 100, text: "The land my grandfather, Chief Dan George, knew so well—" },
      { time: 105, text: "It's faded, transformed, a story we must tell." },
      { time: 115, text: "[Chorus – Eagle Song Invocation]" },
      { time: 120, text: "Kway-tal-us puk-wus, the eagle is watching over us," },
      { time: 125, text: "Flying high since time out of mind, carrying our prayers." },
      { time: 130, text: "To the ancestors, to the great spirit above," },
      { time: 135, text: "Set good intentions for your circle, for love." },
      { time: 140, text: "Hey-ya, hey-ya, the wings beat strong," },
      { time: 145, text: "Over suh-ley-l-wut, where we belong." },
      { time: 150, text: "Kway-tal-us puk-wus, watch over us all." },
      { time: 160, text: "[Verse 2: Interconnectedness and Care for the Earth]" },
      { time: 165, text: "In our language, we'd say—to... we took care of the earth," },
      { time: 170, text: "Understood our ties, our sacred interconnected worth." },
      { time: 175, text: "Respect for the ones with roots, the stones that stand still," },
      { time: 180, text: "The waters that flow, the animals with fins and will." },
      { time: 185, text: "The ones with hooves that roam, all beings in the web of life—" },
      { time: 190, text: "We lived not in isolation, but in extended family strife." },
      { time: 195, text: "Vast networks through ceremony, binding us as one," },
      { time: 200, text: "As hal-ko-may-lum people, under moon and sun." },
      { time: 205, text: "But in this modern world, connections grow thin," },
      { time: 210, text: "Siloed hearts in a rush, where do we begin?" },
      { time: 215, text: "With these new tools, this AI fire we tend," },
      { time: 220, text: "We must nurture the bonds, let divisions end." },
      { time: 230, text: "[Bridge – Spoken Reflection on Legacy and Regalia]" },
      { time: 235, text: "I'm here because of my family, the legacy they wove—" },
      { time: 240, text: "My father, Leonard George, who'd stop and pray to the eagle above." },
      { time: 245, text: "Despite the harms of residential schools, the injustices they bore," },
      { time: 250, text: "They bridged the gaps, brought people to the shore." },
      { time: 255, text: "Our regalia speaks truths—feathers from the sky, cedar from the wood," },
      { time: 260, text: "Woven robes that connect us to the spirit, as they should." },
      { time: 265, text: "The drum's animal skin echoes the heartbeat of the land," },
      { time: 270, text: "Our language holds the knowledge, root words that help us stand." },
      { time: 275, text: "It's not for show, this ceremony we hold dear—" },
      { time: 280, text: "It's for healing, for unity, in a world full of fear." },
      { time: 285, text: "We find common ground, though polarization calls," },
      { time: 290, text: "I speak from the heart, no agenda at all." },
      { time: 300, text: "[Chorus – Eagle Song Invocation]" },
      { time: 305, text: "Kway-tal-us puk-wus, the eagle is watching over us," },
      { time: 310, text: "Flying high since time out of mind, carrying our prayers." },
      { time: 315, text: "To the ancestors, to the great spirit above," },
      { time: 320, text: "Set good intentions for your circle, for love." },
      { time: 325, text: "Hey-ya, hey-ya, the wings beat strong," },
      { time: 330, text: "Over suh-ley-l-wut, where we belong." },
      { time: 335, text: "Kway-tal-us puk-wus, watch over us all." },
      { time: 345, text: "[Verse 3: A Call to the Future]" },
      { time: 350, text: "As I stand in this round room, shaped like our kohst say-lish hats," },
      { time: 355, text: "Resonant with voices, where songs find their paths." },
      { time: 360, text: "I've shared these stories month after month, not the same welcome tune," },
      { time: 365, text: "But deeper tales, new songs, under the same moon." },
      { time: 370, text: "From the eagle's watch to the changing creeks below," },
      { time: 375, text: "We thrive in community, let the connections grow." },
      { time: 380, text: "In this time of tools and tech, remember the old ways," },
      { time: 385, text: "Bridge the divides, let unity blaze." },
      { time: 395, text: "[Outro – Fading Spoken Prayer]" },
      { time: 400, text: "Thank you for listening, my friends in this circle wide," },
      { time: 405, text: "May the eagle carry our intentions, far and wide." },
      { time: 410, text: "From the inlet's edge, to the mountains' call—" },
      { time: 415, text: "We are connected, one and all." },
      { time: 420, text: "Hey-ya... hey-ya... (fade to silence)." }
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
      shouldAutoPlay,
      setShouldAutoPlay,
    } = audioPlayerHook;
  
  const [hasRecordedPlay, setHasRecordedPlay] = React.useState(false);
  const [previousSongId, setPreviousSongId] = React.useState<string | null>(null);
  
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
      
      // Auto-start playback if shouldAutoPlay is true
      if (shouldAutoPlay && hasUserInteracted) {
        setShouldAutoPlay(false); // Reset the flag
        setTimeout(() => {
          audio.play().then(() => {
            setIsPlaying(true);
            console.log('▶️ Auto-started playback after loading');
          }).catch(() => {
            console.log('Autoplay blocked');
            setAutoplayBlocked(true);
          });
        }, 100);
      }
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

  // Track previous song ID and handle song change tracking
  React.useEffect(() => {
    // End tracking for previous song if it was being tracked and a different song is now playing
    if (hasRecordedPlay && previousSongId && previousSongId !== currentSong.id) {
      console.log('🔄 Song changed: Ending play tracking for:', previousSongId, '(was playing for', Math.round(duration), 's)');
      endPlayTracking(previousSongId, duration);
      setHasRecordedPlay(false);
    }
    
    // Update the previous song ID
    setPreviousSongId(currentSong.id);
  }, [currentSongIndex, endPlayTracking, currentSong.id, hasRecordedPlay, previousSongId, duration]);

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
