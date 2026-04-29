# BACDA — Visual Style Guide

> **System name:** Kinetic Editorial / Concert-Hall Noir
> **Mood:** dark-dominant editorial, warm amber accent, performance photography
> as the visual anchor. Reads like a concert program, not a startup landing page.

This document is the source of truth for color, typography, and the
"calligraphic" hierarchy (eyebrows, display, body, mono labels). All values
are pulled directly from `tailwind.config.ts` and `app/globals.css` — if you
update either file, update the matching section here.

---

## 1. Brand voice

- **Dark-first.** Public site renders on near-black ink; admin shell is the
  inverse (paper cream). Photography sits on ink, the warm amber logo glows
  against it.
- **Editorial restraint.** Type does the heavy lifting — weight, tracking,
  hairlines, grain. Decoration is rare and used only at moments of emphasis.
- **No calligraphic italics on display headings.** The site previously used
  italic Fraunces for hero headlines; that was dropped in favor of upright
  Fraunces (weight 500) with tight tracking. Italic is reserved for inline
  emphasis inside paragraph copy (`<em>`, `<i>`).

---

## 2. Color palette

All values from `tailwind.config.ts → theme.extend.colors`.

### Primary surfaces

| Role            | Token         | Hex       | Notes |
|-----------------|---------------|-----------|-------|
| Primary ground  | `ink`         | `#0B0B0E` | Near-black with a warm shift; default body background on public pages. |
| Surface lift    | `ink-50`      | `#16161A` | Card / hover surfaces above ink. |
| Surface 2       | `ink-100`     | `#1C1C21` | Section blocks (Productions rail, Collaborators). |
| Surface 3       | `ink-200`     | `#262529` | Borders + dividers in admin contexts. |
| Paper light     | `cream`       | `#F5F0E6` | Default text on ink; primary background in admin shell. |
| Cream highlight | `cream-50`    | `#FDFBF6` | Inverse hovers, hairline tints. |
| Cream shadow    | `cream-200`   | `#EAE3D3` | Slightly cooler cream for cards on cream ground. |

### Accent

| Role            | Token            | Hex       | Notes |
|-----------------|------------------|-----------|-------|
| Primary accent  | `burgundy`       | `#E08D2F` | Warm amber — pulled from the logo gradient mid-tone. WCAG AA on ink (≈ 7.1:1). Used for eyebrow labels, hover underlines, primary CTA fill. |
| Accent — active | `burgundy-dark`  | `#C27017` | Hover / pressed state for amber CTAs. |
| Logo highlight  | `gold`           | `#F4B860` | Decorative only — drop-shadow glow on the logo, never used as a text color. |

> The token name `burgundy` is historical (the original brand explored a wine
> red). The actual color is now warm amber, but the token name is kept stable
> so existing component refs continue to resolve.

### Functional

| Role            | Token       | Hex       |
|-----------------|-------------|-----------|
| Muted text      | `muted`     | `#8A8680` |
| Border          | `border`    | `#262529` |
| Error           | `error`     | `#EF4444` |
| Success         | `success`   | `#22C55E` |
| Focus ring      | `ring`      | `#E08D2F` (= burgundy) |

### Selection + focus

- `::selection` — amber background (`#E08D2F`) with ink text.
- `*:focus-visible` — `ring-2 ring-burgundy ring-offset-2`. Always visible,
  never overridden.

---

## 3. Typography

### 3.1 Type families

Loaded via `next/font/google` in `app/layout.tsx`:

| Role     | Family              | CSS var                | Weights                        | Styles            |
|----------|---------------------|------------------------|--------------------------------|-------------------|
| Display  | **Fraunces**        | `--font-fraunces`      | 300, 400, 500, 600, 700        | normal, italic    |
| Body     | **Inter Tight**     | `--font-inter-tight`   | 400, 500, 600, 700             | normal            |
| Mono     | **JetBrains Mono**  | `--font-jetbrains`     | 400, 500                       | normal            |

**Never use:** Inter (use Inter Tight), Roboto, Poppins, Montserrat, Arial,
or any system serif fallback as the primary face.

Tailwind class shorthand:
- `font-display` → Fraunces
- `font-sans` → Inter Tight (default body)
- `font-mono` → JetBrains Mono (eyebrow labels, ticker strips, index numerals)

### 3.2 The "calligraphy" — type hierarchy

Display headings use a fluid scale defined in `:root` (CSS custom properties)
and applied via the `.display-*` utility classes. All display sizes are
upright Fraunces, weight 500, tight tracking. Line-height tightens as the
size grows.

