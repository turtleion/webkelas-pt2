import { useInView } from "react-intersection-observer";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade-in ringan saat elemen masuk ke layar (sekali saja).
 * Digunakan hemat pada kepala bagian, bukan pada setiap elemen.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "0px 0px -48px 0px",
  });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
