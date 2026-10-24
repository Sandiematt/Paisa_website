"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

type ScrollWordsProps = {
  text: string;
  progress: MotionValue<number>;
  /** Progress window over which the words reveal, first word to last. */
  range: [number, number];
  className?: string;
  /** Per-word class (e.g. italic for some words via `emphasis`). */
  wordClassName?: string;
  /** Indexes of words to render with `emphasisClassName`. */
  emphasis?: number[];
  emphasisClassName?: string;
};

/**
 * Word-by-word, scroll-linked reveal: each word fades up and un-blurs inside
 * its slice of `range`. Scrolling back reverses it.
 */
export function ScrollWords({
  text,
  progress,
  range,
  className = "",
  wordClassName = "",
  emphasis = [],
  emphasisClassName = "",
}: ScrollWordsProps) {
  const words = text.split(" ");
  const [start, end] = range;
  const step = (end - start) / words.length;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="contents">
        {words.map((word, i) => (
          <Word
            key={`${word}-${i}`}
            progress={progress}
            from={start + i * step}
            to={start + (i + 1.6) * step}
            className={`${wordClassName} ${emphasis.includes(i) ? emphasisClassName : ""}`}
          >
            {word}
          </Word>
        ))}
      </span>
    </span>
  );
}

function Word({
  progress,
  from,
  to,
  className,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  className: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [from, to], [0.12, 1]);
  const blur = useTransform(progress, [from, to], [6, 0]);
  const y = useTransform(progress, [from, to], [14, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.span className={`inline-block ${className}`} style={{ opacity, filter, y }}>
      {children}
      {" "}
    </motion.span>
  );
}

/** Mobile/natural-scroll reveal: fades and lifts in once when it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
