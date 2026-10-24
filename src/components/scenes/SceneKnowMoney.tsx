"use client";

import type { ReactNode } from "react";
import { cubicBezier, motion, useTransform, type MotionValue } from "motion/react";

import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Stage } from "@/components/story/Stage";
import { Grain } from "@/components/story/Atmosphere";
import { PhoneFrame } from "@/components/story/PhoneFrame";
import { Reveal } from "@/components/story/Text";

const EASE = cubicBezier(0.65, 0, 0.35, 1);
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

/**
 * Scene 07 timeline (progress)
 * 0.00-0.12  narrative enters (phone is already in place, continuing from Scene 06)
 * 0.00-0.36  balance active   | ring on balance card
 * 0.36-0.64  budget active    | ring on the budget strip
 * 0.64-0.92  actions active   | ring on quick actions
 * 0.92-1.00  narrative + callouts leave, phone stays pinned for the next chapter
 */

const callouts = [
  {
    key: "balance",
    title: "Available balance",
    body: "What you actually have left, updated as money comes in and goes out.",
    // vertical centre of the callout row, in stage coordinates
    centerY: 345,
    from: { x: 28, y: -16 },
  },
  {
    key: "budget",
    title: "Budget left this month",
    body: "See how much of this month's budget is still available.",
    centerY: 483,
    from: { x: 28, y: 16 },
  },
  {
    key: "actions",
    title: "Income, expenses & history",
    body: "Add an expense or income, or open your full history.",
    centerY: 553,
    from: { x: 28, y: -16 },
  },
] as const;

/** Progress -> "is the active callout" (0-1) keyframes for each callout. */
const activeKeys: { input: number[]; output: number[] }[] = [
  { input: [0, 0.34, 0.4], output: [1, 1, 0] },
  { input: [0.34, 0.4, 0.6, 0.66], output: [0, 1, 1, 0] },
  { input: [0.6, 0.66], output: [0, 1] },
];

/** Fades/slides a block in around progress 0-0.12 and out around 0.92-1. */
function Layer({
  progress,
  enter = [0, 0.12],
  exit = [0.9, 0.98],
  fromX = 0,
  fromY = 0,
  toX = -32,
  className = "",
  children,
}: {
  progress: MotionValue<number>;
  enter?: [number, number];
  exit?: [number, number];
  fromX?: number;
  fromY?: number;
  toX?: number;
  className?: string;
  children: ReactNode;
}) {
  const input = [enter[0], enter[1], exit[0], exit[1]];
  const opacity = useTransform(progress, input, [0, 1, 1, 0]);
  const x = useTransform(progress, input, [fromX, 0, 0, toX], { ease: EASE_OUT });
  const y = useTransform(progress, input, [fromY, 0, 0, 0], { ease: EASE_OUT });
  return (
    <motion.div className={className} style={{ opacity, x, y }}>
      {children}
    </motion.div>
  );
}

