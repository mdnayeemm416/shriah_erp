import {
  AlertDialog, AlertDialogAction, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Lock, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Mode = "edit" | "delete";

export function LockedRecordDialog({
  open, onOpenChange, mode = "edit",
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode?: Mode;
}) {
  const isDelete = mode === "delete";
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isDelete ? <Ban className="h-5 w-5 text-destructive" /> : <Lock className="h-5 w-5 text-destructive" />}
            {isDelete ? "Deletion Blocked" : "Record Locked"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm">
              <p>This record belongs to a <b>Closed Month</b>.</p>
              {isDelete ? (
                <p>Deleting finalized records is not permitted to preserve accounting integrity.</p>
              ) : (
                <p>Financial records for closed periods are protected to preserve accounting integrity.</p>
              )}
              <div className="rounded-lg border bg-muted/40 p-2.5 text-[12px] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="destructive" className="gap-1 h-5 text-[10px]">
                    <Lock className="h-2.5 w-2.5" /> CLOSED
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {isDelete ? "Reopen the month before deleting any finalized record." : "To make changes: reopen the month, edit, then close it again."}
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Detect a closed-month error thrown by DB triggers (RAISE EXCEPTION 'MONTH_CLOSED: ...') */
export function isMonthClosedError(err: unknown): boolean {
  const m = (err as any)?.message ?? "";
  return typeof m === "string" && m.includes("MONTH_CLOSED");
}
