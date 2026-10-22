import type { paintings } from "./content";

export type EditionDetail = {
  slug: string;
  n: string;
  name: string;
  nameLines: string[];
  flavour: string;
  tagline: string;
  notes: { label: string; word: string; line: string }[];
  ingredients: { name: string; pct: string }[];
  allergens: string;
  pairings: string[];
  story: string[];
  image: keyof typeof paintings;
  focus: string;
  details: string[];
  weight: string;
  price: string;
};

// Fictional brand content. Recipes add up to 100%.
export const EDITION_DETAILS: EditionDetail[] = [
  {
    slug: "la-dama",
    n: "N°01",
    name: "La Dama",
    nameLines: ["La", "Dama"],
    flavour: "Bourbon vanilla & cream",
    tagline: "The one that started it.",
    notes: [
      { label: "First", word: "Cream", line: "Cold, fresh, a little sweet." },
      { label: "Heart", word: "Vanilla", line: "Split Bourbon pods, never extract." },
      { label: "Finish", word: "Warm milk", line: "Long and quiet." },
    ],
    ingredients: [
      { name: "Cocoa butter", pct: "38%" },
      { name: "Cane sugar", pct: "32%" },
      { name: "Whole milk powder", pct: "29%" },
      { name: "Bourbon vanilla pod", pct: "0.5%" },
      { name: "Sunflower lecithin", pct: "0.5%" },
    ],
    allergens: "Contains milk.",
    pairings: ["Moscato d'Asti", "Fresh raspberries", "Earl Grey"],
    story: [
      "Our first portrait, painted after the Lombard masters. Where the original held an ermine, our lady holds a bar, unwrapped just enough to show the first row of squares.",
      "She is calm, certain and a little amused. So is the chocolate: nothing added that does not need to be there, and nothing missing.",
    ],
    image: "laDama",
    focus: "50% 35%",
    details: ["50% 22%", "62% 72%"],
    weight: "80 g · 12 squares",
    price: "€14",
  },
  {
    slug: "la-devota",
    n: "N°02",
    name: "La Devota",
    nameLines: ["La", "Devota"],
    flavour: "Rose & Cervia salt",
    tagline: "Hands joined, as if in prayer.",
    notes: [
      { label: "First", word: "Rose", line: "Dried petals, not perfume." },
      { label: "Heart", word: "Cream", line: "Round and soft." },
      { label: "Finish", word: "Sea salt", line: "From the pans of Cervia." },
    ],
    ingredients: [
      { name: "Cocoa butter", pct: "37%" },
      { name: "Cane sugar", pct: "31%" },
      { name: "Whole milk powder", pct: "29%" },
      { name: "Dried rose petals", pct: "1.5%" },
      { name: "Cervia sea salt", pct: "0.8%" },
      { name: "Sunflower lecithin", pct: "0.7%" },
    ],
    allergens: "Contains milk.",
    pairings: ["Rosé Champagne", "Strawberries", "Jasmine tea"],
    story: [
      "A profile in pearls and gold thread, hands pressed together around a single square. The pose of devotion, the object of desire.",
      "The salt is the surprise. It arrives late, sharpens the rose, and makes you reach for the second square sooner than you meant to.",
    ],
    image: "laDevota",
    focus: "40% 40%",
    details: ["18% 58%", "45% 25%"],
    weight: "80 g · 12 squares",
    price: "€14",
  },
  {
    slug: "ofelia",
    n: "N°03",
    name: "Ofelia",
    nameLines: ["Ofelia"],
    flavour: "Elderflower & acacia honey",
    tagline: "Sweet, and a little melancholic.",
    notes: [
      { label: "First", word: "Elderflower", line: "Green, floral, bright." },
      { label: "Heart", word: "Honey", line: "Acacia, pale and clean." },
      { label: "Finish", word: "Cool cream", line: "Like the river." },
    ],
    ingredients: [
      { name: "Cocoa butter", pct: "37%" },
      { name: "Whole milk powder", pct: "28%" },
      { name: "Cane sugar", pct: "28%" },
      { name: "Acacia honey", pct: "5%" },
      { name: "Elderflower", pct: "1.4%" },
      { name: "Sunflower lecithin", pct: "0.6%" },
    ],
    allergens: "Contains milk.",
    pairings: ["Sauvignon Blanc", "Ripe pear", "Chamomile"],
    story: [
      "She drifts among the water lilies, one hand still holding on to what is left of the bar. The most romantic of the five, and the most fragile.",
      "Honey softens the sugar, elderflower lifts it. Eat it slowly, on a warm afternoon, with nowhere to be.",
    ],
    image: "ofelia",
    focus: "50% 55%",
    details: ["18% 84%", "55% 45%"],
    weight: "80 g · 12 squares",
    price: "€14",
  },
  {
    slug: "la-tentazione",
    n: "N°04",
    name: "La Tentazione",
    nameLines: ["La", "Tentazione"],
    flavour: "Caramelised milk & smoked salt",
    tagline: "Someone is always whispering.",
    notes: [
      { label: "First", word: "Dulce", line: "Milk cooked slow until golden." },
      { label: "Heart", word: "Brown butter", line: "Nutty, toasted." },
      { label: "Finish", word: "Smoke", line: "A pinch of smoked salt." },
    ],
    ingredients: [
      { name: "Cocoa butter", pct: "36%" },
      { name: "Caramelised milk powder", pct: "31%" },
      { name: "Cane sugar", pct: "30%" },
      { name: "Brown butter", pct: "2%" },
      { name: "Smoked salt", pct: "0.5%" },
      { name: "Sunflower lecithin", pct: "0.5%" },
    ],
    allergens: "Contains milk.",
    pairings: ["Aged rum", "Espresso", "Salted almonds"],
    story: [
      "Three figures and one bar. An old woman leans in to whisper, a man watches from the shadows, and she looks straight at you as if to ask whether you would share.",
      "The deepest of the collection. Caramelised milk gives it colour, smoked salt gives it nerve.",
    ],
    image: "laTentazione",
    focus: "50% 45%",
    details: ["60% 74%", "25% 40%"],
    weight: "80 g · 12 squares",
    price: "€16",
  },
  {
    slug: "la-maddalena",
    n: "N°05",
    name: "La Maddalena",
    nameLines: ["La", "Maddalena"],
    flavour: "Pistacchio di Bronte",
    tagline: "Green velvet, unwrapped without hurry.",
    notes: [
      { label: "First", word: "Pistachio", line: "Roasted gently, from Bronte." },
      { label: "Heart", word: "Olive oil", line: "Grassy, a little peppery." },
      { label: "Finish", word: "Fleur de sel", line: "Clean, bright." },
    ],
    ingredients: [
      { name: "Cocoa butter", pct: "34%" },
      { name: "Cane sugar", pct: "28%" },
      { name: "Whole milk powder", pct: "26%" },
      { name: "Bronte pistachio", pct: "11%" },
      { name: "Extra-virgin olive oil", pct: "0.5%" },
      { name: "Fleur de sel", pct: "0.5%" },
    ],
    allergens: "Contains milk and pistachio.",
    pairings: ["Vin Santo", "Dried apricots", "Sencha"],
    story: [
      "Red hair, a green dress and all the time in the world. She breaks a square and offers it to you before taking her own.",
      "The richest bar we make. Pistachio from the slopes of Etna, folded in whole and ground, so you find both the cream and the crunch.",
    ],
    image: "laMaddalena",
    focus: "50% 30%",
    details: ["16% 76%", "45% 22%"],
    weight: "80 g · 12 squares",
    price: "€16",
  },
];

export const editionBySlug = (slug: string) => EDITION_DETAILS.find((e) => e.slug === slug);
