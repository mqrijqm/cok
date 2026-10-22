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
  {
    label: "Collezione",
    items: ["La Dama", "La Devota", "Ofelia", "La Maddalena", "La Tentazione"],
  },
  { label: "Il Rito", items: ["Unwrap", "Break", "Rest", "Remember"] },
  { label: "Atelier", items: ["Burro di cacao", "Tempera", "Stampo", "Carta"] },
  { label: "Regali", items: ["Weddings", "Hotels", "Private label"] },
  { label: "Abbonamento", href: "#abbonamento" },
] as const;

export const HERO = {
  pill: "Hand-tempered white chocolate · Firenze",
  lines: ["Unwrap", "slowly.", "Surrender", "softly."],
  body: "Ivory-pale white chocolate with 38% cocoa butter and Bourbon vanilla. Tempered by hand in small batches, wrapped like a painting.",
  primary: "Discover the collection",
  secondary: "The ritual",
  tertiary: "How is it made?",
  notesLabel: "Tasting notes",
  notes: ["Vanilla", "Fresh cream", "Acacia honey", "Sea salt"],
  placard: { title: "La Dama con la Tavoletta", meta: "Olio su tavola · Avorio N°01" },
};

export const STATEMENT = {
  strong: "Everything you'd ask of a patisserie, a gallery and a perfumer.",
  soft: "Cocoa butter, Bourbon vanilla and slow milk in a single bar. One recipe, one rhythm, poured by hand.",
};

export const CRAFT_TABS = [
  {
    key: "Burro",
    items: [
      {
        title: "Cocoa butter",
        body: "Pressed from single-origin beans and deodorised gently, so the butter keeps its quiet, milky perfume.",
      },
      { title: "Bourbon vanilla", body: "Whole Madagascar pods, split by hand, never extract." },
      { title: "Slow milk", body: "Whole milk powder dried at low heat for a caramel note." },
    ],
    image: "laDevota" as const,
    focus: "20% 55%",
  },
  {
    key: "Tempera",
    items: [
      {
        title: "Tempered on marble",
        body: "Spread and folded on cold Carrara marble until the crystals align and the snap rings clear.",
      },
      { title: "Seventy-two hours", body: "Every batch rests for three days before it is cut." },
      { title: "Small batches", body: "Forty kilos a day. When it is gone, it is gone." },
    ],
    image: "laMaddalena" as const,
    focus: "18% 78%",
  },
  {
    key: "Stampo",
    items: [
      {
        title: "Sculpted moulds",
        body: "Twelve pillowed squares, each with a bevelled edge that breaks clean along the line.",
      },
      { title: "Hand-poured", body: "Poured, tapped and lifted one mould at a time." },
      { title: "Polished finish", body: "A satin surface that melts at 34°, just below the tongue." },
    ],
    image: "ofelia" as const,
    focus: "18% 82%",
  },
  {
    key: "Carta",
    items: [
      {
        title: "Wrapped like a painting",
        body: "Silver foil, then a printed sleeve framed in gold filigree: every edition carries its own portrait.",
      },
      { title: "Numbered sleeves", body: "Each bar is signed with its batch number." },
      { title: "No plastic", body: "Foil, paper and a wax seal. Nothing else." },
    ],
    image: "laDama" as const,
    focus: "62% 72%",
  },
];

export const CRAFT_STATEMENT = {
  strong: "We temper by hand.",
  soft: "Every bar waits seventy-two hours before it meets you.",
  body: "White chocolate is usually the sweet one nobody takes seriously. We make it the way a fresco is painted: slowly, in layers, with the right lime and the right light. More cocoa butter, less sugar, and the patience to let it set.",
};

export const SHOWCASE = {
  marquee: "Scopri la collezione",
  hint: "Scroll to enlarge",
  caption: "N°04 — La Tentazione",
};

export const COLLECTION_INTRO = {
  strong: "What a single bar gives you.",
  soft: "From the first clean snap to the last slow melt.",
};

export type Edition = {
  name: string;
  meta: string;
  tags: string[];
  image: keyof typeof paintings;
  focus: string;
  detail: string;
};

export const EDITIONS: Edition[] = [
  {
    name: "La Dama",
    meta: "N°01 · Bourbon vanilla · 2026",
    tags: ["Vanilla", "Cream", "38% cocoa butter"],
    image: "laDama",
    focus: "50% 40%",
    detail: "62% 72%",
  },
  {
    name: "La Devota",
    meta: "N°02 · Rose & Cervia salt · 2026",
    tags: ["Rose petal", "Sea salt", "Pearl sugar"],
    image: "laDevota",
    focus: "50% 45%",
    detail: "18% 58%",
  },
  {
    name: "Ofelia",
    meta: "N°03 · Elderflower & honey · 2026",
    tags: ["Elderflower", "Acacia honey", "Water lily"],
    image: "ofelia",
    focus: "50% 55%",
    detail: "18% 84%",
  },
  {
    name: "La Tentazione",
    meta: "N°04 · Caramelised milk · 2026",
    tags: ["Dulce", "Brown butter", "Smoked salt"],
    image: "laTentazione",
    focus: "55% 50%",
    detail: "60% 74%",
  },
  {
    name: "La Maddalena",
    meta: "N°05 · Pistacchio di Bronte · 2026",
    tags: ["Pistachio", "Olive oil", "Fleur de sel"],
    image: "laMaddalena",
    focus: "50% 35%",
    detail: "16% 76%",
  },
];

