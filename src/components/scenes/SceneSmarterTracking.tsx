"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Stage } from "@/components/story/Stage";
import { Grain } from "@/components/story/Atmosphere";
import { PhoneFrame } from "@/components/story/PhoneFrame";
import { Reveal, ScrollWords } from "@/components/story/Text";
import {
  AccessibilityIcon,
  ArrowDownIcon,
  BellIcon,
  CircleCheckIcon,
  GitMergeIcon,
  InfoIcon,
  ScanLineIcon,
} from "./features/icons";

/* -------------------------------------------------------------------------- */
/* Journey path (Wonder: M400 640 C 560 640, 600 520, 720 520 S 900 640, 1020 560) */
/* -------------------------------------------------------------------------- */

const JOURNEY_D = "M400 640 C 560 640, 600 520, 720 520 S 900 640, 1020 560";

type Pt = [number, number];
const SEGMENTS: [Pt, Pt, Pt, Pt][] = [
  [[400, 640], [560, 640], [600, 520], [720, 520]],
  [[720, 520], [840, 520], [900, 640], [1020, 560]],
];

type Sample = { x: number; y: number; len: number };

/** Arc-length lookup table sampled from the cubic segments (no DOM needed, SSR-safe). */
const TABLE: Sample[] = (() => {
  const out: Sample[] = [];
  const steps = 120;
  let len = 0;
  SEGMENTS.forEach(([p0, p1, p2, p3], s) => {
    for (let i = s === 0 ? 0 : 1; i <= steps; i++) {
      const t = i / steps;
      const u = 1 - t;
      const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
      const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
      const prev = out[out.length - 1];
      if (prev) len += Math.hypot(x - prev.x, y - prev.y);
      out.push({ x, y, len });
    }
  });
  return out;
})();

function pointAt(fraction: number): { x: number; y: number } {
  const f = Math.min(1, Math.max(0, fraction));
  const target = f * TABLE[TABLE.length - 1].len;
  let lo = 0;
  let hi = TABLE.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (TABLE[mid].len < target) lo = mid + 1;
    else hi = mid;
  }
  return TABLE[lo];
}

const NOTE = "Optional · Supported UPI apps only · Never connects to your bank";

// Scroll timing (fractions of scene progress)
const DOT_START = 0.2;
const DOT_END = 0.74;
const pathFraction = (p: number) => (p - DOT_START) / (DOT_END - DOT_START);

