/**
 * Subtle accent dot grid that fades out toward the edges via a radial mask
 * (adapted from Magic UI's "Dot Pattern"). Pure CSS — no JS, no repaints.
 * Render inside a positioned (e.g. fixed) container.
 */
export default function DotGrid({ className = '' }: { className?: string }) {
  const mask = 'radial-gradient(ellipse 75% 65% at 50% 35%, #000 25%, transparent 80%)';
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(77, 74, 169, 0.22) 1px, transparent 0)',
        backgroundSize: '22px 22px',
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
