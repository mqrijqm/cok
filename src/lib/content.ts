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
  facts: ["Cocoa butter", "Bourbon vanilla", "Slow milk"],
};

export const M = "#6a0c6f";
export const B = "#f1e7d6";

// The one text section. Lines alternate beige / magenta with hard edges;
// `em` is the word set in italic serif.
export const STORY = [
  { pre: "White chocolate is", em: "chocolate", post: "without the dark.", bg: B, fg: M },
  { pre: "Only the bean's", em: "butter,", post: "pressed pale and perfumed.", bg: M, fg: B },
  { pre: "Folded with milk, Bourbon", em: "vanilla", post: "and a whisper of sugar.", bg: B, fg: M },
  { pre: "It melts", em: "slowly,", post: "just below your tongue.", bg: M, fg: B },
];

export const TRANSITION_WORDS = ["Dal", "seme", "alla", "tavoletta."];

// Seven acts, one big word and one short line each.
// Backgrounds alternate magenta / beige, starting on magenta.
export const MAKING = [
  { it: "Raccolta", line: "Cut by hand from the trunk." },
  { it: "Apertura", line: "Beans asleep in sweet pulp." },
  { it: "Fermento", line: "Days under banana leaves." },
  { it: "Tostatura", line: "Roasted, cracked, alive." },
  { it: "Pressatura", line: "Only the butter stays." },
  { it: "Concaggio", line: "Milk, vanilla, patience." },
  { it: "Tempera", line: "And then it snaps." },
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
