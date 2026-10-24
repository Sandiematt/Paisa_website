import { useId } from "react";

/** Film grain over the whole viewport (Wonder: feTurbulence at 7% opacity). */
export function Grain({ opacity = 0.07 }: { opacity?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id={`grain-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} opacity={opacity} />
    </svg>
  );
}

type Particle = { x: number; y: number; r: number; color?: string; opacity: number };

/** Sparse floating dots, positioned in 1440×900 stage coordinates. */
export function Particles({ points, className = "" }: { points: Particle[]; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color ?? "#F5F1EA"} opacity={p.opacity} />
      ))}
    </svg>
  );
}
