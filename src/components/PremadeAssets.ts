// Cute SVG-based premade backgrounds and characters/props
// Designed as pure SVGs to load perfectly and scale elegantly without quality loss!

export interface PremadeAsset {
  id: string;
  name: string;
  src: string; // SVG data URL
}

// Helper to wrap SVG in a safe base64/URI encoding
const svgToDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const PREMADE_BACKGROUNDS: PremadeAsset[] = [
  {
    id: 'forest_twilight',
    name: 'Bosco Incantato 🌲',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b0d1b"/>
      <stop offset="40%" stop-color="#191c3d"/>
      <stop offset="100%" stop-color="#342b5c"/>
    </linearGradient>
    <linearGradient id="hill_back" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#211a3b"/>
      <stop offset="100%" stop-color="#141026"/>
    </linearGradient>
    <linearGradient id="hill_front" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#112521"/>
      <stop offset="100%" stop-color="#08100f"/>
    </linearGradient>
    <radialGradient id="moon_glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffebb" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#fffaa0" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#fffaa0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Background sky -->
  <rect width="800" height="600" fill="url(#bg_grad)"/>
  
  <!-- Moon and glow -->
  <circle cx="650" cy="150" r="100" fill="url(#moon_glow)"/>
  <circle cx="650" cy="150" r="50" fill="#fffee0"/>
  
  <!-- Tiny stars -->
  <circle cx="100" cy="80" r="2" fill="#fff" opacity="0.8"/>
  <circle cx="180" cy="140" r="1.5" fill="#fff" opacity="0.6"/>
  <circle cx="320" cy="90" r="3" fill="#fffae0" opacity="0.9"/>
  <circle cx="450" cy="110" r="1" fill="#fff" opacity="0.5"/>
  <circle cx="70" cy="220" r="2.5" fill="#fff" opacity="0.7"/>
  <circle cx="280" cy="250" r="2" fill="#fff" opacity="0.4"/>
  <polygon points="320,70 323,76 330,76 325,80 327,87 320,83 313,87 315,80 310,76 317,76" fill="#fff" opacity="0.4"/>
  
  <!-- Distant mountains / major hills -->
  <path d="M-100,600 L-100,450 Q120,380 300,440 T800,380 L800,600 Z" fill="url(#hill_back)"/>
  
  <!-- Medium Hills with sparse pine trees silhouettes -->
  <path d="M-50,600 L-50,490 Q200,460 450,520 T950,470 L950,600 Z" fill="#141930"/>
  
  <!-- Mid-ground trees (Silhouettes) -->
  <polygon points="120,440 100,490 140,490" fill="#0d1121" />
  <polygon points="120,410 105,450 135,450" fill="#0d1121" />
  <polygon points="160,450 145,502 175,502" fill="#0d1121" />
  
  <!-- Front Hills -->
  <path d="M-50,600 L-50,520 Q150,560 350,510 T850,535 L850,600 Z" fill="url(#hill_front)"/>
  
  <!-- Fireflies (Curiose luci gialle luminose) -->
  <circle cx="150" cy="480" r="4" fill="#dfff80" filter="drop-shadow(0 0 4px #dfff80)" opacity="0.9"/>
  <circle cx="380" cy="460" r="3" fill="#dfff80" filter="drop-shadow(0 0 3px #dfff80)" opacity="0.8"/>
  <circle cx="520" cy="495" r="5" fill="#dfff80" filter="drop-shadow(0 0 5px #dfff80)" opacity="0.95"/>
  <circle cx="680" cy="470" r="3.5" fill="#dfff80" filter="drop-shadow(0 0 4px #dfff80)" opacity="0.7"/>
</svg>
    `)
  },
  {
    id: 'cloud_castle',
    name: 'Rosa Fiaba & Castelli 🏰',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="sky_pink" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8b6ce"/>
      <stop offset="50%" stop-color="#eed1df"/>
      <stop offset="100%" stop-color="#bce6fa"/>
    </linearGradient>
    <linearGradient id="castle_grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a684f2" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#5551bd" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <!-- Celestial Sky -->
  <rect width="800" height="600" fill="url(#sky_pink)"/>
  
  <!-- Subtle rainbow -->
  <path d="M-200,600 A800,800 0 0,1 1000,600" fill="none" stroke="#fff" stroke-width="12" opacity="0.15"/>
  <path d="M-170,600 A770,770 0 0,1 970,600" fill="none" stroke="#fce3ec" stroke-width="8" opacity="0.2"/>

  <!-- Starry sparkles -->
  <polygon points="150,120 153,124 158,124 154,127 156,132 150,129 144,132 146,127 142,124 147,124" fill="#fff" opacity="0.9"/>
  <polygon points="620,80 622,83 627,83 623,85 625,90 620,87 615,90 617,85 613,83 618,83" fill="#fff" opacity="0.8"/>
  <polygon points="350,190 351,193 355,193 352,195 353,199 350,197 347,199 348,195 345,193 349,193" fill="#fffae8" opacity="0.85"/>

  <!-- Back Castle Silhouette -->
  <g transform="translate(250, 160)">
    <!-- Walls and Towers -->
    <rect x="70" y="100" width="160" height="150" fill="url(#castle_grad)"/>
    <rect x="40" y="80" width="40" height="170" fill="url(#castle_grad)"/>
    <rect x="220" y="80" width="40" height="170" fill="url(#castle_grad)"/>
    <!-- Centered big tower -->
    <rect x="120" y="40" width="60" height="210" fill="url(#castle_grad)"/>
    
    <!-- Cones (roofs) -->
    <polygon points="40,80 60,30 80,80" fill="#fb7185"/>
    <polygon points="220,80 240,30 260,80" fill="#fb7185"/>
    <polygon points="120,40 150,-20 180,40" fill="#f43f5e"/>
    
    <!-- Flags -->
    <polygon points="150,-20 175,-12 150,-5" fill="#facc15" />
  </g>

  <!-- Big Soft Dreamy Clouds in foreground and background -->
  <ellipse cx="100" cy="450" rx="150" ry="80" fill="#fff" opacity="0.9"/>
  <ellipse cx="250" cy="490" rx="180" ry="90" fill="#fff" opacity="0.95"/>
  <ellipse cx="550" cy="460" rx="200" ry="110" fill="#fff" opacity="0.9"/>
  <ellipse cx="750" cy="420" rx="130" ry="70" fill="#fff" opacity="0.85"/>
  
  <!-- Additional cloud puffs -->
  <circle cx="210" cy="430" r="60" fill="#fff" opacity="0.95"/>
  <circle cx="330" cy="410" r="75" fill="#fff" opacity="0.98"/>
  <circle cx="450" cy="430" r="70" fill="#fff" opacity="0.95"/>
  <circle cx="610" cy="380" r="65" fill="#fff" opacity="0.9"/>
</svg>
    `)
  },
  {
    id: 'underwater',
    name: 'Regno Marino 🐠',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="sea_grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="40%" stop-color="#0369a1"/>
      <stop offset="80%" stop-color="#0f4c75"/>
      <stop offset="100%" stop-color="#142c42"/>
    </linearGradient>
    <linearGradient id="kelp_grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <!-- Water Sky/Body -->
  <rect width="800" height="600" fill="url(#sea_grad)"/>
  
  <!-- Sun Rays shining down from top left -->
  <polygon points="0,0 200,0 350,600 0,600" fill="#38bdf8" opacity="0.15" />
  <polygon points="150,0 380,0 550,600 180,600" fill="#38bdf8" opacity="0.1" />
  <polygon points="350,0 500,0 720,600 450,600" fill="#38bdf8" opacity="0.08" />

  <!-- Bubbles floating up -->
  <circle cx="150" cy="500" r="12" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.4"/>
  <circle cx="160" cy="495" r="4" fill="#fff" opacity="0.5"/>
  
  <circle cx="320" cy="320" r="8" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.5"/>
  <circle cx="324" cy="316" r="2.5" fill="#fff" opacity="0.4"/>

  <circle cx="480" cy="220" r="16" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.3"/>
  <circle cx="486" cy="212" r="5" fill="#fff" opacity="0.4"/>

  <circle cx="580" cy="420" r="10" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.45"/>
  
  <!-- Sandy bottom -->
  <path d="M-50,600 L-50,540 Q150,560 380,530 T850,550 L850,600 Z" fill="#eab308" opacity="0.9" />
  <path d="M-50,600 L-50,560 Q250,530 500,570 T850,565 L850,600 Z" fill="#ca8a04" opacity="0.95" />

  <!-- Kelps / Algae -->
  <path d="M60,570 Q80,430 40,300 Q80,450 70,570 Z" fill="url(#kelp_grad)"/>
  <path d="M120,580 Q100,400 140,250 Q120,420 130,580 Z" fill="url(#kelp_grad)" opacity="0.8"/>
  <path d="M720,570 Q700,410 740,280 Q720,443 730,570 Z" fill="url(#kelp_grad)"/>
  <path d="M670,583 Q690,440 660,330 Q680,450 680,583 Z" fill="url(#kelp_grad)" opacity="0.9"/>
</svg>
    `)
  },
  {
    id: 'antique_parchment',
    name: 'Pergamena Antica 📜',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="parchment_grad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#fff8eb"/>
      <stop offset="60%" stop-color="#fdf0d5"/>
      <stop offset="100%" stop-color="#ddc39d"/>
    </radialGradient>
  </defs>
  <!-- Background structure -->
  <rect width="800" height="600" fill="#bb9a74"/>
  
  <!-- Outer border -->
  <rect x="25" y="25" width="750" height="550" rx="10" ry="10" fill="none" stroke="#664d33" stroke-width="4" stroke-dasharray="8 8" opacity="0.6"/>

  <!-- Inner parchment paper -->
  <rect x="35" y="35" width="730" height="530" rx="8" ry="8" fill="url(#parchment_grad)"/>

  <!-- Ornamental Corners -->
  <path d="M45,75 L45,45 L75,45" fill="none" stroke="#664d33" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M715,45 L745,45 L745,75" fill="none" stroke="#664d33" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M45,515 L45,545 L75,545" fill="none" stroke="#664d33" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M715,545 L745,545 L745,515" fill="none" stroke="#664d33" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  
  <!-- Subtle lines reminiscent of an ancient notebook -->
  <line x1="80" y1="120" x2="720" y2="120" stroke="#a48c66" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
  <line x1="80" y1="200" x2="720" y2="200" stroke="#a48c66" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
  <line x1="80" y1="280" x2="720" y2="280" stroke="#a48c66" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
  <line x1="80" y1="360" x2="720" y2="360" stroke="#a48c66" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
  <line x1="80" y1="440" x2="720" y2="440" stroke="#a48c66" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
</svg>
    `)
  }
];

