"use client";

import { useEffect, useRef } from "react";

import { logoMark, type ChapterId } from "@/lib/site";
import { CINEMA_QUERY } from "@/components/story/StoryScene";

/*
 * The Paisa mark as a bird that flies through the story. It holds a spot in
 * each chapter, then dives and glides to the next one as the visitor scrolls,
 * flapping its wing (the mark's mint triangle) and leaning toward the cursor.
 *
 * It is born from the nav logo (`data-bird-origin`): when the page first shows,
 * it emerges from that mark and takes off, and never returns there. Whenever a
 * Paisa logo appears in the story (an element marked `data-bird-perch`), the bird
 * flies into it and settles: it lands exactly on the mark, the mark takes over
 * and the bird fades into it. When the logo is left behind, the bird takes off
 * from it again. The bird is the logo artwork itself (wing and body clipped
 * apart), so the hand-over is pixel-identical.
 *
 * Pure DOM/SVG driven by one rAF loop: no React renders while it flies. With
 * reduced motion it never runs, and every logo stays as it is.
 */

/** Rest pose for one chapter. x/y in viewport units (-1…1, y up), s = size multiplier, facing 1 = right, -1 = left. */
type Pose = { x: number; y: number; s: number; facing: 1 | -1; pitch: number; roll: number };

/** Pinned layout: spots chosen to sit beside each scene's headline and phone, never on them. */
const CINEMA: Record<ChapterId, Pose> = {
  question: { x: -0.02, y: -0.5, s: 1, facing: 1, pitch: 6, roll: -4 },
  problem: { x: 0.25, y: -0.66, s: 0.95, facing: -1, pitch: 10, roll: 6 },
  idea: { x: -0.58, y: -0.5, s: 1, facing: 1, pitch: 4, roll: -6 },
  product: { x: -0.55, y: -0.45, s: 0.95, facing: 1, pitch: 8, roll: 4 },
  "know-your-money": { x: 0.66, y: -0.56, s: 0.95, facing: -1, pitch: -6, roll: -8 },
  "smarter-tracking": { x: 0.18, y: 0.6, s: 0.9, facing: 1, pitch: 8, roll: 4 },
  insights: { x: 0.72, y: 0.6, s: 0.9, facing: -1, pitch: 6, roll: 0 },
  "better-habits": { x: -0.45, y: -0.5, s: 0.95, facing: 1, pitch: 10, roll: 6 },
  "behind-the-idea": { x: 0.7, y: -0.66, s: 0.9, facing: -1, pitch: 4, roll: -4 },
  "story-continues": { x: 0.12, y: 0.6, s: 1, facing: 1, pitch: 4, roll: 0 },
};

/**
 * Natural-scroll layout: the copy runs nearly full width, so the bird stays small
 * and rests in the bottom corners, crossing sides at each chapter.
 */
const NATURAL: Record<ChapterId, Pose> = {
  question: { x: 0.66, y: -0.74, s: 0.42, facing: -1, pitch: 6, roll: -4 },
  problem: { x: -0.68, y: -0.74, s: 0.42, facing: 1, pitch: 10, roll: 6 },
  idea: { x: 0.68, y: -0.74, s: 0.42, facing: -1, pitch: -6, roll: -8 },
  product: { x: -0.68, y: -0.74, s: 0.42, facing: 1, pitch: 8, roll: 4 },
  "know-your-money": { x: 0.68, y: -0.74, s: 0.42, facing: -1, pitch: 4, roll: 0 },
  "smarter-tracking": { x: -0.68, y: -0.74, s: 0.42, facing: 1, pitch: 8, roll: 4 },
  insights: { x: 0.68, y: -0.74, s: 0.42, facing: -1, pitch: 6, roll: -4 },
  "better-habits": { x: -0.68, y: -0.74, s: 0.42, facing: 1, pitch: 10, roll: 6 },
  "behind-the-idea": { x: 0.68, y: -0.74, s: 0.42, facing: -1, pitch: 4, roll: 0 },
  "story-continues": { x: -0.66, y: -0.74, s: 0.42, facing: 1, pitch: 4, roll: 0 },
};

/** Bird height as a share of the viewport height at s = 1. */
const SIZE = 0.15;
/** Share of each chapter's scroll spent flying to the next spot (the rest is a hold). */
const FLIGHT = 0.3;
/** Seconds for the bird to fade into a logo once landed, and to reappear when it takes off. */
const HAND_OVER = 0.22;

