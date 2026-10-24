import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://paisa.app"),
  title: "Paisa — Your money. Your clarity.",
  description:
    "Paisa is an Android expense tracker that brings your balance, income and spending into one clear picture, picks up supported UPI payments, and turns your numbers into plain-language insights.",
  openGraph: {
    title: "Paisa — Your money. Your clarity.",
    description:
      "The story of how a simple question became Paisa, an expense tracker designed to make everyday finances easier to understand.",
    images: [{ url: "/brand/paisa-logo-full.png", width: 820, height: 850, alt: "Paisa" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paisa — Your money. Your clarity.",
    images: ["/brand/paisa-logo-full.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07060b",
  colorScheme: "dark",
};

/**
 * Sets the desktop stage scale before first paint so the 1440×900 Wonder frames
 * never render at the wrong size, and marks the splash as active. The height is
 * the small viewport (100svh): innerHeight at load, then a probe on resize, as
 * innerHeight changes while a touch browser's toolbar collapses and would
 * rescale the stage mid-scroll.
 */
const bootScript = `(function(){var d=document.documentElement,p,w=-1,h=-1;function vh(){var b=document.body;if(!b)return innerHeight;if(!p){p=document.createElement('div');p.setAttribute('aria-hidden','true');p.style.cssText='position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none';b.appendChild(p)}return p.offsetHeight||innerHeight}function s(){var nw=innerWidth,nh=vh();if(nw===w&&nh===h)return;w=nw;h=nh;d.style.setProperty('--stage-scale',String(Math.min(nw/1440,nh/900,1.35)))}s();addEventListener('resize',s,{passive:true});d.classList.add('splash-active');})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`#paisa-splash{display:none!important}html.splash-active,html.splash-active body{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
