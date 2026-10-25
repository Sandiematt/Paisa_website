"use client";

import { useEffect } from "react";
import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";

import { Grain, Particles } from "@/components/story/Atmosphere";
import { Stage } from "@/components/story/Stage";
import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";

/* -------------------------------------------------------------------------- */
/*  Copy + load choreography                                                  */
/* -------------------------------------------------------------------------- */

type QuestionWord = { text: string; className: string; blur: number };

const BASE = "font-serif leading-[1.05]";

/**
 * The Wonder frame is a snapshot mid-reveal ("made" ghosted, "sense?" faint and
 * blurred). Those states are what the words pass through during the load
 * stagger; the line resolves fully, with "sense?" landing in lavender.
 */
const WORDS: QuestionWord[] = [
  { text: "What", className: "text-warm-white", blur: 0 },
  { text: "if", className: "text-warm-white", blur: 0 },
  { text: "managing", className: "text-warm-white", blur: 0 },
  { text: "money…", className: "text-warm-white", blur: 0 },
  { text: "just", className: "italic text-warm-white", blur: 0 },
  { text: "made", className: "italic text-warm-white", blur: 0 },
  { text: "sense?", className: "italic text-lavender", blur: 0 },
];

// Wonder's motion note says 60 ms; with a 1 s per-word fade that reads as one
// block, so the gap is doubled to make the word-by-word arrival legible.
const STAGGER = 0.12;
const WORD_DURATION = 0.9;
const CLOCK_END = (WORDS.length - 1) * STAGGER + WORD_DURATION;
const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);
const SPLASH_FALLBACK_MS = 10000;

/**
 * Seconds-based clock for the one-shot load stagger. It starts after the
 * Lottie splash reports done (`paisa:splash-done`) — or immediately when no
 * splash is active — and is pinned to its end value with reduced motion so the
 * words are fully visible and static.
 */
function useLoadClock(): MotionValue<number> {
  const reduced = useReducedMotion();
  const clock = useMotionValue(0);

  useEffect(() => {
    if (reduced) {
      clock.set(CLOCK_END);
      return;
    }
    let controls: AnimationPlaybackControls | undefined;
    let fallback: number | undefined;
    const run = () => {
      if (controls) return;
      window.clearTimeout(fallback);
      window.removeEventListener("paisa:splash-done", run);
      controls = animate(clock, CLOCK_END, { duration: CLOCK_END, ease: "linear" });
    };
    if (document.documentElement.classList.contains("splash-active")) {
      window.addEventListener("paisa:splash-done", run);
      // Safety net so the headline can never stay hidden if the splash stalls.
      fallback = window.setTimeout(run, SPLASH_FALLBACK_MS);
    } else {
      run();
    }
    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener("paisa:splash-done", run);
      controls?.stop();
    };
  }, [reduced, clock]);

  return clock;
}

function Word({
  word,
  index,
  clock,
  size,
}: {
  word: QuestionWord;
  index: number;
  clock: MotionValue<number>;
  size: string;
}) {
  const from = index * STAGGER;
  const to = from + WORD_DURATION;
  const ease = EASE_OUT;
  const opacity = useTransform(clock, [from, to], [0, 1], { ease });
  const y = useTransform(clock, [from, to], [18, 0], { ease });
  const blur = useTransform(clock, [from, to], [word.blur + 10, word.blur], { ease });
  const filter = useTransform(blur, (b) => (b > 0.05 ? `blur(${b}px)` : "none"));
  return (
    <motion.span
      className={`block w-fit ${BASE} ${size} ${word.className}`}
      style={{ opacity, y, filter }}
    >
      {word.text}
    </motion.span>
  );
}

function ScrollCueIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="5" y="2" width="14" height="20" rx="7" />
      <path d="M12 6v4" />
    </svg>
  );
}

const PARTICLES = [
  { x: 182, y: 164, r: 1.6, opacity: 0.5 },
  { x: 318, y: 702, r: 1.2, opacity: 0.35 },
  { x: 502, y: 248, r: 2, color: "#B9A7FF", opacity: 0.45 },
  { x: 640, y: 790, r: 1.4, opacity: 0.3 },
  { x: 884, y: 138, r: 1.2, opacity: 0.4 },
  { x: 1012, y: 660, r: 2.2, color: "#B9A7FF", opacity: 0.35 },
  { x: 1188, y: 272, r: 1.5, opacity: 0.45 },
  { x: 1296, y: 748, r: 1.2, opacity: 0.3 },
  { x: 96, y: 512, r: 1.3, opacity: 0.3 },
  { x: 1350, y: 470, r: 1.8, color: "#19E3A6", opacity: 0.35 },
  { x: 760, y: 96, r: 1, opacity: 0.5 },
  { x: 420, y: 560, r: 1, opacity: 0.25 },
  { x: 1110, y: 842, r: 1.4, opacity: 0.3 },
  { x: 246, y: 836, r: 1.8, color: "#B9A7FF", opacity: 0.25 },
];

/* -------------------------------------------------------------------------- */
/*  Desktop                                                                   */
/* -------------------------------------------------------------------------- */

