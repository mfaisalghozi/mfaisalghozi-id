"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, MotionValue } from "motion/react";

// ─── Pixel art config ───────────────────────────────────────────────────────
// Each sprite "pixel" = P×P CSS pixels → gives the chunky pixel-art look
const P = 4;

// Dog: 16 sprite-pixels wide × 14 tall  →  64×56 px rendered
const DOG_W = 16 * P; // 64
const DOG_H = 14 * P; // 56

// Cat: 12 sprite-pixels wide × 13 tall  →  48×52 px rendered
const CAT_W = 12 * P; // 48
const CAT_H = 13 * P; // 52

const CONTAINER_HEIGHT = Math.max(DOG_H, CAT_H) + 10;
const PET_WIDTH = DOG_W; // use the wider of the two for boundary math
const MARGIN = 8;
const TICK_MS = 16;
const WALK_SPEED = 0.4;  // px per tick → ~24 px/s
const CHASE_SPEED = 0.85;
const WALK_FRAME_MS = 220; // ms per walk animation frame

// ─── Types ───────────────────────────────────────────────────────────────────
type PetState = "walk" | "idle" | "sit" | "eat" | "chase" | "play" | "sleep";
type Direction = 1 | -1;

interface PetVisual {
  state: PetState;
  direction: Direction;
  showFood: boolean;
  walkFrame: 0 | 1;
}

interface PetRef {
  x: number;
  direction: Direction;
  state: PetState;
  stateTimeoutId: ReturnType<typeof setTimeout> | null;
  moveIntervalId: ReturnType<typeof setInterval> | null;
  walkFrameIntervalId: ReturnType<typeof setInterval> | null;
  pausedForTurn: boolean;
}

// ─── State machine ────────────────────────────────────────────────────────────
function getStateDuration(state: PetState): number {
  const ranges: Record<PetState, [number, number]> = {
    walk: [2000, 5000], idle: [1500, 4000], sit: [2000, 6000],
    eat: [3000, 6000], chase: [2000, 4000], play: [2000, 5000], sleep: [5000, 12000],
  };
  const [min, max] = ranges[state];
  return min + Math.random() * (max - min);
}

function pickNextState(current: PetState, dist: number): PetState {
  const r = Math.random();
  if (current === "walk") {
    if (r < 0.35) return "walk";
    if (r < 0.60) return "idle";
    if (r < 0.75) return "sit";
    if (r < 0.85) return "eat";
    if (r < 0.95 && dist > 80) return "chase";
    return "sleep";
  }
  if (current === "idle") {
    if (r < 0.50) return "walk";
    if (r < 0.75) return "sit";
    if (r < 0.90) return "eat";
    return dist > 80 ? "chase" : "walk";
  }
  if (current === "sit") {
    if (r < 0.50) return "walk";
    if (r < 0.70) return "idle";
    if (r < 0.85) return "eat";
    if (r < 0.95) return "sleep";
    return dist > 80 ? "chase" : "walk";
  }
  if (current === "eat") {
    if (r < 0.40) return "walk";
    if (r < 0.70) return "idle";
    if (r < 0.90) return "sit";
    return "sleep";
  }
  if (current === "chase") {
    if (dist < 60) return "play";
    return r < 0.60 ? "walk" : "idle";
  }
  if (current === "play") {
    if (r < 0.40) return "idle";
    if (r < 0.70) return "walk";
    if (r < 0.90) return "sit";
    return "eat";
  }
  // sleep
  return r < 0.60 ? "idle" : "sit";
}

// ─── Pixel sprite renderer ────────────────────────────────────────────────────
// Each row is a string; each character maps to a color (or transparent if absent in palette).
function renderPixels(
  rows: readonly string[],
  palette: Record<string, string>,
): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const fill = palette[row[c]];
      if (fill)
        out.push(
          <rect
            key={`${r}-${c}`}
            x={c * P}
            y={r * P}
            width={P}
            height={P}
            fill={fill}
          />,
        );
    }
  });
  return out;
}

// ─── DOG sprite data  (16 chars wide × 14 rows tall) ────────────────────────
// Palette:  O=orange  D=dark-orange  W=cream  K=black  P=pink
const D: Record<string, string> = {
  O: "#E8913A",
  D: "#C4611A",
  W: "#FFF4D4",
  K: "#1C0800",
  P: "#F0A0A0",
};

