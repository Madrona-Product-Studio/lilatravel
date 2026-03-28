/**
 * practicesService.js — Lila Trips Wisdom Layer
 * ═══════════════════════════════════════════════
 * 
 * Maps five philosophical traditions against four foundational principles,
 * providing teachings, practices, and ceremonies that can be woven into
 * itineraries based on user preferences.
 * 
 * TRADITIONS (priority order):
 *   1. Hinduism & Yoga
 *   2. Buddhism
 *   3. Taoism
 *   4. Shinto
 *   5. Stoicism
 * 
 * PRINCIPLES:
 *   - Oneness   (interconnection, non-duality, dissolving separation)
 *   - Flow      (surrender, naturalness, wu wei, non-resistance)
 *   - Presence  (awareness, mindfulness, absorption in the now)
 *   - Reverence (sacred regard, gratitude, honoring what is)
 * 
 * ENTRY TYPES:
 *   - teaching    → conceptual framework, philosophy to contemplate
 *   - practice    → embodied action, something you do
 *   - ceremony    → ritualized experience, often communal or place-specific
 * 
 * USAGE:
 *   import { getPractices, getPracticesForItinerary } from './practicesService';
 *   
 *   // Query by tradition + principle
 *   const items = getPractices({ tradition: 'buddhism', principle: 'presence' });
 *   
 *   // Get itinerary-ready practices based on user form data
 *   const forTrip = getPracticesForItinerary(formData);
 */


