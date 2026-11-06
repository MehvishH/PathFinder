const TRAIL =
  "M118 62 C 250 18, 410 70, 392 172 S 128 214, 160 300 S 330 350, 416 404";

type Stop = {
  label: string;
  x: number;
  y: number;
  rotate: number;
  fill: string;
  fontSize?: number;
};

const STOPS: Stop[] = [
  { label: "Undecided major", x: 118, y: 62, rotate: -4, fill: "#FF6EB4" },
  { label: "Back after a break", x: 392, y: 172, rotate: 3, fill: "#34E3A0" },
  { label: "Switching fields", x: 160, y: 300, rotate: -3, fill: "#FFFFFF" },
  { label: "Funded 🎓", x: 416, y: 404, rotate: 4, fill: "#F2FF4D", fontSize: 22 },
];

const INK = "#17134A";

// Rough width for a label in Unbounded, which runs wide.
function stickerWidth(label: string, fontSize: number) {
  return Math.round([...label].length * fontSize * 0.62 + 34);
}

function Sticker({ label, x, y, rotate, fill, fontSize = 17 }: Stop) {
  const w = stickerWidth(label, fontSize);
  const h = fontSize * 2.9;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-w / 2 + 5} y={-h / 2 + 5} width={w} height={h} rx={14} fill={INK} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={fill} stroke={INK} strokeWidth={3} />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={INK}
        fontSize={fontSize}
        fontWeight={600}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </text>
    </g>
  );
}

/** Hand-drawn trail from "where you are" to "funded". Decorative. */
export function TrailMap({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 540 470"
      role="img"
      aria-label="A winding trail that passes undecided major, back after a break and switching fields, and ends at funded."
      className={className}
    >
      <defs>
        <mask id="trail-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="540" height="470">
          <path
            d={TRAIL}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={16}
            strokeLinecap="round"
            className="trail-reveal"
          />
        </mask>
      </defs>

      {/* Little landmarks so it reads as a map, not a chart. */}
      <g fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
        <path d="M470 70 l14 -24 l14 24 z M488 70 l12 -18 l12 18" />
        <path d="M40 210 c 6 -10, 14 -10, 20 0 M52 210 v 14" />
        <path d="M60 400 q 10 -8 20 0 t 20 0 t 20 0" />
        <path d="M290 250 l 6 6 m 0 -6 l -6 6" />
      </g>
      <circle cx="500" cy="300" r="7" fill="#2F3BFF" />
      <circle cx="262" cy="440" r="5" fill="#FF6EB4" />

      <path
        d={TRAIL}
        fill="none"
        stroke={INK}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray="10 11"
        mask="url(#trail-mask)"
      />

      {STOPS.map((s) => (
        <Sticker key={s.label} {...s} />
      ))}
    </svg>
  );
}
