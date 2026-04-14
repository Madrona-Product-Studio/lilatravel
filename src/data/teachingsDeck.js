/**
 * teachingsDeck.js — Lila Teachings Level 2: Traditions & Teachings
 * ═════════════════════════════════════════════════════════════════
 *
 * 30 concept cards across 6 traditions. All content marked PLACEHOLDER
 * needs to be filled in from the design session.
 *
 * Card schema differs from the movements deck — these are single-face
 * reading cards (no flip), organized by wisdom tradition.
 */

export const TRADITIONS = [
  {
    id: 'hinduism',
    name: 'Hinduism & Yoga',
    symbol: 'ॐ',
    origin: 'India · ~1500 BCE onward',
    color: '#C4956A',
    chapterNumber: 'CHAPTER ONE',
    description: 'PLACEHOLDER',
    concepts: ['Yamas', 'Prānāyāma', 'Samādhi', 'Ātman is Brahman', 'Bhakti', 'Sūrya Namaskār', 'Seva'],
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    symbol: '☸',
    origin: 'India · 5th century BCE · spread across Asia',
    color: '#7A9E8A',
    chapterNumber: 'CHAPTER TWO',
    description: 'PLACEHOLDER',
    concepts: ['Vipassanā', 'Shoshin', 'Sati', 'Śūnyatā', 'Pratītyasamutpāda', 'Anicca', 'Animittā', 'Apraṇihita', 'Tonglen', 'Mettā', 'Bodhicitta', 'Ichi-go Ichi-e'],
  },
  {
    id: 'taoism',
    name: 'Taoism & Zen',
    symbol: '道',
    origin: 'China · 4th century BCE · Japan · 12th century CE',
    color: '#6B8FA8',
    chapterNumber: 'CHAPTER THREE',
    description: 'PLACEHOLDER',
    concepts: ['Lǐ', 'Wu Wei', 'Mushin'],
  },
  {
    id: 'shinto',
    name: 'Shinto',
    symbol: '⛩',
    origin: 'Japan · origins prehistoric · formalized ~700 CE',
    color: '#8A7BA8',
    chapterNumber: 'CHAPTER FOUR',
    description: 'PLACEHOLDER',
    concepts: ['Musubi', 'Misogi', 'Satoyama', 'Mono no Aware'],
  },
  {
    id: 'stoicism',
    name: 'Stoicism',
    symbol: 'Λ',
    origin: 'Greece · 3rd century BCE · Rome · 1st–2nd century CE',
    color: '#8A8A78',
    chapterNumber: 'CHAPTER FIVE',
    description: 'PLACEHOLDER',
    concepts: ['Sympatheia', 'Amor Fati', 'Memento Mori'],
  },
  {
    id: 'crosscultural',
    name: 'Cross-Cultural',
    symbol: '✦',
    origin: 'Southern Africa · Bantu-speaking peoples',
    color: '#9A7B6B',
    chapterNumber: 'WILD CARD',
    description: 'PLACEHOLDER',
    concepts: ['Ubuntu'],
  },
];

