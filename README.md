# Avorio — white chocolate

Concept site for a hand-tempered white chocolate brand. Two colours only,
vivid magenta-lilac and white-chocolate beige: no gradients, shadows or blur.
The making-of is flat vector illustration animated in 3D, from pod to bar;
only the final bar becomes a real 3D object.

## Run

```bash
pnpm install
pnpm dev
```

## Where things live

| What | File |
|---|---|
| Colours, radii, easing | `src/app/globals.css` (`@theme`) |
| Pragmatica Extended (small text) | `src/fonts/` |
| All copy, editions, prices | `src/lib/content.ts` |
| Paintings | `src/assets/paintings/` |
| Shared timings | `src/lib/motion.ts` |
| Flying 3D pieces | `src/components/three/FlyingScene.tsx` |
| Making-of illustrations (pod → bar) | `src/components/three/MakingScene.tsx` |
| Shared chocolate shapes | `src/components/three/chocolate.tsx` |

Sections, top to bottom: `Preloader` → `Hero` → `Story` (the text section,
one colour per line) → `FlipTransition` → `MakingOf` (pinned, seven acts) →
`Collection` (3D ring) → `Footer`. `FlyingLayer` sits over hero, story and footer.

## Before launch

- `CONTACT` in `src/lib/content.ts` holds placeholder email and social links.
- Pragmatica Extended is a commercial typeface: a web licence is needed before publishing.
- Paintings are ~1024 px tall; 2× exports would sharpen the collection ring on retina screens.
