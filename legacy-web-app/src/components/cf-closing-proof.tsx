import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Upload, Trash2, ShieldCheck, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkingDate } from "@/hooks/use-working-date";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/image-upload";
import { getSignedAttachmentUrl } from "@/lib/attachment-url";
import { CfAttachmentLightbox, type LightboxItem } from "@/components/cf-attachment-lightbox";
import { useConfirm } from "@/hooks/use-confirm";
import { useProfileMap, displayProfile } from "@/hooks/use-profile-map";

type Proof = {
  id: string;
  day_date: string;
  shop_id: string | null;
  storage_path: string;
  mime: string | null;
  uploaded_by: string;
  uploaded_at: string;
};

async function logActivity(action: string, target_id: string, meta: any = {}) {
  try { await (supabase as any).from("cf_activity_log").insert({ action, target_table: "cf_closing_proofs", target_id, meta }); } catch {}
}

export function CfClosingProof() {
  const { user } = useAuth();
  const { workingDate } = useWorkingDate();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [lbIdx, setLbIdx] = useState<number | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});

  const { data: proofs = [] } = useQuery({
    queryKey: ["cf-closing-proofs", workingDate],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("cf_closing_proofs")
        .select("*")
        .eq("day_date", workingDate)
        .order("uploaded_at", { ascending: false });
      return (data ?? []) as Proof[];
    },
  });

  const profiles = useProfileMap();

  useEffect(() => {
    let dead = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const p of proofs) {
        if (urls[p.id]) { next[p.id] = urls[p.id]; continue; }
        const u = await getSignedAttachmentUrl(p.storage_path);
        if (u) next[p.id] = u;
      }
      if (!dead) setUrls(next);
    })();
    return () => { dead = true; };
  }, [proofs]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const blob = file.type.startsWith("image/") ? await compressImage(file) : file;
        const ext = file.type.startsWith("image/") ? "jpg" : (file.name.split(".").pop() || "bin").toLowerCase();
        const path = `cf-closing/${workingDate}/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, blob, {
          contentType: file.type.startsWith("image/") ? "image/jpeg" : file.type, upsert: false,
        });
        if (up.error) { toast.error(up.error.message); continue; }
        const ins = await (supabase as any).from("cf_closing_proofs").insert({
          day_date: workingDate, storage_path: path,
          mime: file.type.startsWith("image/") ? "image/jpeg" : file.type,
          uploaded_by: user.id,
        }).select("id").maybeSingle();
        if (ins.error) { toast.error(ins.error.message); continue; }
        if (ins.data?.id) logActivity("closing_proof.upload", ins.data.id, { day_date: workingDate });
      }
      qc.invalidateQueries({ queryKey: ["cf-closing-proofs", workingDate] });
      qc.invalidateQueries({ queryKey: ["cf-workflow-proofs", workingDate] });
      toast.success("Closing proof uploaded");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: Proof) => {
    if (!(await confirm({ title: "Delete closing proof?", description: "This image will be permanently removed.", confirmText: "Delete", tone: "danger" }))) return;
    await supabase.storage.from("attachments").remove([p.storage_path]);
    const { error } = await (supabase as any).from("cf_closing_proofs").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    logActivity("closing_proof.delete", p.id);
    qc.invalidateQueries({ queryKey: ["cf-closing-proofs", workingDate] });
    qc.invalidateQueries({ queryKey: ["cf-workflow-proofs", workingDate] });
  };

  const items: LightboxItem[] = proofs
    .map((p) => ({ url: urls[p.id] ?? "", mime: p.mime, label: new Date(p.uploaded_at).toLocaleString() }))
    .filter((i) => !!i.url);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 border-b border-border/40 bg-gradient-to-br from-emerald-500/5 to-transparent px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold leading-none">Closing Proof</h3>
            {proofs.length > 0 && (
              <span className="inline-flex h-4 items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-1.5 text-[9px] font-medium text-emerald-700 dark:text-emerald-300">
                Verified with Closing Proof
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Upload one final verification image before workflow closing.
          </p>
        </div>
      </div>

      <div className="space-y-3 px-4 py-3">
        <input ref={fileRef} type="file" accept="image/*,application/pdf" hidden
          onChange={(e) => { upload(e.target.files); e.currentTarget.value = ""; }} />
        <input ref={camRef} type="file" accept="image/*" capture="environment" hidden
          onChange={(e) => { upload(e.target.files); e.currentTarget.value = ""; }} />

        <div className="grid grid-cols-2 gap-2">
          <Button variant="default" className="h-10" disabled={busy} onClick={() => camRef.current?.click()}>
            <Camera className="h-4 w-4" /> Take Photo
          </Button>
          <Button variant="outline" className="h-10" disabled={busy} onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>

        {proofs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-5 text-center text-[11px] text-muted-foreground">
            <ImageIcon className="mx-auto mb-1 h-4 w-4 opacity-60" />
            No closing proof yet for {workingDate}.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {proofs.map((p, i) => {
              const u = urls[p.id];
              const isPdf = (p.mime ?? "").includes("pdf");
              const who = displayProfile(profiles[p.uploaded_by]);
              return (
                <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted">
                  <button type="button" onClick={() => u && setLbIdx(i)} className="absolute inset-0">
                    {isPdf || !u ? (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {isPdf ? "PDF" : "…"}
                      </div>
                    ) : (
                      <img loading="lazy" decoding="async" src={u} alt="closing proof" className="h-full w-full object-cover" />
                    )}
                  </button>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1 text-[9px] leading-tight text-white">
                    <div className="truncate font-medium">{who}</div>
                    <div className="opacity-80">{new Date(p.uploaded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  {(p.uploaded_by === user?.id) && (
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white group-hover:flex"
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

      <CfAttachmentLightbox
        open={lbIdx !== null}
        items={items}
        startIndex={lbIdx ?? 0}
        onClose={() => setLbIdx(null)}
      />
    </Card>
  );
}
