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
  { label: "Collezione", href: "/collezione" },
  { label: "Atelier", href: "/atelier" },
  { label: "Making of", href: "/#making" },
  { label: "Journal", href: "/journal" },
  { label: "Regali", href: "/regali" },
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
  slug: string;
  name: string;
  meta: string;
  notes: string;
  image: keyof typeof paintings;
  focus: string;
};

export const EDITIONS: Edition[] = [
  { slug: "la-dama", name: "La Dama", meta: "N°01", notes: "Bourbon vanilla & cream", image: "laDama", focus: "50% 40%" },
  { slug: "la-devota", name: "La Devota", meta: "N°02", notes: "Rose & Cervia salt", image: "laDevota", focus: "45% 45%" },
  { slug: "ofelia", name: "Ofelia", meta: "N°03", notes: "Elderflower & acacia honey", image: "ofelia", focus: "50% 55%" },
  { slug: "la-tentazione", name: "La Tentazione", meta: "N°04", notes: "Caramelised milk & smoked salt", image: "laTentazione", focus: "50% 50%" },
  { slug: "la-maddalena", name: "La Maddalena", meta: "N°05", notes: "Pistacchio di Bronte", image: "laMaddalena", focus: "50% 35%" },
];

export const FOOTER = {
  serif: "Shall we",
  giant: "Taste?",
  body: "Half an hour in the atelier to taste all five editions. We pour, you decide.",
  cta: "Book a tasting",
  wordmark: "Avorio",
};

export const ATELIER = {
  kicker: "La bottega",
  serif: "in Oltrarno",
  title: ["Atelier"],
  intro: "A small room across the river from the Duomo, a slab of Carrara marble and two pairs of hands. Everything we make starts and ends here.",
  manifesto: [
    { text: "Five ingredients. *Never* six.", bg: B, fg: M },
    { text: "Seventy-two hours of *patience* before every cut.", bg: M, fg: B },
    { text: "Paper, foil, wax. *No* plastic.", bg: B, fg: M },
    { text: "Two pairs of *hands*, and that is all.", bg: M, fg: B },
  ],
  people: [
    { name: "Caterina", role: "Maestra cioccolatiera", image: "laMaddalena" as const, focus: "50% 20%", line: "Tempers every batch by hand and tastes every one of them." },
    { name: "Beatrice", role: "Wrapping & letters", image: "laDevota" as const, focus: "42% 28%", line: "Folds the foil, seals the wax, answers your notes." },
  ],
  bottega: { title: "Join the bottega", line: "We take one apprentice a year. Send us something you made, not a cover letter." },
  visit: {
    title: ["Come and", "taste"],
    hours: [
      ["Tuesday – Friday", "10:00 – 19:00"],
      ["Saturday", "10:00 – 17:00"],
      ["Sunday & Monday", "Closed"],
    ],
    line: "Tastings of the full collection by appointment, thirty minutes, up to four people.",
  },
};

export const REGALI = {
  kicker: "Regali & abbonamento",
  serif: "for someone",
  title: ["Regali"],
  intro: "Every bar leaves the atelier wrapped by hand, sealed in wax and sent with a card written in ink.",
  offers: [
    { name: "Una tavoletta", line: "A single edition, wrapped and sealed, with a handwritten card.", price: "from €14", cta: "Choose an edition", href: "/collezione" },
    { name: "La collezione", line: "All five portraits in a linen gallery box, with a numbered certificate.", price: "€68", cta: "Order the box", href: "/contatto" },
    { name: "Abbonamento", line: "New editions at your door every month. Piccola: four bars for €39. Grande: twelve for €96.", price: "from €39 / month", cta: "Subscribe", href: "/contatto" },
  ],
  occasions: {
    title: ["Weddings,", "hotels, brands"],
    line: "Favours with your names lettered in gold, turndown squares in your colours, a portrait sleeve painted for your event. From fifty boxes.",
    cta: "Ask for a proposal",
  },
  shipping: ["Wrapped by hand", "Sent within three days", "Cool-packed in summer"],
  faq: [
    { q: "How should I store the chocolate?", a: "Somewhere cool, dry and dark, ideally between 16 and 18°C and away from strong smells. Please keep it out of the fridge: condensation leaves a white film on the surface." },
    { q: "How long does it keep?", a: "Each bar is best within nine months of the date on its sleeve, and best of all in the first three." },
    { q: "What about allergens?", a: "Every edition contains milk. La Maddalena also contains pistachio. All bars are made in a kitchen that handles nuts." },
    { q: "Where do you ship?", a: "Across the European Union. In the warmest months we ship early in the week with cool packs, so nothing waits in a depot over the weekend." },
    { q: "Can I pause or cancel a subscription?", a: "Yes, any month, from your account or with a short email. There are no fees and no minimum term." },
  ],
};

export const CONTATTO = {
  kicker: "Contatto",
  serif: "or come and taste",
  title: ["Scrivici"],
  intro: "Write to book a tasting, order a box for an occasion, or simply to tell us which square you liked best.",
};
