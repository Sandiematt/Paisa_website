"use client";

import {
  motion,
  useTransform,
  type MotionValue,
} from "motion/react";

import { ScreenCrop } from "@/components/story/PhoneFrame";
import { Reveal } from "@/components/story/Text";
import { StoryScene, useSceneProgress } from "@/components/story/StoryScene";
import { Stage } from "@/components/story/Stage";

/* -------------------------------------------------------------------------- */
/*  Owner copy                                                                */
/* -------------------------------------------------------------------------- */
const PARAGRAPHS = [
  "Paisa started with a simple problem: I couldn’t tell where my money went each month. Tracking expenses manually felt tedious, and I wanted a clearer picture of my spending without having to log every transaction myself.",
  "From there, I designed the interface, built the backend, and experimented with AI-powered spending insights and Android-based UPI detection.",
  "The hardest part was making automatic transaction tracking reliable while avoiding duplicate entries and keeping user data private. Paisa became a way for me to explore how thoughtful design, automation, and AI could make managing money simpler.",
];

const BUILD_STEPS = ["Problem", "Exploration", "Interface", "Backend", "AI insights", "UPI detection"] as const;

/* -------------------------------------------------------------------------- */
/*  Code snippet (illustrative)                                               */
/* -------------------------------------------------------------------------- */
type Tone = "kw" | "fn" | "plain" | "comment";
type Token = { t: string; tone: Tone };
type CodeLine = { tokens: Token[]; indent?: boolean };

const TONE_CLASS: Record<Tone, string> = {
  kw: "text-lavender",
  fn: "text-mint",
  plain: "text-warm-white",
  comment: "text-text-faint",
};

