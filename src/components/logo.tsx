export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className={className}>
      <rect x="1.5" y="1.5" width="33" height="33" rx="9" fill="#2F3BFF" stroke="#17134A" strokeWidth="2.5" />
      <path
        d="M9 26 C 13 14, 22 24, 26 11"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <circle cx="9" cy="26" r="2.6" fill="#fff" />
      <circle cx="26.5" cy="10.5" r="4.2" fill="#F2FF4D" stroke="#17134A" strokeWidth="2" />
    </svg>
  );
}
