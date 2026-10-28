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

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */
function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-hairline pt-7 first:border-t-0 first:pt-0">
      <h3 className="flex items-baseline gap-3 text-lg font-semibold tracking-[-0.2px] text-warm-white">
        <span className="font-mono text-[13px] font-medium text-lavender">{number}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Steps({ children }: { children: ReactNode }) {
  return <ol className="flex flex-col gap-3 [counter-reset:step]">{children}</ol>;
}

function Step({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-10 text-[15px] leading-relaxed text-warm-white/85 [counter-increment:step] before:absolute before:left-0 before:top-0 before:flex before:size-7 before:items-center before:justify-center before:rounded-full before:border before:border-hairline-strong before:bg-charcoal-raised before:font-mono before:text-xs before:text-lavender before:content-[counter(step)]">
      {children}
    </li>
  );
}

/** A setting, button or screen name exactly as Android shows it. */
function Ui({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-warm-white">{children}</strong>;
}

function Path({ children }: { children: ReactNode }) {
  return <span className="font-medium text-warm-white">{children}</span>;
}

function Note({ tone = "lavender", title, children }: { tone?: "lavender" | "gold"; title: string; children: ReactNode }) {
  const tones = {
    lavender: "border-lavender/25 bg-haze-faint [&_h4]:text-lavender",
    gold: "border-gold/30 bg-gold/[0.06] [&_h4]:text-gold",
  };
  return (
    <div className={`flex flex-col gap-2 rounded-2xl border p-4 text-sm leading-relaxed text-warm-white/80 ${tones[tone]}`}>
      <h4 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.8px]">
        {tone === "gold" && <ShieldIcon className="size-4" />}
        {title}
      </h4>
      {children}
    </div>
  );
}

