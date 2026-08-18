import { ReactNode } from "react";
import { Loader2, Inbox, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
}

export function DataTable({
  isLoading,
  error,
  isEmpty,
  emptyMessage = "Belum ada data tercatat.",
  children,
  className,
}: DataTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[240px] w-full items-center justify-center border border-border/70 bg-card/30 p-8 text-center">
        <div className="flex flex-col items-center gap-2.5">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Memuat data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center border border-destructive/30 bg-destructive/5 p-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="size-6 text-destructive" />
          <p className="font-display text-base text-destructive">Terjadi Kesalahan</p>
          <p className="max-w-md text-[13px] text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center border border-dashed border-border bg-card/20 p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <Inbox className="size-7 text-muted-foreground/60" />
          <p className="font-display text-base italic text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto border border-border/70 bg-card/40", className)}>
      {children}
    </div>
  );
}
