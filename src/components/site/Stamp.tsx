import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Stempel karet rust — detail arsip, dipakai sangat hemat. */
export function Stamp({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block border-[1.5px] border-accent/90 px-3 py-1.5 font-mono text-[10px] uppercase leading-none tracking-[0.2em] text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
