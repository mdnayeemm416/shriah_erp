import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as Card, B as Button, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, af as SAR } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { l as listSessions, s as startNewStockCountSession, e as endStockCountSession, a as softDeleteSession, g as getSession, b as getStockCountSummary, c as listAdjustments, r as reapplyStockCount } from "./api-BlsQTRa2.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { v as Package, as as ArrowLeft, bC as CirclePlay, bD as CircleStop, T as Trash2, k as LoaderCircle, a4 as History, u as ChevronRight, $ as FileText, J as Printer, Y as Share2, C as CircleCheck } from "../_libs/lucide-react.mjs";
import { f as format, H as differenceInMinutes } from "../_libs/date-fns.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./client-Bs6QIVWe.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
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
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
function StockCountPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [endOpen, setEndOpen] = reactExports.useState(false);
  const [discardOpen, setDiscardOpen] = reactExports.useState(false);
  const [detailsId, setDetailsId] = reactExports.useState(null);
  const sessionsQ = useQuery({
    queryKey: ["stock-count-sessions"],
    queryFn: listSessions,
    staleTime: 15e3
  });
  const active = reactExports.useMemo(() => (sessionsQ.data ?? []).find((s) => s.status === "draft" || s.status === "in_progress") ?? null, [sessionsQ.data]);
  const history = reactExports.useMemo(() => (sessionsQ.data ?? []).filter((s) => s.status === "approved"), [sessionsQ.data]);
  const startMut = useMutation({
    mutationFn: startNewStockCountSession,
    onSuccess: (s) => {
      toast.success(`${s.name} started`);
      qc.invalidateQueries({
        queryKey: ["stock-count-sessions"]
      });
      navigate({
        to: "/stock-count/$sessionId",
        params: {
          sessionId: s.id
        }
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to start")
  });
  const endMut = useMutation({
    mutationFn: () => endStockCountSession(active.id),
    onSuccess: (r) => {
      toast.success(`Stock count ended. ${r.adjustments} adjustments applied.`);
      const endedId = active.id;
      qc.invalidateQueries({
        queryKey: ["stock-count-sessions"]
      });
      qc.invalidateQueries({
        queryKey: ["sc-session", endedId]
      });
      setEndOpen(false);
      setDetailsId(endedId);
    },
    onError: (e) => toast.error(e?.message ?? "Failed to end")
  });
  const discardMut = useMutation({
    mutationFn: () => softDeleteSession(active.id),
    onSuccess: () => {
      toast.success("Stock count session discarded");
      qc.invalidateQueries({
        queryKey: ["stock-count-sessions"]
      });
      setDiscardOpen(false);
    },
    onError: (e) => toast.error(e?.message ?? "Failed to discard")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-3xl px-3 pb-6 pt-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 text-lg font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-emerald-600" }),
          " Wholesale Stock Count"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Snapshot → count → compare → save history" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/store-admin", className: "inline-flex items-center gap-1 text-xs text-muted-foreground underline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
        " Back"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-4 p-4", children: active ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider text-emerald-600", children: "Active session" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-base font-bold", children: active.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
            "Started ",
            format(new Date(active.created_at), "dd MMM yyyy, hh:mm a")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300", children: active.status.replace("_", " ") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate({
          to: "/stock-count/$sessionId",
          params: {
            sessionId: active.id
          }
        }), className: "h-11 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "me-1 h-4 w-4" }),
          " Continue counting"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setEndOpen(true), variant: "destructive", className: "h-11 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleStop, { className: "me-1 h-4 w-4" }),
          " End Stock Count"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setDiscardOpen(true), variant: "outline", className: "h-10 w-full rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "me-1 h-4 w-4" }),
        " Discard Session"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No active stock count. Start a new session to snapshot current wholesale stock." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => startMut.mutate(), disabled: startMut.isPending, className: "h-14 w-full rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-base font-bold shadow-lg hover:brightness-110", children: [
        startMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "me-2 h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "me-2 h-5 w-5" }),
        "Start Stock Count"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-1.5 text-sm font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-muted-foreground" }),
        " Stock Count History"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground tabular-nums", children: [
        history.length,
        " sessions"
      ] })
    ] }),
    sessionsQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      " Loading…"
    ] }) : history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: "No completed stock counts yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: history.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryCard, { session: s, onOpen: () => setDetailsId(s.id) }, s.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: endOpen, onOpenChange: setEndOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "End this Stock Count?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to finish this Stock Count? After ending, the stock snapshot will be finalized and the comparison report will be generated." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: endMut.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogAction, { onClick: (e) => {
          e.preventDefault();
          endMut.mutate();
        }, disabled: endMut.isPending, className: "bg-red-600 hover:bg-red-700", children: [
          endMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "me-1 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleStop, { className: "me-1 h-4 w-4" }),
          "End Stock Count"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: discardOpen, onOpenChange: setDiscardOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Discard Stock Count Session?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently delete the current Stock Count session and all counted progress. No stock adjustments will be applied. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: discardMut.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogAction, { onClick: (e) => {
          e.preventDefault();
          discardMut.mutate();
        }, disabled: discardMut.isPending, className: "bg-red-600 hover:bg-red-700", children: [
          discardMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "me-1 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "me-1 h-4 w-4" }),
          "Discard Session"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SessionDetailsSheet, { sessionId: detailsId, onClose: () => setDetailsId(null) })
  ] });
}
function HistoryCard({
  session,
  onOpen
}) {
  const start = new Date(session.created_at);
  const end = session.approved_at ? new Date(session.approved_at) : null;
  const durationMin = end ? differenceInMinutes(end, start) : 0;
  const diffVal = Number(session.diff_value ?? 0);
  const tone = diffVal === 0 ? "text-muted-foreground" : diffVal > 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onOpen, className: "block w-full text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3 transition hover:border-primary/40 active:scale-[0.99]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-bold", children: session.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[11px] text-muted-foreground", children: format(start, "dd MMM yyyy") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap gap-x-2 text-[10.5px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Start ",
          format(start, "hh:mm a")
        ] }),
        end && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "End ",
          format(end, "hh:mm a")
        ] }),
        end && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "· ",
          formatDuration(durationMin)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9.5px] uppercase tracking-wide text-muted-foreground", children: "Diff" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-bold ${tone}`, children: [
        diffVal > 0 ? "🟢 +" : diffVal < 0 ? "🔴 " : "⚪ ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Math.abs(diffVal), size: "sm", className: tone })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
  ] }) }) });
}
function formatDuration(mins) {
  if (mins < 1) return "< 1 min";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
function SessionDetailsSheet({
  sessionId,
  onClose
}) {
  const open = !!sessionId;
  const qc = useQueryClient();
  const [applyOpen, setApplyOpen] = reactExports.useState(false);
  const sessionQ = useQuery({
    queryKey: ["sc-session", sessionId],
    queryFn: () => getSession(sessionId),
    enabled: open,
    staleTime: 3e4
  });
  const summaryQ = useQuery({
    queryKey: ["sc-summary", sessionId],
    queryFn: () => getStockCountSummary(sessionId),
    enabled: open,
    staleTime: 3e4
  });
  const adjQ = useQuery({
    queryKey: ["sc-adj", sessionId],
    queryFn: () => listAdjustments(sessionId),
    enabled: open,
    staleTime: 3e4
  });
  const [filter, setFilter] = reactExports.useState("changed");
  const session = sessionQ.data;
  const summary = summaryQ.data;
  const adjustments = adjQ.data ?? [];
  const filtered = reactExports.useMemo(() => {
    if (filter === "all") return adjustments;
    if (filter === "missing") return adjustments.filter((a) => a.diff_qty < 0);
    if (filter === "extra") return adjustments.filter((a) => a.diff_qty > 0);
    return adjustments;
  }, [adjustments, filter]);
  const start = session?.created_at ? new Date(session.created_at) : null;
  const end = session?.approved_at ? new Date(session.approved_at) : null;
  const dur = start && end ? differenceInMinutes(end, start) : 0;
  const handlePrint = () => {
    if (!session || !summary) return;
    printStockCountReport(session, summary, adjustments);
  };
  const handleShare = async () => {
    if (!session) return;
    const text = shareText(session, summary, adjustments);
    try {
      if (navigator.share) {
        await navigator.share({
          title: session.name,
          text
        });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Report copied to clipboard");
      }
    } catch {
    }
  };
  const applyMut = useMutation({
    mutationFn: () => reapplyStockCount(sessionId),
    onSuccess: (r) => {
      toast.success(`Stock applied to ${r.applied} products`);
      setApplyOpen(false);
      qc.invalidateQueries({
        queryKey: ["sc-session", sessionId]
      });
      qc.invalidateQueries({
        queryKey: ["stock-count-sessions"]
      });
      qc.invalidateQueries({
        queryKey: ["store-products"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["shop_products"]
      });
      qc.invalidateQueries({
        queryKey: ["wholesale-dashboard-summary"]
      });
      qc.invalidateQueries({
        queryKey: ["wh-financials"]
      });
      qc.invalidateQueries({
        queryKey: ["low-stock"]
      });
      qc.invalidateQueries({
        queryKey: ["price-compare-products"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to apply stock")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange: (v) => {
    if (!v) onClose();
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "max-h-[92dvh] overflow-y-auto rounded-t-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
        " ",
        session?.name ?? "Session"
      ] }) }),
      sessionQ.isLoading || summaryQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        " Loading…"
      ] }) : !session || !summary ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: "Not found." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Start", value: start ? format(start, "dd MMM, hh:mm a") : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "End", value: end ? format(end, "dd MMM, hh:mm a") : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Duration", value: end ? formatDuration(dur) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Products", value: `${summary.counted} / ${summary.total}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Stock Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Prev Qty", value: fmt(summary.prevTotalQty) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Curr Qty", value: fmt(summary.currTotalQty) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Net Diff", value: netQtyLabel(summary), tone: netQtyTone(summary) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-3 gap-2 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MoneyMini, { label: "Prev Value", value: summary.prevTotalValue }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MoneyMini, { label: "Curr Value", value: summary.currTotalValue }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MoneyMini, { label: "Diff Value", value: summary.currTotalValue - summary.prevTotalValue, signed: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: handlePrint, className: "rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "me-1 h-3.5 w-3.5" }),
            " Print"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: handlePrint, className: "rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "me-1 h-3.5 w-3.5" }),
            " Export PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: handleShare, className: "rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "me-1 h-3.5 w-3.5" }),
            " Share"
          ] })
        ] }),
        session.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-500/30 bg-amber-500/5 p-3", children: session.stock_applied ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[12px] text-emerald-700 dark:text-emerald-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Stock Already Applied" }),
            session.stock_applied_at && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] text-muted-foreground", children: format(new Date(session.stock_applied_at), "dd MMM yyyy, hh:mm a") })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[11.5px] leading-snug text-muted-foreground", children: "Recovery: update the current Wholesale stock using the counted quantities from this session. History is not changed." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setApplyOpen(true), className: "h-9 w-full rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 text-white hover:brightness-110", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "me-1 h-4 w-4" }),
            " Apply This Stock Count"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Product Differences" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground tabular-nums", children: filtered.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex flex-wrap gap-1", children: [["changed", `Changed (${adjustments.length})`], ["missing", `🔴 Missing (${adjustments.filter((a) => a.diff_qty < 0).length})`], ["extra", `🟢 Extra (${adjustments.filter((a) => a.diff_qty > 0).length})`], ["all", "All"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(k), className: `rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${filter === k ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted/60 text-muted-foreground"}`, children: label }, k)) }),
          adjustments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border p-4 text-center text-sm text-muted-foreground", children: "No differences — stock matched the snapshot exactly." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border p-4 text-center text-sm text-muted-foreground", children: "Nothing to show for this filter." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(DiffRow, { adj: a }, a.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: applyOpen, onOpenChange: setApplyOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Apply Stock Count?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will update the current Wholesale stock using the counted quantities from this completed Stock Count session. History will remain unchanged. This can only be done once." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: applyMut.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogAction, { onClick: (e) => {
          e.preventDefault();
          applyMut.mutate();
        }, disabled: applyMut.isPending, className: "bg-amber-600 hover:bg-amber-700", children: [
          applyMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "me-1 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "me-1 h-4 w-4" }),
          "Apply Stock"
        ] })
      ] })
    ] }) })
  ] });
}
function DiffRow({
  adj
}) {
  const positive = adj.diff_qty > 0;
  const tone = positive ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 rounded-lg border p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: adj.product_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10.5px] text-muted-foreground tabular-nums", children: [
        fmt(Number(adj.system_qty)),
        " → ",
        fmt(Number(adj.physical_qty))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-bold tabular-nums ${tone}`, children: [
        positive ? "🟢 +" : "🔴 ",
        fmt(Math.abs(adj.diff_qty))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-[10.5px] font-semibold ${tone}`, children: [
        positive ? "+" : "−",
        SAR(Math.abs(Number(adj.diff_value)))
      ] })
    ] })
  ] });
}
function Info({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold", children: value })
  ] });
}
function Mini({
  label,
  value,
  tone
}) {
  const t = tone === "green" ? "text-emerald-700 dark:text-emerald-300" : tone === "red" ? "text-red-600 dark:text-red-400" : tone === "muted" ? "text-muted-foreground" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9.5px] uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-bold tabular-nums ${t}`, children: value })
  ] });
}
function MoneyMini({
  label,
  value,
  signed
}) {
  const tone = !signed ? "" : value > 0 ? "text-emerald-700 dark:text-emerald-300" : value < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-1.5 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9.5px] uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-bold ${tone}`, children: [
      signed && value !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "me-0.5", children: value > 0 ? "🟢 +" : "🔴 −" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Math.abs(value), size: "sm", className: tone })
    ] })
  ] });
}
function netQtyLabel(s) {
  const d = s.currTotalQty - s.prevTotalQty;
  if (d === 0) return "⚪ 0";
  return d > 0 ? `🟢 +${fmt(d)}` : `🔴 ${fmt(d)}`;
}
function netQtyTone(s) {
  const d = s.currTotalQty - s.prevTotalQty;
  if (d === 0) return "muted";
  return d > 0 ? "green" : "red";
}
function fmt(n) {
  const sign = n < 0 ? "-" : "";
  return sign + new Intl.NumberFormat("en", {
    maximumFractionDigits: 2
  }).format(Math.abs(n));
}
function shareText(session, summary, adjustments) {
  const s = summary;
  const start = new Date(session.created_at);
  const end = session.approved_at ? new Date(session.approved_at) : null;
  const lines = [`${session.name}`, `Start: ${format(start, "dd MMM yyyy, hh:mm a")}`, end ? `End:   ${format(end, "dd MMM yyyy, hh:mm a")}` : "", s ? `Products: ${s.counted}/${s.total}` : "", s ? `Prev Qty: ${fmt(s.prevTotalQty)}   Curr Qty: ${fmt(s.currTotalQty)}   Diff: ${fmt(s.currTotalQty - s.prevTotalQty)}` : "", s ? `Prev Value: ${SAR(s.prevTotalValue)}   Curr Value: ${SAR(s.currTotalValue)}   Diff: ${SAR(s.currTotalValue - s.prevTotalValue)}` : "", "", `Changed products: ${adjustments.length}`, ...adjustments.slice(0, 40).map((a) => `- ${a.product_name}: ${fmt(Number(a.system_qty))} → ${fmt(Number(a.physical_qty))} (${a.diff_qty > 0 ? "+" : ""}${fmt(a.diff_qty)}, ${SAR(a.diff_value)})`), adjustments.length > 40 ? `…and ${adjustments.length - 40} more` : ""].filter(Boolean);
  return lines.join("\n");
}
function printStockCountReport(session, summary, adjustments) {
  const start = new Date(session.created_at);
  const end = session.approved_at ? new Date(session.approved_at) : null;
  const dur = end ? differenceInMinutes(end, start) : 0;
  const netQ = summary.currTotalQty - summary.prevTotalQty;
  const netV = summary.currTotalValue - summary.prevTotalValue;
  const rows = adjustments.map((a) => `<tr>
        <td>${escapeHtml(a.product_name)}</td>
        <td class="num">${fmt(Number(a.system_qty))}</td>
        <td class="num">${fmt(Number(a.physical_qty))}</td>
        <td class="num ${a.diff_qty > 0 ? "pos" : a.diff_qty < 0 ? "neg" : ""}">${a.diff_qty > 0 ? "+" : ""}${fmt(a.diff_qty)}</td>
        <td class="num ${a.diff_value > 0 ? "pos" : a.diff_value < 0 ? "neg" : ""}">${SAR(a.diff_value)}</td>
      </tr>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"/>
    <title>${escapeHtml(session.name)}</title>
    <style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:24px;color:#111}
      h1{margin:0 0 4px;font-size:20px}
      .sub{color:#666;font-size:12px;margin-bottom:16px}
      .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:12px 0}
      .card{border:1px solid #e5e7eb;border-radius:8px;padding:8px}
      .label{font-size:10px;text-transform:uppercase;color:#6b7280;letter-spacing:.05em}
      .value{font-size:14px;font-weight:700;margin-top:2px}
      table{width:100%;border-collapse:collapse;margin-top:12px;font-size:12px}
      th,td{border-bottom:1px solid #eee;padding:6px 8px;text-align:left}
      th{background:#f9fafb;font-size:11px;text-transform:uppercase;color:#6b7280;letter-spacing:.03em}
      .num{text-align:right;font-variant-numeric:tabular-nums}
      .pos{color:#047857}
      .neg{color:#b91c1c}
      @media print{@page{margin:12mm}}
    </style></head><body>
    <h1>Azzouz WholeSale</h1>
    <div class="sub">${escapeHtml(session.name)} · Printed ${format(/* @__PURE__ */ new Date(), "dd MMM yyyy, hh:mm a")}</div>
    <div class="grid">
      <div class="card"><div class="label">Start</div><div class="value">${format(start, "dd MMM yyyy, hh:mm a")}</div></div>
      <div class="card"><div class="label">End</div><div class="value">${end ? format(end, "dd MMM yyyy, hh:mm a") : "—"}</div></div>
      <div class="card"><div class="label">Duration</div><div class="value">${end ? formatDuration(dur) : "—"}</div></div>
      <div class="card"><div class="label">Products</div><div class="value">${summary.counted} / ${summary.total}</div></div>
      <div class="card"><div class="label">Prev Qty</div><div class="value">${fmt(summary.prevTotalQty)}</div></div>
      <div class="card"><div class="label">Curr Qty</div><div class="value">${fmt(summary.currTotalQty)}</div></div>
      <div class="card"><div class="label">Prev Value</div><div class="value">${SAR(summary.prevTotalValue)}</div></div>
      <div class="card"><div class="label">Curr Value</div><div class="value">${SAR(summary.currTotalValue)}</div></div>
      <div class="card"><div class="label">Net Qty Diff</div><div class="value ${netQ > 0 ? "pos" : netQ < 0 ? "neg" : ""}">${netQ > 0 ? "+" : ""}${fmt(netQ)}</div></div>
      <div class="card"><div class="label">Net Value Diff</div><div class="value ${netV > 0 ? "pos" : netV < 0 ? "neg" : ""}">${SAR(netV)}</div></div>
    </div>
    <h2 style="font-size:14px;margin:16px 0 4px">Product Differences (${adjustments.length})</h2>
    ${adjustments.length === 0 ? "<div style='color:#666;font-size:12px'>No differences.</div>" : `
    <table>
      <thead><tr><th>Product</th><th class="num">Prev</th><th class="num">Curr</th><th class="num">Diff Qty</th><th class="num">Diff Value</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`}
    <script>window.onload = function(){setTimeout(function(){window.print()}, 200)}<\/script>
    </body></html>`;
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) {
    toast.error("Pop-up blocked. Allow pop-ups to print.");
    return;
  }
  w.document.write(html);
  w.document.close();
}
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
export {
  StockCountPage as component
};
