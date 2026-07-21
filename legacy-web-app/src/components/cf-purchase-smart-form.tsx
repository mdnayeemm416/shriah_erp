import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Upload, Plus, Sparkles, Loader2, X, CheckCircle2, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { scanDocument } from "@/lib/ai-scan.functions";
import { scanDocumentCached } from "@/lib/ocr-cache";
import { enhanceForOcr } from "@/lib/image-preprocess";
import { fetchAliases, matchAlias, learnAlias } from "@/lib/alias-matching";

export type SmartPurchaseInput = {
  company: string;
  cash: number;
  due: number;
  credit: number;
  notes: string;
  ocr_confidence: "low" | "medium" | "high" | null;
  ocr_meta: any | null;
  receiptFile: File | null;
};

type ScanResult = {
  company: string | null;
  amount: number | null;
  date: string | null;
  confidence: "low" | "medium" | "high";
  matchedCanonical: string | null;
  matchScore: number | null;
  raw: any;
};

const CONF_TONE: Record<string, string> = {
  high: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function CfPurchaseSmartForm({
  onSubmit,
  busy,
}: {
  onSubmit: (v: SmartPurchaseInput) => void;
  busy: boolean;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [company, setCompany] = useState("");
  const [cash, setCash] = useState("");
  const [due, setDue] = useState("");
  const [credit, setCredit] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [aliasSaved, setAliasSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const { data: aliases = [] } = useQuery({
    queryKey: ["aliases"],
    queryFn: fetchAliases,
    staleTime: 5 * 60_000,
  });

  const saveAlias = async (rawAlias: string, canonical: string) => {
    try {
      await learnAlias(rawAlias, canonical, "manual");
      setAliasSaved(true);
      qc.invalidateQueries({ queryKey: ["aliases"] });
      toast.success(`Alias saved: "${rawAlias}" → ${canonical}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save alias");
    }
  };

  const scanFn = useServerFn(scanDocument);

  const attachAndScan = useMutation({
    mutationFn: async (raw: File) => {
      const enhanced = await enhanceForOcr(raw, { maxEdge: 1400, quality: 0.78 });
      const reader = new FileReader();
      const dataUrl: string = await new Promise((res, rej) => {
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(enhanced);
      });
      const result: any = await scanDocumentCached({
        imageDataUrl: dataUrl, mimeType: enhanced.type,
      });
      return { enhanced, dataUrl, result };
    },
    onSuccess: ({ enhanced, dataUrl, result }) => {
      setFile(enhanced);
      setPreview(dataUrl);
      // Heuristic: pick best amount candidate
      const amount =
        Number(result?.grand_total) ||
        Number(result?.cash_buy_total) ||
        Number(result?.due_buy_total) ||
        null;
      const rawCompany =
        (typeof result?.shop_name === "string" && result.shop_name) ||
        (Array.isArray(result?.rows) && result.rows[0]?.brand) ||
        null;
      let matched: string | null = null;
      let matchScore: number | null = null;
      if (rawCompany) {
        const m = matchAlias(rawCompany, aliases);
        if (m) {
          matched = m.canonical;
          matchScore = m.score;
        }
      }
      const conf: "low" | "medium" | "high" =
        result?.field_confidence?.totals === "high" ? "high" :
        result?.field_confidence?.totals === "medium" ? "medium" :
        result?.confidence === "high" ? "high" :
        result?.confidence === "medium" ? "medium" : "low";

      const detectedCompany = matched ?? rawCompany ?? "";
      setScan({
        company: detectedCompany || null,
        amount,
        date: result?.date ?? null,
        confidence: conf,
        matchedCanonical: matched,
        matchScore,
        raw: result,
      });
      // Auto-fill only empty fields — manual-first flow
      if (!company.trim() && detectedCompany) setCompany(detectedCompany);
      if (!cash && !due && !credit && amount && amount > 0) setCash(String(amount));
      toast.success("Receipt scanned");
    },
    onError: (e: any) => toast.error(e?.message ?? "OCR failed"),
  });

  const pickFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setScan(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
    attachAndScan.mutate(f);
  };

  const clearAttachment = () => {
    setFile(null);
    setPreview(null);
    setScan(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) { toast.error("Company required"); return; }
    const c = Number(cash) || 0, d = Number(due) || 0, cr = Number(credit) || 0;
    if (c + d + cr <= 0) { toast.error("Enter at least one amount"); return; }

    // Best-effort: learn alias if user accepted a fuzzy suggestion or typed something distinct
    if (scan?.company && scan.company.trim() && company.trim() &&
        scan.company.trim().toLowerCase() !== company.trim().toLowerCase()) {
      learnAlias(scan.company, company.trim(), "auto").catch(() => {});
    }

    onSubmit({
      company: company.trim(),
      cash: c, due: d, credit: cr,
      notes: notes.trim(),
      ocr_confidence: scan?.confidence ?? null,
      ocr_meta: scan ? {
        amount: scan.amount,
        date: scan.date,
        detected_company: scan.company,
        matched_canonical: scan.matchedCanonical,
        match_score: scan.matchScore,
      } : null,
      receiptFile: file,
    });

    setCompany(""); setCash(""); setDue(""); setCredit(""); setNotes("");
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null); setScan(null); setAliasSaved(false);
  };

  // Amount mismatch warning
  const enteredTotal = (Number(cash) || 0) + (Number(due) || 0) + (Number(credit) || 0);
  const amountMismatch =
    scan?.amount && enteredTotal > 0 &&
    Math.abs(scan.amount - enteredTotal) > Math.max(2, scan.amount * 0.02);

  // Alias-learning opportunity: OCR detected a name, user typed something different
  const detected = scan?.company?.trim() ?? "";
  const typed = company.trim();
  const aliasOpportunity =
    !aliasSaved &&
    detected.length > 0 &&
    typed.length > 0 &&
    detected.toLowerCase() !== typed.toLowerCase();

  return (
    <form className="space-y-2" onSubmit={submit}>
      <div className="grid grid-cols-3 gap-1.5">
        <Input
          className="col-span-3 h-10 text-sm"
          placeholder="Company (Almarai, Nadec…)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <Input className="h-10" placeholder="Cash" inputMode="decimal" value={cash} onChange={e => setCash(e.target.value)} />
        <Input className="h-10" placeholder="Due" inputMode="decimal" value={due} onChange={e => setDue(e.target.value)} />
        <Input className="h-10" placeholder="Credit" inputMode="decimal" value={credit} onChange={e => setCredit(e.target.value)} />
        <Input className="col-span-3 h-9 text-xs" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      {/* Attach + OCR */}
      <div className="grid grid-cols-2 gap-1.5">
        <input ref={camRef} type="file" accept="image/*" capture="environment" hidden
          onChange={(e) => { pickFile(e.target.files?.[0] ?? null); e.currentTarget.value = ""; }} />
        <input ref={fileRef} type="file" accept="image/*,application/pdf" hidden
          onChange={(e) => { pickFile(e.target.files?.[0] ?? null); e.currentTarget.value = ""; }} />
        <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => camRef.current?.click()} disabled={attachAndScan.isPending}>
          <Camera className="h-4 w-4" /> Scan receipt
        </Button>
        <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => fileRef.current?.click()} disabled={attachAndScan.isPending}>
          <Upload className="h-4 w-4" /> Upload
        </Button>
      </div>

      {/* OCR preview card */}
      {(preview || attachAndScan.isPending || scan) && (
        <div className="flex items-stretch gap-2 rounded-xl border border-border/60 bg-muted/30 p-2">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            {preview ? (
              preview.startsWith("data:application/pdf") || file?.type === "application/pdf"
                ? <div className="grid h-full place-items-center text-[10px] font-medium text-muted-foreground">PDF</div>
                : <img loading="lazy" decoding="async" src={preview} alt="receipt" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-[10px] text-muted-foreground">…</div>
            )}
            <button
              type="button"
              onClick={clearAttachment}
              className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-white"
              title="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            {attachAndScan.isPending ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Running OCR…
              </div>
            ) : scan ? (
              <>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="font-semibold">Detected</span>
                  <Badge variant="outline" className={cn("h-5 px-1.5 text-[9px] capitalize", CONF_TONE[scan.confidence])}>
                    {scan.confidence} confidence
                  </Badge>
                </div>
                <div className="text-[11px] leading-tight text-muted-foreground">
                  {scan.company && <div>Supplier: <b className="text-foreground">{scan.company}</b>{scan.matchedCanonical && scan.matchScore && scan.matchScore < 1 ? <span className="ml-1 text-[10px] text-muted-foreground">(matched)</span> : null}</div>}
                  {scan.amount != null && <div>Amount: <b className="text-foreground">{scan.amount}</b></div>}
                  {scan.date && <div>Date: <b className="text-foreground">{scan.date}</b></div>}
                </div>
                {amountMismatch && (
                  <p className="text-[10px] text-amber-700 dark:text-amber-400">
                    ⚠ Entered total differs from receipt total — double-check.
                  </p>
                )}
                {aliasOpportunity && (
                  <button
                    type="button"
                    onClick={() => saveAlias(detected, typed)}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20"
                  >
                    <BookmarkPlus className="h-3 w-3" />
                    Save "{detected}" → {typed}
                  </button>
                )}
                {aliasSaved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Alias saved
                  </span>
                )}
              </>
            ) : (
              <div className="text-[11px] text-muted-foreground">Receipt attached.</div>
            )}
          </div>
        </div>
      )}

      <Button type="submit" disabled={busy || attachAndScan.isPending} className="h-11 w-full rounded-xl text-sm font-semibold">
        {file
          ? <><CheckCircle2 className="h-4 w-4" /> Add Purchase with Receipt</>
          : <><Plus className="h-4 w-4" /> Add Purchase</>}
      </Button>
    </form>
  );
}
