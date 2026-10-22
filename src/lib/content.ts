import laDama from "@/assets/paintings/la-dama.jpg";
import laDevota from "@/assets/paintings/la-devota.jpg";
import laMaddalena from "@/assets/paintings/la-maddalena.jpg";
import laTentazione from "@/assets/paintings/la-tentazione.jpg";
import ofelia from "@/assets/paintings/ofelia.jpg";

export const paintings = { laDama, laDevota, laMaddalena, laTentazione, ofelia };

// Placeholder contact details: replace before going live.
export const CONTACT = {
  email: "ciao@avorio.it",
  instagram: "#",
  pinterest: "#",
};

export const NAV = [
  { label: "Il Cioccolato", href: "#story" },
  { label: "Making of", href: "#making" },
  { label: "Collezione", href: "#collezione" },
] as const;

export const HERO = {
  kicker: ["Avorio", "Cioccolato bianco", "Firenze"],
  serif: "cioccolato",
  giant: "Bianco",
  body: "Only the butter of the cacao bean, Bourbon vanilla and slow milk. Tempered by hand, in small batches.",
  cta: "Watch it being made",
  facts: ["38% cocoa butter", "0% cocoa solids", "Melts at 34°"],
};

// The one text section: each line gets its own background colour.
// `em` is the word set in italic serif.
export const STORY = [
  { pre: "White chocolate is", em: "chocolate", post: "without the dark.", bg: "#3f1521", fg: "#f4ecde", accent: "#e3a7b6" },
  { pre: "Only the bean's", em: "butter,", post: "pressed pale and perfumed.", bg: "#6e2337", fg: "#f4ecde", accent: "#f5dce1" },
  { pre: "Folded with milk, Bourbon", em: "vanilla", post: "and a whisper of sugar.", bg: "#a23b5a", fg: "#faf6ee", accent: "#3f1521" },
  { pre: "It melts at", em: "34°,", post: "just below your tongue.", bg: "#e3a7b6", fg: "#3f1521", accent: "#faf6ee" },
];

export const STATS = [
  { value: 38, unit: "%", label: "Cocoa butter. The law asks for 20." },
  { value: 0, unit: "%", label: "Cocoa solids. That is why it is white." },
  { value: 72, unit: "h", label: "Rest before every bar is cut." },
];

export const TRANSITION_WORDS = ["Dal", "seme", "alla", "tavoletta."];

// Seven acts, from the tree to the bar. Colours run dark wine → ivory,
// the same way the bean becomes white chocolate.
export const MAKING = [
  {
    n: "01",
    it: "Raccolta",
    en: "The harvest",
    body: "Cacao pods grow straight from the trunk. When they turn gold and amber, each one is cut by hand so the tree is never hurt.",
    fact: "Theobroma cacao · 20° from the equator",
    bg: "#1f0a10",
  },
  {
    n: "02",
    it: "Apertura",
    en: "Opening the pod",
    body: "One clean crack. Inside, thirty to fifty beans sleep in a sweet white pulp that tastes like lychee.",
    fact: "30–50 beans per pod",
    bg: "#3f1521",
  },
  {
    n: "03",
    it: "Fermento",
    en: "Ferment & dry",
    body: "Three to six days under banana leaves turn the pulp to warmth and the beans to flavour. Then they dry slowly in the sun.",
    fact: "3–6 days · sun-dried",
    bg: "#561c2d",
  },
  {
    n: "04",
    it: "Tostatura",
    en: "Roast & crack",
    body: "A gentle roast opens the aroma. The shells crack away and what is left are nibs: pure, bitter, alive.",
    fact: "Roasted · cracked · winnowed",
    bg: "#6e2337",
  },
  {
    n: "05",
    it: "Pressatura",
    en: "The press",
    body: "Ground and pressed, the nibs give up their butter, pale gold and fragrant. The dark stays behind. White chocolate keeps only this.",
    fact: "Cocoa butter · 38% of every bar",
    bg: "#a23b5a",
  },
  {
    n: "06",
    it: "Concaggio",
    en: "Milk, vanilla, time",
    body: "The butter is folded with milk, split Bourbon vanilla and a little sugar, then kneaded for hours until it turns silk.",
    fact: "Conched for 36 hours",
    bg: "#e3a7b6",
  },
  {
    n: "07",
    it: "Tempera",
    en: "Temper & mould",
    body: "Cooled, warmed, cooled again on marble until the crystals line up. Poured, rested for three days. Then it snaps.",
    fact: "28° · 72 h · one clean snap",
    bg: "#f4ecde",
  },
];

export type Edition = {
  name: string;
  meta: string;
  notes: string;
  image: keyof typeof paintings;
  focus: string;
};

export const EDITIONS: Edition[] = [
  { name: "La Dama", meta: "N°01", notes: "Bourbon vanilla & cream", image: "laDama", focus: "50% 40%" },
  { name: "La Devota", meta: "N°02", notes: "Rose & Cervia salt", image: "laDevota", focus: "45% 45%" },
  { name: "Ofelia", meta: "N°03", notes: "Elderflower & acacia honey", image: "ofelia", focus: "50% 55%" },
  { name: "La Tentazione", meta: "N°04", notes: "Caramelised milk & smoked salt", image: "laTentazione", focus: "50% 50%" },
  { name: "La Maddalena", meta: "N°05", notes: "Pistacchio di Bronte", image: "laMaddalena", focus: "50% 35%" },
];

export const FOOTER = {
  serif: "Shall we",
  giant: "Taste?",
  body: "Half an hour in the atelier to taste all five editions. We pour, you decide.",
  cta: "Book a tasting",
  wordmark: "Avorio",
};
