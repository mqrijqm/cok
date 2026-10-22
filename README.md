# Avorio — white chocolate

Concept site for a hand-tempered white chocolate brand, art-directed around
Renaissance "advertising" paintings. Layout and interaction model follow
squared-media.nl; palette, copy, imagery and 3D are original.

## Run

```bash
pnpm install
pnpm dev
```

## Where things live

| What | File |
|---|---|
| Colours, radii, easing | `src/app/globals.css` (`@theme`) |
| All copy, editions, prices | `src/lib/content.ts` |
| Paintings | `src/assets/paintings/` |
| Shared timings | `src/lib/motion.ts` |
| 3D chocolate (footer) | `src/components/three/ChocolateScene.tsx` |

Sections, top to bottom: `Preloader` → `Hero` → `Atelier` (statement, craft tabs,
square transition) → `Craft` → `Showcase` (pinned enlarge) → `Collection` →
`Ritual` (pinned card stack) → `Subscription` → `Muse` → `Footer`.

## Before launch

- `CONTACT` in `src/lib/content.ts` holds placeholder email and social links.
- Paintings are ~1024 px tall; 2× exports would sharpen the full-screen showcase.
