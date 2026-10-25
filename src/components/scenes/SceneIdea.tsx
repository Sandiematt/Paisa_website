"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";

import { Grain, Particles } from "@/components/story/Atmosphere";
import { Stage } from "@/components/story/Stage";
import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Reveal, ScrollWords } from "@/components/story/Text";
import { logoMark } from "@/lib/site";

const QUESTION = "What if there was a smarter way to manage money?";
/** "smarter way" is italic lavender (word indexes 5 and 6). */
const EMPHASIS = [5, 6];
const EMPHASIS_CLASS = "italic text-lavender";

const blurFilter = (b: number) => (b > 0.05 ? `blur(${b}px)` : "none");

/** "Paisa." tracks in: each letter fades, un-blurs and slides in from a wider spacing. */
function TrackedName({ progress }: { progress: MotionValue<number> }) {
  const letters = "Paisa.".split("");
  return (
    <h2 className="font-sans text-[128px] font-bold leading-none tracking-[-5px] text-warm-white">
      <span className="sr-only">Paisa.</span>
      <span aria-hidden className="flex">
        {letters.map((ch, i) => (
          <Letter key={i} progress={progress} index={i} count={letters.length}>
            {ch}
          </Letter>
        ))}
      </span>
    </h2>
  );
}

function Letter({
  progress,
  index,
  count,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  children: string;
}) {
  const from = 0.74 + index * 0.02;
  const to = from + 0.07;
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const x = useTransform(progress, [from, to], [(index - (count - 1) / 2) * 22, 0]);
  const blur = useTransform(progress, [from, to], [10, 0]);
  const filter = useTransform(blur, blurFilter);
  return (
    <motion.span className="block" style={{ opacity, x, filter }}>
      {children}
    </motion.span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop (Wonder `sun` + `biz`)                                            */
/* -------------------------------------------------------------------------- */

function IdeaDesktop() {
  const { progress } = useSceneProgress();

  // Whole scene eases in; the reveal eases (not cuts) away at the very end.
  const sceneIn = useTransform(progress, [0, 0.08], [0, 1]);

  // Camera: slow zoom while the question resolves.
  const zoom = useTransform(progress, [0, 0.6], [1, 1.06]);

  // Beat one — copy
  const askedOpacity = useTransform(progress, [0.04, 0.14], [0, 1]);
  const askedBlur = useTransform(progress, [0.04, 0.14], [8, 0]);
  const askedFilter = useTransform(askedBlur, blurFilter);
  const stackOpacity = useTransform(progress, [0.5, 0.6], [1, 0]);
  const stackY = useTransform(progress, [0.5, 0.6], [0, -24]);
  const stackBlur = useTransform(progress, [0.5, 0.6], [0, 8]);
  const stackFilter = useTransform(stackBlur, blurFilter);

  // Focus point: dot → soft glow → rises and becomes the reveal glow.
  const focusY = useTransform(progress, [0.52, 0.76], [0, -400]);
  const outerOpacity = useTransform(progress, [0.04, 0.4, 0.62, 0.78], [0, 1, 1, 0]);
  const outerScale = useTransform(progress, [0.04, 0.5, 0.76], [0.5, 1.3, 2.2]);
  const coreOpacity = useTransform(progress, [0.06, 0.2, 0.66, 0.8], [0, 1, 1, 0]);
  const coreScale = useTransform(progress, [0.06, 0.5, 0.78], [1, 2.6, 5]);
  const dotOpacity = useTransform(progress, [0.04, 0.12, 0.6, 0.7], [0, 1, 1, 0]);
  const dotScale = useTransform(progress, [0.1, 0.5], [1, 1.4]);

  // Beat two — reveal
  const revealOpacity = useTransform(progress, [0.94, 1], [1, 0.7]);
  const revealScale = useTransform(progress, [0.9, 1], [1, 1.03]);
  const violetOpacity = useTransform(progress, [0.55, 0.78], [0, 1]);
  const violetScale = useTransform(progress, [0.55, 0.78], [0.6, 1]);
  const mintOpacity = useTransform(progress, [0.64, 0.84], [0, 1]);
  const innerRingOpacity = useTransform(progress, [0.52, 0.7], [0, 1]);
  const innerRingScale = useTransform(progress, [0.52, 0.76], [0.3, 1]);
  const outerRingOpacity = useTransform(progress, [0.58, 0.78], [0, 1]);
  const outerRingScale = useTransform(progress, [0.58, 0.82], [0.4, 1]);
  // The flying bird lands in the mark (see FlightBird), so the mark's slot just
  // opens here and grows with the halos; a slow blur-in would hand a crisp bird
  // over to a soft logo.
  const logoOpacity = useTransform(progress, [0.66, 0.68], [0, 1]);
  const logoScale = useTransform(progress, [0.66, 0.82], [0.8, 1]);
  const tagOpacity = useTransform(progress, [0.84, 0.93], [0, 1]);
  const tagY = useTransform(progress, [0.84, 0.93], [14, 0]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity: sceneIn }}>
      <Grain />
      <Particles
        points={[
          { x: 420, y: 220, r: 1.2, opacity: 0.3 },
          { x: 1080, y: 700, r: 1.4, opacity: 0.25 },
          { x: 1210, y: 190, r: 1, opacity: 0.3 },
        ]}
      />

      <Stage>
        {/* Beat one: the quiet question, under a slow camera zoom */}
        <motion.div className="absolute inset-0" style={{ scale: zoom, willChange: "transform" }}>
          <motion.div aria-hidden className="absolute inset-0" style={{ y: focusY, willChange: "transform" }}>
            <motion.div
              className="absolute left-[520px] top-[560px] size-[400px] rounded-full bg-haze blur-[120px]"
              style={{ opacity: outerOpacity, scale: outerScale }}
            />
            <motion.div
              className="absolute left-[690px] top-[700px] size-[60px] rounded-full bg-lavender blur-[18px]"
              style={{ opacity: coreOpacity, scale: coreScale }}
            />
            <motion.div
              className="absolute left-[714px] top-[724px] size-3 rounded-full bg-warm-white"
              style={{ opacity: dotOpacity, scale: dotScale }}
            />
          </motion.div>

          <motion.div
            className="absolute left-0 top-[250px] flex w-full flex-col items-center gap-9 px-[200px]"
            style={{ opacity: stackOpacity, y: stackY, filter: stackFilter }}
          >
            <motion.p
              className="block w-fit font-serif text-3xl italic leading-normal text-text-dim"
              style={{ opacity: askedOpacity, filter: askedFilter }}
            >
              One day, I asked myself…
            </motion.p>
            <h2 className="block max-w-[1000px] text-center font-serif text-[80px] leading-[1.05] tracking-[-1.5px] text-warm-white">
              <ScrollWords
                text={QUESTION}
                progress={progress}
                range={[0.14, 0.42]}
                emphasis={EMPHASIS}
                emphasisClassName={EMPHASIS_CLASS}
              />
            </h2>
          </motion.div>
        </motion.div>

        {/* Beat two: the glow expands into halos and the mark resolves */}
        <motion.div className="absolute inset-0" style={{ opacity: revealOpacity, scale: revealScale }}>
          <motion.div
            aria-hidden
            className="absolute left-[370px] top-[60px] h-[560px] w-[700px] rounded-full bg-haze blur-[150px]"
            style={{ opacity: violetOpacity, scale: violetScale, willChange: "transform" }}
          />
          <motion.div
            aria-hidden
            className="absolute left-[620px] top-[140px] size-[200px] rounded-full bg-mint-haze blur-[90px]"
            style={{ opacity: mintOpacity }}
          />
          <motion.div
            aria-hidden
            className="absolute left-[480px] top-[90px] size-[480px] rounded-full border border-hairline"
            style={{ opacity: outerRingOpacity, scale: outerRingScale }}
          />
          <motion.div
            aria-hidden
            className="absolute left-[560px] top-[170px] size-[320px] rounded-full border border-hairline-strong"
            style={{ opacity: innerRingOpacity, scale: innerRingScale }}
          />
          <motion.div
            className="absolute left-[620px] top-[230px] size-[200px]"
            style={{ opacity: logoOpacity, scale: logoScale, willChange: "transform" }}
          >
            <Image
              src={logoMark.src}
              alt="Paisa logo mark"
              width={logoMark.width}
              height={logoMark.height}
              sizes="200px"
              className="block size-[200px] select-none"
              draggable={false}
              data-bird-perch=""
            />
          </motion.div>

          <div className="absolute left-0 top-[560px] flex w-full flex-col items-center gap-[18px]">
            <TrackedName progress={progress} />
            <motion.p
              className="block w-fit font-serif text-4xl italic leading-normal text-lavender"
              style={{ opacity: tagOpacity, y: tagY }}
            >
              Your money. Your clarity.
            </motion.p>
          </div>
        </motion.div>
      </Stage>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile (Wonder `aus`, reveal half)                                        */
/* -------------------------------------------------------------------------- */

function IdeaMobile() {
  return (
    <div className="relative overflow-hidden bg-void px-6 py-28">
      {/* Grain and glow fall off before the bottom edge so the plain void below joins without a seam. */}
      <Grain className="[mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
      <div
        aria-hidden
        className="absolute -left-10 bottom-[160px] h-[420px] w-[470px] rounded-full bg-haze blur-[100px]"
      />
      <div className="relative mx-auto flex max-w-[440px] flex-col items-center gap-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <Reveal>
            <p className="font-serif text-2xl italic leading-normal text-text-dim">One day, I asked myself…</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-[44px] leading-[1.05] tracking-[-1px] text-warm-white">
              What if there was a <span className="italic text-lavender">smarter way</span> to manage money?
            </h2>
          </Reveal>
        </div>

        <Reveal className="flex flex-col items-center gap-2.5">
          <Image
            src={logoMark.src}
            alt="Paisa logo mark"
            width={logoMark.width}
            height={logoMark.height}
            sizes="72px"
            className="block size-[72px] select-none"
            draggable={false}
            data-bird-perch=""
          />
          <h2 className="font-sans text-[56px] font-bold leading-none tracking-[-2.4px] text-warm-white">Paisa.</h2>
          <p className="font-serif text-[22px] italic leading-normal text-lavender">Your money. Your clarity.</p>
        </Reveal>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

export function SceneIdea() {
  return (
    <StoryScene
      id="idea"
      chapter="idea"
      label="The idea"
      length={3.5}
      rest={0.92}
      navBrand="hidden"
      mobile={<IdeaMobile />}
    >
      <IdeaDesktop />
    </StoryScene>
  );
}
