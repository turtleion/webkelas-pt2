import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  destructive = true,
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass glass-strong border-border/80 text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl font-medium tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13.5px] leading-relaxed text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="cursor-pointer border-border/80 bg-background/50 font-mono text-[11px] uppercase tracking-wider"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void onConfirm();
            }}
            disabled={isLoading}
            className={
              destructive
                ? "cursor-pointer bg-destructive text-white hover:bg-destructive/90 font-mono text-[11px] uppercase tracking-wider"
                : "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-[11px] uppercase tracking-wider"
            }
          >
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            ) : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
