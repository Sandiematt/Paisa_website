"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";

import { chapters, logoMark, type ChapterId } from "@/lib/site";

type NavState = {
  chapter: ChapterId;
  theme: "dark" | "light";
  brand: "dim" | "full" | "hidden";
};

const initial: NavState = { chapter: "question", theme: "dark", brand: "dim" };

/**
 * Persistent story navigation (Wonder "Story Navigation"): brand, chapter
 * progress and a "Skip to the product" shortcut. It reads the active scene's
 * data-chapter / data-nav-theme / data-nav-brand attributes.
 */
export function StoryNav() {
  const [state, setState] = useState<NavState>(initial);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const read = (el: HTMLElement) =>
      setState({
        chapter: el.dataset.chapter as ChapterId,
        theme: el.dataset.navTheme === "light" ? "light" : "dark",
        brand: (el.dataset.navBrand as NavState["brand"]) ?? "full",
      });

    // Scenes may change their nav attributes while pinned (e.g. Chapter Four
    // turns light only once its paper covers the top of the viewport).
    const attributes = new MutationObserver((records) => read(records[0].target as HTMLElement));

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[data-chapter]"));
    // The active scene is the one under the nav bar: a thin band at the top of
    // the viewport. Pinned scenes overlap while one dissolves into the next, so
    // two can share the band; the later one is on top.
    const under = new Set<HTMLElement>();
    let active: HTMLElement | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) under.add(el);
          else under.delete(el);
        }
        const top = sections.findLast((s) => under.has(s));
        if (!top || top === active) return;
        active = top;
        read(top);
        attributes.disconnect();
        attributes.observe(top, { attributes: true, attributeFilter: ["data-nav-theme", "data-nav-brand"] });
      },
      { rootMargin: "0px 0px -96% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
      attributes.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    // A tap anywhere outside the bar or the chapter list closes it.
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const current = chapters.find((c) => c.id === state.chapter) ?? chapters[0];
  const light = state.theme === "light";
  const strong = light ? "text-ink" : "text-warm-white";
  const muted = light ? "text-ink-soft" : "text-text-dim";
  const outline = light ? "border-line-light" : "border-hairline-strong";

  return (
    <header ref={headerRef} className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Natural-scroll scenes scroll under the bar (pinned scenes are composed with room for it). */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-24 backdrop-blur-md transition-colors duration-500 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] cinema:hidden ${
          light ? "bg-paper/85" : "bg-void/80"
        }`}
      />
      <nav
        aria-label="Story"
        className="pointer-events-auto relative mx-auto flex h-16 items-center justify-between px-4 transition-colors duration-500 md:px-8 cinema:h-20 cinema:px-14"
      >
        <a
          href="#question"
          aria-label="Paisa — back to the beginning"
          className="-my-2 flex items-center gap-2.5 py-2 transition-opacity duration-700 ease-film"
          style={{
            opacity: state.brand === "hidden" ? 0 : state.brand === "dim" ? 0.6 : 1,
            pointerEvents: state.brand === "hidden" ? "none" : "auto",
          }}
        >
          <Image src={logoMark.src} alt="" width={28} height={28} className="h-7 w-7" priority data-bird-origin="" />
          <span
            className={`text-[17px] font-semibold tracking-[-0.3px] transition-colors duration-500 ${
              state.brand === "full" ? strong : muted
            }`}
          >
            Paisa
          </span>
        </a>

        <div className="hidden items-center gap-3 md:flex" aria-live="polite">
          <span className={`text-xs font-semibold tracking-[2px] ${muted}`}>{current.number}</span>
          <span
            aria-hidden
            className={`relative block h-0.5 w-40 overflow-hidden rounded-full ${light ? "bg-surface-strong" : "bg-hairline-strong"}`}
          >
            <motion.span
              className={`absolute inset-y-0 left-0 block w-full origin-left rounded-full ${light ? "bg-ink" : "bg-warm-white"}`}
              style={{ scaleX: scrollYProgress }}
            />
          </span>
          <span className={`text-xs font-medium uppercase tracking-[2px] ${muted}`}>{current.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#product"
            className={`flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-500 md:h-[38px] md:px-4 ${outline} ${strong}`}
          >
            <span className="hidden sm:inline">Skip to the product</span>
            <span className="sm:hidden">Skip to product</span>
            <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-full border cinema:hidden ${outline} ${strong}`}
            aria-expanded={menuOpen}
            aria-controls="story-chapters"
            aria-label={menuOpen ? "Close chapters" : "Open chapters"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="story-chapters"
            className="pointer-events-auto mx-4 max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain rounded-3xl border border-hairline-strong bg-charcoal/95 p-3 backdrop-blur-xl sm:ml-auto sm:w-80 md:mr-8 cinema:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <ol className="flex flex-col">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] ${
                      c.id === state.chapter ? "bg-hairline text-warm-white" : "text-text-dim"
                    }`}
                  >
                    <span className="w-6 text-xs font-semibold tracking-[1.5px] text-text-faint">{c.number}</span>
                    {c.name}
                  </a>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
