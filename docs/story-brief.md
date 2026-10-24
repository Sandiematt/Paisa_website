# Paisa scroll story — implementation brief

The website recreates the Wonder design on the **Website** page of the Wonder file **"Paisa app ui"**
as a cinematic, scroll-driven story in this Next.js 16 / React 19 / Tailwind 4 / Motion 12 project.

## Wonder source (fetch with the Wonder MCP)

- pageId: `d055d2c5-63eb-5ccf-a7b4-c3886cd63ebe`
- Read a scene with `mcp__plugin_wonder_wonder__get_element_code` (`dataNodeIds: ["<id>"]`, same pageId).
  Screenshot with `mcp__plugin_wonder_wonder__take_screenshot` (mode "full" for detail). Read-only: never edit the Wonder file.
- Desktop frames are 1440×900; every element is absolutely positioned in that frame.

| Scene | Wonder node | Code file (component name) |
|---|---|---|
| 01 The Question | `arm` | `SceneQuestion.tsx` |
| 02 A little here + 03 The month is over | `lot`, `vex` | `SceneProblem.tsx` (one pinned scene, both beats) |
| 04 Turning point + 05 Paisa reveal | `sun`, `biz` | `SceneIdea.tsx` (one pinned scene, both beats) |
| 06 The product emerges | `win` | `SceneProduct.tsx` |
| 07 Chapter one — know where your money goes | `can` | `SceneKnowMoney.tsx` |
| 08 Chapter two — smarter tracking | `was` | `SceneSmarterTracking.tsx` |
| 09 Chapter three — numbers to insights | `abe` | `SceneInsights.tsx` |
| 10 Chapter four — better money habits | `joe` | `SceneHabits.tsx` |
| 11 Behind the idea | `maw` | `SceneBehind.tsx` |
| 12 The story continues | `ltd` | `SceneFinal.tsx` |
| Mobile keyframes | `sin` (question), `aus` (reveal + product), `leo` (smarter tracking), `joy` (final) | used as the mobile reference for all scenes |

Do **not** recreate each frame's "Story Navigation" bar — a global fixed `<StoryNav>` already exists.

### Wonder → code mapping

- Tokens: `[color:var(--film-x)]` → `text-x`, `[background-color:var(--film-x)]` → `bg-x`, `[border-color:var(--film-x)]` → `border-x`.
  All film tokens exist as Tailwind colours (see `src/app/globals.css`): void, charcoal, charcoal-raised, hairline, hairline-strong,
  warm-white, paper, text-dim, text-faint, text-ghost, ink, ink-soft, violet, violet-deep, violet-glow, lavender, mint, mint-soft,
  mint-haze, coral, haze, haze-faint, scrim, gold, app-ground, primary-wash, surface-strong, line-light.
  `var(--site-primary-wash)` → `primary-wash`, `--site-surface-strong` → `surface-strong`, `--site-line` → `line-light`,
  `--site-ground` → `white`, `--dx-ground` → `app-ground`, `--dx-gold` → `gold`.
- Fonts: `var(--font-dx-serif)` → `font-serif` (Instrument Serif), `var(--font-dx-jakarta)` → `font-sans` (Plus Jakarta Sans),
  `var(--font-film-mono)` → `font-mono` (JetBrains Mono).
- Icons in Wonder are inline SVGs exported from Lucide (`react-icons/lu`). Recreate them as small inline SVGs (copy the path data
  from the Wonder code) — do not add an icon dependency.
- Images in Wonder code appear as divs with a CDN background URL. Map them to local assets:
  `…cf5fe6b0…png` → `screens.home`, `…a8cee247…png` → `screens.insights`, `…2e913085…png` → `screens.profile`,
  `…96c91adb…png` → `logoMark` (all in `src/lib/site.ts`; files in `public/app`, `public/brand`).
- Wonder ignored `opacity-*` classes, so its glows render stronger than intended. In code, glows/haze are subtle: use the
  `haze`, `haze-faint`, `mint-haze` colours with large blur, and real `opacity` where the Wonder class asked for it.

## Shared primitives (do not edit these files; build anything extra inside your own scene files)

- `StoryScene` (`src/components/story/StoryScene.tsx`): props `id, chapter, label, length (viewport heights, default 2.5),
  rest (reduced-motion progress), navTheme ("dark"|"light"), navBrand ("dim"|"full"|"hidden"), className (pinned viewport
  background), children (desktop), mobile (mobile node)`. Desktop is a tall section with a sticky 100svh viewport.
  Inside, `useSceneProgress()` returns `{ progress, reduced }`; `progress` runs 0→1 while pinned.
- `Stage` (`src/components/story/Stage.tsx`): the 1440×900 frame, centred and scaled to the viewport. Put Wonder-positioned
  content inside with the same pixel coordinates. Full-bleed backgrounds (grain, large glows, background colour) go outside.