export function SceneSmarterTracking() {
  return (
    <StoryScene
      id="smarter-tracking"
      chapter="smarter-tracking"
      label="Smarter tracking"
      length={3.5}
      rest={0.84}
      mobile={<MobileSmarterTracking />}
    >
      <DesktopSmarterTracking />
    </StoryScene>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop                                                                    */
/* -------------------------------------------------------------------------- */

function DesktopSmarterTracking() {
  const { progress } = useSceneProgress();

  // Everything except the accuracy note fades out at the end so the next scene joins cleanly.
  const outro = useTransform(progress, [0.92, 1], [1, 0]);
  const noteOpacity = useTransform(progress, [0, 0.05], [0, 1]);

  const labelOpacity = useTransform(progress, [0, 0.06], [0, 1]);
  const bodyOpacity = useTransform(progress, [0.12, 0.2], [0, 1]);
  const bodyY = useTransform(progress, [0.12, 0.2], [14, 0]);

  const cardX = useTransform(progress, [0.05, 0.22], [-420, 0]);
  const cardOpacity = useTransform(progress, [0.05, 0.14], [0, 1]);


  const pathOpacity = useTransform(progress, [0.1, 0.2], [0, 1]);

  const dotX = useTransform(progress, (v) => pointAt(pathFraction(v)).x - 18);
  const dotY = useTransform(progress, (v) => pointAt(pathFraction(v)).y - 18);
  const clipWidth = useTransform(progress, (v) => pointAt(pathFraction(v)).x);
  const dotOpacity = useTransform(progress, [0.16, 0.22], [0, 1]);

  const toastOpacity = useTransform(progress, [0.72, 0.8], [0, 1]);
  const toastY = useTransform(progress, [0.72, 0.8], [26, 0]);
  const toastScale = useTransform(progress, [0.72, 0.8], [0.95, 1]);

  return (
    <>
      <Grain />
      <Stage>
        <motion.div className="absolute inset-0" style={{ opacity: outro }}>
          {/* Journey glow */}
          <div
            aria-hidden
            className="absolute left-[300px] top-[420px] h-[360px] w-[800px] rounded-full bg-haze-faint blur-[140px]"
          />

          {/* Journey path: dim full path + bright path revealed up to the dot */}
          <motion.svg
            aria-hidden
            viewBox="0 0 1440 900"
            className="pointer-events-none absolute left-0 top-0 h-[900px] w-[1440px]"
            style={{ opacity: pathOpacity }}
          >
            <defs>
              <linearGradient id="journeyStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#9C97A8" stopOpacity="0.2" />
                <stop offset="0.6" stopColor="#B9A7FF" stopOpacity="0.8" />
                <stop offset="1" stopColor="#19E3A6" />
              </linearGradient>
              <clipPath id="journeyReveal">
                <motion.rect x={0} y={0} height={900} width={clipWidth} />
              </clipPath>
            </defs>
            <path
              d={JOURNEY_D}
              fill="none"
              stroke="url(#journeyStroke)"
              strokeWidth={2}
              strokeDasharray="6 8"
              opacity={0.4}
            />
            <path
              d={JOURNEY_D}
              fill="none"
              stroke="url(#journeyStroke)"
              strokeWidth={2.5}
              strokeDasharray="6 8"
              clipPath="url(#journeyReveal)"
            />
          </motion.svg>

          {/* Travelling dot */}
          <motion.div
            aria-hidden
            className="absolute left-0 top-0 h-9 w-9"
            style={{ x: dotX, y: dotY, opacity: dotOpacity, willChange: "transform" }}
          >
            <div className="absolute inset-0 rounded-full bg-violet/25" />
            <div className="absolute left-[11px] top-[11px] h-3.5 w-3.5 rounded-full bg-warm-white" />
          </motion.div>

          {/* Narrative */}
          <div className="absolute left-[120px] top-[140px] flex w-[640px] flex-col gap-[22px]">
            <motion.span
              className="w-fit font-sans text-xs font-semibold uppercase tracking-[3px] text-mint"
              style={{ opacity: labelOpacity }}
            >
              Chapter two
            </motion.span>
            <h2 className="block font-serif text-[56px] leading-[1.05] tracking-[-1px] text-warm-white">
              <ScrollWords
                text="What if tracking took less effort?"
                progress={progress}
                range={[0.02, 0.16]}
                emphasis={[4, 5]}
                emphasisClassName="italic"
              />
            </h2>
            <motion.p
              className="max-w-[560px] font-sans text-[17px] leading-[1.6] text-text-dim"
              style={{ opacity: bodyOpacity, y: bodyY }}
            >
              Pay with UPI. Paisa logs it for you.
            </motion.p>
          </div>

          {/* UPI success card */}
          <motion.div
            className="absolute left-[120px] top-[540px] flex w-[280px] flex-col gap-3 rounded-[22px] border border-hairline-strong bg-charcoal-raised p-[22px] shadow-[0px_30px_60px_rgba(0,0,0,0.5)]"
            style={{ x: cardX, opacity: cardOpacity, rotate: -3, willChange: "transform" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold uppercase tracking-[1.5px] text-text-dim">
                You pay
              </span>
              <CircleCheckIcon size={18} className="text-mint" />
            </div>
            <span className="font-sans text-[40px] font-bold leading-normal tracking-[-1px] text-warm-white">₹486</span>
            <span className="font-sans text-sm text-text-dim">To Swiggy Instamart</span>
            <span className="w-fit rounded-lg bg-haze px-2.5 py-1 font-sans text-xs font-medium text-lavender">
              via UPI
            </span>
          </motion.div>

          {/* Signal chips, lit in order by the travelling dot */}
          <SignalChip progress={progress} start={0.34} left={520} top={430} icon={<AccessibilityIcon size={15} className="text-lavender" />}>
            Payment spotted
          </SignalChip>
          <SignalChip progress={progress} start={0.46} left={560} top={580} icon={<BellIcon size={15} className="text-lavender" />}>
            Bank SMS matched
          </SignalChip>
          <SignalChip
            progress={progress}
            start={0.6}
            left={800}
            top={650}
            match
            icon={<GitMergeIcon size={15} className="text-mint" />}
          >
            Saved once, not twice
          </SignalChip>

          {/* Receiving phone (real home screen). Visible from the first frame: Scene 07's
              phone glides into exactly this spot (top-left pivot, 3° tilt). */}
          <div className="absolute left-[1040px] top-[150px]">
            <PhoneFrame screen="home" width={280} style={{ rotate: 3, transformOrigin: "0 0" }} />
          </div>

          {/* Detected toast lands on the phone */}
          <motion.div
            className="absolute left-[990px] top-[400px] flex w-[320px] items-center gap-3 rounded-[18px] border border-mint bg-charcoal-raised p-3.5 shadow-[0px_24px_50px_#00000099,0px_0px_40px_var(--color-mint-soft)]"
            style={{ opacity: toastOpacity, y: toastY, scale: toastScale }}
          >
            <div className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] bg-mint-soft">
              <ScanLineIcon size={18} className="text-mint" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-sans text-sm font-semibold text-warm-white">Swiggy Instamart · –₹486</span>
              <span className="font-sans text-xs text-text-dim">Added · tap to edit</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Accuracy note: visible for the whole chapter */}
        <motion.div
          className="absolute bottom-12 left-[120px] flex max-w-[1000px] items-center gap-2.5"
          style={{ opacity: noteOpacity }}
        >
          <InfoIcon size={15} className="text-text-dim" />
          <p className="font-sans text-[13px] leading-normal text-text-dim">{NOTE}</p>
        </motion.div>
      </Stage>
    </>
  );
}

function SignalChip({
  progress,
  start,
  left,
  top,
  icon,
  match = false,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  left: number;
  top: number;
  icon: ReactNode;
  match?: boolean;
  children: ReactNode;
}) {
  const lit = useTransform(progress, [start, start + 0.06], [0, 1]);
  const opacity = useTransform(lit, [0, 1], [0.32, 1]);
  const scale = useTransform(lit, [0, 1], [0.95, 1]);
  const y = useTransform(lit, [0, 1], [8, 0]);
  return (
    <motion.div
      className={`absolute flex h-[38px] items-center gap-2 rounded-full border px-3.5 ${
        match ? "border-mint bg-void" : "border-hairline-strong bg-charcoal"
      }`}
      style={{ left, top, opacity, scale, y }}
    >
      {/* glow that appears when the chip lights */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          opacity: lit,
          boxShadow: match
            ? "0 0 28px var(--color-mint-soft), inset 0 0 0 1px var(--color-mint)"
            : "0 0 26px var(--color-violet-glow), inset 0 0 0 1px var(--color-lavender)",
        }}
      />
      {icon}
      <span className={`font-sans text-[13px] text-warm-white ${match ? "font-semibold" : "font-medium"}`}>{children}</span>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile (Wonder frame `leo`)                                                */
/* -------------------------------------------------------------------------- */

function MobileSmarterTracking() {
  return (
    <div className="relative overflow-hidden bg-void px-6 py-20">
      <div aria-hidden className="absolute left-1/2 top-[45%] h-[300px] w-[420px] -translate-x-1/2 rounded-full bg-haze-faint blur-[100px]" />
      <div className="relative mx-auto flex max-w-[440px] flex-col gap-[22px]">
        <Reveal className="flex flex-col gap-3">
          <span className="w-fit font-sans text-[11px] font-semibold uppercase tracking-[3px] text-mint">Chapter two</span>
          <h2 className="font-serif text-4xl leading-[1.06] text-warm-white">
            What if tracking took <em>less effort?</em>
          </h2>
          <p className="font-sans text-base leading-[1.6] text-text-dim">
            Pay with UPI. Paisa logs it for you.
          </p>
        </Reveal>

        <div className="flex flex-col items-center gap-2">
          <Reveal className="w-full">
            <div className="flex w-full items-center justify-between rounded-[18px] border border-hairline-strong bg-charcoal-raised p-4">
              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[1.2px] text-text-dim">
                  You pay
                </span>
                <span className="font-sans text-[26px] font-bold text-warm-white">₹486</span>
                <span className="font-sans text-xs text-lavender">To Swiggy Instamart · via UPI</span>
              </div>
              <CircleCheckIcon size={22} className="text-mint" />
            </div>
          </Reveal>
          <ArrowDownIcon size={16} className="text-text-faint" />
          <div className="flex w-full flex-col gap-2">
            <Reveal delay={0.05}>
              <MobileChip icon={<AccessibilityIcon size={14} className="text-lavender" />}>Payment spotted</MobileChip>
            </Reveal>
            <Reveal delay={0.12}>
              <MobileChip icon={<BellIcon size={14} className="text-lavender" />}>Bank SMS matched</MobileChip>
            </Reveal>
            <Reveal delay={0.19}>
              <MobileChip match icon={<GitMergeIcon size={14} className="text-mint" />}>Saved once, not twice</MobileChip>
            </Reveal>
          </div>
          <ArrowDownIcon size={16} className="text-text-faint" />
          <Reveal className="w-full">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-mint bg-charcoal-raised p-3.5 shadow-[0px_0px_40px_var(--color-mint-soft)]">
              <ScanLineIcon size={18} className="text-mint" />
              <div className="flex flex-col">
                <span className="font-sans text-sm font-semibold text-warm-white">Swiggy Instamart · –₹486</span>
                <span className="font-sans text-xs text-text-dim">Added · tap to edit</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="flex items-start gap-2.5 font-sans text-xs leading-normal text-text-dim">
            <InfoIcon size={15} className="mt-px text-text-dim" />
            <span>{NOTE}</span>
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function MobileChip({ icon, match = false, children }: { icon: ReactNode; match?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3.5 py-2.5 ${
        match ? "border-mint" : "border-hairline-strong"
      }`}
    >
      {icon}
      <span className={`font-sans text-[13px] text-warm-white ${match ? "font-semibold" : ""}`}>{children}</span>
    </div>
  );
}
