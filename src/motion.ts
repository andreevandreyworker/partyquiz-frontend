import confetti from "canvas-confetti";

export const spring = {
  bouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
  snappy: { type: "spring" as const, stiffness: 500, damping: 32 },
  gentle: { type: "spring" as const, stiffness: 200, damping: 26 },
  pop: { type: "spring" as const, stiffness: 600, damping: 18, mass: 0.6 },
};

export const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: spring.gentle },
};

export function haptic(ms: number | number[] = 8): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
}

export function burst(x = 0.5, y = 0.5): void {
  confetti({
    particleCount: 90,
    spread: 72,
    startVelocity: 38,
    origin: { x, y },
    scalar: 0.9,
    ticks: 130,
    colors: ["#EE3D3A", "#FF7F70", "#9061E8", "#34C759", "#FFD23F"],
  });
}

export function burstFrom(el: HTMLElement | null): void {
  if (!el) return burst();
  const r = el.getBoundingClientRect();
  burst(
    (r.left + r.width / 2) / window.innerWidth,
    (r.top + r.height / 2) / window.innerHeight,
  );
}

export function bigCelebrate(): void {
  const end = Date.now() + 700;
  const colors = ["#EE3D3A", "#9061E8", "#34C759", "#FFD23F"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors,
      scalar: 0.9,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors,
      scalar: 0.9,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
