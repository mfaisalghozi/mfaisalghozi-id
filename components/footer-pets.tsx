"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, animate, MotionValue } from "motion/react";

// ─── Constants ─────────────────────────────────────────────────────────────
const PET_WIDTH = 48;
const PET_HEIGHT = 44;
const CONTAINER_HEIGHT = PET_HEIGHT + 12;
const MARGIN = 8;
const TICK_MS = 16;
const WALK_SPEED = 0.4; // px per 16ms tick → ~24px/s
const CHASE_SPEED = 0.85; // px per 16ms tick → ~51px/s

// ─── Types ─────────────────────────────────────────────────────────────────
type PetState = "walk" | "idle" | "sit" | "eat" | "chase" | "play" | "sleep";
type Direction = 1 | -1;

interface PetVisual {
  state: PetState;
  direction: Direction;
  blinking: boolean;
  showFood: boolean;
}

interface PetRef {
  x: number;
  direction: Direction;
  state: PetState;
  stateTimeoutId: ReturnType<typeof setTimeout> | null;
  blinkTimeoutId: ReturnType<typeof setTimeout> | null;
  moveIntervalId: ReturnType<typeof setInterval> | null;
  pausedForTurn: boolean;
}

// ─── State Machine ──────────────────────────────────────────────────────────
function getStateDuration(state: PetState): number {
  const ranges: Record<PetState, [number, number]> = {
    walk: [2000, 5000],
    idle: [1500, 4000],
    sit: [2000, 6000],
    eat: [3000, 6000],
    chase: [2000, 4000],
    play: [2000, 5000],
    sleep: [5000, 12000],
  };
  const [min, max] = ranges[state];
  return min + Math.random() * (max - min);
}

function pickNextState(current: PetState, distToOther: number): PetState {
  const roll = Math.random();
  if (current === "walk") {
    if (roll < 0.35) return "walk";
    if (roll < 0.60) return "idle";
    if (roll < 0.75) return "sit";
    if (roll < 0.85) return "eat";
    if (roll < 0.95 && distToOther > 80) return "chase";
    return "sleep";
  }
  if (current === "idle") {
    if (roll < 0.50) return "walk";
    if (roll < 0.75) return "sit";
    if (roll < 0.90) return "eat";
    return distToOther > 80 ? "chase" : "walk";
  }
  if (current === "sit") {
    if (roll < 0.50) return "walk";
    if (roll < 0.70) return "idle";
    if (roll < 0.85) return "eat";
    if (roll < 0.95) return "sleep";
    return distToOther > 80 ? "chase" : "walk";
  }
  if (current === "eat") {
    if (roll < 0.40) return "walk";
    if (roll < 0.70) return "idle";
    if (roll < 0.90) return "sit";
    return "sleep";
  }
  if (current === "chase") {
    if (distToOther < 60) return "play";
    if (roll < 0.60) return "walk";
    return "idle";
  }
  if (current === "play") {
    if (roll < 0.40) return "idle";
    if (roll < 0.70) return "walk";
    if (roll < 0.90) return "sit";
    return "eat";
  }
  // sleep
  if (roll < 0.60) return "idle";
  return "sit";
}

// ─── SVG Components ─────────────────────────────────────────────────────────

function BoneSVG() {
  return (
    <svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      aria-hidden="true"
      className="absolute -top-2 left-10"
    >
      <rect x="6" y="5" width="16" height="6" rx="2" fill="#D4C4A8" />
      <circle cx="6" cy="8" r="4" fill="#D4C4A8" />
      <circle cx="22" cy="8" r="4" fill="#D4C4A8" />
      <circle cx="6" cy="4" r="3" fill="#D4C4A8" />
      <circle cx="22" cy="4" r="3" fill="#D4C4A8" />
      <circle cx="6" cy="12" r="3" fill="#D4C4A8" />
      <circle cx="22" cy="12" r="3" fill="#D4C4A8" />
    </svg>
  );
}

function FishSVG() {
  return (
    <svg
      width="28"
      height="18"
      viewBox="0 0 28 18"
      fill="none"
      aria-hidden="true"
      className="absolute -top-2 left-10"
    >
      <ellipse cx="16" cy="9" rx="10" ry="6" fill="#7EC8C8" />
      <path d="M6 9 L1 4 L1 14 Z" fill="#7EC8C8" />
      <circle cx="22" cy="7" r="1.5" fill="#2A4A4A" />
      <circle cx="22.5" cy="6.5" r="0.5" fill="white" />
      <line x1="6" y1="9" x2="18" y2="9" stroke="#5AAAB0" strokeWidth="1" />
    </svg>
  );
}

