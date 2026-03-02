// ═══════════════════════════════════════════════════════════════════════════════
// DATA: RITUALS — Philosophical Framework
// ═══════════════════════════════════════════════════════════════════════════════
//
// Five wisdom traditions mapped across four shared principles.
// Buddhist, Hindu/Yoga, Taoist, Shinto, and Stoic concepts.
// ═══════════════════════════════════════════════════════════════════════════════

export const ritualsPillars = [
  {
    slug: "oneness",
    word: "Oneness",
    icon: "◎",
    color: "#6BA4B8",        // Ocean Teal
    quote: "You are not a drop in the ocean. You are the entire ocean in a drop.",
    quoteAuthor: "Rumi",
    desc: "You are not in the universe — you are the universe, temporarily gathered into a form that can witness its own beauty. Separation is the illusion these traditions dissolve.",
    longDesc: "The deepest teaching across these wisdom traditions is that the boundary between self and world is drawn by the mind, not by nature. Hindu philosophy calls it Brahman–Ātman: the universal soul and your soul are one. Buddhism calls it Pratītyasamutpāda — dependent origination, where nothing exists independently and everything co-creates everything else. Shinto speaks of Musubi, the interconnecting creative energy that weaves kami through every mountain, river, and stone. Taoism teaches that all things emerge from and return to the Tao, with Yin and Yang as complementary expressions of one undivided whole. The Stoics saw this same unity through Sympatheia — the mutual interdependence of all things within a cosmos animated by a single rational principle, Logos. Marcus Aurelius wrote: 'Meditate often on the interconnectedness and mutual interdependence of all things in the universe.' The minerals in your bones were forged in the same stellar furnaces that built these mountains. Our journeys are designed to strip away the noise until that truth becomes felt — not just understood.",
    traditions: [
      {
        name: "Hindu / Yoga",
        concept: "Brahman–Ātman",
        script: "ब्रह्मन्–आत्मन्",
        essence: "The universal soul and the individual soul are one. Tat tvam asi — Thou art that.",
        metaphor: "The drop is the ocean.",
      },
      {
        name: "Buddhism",
        concept: "Pratītyasamutpāda",
        script: "प्रतीत्यसमुत्पाद",
        essence: "Dependent origination — nothing exists independently. All phenomena arise in relation to all other phenomena.",
        metaphor: "Everything co-creates everything else.",
      },
      {
        name: "Shinto",
        concept: "Musubi",
        script: "結び",
        essence: "The interconnecting creative energy of the universe. Kami inhabit all things — mountains, rivers, wind, stone.",
        metaphor: "The divine is woven through all of nature.",
      },
      {
        name: "Taoism",
        concept: "The Tao",
        script: "道",
        essence: "The formless source from which all things emerge and to which all things return. Yin and Yang as one whole.",
        metaphor: "Two sides of one breath.",
      },
      {
        name: "Stoicism",
        concept: "Sympatheia & Logos",
        script: "συμπάθεια · λόγος",
        essence: "All things are mutually woven together through a shared rational principle. You are not a separate entity — you are a thread in the fabric of the universe.",
        metaphor: "Every thread is the whole tapestry.",
      },
    ],
    application: "We choose landscapes that make the boundary between self and world thin. Dawn at a desert mesa. A forest so old it hums. The ocean meeting volcanic rock. These aren't backdrops — they're mirrors.",
    details: [
      "Landscapes chosen for their capacity to dissolve boundaries",
      "Dawn and dusk practices at threshold moments",
      "Solo time in vast terrain — desert, ocean, alpine meadow",
      "Stargazing sessions that reframe scale and belonging",
    ],
  },
  {
    slug: "flow",
    word: "Flow",
    icon: "〰",
    color: "#E8956A",        // Sun Salmon
    quote: "Flow with whatever may happen, and let your mind be free.",
    quoteAuthor: "Zhuangzi",
    desc: "There is a current running through all things. Wisdom isn't found by fighting it, but by learning to move with it. The deepest ease comes from alignment, not effort.",
    longDesc: "Taoism calls it Wu Wei — effortless action, like water finding its path without force. Hindu philosophy speaks of Dharma and Ishvara Pranidhana — following your true path by surrendering the illusion of control. Buddhism teaches the Middle Way and Anicca — neither grasping nor resisting the constant flow of change. Shinto calls it Kannagara no Michi — the Way of the Kami — living in spontaneous harmony with the divine flow of nature. And the Stoics captured this principle through Amor Fati — the love of fate — and Kata Phusin, living according to nature. Not passivity, but the radical act of embracing what is, trusting the rational order of the cosmos, and meeting each moment with openness rather than resistance. This is the heart of 'Plan Less. Experience More.' Most travel is a fight against flow — rigid itineraries, anxious logistics, trying to control every variable. We design journeys that invite you into a different relationship with time.",
    traditions: [
      {
        name: "Taoism",
        concept: "Wu Wei",
        script: "無為",
        essence: "Effortless action — not passivity, but alignment so complete it feels like water finding its path.",
        metaphor: "The river doesn't push — it flows.",
      },
      {
        name: "Hindu / Yoga",
        concept: "Dharma & Surrender",
        script: "धर्म",
        essence: "Following one's true path. Ishvara Pranidhana — surrendering the illusion of control to something larger.",
        metaphor: "Stop swimming. Let the current carry you.",
      },
      {
        name: "Buddhism",
        concept: "The Middle Way & Anicca",
        script: "मज्झिमा पटिपदा",
        essence: "Neither grasping nor resisting. Accepting the constant flow of change as the nature of reality.",
        metaphor: "Hold everything lightly.",
      },
      {
        name: "Shinto",
        concept: "Kannagara no Michi",
        script: "随神の道",
        essence: "The Way of the Kami — living in spontaneous harmony with the divine flow of nature.",
        metaphor: "Walk in step with the sacred.",
      },
      {
        name: "Stoicism",
        concept: "Amor Fati & Kata Phusin",
        script: "amor fati · κατὰ φύσιν",
        essence: "Love of fate — embracing what is with openness rather than resistance. Living in accordance with nature's rational order.",
        metaphor: "A blazing fire makes flame and brightness out of everything thrown into it.",
      },
    ],
    application: "Morning practices that attune you to the day's rhythm. Unstructured hours where the landscape leads. Trips timed to natural crescendos — solstices, seasonal peaks, golden hours — so you arrive when the place itself is most alive.",
    details: [
      "Itineraries designed around natural rhythms, not rigid schedules",
      "Trips timed to solstices, seasonal peaks, and golden hours",
      "Morning movement practices that attune to the day",
      "Unstructured hours for landscape-led wandering",
    ],
  },
  {
    slug: "presence",
    word: "Presence",
    icon: "●",
    color: "#D4A853",        // Golden Amber
    quote: "The quieter you become, the more you can hear.",
    quoteAuthor: "Ram Dass",
    desc: "Every tradition points to the same radical truth: this moment — right now — is the only place life actually happens. Awakening isn't somewhere else. It's here.",
    longDesc: "Buddhism calls it Sati and Samādhi — the practice of full, unwavering attention that deepens into complete absorption. Hindu philosophy describes Dhyāna and Samādhi — progressive states of concentration leading to union with the object of awareness, where the observer becomes the observed. Shinto practices Harae — purification rituals that clear impurities and return you to direct connection with the present. Taoism speaks of Pu, the Uncarved Block — the original, unconditioned state of perception before the mind adds layers of judgment. And the Stoics practiced Prosochē — the fundamental spiritual attitude of constant, vigilant attention to the present moment. Not relaxation, but moral alertness: the discipline of catching each impression as it arises, of anchoring yourself in now. As Marcus Aurelius wrote: 'Everywhere and all the time it lies within your power to be reverently contented with your present lot.' Travel is one of the most powerful doorways into presence. New landscapes naturally wake up attention that routine has dulled. But most trips bury that opening under logistics and photo-taking.",
    traditions: [
      {
        name: "Buddhism",
        concept: "Sati & Samādhi",
        script: "सति · समाधि",
        essence: "Full, unwavering attention to the present moment. Complete absorption where subject and object merge.",
        metaphor: "Be here. Fully.",
      },
      {
        name: "Hindu / Yoga",
        concept: "Dhyāna & Samādhi",
        script: "ध्यान · समाधि",
        essence: "Progressive states of concentration leading to complete union with the object of awareness.",
        metaphor: "The observer becomes the observed.",
      },
      {
        name: "Shinto",
        concept: "Harae",
        script: "祓",
        essence: "Purification rituals that clear impurities and return you to clarity and direct connection.",
        metaphor: "Wash away everything that separates you from now.",
      },
      {
        name: "Taoism",
        concept: "Pu — The Uncarved Block",
        script: "朴",
        essence: "The original, unconditioned state of perception before the mind adds judgment and analysis.",
        metaphor: "See things as they are, before you name them.",
      },
      {
        name: "Stoicism",
        concept: "Prosochē",
        script: "προσοχή",
        essence: "The practice of constant, vigilant attention to the present moment — catching each impression before the mind distorts it.",
        metaphor: "A guard standing at the gate of the mind.",
      },
    ],
    application: "Sunrise breathwork before the thinking mind takes over. Mindful movement on trail, syncing step with breath. Silent observation at extraordinary viewpoints. We're not adding spirituality to travel — we're removing what prevents it.",
    details: [
      "Sunrise breathwork before the thinking mind engages",
      "Trail meditation — syncing step, breath, and terrain",
      "Silent observation periods at extraordinary viewpoints",
      "Digital-pause practices to let attention deepen",
    ],
  },
  {
    slug: "reverence",
    word: "Reverence",
    icon: "△",
    color: "#7DB8A0",        // Sea Glass Green
    quote: "Walk as if you are kissing the Earth with your feet.",
    quoteAuthor: "Thich Nhat Hanh",
    desc: "Mountains aren't obstacles to conquer. Rivers aren't amenities to consume. They are ancient beings deserving of our awe. These traditions share a profound respect for the living world as sacred ground.",
    longDesc: "Shinto teaches Yaoyorozu no Kami — 'eight million kami' — meaning spirit inhabits everything: every tree, river, mountain, and breeze. The whole world is a shrine. Buddhism emphasizes Ahiṃsā and Karuṇā — non-harm and deep compassion for all sentient beings and the ecosystems that sustain them. In Hindu tradition, rivers, mountains, and trees are literal embodiments of the divine — Ganga, Kailash, the Peepal tree. Taoism speaks of Tzu Jan — naturalness, the spontaneous self-organizing intelligence of the natural world that deserves respect, not interference. The Stoics held an equally profound reverence through their concept of Cosmopolis — the entire cosmos as a single living organism, a sacred city of which every being is a citizen. For the Stoics, the universe itself is divine, animated by Logos, and our role is not to dominate but to participate as stewards within a rational, living whole. We approach every destination as guests entering a living temple.",
    traditions: [
      {
        name: "Shinto",
        concept: "Yaoyorozu no Kami",
        script: "八百万の神",
        essence: "Eight million kami — spirit inhabits everything. Every tree, river, mountain, and breeze.",
        metaphor: "The whole world is a shrine.",
      },
      {
        name: "Buddhism",
        concept: "Ahiṃsā & Karuṇā",
        script: "अहिंसा · करुणा",
        essence: "Non-harm and deep compassion for all sentient beings and the ecosystems that sustain them.",
        metaphor: "Tread softly. Everything is alive.",
      },
      {
        name: "Hindu / Yoga",
        concept: "The Sacred in Nature",
        script: "पूजा",
        essence: "Rivers, mountains, and trees as literal embodiments of the divine — Ganga, Kailash, the Peepal tree.",
        metaphor: "The Earth is the body of God.",
      },
      {
        name: "Taoism",
        concept: "Tzu Jan — Naturalness",
        script: "自然",
        essence: "The spontaneous, self-organizing intelligence of the natural world. Nature already knows what it's doing.",
        metaphor: "Nature already knows what it's doing.",
      },
      {
        name: "Stoicism",
        concept: "Cosmopolis",
        script: "κοσμόπολις",
        essence: "The entire cosmos is a single living organism — a sacred city of which every being is a citizen. The universe itself is divine.",
        metaphor: "You are a citizen of the cosmos.",
      },
    ],
    application: "We don't say 'conquer the summit.' We say 'the mountain allowed us up today.' We time arrivals to witness, not disturb. We partner with local stewards and invite travelers into a posture of humility.",
    details: [
      "Leave No Trace as spiritual practice, not just policy",
      "Local stewardship partnerships at every destination",
      "Language that honors place — 'the mountain allowed us'",
      "Timing arrivals to witness, not disturb",
    ],
  },
];