export const RITUAL = {
  label: "Il Rito",
  heading: "Unwrap. Break. Wait. Let it melt.",
  steps: [
    { n: "1.", title: "Unwrap slowly", body: "Slide the sleeve, fold back the foil. Let the vanilla reach you first." },
    { n: "2.", title: "Break one square", body: "Listen for the snap. A clean break means a perfect temper." },
    { n: "3.", title: "Let it rest", body: "Don't chew. Place it on your tongue and wait for 34 degrees." },
    { n: "4.", title: "Remember the finish", body: "Cream, then honey, then a whisper of salt that stays." },
  ],
};

export const SUBSCRIPTION = {
  pill: "Abbonamento",
  heading: ["Fixed ritual.", "Fixed price."],
  intro: "A box of editions at your door every month. No minimums, no commitments. Pause in summer, double up at Christmas.",
  plans: [
    {
      tier: "Piccola",
      price: "€39",
      per: "per month",
      title: "4 bars a month",
      body: "One of each new edition, hand-wrapped and shipped in a linen box. Enough for a quiet ritual every week.",
      footnote: "1 tasting card per month",
      cta: "Choose Piccola",
      image: "laDevota" as const,
      focus: "20% 55%",
    },
    {
      tier: "Grande",
      badge: "Best per bar",
      price: "€96",
      per: "per month",
      title: "12 bars a month",
      body: "For households, studios and generous people. Three of every edition, plus first access to limited runs.",
      footnote: "3 tasting cards per month",
      cta: "Choose Grande",
      image: "laMaddalena" as const,
      focus: "18% 76%",
    },
  ],
  atelier: { label: "Atelier", body: "A wedding, a hotel, a bar with your own painting? We'll compose it together.", cta: "Ask for a proposal" },
  included: ["Shipped within 3 days", "Hand-wrapped, no plastic", "Pause any month", "First access to editions", "Free tasting cards", "Cancel anytime"],
  includedLink: "How do pausing and cancelling work?",
  math: {
    label: "Do the math",
    rows: [
      { name: "Sugar in a supermarket white bar", value: "± 55%", pct: 92, note: "Sweetness covers everything else." },
      { name: "Sugar in Avorio", value: "32%", pct: 53, note: "So you taste cream, vanilla and the butter itself.", accent: true },
    ],
    footnote: "Cocoa butter: ± 20% in an ordinary bar, 38% in ours.",
  },
  tabs: [
    {
      key: "Gift",
      cols: [
        { n: "01", title: "A single edition", body: "Wrapped, sealed and sent with a handwritten card.", meta: "From €14 per bar" },
        { n: "02", title: "The full collection", body: "All five portraits in a gallery box with a numbered certificate.", meta: "€68 · ships in 3 days" },
        { n: "03", title: "Corporate gifting", body: "Your logo on the wax seal, our painting on the sleeve.", meta: "From 50 boxes" },
      ],
    },
    {
      key: "Subscribe",
      cols: [
        { n: "01", title: "Monthly box", body: "New editions every month, chosen by our maestra.", meta: "From €39 per month" },
        { n: "02", title: "Pause anytime", body: "Skip a month from your account in two clicks.", meta: "No fees" },
        { n: "03", title: "Gift a subscription", body: "Three, six or twelve months, with a printed invitation.", meta: "From €117" },
      ],
    },
    {
      key: "Atelier",
      cols: [
        { n: "01", title: "Your own painting", body: "Commission a portrait sleeve for an event or a brand.", meta: "From 200 bars" },
        { n: "02", title: "Hotels & restaurants", body: "Petits fours and turndown squares in your colours.", meta: "Monthly delivery" },
        { n: "03", title: "Weddings", body: "Favours with your names hand-lettered in gold.", meta: "Fixed price, no surprises" },
      ],
    },
  ],
};

export const MUSE = {
  pill: "Le Muse",
  heading: ["You taste", "who made it."],
  intro: "No factory, no middlemen. The same two hands temper, pour and wrap every bar, and answer your letters.",
  people: [
    { name: "Caterina", role: "Maestra cioccolatiera", image: "laMaddalena" as const, focus: "50% 22%" },
    { name: "Beatrice", role: "Tempering & taste", image: "laDevota" as const, focus: "40% 30%" },
  ],
  bottega: {
    label: "// Bottega",
    title: "Join the atelier.",
    body: "Do you love making as much as tasting? We're looking for apprentices with patient hands. Send your work, not a cover letter.",
    cta: "Write to us",
    seal: "AVORIO · BOTTEGA · FIRENZE · ",
    name: "You?",
    role: "Apprentice wanted",
  },
};

export const FOOTER = {
  hint: "Hover me",
  title: ["Shall we", "taste?"],
  body: "Half an hour in the atelier to taste all five editions. No sales pitch: we pour, you decide.",
  cta: "Book a tasting",
  cols: {
    pages: { label: "Pagine", links: ["Collezione", "Il Rito", "Atelier", "Abbonamento", "Le Muse"] },
    follow: { label: "Seguici", links: ["Instagram", "Pinterest"] },
    contact: { label: "Contatto" },
  },
};
