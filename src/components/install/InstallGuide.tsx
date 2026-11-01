"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { apk, links } from "@/lib/site";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lavender";

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */
function Step({
  number,
  title,
  tag,
  children,
}: {
  number: string;
  title: string;
  tag?: string;
  children: ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3.5 rounded-[22px] border border-hairline bg-charcoal-raised/60 p-5">
      <h3 className="flex items-center gap-3 text-[17px] font-semibold tracking-[-0.2px] text-warm-white">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-haze font-mono text-xs text-lavender">
          {number}
        </span>
        {title}
        {tag && (
          <span className="rounded-full border border-hairline-strong px-2 py-0.5 text-[11px] font-medium text-text-dim">
            {tag}
          </span>
        )}
      </h3>
      {children}
    </li>
  );
}

function Line({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-warm-white/80">{children}</p>;
}

/** A setting, button or screen name exactly as Android shows it. */
function Ui({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-warm-white">{children}</strong>;
}

/** Where to tap, as a row of chips: Settings › Apps › Paisa. */
function TapPath({ steps }: { steps: string[] }) {
  return (
    <ol aria-label="Where to tap" className="flex flex-wrap items-center gap-1.5">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="text-text-faint">
              ›
            </span>
          )}
          <span className="rounded-lg border border-hairline-strong bg-void px-2.5 py-1 text-[13px] font-medium text-warm-white">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Box({ tone = "lavender", title, children }: { tone?: "lavender" | "gold"; title: string; children: ReactNode }) {
  const tones = {
    lavender: "border-lavender/25 bg-haze-faint [&_h4]:text-lavender",
    gold: "border-gold/30 bg-gold/[0.06] [&_h4]:text-gold",
  };
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border p-4 text-sm leading-relaxed text-warm-white/80 ${tones[tone]}`}>
      <h4 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.8px]">
        {tone === "gold" && <ShieldIcon className="size-4" />}
        {title}
      </h4>
      {children}
    </div>
  );
}

/** Short facts as ticked tiles instead of a bullet paragraph. */
function Checks({ items, tone }: { items: ReactNode[]; tone: "gold" | "mint" }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 rounded-xl bg-void/60 px-3 py-2.5 text-[13px] leading-snug text-warm-white/90"
        >
          <CheckIcon className={`mt-px size-3.5 shrink-0 ${tone === "gold" ? "text-gold" : "text-mint"}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Collapsible extra help, so the common case stays short. */
function Paths({ summary, rows }: { summary: string; rows: [label: string, text: string][] }) {
  return (
    <details className="group rounded-2xl border border-hairline bg-charcoal/60">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-text-dim [&::-webkit-details-marker]:hidden ${FOCUS}`}
      >
        {summary}
        <ChevronIcon className="size-4 shrink-0 text-text-dim transition-transform group-open:rotate-180" />
      </summary>
      <dl className="flex flex-col gap-3 border-t border-hairline px-4 py-4 text-sm leading-relaxed">
        {rows.map(([label, text]) => (
          <div key={label} className="flex flex-col gap-0.5">
            <dt className="text-text-dim">{label}</dt>
            <dd className="text-warm-white/90">{text}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */
const UNKNOWN_APPS_PATHS: [string, string][] = [
  ["Most phones", "Settings → Apps → Special app access → Install unknown apps → your browser → Allow"],
  ["Samsung", "Settings → Apps → ⋮ → Special access → Install unknown apps → your browser → Allow"],
  ["Xiaomi, Redmi, POCO", "Settings → Apps → Manage apps → your browser → Install unknown apps → Allow"],
  ["Any other phone", "Search Settings for “Install unknown apps”"],
];

const RESTRICTED_HELP: [string, string][] = [
  ["Try this first", "Turn the service on from inside Paisa, tap OK on the “Restricted setting” warning, then repeat step A."],
  ["Android 12 or older", "There’s no restriction. Go straight to step B."],
];

const ACCESSIBILITY_PATHS: [string, string][] = [
  ["Pixel, Motorola, Nokia", `Settings → Accessibility → Downloaded apps → ${apk.serviceLabel}`],
  ["Samsung", `Settings → Accessibility → Installed apps → ${apk.serviceLabel}`],
  ["Xiaomi, Redmi, POCO", `Settings → Additional settings → Accessibility → Downloaded apps → ${apk.serviceLabel}`],
  ["OnePlus, OPPO, realme", `Settings → Additional settings → Accessibility → Downloaded apps → ${apk.serviceLabel}`],
  ["vivo, iQOO", `Settings → Shortcuts & accessibility → Accessibility → Downloaded apps → ${apk.serviceLabel}`],
  ["Android 8 to 11", `Settings → Accessibility → ${apk.serviceLabel}`],
  ["Any other phone", "Search Settings for “Accessibility” or “Paisa”"],
];

function GuideBody() {
  return (
    <ol className="flex flex-col gap-4">
      <Step number="1" title="Download">
        <Line>
          Tap <Ui>Download for Android</Ui>. If your browser warns you, tap <Ui>Download anyway</Ui>. It does this for
          every APK.
        </Line>
      </Step>

      <Step number="2" title="Allow your browser">
        <Line>Open the file. When Android asks, allow installs from your browser.</Line>
        <TapPath steps={["Settings", "Allow from this source", "Back"]} />
        <Paths summary="Didn’t get asked? Find it by phone" rows={UNKNOWN_APPS_PATHS} />
      </Step>

      <Step number="3" title="Install">
        <TapPath steps={["Install", "Open"]} />
        <Box tone="gold" title="Play Protect warning?">
          <p>Normal for apps outside the Play Store. Continue only if:</p>
          <Checks
            tone="gold"
            items={[
              "You downloaded it from this site",
              `It’s ${apk.fileName}, about ${apk.size}`,
              "The installer says Paisa",
            ]}
          />
          <TapPath steps={["More details", "Install anyway"]} />
          <p className="text-text-dim">
            Don’t turn Play Protect off. Blocked completely? Leave it blocked
            {links.github ? (
              <>
                {" "}and tell us on{" "}
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-lavender underline decoration-lavender/40 underline-offset-4 ${FOCUS}`}
                >
                  GitHub
                </a>
              </>
            ) : null}
            .
          </p>
        </Box>
      </Step>

      <Step number="4" title="Turn on auto-tracking" tag="Optional">
        <Line>Lets Paisa log your UPI payments for you. Skip it and add expenses yourself.</Line>
        <Box title="What it does">
          <Checks
            tone="mint"
            items={[
              "Only Google Pay, PhonePe & Paytm",
              "Never your UPI PIN or passwords",
              "Everything stays on your phone",
              "Only taps Back if you cancel a budget warning",
            ]}
          />
        </Box>
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-text-dim">A · Allow restricted settings</p>
          <TapPath steps={["Settings", "Apps", "Paisa", "⋮", "Allow restricted settings"]} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-text-dim">B · Switch it on</p>
          <TapPath steps={["Settings", "Accessibility", "Downloaded apps", apk.serviceLabel, "On"]} />
        </div>
        <Box tone="gold" title="Only for Paisa">
          <p>This access can read your screen. Give it only to the Paisa you installed from this site.</p>
        </Box>
        <Paths summary="No “Allow restricted settings”?" rows={RESTRICTED_HELP} />
        <Paths summary="Can’t find it? Paths by phone brand" rows={ACCESSIBILITY_PATHS} />
      </Step>
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal                                                                     */
/* -------------------------------------------------------------------------- */
/**
 * Step-by-step install guide in a native modal `<dialog>`: it renders in the
 * top layer (above the scaled stage and the bird), traps focus, and closes on
 * Escape, the close buttons or a click on the backdrop.
 */
export function InstallGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-warm-white backdrop:bg-scrim backdrop:backdrop-blur-sm sm:m-auto sm:h-[min(860px,calc(100dvh-48px))] sm:w-[min(680px,calc(100vw-48px))] sm:rounded-[28px]"
    >
      <div className="flex h-full flex-col overflow-hidden border-hairline-strong bg-charcoal shadow-[0px_40px_120px_rgba(0,0,0,0.6)] sm:rounded-[28px] sm:border">
        <header className="flex items-start justify-between gap-4 border-b border-hairline px-6 pb-5 pt-[max(20px,env(safe-area-inset-top))] sm:px-8 sm:pt-7">
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-[11px] uppercase tracking-[1.6px] text-mint">
              Android {apk.minAndroid}+ · {apk.size}
            </p>
            <h2 id={titleId} className="font-serif text-[32px] leading-[1.05] tracking-[-0.5px] sm:text-[38px]">
              Install <span className="italic text-lavender">in 4 steps</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close install guide"
            className={`-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-text-dim transition-colors hover:bg-hairline hover:text-warm-white ${FOCUS}`}
          >
            <CloseIcon className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-7 sm:px-8">
          <GuideBody />
        </div>

        <footer className="flex flex-col-reverse gap-2.5 border-t border-hairline px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:pb-5">
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-12 items-center justify-center rounded-full border border-hairline-strong px-6 text-[15px] font-semibold text-warm-white ${FOCUS}`}
          >
            Close
          </button>
          {links.download && (
            <a
              href={links.download}
              download={apk.fileName}
              className={`inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-violet)_0%,var(--color-violet-deep)_100%)] px-6 text-[15px] font-semibold text-warm-white shadow-[0px_10px_28px_var(--color-violet-glow)] ${FOCUS}`}
            >
              Download {apk.fileName}
            </a>
          )}
        </footer>
      </div>
    </dialog>
  );
}