/**
 * The mint wing in the mark's 512 × 512 artwork: its outline grown by 6px, which
 * holds every wing pixel and none of the body (about 10px of air between them).
 */
const WING = "M137 196L143 178L156 145L205 23L217 6L236 2L260 8L310 31L342 51L363 68L370 82L370 89L367 97L360 105L326 127L190 215L173 226L159 227L149 223L140 213L137 205Z";
/** Everything but the wing. */
const BODY = `M0 0H512V512H0Z${WING}`;
/** Wing hinge: its root, where the triangle points at the body. */
const HINGE = "164px 216px";
/** The wing and its two faint motion-blur copies: phase offset and opacity. */
const WING_COPIES = [
  { phase: 0, opacity: 1 },
  { phase: 0.55, opacity: 0.28 },
  { phase: -0.55, opacity: 0.28 },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const bump = (t: number) => Math.sin(clamp(t, 0, 1) * Math.PI);

type Flight = Pose & { moving: number };
type Spot = { x: number; y: number; s: number };
type Perch = { el: HTMLElement; section: number };

/** Where the bird should be for this scroll position, given each chapter's start. */
function targetAt(scroll: number, tops: number[], end: number, poses: Pose[]): Flight & { chapter: number } {
  let i = 0;
  while (i < tops.length - 1 && scroll >= tops[i + 1]) i++;
  const next = Math.min(i + 1, poses.length - 1);
  const span = (tops[i + 1] ?? end) - tops[i];
  const f = span > 0 ? clamp((scroll - tops[i]) / span, 0, 1) : 0;
  // Holds still through most of the chapter, flies in its last stretch.
  const t = next === i ? 0 : ease(clamp((f - (1 - FLIGHT)) / FLIGHT, 0, 1));
  const a = poses[i];
  const b = poses[next];
  const arc = Math.sin(t * Math.PI);
  // Drops mid-flight, then glides back up; from spots near the bottom it swoops up instead.
  const dip = (a.y + b.y) / 2 < -0.45 ? -0.2 : 0.22;
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t) - arc * dip,
    s: lerp(a.s, b.s, t) * (1 + arc * 0.12),
    facing: t < 0.5 ? a.facing : b.facing,
    pitch: lerp(a.pitch, b.pitch, t),
    roll: lerp(a.roll, b.roll, t),
    moving: arc,
    chapter: i,
  };
}

/** Opacity the visitor actually sees, through every ancestor (the perch itself is skipped: it hides while waiting). */
function seenOpacity(el: HTMLElement): number {
  let o = 1;
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    const style = getComputedStyle(n);
    if (style.display === "none" || style.visibility === "hidden") return 0;
    o *= parseFloat(style.opacity);
    if (o < 0.01) return 0;
  }
  return o;
}

