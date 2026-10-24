"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";

import { Grain, Particles } from "@/components/story/Atmosphere";
import { PhoneFrame } from "@/components/story/PhoneFrame";
import { Stage } from "@/components/story/Stage";
import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Reveal } from "@/components/story/Text";
import { links, logoMark } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  Icons (Lucide / Font Awesome paths copied from the Wonder frames)         */
/* -------------------------------------------------------------------------- */
function ArrowRightIcon({ className = "" }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ArrowUpIcon({ className = "" }: { className?: string }) {
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
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function DownloadIcon({ className = "" }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function GithubIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 496 512" fill="currentColor" className={className}>
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared pieces                                                             */
/* -------------------------------------------------------------------------- */
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lavender";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

function Brand({ markSize, wordClass }: { markSize: number; wordClass: string }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={logoMark.src}
        alt=""
        width={markSize}
        height={markSize}
        style={{ width: markSize, height: markSize }}
        draggable={false}
        data-bird-perch=""
      />
      <span className={`font-bold text-warm-white ${wordClass}`}>Paisa</span>
    </div>
  );
}

function Headline({ className, lineOne, lineTwo }: { className: string; lineOne?: object; lineTwo?: object }) {
  return (
    <h2 className="flex flex-col">
      <motion.span className={`block font-serif text-warm-white ${className}`} style={lineOne}>
        Your money has a story.
      </motion.span>
      <motion.span className={`block font-serif italic text-lavender ${className}`} style={lineTwo}>
        Make it one you understand.
      </motion.span>
    </h2>
  );
}

const DOWNLOAD_NOTE = "Android download link appears here once it’s available.";

/** Primary CTA + optional GitHub / download buttons + the muted download note. */
function Actions({ size }: { size: "desktop" | "mobile" }) {
  const desktop = size === "desktop";
  const base = desktop ? "h-14 px-7 gap-2.5" : "h-[52px] w-full gap-2";
  const outline = desktop ? "h-14 px-6 gap-2.5" : "h-[52px] w-full gap-2";
  return (
    <>
      <div className={desktop ? "flex flex-wrap items-center gap-3 pt-2" : "flex flex-col gap-2.5"}>
        <a
          href="#product"
          className={`inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-violet)_0%,var(--color-violet-deep)_100%)] text-base font-semibold text-warm-white shadow-[0px_14px_36px_var(--color-violet-glow)] ${base} ${FOCUS}`}
        >
          Explore Paisa
          <ArrowRightIcon className="size-[18px]" />
        </a>
        {links.github && (
          <a
            href={links.github}
            {...EXTERNAL}
            className={`inline-flex items-center justify-center rounded-full border border-hairline-strong text-base font-semibold text-warm-white ${outline} ${FOCUS}`}
          >
            <GithubIcon className="size-[18px]" />
            {desktop ? "View the project on GitHub" : "View on GitHub"}
          </a>
        )}
        {links.download && (
          <a
            href={links.download}
            {...EXTERNAL}
            className={`inline-flex items-center justify-center rounded-full border border-mint/40 bg-mint-soft text-base font-semibold text-mint ${outline} ${FOCUS}`}
          >
            <DownloadIcon className="size-[18px]" />
            Get the app
          </a>
        )}
      </div>
      {!links.download && <p className="w-fit text-sm text-text-dim">{DOWNLOAD_NOTE}</p>}
      {links.portfolio && (
        <a
          href={links.portfolio}
          {...EXTERNAL}
          className={`w-fit text-[13px] tracking-[0.2px] text-text-dim transition-colors hover:text-lavender ${FOCUS}`}
        >
          Built by <span className="underline decoration-hairline-strong underline-offset-4">sandiematt.com</span>
        </a>
      )}
    </>
  );
}

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: links.privacy },
  { label: "Terms of Use", href: links.terms },
  { label: "Support", href: links.support },
  // The portfolio is shown under the CTAs instead of repeating it here.
].filter((l): l is { label: string; href: string } => Boolean(l.href));

