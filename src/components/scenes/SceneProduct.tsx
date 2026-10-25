"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { cubicBezier, motion, useTransform, type MotionValue } from "motion/react";

import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Stage } from "@/components/story/Stage";
import { Grain } from "@/components/story/Atmosphere";
import { PhoneFrame, ScreenCrop } from "@/components/story/PhoneFrame";
import { Reveal, ScrollWords } from "@/components/story/Text";
import { logoMark } from "@/lib/site";

const EASE = cubicBezier(0.65, 0, 0.35, 1);
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

/**
 * Scene 06 timeline (progress)
 * 0.00-0.50  glow resolves into the phone: rotateY 18 -> -4, moves into place
 * 0.14-0.50  real UI crops appear and fly into their dashed slots
 * 0.50-0.70  screen un-dims, crops merge into the screen
 * 0.30-0.68  narrative + caption
 * 0.70-0.84  hold (reduced-motion rest frame)
 * 0.84-1.00  text leaves, phone settles at the Scene 07 position (x 560, upright)
 */

/** A block that enters from an offset and leaves again at the end of the scene. */
function Layer({
  progress,
  enter,
  exit = [0.84, 0.94],
  fromX = 0,
  fromY = 0,
  toX = -40,
  className = "",
  children,
}: {
  progress: MotionValue<number>;
  enter: [number, number];
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

function ProductDesktop() {
  const { progress } = useSceneProgress();

  // Glow: starts where the logo glow ended (stage centre), drifts behind the phone, then back to centre.
  const glowX = useTransform(progress, [0, 0.5, 0.84, 1], [-320, 0, 0, -320], { ease: EASE });
  const glowScale = useTransform(progress, [0, 0.5, 0.84, 1], [1.3, 1, 1, 0.85], { ease: EASE });
  const glowOpacity = useTransform(progress, [0, 0.5, 0.84, 1], [1, 1, 1, 0.55]);

  // The reveal ends with the logo at ~70%; pick it up there and dissolve it.
  const logoOpacity = useTransform(progress, [0, 0.1], [0.7, 0]);
  const logoScale = useTransform(progress, [0, 0.1], [1, 0.7]);
  const logoFilter = useTransform(progress, [0, 0.1], ["blur(0px)", "blur(12px)"]);

  // Phone
  const phoneOpacity = useTransform(progress, [0.02, 0.16], [0, 1]);
  const phoneX = useTransform(progress, [0.02, 0.5, 0.84, 1], [-320, 0, 0, -300], { ease: EASE });
  const phoneY = useTransform(progress, [0.02, 0.5, 0.84, 1], [30, 0, 0, 2], { ease: EASE });
  const phoneScale = useTransform(progress, [0.02, 0.5], [0.8, 1], { ease: EASE_OUT });
  const phoneRotateY = useTransform(progress, [0.02, 0.5, 0.84, 1], [18, -4, -4, 0], { ease: EASE });
  const phoneRotate = useTransform(progress, [0, 0.84, 1], [-4, -4, 0], { ease: EASE });
  const dim = useTransform(progress, [0.5, 0.66], [1, 0]);

  // Dashed balance-card slot on the screen
  const slotOpacity = useTransform(progress, [0.1, 0.2, 0.44, 0.5], [0, 1, 1, 0]);

  // Flying crops (coordinates relative to the phone wrapper; targets are the screen slots)
  const cropOpacity = useTransform(progress, [0.14, 0.26, 0.62, 0.7], [0, 1, 1, 0]);
  const balX = useTransform(progress, [0.14, 0.3, 0.5], [-170, -100, 23], { ease: EASE });
  const balY = useTransform(progress, [0.14, 0.3, 0.5], [90, 110, 148], { ease: EASE });
  const balRot = useTransform(progress, [0.14, 0.3, 0.5], [-14, -9, 0], { ease: EASE });
  const actX = useTransform(progress, [0.14, 0.3, 0.5], [260, 200, 23], { ease: EASE });
  const actY = useTransform(progress, [0.14, 0.3, 0.5], [470, 430, 387], { ease: EASE });
  const actRot = useTransform(progress, [0.14, 0.3, 0.5], [10, 6, 0], { ease: EASE });

  return (
    <>
      <Grain />
      <Stage>
        <motion.div
          aria-hidden
          className="absolute left-[760px] top-[140px] h-[640px] w-[560px] rounded-full bg-haze blur-[140px]"
          style={{ x: glowX, scale: glowScale, opacity: glowOpacity, willChange: "transform" }}
        />

        {/* Hand-off from the reveal: the logo (same spot and size as Scene 05) melts into the glow. */}
        <motion.div
          aria-hidden
          className="absolute left-[620px] top-[230px] size-[200px]"
          style={{ opacity: logoOpacity, scale: logoScale, filter: logoFilter }}
        >
          <Image src={logoMark.src} alt="" width={200} height={200} className="size-[200px]" />
        </motion.div>

        {/* Narrative column */}
        <div className="absolute left-[120px] top-[300px] flex w-[520px] flex-col gap-7">
          <Layer progress={progress} enter={[0.3, 0.4]} fromX={-24}>
            <span className="block w-fit text-xs font-semibold uppercase tracking-[3px] text-mint">
              From idea to reality
            </span>
          </Layer>
          <Layer progress={progress} enter={[0.32, 0.42]} fromY={24}>
            <h2 className="font-serif text-7xl leading-[1.02] tracking-[-1.5px] text-warm-white">
              <ScrollWords
                text="An idea became a product."
                progress={progress}
                range={[0.34, 0.55]}
                emphasis={[3, 4]}
                emphasisClassName="italic"
              />
            </h2>
          </Layer>
          <Layer progress={progress} enter={[0.5, 0.6]} fromX={-24}>
            <p className="max-w-[440px] text-[19px] leading-[1.6] text-text-dim">
              An expense tracker designed to make everyday finances easier to understand.
            </p>
          </Layer>
        </div>

        {/* Phone + flying real UI crops */}
        <motion.div
          className="absolute left-[860px] top-[110px]"
          style={{
            opacity: phoneOpacity,
            x: phoneX,
            y: phoneY,
            scale: phoneScale,
            rotate: phoneRotate,
            rotateY: phoneRotateY,
            transformPerspective: 1600,
            willChange: "transform",
          }}
        >
          <PhoneFrame screen="home" dim={dim}>
            <motion.div
              aria-hidden
              className="absolute left-3 top-[137px] h-[241px] w-[287px] rounded-[20px] border border-dashed border-lavender"
              style={{ opacity: slotOpacity }}
            />
          </PhoneFrame>
          <ScreenCrop
            screen="home"
            x={12}
            y={137}
            width={287}
            height={241}
            radius={20}
            className="absolute left-0 top-0"
            style={{ x: balX, y: balY, rotate: balRot, opacity: cropOpacity, willChange: "transform" }}
          />
          <ScreenCrop
            screen="home"
            x={12}
            y={376}
            width={287}
            height={78}
            radius={16}
            className="absolute left-0 top-0"
            style={{ x: actX, y: actY, rotate: actRot, opacity: cropOpacity, willChange: "transform" }}
          />
        </motion.div>

        <Layer
          progress={progress}
          enter={[0.58, 0.68]}
          exit={[0.84, 0.92]}
          toX={0}
          className="absolute bottom-7 left-[880px]"
        >
          <span className="block text-xs text-text-faint">Real Paisa screens · sample data</span>
        </Layer>
      </Stage>
    </>
  );
}

function ProductMobile() {
  return (
    <div className="relative overflow-hidden bg-void px-6 pb-20 pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-[420px] w-[470px] -translate-x-1/2 rounded-full bg-haze blur-[100px]"
      />
      <Reveal className="relative flex justify-center">
        <PhoneFrame screen="home" width={190} style={{ rotate: -3 }} />
      </Reveal>
      <div className="relative mx-auto mt-12 flex max-w-[440px] flex-col gap-3">
        <Reveal>
          <span className="block text-xs font-semibold uppercase tracking-[3px] text-mint">
            From idea to reality
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-serif text-3xl leading-[1.1] text-warm-white">
            An idea became <em>a product.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-sm leading-[1.55] text-text-dim">
            An expense tracker designed to make everyday finances easier to understand.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <span className="block text-xs text-text-faint">Real Paisa screens · sample data</span>
        </Reveal>
      </div>
    </div>
  );
}

export function SceneProduct() {
  return (
    <StoryScene
      id="product"
      chapter="product"
      label="The product emerges"
      length={3}
      rest={0.78}
      mobile={<ProductMobile />}
    >
      <ProductDesktop />
    </StoryScene>
  );
}