export function FlightBird() {
  const layer = useRef<HTMLDivElement>(null);
  const flight = useRef<HTMLDivElement>(null);
  const body = useRef<SVGSVGElement>(null);
  const wings = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cinemaQuery = window.matchMedia(CINEMA_QUERY);

    let ids: ChapterId[] = [];
    let tops: number[] = [];
    let end = 0;
    let perches: Perch[] = [];
    const measure = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("section[data-chapter]"));
      ids = sections.map((s) => s.dataset.chapter as ChapterId);
      tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
      end = document.documentElement.scrollHeight - window.innerHeight;
      perches = Array.from(document.querySelectorAll<HTMLElement>("[data-bird-perch]")).map((el) => {
        const section = el.closest("section[data-chapter]");
        return { el, section: section ? sections.indexOf(section as HTMLElement) : -1 };
      });
      // A logo the bird has not landed in yet stays hidden until it does.
      for (const p of perches) p.el.dataset.perch ??= "waiting";
    };
    measure();
    const resized = new ResizeObserver(measure);
    resized.observe(document.body);
    window.addEventListener("resize", measure);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Once the splash has gone, emerge from the nav logo and take off.
    let shown = false;
    let launch = false;
    const show = () => {
      shown = true;
      launch = true;
      layer.current?.style.setProperty("opacity", "1");
    };
    if (document.documentElement.classList.contains("splash-active")) {
      window.addEventListener("paisa:splash-done", show, { once: true });
    } else {
      show();
    }

    let cur: (Flight & { face: number }) | null = null;
    const mouse = { x: 0, y: 0 };
    let mode: "free" | "landing" | "perched" = "free";
    let perch: Perch | null = null;
    let from: Spot & { pitch: number; roll: number } = { x: 0, y: 0, s: 1, pitch: 0, roll: 0 };
    let landStart = 0;
    let landTime = 1;
    let alpha = 1;
    let freedom = 1;
    /** When the bird last left a logo: it eases into flight from there. */
    let liftStart = 0;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      if (!ids.length) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const cinema = cinemaQuery.matches;
      const goal = targetAt(window.scrollY, tops, end, ids.map((id) => (cinema ? CINEMA : NATURAL)[id]));
      if (!cur) cur = { ...goal, face: goal.facing };
      if (launch) {
        launch = false;
        const r = document.querySelector("[data-bird-origin]")?.getBoundingClientRect();
        if (r?.width) {
          // Sitting exactly on the nav logo, invisible, wing folded: it fades in and lifts off.
          cur.x = ((r.left + r.width / 2) / w) * 2 - 1;
          cur.y = 1 - ((r.top + r.height / 2) / h) * 2;
          cur.s = r.height / (h * SIZE);
          cur.pitch = 0;
          cur.roll = 0;
          cur.face = 1;
          alpha = 0;
          freedom = 0;
          // A beat on the logo to appear and open its wing before it lifts off.
          liftStart = t + 0.45;
        }
      }

      // Which logo, if any, the bird should be in. A logo out of sight resets,
      // so its next appearance is a landing again (it is invisible, so no flicker).
      let target: Perch | null = null;
      let spot: Spot | null = null;
      for (const p of perches) {
        const r = p.el.getBoundingClientRect();
        const inView = r.width > 0 && r.bottom > 0 && r.top < h && r.right > 0 && r.left < w;
        const seen = inView ? seenOpacity(p.el) : 0;
        if (!seen) {
          p.el.dataset.perch = "waiting";
          continue;
        }
        if (!shown || target) continue;
        const cy = r.top + r.height / 2;
        const wanted = seen > 0.5 && cy > h * 0.08 && cy < h * 0.92 && (!cinema || p.section === goal.chapter);
        if (!wanted) continue;
        target = p;
        spot = {
          x: ((r.left + r.width / 2) / w) * 2 - 1,
          y: 1 - (cy / h) * 2,
          s: r.height / (h * SIZE),
        };
      }

      if (target && spot && (mode === "free" || perch !== target)) {
        mode = "landing";
        perch = target;
        from = { x: cur.x, y: cur.y, s: cur.s, pitch: cur.pitch, roll: cur.roll };
        landStart = t;
        landTime = clamp(0.7 + Math.hypot((spot.x - cur.x) * (w / h), spot.y - cur.y) * 0.35, 0.8, 1.3);
      } else if (!target && mode !== "free") {
        // Take off from the logo it was in.
        mode = "free";
        perch = null;
        liftStart = t;
      }

      const px = cur.x;
      const py = cur.y;
      let flare = 0;
      let flap = 1;
      if (mode === "free" || !spot) {
        // Lag behind the scroll and fly to the chapter's spot; leaving a logo, it accelerates gently.
        const lift = t < liftStart ? 0 : Math.max(0.15, Math.min(1, (t - liftStart) / 0.6));
        const k = (1 - Math.exp(-dt * 3.2)) * lift;
        cur.x = lerp(cur.x, goal.x, k);
        cur.y = lerp(cur.y, goal.y, k);
        cur.s = lerp(cur.s, goal.s, k);
        cur.pitch = lerp(cur.pitch, goal.pitch, k);
        cur.roll = lerp(cur.roll, goal.roll, k);
        cur.moving = lerp(cur.moving, goal.moving, k);
        freedom = Math.min(1, freedom + dt / 0.4);
        // Unfolds its wing as it lifts off a logo.
        flap = freedom;
        alpha = Math.min(1, alpha + dt / HAND_OVER);
      } else {
        // Fly into the logo on an arc, flare nose-up to brake, fold the wing and settle.
        const u = clamp((t - landStart) / landTime, 0, 1);
        const e = ease(u);
        const dist = Math.hypot(spot.x - from.x, spot.y - from.y);
        cur.x = lerp(from.x, spot.x, e);
        cur.y = lerp(from.y, spot.y, e) + bump(u) * Math.min(0.22, dist * 0.35);
        // Shrinks or grows to the logo's size as it closes in, with a small puff before it settles.
        cur.s = lerp(from.s, spot.s, e) * (1 + bump((u - 0.7) / 0.3) * 0.06);
        cur.pitch = lerp(from.pitch, 0, easeOut(u));
        cur.roll = lerp(from.roll, 0, easeOut(u));
        cur.moving = bump(u);
        flare = bump((u - 0.55) / 0.45) * 14;
        flap = 1 - easeOut(clamp((u - 0.72) / 0.28, 0, 1));
        freedom = 1 - e;
        if (u >= 1 && mode === "landing" && perch) {
          mode = "perched";
          perch.el.dataset.perch = "landed";
        }
        if (mode === "perched") {
          // Stay exactly on the logo (it may scroll or scale) while fading into it.
          cur.x = spot.x;
          cur.y = spot.y;
          cur.s = spot.s;
          flap = 0;
          freedom = 0;
          alpha = Math.max(0, alpha - dt / HAND_OVER);
        } else {
          alpha = Math.min(1, alpha + dt / HAND_OVER);
        }
      }
      const vx = dt > 0 ? (cur.x - px) / dt : 0;
      const vy = dt > 0 ? (cur.y - py) / dt : 0;

      // Face the way it flies; at rest, face the chapter's way; in a logo, face as the logo does.
      // Turning is a quick card flip.
      const landing = mode !== "free";
      const facing = t < liftStart || (landing && (mode === "perched" || (t - landStart) / landTime > 0.55))
        ? 1
        : Math.abs(vx) > 0.08
          ? Math.sign(vx)
          : landing
            ? 1
            : goal.facing;
      cur.face = mode === "perched" ? 1 : lerp(cur.face, facing, 1 - Math.exp(-dt * 7));

      const km = 1 - Math.exp(-dt * 2);
      mouse.x = lerp(mouse.x, pointer.x, km);
      mouse.y = lerp(mouse.y, pointer.y, km);

      const size = h * SIZE * cur.s;
      const hover = Math.sin(t * 2.1) * 0.045 + Math.sin(t * 3.7) * 0.015;
      const x = cur.x + (Math.sin(t * 1.3) * 0.01 + mouse.x * 0.03) * freedom;
      const y = cur.y + (hover * 0.5 + mouse.y * 0.025) * freedom;
      const left = ((x + 1) / 2) * w - size / 2;
      const top = ((1 - y) / 2) * h - size / 2;
      if (flight.current) {
        flight.current.style.width = `${size}px`;
        flight.current.style.height = `${size}px`;
        flight.current.style.opacity = alpha.toFixed(3);
        flight.current.style.transform = `translate3d(${left}px, ${top}px, 0) scaleX(${cur.face})`;
      }

      // Nose down when diving, banks into turns (mirrors with the flip), flares to land.
      const pitch =
        cur.pitch +
        (-clamp(vy * 22, -28, 28) + Math.sin(t * 2.1 + 1) * 3 + mouse.y * 6) * freedom +
        flare;
      const roll = cur.roll + (clamp(Math.abs(vx) * 18, -30, 30) + Math.sin(t * 1.7) * 4) * freedom;
      if (body.current) body.current.style.transform = `rotate(${(-pitch + roll * 0.4).toFixed(2)}deg)`;

      const freq = Math.PI * 2 * (5 + cur.moving * 3);
      WING_COPIES.forEach((copy, i) => {
        const el = wings.current[i];
        if (!el) return;
        const a = Math.sin(t * freq + copy.phase);
        el.style.transform = `rotate(${((-8 + a * 30) * flap).toFixed(2)}deg)`;
        if (i > 0) el.style.opacity = (copy.opacity * flap).toFixed(3);
      });
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resized.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("paisa:splash-done", show);
      for (const p of perches) delete p.el.dataset.perch;
    };
  }, []);

  return (
    <div
      ref={layer}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden opacity-0 motion-reduce:hidden"
    >
      <div ref={flight} className="absolute left-0 top-0 will-change-transform">
        <svg ref={body} viewBox="0 0 512 512" className="block h-full w-full overflow-visible">
          <defs>
            <clipPath id="bird-wing">
              <path d={WING} />
            </clipPath>
            <clipPath id="bird-body">
              <path d={BODY} clipRule="evenodd" />
            </clipPath>
          </defs>

          {/* The mint triangle is the wing: behind the body, so it tucks in on the downstroke. */}
          {WING_COPIES.map((copy, i) => (
            <g
              key={i}
              ref={(el) => {
                wings.current[i] = el;
              }}
              opacity={copy.opacity}
              style={{ transformBox: "view-box", transformOrigin: HINGE }}
            >
              <image href={logoMark.src} width={512} height={512} clipPath="url(#bird-wing)" />
            </g>
          ))}
          <image href={logoMark.src} width={512} height={512} clipPath="url(#bird-body)" />
        </svg>
      </div>
    </div>
  );
}