// Tradition metadata for the visual cross-reference
export const traditions = [
  {
    name: "Hindu / Yoga",
    origin: "Indian Subcontinent",
    age: "~5,000 years",
    color: "#E8956A",
    symbol: "ॐ",
  },
  {
    name: "Buddhism",
    origin: "India → East Asia",
    age: "~2,500 years",
    color: "#D4A853",
    symbol: "☸",
  },
  {
    name: "Taoism",
    origin: "China",
    age: "~2,500 years",
    color: "#6BA4B8",
    symbol: "☯",
  },
  {
    name: "Shinto",
    origin: "Japan",
    age: "~2,500+ years",
    color: "#7DB8A0",
    symbol: "⛩",
  },
  {
    name: "Stoicism",
    origin: "Greece → Rome",
    age: "~2,300 years",
    color: "#A89080",
    symbol: "Δ",
  },
];

// Page-level intro copy
export const ritualsIntro = {
  headline: "The Threads Between",
  subtitle: "Four principles drawn from ancient wisdom — woven into every journey.",
  body: "Across centuries and continents, wisdom traditions have arrived at remarkably similar truths about how to live well. We don't practice any single tradition — we draw from the shared principles that run like underground rivers beneath Buddhism, Hindu philosophy, Taoism, Shinto, and Stoicism. Born in different soils — from the temples of India to the groves of Athens — they grew toward the same light.",
  convergence: "A monk in Kyoto, a yogi in Rishikesh, a sage in the mountains of China, a philosopher in the Roman forum — all pointing to the same truths: You are not separate from this world. Stop fighting the current. The present moment is the only door. The Earth beneath your feet is holy ground.",
  closing: "We don't ask you to adopt any belief system. We design journeys where these truths become undeniable — where the landscape, the practice, and the moment conspire to dissolve everything between you and the raw experience of being alive. This is what we mean by Līlā — divine play. The universe isn't a problem to solve. It's a dance to join.",
};