| Class         | `font-size` (clamp)                       | `line-height` | `letter-spacing` | Typical use |
|---------------|-------------------------------------------|---------------|------------------|-------------|
| `display-2xl` | `clamp(3rem, 2.5rem + 4vw, 6rem)`         | `0.96`        | `-0.04em`        | Closing band ("Stage yours next.") |
| `display-xl`  | `clamp(2.5rem, 2rem + 3vw, 5rem)`         | `0.98`        | `-0.035em`       | Page heroes ("Foster the Love of Dance") |
| `display-lg`  | `clamp(2.125rem, 1.75rem + 2.25vw, 3.75rem)` | `1.02`     | `-0.03em`        | Section heroes (Our Story, Community) |
| `display-md`  | `clamp(1.75rem, 1.45rem + 1.5vw, 2.75rem)` | `1.08`       | `-0.025em`       | Section headings (Productions, Portfolio) |
| `display-sm`  | `clamp(1.375rem, 1.15rem + 1vw, 2rem)`    | `1.18`        | `-0.02em`        | Sub-section headings, large captions |

Body text comes from Tailwind's standard `fontSize` map, tuned for editorial
reading lines:

| Class       | Size       | Line-height |
|-------------|-----------|-------------|
| `text-xs`   | 0.75rem    | 1rem        |
| `text-sm`   | 0.875rem   | 1.35rem     |
| `text-base` | 1rem       | 1.6rem      |
| `text-lg`   | 1.125rem   | 1.75rem     |
| `text-xl`   | 1.25rem    | 1.75rem     |

Default body sets `font-feature-settings: 'ss01', 'cv01', 'cv11'` and
antialiasing for legibility. Paragraphs use `text-wrap: pretty`; headings
use `text-wrap: balance`.

### 3.3 Eyebrow labels (the editorial "ticker" voice)

The site's editorial "stamp" is a small, all-caps mono label that sits above
section headings. Three reusable utility classes:

| Class                  | Definition |
|------------------------|------------|
| `.label-eyebrow`       | `font-mono text-[0.72rem] uppercase tracking-[0.28em] text-burgundy` |
| `.label-eyebrow-muted` | `font-mono text-[0.72rem] uppercase tracking-[0.28em] text-cream/55` |
| `.label-index`         | `font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cream/45` |

Used everywhere — `OUR STORY`, `COLLABORATORS`, `EST. 2002`, `01 · 2018`,
ticker strips. The wide tracking (≥ 0.28em) is what gives them their
"ticker" feel.

### 3.4 Letter spacing tokens

Beyond the display scale, custom `letterSpacing` tokens live in
`tailwind.config.ts`:

| Token           | Value     | When |
|-----------------|-----------|------|
| `tightest`      | `-0.04em` | display-2xl override |
| `tighter`       | `-0.025em`| display-md/lg override |
| `tight`         | `-0.015em`| display-sm |
| `normal`        | `0`       | body |
| `wide`          | `0.025em` | UI labels |
| `wider`         | `0.1em`   | small caps |
| `widest`        | `0.28em`  | mono eyebrows |

### 3.5 Italic policy

- **Display headings:** never italic. Upright Fraunces with weight 500
  + negative tracking handles authority.
- **Inline emphasis:** italic Fraunces (or Inter Tight italic) inside
  paragraph copy is fine — `<em>`, `<i>`, `[&_em]:italic`. The Fraunces
  italic style is still loaded for this purpose.
- **Production titles in prose:** wrap in `<em>` (e.g. *Raabta*, *Bodhayon*).

---

## 4. Layout primitives

| Primitive          | Value |
|--------------------|-------|
| Container max width | `1440px` (Tailwind `2xl` screen, `theme.container.screens.2xl`) |
| Container padding   | `1.25rem` mobile · `2rem` md · `3rem` lg |
| Default radius      | `4px` (`--radius`); `2px` for image cards |

Border-radius scale: `none → sm (2px) → DEFAULT (4px) → md (6px) → lg (10px) → xl (14px)`.
Editorial cards prefer `rounded-sm` (2px) so the rectangular newsprint feel reads.

---

## 5. Surface motifs

These small textural rules separate "Concert-Hall Noir" from a generic dark theme.

### Grain overlay
Used on hero sections to break the perfect black. Defined as `.grain` in
`globals.css` — fine fractal-noise SVG at `opacity: 0.06` with
`mix-blend-mode: screen`.

### Hairlines
Two utilities — both 1px gradients, fading at the edges:
- `.hairline` — cream/25 mid, transparent ends
- `.hairline-amber` — burgundy/55 mid, transparent ends

Used as section separators above eyebrows.