// Rows 0-11 are shared between all poses
const DOG_BODY: readonly string[] = [
  "...OKO...OKO....", // 0  ears
  "..OOOO...OOOOO..", // 1  ear-to-head
  "..ODDDDDDDDDDOO.", // 2  forehead
  "..ODWWWWWWWWDOO.", // 3  face
  "..ODWWKWWKWWDOO.", // 4  eyes
  "..ODWWWPWWWWDOO.", // 5  nose
  "..ODDDDDDDDDDOO.", // 6  chin
  "..OOOOOOOOOOOO..", // 7  neck
  ".OWWOOOOOOOOOWW.", // 8  chest
  ".OWWOOOOOOOOOWW.", // 9  body
  "..OOOOOOOOOOOO..", // 10 lower body
  "..OOOOOOOOOOOO..", // 11 hip
];

// Leg rows vary between walk frames
const DOG_LEGS: readonly [readonly string[], readonly string[]] = [
  // frame 0 – neutral stance
  ["..ODOO....ODOO..", "..OKOO....OKOO.."],
  // frame 1 – step (legs shift outward by 1 px)
  ["...ODOO..ODOO...", "...OKOO..OKOO..."],
];

function getDogFrame(walkFrame: 0 | 1, state: PetState): readonly string[] {
  const isWalking = state === "walk" || state === "chase";
  return [...DOG_BODY, ...DOG_LEGS[isWalking ? walkFrame : 0]];
}

// ─── CAT sprite data  (12 chars wide × 13 rows tall) ─────────────────────────
// Palette:  W=white  O=orange-patch  B=black  E=blue-eye  N=pink-nose  P=pink-cheek
const C: Record<string, string> = {
  W: "#FFFFFF",
  O: "#C8682A",
  B: "#1A1208",
  E: "#5AA8D8",
  N: "#E07878",
  P: "#F5BCBC",
};

// Rows 0-10 shared
const CAT_BODY: readonly string[] = [
  "...BW..WB...", // 0  ear tips
  "..BBW..WBB..", // 1  ears
  ".BWWWWWWWWB.", // 2  head top
  "BWWBOOBWWEWB", // 3  face: black+orange patch left, blue eye right
  "BWWBOOBBWWWB", // 4  face lower
  "BWWWWWNWPWWB", // 5  nose + pink cheek
  ".BWWWWWWWWB.", // 6  chin
  "..BWWWWWWB..", // 7  neck
  "..BOOBBWWB..", // 8  body patches
  "..BWOOBBWB..", // 9  body
  "..BBBBBBBBB.", // 10 lower body
];

// Paw rows vary between walk frames
const CAT_PAWS: readonly [readonly string[], readonly string[]] = [
  // frame 0 – together
  ["..BWWBBWWB..", "...BBBBBB..."],
  // frame 1 – apart
  [".BWWWBBWWWB.", "..BBBBBBBB.."],
];

function getCatFrame(walkFrame: 0 | 1, state: PetState): readonly string[] {
  const isWalking = state === "walk" || state === "chase";
  return [...CAT_BODY, ...CAT_PAWS[isWalking ? walkFrame : 0]];
}

// ─── Overlays ─────────────────────────────────────────────────────────────────
function ZzzOverlay() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ bottom: "100%", left: "50%" }}
      aria-hidden="true"
    >
      {(["z", "z", "Z"] as const).map((letter, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-slate-400 select-none"
          style={{ fontSize: 7 + i * 2, left: i * 7, bottom: i * 6 }}
          animate={{ y: [0, -(10 + i * 4)], opacity: [0.8, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.45,
            ease: "easeOut",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

function FoodOverlay({ type }: { type: "bone" | "fish" }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ bottom: "60%", left: "110%", fontSize: 16 }}
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.3, 1] }}
      transition={{ duration: 0.3 }}
      aria-hidden="true"
    >
      {type === "bone" ? "🦴" : "🐟"}
    </motion.div>
  );
}