// ═══════════════════════════════════════════════════════════════════════════════
// TRADITION METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const TRADITIONS = {
  hinduism: {
    id: 'hinduism',
    name: 'Hinduism & Yoga',
    shortName: 'Yoga / Hindu',
    color: '#4A8B7F',
    origin: 'Indian subcontinent, ~3000+ BCE',
    essence: 'Union of individual self (Ātman) with universal consciousness (Brahman) through practice, devotion, and knowledge.',
    coreTexts: ['Bhagavad Gita', 'Yoga Sutras of Patanjali', 'Upanishads', 'Vedas', 'Narada Bhakti Sutras'],
    primarySources: [
      { author: 'Patanjali', work: 'Yoga Sutras', era: '~200 BCE', note: 'Foundational text of Raja Yoga; the eight-limbed path.' },
      { author: 'Vyasa (attributed)', work: 'Bhagavad Gita', era: '~200 BCE', note: 'Krishna\'s teaching to Arjuna on duty, devotion, and liberation.' },
      { author: 'Various rishis', work: 'Upanishads', era: '~800-200 BCE', note: 'Philosophical core of the Vedas; nature of self and reality.' },
      { author: 'B.K.S. Iyengar', work: 'Light on Yoga', era: '1966', note: 'Definitive modern guide to asana and pranayama.' },
      { author: 'T.K.V. Desikachar', work: 'The Heart of Yoga', era: '1995', note: 'Accessible introduction to Patanjali\'s full system.' },
      { author: 'Swami Satchidananda', work: 'The Yoga Sutras of Patanjali (translation)', era: '1978', note: 'Widely used English commentary on the Sutras.' },
      { author: 'Narada (attributed)', work: 'Narada Bhakti Sutras', era: '~9th–11th century CE', note: '84 aphorisms on devotional love (bhakti) as the highest path to liberation. The definitive text of the Bhakti tradition.' },
      { author: 'Swami Prabhavananda', work: 'Narada\'s Way of Divine Love', era: '1971', note: 'Accessible translation and commentary on the Narada Bhakti Sutras.' },
    ],
    keyTerms: {
      atman: 'The true self; the eternal, unchanging soul within every being.',
      brahman: 'The ultimate reality; the infinite, formless consciousness underlying all existence.',
      dharma: 'Sacred duty, righteous path, cosmic order.',
      karma: 'The law of cause and effect across actions and lifetimes.',
      moksha: 'Liberation from the cycle of birth and death; union with Brahman.',
      samadhi: 'Complete absorption; the eighth limb of yoga where subject and object merge.',
      lila: 'Divine play; the universe as a spontaneous, joyful expression of consciousness.',
      shakti: 'Creative feminine energy; the dynamic power that animates all life.',
      prana: 'Life force energy; breath as the bridge between body and mind.',
      ahimsa: 'Non-violence; reverence for all living beings.',
      bhakti: 'Devotional love; the path of the heart — surrender and union through love of the divine.',
    },
  },

  buddhism: {
    id: 'buddhism',
    name: 'Buddhism',
    shortName: 'Buddhist',
    color: '#6B8078',
    origin: 'Northern India, ~500 BCE',
    essence: 'Liberation from suffering through understanding the nature of mind, cultivating compassion, and walking the middle way.',
    coreTexts: ['Dhammapada', 'Heart Sutra', 'Diamond Sutra', 'Tibetan Book of the Dead'],
    primarySources: [
      { author: 'Siddhartha Gautama (The Buddha)', work: 'Pali Canon / Tipitaka', era: '~500-200 BCE', note: 'Earliest recorded Buddhist teachings; the Theravada foundation.' },
      { author: 'Thich Nhat Hanh', work: 'The Heart of the Buddha\'s Teaching; The Miracle of Mindfulness', era: '1975-1998', note: 'Vietnamese Zen master; made Buddhist practice accessible to the West.' },
      { author: 'Shunryu Suzuki', work: 'Zen Mind, Beginner\'s Mind', era: '1970', note: 'Foundational Zen text; "In the beginner\'s mind there are many possibilities."' },
      { author: 'Pema Chödrön', work: 'When Things Fall Apart', era: '1997', note: 'Tibetan Buddhist nun; practical wisdom for working with difficulty.' },
      { author: 'Jack Kornfield', work: 'A Path with Heart', era: '1993', note: 'Theravada teacher; integrating meditation with Western psychology.' },
      { author: 'Walpola Rahula', work: 'What the Buddha Taught', era: '1959', note: 'Authoritative introduction to core Buddhist doctrine.' },
    ],
    keyTerms: {
      dukkha: 'Suffering, unsatisfactoriness; the first noble truth.',
      anicca: 'Impermanence; all conditioned phenomena are in flux.',
      anatta: 'Non-self; the absence of a fixed, permanent self.',
      nirvana: 'The cessation of suffering; liberation from craving and ignorance.',
      sati: 'Mindfulness; bare attention to present-moment experience.',
      karuna: 'Compassion; the wish for all beings to be free from suffering.',
      metta: 'Loving-kindness; unconditional friendliness toward all beings.',
      sunyata: 'Emptiness; the lack of inherent, independent existence in all things.',
      sangha: 'Community of practitioners; spiritual fellowship.',
      bodhicitta: 'The awakened heart; the aspiration to attain enlightenment for the benefit of all beings.',
    },
  },

  taoism: {
    id: 'taoism',
    name: 'Taoism',
    shortName: 'Taoist',
    color: '#5A9A8A',
    origin: 'China, ~600 BCE',
    essence: 'Harmony with the natural way (Tao) through effortless action, simplicity, and attunement to the rhythms of nature.',
    coreTexts: ['Tao Te Ching', 'Zhuangzi', 'I Ching'],
    primarySources: [
      { author: 'Lao Tzu (Laozi)', work: 'Tao Te Ching (Dào Dé Jīng)', era: '~6th century BCE', note: 'The foundational text of Taoism; 81 verses on the Way and its virtue.' },
      { author: 'Zhuang Zhou (Zhuangzi)', work: 'Zhuangzi', era: '~4th century BCE', note: 'Parables and philosophy; playful, paradoxical explorations of the Tao.' },
      { author: 'King Wen / Duke of Zhou (attributed)', work: 'I Ching (Yì Jīng)', era: '~1000 BCE', note: 'The Book of Changes; cosmological framework for understanding transformation.' },
      { author: 'Alan Watts', work: 'The Way of Zen; Tao: The Watercourse Way', era: '1957-1975', note: 'Bridge interpreter who brought Eastern philosophy to Western audiences.' },
      { author: 'Ursula K. Le Guin', work: 'Lao Tzu: Tao Te Ching (translation)', era: '1997', note: 'Acclaimed literary translation; poetic and deeply considered.' },
      { author: 'Stephen Mitchell', work: 'Tao Te Ching (translation)', era: '1988', note: 'Widely read modern English translation.' },
    ],
    keyTerms: {
      tao: 'The Way; the ineffable source and flow underlying all existence.',
      wuWei: 'Non-action; effortless doing aligned with natural flow.',
      te: 'Virtue, power, or integrity; the expression of Tao in one\'s character.',
      qi: 'Life energy; the vital force flowing through all things.',
      yinYang: 'Complementary opposites; the dance of dark and light, passive and active.',
      pu: 'The uncarved block; original simplicity, the beginner\'s mind.',
      ziran: 'Naturalness, spontaneity; being true to one\'s nature.',
      mingLi: 'Understanding the pattern; seeing the underlying order in apparent chaos.',
    },
  },

  shinto: {
    id: 'shinto',
    name: 'Shinto',
    shortName: 'Shinto',
    color: '#C47A52',
    origin: 'Japan, prehistoric',
    essence: 'Reverence for the sacred in nature, purification, and gratitude for the living spirit (kami) present in all things.',
    coreTexts: ['Kojiki', 'Nihon Shoki'],
    primarySources: [
      { author: 'Ō no Yasumaro', work: 'Kojiki (Record of Ancient Matters)', era: '712 CE', note: 'Japan\'s oldest chronicle; origin myths of the kami and the islands.' },
      { author: 'Prince Toneri (compiled)', work: 'Nihon Shoki (Chronicles of Japan)', era: '720 CE', note: 'Official history; creation narratives and early Shinto cosmology.' },
      { author: 'Motohisa Yamakage', work: 'The Essence of Shinto', era: '2006', note: 'Contemporary Shinto priest\'s guide to living Shinto practice.' },
      { author: 'Motoori Norinaga', work: 'Kojiki-den; Tamakatsuma', era: '18th century', note: 'Scholar who defined mono no aware and revitalized Shinto thought.' },
      { author: 'Thomas P. Kasulis', work: 'Shinto: The Way Home', era: '2004', note: 'Philosophical account of Shinto for Western readers.' },
      { author: 'Stuart D.B. Picken', work: 'Essentials of Shinto', era: '1994', note: 'Comprehensive academic overview of Shinto traditions and practice.' },
    ],
    keyTerms: {
      kami: 'Sacred spirits or essences present in nature — mountains, rivers, trees, ancestors.',
      musubi: 'The creative, interconnecting force of life; the power of becoming.',
      makoto: 'Sincerity, truthfulness; purity of heart and intention.',
      harae: 'Purification; ritual cleansing of impurity and spiritual pollution.',
      kannagara: 'Living in harmony with the kami; flowing with the sacred way of nature.',
      shimenawa: 'Sacred rope marking a boundary between the ordinary and the divine.',
      misogi: 'Water purification ritual; standing under waterfalls, cold immersion.',
      matsuri: 'Festival; communal celebration honoring the kami and seasons.',
      mono_no_aware: 'The bittersweet beauty of impermanence; the pathos of things.',
    },
  },

  stoicism: {
    id: 'stoicism',
    name: 'Stoicism',
    shortName: 'Stoic',
    color: '#7A8A9A',
    origin: 'Athens, ~300 BCE',
    essence: 'Living with virtue, wisdom, and equanimity by focusing on what is within your control and accepting nature\'s course with grace.',
    coreTexts: ['Meditations (Marcus Aurelius)', 'Letters from a Stoic (Seneca)', 'Discourses (Epictetus)', 'Enchiridion'],
    primarySources: [
      { author: 'Marcus Aurelius', work: 'Meditations (Τὰ εἰς ἑαυτόν)', era: '~170-180 CE', note: 'Roman emperor\'s private journal; raw, unpolished Stoic self-counsel.' },
      { author: 'Seneca (Lucius Annaeus Seneca)', work: 'Letters from a Stoic (Epistulae Morales); On the Shortness of Life', era: '~49-65 CE', note: 'Practical Stoic philosophy; perhaps the most readable ancient philosopher.' },
      { author: 'Epictetus', work: 'Discourses; Enchiridion (Handbook)', era: '~108 CE', note: 'Born a slave, taught philosophy; the dichotomy of control.' },
      { author: 'Pierre Hadot', work: 'Philosophy as a Way of Life; The Inner Citadel', era: '1987-1998', note: 'French scholar who reframed ancient philosophy as spiritual practice.' },
      { author: 'Ryan Holiday', work: 'The Obstacle Is the Way; The Daily Stoic', era: '2014-2016', note: 'Modern bridge; made Stoic principles accessible to contemporary readers.' },
      { author: 'Massimo Pigliucci', work: 'How to Be a Stoic', era: '2017', note: 'Philosopher\'s practical guide to modern Stoic living.' },
    ],
    keyTerms: {
      logos: 'Universal reason; the rational principle governing all things.',
      arete: 'Virtue, excellence; the highest good and purpose of human life.',
      apatheia: 'Freedom from destructive passions; equanimity, not emotional numbness.',
      prohairesis: 'The faculty of choice; the power to choose one\'s response to any situation.',
      cosmopolis: 'The universal city; all humans as citizens of one interconnected world.',
      eudaimonia: 'Flourishing; the well-lived life of virtue and purpose.',
      dichotomyOfControl: 'Distinguishing what is up to us (choices) from what is not (outcomes).',
      momentoMori: 'Remember you will die; the urgency and preciousness of this moment.',
      amorFati: 'Love of fate; embracing everything that happens as necessary and good.',
      sympatheia: 'Universal connection; the mutual interdependence of all things.',
    },
  },

  crossCultural: {
    id: 'crossCultural',
    name: 'Cross-Cultural Wisdom',
    shortName: 'Cross-Cultural',
    color: '#9A7B6B',
    origin: 'Multiple traditions worldwide',
    essence: 'Practices that transcend any single tradition — shared human wisdom about heat, cold, listening, community, and relationship with land.',
    coreTexts: [],
    primarySources: [
      { author: 'Miriam-Rose Ungunmerr-Baumann', work: 'Dadirri: Inner Deep Listening', era: '1988', note: 'Ngangiwumirr elder who gifted the practice of deep listening to the wider world.' },
      { author: 'Finnish Sauna Society', work: 'Sauna: A Cultural History', note: 'Documentation of Finland\'s 2,000+ year sauna tradition.' },
    ],
    keyTerms: {
      loyly: 'The spirit of the steam; the living essence released when water meets hot stone in a Finnish sauna.',
      dadirri: 'Deep listening; a contemplative practice of attending to land, silence, and inner knowing from Aboriginal Australian tradition.',
      talkingCircle: 'A shared practice across many Indigenous cultures: a held object passes around the circle, only the holder speaks, everyone else listens fully.',
    },
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
// PRINCIPLES
// ═══════════════════════════════════════════════════════════════════════════════

export const PRINCIPLES = {
  oneness: {
    id: 'oneness',
    name: 'Oneness',
    essence: 'Dissolving the illusion of separation — recognizing yourself in the landscape, the stranger, the sky.',
    question: 'Where does the boundary between you and the world begin to blur?',
  },
  flow: {
    id: 'flow',
    name: 'Flow',
    essence: 'Surrendering to what is — letting go of resistance, trusting the current, moving without forcing.',
    question: 'What happens when you stop pushing and start allowing?',
  },
  presence: {
    id: 'presence',
    name: 'Presence',
    essence: 'Arriving fully in this moment — not rehearsing, not reviewing, just being here.',
    question: 'What does it feel like to have nowhere else to be?',
  },
  reverence: {
    id: 'reverence',
    name: 'Reverence',
    essence: 'Sacred regard — treating the ground, the meal, the silence as something worthy of awe.',
    question: 'What would change if you treated everything today as holy?',
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
// ENTRY TYPE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const TYPE_META = {
  teaching: { label: 'Teaching', color: '#8B7EC8', icon: '📖' },
  practice: { label: 'Practice', color: '#4A8B7F', icon: '🧘' },
  ceremony: { label: 'Ceremony', color: '#D4855A', icon: '🔥' },
};


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICE ENTRIES
// ═══════════════════════════════════════════════════════════════════════════════

export const ENTRIES = [

  // ─── HINDUISM & YOGA ─────────────────────────────────────────────────────────

  // Teachings
  {
    id: 'h-t-atman-brahman',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['oneness'],
    name: 'Ātman is Brahman',
    summary: 'The individual self and the universal consciousness are one. The separation you feel is an illusion (māyā).',
    deeper: 'The Upanishads describe the core realization: "Tat tvam asi" — You are That. The drop is the ocean. When you stand at a canyon rim and feel the boundary between self and landscape dissolve, you are touching this truth directly. The practice is not to believe it intellectually but to experience it — in meditation, in breath, in the vast silence of wild places.',
    sources: [
      { text: 'Chandogya Upanishad', section: '6.8.7', note: 'Origin of "Tat tvam asi" — the mahāvākya (great saying).' },
      { text: 'Mandukya Upanishad', note: 'Shortest Upanishad; Ātman-Brahman identity through the analysis of Om.' },
      { author: 'Adi Shankara', text: 'Vivekachudamani (Crest-Jewel of Discrimination)', note: '8th century Advaita Vedanta commentary.' },
    ],
    quote: { text: 'All the powers in the universe are already ours. It is we who have put our hands before our eyes and cry that it is dark.', author: 'Swami Vivekananda', role: 'Vedanta teacher' },
    frameworks: ['Advaita Vedanta', 'Upanishads', 'Tat tvam asi'],
    tripContext: 'Invoke during expansive landscape moments — overlooks, summits, stargazing. Particularly potent at dawn/dusk transitions.',
    practiceLevel: 1,
  },
  {
    id: 'h-t-lila',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['flow', 'presence'],
    name: 'Līlā — Divine Play',
    summary: 'The universe is not a problem to solve but a dance to join. Creation itself is playful, spontaneous, joyful.',
    deeper: 'Līlā is the Hindu concept that the cosmos is the free, creative play of consciousness — not a mechanical process but an expression of delight. This is the namesake of Lila Trips. When you stop trying to control your experience and start participating in it with curiosity and lightness, you are practicing Līlā. Every unexpected encounter, every wrong turn that leads somewhere beautiful, is the play unfolding.',
    sources: [
      { text: 'Brahma Sutras', section: '2.1.33', note: 'Identifies creation as the Līlā of Brahman.' },
      { text: 'Bhagavata Purana', note: 'Krishna\'s childhood play as divine Līlā made manifest.' },
      { author: 'Alan Watts', text: 'The Book: On the Taboo Against Knowing Who You Are', era: '1966', note: 'Popularized the concept of the universe "playing" at being separate.' },
    ],
    quote: { text: 'This is the real secret of life — to be completely engaged with what you are doing in the here and now. And instead of calling it work, realize it is play.', author: 'Alan Watts', role: 'philosopher' },
    frameworks: ['Bhagavad Gita', 'Krishna consciousness', 'Vedantic play'],
    tripContext: 'Frame unstructured exploration time, spontaneous detours, moments of surprise and delight.',
    practiceLevel: 0,
  },
  {
    id: 'h-t-karma-yoga',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['flow', 'reverence'],
    name: 'Karma Yoga — The Path of Selfless Action',
    summary: 'Act without attachment to outcomes. Do what needs to be done with full attention, releasing the need for results.',
    deeper: 'In the Bhagavad Gita, Krishna teaches Arjuna that liberation comes not from renouncing action but from renouncing attachment to the fruits of action. You hike not for the summit photo but for the act of walking. You cook not for praise but for the love of feeding people. This transforms every mundane act into a spiritual practice.',
    sources: [
      { text: 'Bhagavad Gita', section: 'Chapter 3 (Karma Yoga)', note: 'Krishna\'s central teaching on action without attachment.' },
      { text: 'Bhagavad Gita', section: '2.47', note: 'The defining verse on non-attachment to results.' },
      { author: 'Swami Vivekananda', text: 'Karma Yoga', era: '1896', note: 'Lectures defining the path of selfless action for modern practitioners.' },
    ],
    quote: { text: 'The world is the great gymnasium where we come to make ourselves strong.', author: 'Swami Vivekananda', role: 'Vedanta teacher' },
    frameworks: ['Bhagavad Gita Ch. 3', 'Nishkama karma', 'Four Paths of Yoga'],
    tripContext: 'Service activities, trail maintenance, mindful cooking, any activity done as offering rather than achievement.',
    practiceLevel: 1,
  },
  {
    id: 'h-t-yama',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['reverence', 'oneness'],
    name: 'Yama — Ethical Restraints',
    summary: 'The first limb: five universal vows that govern how you relate to the world — non-violence, truthfulness, non-stealing, right use of energy, and non-possessiveness.',
    deeper: 'Yama is the foundation the other seven limbs rest on. Ahiṃsā (non-violence) extends to thought and speech. Satya (truthfulness) means alignment between inner and outer. Asteya (non-stealing) includes not taking more than you need from a place. Brahmacharya (right energy) is about where you direct your vitality. Aparigraha (non-possessiveness) is the art of traveling light — literally and spiritually.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: 'Book 2, Sutras 30-31', note: 'The five yamas as the "great universal vows" (mahāvratas).' },
      { author: 'T.K.V. Desikachar', text: 'The Heart of Yoga', era: '1995', note: 'Practical commentary on living the yamas in daily life.' },
    ],
    quote: { text: 'Yoga teaches us to cure what need not be endured and endure what cannot be cured.', author: 'B.K.S. Iyengar', role: 'yoga master' },
    tripContext: 'Leave No Trace ethics, mindful consumption, respecting wildlife and sacred sites. Set as a daily intention on the first morning.',
    practiceLevel: 0,
  },
  {
    id: 'h-t-niyama',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['reverence', 'presence'],
    name: 'Niyama — Personal Observances',
    summary: 'The second limb: five practices of self-discipline — cleanliness, contentment, disciplined effort, self-study, and surrender.',
    deeper: 'Niyama turns the lens inward. Śauca (cleanliness) includes clearing mental clutter. Santoṣa (contentment) is radical acceptance of conditions as they are — the weather, the trail, the body you have today. Tapas (disciplined effort) is the fire that transforms — the early wake-up, the cold plunge. Svādhyāya (self-study) is journaling, reflection, honest observation. Īśvara Praṇidhāna (surrender) is releasing control to something larger.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: 'Book 2, Sutras 32-45', note: 'The five niyamas and their fruits when mastered.' },
      { author: 'B.K.S. Iyengar', text: 'Light on the Yoga Sutras of Patanjali', era: '1993', note: 'Rich commentary on the inner practices of niyama.' },
    ],
    quote: { text: 'Be as simple as you can be; you will be astonished to see how uncomplicated and happy your life can become.', author: 'Paramahansa Yogananda', role: 'yogi and author' },
    tripContext: 'Morning journaling (svādhyāya), embracing weather changes (santoṣa), voluntary discomfort like dawn wake-ups (tapas), letting the itinerary unfold (īśvara praṇidhāna).',
    practiceLevel: 1,
  },
  {
    id: 'h-t-asana',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['presence', 'flow'],
    name: 'Āsana — Posture',
    summary: 'The third limb: steady, comfortable posture. Not gymnastics — a seat so stable the body disappears and awareness can expand.',
    deeper: 'Patanjali devotes only three sutras to āsana. The instruction is simply: "sthira sukham āsanam" — the posture should be steady and comfortable. On a canyon rim or forest floor, āsana reconnects the body to terrain. The ground is uneven, the air moves, birds call. You practice not in spite of the environment but because of it.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: 'Book 2, Sutras 46-48', note: 'The complete teaching on āsana in just three verses.' },
      { author: 'B.K.S. Iyengar', text: 'Light on Yoga', era: '1966', note: 'The definitive modern guide to āsana practice with over 200 postures.' },
    ],
    quote: { text: 'The body is your temple. Keep it pure and clean for the soul to reside in.', author: 'B.K.S. Iyengar', role: 'yoga master' },
    tripContext: 'Morning yoga on slickrock, meadow practice, riverside flow. Let the landscape shape the sequence — open hips after long hikes, twists after travel days.',
    practiceLevel: 0,
    timeOfDay: 'morning',
    duration: '20-60 min',
  },
  {
    id: 'h-t-pranayama-limb',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['flow', 'presence'],
    name: 'Prānāyāma — Breath Control',
    summary: 'The fourth limb: conscious regulation of breath as the bridge between body and mind, between the visible and invisible.',
    deeper: 'Prāna means life force; āyāma means extension. Together: the expansion of vitality through breath. Patanjali describes it as the link between the outer practices (yama, niyama, āsana) and the inner ones (pratyāhāra, dhāranā, dhyāna, samādhi). Near waterfalls, in forests, at altitude — the prāna in the environment amplifies the practice. The breath becomes a conversation with place.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: 'Book 2, Sutras 49-53', note: 'Prānāyāma as the gateway to the inner limbs.' },
      { text: 'Hatha Yoga Pradipika', section: 'Chapter 2', author: 'Svatmarama', era: '15th century', note: 'Detailed prānāyāma techniques with effects and cautions.' },
    ],
    quote: { text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.', author: 'Thich Nhat Hanh', role: 'Zen teacher' },
    tripContext: 'Waterfall proximity, forest settings, high altitude overlooks. Nadi Shodhana before meditation, Kapalabhati to energize before hikes, Ujjayi during physical exertion.',
    practiceLevel: 1,
    timeOfDay: 'morning',
    duration: '10-20 min',
  },
  {
    id: 'h-t-pratyahara',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['presence'],
    name: 'Pratyāhāra — Sense Withdrawal',
    summary: 'The fifth limb: drawing the senses inward so that awareness rests in itself rather than chasing external stimulation.',
    deeper: 'Paradoxically, the wilderness inverts this practice. In nature, you withdraw from artificial stimulation (screens, notifications, noise) and the senses become more alive, not less. The rustle of wind, the temperature of stone, the smell of sage — pratyāhāra in nature isn\'t shutting down the senses but redirecting them toward what\'s real. It\'s the original digital detox.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: 'Book 2, Sutra 54-55', note: 'Pratyāhāra as the hinge between outer and inner practice.' },
      { author: 'Swami Satchidananda', text: 'The Yoga Sutras of Patanjali', era: '1978', note: 'Accessible commentary on the withdrawal of the senses.' },
    ],
    quote: { text: 'The quieter you become, the more you can hear.', author: 'Ram Dass', role: 'spiritual teacher' },
    tripContext: 'Phone-free hours, silent hikes, blindfolded sensory exercises, technology sabbath days. The wilderness itself is a pratyāhāra teacher.',
    practiceLevel: 1,
    timeOfDay: 'any',
    duration: '15-60 min',
  },
  {
    id: 'h-t-dharana',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['presence'],
    name: 'Dhāranā — Concentration',
    summary: 'The sixth limb: holding attention on a single point — a flame, a sound, the breath, a point on the horizon.',
    deeper: 'Dhāranā is the muscle that makes meditation possible. It\'s not yet meditation itself — it\'s the training of attention to stay. A candle flame at camp, the sound of a river, the fixed point of a star. In nature, objects of concentration are everywhere and infinitely more compelling than a studio wall. The practice is simple: choose one thing, stay with it, return when you drift.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: 'Book 3, Sutra 1', note: 'Dhāranā defined as binding consciousness to a single point.' },
      { author: 'B.K.S. Iyengar', text: 'Light on the Yoga Sutras of Patanjali', era: '1993', note: 'Commentary on concentration as the foundation of the inner journey.' },
    ],
    quote: { text: 'Take up one idea. Make that one idea your life; dream of it; think of it; live on that idea.', author: 'Swami Vivekananda', role: 'Vedanta teacher' },
    tripContext: 'Trāṭaka (flame gazing) at campfire, star-point meditation, waterfall sound focus, horizon gazing at overlooks.',
    practiceLevel: 1,
    timeOfDay: 'evening',
    duration: '10-20 min',
  },
  {
    id: 'h-t-dhyana',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['presence', 'oneness'],
    name: 'Dhyāna — Meditation',
    summary: 'The seventh limb: when concentration becomes continuous and effortless — an unbroken flow of awareness toward the object.',
    deeper: 'The difference between dhāranā and dhyāna is like the difference between pouring water drop by drop and pouring a continuous stream. In dhyāna, the gaps between attention disappear. You don\'t have to try to stay present — presence sustains itself. In profound natural settings, this happens more easily than anywhere else. The canyon, the old-growth forest, the night sky — they hold your attention so you don\'t have to.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: 'Book 3, Sutra 2', note: 'Dhyāna as the uninterrupted flow of awareness.' },
      { author: 'Swami Vivekananda', text: 'Raja Yoga', era: '1896', note: 'Early Western-accessible presentation of the meditative limbs.' },
    ],
    quote: { text: 'In the attitude of silence the soul finds the path in a clearer light, and what is elusive and deceptive resolves itself into crystal clearness.', author: 'Mahatma Gandhi', role: 'spiritual leader' },
    tripContext: 'Extended sits in powerful settings — canyon rims at dawn, ancient forests, alpine meadows. Best after several days of trip when mental chatter has naturally quieted.',
    practiceLevel: 2,
    timeOfDay: 'dawn',
    duration: '20-45 min',
  },
  {
    id: 'h-t-samadhi',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['oneness', 'presence'],
    name: 'Samādhi — Complete Absorption',
    summary: 'The eighth limb: the subject-object boundary dissolves. You don\'t observe the sunset — you become the light.',
    deeper: 'Samādhi is not a state you manufacture. It\'s what remains when everything else falls away — the effort, the technique, even the sense of being a separate person having an experience. It\'s the namesake aspiration woven into Lila Trips. You may not reach classical samādhi on a five-day trip. But you will touch its edges — those moments when time stops, when the canyon holds you, when you forget yourself entirely in the vastness of what\'s in front of you. That\'s enough. That\'s everything.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: 'Book 3, Sutra 3; Book 1, Sutras 17-18, 41-51', note: 'Multiple dimensions of samādhi described across the Sutras.' },
      { author: 'T.K.V. Desikachar', text: 'The Heart of Yoga', era: '1995', note: 'Grounded, accessible treatment of samādhi as integration rather than escape.' },
    ],
    quote: { text: 'The goal of life is to make your heartbeat match the beat of the universe, to match your nature with Nature.', author: 'Joseph Campbell', role: 'mythologist' },
    tripContext: 'Not something you schedule — something you create conditions for. Summit moments, deep silence, the final evening. The whole trip is designed to make this possible.',
    practiceLevel: 2,
    destinationVariants: {
      zion: {
        name: 'Canyon Absorption',
        summary: 'The subject-object boundary dissolves in Zion\'s immensity — you don\'t observe the canyon, you become the light on the walls.',
        setting: 'Observation Point, Angels Landing summit, or Canyon Overlook at golden hour',
        tripContext: 'Zion\'s scale creates natural conditions for absorption. At Observation Point, 2,000 feet above the canyon floor, the mind has no reference for separation — only vastness, light, and the self dissolving into red rock.',
      },
    },
  },
  {
    id: 'h-t-pancha-kosha',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['oneness', 'presence'],
    name: 'Pancha Kosha — The Five Sheaths',
    summary: 'The self has five layers: physical body, energy body, mental body, wisdom body, and bliss body. Most people only live in the first two.',
    deeper: 'The Taittiriya Upanishad describes five koshas that sheath the Ātman like nested layers: Annamaya (physical/food), Prānamaya (breath/energy), Manomaya (mind/emotions), Vijñānamaya (wisdom/discernment), Ānandamaya (bliss). Travel at its best peels back these layers — physical exertion strips away mental noise, breathwork opens the energy body, wilderness silence reaches the wisdom layer, and moments of awe touch bliss directly.',
    sources: [
      { text: 'Taittiriya Upanishad', section: 'Brahmananda Valli (Chapter 2)', note: 'The primary source text describing the five sheaths.' },
      { author: 'Swami Sivananda', text: 'Vedanta for Beginners', note: 'Accessible commentary on the kosha model.' },
    ],
    quote: { text: 'You are not a drop in the ocean. You are the entire ocean in a drop.', author: 'Rumi', role: 'Sufi poet' },
    frameworks: ['Taittiriya Upanishad', 'Vedantic psychology', 'Five koshas'],
    tripContext: 'Use as a daily arc framework: morning asana (physical), breathwork (energy), journaling (mind), contemplation (wisdom), sunset stillness (bliss).',
    practiceLevel: 2,
  },

  // Practices
  {
    id: 'h-p-surya-namaskar',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['reverence', 'flow'],
    name: 'Sūrya Namaskār — Sun Salutation',
    summary: 'A flowing sequence of twelve postures performed at sunrise, honoring the sun as the source of life and consciousness.',
    deeper: 'Each of the twelve positions corresponds to a mantra and a quality of solar energy. Practiced outdoors at sunrise, it becomes more than exercise — it\'s a conversation between your body and the first light. The flow mirrors the sun\'s arc: rising, expanding, reaching apex, folding back, returning to earth.',
    sources: [
      { text: 'Rig Veda', section: 'Surya Sukta (Hymn to the Sun)', note: 'Vedic origin of sun worship; twelve mantras for twelve solar qualities.' },
      { author: 'B.K.S. Iyengar', text: 'Light on Yoga', era: '1966', note: 'Detailed alignment and sequencing instructions.' },
      { author: 'Shri K. Pattabhi Jois', text: 'Yoga Mala', era: '1962', note: 'Ashtanga Vinyasa tradition; sun salutations as foundational practice.' },
    ],
    quote: { text: 'Live in the sunshine, swim the sea, drink the wild air.', author: 'Ralph Waldo Emerson', role: 'essayist and poet' },
    howTo: 'Face east at sunrise. Begin in Pranamasana (prayer pose). Move through the twelve positions with one breath per movement. Start with 3 rounds, build to 12. Let the landscape be your studio.',
    duration: '10-20 minutes',
    setting: 'outdoors',
    timeOfDay: 'dawn',
    tripContext: 'Canyon rim at sunrise, desert dawn, beach morning, any east-facing elevated position.',
    practiceLevel: 0,
    destinationVariants: {
      zion: {
        name: 'Canyon Rim Sun Salutation',
        summary: 'Twelve postures performed on the rim of Zion Canyon as first light paints the Navajo sandstone from orange to gold.',
        setting: 'Canyon Overlook Trail at dawn, or the Pa\'rus Trail facing east',
        tripContext: 'Dawn on the canyon rim — face east toward the Temples and Towers as the sun crests the mesa. The red rock amplifies the warmth of each movement.',
      },
    },
  },
  {
    id: 'h-p-pranayama',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['presence', 'flow'],
    name: 'Prānāyāma — Breath Mastery',
    summary: 'Conscious breathing techniques that regulate life force energy, calm the mind, and bridge the gap between body and spirit.',
    deeper: 'Prana is not just breath — it\'s the vital energy that animates all life. Pranayama practices include Nadi Shodhana (alternate nostril breathing for balance), Kapalabhati (breath of fire for energy), Ujjayi (ocean breath for calm focus), and Bhramari (humming breath for deep stillness). In nature, the prana is amplified — breathing at altitude, near waterfalls, in forests changes the quality of the experience.',
    sources: [
      { author: 'Patanjali', text: 'Yoga Sutras', section: '2.49-2.53', note: 'Pranayama as the fourth limb of yoga.' },
      { text: 'Hatha Yoga Pradipika', section: 'Chapter 2', author: 'Svatmarama', era: '15th century', note: 'Detailed pranayama techniques with effects and contraindications.' },
      { author: 'B.K.S. Iyengar', text: 'Light on Pranayama', era: '1981', note: 'The definitive modern guide to breath practice.' },
    ],
    quote: { text: 'Breath is the bridge which connects life to consciousness, which unites your body to your thoughts.', author: 'Thich Nhat Hanh', role: 'Zen teacher' },
    howTo: 'Nadi Shodhana: Sit comfortably. Close right nostril with thumb, inhale through left for 4 counts. Close both, hold 4. Release right, exhale 4. Inhale right, hold, exhale left. This is one round. Do 5-10 rounds.',
    duration: '10-20 minutes',
    setting: 'any quiet setting',
    timeOfDay: 'morning or evening',
    tripContext: 'Waterfall proximity, forest settings, high altitude points, morning practice before hiking.',
    practiceLevel: 1,
    destinationVariants: {
      zion: {
        name: 'Desert Canyon Breathwork',
        summary: 'Conscious breathing amplified by Zion\'s dry desert air and the natural echo chamber of sandstone walls.',
        setting: 'Canyon alcove, Weeping Rock amphitheater, or Virgin River banks',
        tripContext: 'The dry air at 4,000 feet sharpens each breath. Practice Nadi Shodhana in a sandstone alcove where the canyon walls hold the silence.',
      },
    },
  },
  {
    id: 'h-p-yoga-nidra',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['presence', 'oneness'],
    name: 'Yoga Nidrā — Yogic Sleep',
    summary: 'A guided meditation performed lying down that takes you to the threshold between waking and sleeping — deep restoration while maintaining awareness.',
    deeper: 'Yoga Nidra is one of the most accessible deep practices. You lie down, follow a guided body scan and visualization, and enter a state of conscious sleep where a single hour can feel like four hours of rest. The practice was developed from tantric nyasa (rotation of consciousness through the body). In nature, performed on the ground, it becomes a literal reconnection with the earth.',
    sources: [
      { author: 'Swami Satyananda Saraswati', text: 'Yoga Nidra', era: '1976', note: 'The foundational modern text; codified the practice from tantric sources.' },
      { author: 'Richard Miller', text: 'Yoga Nidra: The Meditative Heart of Yoga', era: '2005', note: 'iRest protocol; adapted for therapeutic and clinical settings.' },
      { text: 'Mandukya Upanishad', note: 'Describes the four states of consciousness including the threshold Yoga Nidra accesses.' },
    ],
    quote: { text: 'The time to relax is when you don\'t have time for it.', author: 'Sydney J. Harris', role: 'journalist and author' },
    howTo: 'Lie flat on your back (Shavasana). Follow a guided rotation of awareness through each body part, then breath counting, then visualization. Stay awake but let go of effort. 20-45 minutes.',
    duration: '20-45 minutes',
    setting: 'sheltered outdoor spot, shaded',
    timeOfDay: 'afternoon',
    tripContext: 'Post-hike recovery, rest days, afternoon shade sessions, riverbank settings.',
    practiceLevel: 0,
  },
  {
    id: 'h-p-trataka',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['presence'],
    name: 'Trāṭaka — Flame Gazing',
    summary: 'Steady, unblinking focus on a candle flame to develop concentration, inner stillness, and visual clarity.',
    deeper: 'One of the shat kriyas (six purification practices) of Hatha Yoga. You gaze at a candle flame without blinking until tears form, then close your eyes and hold the afterimage. This trains one-pointed concentration (dharana) and is one of the most direct paths to meditative absorption. Around a campfire, the practice naturally expands to include the primal human relationship with fire.',
    sources: [
      { text: 'Hatha Yoga Pradipika', section: '2.31-2.32', author: 'Svatmarama', note: 'Listed among the six shat kriyas (purification techniques).' },
      { text: 'Gherand Samhita', section: '1.53-1.54', note: 'Describes trataka as producing divine sight (divya drishti).' },
    ],
    quote: { text: 'Attention is the rarest and purest form of generosity.', author: 'Simone Weil', role: 'philosopher and mystic' },
    howTo: 'Place a candle at eye level, arm\'s length away. Gaze without blinking for 1-3 minutes. Close eyes, observe the afterimage. Repeat 3 times.',
    duration: '10-15 minutes',
    setting: 'campfire, evening',
    timeOfDay: 'evening',
    tripContext: 'Campfire evenings, candle-lit cabin, desert camp.',
    practiceLevel: 1,
  },

  // Ceremonies
  {
    id: 'h-c-agni-hotra',
    tradition: 'hinduism',
    type: 'ceremony',
    principles: ['reverence', 'oneness'],
    name: 'Fire Ceremony (Agni Hotra)',
    summary: 'A sacred fire ritual offering grains and intentions to the flame, honoring Agni — the divine fire that transforms.',
    deeper: 'Fire has been the center of Hindu worship for millennia. Agni Hotra is traditionally performed at sunrise and sunset, when the atmosphere is in transition. You offer rice, ghee, or dried herbs to a fire while chanting, symbolically releasing what no longer serves you and offering it back to the cosmos. In the wilderness, around a campfire, this becomes elemental and direct.',
    sources: [
      { text: 'Rig Veda', section: 'Book 1, Hymns 1-12 (Agni Sukta)', note: 'Agni is invoked in the very first hymn of the Vedas.' },
      { text: 'Yajur Veda', note: 'Contains the ritual procedures for fire ceremonies.' },
      { author: 'Vasant Paranjpe', text: 'Homa Therapy: Our Last Chance', era: '1989', note: 'Modern guide to simplified Agni Hotra practice.' },
    ],
    quote: { text: 'In everyone\'s life, at some time, our inner fire goes out. It is then burst into flame by an encounter with another human being.', author: 'Albert Schweitzer', role: 'theologian and humanitarian' },
    howTo: 'Build or tend a fire. Sit facing it. Set an intention. Offer dried herbs or a small amount of food to the flame while stating aloud or silently what you are releasing. Sit in silence and watch the smoke carry it upward.',
    duration: '20-40 minutes',
    setting: 'campfire, outdoor fire pit',
    timeOfDay: 'dawn or dusk',
    tripContext: 'First or last night of trip. Equinox/solstice timing. Group threshold moments.',
    practiceLevel: 0,
  },
  {
    id: 'h-c-sankalpa',
    tradition: 'hinduism',
    type: 'ceremony',
    principles: ['flow', 'presence'],
    name: 'Sankalpa — Intention Setting Ritual',
    summary: 'A formalized practice of planting a deep intention in the fertile ground of a quiet mind.',
    deeper: 'A sankalpa is different from a goal or wish. It\'s a statement of truth about who you already are at your deepest level — phrased in present tense, positive, and felt in the body. "I am whole." "I move with trust." The practice works best when the mind is quiet (after meditation or yoga nidra), when the intention can bypass the critical mind and plant itself in the subconscious.',
    sources: [
      { author: 'Swami Satyananda Saraswati', text: 'Yoga Nidra', era: '1976', note: 'Sankalpa as the seed planted during Yoga Nidra.' },
      { text: 'Rig Veda', note: 'The concept of sankalpa (resolve/intention) appears throughout Vedic ritual.' },
      { author: 'Rod Stryker', text: 'The Four Desires', era: '2011', note: 'Modern framework for working with sankalpa in daily life.' },
    ],
    quote: { text: 'What you seek is seeking you.', author: 'Rumi', role: 'Sufi poet' },
    howTo: 'After meditation or Yoga Nidra, bring your awareness to the heart. Form a single short statement of your deepest truth. Repeat it three times silently. Let it dissolve into silence. Return to it each morning of the trip.',
    duration: '5-10 minutes',
    setting: 'any quiet moment',
    timeOfDay: 'morning',
    tripContext: 'First morning of trip, daily ritual, pairs with intention-setting step in questionnaire.',
    practiceLevel: 0,
  },


  // Bhakti Yoga (Narada Bhakti Sutras)
  {
    id: 'h-t-bhakti',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['reverence', 'oneness'],
    name: 'Bhakti — The Path of Devotional Love',
    summary: 'The highest spiritual path is love itself — not earned or practiced, but the direct recognition that love is the nature of reality.',
    deeper: 'The Narada Bhakti Sutras open with a deceptively simple statement: "Bhakti is supreme love for God." But Narada goes further — this love, when purified, becomes its own end. It asks nothing, seeks nothing, fears nothing. It is not worship in the transactional sense but a constant orientation of the heart toward what is sacred. In the Bhakti tradition, the divine is not distant but present in every person, every creature, every landscape. A canyon, a wildflower, a stranger on the trail — all become doorways. The practice is not to believe this but to feel it.',
    sources: [
      { author: 'Narada (attributed)', text: 'Narada Bhakti Sutras', section: 'Sutras 1–5', note: 'Definition of supreme love (para bhakti) as the nature of bhakti itself.' },
      { author: 'Swami Prabhavananda', text: 'Narada\'s Way of Divine Love', era: '1971', note: 'Commentary situating bhakti as available to all, regardless of tradition.' },
      { author: 'Vyasa (attributed)', text: 'Bhagavad Gita', section: 'Chapter 12 (Bhakti Yoga)', note: 'Krishna describes the qualities of the devoted heart; the beloved chapter of bhaktas.' },
    ],
    quote: { text: 'Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.', author: 'Rumi', role: 'Sufi poet' },
    frameworks: ['Bhakti Yoga', 'Narada Bhakti Sutras', 'Nava-vidha Bhakti (nine forms of devotion)'],
    tripContext: 'Invoke in moments of unexpected beauty — when a landscape stops you in your tracks. The pause of awe is bhakti already arising.',
    practiceLevel: 0,
  },
  {
    id: 'h-t-para-bhakti',
    tradition: 'hinduism',
    type: 'teaching',
    principles: ['oneness', 'flow'],
    name: 'Parā Bhakti — Supreme Devotion Beyond Form',
    summary: 'The highest form of devotion transcends object, ritual, and form — becoming a continuous undercurrent of love beneath all experience.',
    deeper: 'Narada describes eleven forms of bhakti, culminating in parā bhakti: the state where love is no longer directed at something but has become the medium of existence itself. The devotee no longer loves the divine — they are love. This is the meeting point of Bhakti and Advaita: the worshipper and the worshipped dissolve into one. In wild nature, this can arise spontaneously — standing at a precipice, watching a river find its path, lying under stars that predate the sun. The path of devotion arrives at the same horizon as the path of non-duality.',
    sources: [
      { author: 'Narada (attributed)', text: 'Narada Bhakti Sutras', section: 'Sutras 51–67', note: 'The eleven forms of supreme devotion; the dissolution of the devotee in the beloved.' },
      { author: 'Swami Vivekananda', text: 'Bhakti Yoga', era: '1896', note: 'Foundational modern lecture series on para bhakti as universal religion.' },
      { author: 'Ramakrishna Paramahamsa', text: 'The Gospel of Sri Ramakrishna', era: '1942', note: 'The living embodiment of para bhakti; a saint whose love dissolved all distinctions.' },
    ],
    quote: { text: 'The most beautiful experience we can have is the mysterious. It is the fundamental emotion that stands at the cradle of true art and true science.', author: 'Albert Einstein', role: 'physicist' },
    frameworks: ['Narada Bhakti Sutras', 'Advaita Vedanta', 'Nondual devotion'],
    tripContext: 'Summit moments, night sky, first light. The feeling of being held by something larger than the self.',
    practiceLevel: 2,
  },
  {
    id: 'h-p-kirtan',
    tradition: 'hinduism',
    type: 'practice',
    principles: ['reverence', 'presence'],
    name: 'Kīrtan — Devotional Chanting',
    summary: 'Call-and-response chanting of sacred names and mantras — the most accessible of all bhakti practices, requiring no experience and no belief.',
    deeper: 'Kirtan is described in the Narada Bhakti Sutras as one of the primary forms of devotional practice. Unlike silent meditation, kirtan moves through the body — voice, breath, rhythm, repetition. The repeated sound of sacred syllables is said to gradually dissolve the armor around the heart. But even secular participants often find something loosens: the self-consciousness drops, the analytical mind quiets, and something more direct comes through. Around a campfire in a canyon, with the acoustics of sandstone, the effect can be profound.',
    sources: [
      { author: 'Narada (attributed)', text: 'Narada Bhakti Sutras', section: 'Sutra 36', note: 'Kirtan (singing the praises of God) listed among the highest forms of devotion.' },
      { text: 'Bhagavata Purana', section: '7.5.23', note: 'Narada\'s nine-fold path includes kirtanam (devotional chanting).' },
      { author: 'Krishna Das', text: 'Chants of a Lifetime', era: '2010', note: 'Western kirtan practitioner; on how chanting works without belief.' },
    ],
    quote: { text: 'Be with those who help your being.', author: 'Rumi', role: 'Sufi poet' },
    howTo: 'Gather, seated or in a circle. A lead voice calls a phrase — a mantra, a single name, a simple melody. Everyone responds. Let it repeat and build. Tempo may rise, then fall back to stillness. Close with silence equal to the length of the chant.',
    duration: '15-45 minutes',
    setting: 'campfire, sheltered outdoor setting, group',
    timeOfDay: 'evening',
    tripContext: 'Campfire evenings, first or last night of group trip, full moon settings, threshold moments.',
    practiceLevel: 0,
  },


  // ─── BUDDHISM ────────────────────────────────────────────────────────────────

  // Teachings
  {
    id: 'b-t-four-noble-truths',
    tradition: 'buddhism',
    type: 'teaching',
    principles: ['presence', 'flow'],
    name: 'The Four Noble Truths',
    summary: 'Life involves suffering; suffering has a cause (craving); cessation is possible; there is a path to cessation.',
    deeper: 'The Buddha\'s first teaching after enlightenment. Not a philosophy of pessimism but a diagnosis and treatment plan. Dukkha (unsatisfactoriness) arises from tanha (craving) — the constant reaching for the next thing. The third truth offers hope: this cycle can end. The fourth truth is the Eightfold Path — a practical way of living that leads to freedom. On a trip, you can observe craving in real-time: the need to photograph instead of seeing, the rush to the next stop instead of being here.',
    sources: [
      { text: 'Dhammacakkappavattana Sutta', section: 'Samyutta Nikaya 56.11', note: 'The Buddha\'s first discourse after enlightenment; "Setting the Wheel of Dharma in Motion."' },
      { author: 'Walpola Rahula', text: 'What the Buddha Taught', era: '1959', section: 'Chapters 2-5', note: 'The clearest scholarly presentation of the Four Truths.' },
      { author: 'Thich Nhat Hanh', text: 'The Heart of the Buddha\'s Teaching', era: '1998', section: 'Chapters 1-8', note: 'Warm, accessible presentation; reframes the truths as practical wisdom.' },
    ],
    quote: { text: 'Pain is not wrong. Reacting to pain as wrong is what adds paralyzing confusion to any situation.', author: 'Pema Chödrön', role: 'Buddhist teacher' },
    frameworks: ['First Turning of the Dharma Wheel', 'Dhammacakkappavattana Sutta'],
    tripContext: 'Use to reframe moments of frustration or craving — bad weather, crowded trails, missed timing — as opportunities to practice.',
    practiceLevel: 1,
  },
  {
    id: 'b-t-five-khandhas',
    tradition: 'buddhism',
    type: 'teaching',
    principles: ['oneness', 'presence'],
    name: 'The Five Khandhas (Aggregates)',
    summary: 'What we call "self" is actually five streams: form, sensation, perception, mental formations, and consciousness — none of which is a fixed self.',
    deeper: 'The khandhas reveal that the "I" is a process, not a thing. Rūpa (form/body), Vedanā (feeling tone — pleasant, unpleasant, neutral), Saññā (perception/recognition), Saṅkhāra (mental formations/reactions), Viññāna (consciousness/knowing). On a hike, you can observe each: the body moving (rūpa), the pleasantness of a breeze (vedanā), recognizing a bird call (saññā), the desire to stop or push on (saṅkhāra), the awareness that knows all of this (viññāna). The self is a verb, not a noun.',
    sources: [
      { text: 'Anattalakkhana Sutta', section: 'Samyutta Nikaya 22.59', note: 'The Buddha\'s second discourse; "The Discourse on the Not-Self Characteristic."' },
      { text: 'Khandha Samyutta', section: 'Samyutta Nikaya 22', note: 'Complete collection of the Buddha\'s teachings on the aggregates.' },
      { author: 'Walpola Rahula', text: 'What the Buddha Taught', era: '1959', section: 'Chapter 2', note: 'Foundational explanation of the five aggregates.' },
      { author: 'Thich Nhat Hanh', text: 'The Heart of the Buddha\'s Teaching', era: '1998', section: 'Chapter 23', note: 'The five aggregates presented through the lens of interbeing.' },
    ],
    quote: { text: 'You are the sky. Everything else — it\'s just weather.', author: 'Pema Chödrön', role: 'Buddhist teacher' },
    frameworks: ['Anattalakkhana Sutta', 'Three Marks of Existence', 'Dependent Origination'],
    tripContext: 'Mindful hiking framework. Walking meditation with aggregate awareness. Journaling prompt.',
    practiceLevel: 2,
  },
  {
    id: 'b-t-three-marks',
    tradition: 'buddhism',
    type: 'teaching',
    principles: ['presence', 'flow'],
    name: 'The Three Marks of Existence',
    summary: 'All conditioned things share three characteristics: impermanence (anicca), unsatisfactoriness (dukkha), and non-self (anattā).',
    deeper: 'These three marks are the lens through which the Buddha saw all experience. Anicca: the canyon wall was ocean floor, the river carves new paths each season, this sunset will never repeat. Dukkha: even the most beautiful moment contains a whisper of passing. Anattā: the person standing at this overlook is not the person who arrived yesterday. Seeing these marks clearly is not depressing — it\'s liberating. It makes every moment precious precisely because it will not last.',
    sources: [
      { text: 'Dhammapada', section: 'Verses 277-279', note: 'The three marks stated in the Buddha\'s most quoted collection.' },
      { text: 'Samyutta Nikaya', section: '35.28 (Ādittapariyāya Sutta)', note: 'The Fire Sermon; everything is burning with impermanence.' },
      { author: 'Pema Chödrön', text: 'When Things Fall Apart', era: '1997', note: 'The three marks as lived experience, especially groundlessness (anattā).' },
    ],
    quote: { text: 'Things falling apart is a kind of testing and also a kind of healing.', author: 'Pema Chödrön', role: 'Buddhist teacher' },
    frameworks: ['Tilakkhana', 'Vipassana insight', 'Theravada foundation'],
    tripContext: 'Geological observation points, sunset/sunrise transitions, river settings, any landscape that shows deep time.',
    practiceLevel: 1,
    destinationVariants: {
      zion: {
        name: 'Deep Time at Zion',
        summary: 'Zion\'s 270-million-year geological record makes impermanence, change, and non-self visible in every layer of stone.',
        setting: 'Any exposed cliff face showing geological strata, especially Checkerboard Mesa or the Great White Throne',
        tripContext: 'Read the canyon walls like scripture: Kaibab limestone on top (270 million years), Navajo sandstone in the middle (ancient sand dunes), Chinle Formation below (tropical rivers). You are standing in the proof of impermanence.',
      },
    },
  },
  {
    id: 'b-t-three-paths',
    tradition: 'buddhism',
    type: 'teaching',
    principles: ['oneness', 'reverence'],
    name: 'The Three Paths of Liberation',
    summary: 'Three doors to awakening: emptiness (suññatā), signlessness (animitta), and wishlessness (appaṇihita).',
    deeper: 'These are the three vimokkha (liberations) described in the Pali Canon. Suññatā: seeing the emptiness of inherent existence in all things. Animitta: releasing the mental signs and labels we impose on experience. Appaṇihita: letting go of the wish for things to be other than they are. In wild landscapes, these become visceral: standing in a vast desert, labels fall away (animitta), the craving for comfort dissolves (appaṇihita), and you taste the open spaciousness of reality itself (suññatā).',
    sources: [
      { text: 'Patisambhidamagga', section: 'Book of Analysis, Treatise on Knowledge', note: 'Pali Canon text detailing the three doors of liberation.' },
      { text: 'Heart Sutra (Prajñāpāramitā Hridaya)', note: 'Mahayana expression of suññatā: "Form is emptiness, emptiness is form."' },
      { author: 'Thich Nhat Hanh', text: 'The Heart of the Buddha\'s Teaching', era: '1998', section: 'Chapters 20-22', note: 'The three doors as practices of concentration.' },
    ],
    quote: { text: 'Letting go gives us freedom, and freedom is the only condition for happiness.', author: 'Thich Nhat Hanh', role: 'Zen teacher' },
    frameworks: ['Patisambhidamagga', 'Three doors to liberation', 'Vipassana jhana'],
    tripContext: 'Advanced contemplation for experienced practitioners. Desert expansiveness, high alpine silence, night sky.',
    practiceLevel: 3,
  },

  // Practices
  {
    id: 'b-p-vipassana',
    tradition: 'buddhism',
    type: 'practice',
    principles: ['presence'],
    name: 'Vipassanā — Insight Meditation',
    summary: 'Clear-seeing meditation: observing body sensations, thoughts, and emotions exactly as they are without reacting.',
    deeper: 'Vipassana means "to see things as they really are." Unlike concentration meditation (which fixes attention on one object), vipassana opens the field of awareness to notice whatever arises — body sensations, sounds, thoughts, emotions — with bare, non-reactive attention. Over time, you begin to see the three marks (impermanence, suffering, non-self) directly in your own experience. Nature provides a rich field for this practice.',
    sources: [
      { text: 'Satipatthana Sutta', section: 'Majjhima Nikaya 10', note: 'The Buddha\'s primary discourse on the four foundations of mindfulness.' },
      { author: 'S.N. Goenka', text: 'The Art of Living: Vipassana Meditation', era: '1987', note: 'The tradition behind the global 10-day Vipassana retreats.' },
      { author: 'Jack Kornfield', text: 'A Path with Heart', era: '1993', note: 'Vipassana integrated with Western psychological understanding.' },
      { author: 'Joseph Goldstein', text: 'Mindfulness: A Practical Guide to Awakening', era: '2013', note: 'Verse-by-verse guide through the Satipatthana Sutta.' },
    ],
    quote: { text: 'Mindfulness is a way of befriending ourselves and our experience.', author: 'Jon Kabat-Zinn', role: 'mindfulness teacher' },
    howTo: 'Sit comfortably. Begin with a few minutes of breath awareness. Then open your attention to the full field of experience. Note what arises: "hearing... feeling... thinking..." without following the content. When you drift, return to breath. Start with 10 minutes, build to 30+.',
    duration: '10-45 minutes',
    setting: 'any quiet setting, outdoor preferred',
    timeOfDay: 'morning or evening',
    tripContext: 'Morning sit before hikes, canyon rim meditation, forest clearing.',
    practiceLevel: 1,
  },
  {
    id: 'b-p-metta',
    tradition: 'buddhism',
    type: 'practice',
    principles: ['oneness', 'reverence'],
    name: 'Mettā Bhāvanā — Loving-Kindness Meditation',
    summary: 'Systematically generating feelings of unconditional love and goodwill toward yourself, loved ones, strangers, and all beings.',
    deeper: 'Metta practice begins with yourself ("May I be happy, may I be safe, may I be healthy, may I live with ease"), then extends outward in concentric circles: a loved one, a neutral person, a difficult person, and finally all beings everywhere. The practice literally rewires the brain\'s response to others. Practiced in nature, the "all beings" phase can include the trees, the animals, the stones — everything in the landscape.',
    sources: [
      { text: 'Karaniya Metta Sutta', section: 'Sutta Nipata 1.8', note: 'The Buddha\'s primary discourse on loving-kindness.' },
      { author: 'Sharon Salzberg', text: 'Lovingkindness: The Revolutionary Art of Happiness', era: '1995', note: 'The definitive modern guide to metta practice.' },
      { author: 'Thich Nhat Hanh', text: 'Teachings on Love', era: '1997', note: 'Metta, karuna, mudita, and upekkha as the four brahmaviharas.' },
    ],
    quote: { text: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.', author: 'Sharon Salzberg', role: 'meditation teacher' },
    howTo: 'Sit quietly. Bring to mind the phrases. Start with yourself, then someone you love, then a stranger, then someone difficult, then all beings. Spend 2-3 minutes with each. Feel the warmth in your chest as it expands outward.',
    duration: '15-30 minutes',
    setting: 'any setting, especially meaningful in groups',
    timeOfDay: 'any',
    tripContext: 'Group settings, communal meals, morning opening practice, conflict resolution.',
    practiceLevel: 0,
  },
  {
    id: 'b-p-walking-meditation',
    tradition: 'buddhism',
    type: 'practice',
    principles: ['presence', 'flow'],
    name: 'Kinhin — Walking Meditation',
    summary: 'Ultra-slow, deliberate walking with full awareness of each micro-movement — lifting, moving, placing the foot.',
    deeper: 'Walking meditation bridges the gap between formal sitting practice and daily life. In the Zen tradition (kinhin), it\'s practiced between sitting periods. In the Theravada tradition, it\'s a complete practice in itself, with noting: "lifting... moving... placing." The trail becomes the meditation hall. You\'re not walking to get somewhere — you\'re walking to be here.',
    sources: [
      { text: 'Satipatthana Sutta', section: 'Majjhima Nikaya 10, Iriyapatha Pabba', note: 'Walking as one of the four postures of mindfulness.' },
      { author: 'Thich Nhat Hanh', text: 'The Long Road Turns to Joy: A Guide to Walking Meditation', era: '1996', note: 'The definitive modern guide; walking as peace.' },
      { author: 'Shunryu Suzuki', text: 'Zen Mind, Beginner\'s Mind', era: '1970', section: 'Kinhin instructions', note: 'Soto Zen tradition of walking meditation between sits.' },
    ],
    quote: { text: 'Walk as if you are kissing the Earth with your feet.', author: 'Thich Nhat Hanh', role: 'Zen teacher' },
    howTo: 'Find a straight path (15-30 feet). Stand at one end. Walk extremely slowly, noting each phase: lifting the foot, moving it forward, placing it down. At the end, pause, turn mindfully, walk back. 20-30 minutes.',
    duration: '15-30 minutes',
    setting: 'any path, trail, or open space',
    timeOfDay: 'any',
    tripContext: 'Beginning of a hike (first 10 minutes slow), riverside path, forest trail, labyrinth walk.',
    practiceLevel: 0,
    destinationVariants: {
      zion: {
        name: 'Narrows Walking Meditation',
        summary: 'Each step placed deliberately on river-smoothed stone in the Virgin River Narrows — walking meditation where water is the teacher.',
        setting: 'The Narrows (bottom-up from Temple of Sinawava) or Riverside Walk',
        tripContext: 'The Narrows forces slow, deliberate steps — ankle-deep in the Virgin River, feeling each stone through water shoes. The canyon walls rise 1,000 feet. There is nowhere to be but here.',
      },
    },
  },
  {
    id: 'b-p-zazen',
    tradition: 'buddhism',
    type: 'practice',
    principles: ['presence', 'oneness'],
    name: 'Zazen — Just Sitting',
    summary: 'The core practice of Zen: sitting upright with no agenda, no technique, no goal. Just being here, completely.',
    deeper: 'Shikantaza (just sitting) is the most radical meditation practice because it has no object, no technique, no goal. You sit. You are present. Thoughts come and go like clouds. You don\'t try to concentrate, don\'t try to be mindful, don\'t try to achieve anything. The practice is complete faith that sitting itself is enlightenment. In nature, this becomes just being — as natural as the rock you\'re sitting on.',
    sources: [
      { author: 'Dōgen Zenji', text: 'Fukan Zazengi (Universally Recommended Instructions for Zazen)', era: '1227', note: 'The foundational instruction for Soto Zen sitting practice.' },
      { author: 'Shunryu Suzuki', text: 'Zen Mind, Beginner\'s Mind', era: '1970', note: '"In the beginner\'s mind there are many possibilities, but in the expert\'s mind there are few."' },
      { author: 'Taisen Deshimaru', text: 'The Zen Way to the Martial Arts', era: '1982', note: 'Zazen as the foundation of all practice.' },
    ],
    quote: { text: 'In the beginner\'s mind there are many possibilities, but in the expert\'s mind there are few.', author: 'Shunryu Suzuki', role: 'Zen master' },
    howTo: 'Sit upright on a cushion, bench, or rock. Hands in cosmic mudra. Eyes half-open, gaze downward at 45 degrees. Breathe naturally. Don\'t try to do anything. Sit for 25-40 minutes.',
    duration: '25-40 minutes',
    setting: 'any, outdoor preferred',
    timeOfDay: 'dawn',
    tripContext: 'Canyon rim sits, forest dawn practice, any place with natural grandeur.',
    practiceLevel: 2,
  },

  // Ceremonies
  {
    id: 'b-c-alms-offering',
    tradition: 'buddhism',
    type: 'ceremony',
    principles: ['reverence', 'oneness'],
    name: 'Dāna — The Practice of Generosity',
    summary: 'Ritualized giving — of food, time, attention, or resources — as the foundation of all spiritual practice.',
    deeper: 'In the Buddhist tradition, dāna (generosity) is the first of the ten pāramitā (perfections). It\'s not charity — it\'s the practice of loosening the grip of self-centeredness. In Theravada countries, laypeople offer food to monks each morning. On a trip, this translates to: leave the trail better than you found it, cook for others with full attention, offer your time and presence freely, tip generously, support local communities.',
    sources: [
      { text: 'Itivuttaka', section: '26', note: 'The Buddha\'s teaching on the three bases of merit, beginning with dāna.' },
      { text: 'Dana Sutta', section: 'Anguttara Nikaya 7.49', note: 'Types of giving and their fruits.' },
      { author: 'Thich Nhat Hanh', text: 'The Heart of the Buddha\'s Teaching', era: '1998', section: 'Chapter 28', note: 'Dāna paramita — the perfection of giving.' },
    ],
    quote: { text: 'Generosity is the most natural outward expression of an inner attitude of compassion and loving-kindness.', author: 'Dalai Lama', role: 'spiritual leader' },
    howTo: 'Choose one act of generosity per day. It can be material (food, money) or immaterial (undivided attention, genuine compliments, trail maintenance). The key is to give without expectation of return.',
    duration: 'ongoing',
    setting: 'any',
    timeOfDay: 'any',
    tripContext: 'Trail maintenance, local business support, communal cooking, service projects.',
    practiceLevel: 0,
  },
  {
    id: 'b-c-tea-ceremony',
    tradition: 'buddhism',
    type: 'ceremony',
    principles: ['presence', 'reverence'],
    name: 'Chado — Tea as Meditation',
    summary: 'The art of tea as a mindfulness practice: every gesture deliberate, every sip a meditation, every cup an encounter with impermanence.',
    deeper: 'Rooted in Zen Buddhism and refined in Japanese culture, the tea ceremony (chado, "the way of tea") embodies ichi-go ichi-e — "one time, one meeting." Every gathering is unique and unrepeatable. The ceremony distills the principles of harmony (wa), respect (kei), purity (sei), and tranquility (jaku) into a single shared cup. On a trip, a simplified version can anchor morning or evening rituals.',
    sources: [
      { author: 'Sen no Rikyū', text: 'Teachings (oral tradition, recorded by disciples)', era: '16th century', note: 'The tea master who defined wabi-cha (rustic tea) and its four principles.' },
      { author: 'Kakuzō Okakura', text: 'The Book of Tea', era: '1906', note: 'Classic introduction to the philosophy of tea for Western readers.' },
      { author: 'Thich Nhat Hanh', text: 'The Miracle of Mindfulness', era: '1975', note: 'Tea drinking as meditation practice; "Drink your tea slowly and reverently."' },
    ],
    quote: { text: 'Drink your tea slowly and reverently, as if it is the axis on which the world earth revolves.', author: 'Thich Nhat Hanh', role: 'Zen teacher' },
    howTo: 'Boil water mindfully. Choose a tea. Pour slowly. Hold the cup with both hands. Notice the warmth, the aroma, the color. Sip slowly. Be completely present with each sip. Share in silence or with quiet conversation.',
    duration: '15-30 minutes',
    setting: 'camp, cabin, scenic overlook',
    timeOfDay: 'morning or afternoon',
    tripContext: 'Morning ritual, afternoon rest stops, group bonding, rainy day cabin practice.',
    practiceLevel: 0,
  },


  // ─── TAOISM ──────────────────────────────────────────────────────────────────

  // Teachings
  {
    id: 't-t-wu-wei',
    tradition: 'taoism',
    type: 'teaching',
    principles: ['flow'],
    name: 'Wu Wei — Effortless Action',
    summary: 'The art of doing without forcing. Acting in perfect alignment with the natural flow, like water finding its course.',
    deeper: 'Wu wei is often mistranslated as "inaction." It\'s actually the pinnacle of action — so aligned with the situation that effort disappears. A river doesn\'t try to flow around rocks; it simply flows. A bird doesn\'t try to ride thermals; it opens its wings. Lao Tzu says, "The Tao does nothing, yet nothing is left undone." On a trip, wu wei looks like: adjusting plans without frustration when weather changes, finding the rhythm of the day instead of imposing one, letting the trail teach you its pace.',
    sources: [
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapters 2, 37, 48', note: 'Primary source; "The Tao does nothing, yet nothing is left undone."' },
      { author: 'Zhuang Zhou', text: 'Zhuangzi', section: 'Inner Chapters, esp. "The Secret of Caring for Life"', note: 'The cook Ding carving an ox with effortless precision — the definitive wu wei parable.' },
      { author: 'Alan Watts', text: 'Tao: The Watercourse Way', era: '1975', note: 'Watts\' final work; wu wei as the way of water.' },
      { author: 'Edward Slingerland', text: 'Trying Not to Try', era: '2014', note: 'Scholarly analysis of wu wei across Chinese thought traditions.' },
    ],
    quote: { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu', role: 'Taoist sage' },
    frameworks: ['Tao Te Ching chapters 2, 37, 48', 'Zhuangzi'],
    tripContext: 'Reframe any disruption as wu wei opportunity. River observation. Afternoon with no agenda.',
    practiceLevel: 0,
  },
  {
    id: 't-t-yin-yang',
    tradition: 'taoism',
    type: 'teaching',
    principles: ['flow', 'oneness'],
    name: 'Yin-Yang — The Dance of Opposites',
    summary: 'All things contain their opposite. Light needs dark. Effort needs rest. The summit means nothing without the valley.',
    deeper: 'Yin-yang is not about balance as a static state — it\'s about dynamic interplay. Each contains the seed of the other (the dots in the symbol). Dawn is yin becoming yang. Autumn is yang becoming yin. A difficult hike (yang) makes the evening rest (yin) profound. The deepest stillness (yin) generates the most authentic action (yang). The practice is not to seek one over the other but to honor the rhythm between them.',
    sources: [
      { text: 'I Ching (Yì Jīng)', note: 'The Book of Changes; the original cosmological framework for yin-yang dynamics.' },
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapter 2', note: '"When people see some things as beautiful, other things become ugly."' },
      { author: 'Zhuang Zhou', text: 'Zhuangzi', section: 'Chapter 2 (On the Equality of Things)', note: 'The relativity and mutual arising of all opposites.' },
    ],
    quote: { text: 'The only way to make sense out of change is to plunge into it, move with it, and join the dance.', author: 'Alan Watts', role: 'philosopher' },
    frameworks: ['I Ching', 'Five Element Theory', 'Tao Te Ching'],
    tripContext: 'Day structure: active morning (yang), restorative afternoon (yin). Difficulty followed by ease. Silence followed by community.',
    practiceLevel: 0,
  },
  {
    id: 't-t-uncarved-block',
    tradition: 'taoism',
    type: 'teaching',
    principles: ['presence', 'reverence'],
    name: 'Pu — The Uncarved Block',
    summary: 'Original simplicity. Before labels, categories, and judgments — the raw, unprocessed experience of being.',
    deeper: 'Pu represents the state before conditioning: the child who sees the world without preconception, the mind that encounters a landscape without instantly comparing it to something else. Lao Tzu holds this up as the ideal: "Return to the state of the uncarved block." Travel is one of the best ways to practice pu — you arrive somewhere unknown, and for a moment, before the mind starts categorizing, you see it fresh. The practice is to extend that moment.',
    sources: [
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapter 28', note: '"Know the masculine, keep to the feminine... return to the state of the uncarved block."' },
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapter 19', note: '"Embrace simplicity, reduce selfishness, have few desires."' },
      { author: 'Shunryu Suzuki', text: 'Zen Mind, Beginner\'s Mind', era: '1970', note: 'Parallel concept: shoshin (beginner\'s mind) as perpetual freshness.' },
    ],
    quote: { text: 'In the pursuit of learning, every day something is acquired. In the pursuit of Tao, every day something is dropped.', author: 'Lao Tzu', role: 'Taoist sage' },
    frameworks: ['Tao Te Ching chapter 28', 'Beginner\'s mind parallel'],
    tripContext: 'First encounter with a landscape. Arrival moments. Eating unfamiliar food. Any "first time" experience.',
    practiceLevel: 0,
  },
  {
    id: 't-t-three-treasures',
    tradition: 'taoism',
    type: 'teaching',
    principles: ['reverence', 'flow', 'oneness'],
    name: 'The Three Treasures',
    summary: 'Compassion (cí), frugality (jiǎn), and humility (bù gǎn wéi tiānxià xiān) — the three virtues that align you with the Tao.',
    deeper: 'Lao Tzu says, "I have three treasures which I hold and keep: the first is compassion, the second is frugality, the third is not daring to be ahead of others." Compassion gives courage. Frugality gives generosity (because you need less, you can give more). Humility gives leadership (because you listen first). These three reframe how you move through a landscape: with care, with lightness, with deference.',
    sources: [
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapter 67', note: 'The primary source for the three treasures.' },
      { author: 'Ursula K. Le Guin', text: 'Lao Tzu: Tao Te Ching (translation)', era: '1997', note: 'Poetic rendering with commentary on each treasure.' },
    ],
    quote: { text: 'Simplicity, patience, compassion. These three are your greatest treasures.', author: 'Lao Tzu', role: 'Taoist sage' },
    frameworks: ['Tao Te Ching chapter 67'],
    tripContext: 'Daily reflection framework. Minimalist packing philosophy. Leave no trace ethics.',
    practiceLevel: 1,
  },

  // Practices
  {
    id: 't-p-qigong',
    tradition: 'taoism',
    type: 'practice',
    principles: ['flow', 'presence'],
    name: 'Qìgōng — Energy Cultivation',
    summary: 'Slow, flowing movements coordinated with breath to cultivate and circulate qi (life force energy) through the body.',
    deeper: 'Qigong is the Taoist technology of working with energy. Unlike yoga, which often holds static postures, qigong keeps the body in constant gentle motion — mirroring the Taoist principle that life is flow. The movements have poetic names: "Parting the Wild Horse\'s Mane," "White Crane Spreads Wings," "Gathering the Moon\'s Reflection." Practiced outdoors, you feel yourself moving with the landscape rather than in front of it.',
    sources: [
      { text: 'Huangdi Neijing (Yellow Emperor\'s Classic of Internal Medicine)', era: '~200 BCE', note: 'The foundational Chinese medical text; qi theory and cultivation.' },
      { author: 'Zhuang Zhou', text: 'Zhuangzi', section: 'Chapter 15 (Constrained in Will)', note: 'References to breath cultivation and "blowing and breathing" exercises.' },
      { author: 'Kenneth Cohen', text: 'The Way of Qigong', era: '1997', note: 'Comprehensive modern guide; bridges traditional and scientific understanding.' },
    ],
    quote: { text: 'Muddy water, let stand, becomes clear.', author: 'Lao Tzu', role: 'Taoist sage' },
    howTo: 'Stand with feet shoulder-width apart, knees slightly bent. Begin with "Standing Like a Tree" (Zhan Zhuang) for 5 minutes. Then flow through simple movements: arms rise on inhale, lower on exhale. Let the movement be continuous and soft.',
    duration: '15-30 minutes',
    setting: 'outdoors, open space',
    timeOfDay: 'morning',
    tripContext: 'Meadow mornings, riverside clearing, garden space at lodging, any open-air setting.',
    practiceLevel: 0,
  },
  {
    id: 't-p-forest-bathing',
    tradition: 'taoism',
    type: 'practice',
    principles: ['presence', 'oneness', 'reverence'],
    name: 'Forest Immersion (Sēnlín Yù)',
    summary: 'Slow, sensory-rich wandering through a forest with no destination — letting the forest come to you.',
    deeper: 'While the Japanese term shinrin-yoku is better known, the Taoist roots run deeper: the ancient sages would retreat to mountains and forests to attune to the Tao. The practice is radical simplicity: walk slowly, use all five senses, touch bark, smell soil, listen to layered sounds, look without labeling. Research shows 15 minutes in a forest measurably reduces cortisol, blood pressure, and heart rate while boosting immune function (NK cells).',
    sources: [
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapter 25', note: '"Humanity follows the Earth. Earth follows Heaven. Heaven follows the Tao. The Tao follows nature."' },
      { author: 'Dr. Qing Li', text: 'Forest Bathing: How Trees Can Help You Find Health and Happiness', era: '2018', note: 'The leading researcher on forest medicine; measurable immune and stress benefits.' },
      { author: 'M. Amos Clifford', text: 'Your Guide to Forest Bathing', era: '2018', note: 'Practical guide from the founder of the Association of Nature and Forest Therapy.' },
    ],
    quote: { text: 'In every walk with nature one receives far more than he seeks.', author: 'John Muir', role: 'naturalist and writer' },
    howTo: 'Enter a forest. Leave the phone. Walk at one-third your normal pace. Stop frequently. Touch things. Breathe deeply. Sit with a single tree for 10 minutes. There is nowhere to get to.',
    duration: '60-120 minutes',
    setting: 'forest, heavy tree cover',
    timeOfDay: 'any, morning preferred',
    tripContext: 'Old-growth forest segments, after-rain forest walks, Pacific Northwest/Olympic settings.',
    practiceLevel: 0,
    destinationVariants: {
      zion: {
        name: 'Cottonwood Cathedral Immersion',
        summary: 'Slow, sensory-rich wandering through Zion\'s riparian corridors where ancient Fremont cottonwoods create a green cathedral inside the desert canyon.',
        setting: 'Pa\'rus Trail cottonwood groves, Emerald Pools trail, or Court of the Patriarchs riparian zone',
        tripContext: 'Zion\'s forest is unexpected — lush cottonwoods and boxelders lining the Virgin River, creating green tunnels inside the desert. The contrast between red rock and green canopy heightens every sense.',
      },
    },
  },
  {
    id: 't-p-zhan-zhuang',
    tradition: 'taoism',
    type: 'practice',
    principles: ['presence', 'flow'],
    name: 'Zhàn Zhuāng — Standing Like a Tree',
    summary: 'Standing meditation: holding a simple posture for extended periods to cultivate inner stillness, root energy, and effortless strength.',
    deeper: 'The simplest and perhaps most powerful Taoist practice. You stand still, arms slightly raised as if hugging a tree, and you do nothing. Over minutes, the body begins to shake, the mind rebels, discomfort arises — and then something shifts. You find the stillness inside the effort. Your roots grow down, your crown lifts up, and you become what Lao Tzu describes: firm as a mountain, yielding as water.',
    sources: [
      { author: 'Wang Xiangzhai', text: 'Yiquan teachings', era: '1920s-1960s', note: 'Martial artist who distilled standing meditation as the core of internal practice.' },
      { author: 'Lam Kam Chuen', text: 'The Way of Energy', era: '1991', note: 'The most accessible introduction to standing meditation for Western practitioners.' },
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapter 76', note: '"The stiff and unbending is the disciple of death. The soft and yielding is the disciple of life."' },
    ],
    quote: { text: 'A tree that is unbending is easily broken. The hard and stiff will be broken. The soft and supple will prevail.', author: 'Lao Tzu', role: 'Taoist sage' },
    howTo: 'Stand with feet shoulder-width apart, knees slightly bent. Raise arms as if holding a large ball at chest height. Relax everything you can while maintaining the posture. Start with 5 minutes, build to 20+.',
    duration: '5-20 minutes',
    setting: 'any, outdoor preferred',
    timeOfDay: 'morning',
    tripContext: 'Overlook points, beside flowing water, under a significant tree.',
    practiceLevel: 1,
    destinationVariants: {
      zion: {
        name: 'Standing with the Patriarchs',
        summary: 'Standing meditation rooted in Zion\'s earth, with 2,000-foot sandstone towers as your mirror — firm as mountain, yielding as the Virgin River.',
        setting: 'Court of the Patriarchs viewpoint, Canyon Junction bridge, or Pa\'rus Trail riverside',
        tripContext: 'Stand facing Abraham, Isaac, or Jacob Peak — three towers that have stood for millions of years. Feel your own rootedness against the scale of deep time. The Virgin River flows at your back.',
      },
    },
  },

  // Ceremonies
  {
    id: 't-c-water-offering',
    tradition: 'taoism',
    type: 'ceremony',
    principles: ['reverence', 'flow'],
    name: 'Water Offering — Returning to the Source',
    summary: 'A simple ritual of offering water back to water — acknowledging the flow that sustains all life.',
    deeper: 'Water is the central metaphor of Taoism: "The highest good is like water. Water gives life to all things and does not compete." This ceremony mirrors that teaching. You draw water from a natural source, hold it with both hands, set an intention of gratitude, and return it. It\'s a practice of recognizing that everything we receive we eventually return.',
    sources: [
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapter 8', note: '"The highest good is like water. Water gives life to the ten thousand things and does not compete."' },
      { author: 'Lao Tzu', text: 'Tao Te Ching', section: 'Chapter 78', note: '"Nothing in the world is as soft and yielding as water. Yet for dissolving the hard and inflexible, nothing can surpass it."' },
    ],
    quote: { text: 'Nothing is softer or more flexible than water, yet nothing can resist it.', author: 'Lao Tzu', role: 'Taoist sage' },
    howTo: 'At a river, stream, or spring: cup water in both hands. Hold it and breathe. Silently acknowledge what flows through your life — what nourishes you and what you receive freely. Pour it back slowly. Bow.',
    duration: '5-10 minutes',
    setting: 'any natural water source',
    timeOfDay: 'any',
    tripContext: 'River crossings, spring sources, waterfalls, any water encounter.',
    practiceLevel: 0,
  },


  // ─── SHINTO ──────────────────────────────────────────────────────────────────

  // Teachings
  {
    id: 's-t-kami',
    tradition: 'shinto',
    type: 'teaching',
    principles: ['reverence', 'oneness'],
    name: 'Kami — The Sacred in Everything',
    summary: 'Divinity is not above or beyond nature — it lives within it. Every mountain, river, tree, and wind carries a sacred presence.',
    deeper: 'Shinto recognizes kami in all natural phenomena: Amaterasu (the sun), Susanoo (storms), but also the kami of a particular waterfall, a specific ancient tree, the spirit of a mountain. This isn\'t animism in the Western sense — it\'s a recognition that the sacred is not separate from the natural world. When you stand in a grove of old-growth trees and feel something beyond the physical, you\'re sensing what Shinto names directly.',
    sources: [
      { text: 'Kojiki (Record of Ancient Matters)', author: 'Ō no Yasumaro', era: '712 CE', note: 'The origin of kami cosmology; creation of the islands through divine beings.' },
      { author: 'Motoori Norinaga', text: 'Kojiki-den', era: '1798', note: 'Definitive commentary; defines kami as anything that evokes awe.' },
      { author: 'Motohisa Yamakage', text: 'The Essence of Shinto', era: '2006', note: 'Living Shinto priest\'s perspective on kami as experiential reality.' },
      { author: 'Thomas P. Kasulis', text: 'Shinto: The Way Home', era: '2004', note: 'Philosophical analysis of kami as relational, not supernatural.' },
    ],
    quote: { text: 'To the dull mind all nature is leaden. To the illumined mind the whole world burns and sparkles with light.', author: 'Ralph Waldo Emerson', role: 'essayist and poet' },
    frameworks: ['Kojiki', 'Shinto cosmology'],
    tripContext: 'Ancient trees, waterfalls, mountain summits, any landscape that provokes spontaneous awe.',
    practiceLevel: 0,
  },
  {
    id: 's-t-mono-no-aware',
    tradition: 'shinto',
    type: 'teaching',
    principles: ['presence', 'reverence'],
    name: 'Mono no Aware — The Pathos of Things',
    summary: 'A gentle sadness at the beauty of impermanence. The falling petal is more beautiful because it falls.',
    deeper: 'Mono no aware is the bittersweet awareness that everything beautiful is also passing. It\'s not melancholy — it\'s tenderness. Cherry blossoms are celebrated not despite their brief bloom but because of it. A sunset is moving precisely because it won\'t last. This sensibility sharpens attention: if this moment will never come again, you must be fully here for it. It transforms travel from consumption to communion.',
    sources: [
      { author: 'Motoori Norinaga', text: 'Shibun Yōryō; Isonokami Sasamegoto', era: '18th century', note: 'The scholar who formalized mono no aware as a central concept in Japanese aesthetics.' },
      { author: 'Yoshida Kenkō', text: 'Tsurezuregusa (Essays in Idleness)', era: '~1330', note: '"If man were never to fade away... how things would lose their power to move us."' },
      { author: 'Donald Keene', text: 'Japanese Aesthetics', era: '1969', note: 'Scholarly analysis of mono no aware in literature and visual art.' },
    ],
    quote: { text: 'Tell me, what is it you plan to do with your one wild and precious life?', author: 'Mary Oliver', role: 'poet' },
    frameworks: ['Japanese aesthetics', 'Motoori Norinaga'],
    tripContext: 'Last day of trip. Sunset rituals. Seasonal transitions. Wildflower bloom periods.',
    practiceLevel: 0,
  },
  {
    id: 's-t-musubi',
    tradition: 'shinto',
    type: 'teaching',
    principles: ['oneness', 'flow'],
    name: 'Musubi — The Creative Interconnection',
    summary: 'The vital force of becoming — the creative energy that binds all things together and drives life forward.',
    deeper: 'Musubi is one of Shinto\'s deepest concepts: the creative, generative force that connects all of existence. It\'s the power that makes rice grow, rivers flow, and strangers become friends. It\'s both the connection between things and the force that creates new connections. On a journey, musubi is at work in every meaningful encounter, every synchronicity, every moment where separate threads of experience weave together.',
    sources: [
      { text: 'Kojiki', section: 'Book 1', note: 'Takamimusubi and Kamimusubi — two of the first three kami; the creative forces of the cosmos.' },
      { author: 'Motohisa Yamakage', text: 'The Essence of Shinto', era: '2006', section: 'Chapter 3', note: 'Musubi as "the spirit of birth and becoming."' },
      { author: 'Stuart D.B. Picken', text: 'Essentials of Shinto', era: '1994', note: 'Academic treatment of musubi in Shinto theology.' },
    ],
    quote: { text: 'True victory is not defeating an enemy. True victory gives love and changes the enemy\'s heart.', author: 'Morihei Ueshiba', role: 'founder of Aikido' },
    frameworks: ['Kojiki creation myth', 'Takamimusubi and Kamimusubi'],
    tripContext: 'Unexpected connections with other travelers, synchronicities, moments where separate plans converge.',
    practiceLevel: 1,
  },

  // Practices
  {
    id: 's-p-misogi',
    tradition: 'shinto',
    type: 'practice',
    principles: ['reverence', 'presence'],
    name: 'Misogi — Water Purification',
    summary: 'Ritual immersion in cold natural water to purify the body and spirit, washing away accumulated heaviness.',
    deeper: 'Misogi is one of Shinto\'s most embodied practices. Traditionally performed under a waterfall or in a cold river, it shocks the system into raw presence. The cold strips away mental chatter instantly — there is only the water and the body. It\'s not about endurance or cold therapy (though the benefits overlap); it\'s about using the shock of water to cut through everything that isn\'t essential and arrive at a clean, clear state.',
    sources: [
      { text: 'Kojiki', section: 'Book 1', note: 'Izanagi performs the first misogi after returning from Yomi (the underworld), purifying himself in a river.' },
      { author: 'Motohisa Yamakage', text: 'The Essence of Shinto', era: '2006', section: 'Chapter on purification rites', note: 'Misogi as both physical and spiritual cleansing.' },
      { text: 'Engishiki (Procedures of the Engi Era)', era: '927 CE', note: 'Codified Shinto ritual procedures including purification rites.' },
    ],
    quote: { text: 'Water is the driving force of all nature.', author: 'Leonardo da Vinci', role: 'polymath and artist' },
    howTo: 'Find cold natural water — a stream, river, or waterfall. Enter slowly and deliberately. Breathe through the shock. Stay for 1-3 minutes. Upon exiting, stand in silence. Notice the clarity.',
    duration: '5-15 minutes',
    setting: 'natural cold water source',
    timeOfDay: 'morning',
    tripContext: 'River crossings, waterfall encounters, alpine lake dips, cold plunge ritual.',
    practiceLevel: 0,
    destinationVariants: {
      zion: {
        name: 'Virgin River Purification',
        summary: 'Cold immersion in the Virgin River — the same water that carved these 2,000-foot walls carries away everything that isn\'t essential.',
        setting: 'Virgin River near Big Bend, Pa\'rus Trail river access, or The Narrows shallows',
        tripContext: 'The Virgin River runs cold even in summer — snowmelt from the Kolob Plateau. Enter at Big Bend where the river bends wide and shallow. Let the current that carved Zion carry away what you no longer need.',
      },
    },
  },
  {
    id: 's-p-nature-greeting',
    tradition: 'shinto',
    type: 'practice',
    principles: ['reverence'],
    name: 'Aisatsu — Greeting the Kami',
    summary: 'A practice of bowing and offering acknowledgment when entering a forest, crossing a river, or encountering a remarkable natural feature.',
    deeper: 'In Shinto, you bow (gently, from the waist) when passing through a torii gate, when approaching a shrine, when encountering something sacred. Translating this to trail life: bow when entering a forest, pause and acknowledge a river before crossing, offer a silent "thank you" to a mountain when you reach its summit. It sounds simple, but it fundamentally shifts your relationship to the landscape from consumer to guest.',
    sources: [
      { author: 'Motohisa Yamakage', text: 'The Essence of Shinto', era: '2006', note: 'The practice of greetings and acknowledgment in daily Shinto life.' },
      { author: 'Thomas P. Kasulis', text: 'Shinto: The Way Home', era: '2004', note: 'The relational nature of Shinto practice; kami as encountered, not believed in.' },
      { text: 'Jinja Honcho (Association of Shinto Shrines)', note: 'Standard etiquette for shrine visits: two bows, two claps, one bow (nihai-nihakushu-ichihai).' },
    ],
    quote: { text: 'Look deep into nature, and then you will understand everything better.', author: 'Albert Einstein', role: 'physicist' },
    howTo: 'At thresholds and transitions — trailheads, river crossings, forest edges, summits — pause, bow slightly from the waist, and silently acknowledge the presence of the place. "I am here. Thank you for receiving me."',
    duration: '30 seconds',
    setting: 'any natural threshold',
    timeOfDay: 'any',
    tripContext: 'Trailhead entries, summit arrivals, river crossings, forest transitions, sunrise.',
    practiceLevel: 0,
    destinationVariants: {
      zion: {
        name: 'Greeting the Canyon',
        summary: 'A practice of bowing and acknowledgment at each of Zion\'s thresholds — entering the Narrows, cresting a ridge, passing through a slot canyon.',
        setting: 'Narrows entrance, Canyon Overlook trailhead, any slot canyon threshold',
        tripContext: 'Zion is full of natural thresholds: the moment the Narrows walls close in, the arch at Canyon Overlook, the tunnel emergence. Each is a torii gate. Pause, bow, announce: "I am here. Thank you for receiving me."',
      },
    },
  },
  {
    id: 's-p-shinrin-yoku',
    tradition: 'shinto',
    type: 'practice',
    principles: ['presence', 'oneness'],
    name: 'Shinrin-yoku — Forest Bathing',
    summary: 'The Japanese practice of immersing all five senses in the forest atmosphere for healing and restoration.',
    deeper: 'Formalized in Japan in the 1980s but rooted in ancient Shinto reverence for forests, shinrin-yoku is now backed by extensive research showing measurable benefits: reduced cortisol, lower blood pressure, boosted immune function, improved mood. The practice differs from hiking — there is no destination, no pace to maintain. You might cover a quarter mile in an hour. The forest is not a backdrop to your thoughts; it becomes the foreground.',
    sources: [
      { author: 'Dr. Qing Li', text: 'Forest Bathing: How Trees Can Help You Find Health and Happiness', era: '2018', note: 'The leading researcher; 30+ years of forest medicine data.' },
      { author: 'Yoshifumi Miyazaki', text: 'Shinrin-yoku: The Japanese Art of Forest Bathing', era: '2018', note: 'University of Chiba researcher; coined key forest therapy metrics.' },
      { text: 'Japanese Ministry of Agriculture, Forestry and Fisheries', era: '1982', note: 'Originated the term shinrin-yoku as a public health initiative.' },
    ],
    quote: { text: 'Between every two pines is a doorway to a new world.', author: 'John Muir', role: 'naturalist and writer' },
    howTo: 'Walk extremely slowly. Engage each sense deliberately: touch bark and moss, smell the soil, listen to layers of sound (close, middle, far), taste the air, look at patterns of light. Sit for 10+ minutes in one spot. Let the forest initiate the conversation.',
    duration: '60-120 minutes',
    setting: 'dense forest',
    timeOfDay: 'morning or afternoon',
    tripContext: 'Olympic rainforest, old-growth groves, any heavily forested trail section.',
    practiceLevel: 0,
  },

  // Ceremonies
  {
    id: 's-c-threshold-bow',
    tradition: 'shinto',
    type: 'ceremony',
    principles: ['reverence', 'flow'],
    name: 'Threshold Ceremony — Entering Sacred Space',
    summary: 'A formalized practice of pausing at the boundary between the ordinary and the sacred, marking the transition with intention.',
    deeper: 'In Shinto, the torii gate marks the passage from the profane to the sacred. Without a physical gate, we create the transition through ceremony. At the beginning of a hike, a trip, or any journey into wild space, you pause at the threshold, clap twice (to wake the kami and announce your presence), bow, and cross over with intention. The same ceremony marks your return. This practice transforms a parking lot trailhead into a gateway.',
    sources: [
      { text: 'Kojiki', note: 'Torii gates as cosmic thresholds appear throughout the creation narrative.' },
      { author: 'Motohisa Yamakage', text: 'The Essence of Shinto', era: '2006', note: 'The significance of thresholds and boundaries in Shinto practice.' },
      { author: 'Arnold van Gennep', text: 'The Rites of Passage', era: '1909', note: 'Foundational anthropological framework for threshold ceremonies across cultures.' },
    ],
    quote: { text: 'Place is security, space is freedom: we are attached to the one and long for the other.', author: 'Yi-Fu Tuan', role: 'geographer and humanist' },
    howTo: 'Stand at the trailhead or entry point. Take three deep breaths. Clap twice sharply. Bow. State your intention silently. Step across the threshold mindfully. Reverse the ceremony on return.',
    duration: '2-5 minutes',
    setting: 'trailheads, park entrances, any beginning/ending point',
    timeOfDay: 'any',
    tripContext: 'Every trailhead. Beginning and end of each day. Trip opening and closing rituals.',
    practiceLevel: 0,
  },


  // ─── STOICISM ────────────────────────────────────────────────────────────────

  // Teachings
  {
    id: 'st-t-dichotomy',
    tradition: 'stoicism',
    type: 'teaching',
    principles: ['flow', 'presence'],
    name: 'The Dichotomy of Control',
    summary: 'Some things are up to us (our judgments, choices, efforts). Everything else is not. Freedom lives in knowing the difference.',
    deeper: 'Epictetus opens the Enchiridion with this: "Some things are within our power, while others are not." The weather, the trail conditions, other people\'s behavior, the sunset\'s timing — all outside your control. Your attitude, your effort, your attention, your response — entirely within it. This teaching turns every disruption on a trip into a practice. Rain on your hiking day? The weather is not up to you. How you meet it is.',
    sources: [
      { author: 'Epictetus', text: 'Enchiridion (Handbook)', section: 'Chapter 1', note: 'The opening principle; the foundation of all Stoic practice.' },
      { author: 'Epictetus', text: 'Discourses', section: 'Book 1, Chapter 1', note: 'Extended teaching on what is and is not "up to us" (eph\' hēmin).' },
      { author: 'Pierre Hadot', text: 'The Inner Citadel', era: '1998', note: 'Scholarly analysis of the dichotomy as Marcus Aurelius practiced it.' },
      { author: 'Ryan Holiday', text: 'The Obstacle Is the Way', era: '2014', note: 'Modern application of the dichotomy to adversity.' },
    ],
    quote: { text: 'It\'s not what happens to you, but how you react to it that matters.', author: 'Epictetus', role: 'Stoic philosopher' },
    frameworks: ['Enchiridion', 'Epictetus', 'Core Stoic doctrine'],
    tripContext: 'Weather disruptions, crowded trails, closed roads, any moment where plans change.',
    practiceLevel: 0,
  },
  {
    id: 'st-t-memento-mori',
    tradition: 'stoicism',
    type: 'teaching',
    principles: ['presence', 'reverence'],
    name: 'Memento Mori — Remember You Will Die',
    summary: 'Not morbid but vitalizing: the awareness that life is finite makes every moment sacred and every experience precious.',
    deeper: 'Marcus Aurelius wrote, "You could leave life right now. Let that determine what you do and say and think." This is not anxiety — it\'s urgency in the deepest sense. When you remember that you will not stand at this overlook forever, that you will not always have this body, that the people you\'re with are also temporary — everything sharpens. The sandwich at the trailhead becomes a feast. The quiet morning becomes eternity compressed into an hour.',
    sources: [
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 2.4; Book 6.15', note: '"You could leave life right now. Let that determine what you do and say and think."' },
      { author: 'Seneca', text: 'On the Shortness of Life (De Brevitate Vitae)', era: '~49 CE', note: '"It is not that we have a short time to live, but that we waste a great deal of it."' },
      { author: 'Seneca', text: 'Letters from a Stoic', section: 'Letter 49; Letter 101', note: 'Practical application of mortality awareness to daily living.' },
    ],
    quote: { text: 'It is not that we have a short time to live, but that we waste a great deal of it.', author: 'Seneca', role: 'Stoic philosopher and statesman' },
    frameworks: ['Meditations', 'Marcus Aurelius', 'Seneca\'s Letters'],
    tripContext: 'Sunrise rituals, geological time awareness, final day of trip, stargazing (cosmic perspective).',
    practiceLevel: 0,
  },
  {
    id: 'st-t-sympatheia',
    tradition: 'stoicism',
    type: 'teaching',
    principles: ['oneness'],
    name: 'Sympatheia — Universal Connection',
    summary: 'All things are mutually woven together. The thread that holds the universe is a thread of love.',
    deeper: 'Marcus Aurelius: "Meditate often on the interconnectedness and mutual interdependence of all things in the universe." The Stoics saw the cosmos as a single living organism — every part affecting every other. The tree that produces the oxygen you breathe, the water that carved the canyon you stand in, the ancient starlight reaching your eyes — all connected, all one system. This is the Stoic version of oneness, grounded not in mysticism but in rational observation of nature.',
    sources: [
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 6.38; Book 4.40', note: '"Meditate often on the interconnectedness and mutual interdependence of all things in the universe."' },
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 7.9', note: '"All things are woven together and the common bond is sacred."' },
      { author: 'Cleanthes', text: 'Hymn to Zeus', era: '~3rd century BCE', note: 'Early Stoic hymn celebrating the logos that unifies all existence.' },
    ],
    quote: { text: 'Meditate often on the interconnectedness and mutual interdependence of all things in the universe.', author: 'Marcus Aurelius', role: 'Roman Emperor and philosopher' },
    frameworks: ['Meditations Book 6', 'Stoic physics', 'Logos'],
    tripContext: 'Ecological observation points, food chain/web awareness, watershed moments, night sky.',
    practiceLevel: 0,
  },

  // Practices
  {
    id: 'st-p-evening-review',
    tradition: 'stoicism',
    type: 'practice',
    principles: ['presence', 'reverence'],
    name: 'Evening Review — Examen of the Day',
    summary: 'Before sleep, review the day: What went well? Where did I fall short? What am I grateful for? What will I carry forward?',
    deeper: 'Seneca practiced this every night before sleep: "When the light has been removed and my wife has fallen silent... I examine my entire day and go back over what I\'ve done and said." This is not self-judgment but honest self-observation. On a trip, the evening review becomes rich: What did I notice today? When was I most present? When did I check out? What moment deserves to be remembered? What would I do differently?',
    sources: [
      { author: 'Seneca', text: 'On Anger (De Ira)', section: 'Book 3.36', note: '"When the light has been removed and my wife has fallen silent... I examine my entire day."' },
      { author: 'Epictetus', text: 'Discourses', section: 'Book 3.10', note: 'Instructions on daily self-examination.' },
      { author: 'Pierre Hadot', text: 'Philosophy as a Way of Life', era: '1987', note: 'The evening examination as practiced across Stoic, Pythagorean, and Epicurean schools.' },
    ],
    quote: { text: 'We suffer more often in imagination than in reality.', author: 'Seneca', role: 'Stoic philosopher and statesman' },
    howTo: 'At the end of the day, journal or reflect: Three things I\'m grateful for. One moment of presence. One moment I was absent. One thing I learned. One intention for tomorrow.',
    duration: '10-15 minutes',
    setting: 'evening, camp or lodging',
    timeOfDay: 'evening',
    tripContext: 'Evening journaling, campfire reflection, before-sleep ritual.',
    practiceLevel: 0,
  },

  // Ceremonies
  {
    id: 'st-c-view-from-above',
    tradition: 'stoicism',
    type: 'ceremony',
    principles: ['oneness', 'reverence'],
    name: 'The View From Above — Cosmic Meditation',
    summary: 'A contemplation practice where you imaginatively zoom out from your body to see yourself from space, gaining cosmic perspective.',
    deeper: 'Marcus Aurelius practiced this: mentally ascending from his body to view the room, the city, the empire, the earth, and finally the cosmos — seeing his concerns shrink to their true proportion. At a summit or under the night sky, this practice becomes visceral. You don\'t have to imagine the vastness — it\'s right there. The practice is to let that vastness dissolve the artificial importance of your worries.',
    sources: [
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 9.30; Book 12.24', note: 'The view from above as regular contemplative practice.' },
      { author: 'Seneca', text: 'Natural Questions', section: 'Preface to Book 1', note: '"The mind... can find no space wide enough for the range of its imaginings."' },
      { author: 'Pierre Hadot', text: 'Philosophy as a Way of Life', era: '1987', section: 'Chapter 9', note: '"The View from Above" — Hadot traces this exercise across Stoic, Platonic, and Epicurean traditions.' },
    ],
    quote: { text: 'Dwell on the beauty of life. Watch the stars, and see yourself running with them.', author: 'Marcus Aurelius', role: 'Roman Emperor and philosopher' },
    howTo: 'At a summit or under stars: close your eyes. Imagine rising above your body — see the mountain, the region, the continent, the earth, the solar system, the galaxy. Hold that perspective for several minutes. Then slowly return. Notice what feels different.',
    duration: '10-15 minutes',
    setting: 'summit, high overlook, under night sky',
    timeOfDay: 'any',
    tripContext: 'Summit moments, stargazing sessions, any high-altitude overlook.',
    practiceLevel: 0,
  },
  {
    id: 'st-t-logos',
    tradition: 'stoicism',
    type: 'teaching',
    principles: ['oneness', 'flow'],
    name: 'Logos — The Rational Order',
    summary: 'A divine intelligence permeates all of nature. The universe is not chaos — it is a living, rational order that you participate in.',
    deeper: 'Logos is the Stoic foundation. It means reason, but also the animating intelligence woven through everything — the logic in the seasons, the mathematics in a spiral shell, the rhythm in tides. Heraclitus called it the principle by which all things are steered. Marcus Aurelius returned to it constantly: you are not separate from nature\'s intelligence. You are nature, aware of itself. When you watch a river find its course or a hawk ride a thermal, you are watching Logos at work. The same Logos lives in your capacity to reason, to choose, to respond wisely.',
    sources: [
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 4.3; Book 5.32; Book 7.9', note: 'Logos as the ordering principle connecting all things.' },
      { author: 'Heraclitus', text: 'Fragments', section: 'DK B1, B2, B50', era: '~500 BCE', note: 'The pre-Stoic origin of Logos as cosmic reason.' },
      { author: 'Cleanthes', text: 'Hymn to Zeus', era: '~3rd century BCE', note: 'The Logos as divine fire guiding all things toward order.' },
      { author: 'Pierre Hadot', text: 'The Inner Citadel', era: '1998', note: 'The role of Logos in Marcus Aurelius\'s personal philosophy.' },
    ],
    quote: { text: 'The happiness of your life depends upon the quality of your thoughts.', author: 'Marcus Aurelius', role: 'Roman Emperor and philosopher' },
    tripContext: 'Ecological observation — watersheds, food chains, geological formation. Any moment where nature\'s intelligence is visible: the precision of a spider\'s web, the organization of a river delta, the timing of a sunrise.',
    practiceLevel: 1,
  },
  {
    id: 'st-t-four-virtues',
    tradition: 'stoicism',
    type: 'teaching',
    principles: ['reverence', 'flow'],
    name: 'The Four Cardinal Virtues',
    summary: 'Wisdom, courage, justice, and temperance — the only true goods. Everything else is material for practicing them.',
    deeper: 'For the Stoics, virtue is the sole good. Not health, not comfort, not even life itself — only the quality of your character. The four virtues form a complete framework: Sophia (wisdom) — seeing clearly what is true. Andreia (courage) — acting rightly despite fear or difficulty. Dikaiosyne (justice) — treating others with fairness and generosity. Sophrosyne (temperance) — moderation, self-control, right proportion. Marcus Aurelius tested himself against these daily. On a trip, each one finds natural expression: wisdom in reading terrain, courage in cold plunges and exposed trails, justice in how you treat fellow travelers and the land, temperance in knowing when enough is enough.',
    sources: [
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 3.6; Book 5.12; Book 12.15', note: 'The four virtues as the measure of a life well-lived.' },
      { author: 'Epictetus', text: 'Discourses', section: 'Book 2, Chapter 17', note: 'Virtue as the only thing that is truly "up to us."' },
      { author: 'Cicero', text: 'On Duties (De Officiis)', era: '44 BCE', note: 'Roman articulation of the four virtues in practical ethics.' },
      { author: 'Massimo Pigliucci', text: 'How to Be a Stoic', era: '2017', note: 'Modern treatment of practicing the virtues in daily life.' },
    ],
    quote: { text: 'Waste no more time arguing about what a good man should be. Be one.', author: 'Marcus Aurelius', role: 'Roman Emperor and philosopher' },
    tripContext: 'Daily virtue check-in during journaling. Courage at challenging trail sections. Justice through Leave No Trace and community contribution. Temperance in pacing and consumption. Wisdom in all decisions.',
    practiceLevel: 0,
  },
  {
    id: 'st-t-eudaimonia',
    tradition: 'stoicism',
    type: 'teaching',
    principles: ['flow', 'presence'],
    name: 'Eudaimonia — The Flourishing Life',
    summary: 'Not happiness as pleasure, but happiness as living in alignment with your deepest nature — a life of purpose, virtue, and presence.',
    deeper: 'Eudaimonia literally means "good spirit" or "having a good daimon (inner guide)." The Stoics defined it as living according to nature — specifically, living according to reason and virtue. It\'s not about feeling good all the time. It\'s about living well. Marcus Aurelius pursued eudaimonia not through comfort but through honest self-examination, service, and alignment with Logos. On a trip, eudaimonia emerges when the external noise quiets enough that you can feel your own nature again — who you actually are beneath the roles and routines.',
    sources: [
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 7.17; Book 6.16', note: 'Eudaimonia as living according to one\'s rational nature.' },
      { author: 'Aristotle', text: 'Nicomachean Ethics', section: 'Book 1', era: '~340 BCE', note: 'The foundational treatment of eudaimonia that the Stoics built upon.' },
      { author: 'Seneca', text: 'On the Happy Life (De Vita Beata)', era: '~58 CE', note: 'The Stoic argument that virtue alone produces genuine flourishing.' },
    ],
    quote: { text: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.', author: 'Marcus Aurelius', role: 'Roman Emperor and philosopher' },
    tripContext: 'End-of-trip reflection. The question isn\'t "did I have fun?" but "did I live well this week?" Journaling prompt for the final evening.',
    practiceLevel: 1,
  },
  {
    id: 'st-t-oikeiosis',
    tradition: 'stoicism',
    type: 'teaching',
    principles: ['oneness', 'reverence'],
    name: 'Oikeiōsis — Expanding the Circle of Care',
    summary: 'Your circle of concern naturally widens — from self, to family, to community, to all humanity, to all living things.',
    deeper: 'Hierocles described concentric circles of identity: self at the center, then family, extended family, neighbors, city, country, all humanity. The Stoic practice is to continually draw the outer circles inward — to treat strangers like neighbors, neighbors like family. In nature, this circle expands further to include animals, trees, rivers, ecosystems. The trail teaches oikeiōsis naturally: you care for the next hiker by leaving no trace, you care for the watershed by respecting water sources, you care for the forest by walking softly.',
    sources: [
      { author: 'Hierocles', text: 'Elements of Ethics', era: '~2nd century CE', note: 'The original concentric circles model of moral development.' },
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 6.44; Book 11.8', note: 'Expanding moral concern to all rational beings.' },
      { author: 'Martha Nussbaum', text: 'The Therapy of Desire', era: '1994', note: 'Scholarly treatment of oikeiōsis in Stoic and Hellenistic ethics.' },
    ],
    quote: { text: 'We are all just walking each other home.', author: 'Ram Dass', role: 'spiritual teacher' },
    tripContext: 'Leave No Trace ethics, trail maintenance, communal cooking, sharing resources. The question: how wide can my circle of care extend today?',
    practiceLevel: 1,
  },
  {
    id: 'st-p-obstacle',
    tradition: 'stoicism',
    type: 'practice',
    principles: ['flow', 'reverence'],
    name: 'Turning the Obstacle — The Inner Citadel',
    summary: 'Every impediment to action advances the action. What stands in the way becomes the way.',
    deeper: 'Marcus Aurelius wrote: "The impediment to action advances action. What stands in the way becomes the way." This is active, not passive. It\'s not just accepting difficulty — it\'s using difficulty as fuel. The closed trail reveals the unmarked one. The rainstorm produces the waterfall. The physical exhaustion strips away everything but presence. The practice is to catch yourself resisting what\'s happening and ask: how is this exactly what I needed? How can this serve my growth?',
    sources: [
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 5.20', note: '"The impediment to action advances action. What stands in the way becomes the way."' },
      { author: 'Marcus Aurelius', text: 'Meditations', section: 'Book 8.47; Book 10.33', note: 'Extended treatment of using obstacles as material for virtue.' },
      { author: 'Ryan Holiday', text: 'The Obstacle Is the Way', era: '2014', note: 'Modern popularization of this core Stoic practice.' },
    ],
    quote: { text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius', role: 'Roman Emperor and philosopher' },
    howTo: 'When something goes wrong on the trip, pause. Ask three questions: (1) Is this within my control? (2) What virtue can I practice right now? (3) How might this be better than what I planned? Journal the answer.',
    tripContext: 'Any disruption: trail closures, weather changes, physical difficulty, group friction. The signature Stoic move — turning lead into gold.',
    practiceLevel: 0,
    timeOfDay: 'any',
    duration: '5-10 min',
  },
  {
    id: 'st-c-evening-fire',
    tradition: 'stoicism',
    type: 'ceremony',
    principles: ['presence', 'reverence'],
    name: 'Fireside Discourse — Philosophical Dialogue',
    summary: 'Gathering around a fire for honest conversation about how to live well — the original format of Stoic teaching.',
    deeper: 'Stoicism was born in conversation. Zeno taught at the Stoa Poikile (painted porch). Epictetus lectured in evening sessions. Marcus Aurelius wrote the Meditations as a dialogue with himself by lamplight. The campfire recreates this primal setting: fire, darkness, honest talk. Not small talk — real questions. What did you learn today? What are you afraid of? What does a good life actually look like? The fire gives permission to go deep in ways that daylight conversations rarely do.',
    sources: [
      { author: 'Epictetus', text: 'Discourses', note: 'Originally delivered as evening lectures to students.' },
      { author: 'Seneca', text: 'Letters from a Stoic', section: 'Letter 6', note: '"I feel that I am being not only reformed but transformed. Sharing philosophy multiplies it."' },
      { author: 'Pierre Hadot', text: 'What Is Ancient Philosophy?', era: '1995', note: 'Philosophy as communal practice, not solitary study.' },
    ],
    quote: { text: 'No man was ever wise by chance.', author: 'Seneca', role: 'Stoic philosopher and statesman' },
    tripContext: 'Evening campfire gatherings. Prompt one question per night. Let the conversation go where it goes. No phones, no agenda — just the fire and the question.',
    practiceLevel: 0,
  },


  // ─── CROSS-CULTURAL WISDOM ──────────────────────────────────────────────────

  {
    id: 'cc-p-sauna',
    tradition: 'crossCultural',
    type: 'practice',
    principles: ['presence', 'reverence'],
    name: 'Löyly — Finnish Sauna',
    summary: 'A 2,000-year-old Finnish tradition of purification through heat, steam, and stillness — not a luxury amenity but a sacred practice.',
    deeper: 'In Finnish culture, the sauna is the most sacred room in the house. Löyly — the steam that rises when water is thrown on hot stones — is considered a living spirit. The sauna was where babies were born, the dead were washed, and the most important decisions were made. The practice is simple: heat, sweat, be still, listen. No talking about business. No phones. Just the body meeting the heat and slowly, inevitably, letting go. The Finns say "saunassa ollaan kuin kirkossa" — in the sauna, behave as in church. Paired with cold exposure (lake, snow, river), the heat-cold cycle produces a profound neurochemical reset: endorphins, norepinephrine, deep parasympathetic relaxation. It is perhaps the most accessible doorway to presence available.',
    sources: [
      { author: 'Mikkel Aaland', text: 'Sweat: The Illustrated History and Description of the Finnish Sauna', era: '1978', note: 'Comprehensive cultural history of sauna traditions worldwide.' },
      { text: 'UNESCO Intangible Cultural Heritage', note: 'Finnish sauna culture inscribed in 2020 as a living heritage practice.' },
      { author: 'Dr. Jari Laukkanen', text: 'Sauna Bathing and Health (JAMA Internal Medicine)', era: '2015', note: 'Landmark study linking regular sauna use to reduced cardiovascular mortality.' },
      { author: 'Rhonda Patrick', text: 'FoundMyFitness: Sauna and Health', note: 'Accessible overview of the physiological benefits of heat stress.' },
    ],
    quote: { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott', role: 'author' },
    howTo: 'Heat the sauna to 80-100°C. Sit in silence. Throw water on the stones to release löyly. Stay 10-20 minutes. Exit to cold water (river, lake, cold shower). Rest. Repeat 2-3 rounds. The final rest — wrapped in a blanket, watching the sky — is where the transformation lands.',
    tripContext: 'Rest days, post-hike recovery, evening ritual. Pair with cold plunge in natural water. Ideal for Pacific Northwest, mountain, and lakeside settings.',
    practiceLevel: 0,
    timeOfDay: 'evening',
    duration: '60-90 min',
  },
  {
    id: 'cc-c-talking-circle',
    tradition: 'crossCultural',
    type: 'ceremony',
    principles: ['oneness', 'reverence'],
    name: 'Talking Circle',
    summary: 'A shared practice across many cultures: a held object passes around the circle. Only the holder speaks. Everyone else listens — fully, without preparing a response.',
    deeper: 'The talking circle appears across Indigenous North American, Celtic, African, and many other traditions because it solves a universal human problem: how to truly hear each other. The rules are ancient and simple. Sit in a circle. A stone, stick, or feather passes clockwise. Only the person holding it may speak. There is no cross-talk, no responding, no fixing. When the object reaches you, speak from the heart or pass it silently. The circle holds everything. What happens in group travel settings is remarkable — people who met two days ago find themselves sharing with a depth that surprises them. The format gives permission. The fire or landscape holds the container.',
    sources: [
      { author: 'Christina Baldwin', text: 'Calling the Circle: The First and Future Culture', era: '1998', note: 'Modern guide to circle practice drawn from global traditions.' },
      { author: 'Jack Zimmerman & Virginia Coyle', text: 'The Way of Council', era: '1996', note: 'Council practice as developed at the Ojai Foundation, drawing on Indigenous and contemplative traditions.' },
    ],
    quote: { text: 'The world is a mountain, in which your words are echoed back to you.', author: 'Rumi', role: 'Sufi poet' },
    tripContext: 'First evening (introduction circle), final evening (closing circle), any time the group needs to process a shared experience. Around a fire is ideal. One question per circle.',
    practiceLevel: 0,
  },
  {
    id: 'cc-p-dadirri',
    tradition: 'crossCultural',
    type: 'practice',
    principles: ['presence', 'oneness'],
    name: 'Dadirri — Deep Listening',
    summary: 'An Aboriginal Australian practice of deep, contemplative listening — not to thoughts or people, but to land, silence, and the quiet knowing within.',
    deeper: 'Dadirri was gifted to the wider world by Miriam-Rose Ungunmerr-Baumann, a Ngangiwumirr elder from the Daly River region. She describes it as "inner, deep listening and quiet, still awareness." It is different from Buddhist mindfulness in a crucial way: dadirri is not primarily about observing your own mind. It is about listening to country — to the land itself, to the rhythm of seasons, to the intelligence of place. "We cannot hurry the river. We have to move with its current and understand its ways." In a travel context, dadirri transforms the relationship with landscape from sightseeing to communion. You stop looking at the canyon and start listening to it.',
    sources: [
      { author: 'Miriam-Rose Ungunmerr-Baumann', text: 'Dadirri: Inner Deep Listening and Quiet Still Awareness', era: '1988', note: 'The original address in which this practice was shared with non-Indigenous Australians.' },
      { author: 'Miriam-Rose Ungunmerr-Baumann', text: 'Dadirri — A Reflection (updated)', era: '2002', note: 'Extended reflection on dadirri as a gift from Aboriginal culture to the modern world.' },
      { author: 'Tyson Yunkaporta', text: 'Sand Talk: How Indigenous Thinking Can Save the World', era: '2019', note: 'Broader context of Aboriginal ways of knowing and deep pattern recognition.' },
    ],
    quote: { text: 'We cannot hurry the river. We have to move with its current and understand its ways.', author: 'Miriam-Rose Ungunmerr-Baumann', role: 'Ngangiwumirr elder' },
    howTo: 'Find a place in the landscape that draws you. Sit. Do not meditate in the traditional sense — do not watch your breath or observe your thoughts. Instead, listen outward. Listen to the land. What is it saying? What rhythm does it have? Stay for at least 20 minutes. The knowing comes not from thinking but from attending.',
    tripContext: 'Solo sit spots, river listening, any moment where the landscape feels alive and communicative. Especially powerful in old-growth forests, canyon bottoms, and beside flowing water.',
    practiceLevel: 0,
    destinationVariants: {
      zion: {
        name: 'Canyon Deep Listening',
        summary: 'Sitting in the canyon bottom, listening not to your thoughts but to Zion itself — the river\'s voice, the wind through sandstone fins, the echoes that only silence reveals.',
        setting: 'The Narrows cathedral section, Big Bend alcove, or Weeping Rock amphitheater',
        tripContext: 'Zion\'s canyon acoustics are extraordinary — sound bounces off sandstone walls, water echoes in slot canyons, wind hums through fins and arches. Sit in the Narrows and listen. The canyon has been speaking for millions of years.',
      },
    },
    timeOfDay: 'any',
    duration: '20-45 min',
  },
  {
    id: 'cc-c-ayahuasca',
    tradition: 'crossCultural',
    type: 'ceremony',
    principles: ['oneness', 'reverence'],
    name: 'Ayahuasca — The Vine of the Soul',
    summary: 'A sacred Amazonian plant medicine ceremony guided by trained curanderos, used for millennia to access deep healing, vision, and connection with the living intelligence of nature.',
    deeper: 'Ayahuasca (Banisteriopsis caapi + Psychotria viridis) has been used by Indigenous Amazonian peoples for at least 1,000 years — and likely far longer. The name means "vine of the soul" or "vine of the dead" in Quechua. It is not a recreational substance. It is a sacrament, always taken in ceremony with an experienced guide (curandero/ayahuascero) who holds the space through icaros (medicine songs). The experience often involves intense physical purging, vivid visions, encounters with plant intelligence, and profound emotional processing. Many describe it as years of therapy compressed into a single night. The ceremony demands rigorous preparation (dieta), intention, and integration afterward. It is increasingly available through legitimate retreat centers in South America and, in some jurisdictions, through religious exemptions.',
    sources: [
      { author: 'Stephan V. Beyer', text: 'Singing to the Plants: A Guide to Mestizo Shamanism in the Upper Amazon', era: '2009', note: 'Comprehensive ethnobotanical and cultural account of ayahuasca traditions.' },
      { author: 'Jeremy Narby', text: 'The Cosmic Serpent: DNA and the Origins of Knowledge', era: '1998', note: 'Anthropologist\'s exploration of ayahuasca and Indigenous knowledge systems.' },
      { author: 'Gabor Maté', text: 'The Myth of Normal', era: '2022', note: 'Physician\'s perspective on ayahuasca as a tool for trauma healing.' },
      { text: 'Frontiers in Pharmacology', note: 'Growing body of clinical research on ayahuasca\'s effects on depression, PTSD, and addiction.' },
    ],
    quote: { text: 'The privilege of a lifetime is to become who you truly are.', author: 'Carl Jung', role: 'psychiatrist and author' },
    tripContext: 'Not integrated into standard Lila itineraries. Offered as a separate, dedicated ceremonial experience with vetted practitioners. Requires preparation (dieta), set/setting, and integration support afterward.',
    practiceLevel: 3,
  },
  {
    id: 'cc-c-velada',
    tradition: 'crossCultural',
    type: 'ceremony',
    principles: ['presence', 'oneness'],
    name: 'Velada — Psilocybin Mushroom Ceremony',
    summary: 'A Mazatec healing ceremony using psilocybin mushrooms (niños santos — "holy children") to access inner vision, emotional release, and communion with the sacred.',
    deeper: 'The velada tradition comes from the Mazatec people of Oaxaca, Mexico, and was most famously practiced by the curandera María Sabina. The ceremony takes place at night, in darkness, guided by chanting and prayer. Sabina called the mushrooms "the little ones who spring forth" and described them as intermediaries between the human and divine worlds. Modern research at Johns Hopkins, NYU, and Imperial College London has validated what the Mazatec knew: psilocybin, in the right set and setting, can produce mystical experiences indistinguishable from spontaneous spiritual breakthroughs — with lasting positive effects on wellbeing, openness, and connection. The ceremony is not about "tripping." It is about listening, with the mushroom as teacher and the darkness as container.',
    sources: [
      { author: 'María Sabina', text: 'Vida de María Sabina (oral tradition)', note: 'The Mazatec curandera whose velada ceremonies brought psilocybin to Western awareness.' },
      { author: 'R. Gordon Wasson', text: 'Seeking the Magic Mushroom (Life magazine)', era: '1957', note: 'First Western account of the Mazatec velada; controversial but historically significant.' },
      { author: 'Roland Griffiths et al.', text: 'Psilocybin produces substantial and sustained decreases in depression (JAMA Psychiatry)', era: '2016', note: 'Landmark Johns Hopkins study on psilocybin-assisted therapy.' },
      { author: 'Michael Pollan', text: 'How to Change Your Mind', era: '2018', note: 'Accessible overview of the history, science, and experience of psilocybin.' },
    ],
    quote: { text: 'The mind, once stretched by a new idea, never returns to its original dimensions.', author: 'Oliver Wendell Holmes', role: 'author and physician' },
    tripContext: 'Not integrated into standard itineraries. Offered as a separate ceremonial experience where legally permitted, with trained facilitators, preparation protocols, and integration support.',
    practiceLevel: 3,
  },
  {
    id: 'cc-c-cacao',
    tradition: 'crossCultural',
    type: 'ceremony',
    principles: ['presence', 'reverence'],
    name: 'Cacao Ceremony — Heart Opening',
    summary: 'An ancient Mesoamerican ritual using ceremonial-grade cacao as a gentle heart-opening medicine — accessible, legal, and deeply nourishing.',
    deeper: 'The Maya and Aztec civilizations revered cacao as a sacred plant — Theobroma cacao literally means "food of the gods." It was used in ceremony, as currency, and as a ritual offering for at least 3,000 years. Ceremonial cacao is not hot chocolate. It is minimally processed, high in theobromine (a gentle stimulant and vasodilator), and prepared with intention. The theobromine opens blood flow to the heart, producing a warm, expansive feeling that participants consistently describe as "heart opening." Combined with breathwork, movement, or meditation, cacao creates a gentle but real shift in state — more connected, more present, more emotionally available. It is the most accessible plant medicine: legal everywhere, requires no guide (though ceremony enhances it), and carries none of the intensity or risk of psychedelics. It is an ideal entry point and a beautiful morning or evening ritual on any trip.',
    sources: [
      { text: 'Journal of Archaeological Science', note: 'Evidence of cacao use in Mesoamerican ritual dating to ~1900 BCE.' },
      { author: 'Sophie D. Coe & Michael D. Coe', text: 'The True History of Chocolate', era: '1996', note: 'Definitive cultural history of cacao from Olmec civilization through the present.' },
      { author: 'Keith Wilson (Belize)', text: 'Cacao Ceremonies and the Living Tradition', note: 'Modern practitioner maintaining the Mayan ceremonial cacao lineage.' },
    ],
    quote: { text: 'When you do things from your soul, you feel a river moving in you, a joy.', author: 'Rumi', role: 'Sufi poet' },
    howTo: 'Prepare 40-50g ceremonial-grade cacao with hot water (not milk). Set an intention. Drink slowly, holding the cup in both hands. Sit in silence for 10 minutes as the theobromine opens. Then move into breathwork, journaling, gentle movement, or group sharing. The cacao does the rest.',
    tripContext: 'Morning ritual, group bonding, pre-breathwork preparation, rest day ceremony. Pairs beautifully with sunrise settings, communal meals, and creative expression.',
    practiceLevel: 0,
    timeOfDay: 'morning',
    duration: '45-90 min',
  },
];


// ═══════════════════════════════════════════════════════════════════════════════
// QUERY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get practices matching given criteria.
 * All filter params are optional — omit to include all.
 * 
 * @param {Object} filters
 * @param {string}   [filters.tradition]     - tradition id
 * @param {string}   [filters.principle]     - principle id
 * @param {string}   [filters.type]          - 'teaching' | 'practice' | 'ceremony'
 * @param {number}   [filters.maxLevel]      - max practiceLevel (0-3)
 * @param {string}   [filters.timeOfDay]     - 'dawn' | 'morning' | 'afternoon' | 'evening'
 * @param {string}   [filters.setting]       - keyword to match against setting field
 * @returns {Array} matching entries
 */
export function getPractices(filters = {}) {
  return ENTRIES.filter(entry => {
    if (filters.tradition && entry.tradition !== filters.tradition) return false;
    if (filters.principle && !entry.principles.includes(filters.principle)) return false;
    if (filters.type && entry.type !== filters.type) return false;
    if (filters.maxLevel !== undefined && entry.practiceLevel > filters.maxLevel) return false;
    if (filters.timeOfDay && entry.timeOfDay && entry.timeOfDay !== filters.timeOfDay) return false;
    if (filters.setting && entry.setting && !entry.setting.toLowerCase().includes(filters.setting.toLowerCase())) return false;
    return true;
  });
}

/**
 * Get all entries for a specific tradition, grouped by type.
 */
export function getTraditionOverview(traditionId) {
  const entries = getPractices({ tradition: traditionId });
  return {
    tradition: TRADITIONS[traditionId],
    teachings: entries.filter(e => e.type === 'teaching'),
    practices: entries.filter(e => e.type === 'practice'),
    ceremonies: entries.filter(e => e.type === 'ceremony'),
  };
}

/**
 * Get all entries for a specific principle, grouped by tradition.
 */
export function getPrincipleOverview(principleId) {
  const entries = getPractices({ principle: principleId });
  const byTradition = {};
  for (const entry of entries) {
    if (!byTradition[entry.tradition]) byTradition[entry.tradition] = [];
    byTradition[entry.tradition].push(entry);
  }
  return {
    principle: PRINCIPLES[principleId],
    byTradition,
  };
}

/**
 * Get practices tailored for an itinerary based on PlanMyTrip form data.
 * 
 * Maps user selections to appropriate practices:
 *   - intentions → principles
 *   - practiceLevel → maxLevel filter
 *   - practices (interests) → type/setting preferences
 *   - movement/pacing → active vs. contemplative balance
 * 
 * @param {Object} formData - from PlanMyTrip state
 * @returns {Object} curated practices organized for itinerary generation
 */
export function getPracticesForItinerary(formData) {
  const {
    intentions = [],
    practiceLevel = 1,
    practices: practiceInterests = [],
    movement = 50,
    pacing = 50,
    destination,
  } = formData;

  // Map intentions → principles
  const intentionToPrinciple = {
    peace: ['presence', 'flow'],
    transformation: ['reverence', 'oneness'],
    connection: ['oneness', 'reverence'],
    reset: ['flow', 'presence'],
  };

  const activePrinciples = new Set();
  for (const intention of intentions) {
    const mapped = intentionToPrinciple[intention] || [];
    mapped.forEach(p => activePrinciples.add(p));
  }
  // Default to all if nothing selected
  if (activePrinciples.size === 0) {
    Object.keys(PRINCIPLES).forEach(p => activePrinciples.add(p));
  }

  // Map practice interests → preferred types/settings
  const interestToSettings = {
    yoga: { tradition: 'hinduism', types: ['practice'] },
    breathwork: { types: ['practice'], keywords: ['breath', 'pranayama'] },
    coldPlunge: { keywords: ['cold', 'water', 'misogi'] },
    meditation: { types: ['practice', 'teaching'] },
    hiking: { keywords: ['trail', 'walk', 'hike', 'forest'] },
    stargazing: { keywords: ['star', 'night', 'cosmic', 'sky'] },
    localFarms: { keywords: ['farm', 'local', 'harvest', 'agricultural'] },
    soundBath: { keywords: ['sound', 'resonance'] },
    sauna: { keywords: ['heat', 'fire', 'voluntary discomfort'] },
    service: { keywords: ['service', 'dana', 'generosity'] },
    plantMedicine: { keywords: ['plant', 'ceremony'] },
    massage: { keywords: ['massage', 'bodywork', 'touch', 'spa'] },
  };

  // Score and select entries
  const scored = ENTRIES
    .filter(entry => entry.practiceLevel <= practiceLevel)
    .map(entry => {
      let score = 0;

      // Principle alignment (0-3 points per matching principle)
      for (const principle of entry.principles) {
        if (activePrinciples.has(principle)) score += 3;
      }

      // Practice interest alignment (0-5 points)
      for (const interest of practiceInterests) {
        const mapping = interestToSettings[interest];
        if (!mapping) continue;
        if (mapping.tradition && entry.tradition === mapping.tradition) score += 3;
        if (mapping.types && mapping.types.includes(entry.type)) score += 2;
        if (mapping.keywords) {
          const text = `${entry.name} ${entry.summary} ${entry.setting || ''} ${entry.tripContext || ''}`.toLowerCase();
          for (const kw of mapping.keywords) {
            if (text.includes(kw)) score += 2;
          }
        }
      }

      // Movement/pacing influence
      const isActive = entry.type === 'practice' && (entry.setting || '').includes('outdoor');
      const isContemplative = entry.type === 'teaching' || (entry.duration || '').includes('45');
      if (movement > 60 && isActive) score += 1;
      if (movement < 40 && isContemplative) score += 1;
      if (pacing < 40 && entry.type === 'ceremony') score += 1;

      return { ...entry, score };
    })
    .sort((a, b) => b.score - a.score);

  // Select top entries, ensuring variety
  const selected = {
    morningPractice: null,
    eveningPractice: null,
    dailyTeaching: [],
    ceremonies: [],
    allRelevant: scored.slice(0, 20),
  };

  // Best morning practice
  const morningCandidates = scored.filter(e => 
    e.type === 'practice' && (e.timeOfDay === 'dawn' || e.timeOfDay === 'morning')
  );
  if (morningCandidates.length > 0) selected.morningPractice = morningCandidates[0];

  // Best evening practice
  const eveningCandidates = scored.filter(e => 
    e.type === 'practice' && (e.timeOfDay === 'evening')
  );
  if (eveningCandidates.length > 0) selected.eveningPractice = eveningCandidates[0];

  // Top teachings (1 per day, variety of traditions)
  const usedTraditions = new Set();
  for (const entry of scored.filter(e => e.type === 'teaching')) {
    if (selected.dailyTeaching.length >= 5) break;
    if (!usedTraditions.has(entry.tradition)) {
      selected.dailyTeaching.push(entry);
      usedTraditions.add(entry.tradition);
    }
  }

  // Ceremonies (1-2 for the trip)
  selected.ceremonies = scored.filter(e => e.type === 'ceremony').slice(0, 2);

  return {
    principles: Array.from(activePrinciples),
    practiceLevel,
    ...selected,
  };
}

/**
 * Get a random daily reflection prompt based on active principles.
 */
export function getDailyReflection(principleId) {
  const principle = PRINCIPLES[principleId];
  if (!principle) return null;

  const teachings = getPractices({ principle: principleId, type: 'teaching' });
  const random = teachings[Math.floor(Math.random() * teachings.length)];

  return {
    principle: principle.name,
    question: principle.question,
    teaching: random ? {
      name: random.name,
      tradition: TRADITIONS[random.tradition].shortName,
      summary: random.summary,
    } : null,
  };
}

/**
 * Get summary statistics for the service.
 */
export function getServiceStats() {
  const stats = {
    totalEntries: ENTRIES.length,
    byTradition: {},
    byType: { teaching: 0, practice: 0, ceremony: 0 },
    byPrinciple: {},
  };
  
  for (const id of Object.keys(TRADITIONS)) stats.byTradition[id] = 0;
  for (const id of Object.keys(PRINCIPLES)) stats.byPrinciple[id] = 0;

  for (const entry of ENTRIES) {
    stats.byTradition[entry.tradition]++;
    stats.byType[entry.type]++;
    for (const p of entry.principles) stats.byPrinciple[p]++;
  }

  return stats;
}
