import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Paperclip, Camera, Upload, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getSignedAttachmentUrl } from "@/lib/attachment-url";
import { CfAttachmentLightbox, type LightboxItem } from "@/components/cf-attachment-lightbox";
import { useConfirm } from "@/hooks/use-confirm";

type Attachment = {
  id: string;
  purchase_id: string;
  storage_path: string;
  mime: string | null;
  uploaded_by: string;
  uploaded_at: string;
};

async function logActivity(action: string, target_id: string, meta: any = {}) {
  try { await (supabase as any).from("cf_activity_log").insert({ action, target_table: "cash_flow_purchases", target_id, meta }); } catch {}
}

export function CfAttachmentManager({
  purchaseId, canEdit, compact = false,
}: { purchaseId: string; canEdit: boolean; compact?: boolean }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState<number | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const { data: attachments = [] } = useQuery({
    queryKey: ["cfpa", purchaseId],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("cf_purchase_attachments")
        .select("*").eq("purchase_id", purchaseId).order("uploaded_at", { ascending: true });
      return (data ?? []) as Attachment[];
    },
  });

  useEffect(() => {
    let dead = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const a of attachments) {
        if (urls[a.id]) { next[a.id] = urls[a.id]; continue; }
        const u = await getSignedAttachmentUrl(a.storage_path);
        if (u) next[a.id] = u;
      }
      if (!dead) setUrls(next);
    })();
    return () => { dead = true; };
  }, [attachments]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `cash-flow/${purchaseId}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("attachments").upload(path, file, { contentType: file.type, upsert: false });
      if (up.error) { toast.error(up.error.message); continue; }
      const ins = await (supabase as any).from("cf_purchase_attachments").insert({
        purchase_id: purchaseId, storage_path: path, mime: file.type, uploaded_by: user!.id,
      });
      if (ins.error) { toast.error(ins.error.message); continue; }
      logActivity("attachment.upload", purchaseId, { mime: file.type, name: file.name });
    }
    qc.invalidateQueries({ queryKey: ["cfpa", purchaseId] });
    toast.success("Attachment added");
  };

  const remove = async (a: Attachment) => {
    if (!(await confirm({ title: "Delete this attachment?", description: "The file will be permanently removed from storage and cannot be recovered.", confirmText: "Delete", tone: "danger" }))) return;
    await supabase.storage.from("attachments").remove([a.storage_path]);
    const { error } = await (supabase as any).from("cf_purchase_attachments").delete().eq("id", a.id);
    if (error) { toast.error(error.message); return; }
    logActivity("attachment.delete", purchaseId, { id: a.id });
    qc.invalidateQueries({ queryKey: ["cfpa", purchaseId] });
  };

  const items: LightboxItem[] = attachments.map((a) => ({
    url: urls[a.id] ?? "",
    mime: a.mime,
    label: new Date(a.uploaded_at).toLocaleString(),
  })).filter(it => !!it.url);

  const count = attachments.length;
  const chip = count > 0 ? (
    <button
      type="button"
      onClick={() => count > 0 && setLbIdx(0)}
      className="inline-flex h-6 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
    >
      <Paperclip className="h-3 w-3" /> {count}
    </button>
  ) : (
    <span className="inline-flex h-6 items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 text-[10px] font-medium text-amber-700 dark:text-amber-300">
      <AlertTriangle className="h-3 w-3" /> No file
    </span>
  );

  return (
    <>
      <div className="flex items-center gap-1">
        {chip}
        <Button
          type="button" size="icon" variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(true)}
          title="Manage attachments"
        >
          <Paperclip className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0">
          <SheetHeader className="border-b border-border/40 px-4 py-3">
            <SheetTitle className="text-sm">Receipt attachments</SheetTitle>
          </SheetHeader>

          <div className="space-y-3 px-4 py-3">
            {canEdit && (
              <div className="grid grid-cols-2 gap-2">
                <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple hidden
                  onChange={(e) => { upload(e.target.files); e.currentTarget.value = ""; }} />
                <input ref={camRef} type="file" accept="image/*" capture="environment" hidden
                  onChange={(e) => { upload(e.target.files); e.currentTarget.value = ""; }} />
                <Button variant="outline" className="h-10" onClick={() => camRef.current?.click()}>
                  <Camera className="h-4 w-4" /> Camera
                </Button>
                <Button variant="outline" className="h-10" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Upload
                </Button>
              </div>
            )}

            {attachments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-6 text-center text-xs text-muted-foreground">
                No attachments yet. {canEdit ? "Add a receipt or photo." : ""}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {attachments.map((a, i) => {
                  const u = urls[a.id];
                  const isPdf = (a.mime ?? "").includes("pdf");
                  return (
                    <div key={a.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted">
                      <button type="button" onClick={() => u && setLbIdx(i)} className="absolute inset-0">
                        {isPdf || !u ? (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-muted-foreground">
                            {isPdf ? "PDF" : "…"}
                          </div>
                        ) : (
                          <img loading="lazy" decoding="async" src={u} alt="" className="h-full w-full object-cover" />
                        )}
                      </button>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => remove(a)}
                          className={cn("absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white group-hover:flex")}
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CfAttachmentLightbox
        open={lbIdx !== null}
        items={items}
        startIndex={lbIdx ?? 0}
        onClose={() => setLbIdx(null)}
      />
    </>
  );
}
