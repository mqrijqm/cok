export function LogoMark({ className = "" }: { className?: string }) {
  // A 2×2 block of white chocolate, seen from above.
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {[
        [1, 1],
        [13, 1],
        [1, 13],
        [13, 13],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="10" height="10" rx="2.2" fill="currentColor" opacity="0.55" />
          <rect x={x + 2.2} y={y + 2.2} width="5.6" height="5.6" rx="1" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-[1.05em] w-[1.05em]" />
      <span className="font-display font-bold tracking-[0.02em] uppercase">Avorio</span>
    </span>
  );
}
