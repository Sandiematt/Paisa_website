"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

import { Splash } from "@/components/splash/Splash";
import { FlightBird } from "@/components/story/FlightBird";
import { StoryNav } from "@/components/story/StoryNav";

/** Client shell: splash first, persistent story nav, the flying Paisa bird, reduced-motion aware animation. */
export function StoryRoot({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#product"
        className="sr-only-focusable fixed left-4 top-4 z-[90] rounded-full bg-warm-white px-4 py-2 text-sm font-semibold text-ink"
      >
        Skip to the product
      </a>
      <Splash />
      <StoryNav />
      <main id="story">{children}</main>
      <FlightBird />
    </MotionConfig>
  );
}