function ZzzParticles() {
  return (
    <g aria-hidden="true">
      <motion.text
        x="46"
        y="14"
        fontSize="5"
        fill="#94a3b8"
        fontFamily="monospace"
        animate={{ y: [14, 6], opacity: [0.7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0, ease: "easeOut" }}
      >
        z
      </motion.text>
      <motion.text
        x="50"
        y="9"
        fontSize="7"
        fill="#94a3b8"
        fontFamily="monospace"
        animate={{ y: [9, 0], opacity: [0.7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6, ease: "easeOut" }}
      >
        z
      </motion.text>
      <motion.text
        x="54"
        y="4"
        fontSize="9"
        fill="#94a3b8"
        fontFamily="monospace"
        animate={{ y: [4, -6], opacity: [0.7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 1.1, ease: "easeOut" }}
      >
        Z
      </motion.text>
    </g>
  );
}

interface DogSVGProps {
  state: PetState;
  blinking: boolean;
}

function DogSVG({ state, blinking }: DogSVGProps) {
  const isWalking = state === "walk" || state === "chase";
  const isSitting = state === "sit" || state === "sleep";
  const isSleeping = state === "sleep";
  const isPlaying = state === "play";
  const isEating = state === "eat";

  const tailRotateValues = isSleeping
    ? [0, 0]
    : state === "idle" || state === "play" || state === "eat"
    ? [-20, 20]
    : [-8, 8];

  const tailDuration = state === "idle" || state === "play" ? 0.28 : 0.45;

  return (
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      animate={isPlaying ? { y: [0, -8, 0] } : isWalking ? { y: [0, -2, 0] } : { y: 0 }}
      transition={
        isPlaying
          ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
          : isWalking
          ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
          : {}
      }
    >
      {/* TAIL */}
      <motion.path
        d="M14 36 Q4 30 8 20 Q12 12 18 17"
        stroke="#B87D3A"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "14px 36px" }}
        animate={{ rotate: tailRotateValues }}
        transition={{ duration: tailDuration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* BODY */}
      <motion.rect
        x="12"
        y={isSitting ? 30 : 28}
        width="34"
        height={isSitting ? 18 : 22}
        rx="10"
        fill="#C8934A"
        animate={isSleeping ? { scaleY: [1, 1.04, 1] } : {}}
        transition={isSleeping ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ transformOrigin: "29px 39px" }}
      />

      {/* BACK LEGS */}
      {!isSitting && (
        <>
          <motion.rect
            x="14" y="44" width="7" height="11" rx="3.5" fill="#B87D3A"
            animate={isWalking ? { y: [44, 40, 44] } : { y: 44 }}
            transition={isWalking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
          />
          <motion.rect
            x="22" y="44" width="7" height="11" rx="3.5" fill="#B87D3A"
            animate={isWalking ? { y: [44, 40, 44] } : { y: 44 }}
            transition={isWalking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut", delay: 0.225 } : { duration: 0.15 }}
          />
        </>
      )}

      {/* SITTING BACK LEGS */}
      {isSitting && (
        <>
          <rect x="13" y="44" width="7" height="8" rx="3.5" fill="#B87D3A" transform="rotate(-50 13 44)" />
          <rect x="24" y="44" width="7" height="8" rx="3.5" fill="#B87D3A" transform="rotate(50 30 44)" />
        </>
      )}

      {/* HEAD */}
      <motion.g
        style={{ transformOrigin: "44px 22px" }}
        animate={isEating ? { rotate: [0, 10, 0] } : { rotate: 0 }}
        transition={isEating ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <circle cx="44" cy="22" r="13" fill="#C8934A" />

        {/* EARS */}
        <ellipse cx="37" cy="12" rx="5" ry="8" fill="#A0622A" transform="rotate(-20 37 12)" />
        <ellipse cx="44" cy="10" rx="4" ry="6" fill="#A0622A" transform="rotate(-5 44 10)" />

        {/* SNOUT */}
        <ellipse cx="51" cy="27" rx="7" ry="5" fill="#D9A86C" />
        <circle cx="54" cy="25" r="2.2" fill="#3B2410" />

        {/* EYE */}
        <motion.ellipse
          cx="46"
          cy="19"
          rx="2.5"
          animate={{ ry: blinking ? 0.2 : 2.5 }}
          transition={{ duration: 0.06 }}
          fill="#3B2410"
        />
        {!blinking && <circle cx="47" cy="18" r="0.8" fill="white" />}
      </motion.g>

      {/* FRONT LEGS */}
      {!isSitting && (
        <>
          <motion.rect
            x="36" y="44" width="7" height="11" rx="3.5" fill="#B87D3A"
            animate={isWalking ? { y: [44, 40, 44] } : { y: 44 }}
            transition={isWalking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut", delay: 0.225 } : { duration: 0.15 }}
          />
          <motion.rect
            x="44" y="44" width="7" height="11" rx="3.5" fill="#B87D3A"
            animate={isWalking ? { y: [44, 40, 44] } : { y: 44 }}
            transition={isWalking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
          />
        </>
      )}

      {isSleeping && <ZzzParticles />}
    </motion.svg>
  );
}

interface CatSVGProps {
  state: PetState;
  blinking: boolean;
}

function CatSVG({ state, blinking }: CatSVGProps) {
  const isWalking = state === "walk" || state === "chase";
  const isSitting = state === "sit" || state === "sleep";
  const isSleeping = state === "sleep";
  const isPlaying = state === "play";
  const isEating = state === "eat";

  const tailRotateValues = isSleeping ? [0, 0] : state === "idle" || state === "play" ? [-18, 18] : [-6, 6];
  const tailDuration = state === "idle" || state === "play" ? 0.32 : 0.5;

  return (
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      animate={isPlaying ? { y: [0, -10, 0] } : isWalking ? { y: [0, -2, 0] } : { y: 0 }}
      transition={
        isPlaying
          ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
          : isWalking
          ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
          : {}
      }
    >
      {/* TAIL */}
      <motion.path
        d="M14 36 Q2 30 4 18 Q6 8 14 13"
        stroke="#7A8496"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "14px 36px" }}
        animate={{ rotate: tailRotateValues }}
        transition={{ duration: tailDuration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* BODY */}
      <motion.rect
        x="12"
        y={isSitting ? 30 : 28}
        width="32"
        height={isSitting ? 18 : 22}
        rx="10"
        fill="#8D97A8"
        animate={isSleeping ? { scaleY: [1, 1.04, 1] } : {}}
        transition={isSleeping ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ transformOrigin: "28px 39px" }}
      />

      {/* TABBY STRIPES */}
      <line x1="21" y1={isSitting ? 32 : 30} x2="19" y2={isSitting ? 44 : 46} stroke="#7A8496" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1={isSitting ? 31 : 29} x2="26" y2={isSitting ? 44 : 46} stroke="#7A8496" strokeWidth="1.5" strokeLinecap="round" />

      {/* BACK LEGS */}
      {!isSitting && (
        <>
          <motion.rect
            x="14" y="44" width="6" height="11" rx="3" fill="#7A8496"
            animate={isWalking ? { y: [44, 40, 44] } : { y: 44 }}
            transition={isWalking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
          />
          <motion.rect
            x="21" y="44" width="6" height="11" rx="3" fill="#7A8496"
            animate={isWalking ? { y: [44, 40, 44] } : { y: 44 }}
            transition={isWalking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut", delay: 0.225 } : { duration: 0.15 }}
          />
        </>
      )}

      {/* SITTING BACK LEGS */}
      {isSitting && (
        <>
          <rect x="13" y="44" width="6" height="8" rx="3" fill="#7A8496" transform="rotate(-50 13 44)" />
          <rect x="23" y="44" width="6" height="8" rx="3" fill="#7A8496" transform="rotate(50 29 44)" />
        </>
      )}

      {/* HEAD */}
      <motion.g
        style={{ transformOrigin: "42px 22px" }}
        animate={isEating ? { rotate: [0, 12, 0] } : { rotate: 0 }}
        transition={isEating ? { duration: 0.55, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <circle cx="42" cy="22" r="13" fill="#8D97A8" />

        {/* EARS */}
        <polygon points="34,13 30,3 40,11" fill="#8D97A8" />
        <polygon points="34,13 31,5 39,12" fill="#E8A0AA" />
        <polygon points="46,11 43,1 50,10" fill="#8D97A8" />
        <polygon points="46,11 44,3 49,10" fill="#E8A0AA" />

        {/* SNOUT */}
        <ellipse cx="49" cy="27" rx="6" ry="4" fill="#B0BAC9" />

        {/* NOSE */}
        <polygon points="49,24 47,27 51,27" fill="#E8697A" />

        {/* EYE */}
        <motion.ellipse
          cx="44"
          cy="19"
          rx="2.8"
          animate={{ ry: blinking ? 0.2 : 2.5 }}
          transition={{ duration: 0.06 }}
          fill="#3B4455"
        />
        {!blinking && (
          <>
            <ellipse cx="44" cy="19" rx="1.4" ry="2" fill="#1A1E2A" />
            <circle cx="45" cy="18" r="0.8" fill="white" />
          </>
        )}

        {/* WHISKERS */}
        <line x1="55" y1="25" x2="64" y2="23" stroke="#C8D0DC" strokeWidth="0.8" />
        <line x1="55" y1="27" x2="64" y2="27" stroke="#C8D0DC" strokeWidth="0.8" />
        <line x1="55" y1="29" x2="64" y2="31" stroke="#C8D0DC" strokeWidth="0.8" />
        <line x1="43" y1="25" x2="34" y2="23" stroke="#C8D0DC" strokeWidth="0.8" />
        <line x1="43" y1="27" x2="34" y2="27" stroke="#C8D0DC" strokeWidth="0.8" />
      </motion.g>

      {/* FRONT LEGS */}
      {!isSitting && (
        <>
          <motion.rect
            x="34" y="44" width="6" height="11" rx="3" fill="#7A8496"
            animate={isWalking ? { y: [44, 40, 44] } : { y: 44 }}
            transition={isWalking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut", delay: 0.225 } : { duration: 0.15 }}
          />
          <motion.rect
            x="41" y="44" width="6" height="11" rx="3" fill="#7A8496"
            animate={isWalking ? { y: [44, 40, 44] } : { y: 44 }}
            transition={isWalking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
          />
        </>
      )}

      {isSleeping && <ZzzParticles />}
    </motion.svg>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function FooterPets() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(600);

  const [dogVisual, setDogVisual] = useState<PetVisual>({
    state: "idle",
    direction: 1,
    blinking: false,
    showFood: false,
  });
  const [catVisual, setCatVisual] = useState<PetVisual>({
    state: "idle",
    direction: -1,
    blinking: false,
    showFood: false,
  });

  const dogX = useMotionValue(80);
  const catX = useMotionValue(400);

  const dogRef = useRef<PetRef>({
    x: 80,
    direction: 1,
    state: "idle",
    stateTimeoutId: null,
    blinkTimeoutId: null,
    moveIntervalId: null,
    pausedForTurn: false,
  });
  const catRef = useRef<PetRef>({
    x: 400,
    direction: -1,
    state: "idle",
    stateTimeoutId: null,
    blinkTimeoutId: null,
    moveIntervalId: null,
    pausedForTurn: false,
  });

  const clearPetTimers = useCallback((ref: React.MutableRefObject<PetRef>) => {
    if (ref.current.stateTimeoutId) clearTimeout(ref.current.stateTimeoutId);
    if (ref.current.blinkTimeoutId) clearTimeout(ref.current.blinkTimeoutId);
    if (ref.current.moveIntervalId) clearInterval(ref.current.moveIntervalId);
    ref.current.stateTimeoutId = null;
    ref.current.blinkTimeoutId = null;
    ref.current.moveIntervalId = null;
  }, []);

  const scheduleBlink = useCallback(
    (
      ref: React.MutableRefObject<PetRef>,
      setVisual: React.Dispatch<React.SetStateAction<PetVisual>>
    ) => {
      const delay = 2000 + Math.random() * 4000;
      ref.current.blinkTimeoutId = setTimeout(() => {
        setVisual((v) => ({ ...v, blinking: true }));
        setTimeout(() => {
          setVisual((v) => ({ ...v, blinking: false }));
          scheduleBlink(ref, setVisual);
        }, 120);
      }, delay);
    },
    []
  );

  const startMoveLoop = useCallback(
    (
      ref: React.MutableRefObject<PetRef>,
      otherRef: React.MutableRefObject<PetRef>,
      motionX: MotionValue<number>,
      setVisual: React.Dispatch<React.SetStateAction<PetVisual>>
    ) => {
      if (ref.current.moveIntervalId) clearInterval(ref.current.moveIntervalId);

      ref.current.moveIntervalId = setInterval(() => {
        if (ref.current.pausedForTurn) return;

        const { x, direction, state } = ref.current;
        const speed = state === "chase" ? CHASE_SPEED : WALK_SPEED;

        let targetX: number;
        if (state === "chase") {
          const otherX = otherRef.current.x;
          const dist = otherX - x;
          const sign = Math.sign(dist) as Direction;
          targetX = x + sign * speed;
        } else {
          targetX = x + direction * speed;
        }

        const maxX = containerWidth.current - PET_WIDTH - MARGIN;

        if (targetX <= MARGIN) {
          targetX = MARGIN;
          ref.current.direction = 1;
          ref.current.pausedForTurn = true;
          setVisual((v) => ({ ...v, direction: 1 }));
          setTimeout(() => {
            ref.current.pausedForTurn = false;
          }, 350);
        } else if (targetX >= maxX) {
          targetX = maxX;
          ref.current.direction = -1;
          ref.current.pausedForTurn = true;
          setVisual((v) => ({ ...v, direction: -1 }));
          setTimeout(() => {
            ref.current.pausedForTurn = false;
          }, 350);
        } else if (state === "chase") {
          const newDir = (Math.sign(otherRef.current.x - x) as Direction) || direction;
          if (newDir !== ref.current.direction) {
            ref.current.direction = newDir;
            setVisual((v) => ({ ...v, direction: newDir }));
          }
        }

        ref.current.x = targetX;
        motionX.set(targetX);
      }, TICK_MS);
    },
    []
  );

  const transitionState = useCallback(
    (
      ref: React.MutableRefObject<PetRef>,
      otherRef: React.MutableRefObject<PetRef>,
      motionX: MotionValue<number>,
      setVisual: React.Dispatch<React.SetStateAction<PetVisual>>,
      label: string
    ) => {
      if (ref.current.stateTimeoutId) clearTimeout(ref.current.stateTimeoutId);
      if (ref.current.moveIntervalId) clearInterval(ref.current.moveIntervalId);

      const dist = Math.abs(ref.current.x - otherRef.current.x);
      const next = pickNextState(ref.current.state, dist);

      ref.current.state = next;
      const showFood = next === "eat";

      setVisual((v) => ({ ...v, state: next, showFood }));

      if (next === "walk" || next === "chase") {
        startMoveLoop(ref, otherRef, motionX, setVisual);
      }

      const duration = getStateDuration(next);
      ref.current.stateTimeoutId = setTimeout(() => {
        transitionState(ref, otherRef, motionX, setVisual, label);
      }, duration);
    },
    [startMoveLoop]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Measure container
    const measure = () => {
      if (containerRef.current) {
        containerWidth.current = containerRef.current.offsetWidth;
        // Place cat near right side on mount
        const catStart = Math.max(containerWidth.current - 140, PET_WIDTH + MARGIN + 10);
        catRef.current.x = catStart;
        catX.set(catStart);
      }
    };
    measure();

    const ro = new ResizeObserver(() => {
      containerWidth.current = containerRef.current?.offsetWidth ?? containerWidth.current;
    });
    ro.observe(containerRef.current);

    // Start state machines with small delay stagger
    const dogDelay = setTimeout(() => {
      transitionState(dogRef, catRef, dogX, setDogVisual, "dog");
      scheduleBlink(dogRef, setDogVisual);
    }, 800);

    const catDelay = setTimeout(() => {
      transitionState(catRef, dogRef, catX, setCatVisual, "cat");
      scheduleBlink(catRef, setCatVisual);
    }, 1400);

    return () => {
      clearTimeout(dogDelay);
      clearTimeout(catDelay);
      clearPetTimers(dogRef);
      clearPetTimers(catRef);
      ro.disconnect();
    };
  }, [mounted, transitionState, scheduleBlink, clearPetTimers, dogX, catX]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden pointer-events-none select-none"
      style={{ height: CONTAINER_HEIGHT }}
      aria-hidden="true"
    >
      {/* Dog */}
      <motion.div
        style={{ x: dogX, scaleX: dogVisual.direction }}
        className="absolute bottom-0"
        animate={dogVisual.state === "play" ? { y: [0, -8, 0] } : { y: 0 }}
        transition={dogVisual.state === "play" ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        {dogVisual.showFood && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <BoneSVG />
          </motion.div>
        )}
        <DogSVG state={dogVisual.state} blinking={dogVisual.blinking} />
      </motion.div>

      {/* Cat */}
      <motion.div
        style={{ x: catX, scaleX: catVisual.direction }}
        className="absolute bottom-0"
        animate={catVisual.state === "play" ? { y: [0, -10, 0] } : { y: 0 }}
        transition={catVisual.state === "play" ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        {catVisual.showFood && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <FishSVG />
          </motion.div>
        )}
        <CatSVG state={catVisual.state} blinking={catVisual.blinking} />
      </motion.div>
    </div>
  );
}
