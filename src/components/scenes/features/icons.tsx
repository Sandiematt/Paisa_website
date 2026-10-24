import type { ReactNode } from "react";

/** Lucide-style stroke icon shell (paths copied from the Wonder frames). */
function Lu({ size, className = "", children }: { size: number; className?: string; children: ReactNode }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`block shrink-0 ${className}`}
    >
      {children}
    </svg>
  );
}

type IconProps = { size?: number; className?: string };

export function CircleCheckIcon({ size = 18, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Lu>
  );
}

export function AccessibilityIcon({ size = 15, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <circle cx="16" cy="4" r="1" />
      <path d="m18 19 1-7-6 1" />
      <path d="m5 8 3-3 5.5 3-2.36 3.5" />
      <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
      <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
    </Lu>
  );
}

export function BellIcon({ size = 15, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Lu>
  );
}

export function BellRingIcon({ size = 16, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      <path d="M4 2C2.8 3.7 2 5.7 2 8" />
      <path d="M22 8c0-2.3-.8-4.3-2-6" />
    </Lu>
  );
}

export function GitMergeIcon({ size = 15, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </Lu>
  );
}

export function ScanLineIcon({ size = 18, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </Lu>
  );
}

export function InfoIcon({ size = 15, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </Lu>
  );
}

export function ArrowDownIcon({ size = 16, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </Lu>
  );
}

export function SparklesIcon({ size = 16, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </Lu>
  );
}

export function LightbulbIcon({ size = 15, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </Lu>
  );
}

export function TargetIcon({ size = 16, className }: IconProps) {
  return (
    <Lu size={size} className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Lu>
  );
}
