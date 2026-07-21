import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useSearch, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { C as Card, aI as Tabs, aJ as TabsList, aK as TabsTrigger, aL as TabsContent, aU as CashFlowPage, aV as CashCustodyPage, aW as CfWorkflowVerification, k as useAuth, o as useWorkingDate, u as useConfirm, ad as useProfileMap, aR as getSignedAttachmentUrl, B as Button, ae as displayProfile, aS as CfAttachmentLightbox, s as useUserAccess, aT as useWorkflowVerified, m as Checkbox, d as cn, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction } from "./router-KeVl8_Ln.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { compressImage } from "./image-upload-CX99TgIR.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { W as Wallet, U as Users, c as ShieldCheck, i as Camera, j as Upload, a0 as Image, T as Trash2, bk as Zap, g as CircleX, C as CircleCheck, k as LoaderCircle } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/tslib.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";



import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
async function logActivity(action, target_id, meta = {}) {
  try {
    await supabase.from("cf_activity_log").insert({ action, target_table: "cf_closing_proofs", target_id, meta });
  } catch {
  }
}
function CfClosingProof() {
  const { user } = useAuth();
  const { workingDate } = useWorkingDate();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const fileRef = reactExports.useRef(null);
  const camRef = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [lbIdx, setLbIdx] = reactExports.useState(null);
  const [urls, setUrls] = reactExports.useState({});
  const { data: proofs = [] } = useQuery({
    queryKey: ["cf-closing-proofs", workingDate],
    queryFn: async () => {
      const { data } = await supabase.from("cf_closing_proofs").select("*").eq("day_date", workingDate).order("uploaded_at", { ascending: false });
      return data ?? [];
    }
  });
  const profiles = useProfileMap();
  reactExports.useEffect(() => {
    let dead = false;
    (async () => {
      const next = {};
      for (const p of proofs) {
        if (urls[p.id]) {
          next[p.id] = urls[p.id];
          continue;
        }
        const u = await getSignedAttachmentUrl(p.storage_path);
        if (u) next[p.id] = u;
      }
      if (!dead) setUrls(next);
    })();
    return () => {
      dead = true;
    };
  }, [proofs]);
  const upload = async (files) => {
    if (!files || files.length === 0 || !user) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const blob = file.type.startsWith("image/") ? await compressImage(file) : file;
        const ext = file.type.startsWith("image/") ? "jpg" : (file.name.split(".").pop() || "bin").toLowerCase();
        const path = `cf-closing/${workingDate}/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, blob, {
          contentType: file.type.startsWith("image/") ? "image/jpeg" : file.type,
          upsert: false
        });
        if (up.error) {
          toast.error(up.error.message);
          continue;
        }
        const ins = await supabase.from("cf_closing_proofs").insert({
          day_date: workingDate,
          storage_path: path,
          mime: file.type.startsWith("image/") ? "image/jpeg" : file.type,
          uploaded_by: user.id
        }).select("id").maybeSingle();
        if (ins.error) {
          toast.error(ins.error.message);
          continue;
        }
        if (ins.data?.id) logActivity("closing_proof.upload", ins.data.id, { day_date: workingDate });
      }
      qc.invalidateQueries({ queryKey: ["cf-closing-proofs", workingDate] });
      qc.invalidateQueries({ queryKey: ["cf-workflow-proofs", workingDate] });
      toast.success("Closing proof uploaded");
    } finally {
      setBusy(false);
    }
  };
  const remove = async (p) => {
    if (!await confirm({ title: "Delete closing proof?", description: "This image will be permanently removed.", confirmText: "Delete", tone: "danger" })) return;
    await supabase.storage.from("attachments").remove([p.storage_path]);
    const { error } = await supabase.from("cf_closing_proofs").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    logActivity("closing_proof.delete", p.id);
    qc.invalidateQueries({ queryKey: ["cf-closing-proofs", workingDate] });
    qc.invalidateQueries({ queryKey: ["cf-workflow-proofs", workingDate] });
  };
  const items = proofs.map((p) => ({ url: urls[p.id] ?? "", mime: p.mime, label: new Date(p.uploaded_at).toLocaleString() })).filter((i) => !!i.url);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 border-b border-border/40 bg-gradient-to-br from-emerald-500/5 to-transparent px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold leading-none", children: "Closing Proof" }),
          proofs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-4 items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-1.5 text-[9px] font-medium text-emerald-700 dark:text-emerald-300", children: "Verified with Closing Proof" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: "Upload one final verification image before workflow closing." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileRef,
          type: "file",
          accept: "image/*,application/pdf",
          hidden: true,
          onChange: (e) => {
            upload(e.target.files);
            e.currentTarget.value = "";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: camRef,
          type: "file",
          accept: "image/*",
          capture: "environment",
          hidden: true,
          onChange: (e) => {
            upload(e.target.files);
            e.currentTarget.value = "";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "default", className: "h-10", disabled: busy, onClick: () => camRef.current?.click(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
          " Take Photo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-10", disabled: busy, onClick: () => fileRef.current?.click(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
          " Upload"
        ] })
      ] }),
      proofs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-5 text-center text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "mx-auto mb-1 h-4 w-4 opacity-60" }),
        "No closing proof yet for ",
        workingDate,
        "."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: proofs.map((p, i) => {
        const u = urls[p.id];
        const isPdf = (p.mime ?? "").includes("pdf");
        const who = displayProfile(profiles[p.uploaded_by]);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => u && setLbIdx(i), className: "absolute inset-0", children: isPdf || !u ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-[10px] font-medium text-muted-foreground", children: isPdf ? "PDF" : "…" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: u, alt: "closing proof", className: "h-full w-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1 text-[9px] leading-tight text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-medium", children: who }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-80", children: new Date(p.uploaded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
          ] }),
          p.uploaded_by === user?.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => remove(p),
              className: "absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white group-hover:flex",
              title: "Delete",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
            }
          )
        ] }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CfAttachmentLightbox,
      {
        open: lbIdx !== null,
        items,
        startIndex: lbIdx ?? 0,
        onClose: () => setLbIdx(null)
      }
    )
  ] });
}
const SAR = (n) => `SAR ${(n ?? 0).toLocaleString(void 0, { maximumFractionDigits: 2 })}`;
const rowTotal = (r) => (r.cash_amount ?? 0) + (r.due_amount ?? 0) + (r.credit_amount ?? 0);
function CfBulkVerify() {
  const { user } = useAuth();
  const { workingDate } = useWorkingDate();
  const { isAdmin, canVerify: canVerifyRaw } = useUserAccess();
  const canVerify = canVerifyRaw ?? isAdmin;
  const { verified } = useWorkflowVerified(workingDate);
  const qc = useQueryClient();
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [confirm, setConfirm] = reactExports.useState(null);
  const [processing, setProcessing] = reactExports.useState(false);
  const { data: pending = [], isLoading } = useQuery({
    queryKey: ["cf-bulk-pending", workingDate],
    queryFn: async () => {
      const { data, error } = await supabase.from("cash_flow_purchases").select("id, supplier_name, shop_id, cash_amount, due_amount, credit_amount, created_at, verify_status").eq("day_date", workingDate).eq("verify_status", "pending").eq("is_deleted", false).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  const pendingIds = reactExports.useMemo(() => pending.map((p) => p.id), [pending]);
  const pendingSet = reactExports.useMemo(() => new Set(pendingIds), [pendingIds]);
  const pendingTotal = reactExports.useMemo(() => pending.reduce((s, p) => s + rowTotal(p), 0), [pending]);
  const selectedList = reactExports.useMemo(() => pending.filter((p) => selected.has(p.id)), [pending, selected]);
  const selectedTotal = reactExports.useMemo(() => selectedList.reduce((s, p) => s + rowTotal(p), 0), [selectedList]);
  reactExports.useEffect(() => {
    setSelected((prev) => {
      const next = /* @__PURE__ */ new Set();
      prev.forEach((id) => {
        if (pendingSet.has(id)) next.add(id);
      });
      return next.size === prev.size ? prev : next;
    });
  }, [pendingSet]);
  const toggle = reactExports.useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const selectAll = () => setSelected(new Set(pendingIds));
  const clearAll = () => setSelected(/* @__PURE__ */ new Set());
  const runBatch = async (mode, ids, reason) => {
    if (!user || ids.length === 0) return;
    setProcessing(true);
    const patch = mode === "verify" ? { verify_status: "verified", verified_by: user.id, verified_at: (/* @__PURE__ */ new Date()).toISOString(), reject_reason: null } : { verify_status: "rejected", verified_by: user.id, verified_at: (/* @__PURE__ */ new Date()).toISOString(), reject_reason: reason ?? null };
    const failed = [];
    let ok = 0;
    for (const id of ids) {
      try {
        const { error } = await supabase.from("cash_flow_purchases").update(patch).eq("id", id);
        if (error) throw error;
        ok += 1;
        try {
          await supabase.from("cf_activity_log").insert({
            action: `purchase.${mode}`,
            target_table: "cash_flow_purchases",
            target_id: id,
            meta: mode === "reject" ? { reason, via: "bulk" } : { via: "bulk" }
          });
        } catch {
        }
      } catch {
        failed.push(id);
      }
    }
    setProcessing(false);
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["cf-bulk-pending", workingDate] }),
      qc.invalidateQueries({ queryKey: ["cf-workflow-pending", workingDate] }),
      qc.invalidateQueries({ queryKey: ["cf_purchases"] }),
      qc.invalidateQueries({ queryKey: ["cfpa"] }),
      qc.invalidateQueries({ queryKey: ["cf_cashin"] }),
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
      qc.invalidateQueries({ queryKey: ["reports"] }),
      qc.invalidateQueries({ queryKey: ["cash_balance"] }),
      qc.invalidateQueries({ queryKey: ["bank_balance"] })
    ]);
    if (failed.length === 0) {
      toast.success(mode === "verify" ? `✓ ${ok} transaction${ok === 1 ? "" : "s"} verified successfully.` : `✓ ${ok} transaction${ok === 1 ? "" : "s"} rejected.`);
      setSelected(/* @__PURE__ */ new Set());
    } else {
      toast.error(`${ok} succeeded · ${failed.length} failed.`);
      setSelected(new Set(failed));
    }
  };
  if (verified || !canVerify) return null;
  if (!isLoading && pending.length === 0) return null;
  const selCount = selected.size;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "sticky top-2 z-30 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background shadow-[0_6px_20px_-8px_rgba(0,0,0,0.25)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 border-b border-border/40 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold leading-none", children: "Bulk Verification" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: "Verify or reject pending purchases in one action. Finalize Workflow unlocks once Pending is 0." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 px-4 pt-3 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Pending", value: String(pending.length), tone: "amber" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Selected", value: String(selCount), tone: "primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total", value: SAR(selCount > 0 ? selectedTotal : pendingTotal), tone: "muted" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 px-4 pt-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "ghost",
            className: "h-7 px-2 text-[11px]",
            onClick: selectAll,
            disabled: pending.length === 0 || selCount === pending.length,
            children: "Select All"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "ghost",
            className: "h-7 px-2 text-[11px]",
            onClick: clearAll,
            disabled: selCount === 0,
            children: "Clear All"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-8 rounded-full px-3 text-[11px]",
              disabled: processing || selCount === 0,
              onClick: () => setConfirm("rejectSel"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
                " Reject Selected"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "h-8 rounded-full px-3 text-[11px]",
              disabled: processing || selCount === 0,
              onClick: () => setConfirm("verifySel"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                " Verify Selected"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-64 overflow-y-auto px-2 py-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-4 text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-3.5 w-3.5 animate-spin" }),
        " Loading pending…"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: pending.map((p) => {
        const checked = selected.has(p.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: cn(
              "flex items-center gap-2 rounded-lg border border-border/40 bg-background/60 px-2 py-1.5 text-[11px]",
              checked && "border-primary/50 bg-primary/5"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked, onCheckedChange: () => toggle(p.id) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1 truncate", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: p.supplier_name || "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums font-semibold", children: SAR(rowTotal(p)) })
            ]
          },
          p.id
        );
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: cn(
            "h-11 w-full rounded-xl text-sm font-semibold shadow-[0_6px_20px_-6px_rgba(16,185,129,0.55)]",
            "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110"
          ),
          disabled: processing || pending.length === 0,
          onClick: () => setConfirm("verifyAll"),
          children: [
            processing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
            "Verify All (",
            pending.length,
            ")"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirm !== null, onOpenChange: (o) => {
      if (!o && !processing) setConfirm(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: confirm === "verifyAll" ? "Verify all pending transactions?" : confirm === "verifySel" ? `Verify ${selCount} transaction${selCount === 1 ? "" : "s"}?` : `Reject ${selCount} transaction${selCount === 1 ? "" : "s"}?` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            confirm === "verifyAll" ? "Pending Entries: " : "Selected Entries: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: confirm === "verifyAll" ? pending.length : selCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Total Amount:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: SAR(confirm === "verifyAll" ? pendingTotal : selectedTotal) })
          ] }),
          confirm === "rejectSel" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px]", children: "A single reject reason will be applied to all selected entries." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: processing, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            disabled: processing,
            className: confirm === "rejectSel" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110",
            onClick: async (e) => {
              e.preventDefault();
              const mode = confirm;
              if (!mode) return;
              let reason;
              if (mode === "rejectSel") {
                const r = window.prompt("Reject reason (applied to all selected)?", "");
                if (r === null) return;
                reason = r;
              }
              setConfirm(null);
              const ids = mode === "verifyAll" ? pendingIds : Array.from(selected);
              const runMode = mode === "rejectSel" ? "reject" : "verify";
              await runBatch(runMode, ids, reason);
            },
            children: confirm === "verifyAll" ? "Verify All" : confirm === "verifySel" ? "Verify" : "Reject"
          }
        )
      ] })
    ] }) })
  ] });
}
function Stat({ label, value, tone }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
    "rounded-lg border px-2 py-1.5",
    tone === "amber" && "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300",
    tone === "primary" && "border-primary/40 bg-primary/5 text-primary",
    tone === "muted" && "border-border/50 bg-muted/30 text-foreground"
  ), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate text-sm font-semibold tabular-nums", children: value })
  ] });
}
function FinanceWorkflowPage() {
  const search = useSearch({
    from: "/_app/finance-workflow"
  });
  const nav = useNavigate({
    from: "/finance-workflow"
  });
  const tab = search.tab ?? "cash-flow";
  const tabs = reactExports.useMemo(() => {
    const items = [{
      value: "cash-flow",
      label: "Cash & Purchases",
      icon: Wallet,
      show: true
    }, {
      value: "custody",
      label: "Custody & Handovers",
      icon: Users,
      show: true
    }];
    return items.filter((t) => t.show);
  }, []);
  const setTab = (v) => nav({
    search: {
      tab: v === "cash-flow" ? void 0 : v
    },
    replace: true
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack md:pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 md:p-5 bg-gradient-to-br from-primary/8 via-background to-background border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg md:text-xl font-semibold leading-tight", children: "Finance Workflow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Cash · Purchases · Custody · OCR — one unified flow" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "inline-flex w-auto min-w-full md:min-w-0 gap-1 bg-muted/50 p-1 rounded-2xl", children: tabs.map((t) => {
        const Icon = t.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: t.value, className: "gap-2 rounded-xl px-3 py-2 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          t.label
        ] }, t.value);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "cash-flow", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CashFlowPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "custody", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CashCustodyPage, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CfClosingProof, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CfBulkVerify, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CfWorkflowVerification, {})
  ] });
}
export {
  FinanceWorkflowPage as component
};
