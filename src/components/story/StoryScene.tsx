"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "motion/react";

import type { ChapterId } from "@/lib/site";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Where the pinned cinematic layout is used: wide *and* landscape-ish. Portrait
 * tablets get the natural-scroll layout instead of a letterboxed 1440×900
 * stage. Mirrors the `cinema` variant in globals.css.
 */
export const CINEMA_QUERY = "(min-width: 48rem) and (min-aspect-ratio: 1/1)";

/**
 * Scroll distance, in viewport heights, over which a pinned scene dissolves in
 * over the previous one (which holds its last frame meanwhile). Mirrors
 * `--scene-dissolve` in globals.css.
 */
const DISSOLVE = 0.3;

function subscribeQuery(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}

const subscribeReducedMotion = subscribeQuery(REDUCED_QUERY);
const subscribeCinema = subscribeQuery(CINEMA_QUERY);

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

/**
 * Which layout the viewport uses: `null` during server render and hydration
 * (both are rendered and CSS shows one), then only the matching one is mounted,
 * so the hidden layout no longer runs scroll work or loads its images.
 */
function useCinema(): boolean | null {
  return useSyncExternalStore(
    subscribeCinema,
    () => window.matchMedia(CINEMA_QUERY).matches,
    () => null,
  );
}

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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

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
  /**
   * Scroll, in viewport heights (at most the 0.3 hold), over which this scene
   * fades in over the previous one. Shorten it when the scene opens with its
   * own transition (e.g. a wipe) that must not run half-transparent.
   */
  dissolve?: number;
  /** Nav styling while this scene is active. */
  navTheme?: "dark" | "light";
  /** Nav brand visibility while this scene is active (the reveal hides it). */
  navBrand?: "dim" | "full" | "hidden";
  /** Classes for the pinned desktop viewport (background colour etc.). */
  className?: string;
  /** Desktop cinematic composition — usually a <Stage>. */
  children: ReactNode;
  /** Mobile / portrait natural-scroll version of the scene. */
  mobile: ReactNode;
};

/**
 * One chapter of the scroll story.
 *
 * Cinematic layout: a tall track whose inner viewport is `position: sticky`,
 * so the scene stays pinned while children animate from
 * `useSceneProgress().progress`. Each scene's last frame is composed to match
 * the next scene's first frame, so consecutive tracks overlap (globals.css
 * pulls every scene up by one viewport plus the dissolve): the next scene is
 * invisible while it scrolls in, then dissolves in on top of the previous one,
 * which holds its last frame meanwhile. No viewport ever shows two half-scenes
 * meeting at a seam.
 * Natural-scroll layout: no pinning — the `mobile` node scrolls (use <Reveal>).
 */
export function StoryScene({
  id,
  chapter,
  label,
  length = 2.5,
  rest = 0.6,
  dissolve = DISSOLVE,
  navTheme = "dark",
  navBrand = "full",
  className = "bg-void",
  children,
  mobile,
}: StorySceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useHydratedReducedMotion();
  const cinema = useCinema();
  const { scrollY } = useScroll();
  // Stable MotionValues for the scene's lifetime: children bind their
  // useTransforms to `progress` once. It mirrors scroll, or holds `rest` when
  // the visitor prefers reduced motion (applied after hydration).
  const progress = useMotionValue(0);
  const presence = useMotionValue(1);

  const update = useCallback(() => {
    const track = trackRef.current;
    const panel = panelRef.current;
    if (reduced || !track || !panel) return;
    const vh = panel.offsetHeight;
    if (!vh) return; // layout not shown at this size
    const scrolled = -track.getBoundingClientRect().top;
    const first = !sectionRef.current?.previousElementSibling;
    progress.set(clamp01(scrolled / Math.max((length - 1) * vh, 1)));
    presence.set(first ? 1 : clamp01(scrolled / (Math.min(dissolve, DISSOLVE) * vh)));
  }, [reduced, length, dissolve, progress, presence]);

  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    if (reduced) {
      progress.set(rest);
      presence.set(1);
      return;
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduced, rest, cinema, update, progress, presence]);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={label}
      data-chapter={chapter}
      data-nav-theme={navTheme}
      data-nav-brand={navBrand}
      className="story-scene relative"
    >
      {cinema !== false && (
        <SceneContext.Provider value={{ progress, reduced }}>
          <div
            ref={trackRef}
            className="relative hidden cinema:block"
            style={{ height: reduced ? "100lvh" : `${(length + DISSOLVE) * 100}lvh` }}
          >
            <motion.div
              ref={panelRef}
              className={`sticky top-0 h-lvh w-full overflow-hidden ${className}`}
              style={{ opacity: presence }}
            >
              {children}
            </motion.div>
          </div>
        </SceneContext.Provider>
      )}
      {cinema !== true && <div className="cinema:hidden">{mobile}</div>}
    </section>
  );
}
