"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";

import splashAnimation from "@/assets/paisa-splash.json";

/** Mirrors the app's LaunchSplash: 200px mark on `colors.ground`, 320ms ease-out exit. */
const MARK_SIZE = 200;
const EXIT_MS = 320;
/** Never hold the visitor longer than this, even if the animation fails to load. */
const FAILSAFE_MS = 4000;

type Phase = "playing" | "exiting" | "done";

/**
 * The real Paisa launch animation (assets/animations/paisa-splash.json from the
 * Android app), played once over the story on first load, then faded out.
 * Scrolling is locked by the `splash-active` class set in layout.tsx.
 */
export function Splash() {
  const container = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("playing");

  useEffect(() => {
    let animation: AnimationItem | undefined;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const leave = () => {
      if (!cancelled) setPhase((p) => (p === "playing" ? "exiting" : p));
    };

    if (!window.location.hash) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("lottie-web/build/player/lottie_light")
      .then(({ default: lottie }) => {
        if (cancelled || !container.current) return;
        animation = lottie.loadAnimation({
          container: container.current,
          renderer: "svg",
          loop: false,
          autoplay: !reduced,
          animationData: splashAnimation,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
        if (reduced) {
          animation.goToAndStop(animation.totalFrames - 1, true);
          timers.push(setTimeout(leave, 600));
        } else {
          animation.addEventListener("complete", leave);
          animation.addEventListener("data_failed", leave);
        }
      })
      .catch(leave);

    timers.push(setTimeout(leave, FAILSAFE_MS));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      animation?.destroy();
    };
  }, []);

  useEffect(() => {
    if (phase !== "exiting") return;
    const root = document.documentElement;
    root.classList.remove("splash-active");
    const t = setTimeout(() => {
      setPhase("done");
      window.dispatchEvent(new Event("paisa:splash-done"));
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      id="paisa-splash"
      role="img"
      aria-label="Paisa"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-app-ground transition-opacity ease-film"
      style={{ opacity: phase === "exiting" ? 0 : 1, transitionDuration: `${EXIT_MS}ms` }}
    >
      <div ref={container} style={{ width: MARK_SIZE, height: MARK_SIZE }} />
    </div>
  );
}
