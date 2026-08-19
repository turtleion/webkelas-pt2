import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export function PlaceholderNote({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        "glass flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4",
        className,
      )}
    >
      <span className="kicker shrink-0 text-[9px] text-accent">{t.common.noteLabel}</span>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {children ?? t.common.empty}
      </p>
    </aside>
  );
}
