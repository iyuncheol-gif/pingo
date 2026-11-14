# Pingo cat mascot — developer handoff

## Files

| File | Size | Use |
|---|---:|---|
| `pingo-cat-mascot.png` | 1312×1199, alpha | Master transparent mascot |
| `pingo-cat-mascot.webp` | 1312×1199, alpha | Production mascot |
| `pingo-cat-mascot-512.webp` | 512×468, alpha | Cards, onboarding, empty states |
| `pingo-key-visual.png` | 1672×941 | Master 16:9 hero |
| `pingo-key-visual-1672.webp` | 1672×941 | Desktop hero |
| `pingo-key-visual-1280.webp` | 1280×720 | Laptop/tablet hero |
| `pingo-key-visual-768.webp` | 768×432 | Mobile/tablet fallback |

## Brand tokens

```css
:root {
  --pingo-violet: #4b3ce6;
  --pingo-lavender: #edeaff;
  --pingo-surface: #f7f8fc;
  --pingo-ink: #1e2030;
  --pingo-gold: #f4b936;
}
```

## Hero implementation

The left 44% of the key visual is intentionally quiet for HTML copy and a CTA. Keep copy as HTML for accessibility and localization.

```html
<section class="pingo-hero">
  <picture class="pingo-hero__art" aria-hidden="true">
    <source
      media="(min-width: 1280px)"
      srcset="/assets/pingo-key-visual-1672.webp"
    />
    <source
      media="(min-width: 768px)"
      srcset="/assets/pingo-key-visual-1280.webp"
    />
    <img src="/assets/pingo-key-visual-768.webp" alt="" />
  </picture>

  <div class="pingo-hero__copy">
    <h1>문장으로 쌓는 영어, Pingo</h1>
    <p>하루 10분이면 충분해요. 나에게 맞는 난이도로 시작해 보세요.</p>
    <button type="button">시작하기</button>
  </div>
</section>
```

```css
.pingo-hero {
  position: relative;
  display: grid;
  min-height: clamp(540px, 65vw, 760px);
  overflow: hidden;
  border-radius: 32px;
  background: var(--pingo-surface);
}

.pingo-hero__art,
.pingo-hero__art img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.pingo-hero__art img {
  object-fit: cover;
  object-position: center;
}

.pingo-hero__copy {
  position: relative;
  z-index: 1;
  align-self: center;
  width: min(42%, 560px);
  margin-left: clamp(28px, 6vw, 96px);
  color: var(--pingo-ink);
}

@media (max-width: 767px) {
  .pingo-hero {
    min-height: 680px;
    align-items: start;
  }

  .pingo-hero__art img {
    object-position: 68% center;
  }

  .pingo-hero__copy {
    width: auto;
    margin: 40px 28px 0;
    padding-right: 25%;
  }
}
```

## Mascot usage

- Header/onboarding: 128–220 CSS px.
- Empty state/lesson completion: 240–360 CSS px.
- Use `pingo-cat-mascot.webp` by default; PNG is the editable master.
- Preserve at least 12% clear space around the silhouette.
- Do not recolor the fur, stretch, mirror, or place copy over the face/P badge.
- Accessible informative use: `alt="P 배지를 든 회색과 흰색 고양이 Pingo"`.
- Decorative use: `alt=""` and `aria-hidden="true"`.

## Final generation prompts

Built with the built-in image generation workflow from the supplied cat photo.

### Mascot

Create an unmistakably cute, highly stylized app mascot from the reference cat. Preserve cool gray-and-white color blocking, white muzzle and chest, three gray forehead stripes, olive eyes, tiny pink nose, fluffy cheek silhouette, and charming deadpan expression. Use an oversized round head, tiny pear-shaped body, short round paws, small feet, cloud-like tail, small pointed ears, simplified eyes, purple P speech-bubble badge, and violet neckerchief. Flat 2D vector-style character with subtle soft 2.5D shading, smooth matte surfaces, minimal linework, transparent background, and no realistic fur.

### Key visual

Create a bright 16:9 Pingo English-learning hero using the exact mascot model. Use a minimal off-white and pale-lavender world with a soft violet platform, simple speech bubbles, gold stars, and blank learning cards. Keep the left 44% quiet for HTML copy, place the mascot in the right-center safe area, and preserve the flat 2D/soft 2.5D style. No embedded words except the P badge and no watermark.
