"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "motion/react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Reduced-motion preference that is `false` during server render and
 * hydration, then the real value — so scenes that render text from `progress`
 * (e.g. typed code) hydrate with the same markup the server produced.
 */
function useHydratedReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

import type { ChapterId } from "@/lib/site";

type SceneContextValue = {
  /** 0 → 1 while the pinned desktop scene scrolls past. Constant `rest` with reduced motion. */
  progress: MotionValue<number>;
  /** True when the visitor prefers reduced motion: render the resting composition. */
  reduced: boolean;
};

const SceneContext = createContext<SceneContextValue | null>(null);

/** Scroll progress of the enclosing <StoryScene>. Use with useTransform. */
export function useSceneProgress(): SceneContextValue {
  const value = useContext(SceneContext);
  if (!value) {
    throw new Error("useSceneProgress must be used inside <StoryScene>");
  }
  return value;
}

type StorySceneProps = {
  /** Anchor id for the section (used by nav links and "Skip to the product"). */
  id: string;
  chapter: ChapterId;
  /** Accessible name for the section. */
  label: string;
  /**
   * Desktop scroll length in viewport heights. The stage stays pinned for
   * `length - 1` viewports while `progress` runs 0 → 1.
   */
  length?: number;
  /** Progress value shown when the visitor prefers reduced motion. */
  rest?: number;
  /** Nav styling while this scene is active. */
  navTheme?: "dark" | "light";
  /** Nav brand visibility while this scene is active (the reveal hides it). */
  navBrand?: "dim" | "full" | "hidden";
  /** Classes for the pinned desktop viewport (background colour etc.). */
  className?: string;
  /** Desktop (md and up) cinematic composition — usually a <Stage>. */
  children: ReactNode;
  /** Mobile (below md) natural-scroll version of the scene. */
  mobile: ReactNode;
};

/**
 * One chapter of the scroll story.
 *
 * Desktop: a tall section whose inner viewport is `position: sticky`, so the
 * scene stays pinned while the visitor scrolls and children animate from
 * `useSceneProgress().progress`.
 * Mobile: no pinning — the `mobile` node scrolls naturally (use <Reveal>).
 */
export function StoryScene({
  id,
  chapter,
  label,
  length = 2.5,
  rest = 0.6,
  navTheme = "dark",
  navBrand = "full",
  className = "bg-void",
  children,
  mobile,
}: StorySceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // One stable MotionValue for the scene's lifetime: children bind their
  // useTransforms to it once. It mirrors scroll, or holds `rest` when the
  // visitor prefers reduced motion (applied after hydration).
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduced) progress.set(v);
  });
  useEffect(() => {
    progress.set(reduced ? rest : scrollYProgress.get());
  }, [reduced, rest, progress, scrollYProgress]);

  return (
    <section
      id={id}
      aria-label={label}
      data-chapter={chapter}
      data-nav-theme={navTheme}
      data-nav-brand={navBrand}
      className="relative"
    >
      <SceneContext.Provider value={{ progress, reduced }}>
        <div
          ref={ref}
          className="relative hidden md:block"
          style={{ height: reduced ? "100svh" : `${length * 100}svh` }}
        >
          <div className={`sticky top-0 h-svh w-full overflow-hidden ${className}`}>
            {children}
          </div>
        </div>
      </SceneContext.Provider>
      <div className="md:hidden">{mobile}</div>
    </section>
  );
}