function Callout({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const c = callouts[index];
  const keys = activeKeys[index];
  const active = useTransform(progress, keys.input, keys.output);

  // Presence: callouts appear with the narrative and leave with it.
  const presence = useTransform(progress, [0.04, 0.14, 0.9, 0.98], [0, 1, 1, 0]);
  const dimmed = useTransform(active, [0, 1], [0.55, 1]);
  const opacity = useTransform(() => presence.get() * dimmed.get());
  // Alternating entry directions each time a callout becomes active.
  const shiftX = useTransform(active, [0, 1], [c.from.x * 0.4, 0], { ease: EASE_OUT });
  const shiftY = useTransform(active, [0, 1], [c.from.y * 0.4, 0], { ease: EASE_OUT });
  const descOpacity = useTransform(active, [0.3, 1], [0, 1]);
  const descX = useTransform(active, [0, 1], [c.from.x, 0], { ease: EASE_OUT });
  const descY = useTransform(active, [0, 1], [c.from.y, 0], { ease: EASE_OUT });
  const inactive = useTransform(active, (a) => 1 - a);
  const lineScale = useTransform(active, [0, 1], [0.78, 1]);
  const titleColor = useTransform(active, [0, 1], ["#9c97a8", "#f5f1ea"]);

  return (
    <div className="absolute left-[884px]" style={{ top: c.centerY - 12 }}>
      <motion.div style={{ opacity, x: shiftX, y: shiftY }} className="relative h-6 w-[430px]">
        {/* dot */}
        <div className="absolute left-0 top-0 flex h-6 w-[10px] items-center justify-center">
          <motion.span
            aria-hidden
            className="absolute size-2 rounded-full bg-text-dim"
            style={{ opacity: inactive }}
          />
          <motion.span
            aria-hidden
            className="absolute size-2.5 rounded-full bg-mint shadow-[0px_0px_12px_var(--color-mint)]"
            style={{ opacity: active }}
          />
        </div>
        {/* line */}
        <div className="absolute left-[10px] top-[11.5px] h-px w-[110px]">
          <div className="absolute inset-0 bg-hairline-strong" />
          <motion.div
            aria-hidden
            className="absolute inset-0 origin-left bg-mint"
            style={{ opacity: active, scaleX: lineScale }}
          />
        </div>
        {/* text */}
        <div className="absolute left-[136px] top-0 w-[300px]">
          <motion.span
            className="block whitespace-nowrap text-[17px] font-semibold leading-6"
            style={{ color: titleColor }}
          >
            {c.title}
          </motion.span>
          <motion.span
            className="mt-1 block text-sm leading-normal text-text-dim"
            style={{ opacity: descOpacity, x: descX, y: descY }}
          >
            {c.body}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}

function KnowDesktop() {
  const { progress } = useSceneProgress();

  // Highlight ring: balance card -> budget strip (bottom of the card) -> quick actions.
  const ringY = useTransform(progress, [0, 0.3, 0.4, 0.56, 0.66, 1], [0, 0, 203, 203, 253, 253], { ease: EASE });
  const ringH = useTransform(progress, [0, 0.3, 0.4, 0.56, 0.66, 1], [200, 200, 40, 40, 80, 80], { ease: EASE });
  const ringR = useTransform(progress, [0, 0.3, 0.4, 0.56, 0.66, 1], [20, 20, 12, 12, 16, 16], { ease: EASE });
  const ringOpacity = useTransform(progress, [0, 0.12, 0.9, 0.95], [1, 1, 1, 0]);

  // Hand-off to Scene 08 (its phone: left 1040, top 150, screen 280 → scale 280/312, rotate 3°).
  const handoffX = useTransform(progress, [0.92, 1], [0, 480], { ease: EASE });
  const handoffY = useTransform(progress, [0.92, 1], [0, 38], { ease: EASE });
  const handoffScale = useTransform(progress, [0.92, 1], [1, 280 / 312], { ease: EASE });
  const handoffRotate = useTransform(progress, [0.92, 1], [0, 3], { ease: EASE });

  // Parallax rupee glyphs
  const farY = useTransform(progress, [0, 1], [50, -90]);
  const nearY = useTransform(progress, [0, 1], [140, -200]);
  const nearX = useTransform(progress, [0, 1], [0, 40]);
  const glyphOpacity = useTransform(progress, [0, 0.12], [0.6, 1]);

  // Step indicator
  const a0 = useTransform(progress, [0, 0.34, 0.4], [1, 1, 0]);
  const a1 = useTransform(progress, [0.34, 0.4, 0.6, 0.66], [0, 1, 1, 0]);
  const a2 = useTransform(progress, [0.6, 0.66], [0, 1]);
  const w0 = useTransform(a0, [0, 1], [14, 28]);
  const w1 = useTransform(a1, [0, 1], [14, 28]);
  const w2 = useTransform(a2, [0, 1], [14, 28]);
  const stepTracks = [
    { a: a0, w: w0 },
    { a: a1, w: w1 },
    { a: a2, w: w2 },
  ];

  return (
    <>
      <Grain />
      <Stage>
        <motion.span
          aria-hidden
          className="absolute left-[1080px] top-[-60px] block select-none font-serif text-[520px] leading-none text-charcoal"
          style={{ y: farY, opacity: glyphOpacity, willChange: "transform" }}
        >
          ₹
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute left-[-40px] top-[520px] block select-none font-serif text-[360px] leading-none text-charcoal blur-[2px]"
          style={{ y: nearY, x: nearX, opacity: glyphOpacity, willChange: "transform" }}
        >
          ₹
        </motion.span>
        <div
          aria-hidden
          className="absolute left-[480px] top-[180px] h-[560px] w-[480px] rounded-full bg-haze-faint blur-[120px]"
        />

        {/* Narrative column */}
        <div className="absolute left-[120px] top-[250px] flex w-[380px] flex-col gap-6">
          <Layer progress={progress} enter={[0, 0.08]} fromX={-24}>
            <span className="block w-fit text-xs font-semibold uppercase tracking-[3px] text-mint">
              Chapter one
            </span>
          </Layer>
          <Layer progress={progress} enter={[0.02, 0.12]} fromY={24}>
            <h2 className="font-serif text-[64px] leading-[1.02] tracking-[-1.2px] text-warm-white">
              Every rupee has <em>a story.</em>
            </h2>
          </Layer>
          <Layer progress={progress} enter={[0.05, 0.14]} fromX={-24}>
            <p className="text-lg leading-[1.6] text-text-dim">
              Paisa brings your income, expenses and available balance into one clear picture.
            </p>
          </Layer>
        </div>

        {/* Pinned phone (same frame as Scene 06's resting position: x 560, y 112, upright).
            In the last 8% it glides into Scene 08's receiving-phone spot (x 1040, y 150,
            280px screen, 3° tilt) so the next chapter picks it up without a jump. */}
        <motion.div
          className="absolute left-[560px] top-[112px]"
          style={{ x: handoffX, y: handoffY, scale: handoffScale, rotate: handoffRotate, transformOrigin: "0 0", willChange: "transform" }}
        >
          <PhoneFrame screen="home">
            <motion.div
              aria-hidden
              className="absolute left-3 top-[137px] w-[287px] border-2 border-mint shadow-[0px_0px_30px_var(--color-mint-soft)]"
              style={{ y: ringY, height: ringH, borderRadius: ringR, opacity: ringOpacity }}
            />
          </PhoneFrame>
        </motion.div>

        {callouts.map((c, i) => (
          <Callout key={c.key} progress={progress} index={i} />
        ))}

        {/* Step indicator + caption */}
        <Layer progress={progress} enter={[0, 0.1]} exit={[0.92, 1]} toX={0} className="absolute bottom-16 left-[120px]">
          <div className="flex items-center gap-2.5">
            {stepTracks.map((s, i) => (
              <motion.div
                key={i}
                aria-hidden
                className="relative h-[3px] overflow-hidden rounded-full bg-hairline-strong"
                style={{ width: s.w }}
              >
                <motion.div className="absolute inset-0 bg-mint" style={{ opacity: s.a }} />
              </motion.div>
            ))}
            <span className="pl-2 text-xs text-text-faint">Real Paisa screen · sample data</span>
          </div>
        </Layer>
      </Stage>
    </>
  );
}

function KnowMobile() {
  const k = 260 / 312;
  return (
    <div className="relative overflow-hidden bg-void px-6 py-20">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-10 select-none font-serif text-[260px] leading-none text-charcoal"
      >
        ₹
      </span>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[360px] h-[420px] w-[360px] -translate-x-1/2 rounded-full bg-haze-faint blur-[100px]"
      />
      <div className="relative flex flex-col gap-4">
        <Reveal>
          <span className="block text-xs font-semibold uppercase tracking-[3px] text-mint">Chapter one</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-serif text-[44px] leading-[1.05] tracking-[-1px] text-warm-white">
            Every rupee has <em>a story.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-base leading-[1.6] text-text-dim">
            Paisa brings your income, expenses and available balance into one clear picture.
          </p>
        </Reveal>
      </div>

      <Reveal className="relative mt-12 flex justify-center">
        <PhoneFrame screen="home" width={260}>
          <div
            aria-hidden
            className="absolute border-2 border-mint shadow-[0px_0px_30px_var(--color-mint-soft)]"
            style={{
              left: 12 * k,
              top: 137 * k,
              width: 287 * k,
              height: 200 * k,
              borderRadius: 20 * k,
            }}
          />
        </PhoneFrame>
      </Reveal>

      <ul className="relative mt-12 flex flex-col gap-6">
        {callouts.map((c, i) => (
          <li key={c.key}>
            <Reveal delay={i * 0.06} className="flex items-start gap-4">
              <span
                aria-hidden
                className={`mt-[7px] size-2.5 shrink-0 rounded-full bg-mint ${i === 0 ? "shadow-[0px_0px_12px_var(--color-mint)]" : "opacity-70"}`}
              />
              <div>
                <p className="text-[17px] font-semibold leading-6 text-warm-white">{c.title}</p>
                <p className="mt-1 text-sm leading-normal text-text-dim">{c.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <Reveal className="relative mt-8">
        <span className="block text-xs text-text-faint">Real Paisa screen · sample data</span>
      </Reveal>
    </div>
  );
}

export function SceneKnowMoney() {
  return (
    <StoryScene
      id="know-your-money"
      chapter="know-your-money"
      label="Know where your money goes"
      length={3.5}
      rest={0.2}
      mobile={<KnowMobile />}
    >
      <KnowDesktop />
    </StoryScene>
  );
}
