"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Stage } from "@/components/story/Stage";
import { Grain } from "@/components/story/Atmosphere";
import { PhoneFrame, ScreenImage } from "@/components/story/PhoneFrame";
import { Reveal, ScrollWords } from "@/components/story/Text";
import { ArrowDownIcon, LightbulbIcon, SparklesIcon } from "./features/icons";

const TXNS = [
  { name: "Swiggy", amount: "–₹349" },
  { name: "Zepto", amount: "–₹612" },
  { name: "Metro recharge", amount: "–₹200" },
];

const CATS = [
  { name: "Dining", width: 220, bar: "bg-violet" },
  { name: "Groceries", width: 165, bar: "bg-lavender" },
  { name: "Transport", width: 124, bar: "bg-text-dim" },
];

const AI_SUMMARY = "You spent ₹4,210 less than September. Dining rose 22% and now makes up about a third of spending.";
const AI_SUGGESTION = "A weekly dining limit near ₹3,000 would keep you inside this month’s budget.";
const AI_FOOTNOTE = "Written from statistics Paisa calculates. Suggestions, not financial advice.";

export function SceneInsights() {
  return (
    <StoryScene
      id="insights"
      chapter="insights"
      label="Insights"
      length={3.5}
      rest={0.84}
      mobile={<MobileInsights />}
    >
      <DesktopInsights />
    </StoryScene>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop                                                                    */
/* -------------------------------------------------------------------------- */

function DesktopInsights() {
  const { progress } = useSceneProgress();

  // Background opens up: void → charcoal gradient, glow grows; returns to void so the next scene joins cleanly.
  const gradientOpacity = useTransform(progress, [0.04, 0.34, 0.88, 1], [0, 1, 1, 0]);
  const glowScale = useTransform(progress, [0.04, 0.5], [0.45, 1]);
  const glowOpacity = useTransform(progress, [0.04, 0.45, 0.88, 1], [0, 1, 1, 0]);

  const outro = useTransform(progress, [0.9, 1], [1, 0]);

  const labelOpacity = useTransform(progress, [0, 0.06], [0, 1]);
  const bodyOpacity = useTransform(progress, [0.14, 0.22], [0, 1]);
  const bodyY = useTransform(progress, [0.14, 0.22], [14, 0]);

  // Phone: moves closer to the viewer and switches Home → Insights
  const phoneScale = useTransform(progress, [0.04, 0.4], [0.8, 1]);
  const phoneX = useTransform(progress, [0.04, 0.4], [120, 0]);
  const phoneOpacity = useTransform(progress, [0, 0.12], [0, 1]);
  // Quick swap: a long crossfade between two busy screens reads as a double exposure.
  const insightsOpacity = useTransform(progress, [0.2, 0.26], [0, 1]);
  const insightsY = useTransform(progress, [0.4, 0.8], [0, -64]);

  // Transformation sequence: rows → category bars → one-line insight
  const stageTxn = useTransform(progress, [0.14, 0.24], [0, 1]);
  const arrowOne = useTransform(progress, [0.28, 0.34], [0, 1]);
  const stageCat = useTransform(progress, [0.3, 0.4], [0, 1]);
  const bars = useTransform(progress, [0.36, 0.5], [0, 1]);
  const arrowTwo = useTransform(progress, [0.48, 0.54], [0, 1]);
  const stageInsight = useTransform(progress, [0.5, 0.6], [0, 1]);
  // previous stages recede once the next appears
  const txnDim = useTransform(progress, [0.3, 0.42, 0.5, 0.6], [1, 0.7, 0.7, 0.45]);
  const catDim = useTransform(progress, [0.5, 0.62], [1, 0.6]);
  const txnOpacity = useCombined(stageTxn, txnDim);
  const catOpacity = useCombined(stageCat, catDim);

  // AI card slides in beside the phone
  const aiX = useTransform(progress, [0.64, 0.78], [140, 0]);
  const aiOpacity = useTransform(progress, [0.64, 0.74], [0, 1]);

  return (
    <>
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-void to-charcoal"
        style={{ opacity: gradientOpacity }}
      />
      <Grain />
      <Stage>
        {/* Open violet glow */}
        <motion.div
          aria-hidden
          className="absolute left-[560px] top-20 size-[760px] rounded-full bg-haze blur-[160px]"
          style={{ scale: glowScale, opacity: glowOpacity, willChange: "transform" }}
        />

        <motion.div className="absolute inset-0" style={{ opacity: outro }}>
          {/* Narrative */}
          <div className="absolute left-[120px] top-[130px] flex w-[470px] flex-col gap-5">
            <motion.span
              className="w-fit font-sans text-xs font-semibold uppercase tracking-[3px] text-mint"
              style={{ opacity: labelOpacity }}
            >
              Chapter three
            </motion.span>
            <h2 className="block font-serif text-[56px] leading-[1.05] tracking-[-1px] text-warm-white">
              <ScrollWords
                text="Tracking is only the beginning."
                progress={progress}
                range={[0.02, 0.16]}
                emphasis={[3, 4]}
                emphasisClassName="italic"
              />
            </h2>
            <motion.p
              className="font-sans text-[17px] leading-[1.6] text-text-dim"
              style={{ opacity: bodyOpacity, y: bodyY }}
            >
              Understanding your habits is where things get interesting.
            </motion.p>
          </div>

          {/* Transformation sequence (illustrative sample data) */}
          <div className="absolute left-[120px] top-[470px] flex w-[420px] flex-col gap-2">
            <motion.div
              className="flex flex-col gap-1.5 rounded-2xl border border-hairline bg-charcoal p-3.5"
              style={{ opacity: txnOpacity }}
            >
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-text-faint">
                Transactions
              </span>
              {TXNS.map((t, i) => (
                <TxnRow key={t.name} progress={progress} index={i} name={t.name} amount={t.amount} />
              ))}
            </motion.div>

            <motion.div style={{ opacity: arrowOne }}>
              <ArrowDownIcon size={16} className="text-text-faint" />
            </motion.div>

            <motion.div
              className="flex flex-col gap-2 rounded-2xl border border-hairline-strong bg-charcoal p-3.5"
              style={{ opacity: catOpacity }}
            >
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-text-dim">
                Categories
              </span>
              {CATS.map((c) => (
                <div key={c.name} className="flex items-center gap-2.5">
                  <span className="w-[78px] font-sans text-[13px] text-warm-white">{c.name}</span>
                  <motion.div
                    className={`h-1.5 rounded-full ${c.bar}`}
                    style={{ width: c.width, scaleX: bars, transformOrigin: "left center" }}
                  />
                </div>
              ))}
            </motion.div>

            <motion.div style={{ opacity: arrowTwo }}>
              <ArrowDownIcon size={16} className="text-text-faint" />
            </motion.div>

            <motion.div
              className="flex items-center gap-2.5 rounded-2xl border border-mint bg-charcoal-raised p-3.5"
              style={{ opacity: stageInsight }}
            >
              <SparklesIcon size={16} className="text-mint" />
              <span className="font-sans text-sm text-warm-white">Dining is your biggest category this month.</span>
            </motion.div>
          </div>

          {/* Foreground phone: real Home → real Insights */}
          <motion.div
            className="absolute left-[640px] top-[110px]"
            style={{ opacity: phoneOpacity, x: phoneX, scale: phoneScale, rotate: -2, willChange: "transform" }}
          >
            <PhoneFrame width={350}>
              <ScreenImage screen="home" width={350} />
              <ScreenImage screen="insights" width={350} y={insightsY} opacity={insightsOpacity} />
            </PhoneFrame>
          </motion.div>

          {/* AI insight card (sample data) */}
          <motion.div
            className="absolute left-[1030px] top-[330px] flex w-[330px] flex-col gap-3.5 rounded-[22px] border border-hairline-strong bg-charcoal-raised p-[22px] shadow-[0px_40px_80px_rgba(0,0,0,0.55)]"
            style={{ x: aiX, opacity: aiOpacity, willChange: "transform" }}
          >
            <AiCardBody />
          </motion.div>
        </motion.div>
      </Stage>
    </>
  );
}

/** Multiplies two 0–1 motion values (stage reveal × recede). */
function useCombined(a: MotionValue<number>, b: MotionValue<number>) {
  return useTransform([a, b], ([x, y]: number[]) => x * y);
}

function TxnRow({
  progress,
  index,
  name,
  amount,
}: {
  progress: MotionValue<number>;
  index: number;
  name: string;
  amount: string;
}) {
  const start = 0.16 + index * 0.025;
  const opacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  const x = useTransform(progress, [start, start + 0.05], [-12, 0]);
  return (
    <motion.div className="flex justify-between" style={{ opacity, x }}>
      <span className="font-sans text-[13px] text-text-dim">{name}</span>
      <span className="font-sans text-[13px] text-text-dim">{amount}</span>
    </motion.div>
  );
}

function AiCardBody() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon size={16} className="text-mint" />
          <span className="font-sans text-xs font-semibold uppercase tracking-[1.5px] text-mint">AI insight</span>
        </div>
        <span className="rounded-full border border-hairline-strong px-2 py-0.5 font-sans text-[11px] font-medium text-text-dim">
          Sample data
        </span>
      </div>
      <p className="font-sans text-[17px] leading-normal text-warm-white">{AI_SUMMARY}</p>
      <div className="flex items-start gap-2.5 rounded-[14px] bg-haze-faint p-3">
        <LightbulbIcon size={15} className="mt-0.5 text-lavender" />
        <p className="font-sans text-[13px] leading-normal text-warm-white">{AI_SUGGESTION}</p>
      </div>
      <p className="font-sans text-xs leading-normal text-text-dim">{AI_FOOTNOTE}</p>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                     */
/* -------------------------------------------------------------------------- */

function MobileInsights(): ReactNode {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-void to-charcoal px-6 py-20">
      <div
        aria-hidden
        className="absolute left-1/2 top-[40%] size-[420px] -translate-x-1/2 rounded-full bg-haze blur-[110px]"
      />
      <div className="relative mx-auto flex max-w-[440px] flex-col gap-8">
        <Reveal className="flex flex-col gap-3">
          <span className="w-fit font-sans text-[11px] font-semibold uppercase tracking-[3px] text-mint">
            Chapter three
          </span>
          <h2 className="font-serif text-4xl leading-[1.06] text-warm-white">
            Tracking is only <em>the beginning.</em>
          </h2>
          <p className="font-sans text-base leading-[1.6] text-text-dim">
            Understanding your habits is where things get interesting.
          </p>
        </Reveal>

        <Reveal>
          <div className="flex flex-col items-center gap-2">
            <div className="flex w-full flex-col gap-1.5 rounded-2xl border border-hairline bg-charcoal p-3.5">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-text-faint">
                Transactions
              </span>
              {TXNS.map((t) => (
                <div key={t.name} className="flex justify-between">
                  <span className="font-sans text-[13px] text-text-dim">{t.name}</span>
                  <span className="font-sans text-[13px] text-text-dim">{t.amount}</span>
                </div>
              ))}
            </div>
            <ArrowDownIcon size={16} className="text-text-faint" />
            <div className="flex w-full flex-col gap-2 rounded-2xl border border-hairline-strong bg-charcoal p-3.5">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-text-dim">
                Categories
              </span>
              {CATS.map((c) => (
                <div key={c.name} className="flex items-center gap-2.5">
                  <span className="w-[78px] shrink-0 font-sans text-[13px] text-warm-white">{c.name}</span>
                  <div className="flex-1">
                    <div className={`h-1.5 rounded-full ${c.bar}`} style={{ width: `${(c.width / 220) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <ArrowDownIcon size={16} className="text-text-faint" />
            <div className="flex w-full items-center gap-2.5 rounded-2xl border border-mint bg-charcoal-raised p-3.5">
              <SparklesIcon size={16} className="text-mint" />
              <span className="font-sans text-sm text-warm-white">Dining is your biggest category this month.</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="flex justify-center">
          <PhoneFrame screen="insights" width={260} />
        </Reveal>

        <Reveal>
          <div className="flex flex-col gap-3.5 rounded-[22px] border border-hairline-strong bg-charcoal-raised p-5 shadow-[0px_30px_60px_rgba(0,0,0,0.5)]">
            <AiCardBody />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
