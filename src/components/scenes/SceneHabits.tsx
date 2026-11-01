"use client";

import type { ReactNode } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";

import { Grain } from "@/components/story/Atmosphere";
import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Stage } from "@/components/story/Stage";
import { PhoneFrame, ScreenCrop } from "@/components/story/PhoneFrame";
import { Reveal, ScrollWords } from "@/components/story/Text";
import { BellRingIcon, TargetIcon } from "./features/icons";

const SOFT_SHADOW = "0px 30px 60px rgba(21,18,31,0.25)";
const TOP_FADE =
  "linear-gradient(180deg, var(--color-app-ground) 45%, var(--color-scrim) 75%, rgba(7,6,11,0) 100%)";

/**
 * Chapter four sits on warm paper. The pinned viewport starts dark (joining the
 * previous dark scene), a paper layer fades in early, and fades back out near
 * the end so the next dark scene joins cleanly. Content is ink-on-paper only
 * while the paper layer is (almost) opaque.
 */
export function SceneHabits() {
  return (
    <StoryScene
      id="better-habits"
      chapter="better-habits"
      label="Better money habits"
      navTheme="light"
      length={3}
      rest={0.76}
      dissolve={0.04}
      className="bg-void"
      mobile={<MobileHabits />}
    >
      <DesktopHabits />
    </StoryScene>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop                                                                    */
/* -------------------------------------------------------------------------- */

function DesktopHabits() {
  const { progress } = useSceneProgress();

  // Paper arrives as a circular wipe from the phone's position instead of a
  // crossfade, so the viewport never passes through a muddy grey blend.
  const wipe = useTransform(progress, [0.02, 0.17, 0.87, 1], [0, 150, 150, 0]);
  const paperClip = useTransform(wipe, (r) => `circle(${r}% at 66% 52%)`);
  const paper = useTransform(progress, [0.08, 0.2, 0.86, 0.94], [0, 1, 1, 0]);
  const content = useTransform(progress, [0.14, 0.26, 0.8, 0.88], [0, 1, 1, 0]);

  // The nav switches to its light style only while paper covers the top of the
  // viewport (the section's static data-nav-theme can't know that).
  useMotionValueEvent(wipe, "change", (r) => {
    const section = document.getElementById("better-habits");
    // ≈70% of the circle reference radius is where the paper covers most of the top bar.
    if (section) section.dataset.navTheme = r > 70 ? "light" : "dark";
  });

  const bodyOpacity = useTransform(progress, [0.28, 0.38], [0, 1]);
  const bodyY = useTransform(progress, [0.28, 0.38], [14, 0]);
  const labelOpacity = useTransform(progress, [0.14, 0.22], [0, 1]);
  const markerOne = useTransform(progress, [0.36, 0.44], [0, 1]);
  const markerTwo = useTransform(progress, [0.42, 0.5], [0, 1]);

  const phoneOpacity = useTransform(progress, [0.14, 0.3], [0, 1]);
  const phoneY = useTransform(progress, [0.14, 0.3], [60, 0]);
  const screenY = useTransform(progress, [0.26, 0.6], [0, -214]);
  const topFade = useTransform(progress, [0.3, 0.5], [0, 1]);

  const cardOpacity = useTransform(progress, [0.42, 0.54], [0, 1]);
  const cardX = useTransform(progress, [0.42, 0.54], [40, 0]);
  const fill = useTransform(progress, [0.52, 0.68], [0, 1]);

  const rowOpacity = useTransform(progress, [0.58, 0.7], [0, 1]);
  const rowY = useTransform(progress, [0.58, 0.72], [70, 0]);

  return (
    <>
      {/* Same grain as the dark scenes around it; the paper covers it. */}
      <Grain />
      <motion.div aria-hidden className="absolute inset-0 bg-paper" style={{ clipPath: paperClip }} />
      <Stage>
        {/* Morning light */}
        <motion.div aria-hidden className="absolute inset-0" style={{ opacity: paper }}>
          <div className="absolute left-[700px] top-[-200px] size-[900px] rounded-full bg-primary-wash blur-[120px]" />
          <div className="absolute left-[1100px] top-[500px] size-[400px] rounded-full bg-mint-haze blur-[120px]" />
        </motion.div>

        <motion.div className="absolute inset-0" style={{ opacity: content }}>
          {/* Narrative */}
          <div className="absolute left-[120px] top-[230px] flex w-[500px] flex-col gap-6">
            <motion.span
              className="w-fit font-sans text-xs font-semibold uppercase tracking-[3px] text-violet-deep"
              style={{ opacity: labelOpacity }}
            >
              Chapter four
            </motion.span>
            <h2 className="block font-serif text-7xl leading-[1.02] tracking-[-1.5px] text-ink">
              <ScrollWords
                text="Make room for what matters."
                progress={progress}
                range={[0.16, 0.34]}
                emphasis={[3, 4]}
                emphasisClassName="italic text-violet-deep"
              />
            </h2>
            <motion.p
              className="max-w-[440px] font-sans text-lg leading-[1.6] text-ink-soft"
              style={{ opacity: bodyOpacity, y: bodyY }}
            >
              Spend on purpose, not by accident.
            </motion.p>
            <div className="flex items-center gap-6 pt-2">
              <motion.div className="flex items-center gap-2" style={{ opacity: markerOne }}>
                <TargetIcon size={16} className="text-violet-deep" />
                <span className="font-sans text-sm font-medium text-ink">Savings goals</span>
              </motion.div>
              <motion.div className="flex items-center gap-2" style={{ opacity: markerTwo }}>
                <BellRingIcon size={16} className="text-violet-deep" />
                <span className="font-sans text-sm font-medium text-ink">Budget alerts</span>
              </motion.div>
            </div>
          </div>

          {/* Bright phone: the real home screen scrolls to Budget and savings */}
          <motion.div className="absolute left-[800px] top-[120px]" style={{ opacity: phoneOpacity, y: phoneY }}>
            <PhoneFrame screen="home" width={312} screenY={screenY} tone="ink" style={{ rotate: 3 }}>
              <motion.div
                aria-hidden
                className="absolute left-0 top-0 h-[110px] w-full"
                style={{ opacity: topFade, backgroundImage: TOP_FADE }}
              />
            </PhoneFrame>
          </motion.div>

          {/* Floating real "Budget alerts" row (profile screen) */}
          <motion.div
            className="absolute left-[640px] top-[610px]"
            style={{ opacity: rowOpacity, y: rowY, rotate: -3, willChange: "transform" }}
          >
            <ScreenCrop
              screen="profile"
              scale={390}
              x={16}
              y={720}
              width={358}
              height={64}
              radius={18}
              style={{ boxShadow: SOFT_SHADOW }}
            />
          </motion.div>

          {/* Threshold card */}
          <motion.div
            className="absolute left-[1150px] top-[250px] flex w-[240px] flex-col gap-2.5 rounded-[20px] bg-white p-[18px] shadow-[0px_24px_50px_rgba(21,18,31,0.14)]"
            style={{ opacity: cardOpacity, x: cardX }}
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-[1.5px] text-ink-soft">
              Monthly budget
            </span>
            <span className="font-sans text-[28px] font-bold leading-normal tracking-[-0.6px] text-ink">81% used</span>
            <div className="h-2 w-full rounded-full bg-surface-strong">
              <motion.div
                className="h-2 w-[81%] rounded-full bg-gradient-to-r from-violet to-lavender"
                style={{ scaleX: fill, transformOrigin: "left center" }}
              />
            </div>
            <span className="font-sans text-[13px] leading-normal text-ink-soft">₹11,348 left · 8 days to go</span>
          </motion.div>

          <p className="absolute bottom-12 left-[120px] font-sans text-xs leading-normal text-ink-soft">
            Real Paisa screens · sample data
          </p>
        </motion.div>
      </Stage>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                     */
/* -------------------------------------------------------------------------- */

function MobileHabits(): ReactNode {
  const k = 0.84; // scale for the alerts-row crop (342px column)
  return (
    <div className="relative overflow-hidden bg-paper px-6 py-24">
      {/* soft edges so the paper block joins the dark scenes around it */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-void to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void to-transparent" />
      <div aria-hidden className="absolute -right-24 top-10 size-[360px] rounded-full bg-primary-wash blur-[90px]" />
      <div aria-hidden className="absolute -left-20 bottom-24 size-[260px] rounded-full bg-mint-haze blur-[90px]" />

      <div className="relative mx-auto flex max-w-[440px] flex-col gap-8">
        <Reveal className="flex flex-col gap-4">
          <span className="w-fit font-sans text-[11px] font-semibold uppercase tracking-[3px] text-violet-deep">
            Chapter four
          </span>
          <h2 className="font-serif text-5xl leading-[1.02] tracking-[-1px] text-ink">
            Make room for <em className="text-violet-deep">what matters.</em>
          </h2>
          <p className="font-sans text-base leading-[1.6] text-ink-soft">
            Spend on purpose, not by accident.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
            <div className="flex items-center gap-2">
              <TargetIcon size={16} className="text-violet-deep" />
              <span className="font-sans text-sm font-medium text-ink">Savings goals</span>
            </div>
            <div className="flex items-center gap-2">
              <BellRingIcon size={16} className="text-violet-deep" />
              <span className="font-sans text-sm font-medium text-ink">Budget alerts</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="flex justify-center">
          <PhoneFrame screen="home" width={260} screenY={-178} tone="ink">
            <div
              aria-hidden
              className="absolute left-0 top-0 h-[92px] w-full"
              style={{ backgroundImage: TOP_FADE }}
            />
          </PhoneFrame>
        </Reveal>

        <Reveal>
          <div className="flex w-full flex-col gap-2.5 rounded-[20px] bg-white p-[18px] shadow-[0px_24px_50px_rgba(21,18,31,0.14)]">
            <span className="font-sans text-xs font-semibold uppercase tracking-[1.5px] text-ink-soft">
              Monthly budget
            </span>
            <span className="font-sans text-[28px] font-bold leading-normal tracking-[-0.6px] text-ink">81% used</span>
            <div className="h-2 w-full rounded-full bg-surface-strong">
              <div className="h-2 w-[81%] rounded-full bg-gradient-to-r from-violet to-lavender" />
            </div>
            <span className="font-sans text-[13px] leading-normal text-ink-soft">₹11,348 left · 8 days to go</span>
          </div>
        </Reveal>

        <Reveal className="flex justify-center">
          <ScreenCrop
            screen="profile"
            scale={Math.round(390 * k)}
            x={Math.round(16 * k)}
            y={Math.round(720 * k)}
            width={Math.round(358 * k)}
            height={Math.round(64 * k)}
            radius={16}
            style={{ boxShadow: SOFT_SHADOW }}
          />
        </Reveal>

        <Reveal>
          <p className="font-sans text-xs leading-normal text-ink-soft">Real Paisa screens · sample data</p>
        </Reveal>
      </div>
    </div>
  );
}
