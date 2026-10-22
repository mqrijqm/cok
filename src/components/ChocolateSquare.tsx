/**
 * One pillowed square of white chocolate, drawn as a flat bevel:
 * a centre plateau and four trapezoid faces lit from the top-left.
 */
export default function ChocolateSquare({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <rect x="0" y="0" width="100" height="100" rx="9" fill="#e4d4b6" />
      <polygon points="6,6 94,6 76,24 24,24" fill="#fbf5ea" />
      <polygon points="6,6 24,24 24,76 6,94" fill="#f2e7d3" />
      <polygon points="94,6 94,94 76,76 76,24" fill="#d6c3a0" />
      <polygon points="6,94 24,76 76,76 94,94" fill="#c9b48f" />
      <rect x="24" y="24" width="52" height="52" rx="2" fill="#f1e6d2" />
    </svg>
  );
}
