"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

import { Grain } from "@/components/story/Atmosphere";
import { Stage } from "@/components/story/Stage";
import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Reveal } from "@/components/story/Text";

/* -------------------------------------------------------------------------- */
/*  Small building blocks (Wonder `lot` + `vex`)                              */
/* -------------------------------------------------------------------------- */

function Chip({ name, amount }: { name: string; amount: string }) {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-hairline-strong bg-charcoal px-4 py-2.5">
      <span className="block text-[15px] font-medium leading-normal text-warm-white">{name}</span>
      <span className="block text-[15px] font-semibold leading-normal text-coral">{amount}</span>
    </div>
  );
}

function BellIcon({ className }: { className: string }) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function Notification({
  title,
  body,
  boxed = false,
  className = "w-[290px]",
}: {
  title: string;
  body: string;
  boxed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-[18px] border border-hairline-strong bg-charcoal-raised p-4 shadow-[0px_30px_60px_rgba(0,0,0,0.5)] ${className}`}
    >
      {boxed ? (
        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-hairline-strong">
          <BellIcon className="size-4 text-warm-white" />
        </div>
      ) : (
        <BellIcon className="mt-0.5 size-[18px] shrink-0 text-warm-white" />
      )}
      <div className="flex flex-col gap-0.5">
        <span className="block text-sm font-semibold leading-normal text-warm-white">{title}</span>
        <span className="block text-[13px] leading-normal text-text-dim">{body}</span>
      </div>
    </div>
  );
}

/** Absolutely positioned item that builds in over a progress window (or is static). */
function Item({
  progress,
  range,
  left,
  top,
  rotate = 0,
  children,
}: {
  progress: MotionValue<number>;
  range?: [number, number];
  left: number;
  top: number;
  rotate?: number;
  children: ReactNode;
}) {
  const [a, b] = range ?? [0, 1];
  const opacity = useTransform(progress, [a, b], [0, 1]);
  const y = useTransform(progress, [a, b], [26, 0]);
  const scale = useTransform(progress, [a, b], [0.9, 1]);
  return (
    <motion.div
      className="absolute"
      style={range ? { left, top, rotate, opacity, y, scale } : { left, top, rotate }}
    >
      {children}
    </motion.div>
  );
}

/**
 * One parallax layer. Drifts upward at its own speed, near layer tilts, and in
 * the last stretch everything pushes outward from the centre and fades to black.
 */
function Layer({
  progress,
  drift,
  tilt = [0, 0],
  outScale,
  startOpacity = 0,
  className = "",
  children,
}: {
  progress: MotionValue<number>;
  drift: [number, number];
  tilt?: [number, number];
  outScale: number;
  startOpacity?: number;
  className?: string;
  children: ReactNode;
}) {
  const y = useTransform(progress, [0, 1], drift);
  const rotate = useTransform(progress, [0, 1], tilt);
  const scale = useTransform(progress, [0.8, 1], [1, outScale]);
  const opacity = useTransform(progress, [0, 0.12, 0.84, 0.97], [startOpacity, 1, 1, 0]);
  return (
    <motion.div
      aria-hidden
      className={`absolute inset-0 ${className}`}
      style={{ y, rotate, scale, opacity, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

/** Blur-in / hold / blur-out narrative line. */
function useLineMotion(progress: MotionValue<number>, t: [number, number, number, number]) {
  const opacity = useTransform(progress, t, [0, 1, 1, 0]);
  const y = useTransform(progress, t, [20, 0, 0, -20]);
  const blur = useTransform(progress, t, [10, 0, 0, 10]);
  const filter = useTransform(blur, (b) => (b > 0.05 ? `blur(${b}px)` : "none"));
  return { opacity, y, filter };
}

function HereLine({ progress }: { progress: MotionValue<number> }) {
  const style = useLineMotion(progress, [0.03, 0.12, 0.26, 0.33]);
  return (
    <div className="absolute left-0 top-[400px] flex w-full flex-col items-center">
      <motion.p
        className="block w-fit font-serif text-[96px] italic leading-none tracking-[-1.5px] text-warm-white"
        style={style}
      >
        A little here.
      </motion.p>
    </div>
  );
}

/** "A little there." arrives large, then settles into the small echo above the month-over line. */
function ThereLine({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.3, 0.38, 0.88, 0.97], [0, 1, 1, 0]);
  const blurIn = useTransform(progress, [0.3, 0.38], [10, 0]);
  const filter = useTransform(blurIn, (b) => (b > 0.05 ? `blur(${b}px)` : "none"));
  const y = useTransform(progress, [0.3, 0.38, 0.54, 0.64], [20, 0, 0, -77]);
  const scale = useTransform(progress, [0.54, 0.64], [1, 28 / 96]);
  const color = useTransform(progress, [0.54, 0.64], ["#f5f1ea", "#5e596b"]);
  return (
    <div className="absolute left-0 top-[400px] flex w-full flex-col items-center">
      <motion.p
        className="block w-fit font-serif text-[96px] italic leading-none tracking-[-1.5px]"
        style={{ opacity, filter, y, scale, color }}
      >
        A little there.
      </motion.p>
    </div>
  );
}

function MonthOverStack({ progress }: { progress: MotionValue<number> }) {
  const one = useLineMotion(progress, [0.6, 0.7, 0.88, 0.97]);
  const two = useLineMotion(progress, [0.67, 0.77, 0.88, 0.97]);
  return (
    <h2 className="absolute left-0 top-[410px] flex w-full flex-col items-center">
      <motion.span
        className="block w-fit font-serif text-[84px] leading-none tracking-[-1.5px] text-warm-white"
        style={one}
      >
        And somehow…
      </motion.span>
      <motion.span
        className="mt-[18px] block w-fit font-serif text-[84px] italic leading-none tracking-[-1.5px] text-warm-white"
        style={two}
      >
        the month is over.
      </motion.span>
    </h2>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop                                                                   */
/* -------------------------------------------------------------------------- */

function ProblemDesktop() {
  const { progress } = useSceneProgress();

  // The huge "31" rises behind everything.
  const numeralOpacity = useTransform(progress, [0.4, 0.75, 0.86, 0.97], [0, 1, 1, 0]);
  const numeralY = useTransform(progress, [0.4, 0.75], [220, 0]);
  const numeralScale = useTransform(progress, [0.8, 1], [1, 1.12]);
  // Centre scrim keeps the text readable once the clutter peaks.
  const scrimOpacity = useTransform(progress, [0.3, 0.55, 0.86, 0.97], [0, 1, 1, 0]);

  // Build windows for the clutter. Scene 02 first, then scene 03 piles on.
  const lot = (i: number): [number, number] => [0.04 + i * 0.055, 0.14 + i * 0.055];
  const vex = (i: number): [number, number] => [0.34 + i * 0.035, 0.44 + i * 0.035];

  return (
    <>
      <Grain />

      <Stage>
        {/* Month-end numeral, behind the layers */}
        <motion.span
          aria-hidden
          className="absolute left-[380px] top-10 block font-serif text-[760px] leading-none tracking-[-30px] text-charcoal-raised"
          style={{ opacity: numeralOpacity, y: numeralY, scale: numeralScale, willChange: "transform" }}
        >
          31
        </motion.span>

        {/* Far layer — 0.3×, blurred. Scene-01 numbers are already here. */}
        <Layer progress={progress} drift={[0, -90]} outScale={1.12} startOpacity={0.85} className="blur-[3px]">
          <Item progress={progress} left={180} top={150}>
            <span className="block font-serif text-[120px] leading-normal text-text-faint">₹</span>
          </Item>
          <Item progress={progress} left={1060} top={180}>
            <span className="block text-[22px] font-medium leading-normal text-text-dim">–₹89</span>
          </Item>
          <Item progress={progress} left={300} top={700}>
            <span className="block text-xl font-medium leading-normal text-text-dim">–₹240</span>
          </Item>
          <Item progress={progress} left={1180} top={620}>
            <span className="block font-serif text-8xl leading-normal text-text-faint">₹</span>
          </Item>

          <Item progress={progress} range={vex(0)} left={90} top={130}>
            <span className="block text-[22px] font-medium leading-normal text-text-dim">–₹45</span>
          </Item>
          <Item progress={progress} range={vex(2)} left={620} top={110}>
            <span className="block text-xl font-medium leading-normal text-text-dim">–₹1,299</span>
          </Item>
          <Item progress={progress} range={vex(4)} left={1280} top={330}>
            <span className="block text-[22px] font-medium leading-normal text-text-dim">–₹75</span>
          </Item>
          <Item progress={progress} range={vex(6)} left={150} top={560}>
            <span className="block text-xl font-medium leading-normal text-text-dim">–₹310</span>
          </Item>
          <Item progress={progress} range={vex(8)} left={760} top={790}>
            <span className="block text-[22px] font-medium leading-normal text-text-dim">–₹99</span>
          </Item>
          <Item progress={progress} range={vex(3)} left={1120} top={60}>
            <span className="block font-serif text-[110px] leading-normal text-text-faint">₹</span>
          </Item>
          <Item progress={progress} range={vex(5)} left={40} top={700}>
            <span className="block font-serif text-[90px] leading-normal text-text-faint">₹</span>
          </Item>
        </Layer>

        {/* Mid layer — 0.6× */}
        <Layer progress={progress} drift={[40, -140]} outScale={1.35}>
          <Item progress={progress} range={lot(0)} left={240} top={300}>
            <Chip name="Chai & samosa" amount="–₹60" />
          </Item>
          <Item progress={progress} range={lot(2)} left={980} top={640}>
            <Chip name="Auto to office" amount="–₹120" />
          </Item>

          <Item progress={progress} range={vex(0)} left={120} top={230} rotate={-4}>
            <Chip name="Groceries" amount="–₹1,840" />
          </Item>
          <Item progress={progress} range={vex(1)} left={470} top={180}>
            <Chip name="Movie tickets" amount="–₹520" />
          </Item>
          <Item progress={progress} range={vex(2)} left={1040} top={160} rotate={3}>
            <Chip name="Mobile recharge" amount="–₹299" />
          </Item>
          <Item progress={progress} range={vex(4)} left={1120} top={560} rotate={-3}>
            <Chip name="Petrol" amount="–₹500" />
          </Item>
          <Item progress={progress} range={vex(5)} left={260} top={650} rotate={2}>
            <Chip name="Birthday gift" amount="–₹1,150" />
          </Item>
          <Item progress={progress} range={vex(6)} left={640} top={700}>
            <Chip name="Coffee" amount="–₹180" />
          </Item>
        </Layer>

        {/* Near layer — 1×, rotated, sharp */}
        <Layer progress={progress} drift={[80, -220]} tilt={[-1.5, 1.5]} outScale={1.7}>
          <Item progress={progress} range={lot(1)} left={960} top={250} rotate={4}>
            <Notification title="₹349 paid via UPI" body="To Swiggy · just now" boxed className="w-[300px]" />
          </Item>
          <Item progress={progress} range={vex(3)} left={80} top={380} rotate={-6}>
            <Notification title="₹2,400 debited" body="A/c XX4521 · UPI" />
          </Item>
          <Item progress={progress} range={vex(7)} left={1060} top={340} rotate={5}>
            <Notification title="Electricity bill due" body="₹1,862 · in 2 days" />
          </Item>
        </Layer>

        {/* Centre scrim */}
        <motion.div
          aria-hidden
          className="absolute left-[320px] top-[330px] h-[260px] w-[800px] rounded-full bg-void blur-[60px]"
          style={{ opacity: scrimOpacity }}
        />

        {/* Narrative */}
        <HereLine progress={progress} />
        <ThereLine progress={progress} />
        <MonthOverStack progress={progress} />
      </Stage>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile — a short stack of chips and the three lines                       */
/* -------------------------------------------------------------------------- */

function ProblemMobile() {
  return (
    <div className="relative overflow-hidden bg-void px-6 py-24">
      <Grain />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 block -translate-y-1/2 font-serif text-[360px] leading-none tracking-[-14px] text-charcoal-raised"
      >
        31
      </span>
      <div className="relative flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <Reveal>
            <p className="font-serif text-[52px] italic leading-none tracking-[-1px] text-warm-white">
              A little here.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="-rotate-2 self-start">
            <Chip name="Chai & samosa" amount="–₹60" />
          </Reveal>
          <Reveal delay={0.15} className="origin-right rotate-2 self-end">
            <Chip name="Auto to office" amount="–₹120" />
          </Reveal>
        </div>

        <div className="flex flex-col gap-5">
          <Reveal>
            <p className="font-serif text-[52px] italic leading-none tracking-[-1px] text-warm-white">
              A little there.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="self-start rotate-1">
            <Notification title="₹349 paid via UPI" body="To Swiggy · just now" boxed className="w-[300px]" />
          </Reveal>
          <Reveal delay={0.15} className="-rotate-2 self-start">
            <Chip name="Groceries" amount="–₹1,840" />
          </Reveal>
          <Reveal delay={0.2} className="rotate-2 self-end">
            <Chip name="Movie tickets" amount="–₹520" />
          </Reveal>
        </div>

        <Reveal>
          <h2 className="flex flex-col font-serif text-[48px] leading-[1.02] tracking-[-1px] text-warm-white">
            <span>And somehow…</span>
            <span className="italic">the month is over.</span>
          </h2>
        </Reveal>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

export function SceneProblem() {
  return (
    <StoryScene
      id="problem"
      chapter="problem"
      label="The problem"
      length={4}
      rest={0.8}
      navBrand="dim"
      mobile={<ProblemMobile />}
    >
      <ProblemDesktop />
    </StoryScene>
  );
}
