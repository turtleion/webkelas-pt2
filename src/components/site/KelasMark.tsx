import { cn } from "@/lib/utils";

/** Monogram kelas — kotak stempel dengan huruf X dan label TKJ 1. */
export function KelasMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Monogram kelas X TKJ 1"
      fill="none"
    >
      <rect x="2" y="2" width="44" height="44" stroke="currentColor" strokeWidth="2.5" />
      <rect x="7" y="7" width="34" height="34" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <text
        x="24"
        y="23"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="16"
        fill="currentColor"
      >
        X
      </text>
      <text
        x="24"
        y="34.5"
        textAnchor="middle"
        fontFamily="ui-monospace, 'Courier New', monospace"
        fontSize="7"
        letterSpacing="1.2"
        fill="currentColor"
      >
        TKJ 1
      </text>
    </svg>
  );
}
