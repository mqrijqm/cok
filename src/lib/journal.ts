export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string }
  | { type: "facts"; title: string; items: string[] };

export type Article = {
  slug: string;
  kicker: string;
  title: string;
  titleLines: string[];
  excerpt: string;
  readTime: string;
  date: string;
  body: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "bianco-non-pallido",
    kicker: "Ingredienti",
    title: "White, not pale",
    titleLines: ["White,", "not pale"],
    excerpt: "Why white chocolate is real chocolate, and how to tell the real thing from a sweet imitation.",
    readTime: "4 min",
    date: "October 2026",
    body: [
      {
        type: "p",
        text: "Every cacao bean holds two things: dark cocoa solids, which carry the bitterness and the colour, and cocoa butter, a pale fat with a quiet, milky perfume. Dark and milk chocolate use both. White chocolate keeps only the butter.",
      },
      {
        type: "p",
        text: "That is the whole secret of its colour. Nothing is bleached and nothing is removed after the fact. The butter is pressed out of ground cacao, the solids stay behind, and what is left to work with is ivory from the start.",
      },
      { type: "h", text: "What the law asks for" },
      {
        type: "p",
        text: "In Europe, a bar can only be called white chocolate if it contains at least 20% cocoa butter and at least 14% dry milk solids. The United States has had a similar standard since 2004: at least 20% cocoa butter, 14% milk solids, 3.5% milk fat, and no more than 55% sweeteners.",
      },
      {
        type: "facts",
        title: "Read the label",
        items: [
          "Cocoa butter should be the first or second ingredient.",
          "If you see vegetable fat or palm oil, it is a coating, not white chocolate.",
          "Vanilla should be vanilla, not vanillin.",
        ],
      },
      { type: "quote", text: "More butter, less sugar. That is the whole recipe for a white chocolate you can actually taste." },
      { type: "h", text: "Why ours tastes different" },
      {
        type: "p",
        text: "Most white chocolate sits close to the legal minimum of cocoa butter and close to the maximum of sugar. Sugar is cheap and it is loud: past a certain point you taste sweetness and very little else.",
      },
      {
        type: "p",
        text: "We work the other way round. Our bars carry around 38% cocoa butter and about a third less sugar than a supermarket bar. The result melts more slowly and tastes of cream, vanilla and the butter itself.",
      },
    ],
  },
  {
    slug: "lo-schiocco-lento",
    kicker: "Tecnica",
    title: "The slow snap",
    titleLines: ["The slow", "snap"],
    excerpt: "Tempering, explained: why we fold chocolate on cold marble, and what the snap tells you.",
    readTime: "5 min",
    date: "October 2026",
    body: [
      {
        type: "p",
        text: "Cocoa butter is a fat with a talent for disguise. As it cools it can set in six different crystal forms, and only one of them, known as form V, gives chocolate a glossy surface, a clean snap and a melt that starts just below body temperature.",
      },
      {
        type: "p",
        text: "Tempering is the art of persuading the butter to choose that form. Get it wrong and the bar turns out dull, soft and streaked with grey: the bloom you sometimes see on old chocolate.",
      },
      { type: "h", text: "The curve" },
      {
        type: "p",
        text: "Every chocolate has its own temperature curve. White chocolate runs lower than dark because milk fat gets in the way of the crystals.",
      },
      {
        type: "facts",
        title: "Our curve for white chocolate",
        items: ["Melt completely, around 40–45°C", "Cool on marble to 26–27°C", "Warm gently back to 28–29°C", "Pour, tap, rest"],
      },
      { type: "h", text: "Why marble" },
      {
        type: "p",
        text: "We pour two thirds of the melted chocolate onto a cold slab of Carrara marble and keep it moving with a palette knife until it thickens. Then it goes back into the bowl, where it seeds the rest with the right crystals.",
      },
      { type: "quote", text: "A tempered bar tells you so itself: it shines, it snaps, it lets go of the mould without a fight." },
      { type: "h", text: "Keeping it that way" },
      {
        type: "p",
        text: "Store chocolate somewhere cool, dry and dark, ideally between 16 and 18°C and away from strong smells. Avoid the fridge: when a cold bar meets warm air, condensation dissolves sugar on the surface and leaves a white, dusty film behind.",
      },
    ],
  },
  {
    slug: "come-si-assaggia",
    kicker: "Rito",
    title: "How to taste",
    titleLines: ["How to", "taste"],
    excerpt: "Five slow steps that turn a square of chocolate into a small ceremony.",
    readTime: "3 min",
    date: "October 2026",
    body: [
      {
        type: "p",
        text: "Tasting is not eating more slowly. It is paying attention in a particular order: with your eyes, your ears, your nose and only then your tongue. Let the bar sit at room temperature first, around 18 to 20°C.",
      },
      { type: "h", text: "Look" },
      { type: "p", text: "Good white chocolate is ivory, not stark white, and it shines. Streaks or a dusty surface mean it has been stored too warm or too cold." },
      { type: "h", text: "Listen" },
      {
        type: "p",
        text: "Break one square close to your ear. White chocolate snaps more softly than dark because of the milk, but the break should still be clean.",
      },
      { type: "h", text: "Smell" },
      { type: "p", text: "Hold the broken edge under your nose. Vanilla first, then milk, then something buttery and warm." },
      { type: "h", text: "Melt" },
      {
        type: "p",
        text: "Do not chew. Place the square on your tongue and press it gently to the roof of your mouth. As the cocoa butter melts, the flavours arrive in order: first the lightest, then the heart, then the finish.",
      },
      { type: "quote", text: "Do not chew. Wait. The best part of a square is the minute after it is gone." },
      {
        type: "facts",
        title: "Tasting the collection",
        items: ["Start with La Dama, finish with La Tentazione", "Sip water between editions", "One square of each is enough", "Write down one word for each finish"],
      },
    ],
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
