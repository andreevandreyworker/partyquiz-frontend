import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

interface Props {
  size?: number;
  className?: string;
}

const BASE = "/mascot";

export default function Mascot({ size = 168, className }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const headX = useSpring(px, { stiffness: 70, damping: 16 });
  const earLag = useSpring(px, { stiffness: 38, damping: 8 });
  const eyeX = useSpring(px, { stiffness: 260, damping: 22 });
  const eyeY = useSpring(py, { stiffness: 260, damping: 22 });

  const headRot = useTransform(headX, [-1, 1], [-5, 5]);

  const eyeTx = useTransform(eyeX, [-1, 1], [-size * 0.04, size * 0.04]);
  const eyeTy = useTransform(eyeY, [-1, 1], [-size * 0.03, size * 0.03]);

  const earBase = useTransform(earLag, [-1, 1], [11, -11]);
  const earTwitch = useMotionValue(0);
  const earLRot = useTransform(
    [earBase, earTwitch],
    ([b, t]: number[]) => b - 5 + t
  );
  const earRRot = useTransform(
    [earBase, earTwitch],
    ([b, t]: number[]) => b + 5 - t
  );

  const breathe = useMotionValue(1);
  const [squash, setSquash] = useState(1);
  const squashS = useSpring(squash, { stiffness: 600, damping: 14 });
  const sy = useTransform(
    [breathe, squashS],
    ([b, s]: number[]) => b * s
  );
  const sx = useTransform(
    [breathe, squashS],
    ([b, s]: number[]) => b * (2 - s)
  );

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rad = Math.max(window.innerWidth, window.innerHeight) * 0.4;
      px.set(Math.max(-1, Math.min(1, (e.clientX - cx) / rad)));
      py.set(Math.max(-1, Math.min(1, (e.clientY - cy) / rad)));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduce]);

  useEffect(() => {
    if (reduce) return;
    const onTilt = (e: DeviceOrientationEvent) => {
      const g = (e.gamma ?? 0) / 40;
      const b = ((e.beta ?? 0) - 40) / 40;
      px.set(Math.max(-1, Math.min(1, g)));
      py.set(Math.max(-1, Math.min(1, b)));
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [px, py, reduce]);

  const t0 = useRef(performance.now());
  const nextTwitch = useRef(1200);
  useAnimationFrame((t) => {
    const e = t - t0.current;
    breathe.set(1 + Math.sin(e / 720) * 0.018);
    if (e > nextTwitch.current) {
      nextTwitch.current = e + 1300 + Math.random() * 2400;
      const dir = Math.random() > 0.5 ? 1 : -1;
      let s = 0;
      const id = setInterval(() => {
        s += 0.16;
        earTwitch.set(Math.sin(s * Math.PI) * 9 * dir);
        if (s >= 1) {
          earTwitch.set(0);
          clearInterval(id);
        }
      }, 16);
    }
  });

  const tap = () => {
    setSquash(0.84);
    setTimeout(() => setSquash(1), 140);
  };

  const layer: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    userSelect: "none",
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerDown={tap}
      style={{
        width: size,
        height: size,
        position: "relative",
        cursor: "pointer",
        scaleX: sx,
        scaleY: sy,
        transformOrigin: "50% 100%",
      }}
    >
      <motion.div
        style={{
          ...layer,
          rotate: headRot,
          transformOrigin: "50% 96%",
        }}
      >
        <img src={`${BASE}/head_base.png`} style={layer} alt="" />
        <motion.img
          src={`${BASE}/ear_l.png`}
          style={{ ...layer, rotate: earLRot, transformOrigin: "44% 40%" }}
          alt=""
        />
        <motion.img
          src={`${BASE}/ear_r.png`}
          style={{ ...layer, rotate: earRRot, transformOrigin: "60% 38%" }}
          alt=""
        />
        <motion.img
          src={`${BASE}/highlights.png`}
          style={{ ...layer, x: eyeTx, y: eyeTy }}
          alt=""
        />
      </motion.div>
    </motion.div>
  );
}
