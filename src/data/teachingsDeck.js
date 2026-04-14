/**
 * teachingsDeck.js — Lila Teachings Level 2: Traditions & Teachings
 * ═════════════════════════════════════════════════════════════════
 *
 * 30 concept cards across 6 traditions. Content populated from
 * the design session — all fields complete.
 *
 * Card schema: two-faced flip cards organized by wisdom tradition.
 */

export const TRADITIONS = [
  {
    id: 'hinduism',
    name: 'Hinduism & Yoga',
    symbol: 'ॐ',
    origin: 'India · ~1500 BCE onward',
    color: '#C4956A',
    chapterNumber: 'CHAPTER ONE',
    description: 'The world\'s oldest living spiritual tradition, rooted in the Vedas — texts composed by forest sages over thousands of years. Yoga emerged as its practical path: a systematic science of consciousness designed to reunite individual awareness with the universal. Not a belief system. A set of tools.',
    wild: 'The Vedic texts were composed by forest-dwelling sages who treated wilderness as laboratory. Prana — life force — moves most freely in open air, running water, high elevation. Every breath in wild places is already a yoga practice.',
    practice: 'Notice where your breath goes shallow today. Let the landscape breathe you instead.',
    concepts: ['Yamas', 'Prānāyāma', 'Samādhi', 'Ātman is Brahman', 'Bhakti', 'Sūrya Namaskār', 'Seva'],
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    symbol: '☸',
    origin: 'India · 5th century BCE · spread across Asia',
    color: '#7A9E8A',
    chapterNumber: 'CHAPTER TWO',
    description: 'Founded when a prince named Siddhartha Gautama left his palace to understand suffering. After years of practice and one night of deep meditation beneath a Bodhi tree, he became the Buddha — the awakened one. His core insight: suffering arises from craving and clinging, and can end.',
    wild: 'Nature strips away the artificial. Each trail demonstrates impermanence. Each ecosystem demonstrates interbeing. Nothing you encounter in wilderness stands alone — every living thing is made possible by everything else.',
    practice: 'Choose one thing in your field of view. Trace everything that made it possible. Keep going until you run out of edges.',
    concepts: ['Anicca', 'Interbeing', 'Tonglen', 'Zazen', 'Mettā', 'Śūnyatā'],
  },
  {
    id: 'taoism',
    name: 'Taoism & Zen',
    symbol: '道',
    origin: 'China · 4th century BCE · Japan · 12th century CE',
    color: '#6B8FA8',
    chapterNumber: 'CHAPTER THREE',
    description: 'Attributed to the sage Laozi, whose Tao Te Ching — 81 spare verses, about 5,000 characters — became one of history\'s most translated texts. Taoism arose as a counterpoint to Confucian formalism, insisting that nature, not ritual, was the truest teacher.',
    wild: 'The river, the mountain, the season — each shows what happens when nothing interferes. Wilderness is not backdrop. It is the teaching itself.',
    practice: 'Notice where you are forcing something today. See what happens if you ease instead.',
    concepts: ['Wu Wei', 'Yin-Yang', 'Zhuangzi', 'P\'u', 'Te'],
  },
  {
    id: 'shinto',
    name: 'Shinto',
    symbol: '⛩',
    origin: 'Japan · origins prehistoric · formalized ~700 CE',
    color: '#8A7BA8',
    chapterNumber: 'CHAPTER FOUR',
    description: 'Japan\'s indigenous spiritual tradition, with roots older than written history. Shinto has no founder, no single scripture, no fixed doctrine — only practice: tending to relationship with the kami, the sacred presences that inhabit natural places, phenomena, and ancestors.',
    wild: 'To enter wilderness is to enter a living temple. Every mountain, river, and ancient tree is a kami. Reverence is the appropriate response to what is actually there.',
    practice: 'Find one thing today that has been here longer than you. Acknowledge it. That\'s enough.',
    concepts: ['Kami', 'Musubi', 'Misogi', 'Harae', 'Satoyama'],
  },
  {
    id: 'stoicism',
    name: 'Stoicism',
    symbol: 'Λ',
    origin: 'Greece · 3rd century BCE · Rome · 1st–2nd century CE',
    color: '#8A8A78',
    chapterNumber: 'CHAPTER FIVE',
    description: 'Founded in Athens by Zeno of Citium, who taught in a painted porch — the Stoa Poikilē. Adopted and deepened by Roman thinkers including Seneca, Epictetus, and Marcus Aurelius, who wrote his Meditations not for publication but as a private discipline, often under open sky on military campaign.',
    wild: 'Wilderness strips away what isn\'t necessary. What remains is what matters. The Stoics knew this — nature was their laboratory for living.',
    practice: 'Name one thing outside your control today. Release it. Then name one thing inside it. Do that.',
    concepts: ['Dichotomy of Control', 'Virtue', 'Amor Fati', 'Memento Mori', 'Premeditatio Malorum'],
  },
  {
    id: 'crosscultural',
    name: 'Cross-Cultural',
    symbol: '✦',
    origin: 'Southern Africa · Bantu-speaking peoples',
    color: '#9A7B6B',
    chapterNumber: 'WILD CARD',
    description: 'Some of the most useful wisdom for wild places doesn\'t belong to any single tradition. These concepts are drawn from Indigenous knowledge systems, Japanese philosophy, West African thought, and cross-cultural contemplative practice — each offering a distinct lens for moving through the natural world with awareness.',
    wild: 'The land holds wisdom that no single tradition owns. These practices are an invitation to listen across cultures — to find what resonates and carry it carefully.',
    practice: 'Take one of these concepts into the field. Try it for a day. See what it shows you.',
    concepts: ['Ubuntu', 'Shinrin-yoku', 'Wabi-sabi', 'Ikigai', 'Talking Circle'],
  },
];

