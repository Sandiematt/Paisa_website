import type { ReactNode } from "react";

/**
 * The 1440×900 Wonder frame, centred and scaled to fit the viewport
 * (`--stage-scale` is set before paint in layout.tsx). Place children with the
 * exact absolute coordinates from the Wonder scene. Full-bleed layers (grain,
 * glows that must reach the screen edges) belong outside the stage.
 * Centred in the small viewport (`svh`), which never changes while a touch
 * browser's toolbar collapses, so the stage cannot jump mid-scroll.
 */
export function Stage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute left-1/2 top-[50svh] h-[900px] w-[1440px] ${className}`}
      style={{ transform: "translate(-50%, -50%) scale(var(--stage-scale))" }}
    >
      {children}
    </div>
  );
}
