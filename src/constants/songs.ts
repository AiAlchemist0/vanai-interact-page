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
      { time: 24, text: "Algorithms dance in endless streams," },
      { time: 28, text: "Where innovation meets our wildest dreams." },
      { time: 32, text: "From startups to giants, we all unite," },
      { time: 36, text: "In this digital revolution, burning bright." },
    ] as LyricLine[]
  },
  {
    id: "lionel-ringenbach",
    title: "ChatGPT: Est-ce que ma facture va exploser?",
    artist: "Lionel Ringenbach",
    src: getAudioUrl("Lionel Ringenbach.mp3"),
    coverArt: "/lovable-uploads/7f8d84c3-eb81-4f66-87be-5b024084aca2.png",
    description: `Lionel Ringenbach's "ChatGPT: Est-ce que ma facture va exploser?" addresses critical questions around AI's environmental and economic impact - themes central to the BC + AI Survey's exploration of technology's broader implications. Through his song, Lionel examines the hidden costs of AI systems, from energy consumption to infrastructure demands. Learn more about his sustainability-focused work at wattsup.tech.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "Who says AI says innovation," },
      { time: 6, text: "But will my bill cause frustration?" },
      { time: 10, text: "ChatGPT, mon ami, dis-moi la vérité," },
      { time: 14, text: "Est-ce que ma facture va exploser?" },
      { time: 18, text: "Je pose la question, dans ce monde digital," },
      { time: 22, text: "L'IA avance, mais à quel prix final?" },
      { time: 26, text: "Les serveurs tournent, l'énergie se consume," },
      { time: 30, text: "Ma facture électrique, elle s'allume!" },
      { time: 34, text: "Innovation oui, mais à quel coût?" },
      { time: 38, text: "L'environnement paie, c'est un peu fou!" },
    ] as LyricLine[]
  },
  {
    id: "kris-krug-circles",
    title: "Circles in the AI Glow",
    artist: "Kris Krüg & BC + AI Crew",
    src: getAudioUrl("Kris Krug Circles in the AI Glow.mp3"),
    coverArt: "/lovable-uploads/de844c7f-f953-4326-aba2-c4344918c873.png",
    description: `Kris Krug, the visionary founder and philosophical leader of Vancouver's AI community, this song embodies the heart of BC's AI discourse. As founder of the Vancouver AI Community, BC + AI Association, and creator of "Sandboxing AI", Kris bridges traditional media (as a National Geographic photographer) with AI innovation through his "Human++" philosophy. This piece explores deepfake technology, relationship authenticity, and the tension between human touch and code-driven art while celebrating unity in the AI era.`,
    lyrics: [
      { time: 0, text: "(Intro / Pre-Verse 1)" },
      { time: 2, text: "Humanity... yeah, that's the start..." },
      { time: 6, text: "Circles spinning in the AI glow," },
      { time: 10, text: "Data streams and dreams that flow." },
      { time: 14, text: "We build the future, line by line," },
      { time: 18, text: "In this digital age, we intertwine." },
      { time: 22, text: "Human++ philosophy, bridging the divide," },
      { time: 26, text: "National Geographic meets AI pride." },
      { time: 30, text: "Deepfake fears and authentic hearts," },
      { time: 34, text: "In circles we move, where future starts." },
    ] as LyricLine[]
  },
  {
    id: "pixel-wizard",
    title: "Mr. Pixel Wizard BC AI",
    artist: "Kevin Friel",
    src: getAudioUrl("Mr_Pixel_Wizard BC AI.mp3"),
    coverArt: "/lovable-uploads/2c251b22-3f09-4812-bc92-ad7c64062f4b.png",
    description: `Kevin Friel's "Mr. Pixel Wizard BC AI" celebrates Vancouver's AI filmmaking community and the transformative power of AI in creative industries. The song highlights how AI tools are democratizing film production, breaking down traditional barriers, and enabling artists to create without massive budgets or crews. It specifically honors the VanAI community's role in fostering innovation and collaboration among AI enthusiasts and creators in British Columbia.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 3, text: "In a digital realm where dreams take flight," },
      { time: 7, text: "Mr. Pixel Wizard casts his light." },
      { time: 11, text: "Coding spells and magic code," },
      { time: 15, text: "Guiding AI down the road." },
      { time: 19, text: "VanAI community, creators unite," },
      { time: 23, text: "Breaking barriers with pixel might." },
      { time: 27, text: "No massive budgets, no giant crew," },
      { time: 31, text: "Just AI magic, making dreams come true." },
    ] as LyricLine[]
  },
  {
    id: "dr-patrick",
    title: "Dr. Patrick Parra Pennefather",
    artist: "UBC AI Orchestra",
    src: getAudioUrl("Dr. Patrick Parra Pennefather.mp3"),
    coverArt: "/lovable-uploads/4d050983-b56d-4606-a958-1c7e2c7253e8.png",
    description: `"Dr. Patrick Parra Pennefather" by UBC AI Orchestra celebrates the remarkable journey of Dr. Patrick from his leadership role in UBC's Faculty of Arts and the Emerging Media Lab to his influential presence in Vancouver's AI community. As a sound designer, composer, and XR innovation mentor, Dr. Patrick embodies the interdisciplinary bridge between traditional media arts and cutting-edge AI applications.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "In the lab where neurons fire..." },
      { time: 6, text: "Coffee fuels the neural wire." },
      { time: 10, text: "Patterns form and thoughts align," },
      { time: 14, text: "Dreams of AI, so divine." },
      { time: 18, text: "UBC Faculty, Arts and minds," },
      { time: 22, text: "Emerging Media, future finds." },
      { time: 26, text: "Sound designer, XR guide," },
      { time: 30, text: "There is an AI, by your side." },
    ] as LyricLine[]
  },
  {
    id: "hr-macmillan",
    title: "H.R MacMillan Space Centre - Alien Abduction",
    artist: "Lorraine Lowe",
    src: getAudioUrl("H.R MacMillan Space Centre _ Alian Abduction.mp3"),
    coverArt: "/lovable-uploads/8a59c6e4-39f4-41e2-bb0d-544e22e3030a.png",
    description: `A cosmic journey through Vancouver's premier space exploration hub, where visitors encounter mysteries of the universe and tales of close encounters that challenge our understanding of what lies beyond.`,
    lyrics: [
      { time: 0, text: "(Intro)" },
      { time: 2, text: "The stars aligned that fateful night..." },
      { time: 6, text: "Alien abduction, a strange sight." },
      { time: 10, text: "H.R. MacMillan, tales untold," },
      { time: 14, text: "Mysteries in the cold." },
      { time: 18, text: "Planetarium lights, cosmic dreams," },
      { time: 22, text: "Beyond our world, nothing's as it seems." },
      { time: 26, text: "Close encounters, truth revealed," },
      { time: 30, text: "In the space centre, fate is sealed." },
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
    description: `Carol Anne Hilton's visionary anthem bridging Indigenous wisdom with AI innovation. As CEO of the Indigenomics Institute, Carol Anne champions Indigenous economic reconciliation through technology, demonstrating how AI can amplify Indigenous voices, preserve cultural knowledge, and create sustainable economic opportunities rooted in traditional values.`,
    lyrics: [
      { time: 0, text: "I'm Carol Anne Hilton, with a sparkle and a plan," },
      { time: 4, text: "Indigenomics Institute, taking a stand." },
      { time: 8, text: "Economic reconciliation, technology's call," },
      { time: 12, text: "Indigenous wisdom, embracing it all." },
      { time: 54, text: "Indigenomics AI, that's where we start—" },
      { time: 58, text: "Traditional values, with a digital heart." },
    ] as LyricLine[]
  },
  {
    id: "lalala-ai-dilemma",
    title: "Lalala AI Dilemma",
    artist: "Matthew & Aliza Shwartzman",
    src: getAudioUrl("Lalala AI Dilemma.mp3"),
    coverArt: "/lovable-uploads/7e23b796-605f-4562-927b-06daa9147648.png",
    description: `A generational anthem exploring the modern dilemma facing young people: pursue traditional university education or dive straight into the AI revolution. Matthew Schwartzman's raw narrative captures the tension between conventional paths and emerging opportunities, featuring mentorship from Dean Shev and deep connections to Vancouver's AI community.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "La la la, the algorithms sing..." },
      { time: 6, text: "Dilemmas in the AI ring." },
      { time: 10, text: "University or AI dive?" },
      { time: 14, text: "Which path keeps dreams alive?" },
      { time: 18, text: "Dean Shev mentors, wisdom shared," },
      { time: 22, text: "Traditional molds, no longer scared." },
    ] as LyricLine[]
  },
  {
    id: "brenda-bailey",
    title: "Brenda Bailey: Jedi Master of Finance",
    artist: "AI Community Orchestra",
    src: getAudioUrl("Brenda Bailey Jedi Master of Finance.mp3"),
    coverArt: "/lovable-uploads/749e260e-38aa-4528-b1a6-a4c62cc10020.png",
    description: `A tribute to BC's Finance Minister Brenda Bailey, highlighting her strategic leadership in guiding the province's AI and technology initiatives with wisdom and fiscal responsibility.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "In the halls of power, where budgets align..." },
      { time: 6, text: "Brenda Bailey stands, with force divine." },
      { time: 10, text: "Finance Minister, guiding the way," },
      { time: 14, text: "Technology strategy, day by day." },
      { time: 18, text: "Jedi wisdom, fiscal might," },
      { time: 22, text: "Leading BC into AI light." },
    ] as LyricLine[]
  },
  {
    id: "mac",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Ziggy Minddust",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: "/lovable-uploads/cc181a8b-6dad-4af6-8731-9a8cbd3ba5d0.png",
    description: `A philosophical anthem celebrating Vancouver's Mind, AI, & Consciousness (MAC) working group, performed by Ziggy Minddust (Loki Jorgenson), a prominent leader in Vancouver's AI community. This deep intellectual exploration examines the fundamental questions at the intersection of artificial intelligence and human consciousness.`,
    lyrics: [
      { time: 0, text: "(Intro)" },
      { time: 2, text: "Welcome to the frontier of mind..." },
      { time: 6, text: "Where AI and consciousness bind." },
      { time: 10, text: "Loki Jorgenson, Ziggy's call," },
      { time: 14, text: "MAC working group, exploring it all." },
      { time: 18, text: "Philosophical depths, questions deep," },
      { time: 22, text: "Consciousness secrets, ours to keep." },
    ] as LyricLine[]
  },
  {
    id: "darren-ai-struck",
    title: "AI struck! Data's thunder roar!",
    artist: "Darren Nicholls",
    src: getAudioUrl("Darren AI Struck.mp3"),
    coverArt: "/lovable-uploads/cf89c28f-23f5-4188-a5aa-e50f28daa5c2.png",
    description: `This powerful rock anthem embodies the journey of a tech veteran navigating the AI revolution. Darren Nicholls chronicles his evolution from a university coder during the dot-com boom to becoming a visionary CEO and AI community leader in Vancouver. Through companies like VHT.ai and Bizzer.ai, and his influential Data-guy.ai newsletter, Darren exemplifies the "adapt or perish" mentality that drives innovation in the BC tech ecosystem.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "University coder, dot-com days," },
      { time: 6, text: "AI struck! Data's thunder roar!" },
      { time: 10, text: "VHT.ai, Bizzer leading the way," },
      { time: 14, text: "Data-guy newsletter, every day." },
      { time: 18, text: "Adapt or perish, the motto stands," },
      { time: 22, text: "Innovation flows through these hands." },
    ] as LyricLine[]
  },
  {
    id: "dean-shev-human",
    title: "What does it mean to be human?",
    artist: "Dean Shev aka Chazz",
    src: getAudioUrl("Dean Shev What does it mean to be human.mp3"),
    coverArt: "/lovable-uploads/749e260e-38aa-4528-b1a6-a4c62cc10020.png",
    description: `A profound philosophical exploration from Dean Shev (Chazz), examining the fundamental question of human identity in the age of artificial intelligence. This introspective piece challenges listeners to consider what truly makes us human as AI becomes increasingly sophisticated.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "What does it mean to be human?" },
      { time: 6, text: "In this age of AI design," },
      { time: 10, text: "Are we more than code and circuits?" },
      { time: 14, text: "Something deeper, something divine." },
      { time: 18, text: "Dean Shev asking, Chazz reflecting," },
      { time: 22, text: "Humanity's essence, worth protecting." },
    ] as LyricLine[]
  },
  {
    id: "philippe-pasquier-art-hallucinations",
    title: "L'Art des Hallucinations de l'IA",
    artist: "Philippe Pasquier",
    src: getAudioUrl("L'Art des Hallucinations de l'IA.mp3"),
    coverArt: "/lovable-uploads/53a7e8c9-c967-4d3d-870c-68e228c2ff3f.png",
    description: `A visionary exploration of AI's creative potential from Philippe Pasquier, renowned artist and researcher in computational creativity. This French-language piece delves into the fascinating realm of AI hallucinations as a new form of digital art, blending technology with artistic expression.`,
    lyrics: [
      { time: 0, text: "Dans le laboratoire des rêves digitaux," },
      { time: 4, text: "Je suis Philippe, dans le labo de rêves..." },
      { time: 8, text: "Où l'intelligence artificielle crée," },
      { time: 12, text: "Des visions qu'elle n'a jamais vues." },
      { time: 52, text: "L'art des hallucinations de l'IA" },
      { time: 56, text: "Nouvelle forme, nouvelle voie." },
    ] as LyricLine[]
  },
  {
    id: "bc-coast-catalyst",
    title: "BC Coast Catalyst",
    artist: "Kassandra Linklater",
    src: getAudioUrl("BC Coast Catalyst.mp3"),
    coverArt: "/lovable-uploads/429a3cb8-3ffb-40db-874a-5829a6a083bd.png",
    description: `An inspiring anthem celebrating British Columbia's role as a catalyst for innovation and change. Kassandra Linklater's powerful piece captures the province's unique position as a driver of technological and social progress, from the Pacific coast to the mountain ranges.`,
    lyrics: [
      { time: 0, text: "(Verse 1)" },
      { time: 2, text: "From the Pacific shores to mountain peaks..." },
      { time: 6, text: "BC Coast Catalyst speaks." },
      { time: 10, text: "Innovation flows like ocean tides," },
      { time: 14, text: "Where technology and nature collides." },
      { time: 18, text: "Kassandra's voice, the catalyst call," },
      { time: 22, text: "British Columbia, inspiring all." },
    ] as LyricLine[]
  },
  {
    id: "smells-like-reid-spirit",
    title: "Smells Like Reid's Spirit",
    artist: "Andrew Reid",
    src: getAudioUrl("Smells Like Reid Spirit.mp3"),
    coverArt: "/lovable-uploads/81af0807-f304-42cc-88f3-989ff1413436.png",
    description: `A high-energy rock anthem celebrating Andrew Reid's distinctive approach to AI and technology. This grunge-inspired track captures the rebellious spirit of innovation that defines Reid's contributions to the Vancouver AI community.`,
    lyrics: [
      { time: 0, text: "Load up on code, bring your friends" },
      { time: 4, text: "It's fun to lose and to pretend" },
      { time: 8, text: "Reid's overboard, self-assured" },
      { time: 12, text: "Oh no, I know a dirty word" },
      { time: 40, text: "Smells like Reid's spirit (Yeah!)" },
      { time: 44, text: "Innovation's here, loud and clear!" },
    ] as LyricLine[]
  },
  {
    id: "gabriel-george-sr-eagles-watch",
    title: "Eagle's Watch Over the Inlet",
    artist: "Gabriel George Sr.",
    src: getAudioUrl("Eagle's Watch Over the Inlet.mp3"),
    coverArt: "/lovable-uploads/316c72de-0185-4987-b74f-96492d391733.png",
    description: `A profound Indigenous cultural teaching that bridges ancient wisdom with modern technology challenges. Gabriel George Sr. welcomes listeners to the sacred inlet village of suh-nak, sharing ancestral stories from the mus-kwee-um, skwaw-mish, and ts-lay-wah-tooth peoples. Through spoken word and traditional eagle songs (kway-tal-us puk-wus), this piece honors Chief Dan George's legacy while exploring themes of environmental stewardship and cultural healing.`,
    lyrics: [
      { time: 0, text: "Hey-ya, hey-ya, the wings beat strong," },
      { time: 4, text: "Ancient wisdom, carried along." },
      { time: 8, text: "Suh-nak village, sacred ground," },
      { time: 12, text: "Where old teachings can be found." },
      { time: 120, text: "Kway-tal-us puk-wus, the eagle is watching over us," },
      { time: 124, text: "Chief Dan George's spirit, forever with us." },
    ] as LyricLine[]
  }
];