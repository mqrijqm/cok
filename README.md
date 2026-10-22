# Avorio — white chocolate

Concept site for a hand-tempered white chocolate brand. Palette built on
Pantone 4975 C Vintage Wine; Renaissance paintings appear in the collection.
The making-of is rendered procedurally in Three.js, from pod to bar.

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
| Flying 3D pieces | `src/components/three/FlyingScene.tsx` |
| Making-of 3D (pod → bar) | `src/components/three/MakingScene.tsx` |
| Shared chocolate shapes | `src/components/three/chocolate.tsx` |

Sections, top to bottom: `Preloader` → `Hero` → `Story` (the text section,
one colour per line) → `FlipTransition` → `MakingOf` (pinned, seven acts) →
`Collection` (3D ring) → `Footer`. `FlyingLayer` sits over hero, story and footer.

## Before launch

- `CONTACT` in `src/lib/content.ts` holds placeholder email and social links.
- Paintings are ~1024 px tall; 2× exports would sharpen the collection ring on retina screens.