export const CARDS = [
  // ─── Hinduism & Yoga ───────────────────────────────────────────────────────
  { id: 'yamas', tradition: 'hinduism', name: 'Yamas', pronunciation: 'YAH-mahs', tag: 'ETHICAL FOUNDATION', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'pranayama', tradition: 'hinduism', name: 'Prānāyāma', pronunciation: 'prah-nah-YAH-mah', tag: 'BREATH SCIENCE', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'samadhi', tradition: 'hinduism', name: 'Samādhi', pronunciation: 'sah-MAH-dee', tag: 'ABSORPTION', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'atman', tradition: 'hinduism', name: 'Ātman is Brahman', pronunciation: 'AHT-man · BRAH-man', tag: 'CORE TEACHING', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'bhakti', tradition: 'hinduism', name: 'Bhakti', pronunciation: 'BHAK-tee', tag: 'DEVOTION', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'surya', tradition: 'hinduism', name: 'Sūrya Namaskār', pronunciation: 'SOOR-yah nah-mah-SKAR', tag: 'SOLAR SALUTATION', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'seva', tradition: 'hinduism', name: 'Seva', pronunciation: 'SAY-vah', tag: 'SELFLESS SERVICE', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },

  // ─── Buddhism ──────────────────────────────────────────────────────────────
  { id: 'vipassana', tradition: 'buddhism', name: 'Vipassanā', pronunciation: 'vi-PAH-sah-nah', tag: 'INSIGHT MEDITATION', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'shoshin', tradition: 'buddhism', name: 'Shoshin', pronunciation: 'SHOW-shin', tag: "BEGINNER'S MIND", origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'sati', tradition: 'buddhism', name: 'Sati', pronunciation: 'SAH-tee', tag: 'MINDFULNESS', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'sunyata', tradition: 'buddhism', name: 'Śūnyatā', pronunciation: 'shoon-YAH-tah', tag: 'EMPTINESS', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'pratitya', tradition: 'buddhism', name: 'Pratītyasamutpāda', pronunciation: 'prah-TEET-yah-sah-moot-PAH-dah', tag: 'DEPENDENT ORIGINATION', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'anicca', tradition: 'buddhism', name: 'Anicca', pronunciation: 'ah-NEE-chah', tag: 'IMPERMANENCE', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'animitta', tradition: 'buddhism', name: 'Animittā', pronunciation: 'ah-nee-MIT-tah', tag: 'SIGNLESSNESS', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'apranihita', tradition: 'buddhism', name: 'Apraṇihita', pronunciation: 'ah-prah-NEE-hi-tah', tag: 'WISHLESSNESS', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'tonglen', tradition: 'buddhism', name: 'Tonglen', pronunciation: 'TONG-len', tag: 'GIVING AND TAKING', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'metta', tradition: 'buddhism', name: 'Mettā', pronunciation: 'MET-tah', tag: 'LOVING-KINDNESS', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'bodhicitta', tradition: 'buddhism', name: 'Bodhicitta', pronunciation: 'boh-dee-CHIT-tah', tag: 'AWAKENING MIND', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'ichigoichie', tradition: 'buddhism', name: 'Ichi-go Ichi-e', pronunciation: 'EE-chee-go EE-chee-eh', tag: 'ONE TIME, ONE MEETING', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },

  // ─── Taoism & Zen ──────────────────────────────────────────────────────────
  { id: 'li', tradition: 'taoism', name: 'Lǐ', pronunciation: 'lee', tag: 'NATURAL PATTERN', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'wuwei', tradition: 'taoism', name: 'Wu Wei', pronunciation: 'woo way', tag: 'EFFORTLESS ACTION', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'mushin', tradition: 'taoism', name: 'Mushin', pronunciation: 'MOO-shin', tag: 'NO MIND', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },

  // ─── Shinto ────────────────────────────────────────────────────────────────
  { id: 'musubi', tradition: 'shinto', name: 'Musubi', pronunciation: 'moo-SOO-bee', tag: 'GENERATIVE FORCE', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'misogi', tradition: 'shinto', name: 'Misogi', pronunciation: 'mee-SO-ghee', tag: 'PURIFICATION', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'satoyama', tradition: 'shinto', name: 'Satoyama', pronunciation: 'SAH-toh-yah-mah', tag: 'THE IN-BETWEEN LAND', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'monoaware', tradition: 'shinto', name: 'Mono no Aware', pronunciation: 'MOH-no no ah-WAH-reh', tag: 'THE PATHOS OF THINGS', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },

  // ─── Stoicism ──────────────────────────────────────────────────────────────
  { id: 'sympatheia', tradition: 'stoicism', name: 'Sympatheia', pronunciation: 'sim-PAH-thee-ah', tag: 'UNIVERSAL SYMPATHY', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'amorfati', tradition: 'stoicism', name: 'Amor Fati', pronunciation: 'AH-mor FAH-tee', tag: 'LOVE OF FATE', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
  { id: 'mementomori', tradition: 'stoicism', name: 'Memento Mori', pronunciation: 'meh-MEN-toh MOR-ee', tag: 'REMEMBER DEATH', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },

  // ─── Cross-Cultural ────────────────────────────────────────────────────────
  { id: 'ubuntu', tradition: 'crosscultural', name: 'Ubuntu', pronunciation: 'oo-BOON-too', tag: 'RELATIONAL SELFHOOD', origin: 'PLACEHOLDER', teaching: 'PLACEHOLDER', journey: 'PLACEHOLDER', quote: 'PLACEHOLDER', quoteAuthor: 'PLACEHOLDER' },
];

// ─── Derived data ────────────────────────────────────────────────────────────

/** Get cards for a given tradition */
export function getCardsByTradition(traditionId) {
  return CARDS.filter(c => c.tradition === traditionId);
}

/** Build flat screen sequence: cover → per tradition: [chapter → cards] */
export function buildScreens() {
  const screens = [{ type: 'cover' }];

  TRADITIONS.forEach((tradition, ti) => {
    const cards = getCardsByTradition(tradition.id);
    screens.push({ type: 'chapter', tradition, traditionIndex: ti });

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