export const CARDS = [
  // ─── Hinduism & Yoga ───────────────────────────────────────────────────────
  {
    id: 'yamas', tradition: 'hinduism', name: 'Yamas', pronunciation: 'YAH-mahs', tag: 'ETHICAL FOUNDATION',
    teaching: 'Five restraints forming the moral foundation of yoga: non-violence, truthfulness, non-stealing, right use of energy, and non-possessiveness. Not rules handed down — observations about what creates suffering and what releases it.',
    origin: 'Codified by Patañjali as the first of eight limbs in the Yoga Sūtras (~2nd century CE). The outer practices that make the inner ones possible.',
    journey: 'In the wild, the Yamas clarify fast. Non-violence toward trail, animal, weather. Truthfulness about your limits. Non-possessiveness toward the view — you can\'t keep it, only meet it.',
    quote: 'Yoga is the cessation of the movements of the mind. Then there is abiding in the Seer\'s own form.',
    quoteAuthor: 'Patañjali, Yoga Sūtras 1.2',
  },
  {
    id: 'pranayama', tradition: 'hinduism', name: 'Prānāyāma', pronunciation: 'prah-nah-YAH-mah', tag: 'BREATH SCIENCE',
    teaching: 'The conscious regulation of breath as a bridge between body and mind. Prana is life force; ayama is extension. To direct the breath is to direct attention itself.',
    origin: 'Fourth limb of Patañjali\'s eight-limbed path. Developed across thousands of years of yogic experimentation into dozens of distinct techniques, each with specific physiological and energetic effects.',
    journey: 'At altitude, in wind, after a hard climb — the breath becomes undeniable. Prānāyāma begins the moment you notice it. Slow the exhale. Feel what changes.',
    quote: 'When the breath is unsteady, the mind is unsteady. When the breath is steady, the mind is steady.',
    quoteAuthor: 'Hatha Yoga Pradīpikā 2.2 (paraphrase)',
  },
  {
    id: 'samadhi', tradition: 'hinduism', name: 'Samādhi', pronunciation: 'sah-MAH-dee', tag: 'ABSORPTION',
    teaching: 'The eighth and final limb of classical yoga — a state of complete absorption in which the boundary between observer and observed dissolves. Not trance. Total presence.',
    origin: 'Described in the Yoga Sūtras as the culmination of sustained practice. Samādhi is not achieved — it arises when all the conditions that obscure it are cleared away.',
    journey: 'You have touched this. A moment on a ridge when the thinking stopped and something simpler took over. That wasn\'t distraction — that was the direction.',
    quote: 'When the object of meditation alone shines forth, as if emptied of its own form, that is samādhi.',
    quoteAuthor: 'Patañjali, Yoga Sūtras III.3',
  },
  {
    id: 'atman', tradition: 'hinduism', name: 'Ātman is Brahman', pronunciation: 'AHT-man · BRAH-man', tag: 'CORE TEACHING',
    teaching: 'The central insight of Advaita Vedanta: the individual self and universal consciousness are not two things. The separation is real in experience but not in fact. This is not a metaphor.',
    origin: 'From the Chandogya Upanishad (~600 BCE) — \'Tat tvam asi: That thou art.\' Elevated as the cornerstone of Advaita Vedanta by the philosopher Adi Shankaracharya in the 8th century CE.',
    journey: 'Stand somewhere vast. Notice that awareness is looking out from inside the landscape, not at it from outside. That\'s not poetry. That\'s the teaching.',
    quote: 'The knower of Brahman becomes Brahman.',
    quoteAuthor: 'Mundaka Upanishad 3.2.9',
  },
  {
    id: 'bhakti', tradition: 'hinduism', name: 'Bhakti', pronunciation: 'BHAK-tee', tag: 'DEVOTION',
    teaching: 'The yoga of devotion — surrendering the small self into something larger through love. Not worship as transaction. Love as a practice of dissolving the boundary between lover and beloved.',
    origin: 'One of the four classical paths of yoga alongside Jnana (knowledge), Karma (action), and Raja (meditation). The Bhakti movement flourished in medieval India through poet-saints like Mirabai, Kabir, and Tukaram.',
    journey: 'In wild places, devotion is the natural response to beauty that exceeds you. The mountain doesn\'t need your praise — but the act of giving it opens something. That opening is Bhakti.',
    quote: 'Devotion is greater than action, greater than knowledge, greater than yoga — because it is its own fruit.',
    quoteAuthor: 'Nārada Bhakti Sūtras 54',
  },
  {
    id: 'surya', tradition: 'hinduism', name: 'Sūrya Namaskār', pronunciation: 'SOOR-yah nah-mah-SKAR', tag: 'SOLAR SALUTATION',
    teaching: 'Twelve postures flowing in sequence, offered to the sun at dawn. Not exercise — a moving prayer. Each position corresponds to a different solar quality: strength, expansion, surrender, rising.',
    origin: 'Popularized in the 1920s by Bhawanrao Shriniwasrao Pant Pratinidhi, the Rajah of Aundh, who published a step-by-step guide in 1928. Later adopted into yoga by Krishnamacharya at the Mysore Palace, where it became the foundation of modern vinyasa practice.',
    journey: 'Done at first light on a trail, with actual sun on actual skin, Sūrya Namaskār becomes what it always was — a conversation between body and sky. The landscape completes the practice.',
    quote: 'Yoga is a light, which once lit, will never dim. The better your practice, the brighter the flame.',
    quoteAuthor: 'B.K.S. Iyengar, Yoga: The Path to Holistic Health',
  },
  {
    id: 'seva', tradition: 'hinduism', name: 'Seva', pronunciation: 'SAY-vah', tag: 'SELFLESS SERVICE',
    teaching: 'Action offered without attachment to outcome or recognition. The yoga of service — doing what needs doing because it needs doing, not because it reflects well on the doer.',
    origin: 'Central to Karma Yoga as described in the Bhagavad Gītā, where Krishna instructs Arjuna to act without clinging to results. Seva is its practical expression in daily life.',
    journey: 'Leave the trail better than you found it. Help someone with their pack. Pick up what wasn\'t yours to drop. These small acts, done without keeping score, are the practice.',
    quote: 'You have the right to perform your prescribed duty, but you are not entitled to the fruits of your actions.',
    quoteAuthor: 'Bhagavad Gītā 2.47 (partial verse)',
  },

  // ─── Buddhism ──────────────────────────────────────────────────────────────
  {
    id: 'anicca', tradition: 'buddhism', name: 'Anicca', pronunciation: 'ah-NEE-chah', tag: 'IMPERMANENCE',
    teaching: 'Everything that arises passes away — thoughts, seasons, trails, relationships, the body itself. This is not a cause for despair but for presence. What is fleeting deserves full attention precisely because it is fleeting.',
    origin: 'One of the three marks of existence in Buddhist teaching, alongside non-self (anattā) and suffering (dukkha). Appears throughout the Pali Canon as a foundational observation about the nature of conditioned reality.',
    journey: 'In wild places, impermanence is visible without effort. The light changing on a canyon wall. The season turning. The trail that floods and rewrites itself. Let it teach what books can only describe.',
    quote: 'All conditioned things are impermanent — when one sees this with wisdom, one turns away from suffering.',
    quoteAuthor: 'Dhammapada 277 (trans. Buddharakkhita)',
  },
  {
    id: 'interbeing', tradition: 'buddhism', name: 'Interbeing', pronunciation: 'in-ter-BEE-ing', tag: 'DEPENDENT ORIGINATION',
    teaching: 'Nothing exists in isolation. A flower is composed entirely of elements that are not flowers — chlorophyll, sunlight, water. The same is true of you. To look deeply at any one thing is to see everything.',
    origin: 'Rooted in the Mahayana teaching of pratītyasamutpāda (dependent origination). The term \'interbeing\' was coined by Thich Nhat Hanh as a modern English rendering of this ancient principle.',
    journey: 'Breathe in at altitude. That air has been forest, ocean, lung of animal. You are not separate from what surrounds you — you are temporarily organized from it.',
    quote: 'This is, because that is. This is not, because that is not.',
    quoteAuthor: 'The Buddha, Samyutta Nikāya (idappaccayatā formula)',
  },
  {
    id: 'tonglen', tradition: 'buddhism', name: 'Tonglen', pronunciation: 'TONG-len', tag: 'GIVING AND TAKING',
    teaching: 'A Tibetan Buddhist practice of breathing in the suffering of others and breathing out peace and relief. Tong means \'giving or sending,\' len means \'receiving or taking.\' It reverses the instinct to push away pain — and in doing so, dissolves the self that was pushing.',
    origin: 'From the Lojong tradition of Tibetan Buddhism, attributed to Atisha Dipankara (~982–1054 CE) and transmitted through his Kadampa successors Langri Tangpa and Geshe Chekhawa. Widely taught today by Pema Chödrön.',
    journey: 'When something difficult arises on a trip — exhaustion, fear, altitude, loss — try the reversal. Breathe it in. Breathe ease out. Not to suffer more, but to stop running.',
    quote: 'When others out of jealousy treat me badly with abuse, slander, and so on, I will learn to take all loss and offer the victory to them.',
    quoteAuthor: 'Langri Tangpa, Eight Verses on Mind Training, verse 6 (1054–1123 CE)',
  },
  {
    id: 'zazen', tradition: 'buddhism', name: 'Zazen', pronunciation: 'ZAH-zen', tag: 'SEATED MEDITATION',
    teaching: 'Literally \'seated meditation\' — the central practice of Zen Buddhism. Not doing. Not getting anywhere. Eyes open, spine upright, attention returned again and again to what is. Just this.',
    origin: 'Brought from China to Japan in the 12th–13th centuries by Eisai and Dōgen. Dōgen taught shikantaza — \'just sitting\' — as both the practice and the awakening simultaneously. Long periods of zazen alternate with kinhin, walking meditation.',
    journey: 'Find a flat rock. Sit with your spine upright and your eyes soft on the middle distance. Ten minutes. Don\'t try to clear the mind — just watch what arises. The wilderness does the rest.',
    quote: 'Think not-thinking. How do you think of not-thinking? Non-thinking. This is the essential art of zazen.',
    quoteAuthor: 'Dōgen, Fukanzazengi, quoting Chan master Yakusan Igen (745–828 CE)',
  },
  {
    id: 'metta', tradition: 'buddhism', name: 'Mettā', pronunciation: 'MET-tah', tag: 'LOVING-KINDNESS',
    teaching: 'Mettā is a Pali term referring to benevolence, loving-kindness, and active goodwill toward all beings. Within Buddhism, it is the first of the four Brahmaviharas — the immeasurable states. The practice begins with oneself and radiates outward without limit.',
    origin: 'Described in the Karanīya Metta Sutta of the Pali Canon. The formal meditation — silently repeating phrases of goodwill — developed within Theravāda Buddhism and has been transmitted widely in the West.',
    journey: 'On a summit or at a trailhead, try it. \'May I be well. May those I love be well. May all beings be well.\' It sounds simple. Meaning it — out loud, in the open — is something else.',
    quote: 'Radiate boundless love towards the entire world — above, below, and across — unhindered, without ill will, without enmity.',
    quoteAuthor: 'The Buddha, Karanīya Metta Sutta, Snp 1.8 (trans. Piyadassi Thera)',
  },
  {
    id: 'sunyata', tradition: 'buddhism', name: 'Śūnyatā', pronunciation: 'shoon-YAH-tah', tag: 'EMPTINESS',
    teaching: 'The Mahayana teaching that all phenomena are empty of inherent, independent existence. Not nihilism — everything exists, but not in the fixed, self-contained way we assume. Form is emptiness; emptiness is form.',
    origin: 'Central to the Prajñāpāramitā literature, including the Heart Sutra. Systematized by Nāgārjuna (~150–250 CE) in his Mūlamadhyamakakārikā, which demonstrated through rigorous logic that no phenomenon, including the self, has inherent existence.',
    journey: 'Look at a canyon wall. It seems solid, permanent, itself. Now think of what it was — seabed, pressure, time. Now think of what it will be. The wall is real. But the \'wall\' is also a story.',
    quote: 'Form is emptiness, emptiness is form.',
    quoteAuthor: 'Heart Sutra (Prajñāpāramitāhṛdaya)',
  },

  // ─── Taoism & Zen ──────────────────────────────────────────────────────────
  {
    id: 'wuwei', tradition: 'taoism', name: 'Wu Wei', pronunciation: 'woo way', tag: 'EFFORTLESS ACTION',
    teaching: 'Often translated as \'non-action,\' wu wei does not mean doing nothing. It is action so well in accordance with things that the author leaves no trace in the work. The river doesn\'t force its way to the sea — it finds it.',
    origin: 'Central concept of the Tao Te Ching, Chapter 37. Elaborated in the Zhuangzi as a quality of serenity arising from alignment with nature\'s patterns rather than against them.',
    journey: 'A hard climb where you stop fighting the mountain and start reading it — that shift in your body is wu wei. The trail knows more than your plan does.',
    quote: 'The Tao never acts, yet nothing is left undone.',
    quoteAuthor: 'Laozi, Tao Te Ching, Chapter 37 (trans. D.C. Lau)',
  },
  {
    id: 'yinyang', tradition: 'taoism', name: 'Yin-Yang', pronunciation: 'yin yahng', tag: 'COMPLEMENTARY FORCES',
    teaching: 'Two forces that are not opposites but complements — each containing the seed of the other. Neither is good or evil; together they create balance and harmony. Without dark, no light. Without rest, no effort.',
    origin: 'Pre-dates the Tao Te Ching in Chinese cosmology. Integrated into Taoist philosophy as the dynamic interplay through which the Tao expresses itself. Yin: receptive, dark, cool, inward. Yang: active, bright, warm, outward.',
    journey: 'A day on trail contains both — the hard ascent and the easy descent, the exposed ridge and the sheltered valley, the exertion and the rest. Neither is the destination. Both are the practice.',
    quote: 'One who knows the masculine, yet keeps to the feminine, becomes a ravine for the world.',
    quoteAuthor: 'Laozi, Tao Te Ching, Chapter 28 (trans. D.C. Lau)',
  },
  {
    id: 'zhuangzi', tradition: 'taoism', name: 'Zhuangzi', pronunciation: 'jwahng-dzuh', tag: 'THE FREE MIND',
    teaching: 'Zhuangzi taught through stories and paradox — a cook who butchers an ox by following its natural structure, a butterfly who wonders if it is dreaming of being a man. The free mind moves with life instead of against it.',
    origin: 'The Zhuangzi (4th–3rd century BCE) is the second foundational Taoist text alongside the Tao Te Ching. Where Laozi was spare and aphoristic, Zhuangzi was playful and subversive, using humor to dissolve fixed views.',
    journey: 'The mind that needs to know what\'s around the next bend, how far to the summit, what the weather will do — Zhuangzi is the medicine for that mind. Not certainty. Readiness.',
    quote: 'I do not know whether I was then a man dreaming I was a butterfly, or whether I am now a butterfly dreaming I am a man.',
    quoteAuthor: 'Zhuangzi, Chapter 2 (trans. Herbert Giles)',
  },
  {
    id: 'pu', tradition: 'taoism', name: 'P\'u', pronunciation: 'poo', tag: 'THE UNCARVED BLOCK',
    teaching: 'P\'u (朴) — the uncarved block — represents original, unshaped nature before conditioning and convention impose their patterns. The block contains all possibilities precisely because nothing has been imposed on it yet.',
    origin: 'A key metaphor recurring in the Tao Te Ching (Chapters 15, 19, 28, 32, 37). Laozi taught that returning to this state of natural simplicity is the path of the sage — not through effort, but through releasing what has been accumulated.',
    journey: 'After enough days in wilderness, something softens. The roles, the performances, the accumulated personality — they quiet. What remains is closer to p\'u. Not nothing. Original something.',
    quote: 'Return to the uncarved block.',
    quoteAuthor: 'Laozi, Tao Te Ching, Chapter 28',
  },
  {
    id: 'te', tradition: 'taoism', name: 'Te', pronunciation: 'duh', tag: 'INNER POWER',
    teaching: 'Te is the power of the Tao as it manifests in a particular being — the specific virtue, integrity, or inner force that allows a thing to be fully itself. A tree\'s te is its treeness. Your te is the authentic force that makes you who you are.',
    origin: 'The second character in \'Tao Te Ching\' — literally \'The Classic of the Way and Its Power.\' Te is a latent power that never lays claim to its achievements. It arises when nothing obstructs it.',
    journey: 'In wild places, te is visible in everything — the way a hawk rides thermals, a river finds grade, a tree grows toward light. None of it is trying. That\'s the point.',
    quote: 'A good traveler leaves no tracks.',
    quoteAuthor: 'Laozi, Tao Te Ching, Chapter 27 (trans. D.C. Lau)',
  },

  // ─── Shinto ────────────────────────────────────────────────────────────────
  {
    id: 'kami', tradition: 'shinto', name: 'Kami', pronunciation: 'KAH-mee', tag: 'SACRED PRESENCE',
    teaching: 'Kami are the sacred presences that animate the natural world — mountains, rivers, wind, ancient trees, and the forces that move through them. Not gods above nature in the Western sense, but the sacred quality within it.',
    origin: 'Central to all Shinto practice. The Kojiki (712 CE) and Nihon Shoki (720 CE) describe countless kami as fundamental sacred forces present from the beginning of existence. The expression yaoyorozu no kami — \'eight million kami\' — is a poetic term for \'innumerable,\' not a literal count.',
    journey: 'The ridge you stand on has been regarded as sacred by people for thousands of years before you arrived. It doesn\'t need your belief. It only asks your attention.',
    quote: 'Approach everything reverently.',
    quoteAuthor: 'Shinto teaching',
  },
  {
    id: 'musubi', tradition: 'shinto', name: 'Musubi', pronunciation: 'moo-SOO-bee', tag: 'GENERATIVE FORCE',
    teaching: 'Musubi is the generative force that creates and ties things together — the power that connects all living things to each other and to the kami. It is not an abstract principle but a living presence that can be felt in moments of genuine encounter.',
    origin: 'Among the first kami named in the Kojiki (712 CE) are Takami-musubi and Kami-musubi, two of the three primordial deities of creation. Musubi underlies all Shinto ceremony and understanding of relationship.',
    journey: 'The feeling of connection that comes after days in wilderness — to landscape, to companions, to something larger — is musubi working. Not metaphor. Recognition.',
    quote: 'Even the wishes of a small ant reach heaven.',
    quoteAuthor: 'Japanese proverb',
  },
  {
    id: 'misogi', tradition: 'shinto', name: 'Misogi', pronunciation: 'mee-SO-ghee', tag: 'PURIFICATION',
    teaching: 'Misogi is Shinto ritual purification by washing the entire body in natural water — a river, a waterfall, the sea. Standing under a waterfall or entering a cold river, one releases accumulated impurity. Not just of the body but of the mind and spirit. What remains is clear.',
    origin: 'Traced mythologically to Izanagi, who purified himself in a river after visiting the land of the dead. Harae rites and misogi exercises using water cleanse the individual so that they may approach a deity or sacred power. Salt, water, and fire are the principal purificatory agents.',
    journey: 'Cold water on a trail — a creek crossing, a mountain lake, rain on your face — is misogi at its simplest. Let it do what water has always done.',
    quote: 'Misogi-shuho is the shortest and quickest way to approach and assimilate the kami nature.',
    quoteAuthor: 'Rev. Yukitaka Yamamoto, Kami no Michi (1987)',
  },
  {
    id: 'harae', tradition: 'shinto', name: 'Harae', pronunciation: 'hah-RAH-eh', tag: 'RITUAL CLEANSING',
    teaching: 'Harae is the general practice of purification in Shinto — the act of clearing impurity (kegare) so that one can be present to the sacred. A sweeping away of what obscures natural clarity. Salt, water, and the waving of a priest\'s wand are its instruments.',
    origin: 'One of four essential elements in every Shinto ceremony. Performed before entering a shrine, beginning a festival, or undertaking something significant. Great national purification ceremonies are held twice yearly, on June 30 and December 31.',
    journey: 'Before entering a new landscape — a canyon, a summit, a forest — try a moment of deliberate attention. Name what you\'re carrying. Set it down at the threshold. This is the spirit of harae.',
    quote: 'To purify the six senses and restore natural brightness.',
    quoteAuthor: 'From the misogi chant harai tamae kiyome tamae rokkon shōjō',
  },
  {
    id: 'satoyama', tradition: 'shinto', name: 'Satoyama', pronunciation: 'SAH-toh-yah-mah', tag: 'THE IN-BETWEEN LAND',
    teaching: 'Satoyama describes the borderland between mountain wilderness and human settlement — the managed woodlands, terraced fields, and forest edges that formed Japan\'s traditional rural landscape. It is the place where nature and culture live in relationship, not opposition.',
    origin: 'A Japanese concept embedded in traditional land management. The International Partnership for the Satoyama Initiative (IPSI) was formally established at the Convention on Biological Diversity COP 10 in Nagoya, Japan, in October 2010, as a joint project of Japan\'s Ministry of the Environment and the United Nations University.',
    journey: 'At the edge of a trail where forest meets meadow, or where a river valley opens into farmland — that threshold is satoyama in spirit. Neither purely wild nor purely tamed. The most biodiverse, most alive.',
    quote: 'The clearest way into the Universe is through a forest wilderness.',
    quoteAuthor: 'John Muir',
  },

  // ─── Stoicism ──────────────────────────────────────────────────────────────
  {
    id: 'dichotomy', tradition: 'stoicism', name: 'Dichotomy of Control', pronunciation: 'dy-KOT-oh-mee', tag: 'FOUNDATIONAL INSIGHT',
    teaching: 'The foundational Stoic insight: some things are in our power, some are not. In our power are our judgments, intentions, and responses. Not in our power are the body, reputation, outcomes, and the actions of others. Clarity about this distinction is freedom.',
    origin: 'The opening teaching of Epictetus\'s Enchiridion (~135 CE). Epictetus, a former slave, taught that inner freedom is available to anyone regardless of external circumstance — because freedom lives in what we choose, not in what happens to us.',
    journey: 'Weather, altitude, terrain, injury — none of it is yours to control on trail. Your pace, your attention, your response to what arises — all of it is. This is not resignation. It is clarity.',
    quote: 'Make the best use of what is in your power, and take the rest according to its nature.',
    quoteAuthor: 'Epictetus, Discourses I.1 (trans. George Long)',
  },
  {
    id: 'virtue', tradition: 'stoicism', name: 'Virtue', pronunciation: 'VER-choo', tag: 'THE ONLY GOOD',
    teaching: 'The Stoics held that virtue — wisdom, justice, courage, and temperance — is the only unconditional good. External things are \'preferred indifferents\': worth pursuing, but never at the cost of character.',
    origin: 'Central to all Stoic philosophy, inherited from Socrates. Marcus Aurelius, Seneca, and Epictetus all returned to this teaching as the bedrock of Stoic practice: what you are matters more than what you have.',
    journey: 'On a hard day in the mountains, what you have when everything else is stripped away is character. The Stoics would say that was always the only thing you had.',
    quote: 'Waste no more time arguing about what a good man should be. Be one.',
    quoteAuthor: 'Marcus Aurelius, Meditations 10.16 (trans. Maxwell Staniforth)',
  },
  {
    id: 'amorfati', tradition: 'stoicism', name: 'Amor Fati', pronunciation: 'AH-mor FAH-tee', tag: 'LOVE OF FATE',
    teaching: 'Not merely accepting what happens — loving it. The Stoics taught willing acceptance of fate as the path to tranquility. The Latin phrase amor fati was coined by Nietzsche, but the concept runs throughout Stoic writing: resistance to what is causes suffering; love of what is creates freedom.',
    origin: 'Embedded throughout Marcus Aurelius\'s Meditations and Epictetus\'s teachings. Friedrich Nietzsche named it explicitly in The Gay Science (1882): \'Amor fati: let that be my love henceforth.\'',
    journey: 'The weather that ruins your plan. The injury that changes your route. The summit you don\'t reach. Amor fati is not pretending these are good. It is finding what they make possible instead.',
    quote: 'All that is in accord with you is in accord with me, O World.',
    quoteAuthor: 'Marcus Aurelius, Meditations 4.23',
  },
  {
    id: 'mementomori', tradition: 'stoicism', name: 'Memento Mori', pronunciation: 'meh-MEN-toh MOR-ee', tag: 'REMEMBER DEATH',
    teaching: 'The Stoic practice of contemplating mortality — not as morbidity, but as clarifying force. At Roman triumphs, a slave would whisper into the general\'s ear: \'Remember, thou art mortal.\' The reminder at the peak of glory. Not to induce fear — to create urgency.',
    origin: 'Practiced throughout Stoic philosophy. Marcus Aurelius returned to it repeatedly in his private journal. Seneca wrote entire letters on the subject — not to depress but to clarify priority and eliminate waste.',
    journey: 'Standing on a ridge at dawn, knowing you will not always be able to stand here — the view sharpens. This is what memento mori is for.',
    quote: 'You could leave life right now. Let that determine what you do and say and think.',
    quoteAuthor: 'Marcus Aurelius, Meditations 2.11 (trans. Gregory Hays)',
  },
  {
    id: 'premeditatio', tradition: 'stoicism', name: 'Premeditatio Malorum', pronunciation: 'preh-meh-dee-TAH-tee-oh mah-LOR-um', tag: 'NEGATIVE VISUALIZATION',
    teaching: 'The Stoic practice of mentally rehearsing what could go wrong — not to induce anxiety, but to dissolve it. By imagining the worst, you discover you can handle it. The anticipation of hardship removes its power to surprise.',
    origin: 'Taught by Seneca in his Letters to Lucilius and practiced systematically by Stoic philosophers. The morning practice: consider what difficulties might arise today and how you would respond with virtue intact.',
    journey: 'Before a hard route, a storm window, an uncertain crossing — run it through. Not to worry but to prepare. When it comes, you\'ve already met it.',
    quote: 'Let us prepare our minds as if we\'d come to the very end of life. Let us postpone nothing.',
    quoteAuthor: 'Seneca, On the Shortness of Life',
  },

  // ─── Cross-Cultural ────────────────────────────────────────────────────────
  {
    id: 'ubuntu', tradition: 'crosscultural', name: 'Ubuntu', pronunciation: 'oo-BOON-too', tag: 'RELATIONAL SELFHOOD',
    teaching: 'A Nguni Bantu philosophy from southern Africa: Umuntu ngumuntu ngabantu — a person is a person through other persons. Ubuntu holds that individual humanity is inseparable from communal relationship. You become yourself through others.',
    origin: 'Central to Nguni and Bantu cultures of southern Africa. Articulated internationally by Archbishop Desmond Tutu and woven into post-apartheid South African political thought as a framework for reconciliation and collective humanity.',
    journey: 'A roped team on a technical route. A camp where everyone works. A stranger who shares water at a trailhead. Ubuntu is the recognition of what makes these moments feel right.',
    quote: 'I am because we are.',
    quoteAuthor: 'Ubuntu proverb, Nguni Bantu tradition',
  },
  {
    id: 'shinrinyoku', tradition: 'crosscultural', name: 'Shinrin-yoku', pronunciation: 'SHIN-rin YOH-koo', tag: 'FOREST BATHING',
    teaching: 'The Japanese practice of immersive presence in forest — not exercise, not destination, simply being in the company of trees. Time among trees lowers cortisol, improves immune function, and restores directed attention.',
    origin: 'Coined in 1982 by Tomohide Akiyama of Japan\'s Ministry of Agriculture, Forestry, and Fisheries as a public health practice (森林浴). The underlying impulse — that forests heal — is ancient across many cultures.',
    journey: 'Walk slowly. No pace, no summit, no distance goal. Let the senses open — soil smell, canopy light, the sound of water. This is medicine, not metaphor.',
    quote: 'Between every two pine trees there is a door leading to a new way of life.',
    quoteAuthor: 'John Muir (handwritten note in his copy of Emerson\'s Prose Works, Beinecke Library, Yale)',
  },
  {
    id: 'wabisabi', tradition: 'crosscultural', name: 'Wabi-sabi', pronunciation: 'WAH-bee SAH-bee', tag: 'IMPERFECT BEAUTY',
    teaching: 'Wabi-sabi is a Japanese aesthetic philosophy rooted in Zen Buddhism: find beauty in what is imperfect, impermanent, and incomplete. Wabi: the spiritual richness of simplicity and solitude. Sabi: the serene beauty that comes with age, wear, and the passage of time.',
    origin: 'Emerged during Japan\'s medieval era, shaped by Zen Buddhism and the tea ceremony tradition. Crystallized by tea master Sen no Rikyū (1522–1591), who built teahouses with deliberately rough materials and doors so low that even an emperor would have to bow to enter.',
    journey: 'The cracked rock, the weathered sign, the imperfect campsite, the summit obscured by cloud — wabi-sabi is learning to see the rightness in all of it. Not consolation. Recognition.',
    quote: 'In contemporary Japan, wabi-sabi is often summarized as \'wisdom in natural simplicity.\'',
    quoteAuthor: 'Japanese aesthetic tradition',
  },
  {
    id: 'ikigai', tradition: 'crosscultural', name: 'Ikigai', pronunciation: 'ee-kee-GUY', tag: 'REASON FOR BEING',
    teaching: 'A Japanese concept meaning \'reason for being\' — the sense of purpose that makes life worth living. Not necessarily a grand mission but any element that makes each day feel worthwhile: a morning practice, a craft, a relationship, a commitment.',
    origin: 'Rooted in Japan\'s Heian period (794–1185). In Japanese usage, ikigai is less a framework to fulfill and more a quality of engagement available in small things as well as large.',
    journey: 'Days in wilderness have a way of clarifying ikigai. What you return to thinking about on long stretches of trail. What you already know but haven\'t yet committed to. The land makes it harder to avoid.',
    quote: 'If one has one\'s \'why?\' of life, one can get along with almost any \'how?\'',
    quoteAuthor: 'Nietzsche, Twilight of the Idols §12, as rendered by Viktor Frankl',
  },
  {
    id: 'talkingcircle', tradition: 'crosscultural', name: 'Talking Circle', pronunciation: 'TAW-king SER-kul', tag: 'COLLECTIVE WITNESS',
    teaching: 'A practice from many Indigenous North American traditions: people gather in a circle, a speaking object is passed, and each person speaks from the heart without interruption. Everyone listens fully. No debate, no advice — only witness.',
    origin: 'Used across many Indigenous cultures including Lakota, Ojibwe, and others as a method for council, decision-making, and healing. The circle itself is the teaching — everyone is equal in it, everyone is heard.',
    journey: 'Around a fire at the end of a hard day, the structure of the talking circle appears naturally. What would change if you held it consciously — if you gave each person that quality of attention?',
    quote: 'We do not inherit the earth from our ancestors; we borrow it from our children.',
    quoteAuthor: 'Proverb of uncertain origin; appears across Indigenous, African, and Western environmental traditions',
  },
];

// ─── Derived data ────────────────────────────────────────────────────────────

/** Get cards for a given tradition */
export function getCardsByTradition(traditionId) {
  return CARDS.filter(c => c.tradition === traditionId);
}

/** Build flat screen sequence: cover → per tradition: [chapter → cards] */
export function buildScreens() {
  const screens = [{ type: 'cover' }, { type: 'welcome' }];

  TRADITIONS.forEach((tradition, ti) => {
    const cards = getCardsByTradition(tradition.id);
    screens.push({ type: 'chapter', tradition, traditionIndex: ti });
    screens.push({ type: 'concepts', tradition, traditionIndex: ti });

    cards.forEach((card, ci) => {
      screens.push({
        type: 'card',
        card,
        tradition,
        traditionIndex: ti,
        cardIndex: ci,
        cardTotal: cards.length,
      });
    });
  });

  return screens;
}
