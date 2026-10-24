"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, type MotionStyle, type MotionValue } from "motion/react";

import { screens, type ScreenName } from "@/lib/site";

type ScreenImageProps = {
  screen: ScreenName;
  /** Rendered screen width in px (the screenshot is scaled to this width). */
  width: number;
  /** Scrolls the screenshot inside the screen (negative = scrolled down), in rendered px. */
  y?: number | MotionValue<number>;
  opacity?: number | MotionValue<number>;
  priority?: boolean;
};

/** One real app screenshot inside a phone screen. Stack several to crossfade. */
export function ScreenImage({ screen, width, y = 0, opacity = 1, priority }: ScreenImageProps) {
  const s = screens[screen];
  const height = Math.round((s.height / s.width) * width);
  return (
    <motion.div className="absolute left-0 top-0" style={{ y, opacity, width, height }}>
      <Image
        src={s.src}
        alt={s.alt}
        width={width}
        height={height}
        sizes={`${width}px`}
        priority={priority}
        className="block h-auto max-w-none select-none"
        style={{ width }}
        draggable={false}
      />
    </motion.div>
  );
}

type PhoneFrameProps = {
  /** Base screen; omit when you stack your own <ScreenImage> children. */
  screen?: ScreenName;
  /** Screen width in px. Wonder scenes use 312 (frame 334 wide), 280, 350, … */
  width?: number;
  /** Scroll offset of the base screenshot inside the screen. */
  screenY?: number | MotionValue<number>;
  /** Dark scrim over the screen (0–1), e.g. while UI pieces "assemble". */
  dim?: number | MotionValue<number>;
  /** Light frame for bright scenes (Chapter Four uses an ink frame on paper). */
  tone?: "dark" | "ink";
  className?: string;
  style?: MotionStyle;
  priority?: boolean;
  /** Overlays positioned in screen coordinates (highlight rings, toasts…). */
  children?: ReactNode;
};

/**
 * Realistic device frame used across the story (matches the Wonder phone:
 * 11px bezel at 312px, 54/44px radii, camera pill, deep layered shadow).
 * Pass motion values through `style` to move/rotate/scale it with scroll.
 */
export function PhoneFrame({
  screen,
  width = 312,
  screenY = 0,
  dim,
  tone = "dark",
  className = "",
  style,
  priority,
  children,
}: PhoneFrameProps) {
  const k = width / 312;
  const height = Math.round(676 * k);
  const bezel = Math.round(11 * k);
  const shadow =
    tone === "ink"
      ? "0px 50px 100px rgba(21,18,31,0.22), 0px 10px 24px rgba(21,18,31,0.12)"
      : "0px 60px 120px rgba(0,0,0,0.6), inset 0px 0px 0px 1.5px rgba(255,255,255,0.12)";

  return (
    <motion.div
      className={`${tone === "ink" ? "bg-ink" : "bg-charcoal"} ${className}`}
      style={{
        padding: bezel,
        borderRadius: Math.round(54 * k),
        boxShadow: shadow,
        willChange: "transform",
        ...style,
      }}
    >
      <div
        className="relative overflow-hidden bg-app-ground"
        style={{ width, height, borderRadius: Math.round(44 * k) }}
      >
        {screen && <ScreenImage screen={screen} width={width} y={screenY} priority={priority} />}
        {dim !== undefined && (
          <motion.div aria-hidden className="absolute inset-0 bg-void/75" style={{ opacity: dim }} />
        )}
        {children}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-void"
          style={{ top: Math.round(10 * k), width: Math.round(86 * k), height: Math.round(24 * k) }}
        />
      </div>
    </motion.div>
  );
}

type ScreenCropProps = {
  screen: ScreenName;
  /** Crop rectangle in rendered-screenshot px at `scale` width. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Width the full screenshot is rendered at before cropping (312 = phone width). */
  scale?: number;
  radius?: number;
  className?: string;
  style?: MotionStyle;
};

/**
 * A floating piece of a real app screen (e.g. the balance card flying into
 * place). Crops the screenshot instead of redrawing UI.
 */
export function ScreenCrop({ screen, x, y, width, height, scale = 312, radius = 20, className = "", style }: ScreenCropProps) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
        boxShadow: "0px 40px 80px rgba(0,0,0,0.6), 0px 0px 0px 1px rgba(255,255,255,0.12)",
        ...style,
      }}
    >
      <div className="relative" style={{ width, height }}>
        <div className="absolute left-0 top-0" style={{ transform: `translate(${-x}px, ${-y}px)` }}>
          <ScreenImage screen={screen} width={scale} />
        </div>
      </div>
    </motion.div>
  );
}