// ─── Sprite wrappers ──────────────────────────────────────────────────────────
function DogSprite({ visual }: { visual: PetVisual }) {
  const isWalking = visual.state === "walk" || visual.state === "chase";
  const isPlaying = visual.state === "play";
  const frame = getDogFrame(visual.walkFrame, visual.state);
  // Flip direction by mirroring the SVG's inner group
  const flip =
    visual.direction === -1
      ? `scale(-1 1) translate(-${DOG_W} 0)`
      : undefined;

  return (
    <div className="relative">
      {visual.state === "sleep" && <ZzzOverlay />}
      {visual.showFood && <FoodOverlay type="bone" />}
      <motion.div
        animate={
          isPlaying
            ? { y: [0, -8, 0] }
            : isWalking
            ? { y: [0, -P, 0] }
            : { y: 0 }
        }
        transition={
          isPlaying
            ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
            : isWalking
            ? {
                duration: (WALK_FRAME_MS * 2) / 1000,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
      >
        <svg
          width={DOG_W}
          height={DOG_H}
          viewBox={`0 0 ${DOG_W} ${DOG_H}`}
          shapeRendering="crispEdges"
        >
          <g transform={flip}>{renderPixels(frame, D)}</g>
        </svg>
      </motion.div>
    </div>
  );
}

function CatSprite({ visual }: { visual: PetVisual }) {
  const isWalking = visual.state === "walk" || visual.state === "chase";
  const isPlaying = visual.state === "play";
  const frame = getCatFrame(visual.walkFrame, visual.state);
  const flip =
    visual.direction === -1
      ? `scale(-1 1) translate(-${CAT_W} 0)`
      : undefined;

  return (
    <div className="relative">
      {visual.state === "sleep" && <ZzzOverlay />}
      {visual.showFood && <FoodOverlay type="fish" />}
      <motion.div
        animate={
          isPlaying
            ? { y: [0, -10, 0] }
            : isWalking
            ? { y: [0, -P, 0] }
            : { y: 0 }
        }
        transition={
          isPlaying
            ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
            : isWalking
            ? {
                duration: (WALK_FRAME_MS * 2) / 1000,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
      >
        <svg
          width={CAT_W}
          height={CAT_H}
          viewBox={`0 0 ${CAT_W} ${CAT_H}`}
          shapeRendering="crispEdges"
        >
          <g transform={flip}>{renderPixels(frame, C)}</g>
        </svg>
      </motion.div>
    </div>
  );
}

// ─── Movement & behaviour ────────────────────────────────────────────────────
export function FooterPets() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(600);

  const [dogVisual, setDogVisual] = useState<PetVisual>({
    state: "idle",
    direction: 1,
    showFood: false,
    walkFrame: 0,
  });
  const [catVisual, setCatVisual] = useState<PetVisual>({
    state: "idle",
    direction: -1,
    showFood: false,
    walkFrame: 0,
  });

  const dogX = useMotionValue(80);
  const catX = useMotionValue(400);

  const dogRef = useRef<PetRef>({
    x: 80, direction: 1, state: "idle",
    stateTimeoutId: null, moveIntervalId: null, walkFrameIntervalId: null,
    pausedForTurn: false,
  });
  const catRef = useRef<PetRef>({
    x: 400, direction: -1, state: "idle",
    stateTimeoutId: null, moveIntervalId: null, walkFrameIntervalId: null,
    pausedForTurn: false,
  });

  const clearPetTimers = useCallback((ref: React.MutableRefObject<PetRef>) => {
    if (ref.current.stateTimeoutId) clearTimeout(ref.current.stateTimeoutId);
    if (ref.current.moveIntervalId) clearInterval(ref.current.moveIntervalId);
    if (ref.current.walkFrameIntervalId)
      clearInterval(ref.current.walkFrameIntervalId);
    ref.current.stateTimeoutId = null;
    ref.current.moveIntervalId = null;
    ref.current.walkFrameIntervalId = null;
  }, []);

  const startMoveLoop = useCallback(
    (
      ref: React.MutableRefObject<PetRef>,
      otherRef: React.MutableRefObject<PetRef>,
      motionX: MotionValue<number>,
      setVisual: React.Dispatch<React.SetStateAction<PetVisual>>,
    ) => {
      if (ref.current.moveIntervalId) clearInterval(ref.current.moveIntervalId);
      ref.current.moveIntervalId = setInterval(() => {
        if (ref.current.pausedForTurn) return;
        const { x, direction, state } = ref.current;
        const speed = state === "chase" ? CHASE_SPEED : WALK_SPEED;

        let targetX: number;
        if (state === "chase") {
          const dist = otherRef.current.x - x;
          targetX = x + Math.sign(dist) * speed;
        } else {
          targetX = x + direction * speed;
        }

        const maxX = containerWidth.current - PET_WIDTH - MARGIN;
        if (targetX <= MARGIN) {
          targetX = MARGIN;
          ref.current.direction = 1;
          ref.current.pausedForTurn = true;
          setVisual((v) => ({ ...v, direction: 1 }));
          setTimeout(() => { ref.current.pausedForTurn = false; }, 350);
        } else if (targetX >= maxX) {
          targetX = maxX;
          ref.current.direction = -1;
          ref.current.pausedForTurn = true;
          setVisual((v) => ({ ...v, direction: -1 }));
          setTimeout(() => { ref.current.pausedForTurn = false; }, 350);
        } else if (state === "chase") {
          const newDir = (Math.sign(otherRef.current.x - x) || direction) as Direction;
          if (newDir !== ref.current.direction) {
            ref.current.direction = newDir;
            setVisual((v) => ({ ...v, direction: newDir }));
          }
        }

        ref.current.x = targetX;
        motionX.set(targetX);
      }, TICK_MS);
    },
    [],
  );

  const transitionState = useCallback(
    (
      ref: React.MutableRefObject<PetRef>,
      otherRef: React.MutableRefObject<PetRef>,
      motionX: MotionValue<number>,
      setVisual: React.Dispatch<React.SetStateAction<PetVisual>>,
    ) => {
      if (ref.current.stateTimeoutId) clearTimeout(ref.current.stateTimeoutId);
      if (ref.current.moveIntervalId) clearInterval(ref.current.moveIntervalId);
      if (ref.current.walkFrameIntervalId)
        clearInterval(ref.current.walkFrameIntervalId);

      const dist = Math.abs(ref.current.x - otherRef.current.x);
      const next = pickNextState(ref.current.state, dist);
      ref.current.state = next;

      setVisual((v) => ({
        ...v,
        state: next,
        showFood: next === "eat",
        walkFrame: 0,
      }));

      if (next === "walk" || next === "chase") {
        startMoveLoop(ref, otherRef, motionX, setVisual);
        // Toggle walk frames to animate legs
        ref.current.walkFrameIntervalId = setInterval(() => {
          setVisual((v) => ({ ...v, walkFrame: v.walkFrame === 0 ? 1 : 0 }));
        }, WALK_FRAME_MS);
      }

      ref.current.stateTimeoutId = setTimeout(() => {
        transitionState(ref, otherRef, motionX, setVisual);
      }, getStateDuration(next));
    },
    [startMoveLoop],
  );

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    containerWidth.current = containerRef.current.offsetWidth;
    const catStart = Math.max(
      containerWidth.current - 160,
      PET_WIDTH + MARGIN + 10,
    );
    catRef.current.x = catStart;
    catX.set(catStart);

    const ro = new ResizeObserver(() => {
      containerWidth.current =
        containerRef.current?.offsetWidth ?? containerWidth.current;
    });
    ro.observe(containerRef.current);

    const dogTimer = setTimeout(() => {
      transitionState(dogRef, catRef, dogX, setDogVisual);
    }, 800);
    const catTimer = setTimeout(() => {
      transitionState(catRef, dogRef, catX, setCatVisual);
    }, 1400);

    return () => {
      clearTimeout(dogTimer);
      clearTimeout(catTimer);
      clearPetTimers(dogRef);
      clearPetTimers(catRef);
      ro.disconnect();
    };
  }, [mounted, transitionState, clearPetTimers, dogX, catX]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden pointer-events-none select-none"
      style={{ height: CONTAINER_HEIGHT }}
      aria-hidden="true"
    >
      {/* Dog */}
      <motion.div style={{ x: dogX }} className="absolute bottom-0">
        <DogSprite visual={dogVisual} />
      </motion.div>

      {/* Cat */}
      <motion.div style={{ x: catX }} className="absolute bottom-0">
        <CatSprite visual={catVisual} />
      </motion.div>
    </div>
  );
}