/** Collapsible per-brand paths, so the common case stays short. */
function Paths({ summary, rows }: { summary: string; rows: [brand: string, path: string][] }) {
  return (
    <details className="group rounded-2xl border border-hairline bg-charcoal/60">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-warm-white/90 [&::-webkit-details-marker]:hidden ${FOCUS}`}
      >
        {summary}
        <ChevronIcon className="size-4 shrink-0 text-text-dim transition-transform group-open:rotate-180" />
      </summary>
      <dl className="flex flex-col gap-3 border-t border-hairline px-4 py-4 text-sm leading-relaxed">
        {rows.map(([brand, path]) => (
          <div key={brand} className="flex flex-col gap-0.5">
            <dt className="text-text-dim">{brand}</dt>
            <dd className="text-warm-white/90">{path}</dd>
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
  ["Most phones (Android 8 and later)", "Settings → Apps → Special app access → Install unknown apps → your browser → Allow from this source"],
  ["Samsung (One UI)", "Settings → Apps → ⋮ (top right) → Special access → Install unknown apps → your browser → Allow"],
  ["Xiaomi, Redmi, POCO (MIUI / HyperOS)", "Settings → Apps → Manage apps → your browser → Install unknown apps → Allow from this source"],
  ["Any other phone", "Open Settings and search for “Install unknown apps”"],
];

const ACCESSIBILITY_PATHS: [string, string][] = [
  ["Google Pixel, Motorola, Nokia (Android 12 and later)", `Settings → Accessibility → under “Downloaded apps”, ${apk.serviceLabel}`],
  ["Samsung (One UI)", `Settings → Accessibility → Installed apps → ${apk.serviceLabel}`],
  ["Xiaomi, Redmi, POCO (MIUI / HyperOS)", `Settings → Additional settings → Accessibility → Downloaded apps → ${apk.serviceLabel}`],
  ["OnePlus, OPPO, realme", `Settings → Additional settings (or Accessibility & convenience) → Accessibility → Downloaded apps → ${apk.serviceLabel}`],
  ["vivo, iQOO", `Settings → Shortcuts & accessibility → Accessibility → Downloaded apps → ${apk.serviceLabel}`],
  ["Android 8 to 11", `Settings → Accessibility → ${apk.serviceLabel} (listed under “Downloaded services” or “Services”)`],
  ["Any other phone", "Open Settings and search for “Accessibility” or “Paisa”"],
];

function GuideBody() {
  return (
    <div className="flex flex-col gap-7">
      <Section number="01" title="Download the APK">
        <Steps>
          <Step>
            On your Android phone, tap <Ui>Download for Android</Ui> on this page. The file is{" "}
            <Ui>{apk.fileName}</Ui> ({apk.size}).
          </Step>
          <Step>
            If your browser asks whether to keep the file, tap <Ui>Download</Ui> or <Ui>Download anyway</Ui>. Browsers
            show this for every APK, not just Paisa.
          </Step>
          <Step>Wait for the download to finish. You’ll see it in your notifications and in the Files app under Downloads.</Step>
        </Steps>
        <p className="text-sm leading-relaxed text-text-dim">
          Downloaded on a computer? Copy the file to your phone over USB or a cloud drive, then open it from the
          Files app.
        </p>
      </Section>

      <Section number="02" title="Allow installs from your browser">
        <p className="text-[15px] leading-relaxed text-warm-white/85">
          Paisa isn’t on the Play Store yet, so Android asks you to approve the app you downloaded it with. This
          permission only applies to that one app.
        </p>
        <Steps>
          <Step>
            Tap the finished download to open it. If Android says your phone isn’t allowed to install unknown apps
            from this source, tap <Ui>Settings</Ui>.
          </Step>
          <Step>
            Turn on <Ui>Allow from this source</Ui> for your browser (for example Chrome).
          </Step>
          <Step>Press Back to return to the installer.</Step>
        </Steps>
        <Paths summary="Didn’t get the prompt? Find the setting by phone" rows={UNKNOWN_APPS_PATHS} />
      </Section>

      <Section number="03" title="Install Paisa">
        <Steps>
          <Step>
            On the install screen, tap <Ui>Install</Ui>.
          </Step>
          <Step>
            When it finishes, tap <Ui>Open</Ui>, or find Paisa in your app drawer.
          </Step>
          <Step>
            Optional, but tidy: go back to <Path>Install unknown apps</Path> and turn{" "}
            <Ui>Allow from this source</Ui> off again for your browser. Paisa stays installed.
          </Step>
        </Steps>
      </Section>

      <Section number="04" title="If Google Play Protect shows a warning">
        <p className="text-[15px] leading-relaxed text-warm-white/85">
          Play Protect checks apps installed from outside the Play Store. Because Paisa is new and not yet
          listed there, it may say it doesn’t recognise the app or its developer, or ask to scan it. This is
          expected for a new APK, but it’s still worth a moment of care.
        </p>
        <Note tone="gold" title="Before you continue">
          <p>Only go ahead if all of these are true:</p>
          <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-gold/70">
            <li>You downloaded the file yourself from this website, not from a link someone sent you.</li>
            <li>
              The file is named <Ui>{apk.fileName}</Ui> and is about {apk.size}.
            </li>
            <li>The installer shows the app name as Paisa.</li>
          </ul>
          <p>If anything looks different, cancel and delete the file.</p>
        </Note>
        <Steps>
          <Step>
            If Play Protect offers to <Ui>Scan app</Ui> or send it for scanning, you can let it. It checks the
            app and returns you to the installer.
          </Step>
          <Step>
            If it shows a warning, tap <Ui>More details</Ui> (or the small arrow) to read it.
          </Step>
          <Step>
            If you trust the file, tap <Ui>Install anyway</Ui>. Otherwise tap <Ui>Don’t install</Ui>.
          </Step>
        </Steps>
        <p className="text-sm leading-relaxed text-text-dim">
          Please don’t turn Play Protect off to install Paisa. It isn’t needed, and it keeps protecting the rest
          of your phone. If Play Protect blocks the app outright with no option to continue, leave it blocked
          {links.github ? (
            <>
              {" "}and let us know on{" "}
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
      </Section>

      <Section number="05" title="Turn on automatic tracking">
        <Note title="Why Paisa asks for Accessibility">
          <p>
            Paisa uses Android’s accessibility service to notice UPI payments as you make them, so you don’t have
            to log each one by hand. It reads the on-screen text of <Ui>Google Pay, PhonePe and Paytm only</Ui>{" "}
            to pick up the amount, payee and status.
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-lavender/70">
            <li>It doesn’t read any other app, the UPI PIN screen or password fields.</li>
            <li>What it reads stays on your phone.</li>
            <li>
              If you set a monthly budget, it can show a warning over the pay screen. Its only action is pressing
              Back when you tap Cancel on that warning.
            </li>
          </ul>
          <p>It’s optional. You can skip it and add expenses yourself, and turn it off at any time.</p>
        </Note>
        <Note tone="gold" title="Sensitive permission">
          <p>
            Accessibility access is powerful: an app with it can read what’s on your screen. Only grant it to apps
            you trust. Grant it to the Paisa app you installed from this website, and to no other app that asks
            for it, including anything that only looks like Paisa.
          </p>
        </Note>
        <p className="text-[15px] leading-relaxed text-warm-white/85">
          Because Paisa is installed from an APK rather than Google Play, Android blocks its Accessibility Service
          until you allow “restricted settings”. Follow these steps in order:
        </p>
        <Steps>
          <Step>
            Open <Path>Settings → Apps → Paisa</Path>.
          </Step>
          <Step>
            Tap the <Ui>⋮</Ui> three-dot menu in the top-right corner and select{" "}
            <Ui>Allow restricted settings</Ui>. Authenticate with your PIN, pattern or fingerprint if prompted.
          </Step>
          <Step>
            Return to Paisa and tap the option to enable its Accessibility Service.
          </Step>
          <Step>
            Go to <Path>Settings → Accessibility → Installed apps</Path> (some phones call it{" "}
            <Path>Downloaded apps</Path>; the label varies by device).
          </Step>
          <Step>
            Select <Ui>{apk.serviceLabel}</Ui>, turn on <Ui>Use {apk.serviceLabel}</Ui>, and tap{" "}
            <Ui>Allow</Ui> on the permission dialog.
          </Step>
        </Steps>
        <Note title="Can’t find “Allow restricted settings”?">
          <p>
            On some devices the service must first be enabled, or attempted, from Paisa. That’s what triggers the
            “Restricted setting” warning. Tap <Ui>OK</Ui> on it, then repeat steps 1 and 2: the option should now
            appear in the ⋮ menu.
          </p>
          <p>
            If the three-dot menu or the option is still missing, the exact path varies by Android version and
            manufacturer. Use the list below, or search Settings for “Allow restricted settings” or “Accessibility”.
            Android 12 and earlier don’t have this restriction, so you can skip to step 4.
          </p>
        </Note>
        <Paths summary="Can’t find it? Paths by phone brand" rows={ACCESSIBILITY_PATHS} />
        <p className="text-sm leading-relaxed text-text-dim">
          Once it’s on, open Paisa again. It shows when automatic tracking is active.
        </p>
      </Section>
    </div>
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
              How to install <span className="italic text-lavender">&amp; set up</span>
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
