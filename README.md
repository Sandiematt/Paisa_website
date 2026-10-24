<div align="center">

<img src="public/brand/paisa-mark.png" alt="Paisa logo" width="120" />

# Paisa — Website

**Your money. Your clarity.**

A cinematic, scroll-driven story about how a simple question became **Paisa**, an Android expense tracker
that brings your balance, income and spending into one clear picture.

[Paisa app repository](https://github.com/Sandiematt/Paisa) · [Developer portfolio](https://sandiematt.com)

</div>

---

## About

This is the marketing website for Paisa. Instead of a conventional landing page, it unfolds like a short film:

1. **The question** — *What if managing money… just made sense?*
2. **The problem** — scattered payments pile up until *the month is over.*
3. **The idea** — a turning point and the Paisa reveal.
4. **The product** — the real app assembles inside a floating phone.
5. **Know your money** — balance, budget and quick actions on the home screen.
6. **Smarter tracking** — how supported UPI payments can be detected and logged once.
7. **Insights** — transactions become categories, then plain-language AI insights.
8. **Better habits** — budgets, savings goals and budget alerts.
9. **Behind the idea** — the builder's perspective.
10. **The story continues** — explore Paisa or view the project on GitHub.

The design was created in Wonder and recreated here faithfully; every phone shows real Paisa app screens with
sample data.

## Features

- **Launch splash** — the app's own Lottie animation (`src/assets/paisa-splash.json`) plays on first load with
  the same size, colour and timing as the Android app, then fades into the story.
- **Scroll-linked storytelling** — pinned scenes, multi-layer parallax, word-by-word text reveals and seamless
  hand-offs between chapters, all driven by scroll position so they reverse when scrolling back up.
- **Faithful layouts** — desktop scenes reproduce the 1440×900 Wonder frames and scale to any viewport.
- **Mobile-first fallbacks** — on phones, pinned scenes become short, naturally scrolling sequences.
- **Accessible** — respects `prefers-reduced-motion` (static resting frames), keyboard focus styles, a skip link,
  semantic headings and readable contrast.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Motion](https://motion.dev) for scroll-linked animation
- [lottie-web](https://github.com/airbnb/lottie-web) for the splash
- Fonts: Instrument Serif, Plus Jakarta Sans, JetBrains Mono (via `next/font`)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Project structure

```
src/
  app/                  layout, page, global styles and design tokens
  assets/               Lottie splash animation
  components/
    splash/             launch splash
    story/              shared primitives: StoryScene, Stage, PhoneFrame, StoryNav, text reveals
    scenes/             one file per chapter
  lib/site.ts           links, app screens and chapter list
public/
  app/                  real Paisa app screens
  brand/                Paisa logo
docs/story-brief.md     design-to-code brief (scene map, tokens, choreography)
```

## Configuration

Outbound links live in `src/lib/site.ts`. Any link left as `null` (download, privacy policy, terms, support) is
hidden rather than rendered as a dead button.

The "Behind the idea" chapter contains two bracketed placeholders at the top of
`src/components/scenes/SceneBehind.tsx` for the builder's own story.

## Links

- App: [github.com/Sandiematt/Paisa](https://github.com/Sandiematt/Paisa)
- Developer: [sandiematt.com](https://sandiematt.com)
