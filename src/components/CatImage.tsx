import { motion } from "framer-motion";
import { assetUrl } from "../cms";

interface Props {
  imageId: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

const idle = { scale: [1, 1.12, 1], rotate: [0, 5, 0, -5, 0], y: [0, -6, 0] };
const idleT = { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const };
const blink = { scaleY: [1, 1, 0.1, 1, 1] };
const blinkT = {
  duration: 2.8,
  times: [0, 0.86, 0.92, 0.98, 1],
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export default function CatImage({
  imageId,
  alt = "cat",
  size = 120,
  className,
}: Props) {
  const url = assetUrl(imageId);
  if (url) {
    return (
      <motion.img
        src={url}
        alt={alt}
        className={className}
        animate={idle}
        transition={idleT}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          transformOrigin: "50% 90%",
        }}
      />
    );
  }
  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={alt}
      animate={idle}
      transition={idleT}
      style={{ transformOrigin: "50% 90%" }}
    >
      <defs>
        <linearGradient id="pqFur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E4D1B8" />
          <stop offset="1" stopColor="#CBB492" />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="115" rx="32" ry="5" fill="rgba(0,0,0,0.07)" />

      <ellipse
        cx="60"
        cy="92"
        rx="30"
        ry="22"
        fill="url(#pqFur)"
        stroke="#B89B78"
        strokeWidth="2"
      />

      <path
        d="M31 42 L25 14 L51 34 Z"
        fill="url(#pqFur)"
        stroke="#B89B78"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M89 42 L95 14 L69 34 Z"
        fill="url(#pqFur)"
        stroke="#B89B78"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M34 36 L31 21 L45 33 Z" fill="#E9B5A6" />
      <path d="M86 36 L89 21 L75 33 Z" fill="#E9B5A6" />

      <ellipse
        cx="60"
        cy="58"
        rx="40"
        ry="35"
        fill="url(#pqFur)"
        stroke="#B89B78"
        strokeWidth="2"
      />

      <path
        d="M52 26 Q60 22 68 26"
        stroke="#C0A981"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M44 30 Q49 27 54 30"
        stroke="#C0A981"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M66 30 Q71 27 76 30"
        stroke="#C0A981"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <ellipse cx="40" cy="66" rx="6" ry="4" fill="#ECB9A8" opacity="0.7" />
      <ellipse cx="80" cy="66" rx="6" ry="4" fill="#ECB9A8" opacity="0.7" />

      <motion.g
        animate={blink}
        transition={blinkT}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle cx="47" cy="57" r="5.5" fill="#3A2E1F" />
        <circle cx="45" cy="55" r="1.8" fill="#fff" />
      </motion.g>

      <path
        d="M67 57 Q73 51 79 57"
        stroke="#3A2E1F"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <line x1="84" y1="50" x2="90" y2="48" stroke="#B89B78"
        strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="56" x2="91" y2="56" stroke="#B89B78"
        strokeWidth="2" strokeLinecap="round" />
      <line x1="84" y1="62" x2="90" y2="64" stroke="#B89B78"
        strokeWidth="2" strokeLinecap="round" />

      <path d="M56 64 L64 64 L60 69 Z" fill="#C97B6B" />

      <path
        d="M60 69 Q54 72 50 70"
        stroke="#7A5C44"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M60 69 Q66 72 70 70"
        stroke="#7A5C44"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M54 72 Q60 86 66 72 Z" fill="#C56B5E" />
      <path d="M57 77 Q60 84 63 77 Z" fill="#F2A99B" />

      <line x1="20" y1="62" x2="40" y2="64" stroke="#B89B78"
        strokeWidth="1.6" strokeLinecap="round" />
      <line x1="19" y1="69" x2="40" y2="69" stroke="#B89B78"
        strokeWidth="1.6" strokeLinecap="round" />
      <line x1="20" y1="76" x2="40" y2="73" stroke="#B89B78"
        strokeWidth="1.6" strokeLinecap="round" />
      <line x1="100" y1="62" x2="80" y2="64" stroke="#B89B78"
        strokeWidth="1.6" strokeLinecap="round" />
      <line x1="101" y1="69" x2="80" y2="69" stroke="#B89B78"
        strokeWidth="1.6" strokeLinecap="round" />
      <line x1="100" y1="76" x2="80" y2="73" stroke="#B89B78"
        strokeWidth="1.6" strokeLinecap="round" />

      <ellipse
        cx="43"
        cy="100"
        rx="12"
        ry="7.5"
        fill="url(#pqFur)"
        stroke="#B89B78"
        strokeWidth="2"
      />
      <ellipse
        cx="77"
        cy="100"
        rx="12"
        ry="7.5"
        fill="url(#pqFur)"
        stroke="#B89B78"
        strokeWidth="2"
      />
      <line x1="40" y1="98" x2="40" y2="103" stroke="#B89B78"
        strokeWidth="1.4" strokeLinecap="round" />
      <line x1="46" y1="98" x2="46" y2="103" stroke="#B89B78"
        strokeWidth="1.4" strokeLinecap="round" />
      <line x1="74" y1="98" x2="74" y2="103" stroke="#B89B78"
        strokeWidth="1.4" strokeLinecap="round" />
        <line x1="80" y1="98" x2="80" y2="103" stroke="#B89B78"
          strokeWidth="1.4" strokeLinecap="round" />
    </motion.svg>
  );
}