function QuestionDesktop() {
  const { progress } = useSceneProgress();
  const clock = useLoadClock();

  // The line drifts up and dissolves.
  const lineY = useTransform(progress, [0, 0.55], [0, -150]);
  const lineOpacity = useTransform(progress, [0.06, 0.5], [1, 0]);
  const lineBlur = useTransform(progress, [0.06, 0.5], [0, 12]);
  const lineFilter = useTransform(lineBlur, (b) => (b > 0.05 ? `blur(${b}px)` : "none"));
  const cueOpacity = useTransform(progress, [0, 0.08], [1, 0]);
  const particlesY = useTransform(progress, [0, 1], [0, -110]);
  const glowOpacity = useTransform(progress, [0, 0.7, 1], [1, 0.75, 0.5]);

  // Hand-off: the first numbers appear at the edges (same spots as the problem scene).
  const edgeOpacity = useTransform(progress, [0.3, 0.85], [0, 0.85]);
  const edgeY = useTransform(progress, [0.3, 1], [40, 0]);

  return (
    <>
      <Grain />
      <motion.div aria-hidden className="absolute inset-0" style={{ y: particlesY, willChange: "transform" }}>
        <Particles points={PARTICLES} />
      </motion.div>

      <Stage>
        {/* Ambient violet light */}
        <motion.div
          aria-hidden
          className="absolute left-[220px] top-[170px] h-[560px] w-[1000px] rounded-full bg-haze-faint blur-[180px]"
          style={{ opacity: glowOpacity }}
        />

        {/* First scattered numbers, blurred and far away */}
        <motion.div
          aria-hidden
          className="absolute inset-0 blur-[3px]"
          style={{ opacity: edgeOpacity, y: edgeY }}
        >
          <span className="absolute left-[180px] top-[150px] block font-serif text-[120px] leading-normal text-text-faint">
            ₹
          </span>
          <span className="absolute left-[1060px] top-[180px] block text-[22px] font-medium leading-normal text-text-dim">
            –₹89
          </span>
          <span className="absolute left-[300px] top-[700px] block text-xl font-medium leading-normal text-text-dim">
            –₹240
          </span>
          <span className="absolute left-[1180px] top-[620px] block font-serif text-8xl leading-normal text-text-faint">
            ₹
          </span>
        </motion.div>

        {/* The one h1 of the page */}
        <motion.h1
          className="absolute left-0 top-[360px] flex w-full flex-wrap items-baseline justify-center gap-x-[22px] px-[160px]"
          style={{ y: lineY, opacity: lineOpacity, filter: lineFilter, willChange: "transform, opacity" }}
        >
          <span className="sr-only">What if managing money… just made sense?</span>
          <span aria-hidden className="contents">
            {WORDS.map((w, i) => (
              <Word key={w.text} word={w} index={i} clock={clock} size="text-[92px] tracking-[-1.5px]" />
            ))}
          </span>
        </motion.h1>

        {/* Scroll cue */}
        <motion.div
          aria-hidden
          className="absolute bottom-12 left-0 flex w-full flex-col items-center gap-3.5"
          style={{ opacity: cueOpacity }}
        >
          <ScrollCueIcon className="size-5 text-text-dim" />
          <span className="block text-xs font-medium uppercase leading-normal tracking-[3px] text-text-dim">
            Scroll to begin
          </span>
          <span className="block h-10 w-px bg-gradient-to-b from-text-dim to-void motion-safe:animate-pulse" />
        </motion.div>
      </Stage>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile (Wonder `sin`)                                                     */
/* -------------------------------------------------------------------------- */

function QuestionMobile() {
  const clock = useLoadClock();
  return (
    <div className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-void px-6 pb-32 pt-28">
      <Grain />
      <div
        aria-hidden
        className="absolute -left-[60px] top-[240px] h-[400px] w-[510px] rounded-full bg-haze-faint blur-[100px]"
      />
      <Particles
        points={[
          // Particles scales as a 1440×900 "slice"; on a phone only x≈520–920 is visible.
          { x: 560, y: 190, r: 1.2, opacity: 0.4 },
          { x: 880, y: 255, r: 1.5, color: "#B9A7FF", opacity: 0.4 },
          { x: 840, y: 660, r: 1.2, opacity: 0.3 },
          { x: 580, y: 745, r: 1.4, color: "#19E3A6", opacity: 0.3 },
        ]}
      />
      <h1 className="relative mx-auto flex w-full max-w-[440px] flex-wrap items-baseline gap-x-3 gap-y-0">
        <span className="sr-only">What if managing money… just made sense?</span>
        <span aria-hidden className="contents">
          {WORDS.map((w, i) => (
            <Word key={w.text} word={w} index={i} clock={clock} size="text-[50px] tracking-[-1px]" />
          ))}
        </span>
      </h1>
      <div
        aria-hidden
        className="absolute bottom-10 left-0 flex w-full flex-col items-center gap-2.5"
      >
        <ScrollCueIcon className="size-[18px] text-text-dim" />
        <span className="block text-[11px] font-medium uppercase leading-normal tracking-[3px] text-text-dim">
          Scroll to begin
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

export function SceneQuestion() {
  return (
    <StoryScene
      id="question"
      chapter="question"
      label="The question"
      length={2.2}
      rest={0}
      navBrand="dim"
      mobile={<QuestionMobile />}
    >
      <QuestionDesktop />
    </StoryScene>
  );
}
