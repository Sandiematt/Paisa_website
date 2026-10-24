/**
 * One 240px tile of the film grain (feTurbulence, desaturated). Stitched tiles
 * repeat seamlessly, and as a background image it is rasterised once and
 * reused, instead of a full-viewport SVG filter re-rendered for every section.
 */
const GRAIN_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>',
)}")`;

/** Film grain over the whole layer (Wonder: feTurbulence at 7% opacity). */
export function Grain({ opacity = 0.07, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ backgroundImage: GRAIN_TILE, backgroundSize: "240px 240px", opacity }}
    />
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