- `Grain`, `Particles` (`src/components/story/Atmosphere.tsx`).
- `PhoneFrame`, `ScreenImage`, `ScreenCrop` (`src/components/story/PhoneFrame.tsx`): realistic phone with real screenshots;
  `screenY` scrolls the screenshot inside the screen, `dim` adds a scrim, stack `<ScreenImage>` children to crossfade screens,
  `ScreenCrop` shows a floating piece of a real screen (crop coords in px of the screenshot rendered at `scale` width).
  Screenshots are 390px wide: home 390×1113, insights 390×1221, profile 390×978.
  Known crops at 312 width: balance card x12 y137 w287 h241; quick actions strip x12 y376 w287 h78; budget & savings section
  starts around y 545 (Scene 10 uses screenY −214). At 390 width: profile "Budget alerts" row x16 y720 w358 h64.
- `ScrollWords` (word-by-word scroll-linked reveal) and `Reveal` (mobile in-view fade) in `src/components/story/Text.tsx`.
- `links`, `screens`, `logoMark`, `chapters` in `src/lib/site.ts`. Links are `null` until real: hide a button whose link is null.

## Choreography (from the Wonder motion notes)

- 01 Question: pinned ~120vh. Words fade/un-blur one by one (60 ms stagger) on load; on scroll the line drifts up and dissolves,
  particles drift slowly, first numbers start appearing at the edges.
- 02/03 Problem: pinned. Three parallax layers — far (0.3×, blurred), mid (0.6×), near (1×, slight rotation). Lines swap by
  progress: "A little here." → "A little there." → "And somehow… / the month is over." Clutter peaks (more chips/alerts, the "31"
  numeral rises behind, centre scrim keeps text readable), then everything drifts outward and fades to black.
- 04/05 Idea: quiet. "One day, I asked myself…" fades in, the question resolves word by word; camera zoom scale 1→1.06 while a
  focus point grows from a dot into a soft glow. The glow expands into halo rings; the logo scales from 0.8 with blur→sharp;
  "Paisa." tracks in; tagline follows. Nav brand is hidden during the reveal (`navBrand="hidden"`), dim before it.
- 06 Product: the halo collapses into a phone that rotates in (rotateY 18° → −4°). Real UI pieces (balance card, quick actions)
  fly from offset positions into their dashed slots, then the screen un-dims.
- 07 Chapter one: phone pinned centre ~250vh. Highlight ring moves balance → budget → quick actions; the matching callout lights up
  while others dim; background ₹ layers move at different speeds.
- 08 Chapter two: payment card slides in from the left; a dot travels the dashed path lighting each signal chip in order; the mint
  toast lands on the phone. The accuracy note stays visible for the whole chapter.
- 09 Chapter three: phone scales toward the viewer and switches to the Insights screen; transaction rows regroup into category
  bars, bars condense into a one-line insight, then the AI card slides in beside the phone.
- 10 Chapter four: background crossfades charcoal → warm paper (`navTheme="light"`); the phone screen scrolls to budget & savings,
  rings/81% bar fill, the Budget alerts row floats up from the profile screen.
- 11 Behind the idea: not pinned (natural scroll, use a short `length`, e.g. 1.4) — editor, sketch and UI crop parallax at
  different speeds, code types in once, build-path dots fill left to right. Bracketed copy is placeholder text for the owner.
- 12 Final: returns to the reveal palette; phone floats with a slow idle bob (off for reduced motion); CTAs fade in last;
  "Watch the story again" links to `#question`; nothing below is pinned.
- Mobile (below `md`): no pinning. Each chapter is a short natural-scroll block with `Reveal` fades; no parallax; the phone appears
  at most once per chapter. Reduced motion: static resting frames everywhere (`rest` must show the complete composition).

Scenes chain one after another: fade/ease content in during progress ≈0–0.12 and out during ≈0.88–1 so neighbouring pinned
scenes feel continuous. Keep backgrounds identical at scene boundaries (void), except Chapter four which transitions itself.
Animations must reverse cleanly when scrolling up — derive everything from `progress` with `useTransform`, never from one-shot
timers (except the scene-01 load stagger and the final idle bob).

## Rules

- Use the real copy from the Wonder frames. Keep every "sample data" / "Real Paisa screen" label and accuracy note. Do not invent
  features, stats, integrations, testimonials, dates or personal anecdotes.
- Accessibility: one `h1` (scene 01's question); every other scene title is an `h2`. Decorative layers `aria-hidden`.
  Images keep meaningful alt text. Text contrast ≥ 4.5:1 for body copy. Interactive elements are real `<a>`/`<button>` with focus styles.
- Performance: animate transform, opacity and (sparingly) filter only; add `will-change: transform` to big moving layers; no layout
  thrash, no scroll listeners — use Motion's `useScroll`/`useTransform` via `useSceneProgress`.
- Only touch your own files under `src/components/scenes/` (you may add helper files in a sub-folder named after your scene).
  Do not edit shared files, package.json or config; if a primitive is missing, implement it locally in your file.
- Verify with `npx tsc --noEmit` and `npx eslint <your files>` from the project root. Do **not** run `next dev` or `next build`
  (other agents work in parallel; the lead runs the build).