function FooterRow({ className }: { className: string }) {
  return (
    <footer className={`border-t border-hairline text-[13px] text-text-dim ${className}`}>
      {FOOTER_LINKS.length > 0 && (
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...EXTERNAL}
              className={`transition-colors hover:text-warm-white ${FOCUS}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:ml-auto">
        <span>© 2026 Paisa</span>
        <a href="#question" className={`inline-flex items-center gap-1.5 transition-colors hover:text-warm-white ${FOCUS}`}>
          <ArrowUpIcon className="size-3.5" />
          Watch the story again
        </a>
      </div>
    </footer>
  );
}

/** Slow idle float. Skipped entirely with reduced motion. */
function Bob({ reduced, children, distance = 12 }: { reduced: boolean; children: ReactNode; distance?: number }) {
  return (
    <motion.div
      animate={reduced ? undefined : { y: [0, -distance, 0] }}
      transition={reduced ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}

const PARTICLES = [
  { x: 220, y: 140, r: 1.4, opacity: 0.4 },
  { x: 640, y: 760, r: 1.2, opacity: 0.3 },
  { x: 1320, y: 120, r: 1.6, color: "#B9A7FF", opacity: 0.4 },
  { x: 1240, y: 800, r: 1.2, color: "#19E3A6", opacity: 0.35 },
];

/* -------------------------------------------------------------------------- */
/*  Desktop                                                                   */
/* -------------------------------------------------------------------------- */
function DesktopScene() {
  const { progress, reduced } = useSceneProgress();

  const atmosphere = useTransform(progress, [0, 0.15], [0, 1]);
  const halo = useTransform(progress, [0, 0.4], [0.9, 1]);
  const phoneOpacity = useTransform(progress, [0, 0.2], [0, 1]);
  const phoneY = useTransform(progress, [0, 0.25], [70, 0]);
  const phoneScale = useTransform(progress, [0, 0.25], [0.94, 1]);

  const brandOpacity = useTransform(progress, [0.02, 0.14], [0, 1]);
  const brandY = useTransform(progress, [0.02, 0.14], [16, 0]);
  const oneOpacity = useTransform(progress, [0.06, 0.22], [0, 1]);
  const oneY = useTransform(progress, [0.06, 0.22], [28, 0]);
  const twoOpacity = useTransform(progress, [0.14, 0.3], [0, 1]);
  const twoY = useTransform(progress, [0.14, 0.3], [28, 0]);
  const ctaOpacity = useTransform(progress, [0.38, 0.55], [0, 1]);
  const ctaY = useTransform(progress, [0.38, 0.55], [20, 0]);
  const footerOpacity = useTransform(progress, [0.55, 0.7], [0, 1]);

  return (
    <>
      <motion.div aria-hidden className="absolute inset-0" style={{ opacity: atmosphere }}>
        <Grain />
        <Particles points={PARTICLES} />
      </motion.div>

      <Stage>
        <motion.div aria-hidden className="absolute inset-0" style={{ opacity: atmosphere }}>
          <div className="absolute left-[760px] top-[60px] h-[720px] w-[640px] rounded-full bg-haze blur-[150px] [contain:layout]" />
          <div className="absolute left-[1000px] top-[140px] size-[240px] rounded-full bg-mint-haze blur-[100px] [contain:layout]" />
          <motion.div
            className="absolute left-[800px] top-[110px] size-[560px] rounded-full border border-hairline"
            style={{ scale: halo, willChange: "transform" }}
          />
        </motion.div>

        {/* Floating phone */}
        <motion.div
          className="absolute left-[920px] top-[130px]"
          style={{ opacity: phoneOpacity, y: phoneY, scale: phoneScale, willChange: "transform" }}
        >
          <div className="-rotate-[5deg]">
            <Bob reduced={reduced} distance={14}>
              <PhoneFrame
                screen="home"
                width={312}
                style={{ boxShadow: "0px 70px 130px rgba(0,0,0,0.65), inset 0px 0px 0px 1.5px rgba(255,255,255,0.14)" }}
              />
            </Bob>
          </div>
        </motion.div>

        {/* Message */}
        <div className="absolute left-[120px] top-[190px] flex w-[640px] flex-col gap-7">
          <motion.div style={{ opacity: brandOpacity, y: brandY }}>
            <Brand markSize={48} wordClass="text-[28px] tracking-[-1px]" />
          </motion.div>
          <Headline
            className="text-[80px] leading-[1.02] tracking-[-1.8px]"
            lineOne={{ opacity: oneOpacity, y: oneY }}
            lineTwo={{ opacity: twoOpacity, y: twoY }}
          />
          <motion.div className="flex flex-col gap-7" style={{ opacity: ctaOpacity, y: ctaY }}>
            <Actions size="desktop" />
          </motion.div>
        </div>
      </Stage>

      {/* Pinned to the small viewport's bottom so a touch toolbar never covers it. */}
      <motion.div className="absolute inset-x-0 top-[calc(100svh-72px)] z-10" style={{ opacity: footerOpacity }}>
        <FooterRow className="flex h-[72px] items-center justify-between px-[clamp(24px,8.33vw,120px)]" />
      </motion.div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile (Wonder frame `joy`)                                               */
/* -------------------------------------------------------------------------- */
function MobileScene() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="relative overflow-hidden bg-void">
      <div
        aria-hidden
        className="absolute left-[60px] top-[320px] h-[400px] w-[360px] rounded-full bg-haze blur-[100px]"
      />
      <div className="relative z-[1] mx-auto flex max-w-[420px] flex-col gap-5 px-6 pt-20">
        <Reveal>
          <Brand markSize={36} wordClass="text-[22px] tracking-[-0.8px]" />
        </Reveal>
        <Reveal delay={0.05}>
          <Headline className="text-[42px] leading-[1.04]" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-5">
            <Actions size="mobile" />
          </div>
        </Reveal>
      </div>

      <Reveal className="relative z-[1]">
        <div className="mx-auto flex h-[340px] w-full max-w-[420px] justify-center overflow-hidden pt-12">
          <div className="-rotate-[4deg]">
            <Bob reduced={reduced} distance={8}>
              <PhoneFrame screen="home" width={200} />
            </Bob>
          </div>
        </div>
      </Reveal>

      <FooterRow className="relative z-[1] mx-auto flex max-w-[420px] flex-col gap-4 px-6 py-8" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 12 — The story continues                                            */
/* -------------------------------------------------------------------------- */
export function SceneFinal() {
  return (
    <StoryScene
      id="story-continues"
      chapter="story-continues"
      label="The story continues"
      length={1.8}
      rest={1}
      navBrand="hidden"
      className="bg-void"
      mobile={<MobileScene />}
    >
      <DesktopScene />
    </StoryScene>
  );
}