### Amber glow on the logo
`.logo-glow` → `drop-shadow(0 0 24px rgba(224, 141, 47, 0.25))`. Applied to
the BACDA logo when it sits over a hero photograph.

### Shadows
Soft, never hard. From `tailwind.config.ts`:

| Token   | Value |
|---------|-------|
| `sm`    | `0 1px 2px 0 rgb(0 0 0 / 0.30)` |
| `md`    | `0 10px 30px -6px rgb(0 0 0 / 0.45)` |
| `lg`    | `0 24px 60px -12px rgb(0 0 0 / 0.55)` |
| `glow`  | `0 0 40px -8px rgb(224 141 47 / 0.35)` — amber spread for hero CTAs |

---

## 6. Motion

### Curves
- `out-expo` — `cubic-bezier(0.22, 1, 0.36, 1)` — default for entrances + hovers
- `in-out-expo` — `cubic-bezier(0.87, 0, 0.13, 1)` — used for slow scrubs

### Durations
Custom Tailwind extensions: `duration-400`, `duration-600`, `duration-800`,
`duration-1000`, `duration-1200`. Most reveals run at 600–800ms.

### Keyframes
- `fade-in-up` — opacity 0 + 12px down → in place. Used for staggered
  section reveals via `Reveal` / `StaggerGroup` (framer-motion).
- `marquee` — pure-CSS infinite ticker, 40s linear. Pauses under
  `prefers-reduced-motion`.
- `accordion-up` / `accordion-down` — Radix UI compatibility.

### Reduced motion
Honored globally via `prefers-reduced-motion: reduce` — animation duration
clamped to 0.01ms, `marquee` halts, smooth scroll disabled.

---

## 7. Component patterns

| Pattern            | Recipe |
|--------------------|--------|
| Eyebrow + heading  | `<span className="label-eyebrow">SECTION</span>` then `<h2 className="display-md text-cream mt-4">…</h2>` |
| Editorial CTA      | Burgundy fill, 4px radius, ink text, `tracking-[0.22em]`, uppercase. Hover → `burgundy-dark`. |
| Underline link     | Cream/85 text, `border-b border-burgundy pb-0.5` baseline; hover → text becomes burgundy. |
| Index numeral      | `label-index` — `01 · 2018` style mono tag in the gutter of editorial lists. |
| Image card         | `aspect-[4/5]` portrait or container-natural ratio, `rounded-sm`, `ring-1 ring-cream/5`, `object-cover` (or `object-contain` when "show as-is" matters — see Productions/Bodhayon poster). |

---

## 8. Don'ts

- Don't introduce a new color outside the palette. If something needs a
  different state, derive it from the existing tokens (opacity tints like
  `text-cream/65`, `bg-burgundy/15`).
- Don't use italic Fraunces on display headings. Reserved for inline emphasis only.
- Don't use system fonts for heading or body. Always `font-display` /
  `font-sans` / `font-mono` from the tokens above.
- Don't add hard drop-shadows or glossy gradients — surfaces stay matte;
  warmth comes from the amber glow + grain, not gloss.
- Don't ship inline `style={}` for static styling. The only acceptable
  inline style is a dynamic CSS custom property (per CLAUDE.md §6).
- Don't ship admin pages on the dark public ground — admin uses cream
  inverse via `(admin)` route group's own layout.

---

## 9. Quick token reference (cheat sheet)

```
ink              #0B0B0E   // primary ground
ink-50           #16161A   // raised surface
ink-100          #1C1C21   // section block
ink-200          #262529   // border / divider

cream            #F5F0E6   // primary text on ink
cream-50         #FDFBF6
cream-200        #EAE3D3

burgundy         #E08D2F   // amber accent (links, eyebrows, primary CTA)
burgundy-dark    #C27017   // hover / active
gold             #F4B860   // logo highlight (decorative only)

font-display     Fraunces           // upright, weight 500 for display
font-sans        Inter Tight        // body, default
font-mono        JetBrains Mono     // eyebrows, ticker, index numerals

display-xl       hero headlines     (clamp 2.5–5rem, weight 500, -0.035em)
display-lg       section heroes     (clamp 2.125–3.75rem)
display-md       section headings   (clamp 1.75–2.75rem)
display-sm       sub-headings       (clamp 1.375–2rem)

.label-eyebrow         JetBrains, 0.72rem, uppercase, tracking 0.28em, burgundy
.label-eyebrow-muted   same, cream/55
.label-index           JetBrains, 0.70rem, uppercase, tracking 0.30em, cream/45
```

---

_Last updated: 2026-04-29. Update this file alongside any change to_
_`tailwind.config.ts` or `app/globals.css`._