const CODE_LINES: CodeLine[] = [
  { tokens: [{ t: "// illustrative snippet", tone: "comment" }] },
  {
    tokens: [
      { t: "data class", tone: "kw" },
      { t: " Txn(", tone: "plain" },
      { t: "val", tone: "kw" },
      { t: " amount: Long, ", tone: "plain" },
      { t: "val", tone: "kw" },
      { t: " ref: String?)", tone: "plain" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { t: "fun", tone: "kw" },
      { t: " ", tone: "plain" },
      { t: "isDuplicate", tone: "fn" },
      { t: "(new: Txn, recent: List<Txn>) =", tone: "plain" },
    ],
  },
  { tokens: [{ t: "new.ref != null && recent.any { it.ref == new.ref }", tone: "plain" }], indent: true },
];

const CODE_PLAIN_TEXT = CODE_LINES.map((l) => l.tokens.map((k) => k.t).join("")).join("\n");

/** Flat character offsets so every token knows where it starts in the whole snippet. */
const TOKEN_LAYOUT = (() => {
  let offset = 0;
  const lines = CODE_LINES.map((line) => {
    const tokens = line.tokens.map((token) => {
      const start = offset;
      offset += token.t.length;
      return { ...token, start };
    });
    offset += 1; // newline counts as a keystroke so lines type one after another
    return { indent: line.indent, tokens };
  });
  return { lines, total: offset };
})();

function TypedToken({
  progress,
  range,
  start,
  text,
  className,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  start: number;
  text: string;
  className: string;
}) {
  const shown = useTransform(progress, range, [0, TOKEN_LAYOUT.total], { clamp: true });
  const value = useTransform(shown, (count) => {
    const n = Math.max(0, Math.min(text.length, Math.floor(count) - start));
    return text.slice(0, n);
  });
  return <motion.span className={className}>{value}</motion.span>;
}

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */
function Headline({ className }: { className: string }) {
  return (
    <h2 className={`font-serif text-warm-white ${className}`}>
      I didn’t set out to build <em className="italic">an app.</em> I set out to understand my money.
    </h2>
  );
}

function Narrative({ textClass }: { textClass: string }) {
  return (
    <div className="flex flex-col gap-3.5">
      {PARAGRAPHS.map((text) => (
        <p key={text} className={`text-text-dim ${textClass}`}>
          {text}
        </p>
      ))}
    </div>
  );
}

function ChapterLabel() {
  return (
    <span className="w-fit text-xs font-semibold uppercase tracking-[3px] text-mint">Behind the idea</span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop                                                                   */
/* -------------------------------------------------------------------------- */
const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
} as const;

const TYPE_RANGE: [number, number] = [0.08, 0.52];
const STEP_FROM = 0.42;
const STEP_GAP = 0.055;

function BuildStep({ index, last }: { index: number; last: boolean }) {
  const { progress } = useSceneProgress();
  const at = STEP_FROM + index * STEP_GAP;
  const dot = useTransform(progress, [at - 0.025, at], ["rgba(255,255,255,0.15)", "#b9a7ff"]);
  const label = useTransform(progress, [at - 0.025, at], ["#9c97a8", "#f5f1ea"]);
  const fill = useTransform(progress, [at, at + STEP_GAP], [0, 1]);
  return (
    <li className="flex items-center">
      <motion.span aria-hidden className="block size-2 rounded-full" style={{ backgroundColor: dot }} />
      <motion.span className="py-0 pl-2.5 pr-[18px] text-[13px] font-medium" style={{ color: label }}>
        {BUILD_STEPS[index]}
      </motion.span>
      {!last && (
        <span aria-hidden className="mr-[18px] block h-px w-14 overflow-hidden bg-hairline-strong">
          <motion.span className="block h-px w-full origin-left bg-lavender" style={{ scaleX: fill }} />
        </span>
      )}
    </li>
  );
}

function DesktopScene() {
  const { progress } = useSceneProgress();

  const fade = useTransform(progress, [0, 0.15, 0.92, 1], [0, 1, 1, 0.4]);
  const narrativeY = useTransform(progress, [0, 1], [18, -14]);
  const editorY = useTransform(progress, [0, 1], [28, -28]);
  const sketchY = useTransform(progress, [0, 1], [64, -64]);
  const cropY = useTransform(progress, [0, 1], [110, -110]);
  const lampY = useTransform(progress, [0, 1], [30, -30]);
  const pathOpacity = useTransform(progress, [0.34, 0.42], [0.35, 1]);

  return (
    <>
      <div aria-hidden className="absolute inset-0" style={GRID_STYLE} />
      <Stage>
        <motion.div
          aria-hidden
          className="absolute left-[760px] top-[-120px] size-[700px] rounded-full bg-haze-faint blur-[140px] [contain:layout]"
          style={{ y: lampY, willChange: "transform" }}
        />

        <motion.div style={{ opacity: fade }} className="absolute inset-0">
          {/* Narrative */}
          <motion.div
            className="absolute left-[120px] top-[150px] flex w-[520px] flex-col gap-6"
            style={{ y: narrativeY, willChange: "transform" }}
          >
            <ChapterLabel />
            <Headline className="text-[56px] leading-[1.05] tracking-[-1px]" />
            <Narrative textClass="text-[17px] leading-[1.65]" />
          </motion.div>

          {/* Editor window */}
          <motion.div className="absolute left-[760px] top-[150px] w-[560px]" style={{ y: editorY, willChange: "transform" }}>
            <div className="-rotate-[1.5deg] overflow-hidden rounded-[18px] border border-hairline-strong bg-void shadow-[0px_40px_90px_rgba(0,0,0,0.55)]">
              <div className="flex h-10 items-center gap-2 border-b border-hairline px-4">
                <span aria-hidden className="block size-2.5 rounded-full bg-coral" />
                <span aria-hidden className="block size-2.5 rounded-full bg-gold" />
                <span aria-hidden className="block size-2.5 rounded-full bg-mint" />
                <span className="pl-3 font-mono text-xs text-text-dim">DuplicateCheck.kt</span>
              </div>
              <pre className="m-0 p-5 font-mono text-[13px]" aria-label="DuplicateCheck.kt, illustrative Kotlin snippet">
                <span className="sr-only">{CODE_PLAIN_TEXT}</span>
                <span aria-hidden className="flex flex-col gap-1.5">
                  {TOKEN_LAYOUT.lines.map((line, i) => (
                    <span key={i} className={`block h-[17px] whitespace-pre leading-[17px] ${line.indent ? "pl-6" : ""}`}>
                      {line.tokens.map((token, j) => (
                        <TypedToken
                          key={j}
                          progress={progress}
                          range={TYPE_RANGE}
                          start={token.start}
                          text={token.t}
                          className={TONE_CLASS[token.tone]}
                        />
                      ))}
                    </span>
                  ))}
                </span>
              </pre>
            </div>
          </motion.div>

          {/* Wireframe sketch */}
          <motion.div className="absolute left-[820px] top-[420px] w-[220px]" style={{ y: sketchY, willChange: "transform" }}>
            <div className="flex rotate-3 flex-col gap-2.5 rounded-2xl border border-dashed border-hairline-strong bg-charcoal-raised p-4">
              <span className="w-fit font-mono text-[11px] uppercase tracking-[1.5px] text-text-dim">
                home · early sketch
              </span>
              <div aria-hidden className="h-[54px] w-full rounded-[10px] border border-hairline-strong" />
              <div aria-hidden className="grid grid-cols-3 gap-1.5">
                <div className="h-[30px] rounded-lg border border-hairline-strong" />
                <div className="h-[30px] rounded-lg border border-hairline-strong" />
                <div className="h-[30px] rounded-lg border border-hairline-strong" />
              </div>
              <div aria-hidden className="h-1.5 w-[80%] rounded-full bg-hairline-strong" />
              <div aria-hidden className="h-1.5 w-[55%] rounded-full bg-hairline-strong" />
            </div>
          </motion.div>

          {/* Real UI detail: budget card from the home screen */}
          <motion.div className="absolute left-[1080px] top-[440px]" style={{ y: cropY, willChange: "transform" }}>
            <ScreenCrop
              screen="home"
              scale={390}
              x={16}
              y={740}
              width={240}
              height={150}
              radius={18}
              className="-rotate-[4deg] border border-hairline-strong"
            />
          </motion.div>
        </motion.div>

        {/* Build path */}
        <motion.ol
          aria-label="How Paisa was built"
          className="absolute bottom-[72px] left-[120px] m-0 flex list-none items-center p-0"
          style={{ opacity: pathOpacity }}
        >
          {BUILD_STEPS.map((step, i) => (
            <BuildStep key={step} index={i} last={i === BUILD_STEPS.length - 1} />
          ))}
        </motion.ol>
      </Stage>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile                                                                    */
/* -------------------------------------------------------------------------- */
function MobileScene() {
  return (
    <div className="relative overflow-hidden bg-charcoal px-6 py-20">
      <div aria-hidden className="absolute inset-0" style={GRID_STYLE} />
      <div
        aria-hidden
        className="absolute left-[30%] top-[-120px] size-[420px] rounded-full bg-haze-faint blur-[100px]"
      />
      <div className="relative mx-auto flex max-w-[420px] flex-col gap-10">
        <div className="flex flex-col gap-5">
          <Reveal>
            <ChapterLabel />
          </Reveal>
          <Reveal delay={0.05}>
            <Headline className="text-[38px] leading-[1.06] tracking-[-0.5px]" />
          </Reveal>
          <Reveal delay={0.1}>
            <Narrative textClass="text-base leading-[1.65]" />
          </Reveal>
        </div>

        <Reveal>
          <div className="overflow-hidden rounded-[18px] border border-hairline-strong bg-void shadow-[0px_30px_70px_rgba(0,0,0,0.5)]">
            <div className="flex h-10 items-center gap-2 border-b border-hairline px-4">
              <span aria-hidden className="block size-2.5 rounded-full bg-coral" />
              <span aria-hidden className="block size-2.5 rounded-full bg-gold" />
              <span aria-hidden className="block size-2.5 rounded-full bg-mint" />
              <span className="pl-3 font-mono text-xs text-text-dim">DuplicateCheck.kt</span>
            </div>
            <pre className="m-0 flex flex-col gap-1.5 p-4 font-mono text-[12px] leading-[17px]" aria-label="DuplicateCheck.kt, illustrative Kotlin snippet">
              <span className="sr-only">{CODE_PLAIN_TEXT}</span>
              {CODE_LINES.map((line, i) => (
                <span
                  key={i}
                  aria-hidden
                  className={`block min-h-[17px] whitespace-pre-wrap break-words ${line.indent ? "pl-4" : ""}`}
                >
                  {line.tokens.map((token, j) => (
                    <span key={j} className={TONE_CLASS[token.tone]}>
                      {token.t}
                    </span>
                  ))}
                </span>
              ))}
            </pre>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex flex-col items-start gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-text-dim">
              From the home screen
            </span>
            <ScreenCrop
              screen="home"
              scale={390}
              x={16}
              y={740}
              width={240}
              height={150}
              radius={18}
              className="border border-hairline-strong"
            />
          </div>
        </Reveal>

        <Reveal>
          <ol aria-label="How Paisa was built" className="m-0 flex list-none flex-col p-0">
            {BUILD_STEPS.map((step, i) => (
              <li key={step} className="flex items-stretch gap-3">
                <span aria-hidden className="flex w-2 flex-col items-center">
                  <span className="mt-[7px] block size-2 shrink-0 rounded-full bg-lavender" />
                  {i < BUILD_STEPS.length - 1 && <span className="block w-px flex-1 bg-lavender/40" />}
                </span>
                <span className="pb-5 text-[14px] font-medium text-warm-white">{step}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 11 — Behind the idea                                                */
/* -------------------------------------------------------------------------- */
export function SceneBehind() {
  return (
    <StoryScene
      id="behind-the-idea"
      chapter="behind-the-idea"
      label="Behind the idea"
      length={1.6}
      rest={0.8}
      className="bg-charcoal"
      mobile={<MobileScene />}
    >
      <DesktopScene />
    </StoryScene>
  );
}
