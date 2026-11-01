/**
 * Real destinations for every outbound link. Leave a value as `null` until it
 * exists: components hide the matching button instead of rendering a dead link.
 */
export const links = {
  github: "https://github.com/Sandiematt/Paisa" as string | null,
  // Always the newest GitHub release's `Paisa.apk`; ship a new version by publishing a release.
  download: "https://github.com/Sandiematt/Paisa/releases/latest/download/Paisa.apk" as string | null,
  privacy: null as string | null,
  terms: null as string | null,
  support: null as string | null,
  portfolio: "https://sandiematt.com" as string | null,
  // Full auto-tracking (Accessibility) setup, per phone brand.
  setup: "https://paisa-setup.sandiematt.com" as string | null,
};

/**
 * The Android build attached to the latest GitHub release. Read from the APK itself
 * (minSdk 26, accessibility service label); update when the file is replaced.
 */
export const apk = {
  fileName: "Paisa.apk",
  size: "21 MB",
  minAndroid: "8.0",
  version: "1.0.1 (beta)",
  /** Label Android shows for the accessibility service in Settings. */
  serviceLabel: "Paisa auto-tracking",
};

/** Real Paisa app screens (exported from the Wonder "Paisa app ui" file, 390px wide). */
export const screens = {
  home: { src: "/app/home.png", width: 390, height: 1113, alt: "Paisa home screen with available balance, quick actions and budget progress" },
  insights: { src: "/app/insights.png", width: 390, height: 1221, alt: "Paisa insights screen with monthly spending, weekly bars and categories" },
  profile: { src: "/app/profile.png", width: 390, height: 978, alt: "Paisa profile and settings screen" },
} as const;

export type ScreenName = keyof typeof screens;

export const logoMark = { src: "/brand/paisa-mark.png", width: 512, height: 512 };

/** Chapter list shared by the nav progress indicator and the scenes. */
export const chapters = [
  { id: "question", number: "01", name: "The question" },
  { id: "problem", number: "02", name: "The problem" },
  { id: "idea", number: "03", name: "The idea" },
  { id: "product", number: "04", name: "The product" },
  { id: "know-your-money", number: "05", name: "Know your money" },
  { id: "smarter-tracking", number: "06", name: "Smarter tracking" },
  { id: "insights", number: "07", name: "Insights" },
  { id: "better-habits", number: "08", name: "Better habits" },
  { id: "behind-the-idea", number: "09", name: "Behind the idea" },
  { id: "story-continues", number: "10", name: "The story continues" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