export const PREMADE_CHARACTERS: PremadeAsset[] = [
  {
    id: 'dragon_baby',
    name: 'Drago Gentile 🐉',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <!-- Soft dragon drawing -->
  <g transform="translate(10, 10)">
    <!-- Wings -->
    <path d="M40,70 Q-10,30 20,10 Q40,20 50,55 Z" fill="#c084fc" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
    <path d="M140,70 Q190,30 160,10 Q140,20 130,55 Z" fill="#c084fc" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
    <path d="M45,75 Q5,45 30,25 Q45,35 52,65 Z" fill="#e9d5ff" />
    <path d="M135,75 Q175,45 150,25 Q135,35 128,65 Z" fill="#e9d5ff" />
    
    <!-- Tail -->
    <path d="M110,130 Q160,160 150,110 Q140,100 120,120 Z" fill="#4ade80" />
    <polygon points="145,130 155,123 150,138" fill="#facc15" />
    <polygon points="135,138 143,133 138,145" fill="#facc15" />

    <!-- Feet/Body -->
    <ellipse cx="90" cy="120" rx="45" ry="40" fill="#4ade80" />
    <ellipse cx="90" cy="115" rx="30" ry="25" fill="#bbf7d0" />
    <!-- Foot left -->
    <circle cx="60" cy="150" r="14" fill="#22c55e" />
    <circle cx="53" cy="142" r="4" fill="#fffeee" />
    <circle cx="60" cy="139" r="4" fill="#fffeee" />
    <circle cx="67" cy="142" r="4" fill="#fffeee" />
    <!-- Foot right -->
    <circle cx="120" cy="150" r="14" fill="#22c55e" />
    <circle cx="113" cy="142" r="4" fill="#fffeee" />
    <circle cx="120" cy="139" r="4" fill="#fffeee" />
    <circle cx="127" cy="142" r="4" fill="#fffeee" />

    <!-- Head -->
    <circle cx="90" cy="65" r="35" fill="#4ade80" />
    
    <!-- Cute snout -->
    <ellipse cx="90" cy="80" rx="20" ry="12" fill="#bbf7d0" />
    <circle cx="84" cy="78" r="2" fill="#15803d" />
    <circle cx="96" cy="78" r="2" fill="#15803d" />

    <!-- Cheeks blushing -->
    <circle cx="68" cy="74" r="5" fill="#f43f5e" opacity="0.5" />
    <circle cx="112" cy="74" r="5" fill="#f43f5e" opacity="0.5" />

    <!-- Big cute eyes -->
    <circle cx="75" cy="58" r="7" fill="#1f2937" />
    <circle cx="73" cy="55" r="3" fill="#fff" />
    <circle cx="77" cy="60" r="1" fill="#fff" />
    
    <circle cx="105" cy="58" r="7" fill="#1f2937" />
    <circle cx="103" cy="55" r="3" fill="#fff" />
    <circle cx="107" cy="60" r="1" fill="#fff" />

    <!-- Yellow horns -->
    <path d="M70,35 Q65,15 75,20 Z" fill="#facc15" />
    <path d="M110,35 Q115,15 105,20 Z" fill="#facc15" />
    
    <!-- Spine scales -->
    <polygon points="90,26 86,18 94,18" fill="#facc15" />
    <polygon points="90,95 85,88 95,88" fill="#facc15" />
  </g>
</svg>
    `)
  },
  {
    id: 'fairy_sparkle',
    name: 'Fata Splendente 🧚‍♀️',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g transform="translate(10, 10)">
    <!-- Magic Wings -->
    <path d="M45,80 Q-5,40 15,30 Q45,45 55,75 Z" fill="#38bdf8" opacity="0.7" filter="drop-shadow(0 0 3px #38bdf8)"/>
    <path d="M135,80 Q185,40 165,30 Q135,45 125,75 Z" fill="#38bdf8" opacity="0.7" filter="drop-shadow(0 0 3px #38bdf8)"/>
    <path d="M50,90 Q15,115 30,125 Q55,105 55,85 Z" fill="#a7f3d0" opacity="0.6"/>
    <path d="M130,90 Q165,115 150,125 Q125,105 125,85 Z" fill="#a7f3d0" opacity="0.6"/>

    <!-- Purple dress -->
    <path d="M70,105 L60,150 L120,150 L110,105 Z" fill="#c084fc" />
    <polygon points="60,150 70,160 80,150 90,160 100,150 110,160 120,150" fill="#a855f7" />

    <!-- Hands & Legs -->
    <rect x="73" y="150" width="8" height="20" rx="3" fill="#fbcfe8" />
    <rect x="99" y="150" width="8" height="20" rx="3" fill="#fbcfe8" />
    <!-- Arms -->
    <path d="M68,105 Q52,120 48,118" stroke="#fbcfe8" stroke-width="7" stroke-linecap="round" fill="none" />
    <path d="M112,105 Q128,120 132,118" stroke="#fbcfe8" stroke-width="7" stroke-linecap="round" fill="none" />

    <!-- Wand -->
    <line x1="125" y1="117" x2="140" y2="95" stroke="#eab308" stroke-width="3" />
    <polygon points="140,88 143,93 148,93 144,96 146,101 140,98 134,101 136,96 132,93 137,93" fill="#facc15" />

    <!-- Head -->
    <circle cx="90" cy="75" r="25" fill="#fbcfe8" />
    
    <!-- Fairy Hair (Orange/Ginger or Golden yellow) -->
    <path d="M63,70 C60,50 120,50 117,70 C125,65 120,40 90,40 C60,40 55,65 63,70 Z" fill="#f97316" />
    <circle cx="90" cy="40" r="10" fill="#f97316" /> <!-- Little bun -->

    <!-- Blushing faces & eyes -->
    <circle cx="78" cy="75" r="2.5" fill="#1f2937" />
    <circle cx="102" cy="75" r="2.5" fill="#1f2937" />
    <path d="M86,81 Q90,85 94,81" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" />
    <circle cx="72" cy="78" r="3" fill="#f43f5e" opacity="0.5" />
    <circle cx="108" cy="78" r="3" fill="#f43f5e" opacity="0.5" />
    
    <!-- Stars spark -->
    <circle cx="90" cy="115" r="3" fill="#fff" opacity="0.8" />
  </g>
</svg>
    `)
  },
  {
    id: 'wizard_cat',
    name: 'Gatto Stregone 🐱',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g transform="translate(10, 10)">
    <!-- Wizard cape -->
    <path d="M60,110 L45,160 L135,160 L120,110 Z" fill="#1e1b4b" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
    <circle cx="90" cy="110" r="8" fill="#fbbf24" />

    <!-- Cat Body -->
    <ellipse cx="90" cy="120" rx="30" ry="25" fill="#475569" />

    <!-- Wise grey head -->
    <circle cx="90" cy="80" r="28" fill="#475569" />
    
    <!-- Ears -->
    <polygon points="65,62 55,35 80,56" fill="#475569" />
    <polygon points="68,60 60,42 77,56" fill="#fda4af" />
    
    <polygon points="115,62 125,35 100,56" fill="#475569" />
    <polygon points="112,60 120,42 103,56" fill="#fda4af" />

    <!-- Glowing wizard eyes -->
    <circle cx="78" cy="78" r="6" fill="#a3e635" />
    <ellipse cx="78" cy="78" rx="1.5" ry="5" fill="#0f172a" />
    
    <circle cx="102" cy="78" r="6" fill="#a3e635" />
    <ellipse cx="102" cy="78" rx="1.5" ry="5" fill="#0f172a" />

    <!-- Cat Whiskers -->
    <line x1="55" y1="88" x2="35" y2="85" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="55" y1="92" x2="32" y2="94" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="125" y1="88" x2="145" y2="85" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="125" y1="92" x2="148" y2="94" stroke="#cbd5e1" stroke-width="1.5" />
    
    <polygon points="90,86 86,82 94,82" fill="#fda4af" />

    <!-- Pointy starry wizard hat -->
    <polygon points="62,58 90,12 118,58" fill="#1e1b4b" stroke="#fda4af" stroke-width="1" />
    <ellipse cx="90" cy="58" rx="30" r="6" fill="#312e81" />
    <!-- Yellow star on hat -->
    <polygon points="90,26 92,30 96,30 93,32 94,36 90,34 86,36 87,32 84,30 88,30" fill="#facc15" />
  </g>
</svg>
    `)
  },
  {
    id: 'friendly_astronaut',
    name: 'Astronauta 🧑‍🚀',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g transform="translate(10, 10)">
    <!-- Space pack -->
    <rect x="55" y="90" width="70" height="60" rx="10" fill="#cbd5e1" />

    <!-- Cute Chubby Suit Body -->
    <rect x="65" y="100" width="50" height="55" rx="15" fill="#f8fafc" stroke="#94a3b8" stroke-width="3" />
    <rect x="75" y="115" width="30" height="20" rx="3" fill="#38bdf8" />
    <circle cx="82" cy="125" r="3" fill="#ef4444" />
    <circle cx="98" cy="125" r="3" fill="#22c55e" />

    <!-- Arms & Legs -->
    <rect x="52" y="105" width="15" height="30" rx="7" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
    <rect x="113" y="105" width="15" height="30" rx="7" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
    <rect x="68" y="150" width="18" height="15" rx="5" fill="#cbd5e1" />
    <rect x="94" y="150" width="18" height="15" rx="5" fill="#cbd5e1" />

    <!-- Helmet (The big circle) -->
    <circle cx="90" cy="70" r="35" fill="#f8fafc" stroke="#94a3b8" stroke-width="3" />
    <!-- Visor (Glass) -->
    <ellipse cx="90" cy="68" rx="26" ry="20" fill="#1e293b" />
    
    <!-- Reflective glow inside helmet -->
    <path d="M72,60 Q90,50 108,60 Q90,54 72,60" fill="#38bdf8" opacity="0.6" />
    
    <!-- Cute friendly face inside the helmet! -->
    <circle cx="80" cy="68" r="2.5" fill="#fff" />
    <circle cx="100" cy="68" r="2.5" fill="#fff" />
    <path d="M86,74 Q90,78 94,74" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" />
  </g>
</svg>
    `)
  },
  {
    id: 'magical_shield',
    name: 'Scudo Reale 🛡️',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g transform="translate(10, 10)">
    <path d="M90,30 Q145,30 145,95 Q145,150 90,170 Q35,150 35,95 Q35,30 90,30 Z" fill="#e2e8f0" stroke="#475569" stroke-width="5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
    <path d="M90,40 Q132,40 132,95 Q132,140 90,158 Q48,140 48,95 Q48,40 90,40 Z" fill="#3b82f6" />
    <!-- Gold cross emblem -->
    <path d="M83,50 L97,50 L97,83 L130,83 L130,97 L97,97 L97,145 L83,145 L83,97 L50,97 L50,83 L83,83 Z" fill="#f59e0b" />
    <!-- Little glow stars -->
    <polygon points="90,42 92,46 96,44 93,48 95,52 90,50 85,52 87,48 84,44 88,46" fill="#fff" />
  </g>
</svg>
    `)
  },
  {
    id: 'treasure_chest',
    name: 'Forziere Magico 🧰',
    src: svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g transform="translate(10, 10)">
    <!-- Base -->
    <rect x="35" y="90" width="110" height="65" rx="5" fill="#78350f" stroke="#451a03" stroke-width="4" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))" />
    <!-- Gold vertical bands -->
    <rect x="48" y="90" width="10" height="65" fill="#eab308" />
    <rect x="122" y="90" width="10" height="65" fill="#eab308" />
    
    <!-- Chest lid -->
    <path d="M30,90 Q30,45 90,45 Q150,45 150,90 Z" fill="#92400e" stroke="#451a03" stroke-width="4" />
    <path d="M48,90 Q48,48 90,48 Q132,48 132,90 Z" fill="none" stroke="#facc15" stroke-width="8" opacity="0.3" />
    <rect x="35" y="85" width="110" height="10" fill="#7c2d12" />

    <!-- Lock -->
    <rect x="80" y="82" width="20" height="25" rx="4" fill="#d97706" stroke="#451a03" stroke-width="2" />
    <circle cx="90" cy="91" r="4" fill="#000" />
    <line x1="90" y1="95" x2="90" y2="102" stroke="#000" stroke-width="2.5" />
    
    <!-- Overflows / sparkles -->
    <polygon points="120,35 122,39 126,37 123,41 125,45 120,43 115,45 117,41 114,37 118,39" fill="#facc15" />
    <polygon points="55,60 56,63 60,62 58,65 59,68 55,66 51,68 52,65 50,62 54,63" fill="#facc15" opacity="0.8"/>
  </g>
</svg>
    `)
  }
];
