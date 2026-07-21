import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, c as useInfiniteQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useVirtualizer } from "../_libs/tanstack__react-virtual.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { aZ as Route$2, s as useUserAccess, ar as useDebouncedValue, B as Button, h as Badge, I as Input, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, G as DialogFooter, C as Card, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, T as Textarea } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { g as getSession, b as getStockCountSummary, u as updateItemQty, d as refreshProgress, f as getItemByBarcode, h as resetStockCountSession, i as updateSession, j as listItemsPage, c as listAdjustments, k as approveSession } from "./api-BlsQTRa2.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { as as ArrowLeft, b as RotateCcw, k as LoaderCircle, bE as ListChecks, y as Search, p as ChevronUp, m as ChevronDown, bF as Scan, a6 as EyeOff, a7 as Eye, C as CircleCheck } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__virtual-core.mjs";
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
const REASON_OPTIONS = [
  "Damage",
  "Expired",
  "Missing",
  "Counting Error",
  "Supplier Issue",
  "Other"
];
const PAGE_SIZE = 75;
const EMPTY_SUMMARY = {
  total: 0,
  counted: 0,
  diffCount: 0,
  missing: 0,
  extra: 0,
  diffValue: 0,
  prevTotalQty: 0,
  currTotalQty: 0,
  prevTotalValue: 0,
  currTotalValue: 0,
  extraProducts: 0,
  missingProducts: 0,
  nodiffProducts: 0,
  extraValue: 0,
  missingValue: 0
};
function SessionPage() {
  const {
    sessionId
  } = Route$2.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const {
    isAdmin
  } = useUserAccess();
  const {
    data: session
  } = useQuery({
    queryKey: ["sc-session", sessionId],
    queryFn: () => getSession(sessionId),
    staleTime: 3e4
  });
  const readonly = session?.status === "approved";
  const blind = !!session?.blind_count;
  const mode = session?.scan_mode ?? "manual";
  const [edits, setEdits] = reactExports.useState({});
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [scanMsg, setScanMsg] = reactExports.useState(null);
  const scanInputRef = reactExports.useRef(null);
  const itemsQuery = useInfiniteQuery({
    queryKey: ["sc-items", sessionId, filter, debouncedSearch],
    initialPageParam: 0,
    queryFn: ({
      pageParam
    }) => listItemsPage({
      sessionId,
      filter,
      search: debouncedSearch,
      offset: pageParam,
      limit: PAGE_SIZE
    }),
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length === 0) return void 0;
      const next = lastPage.offset + lastPage.items.length;
      return next < lastPage.total ? next : void 0;
    },
    staleTime: 3e4
  });
  const items = reactExports.useMemo(() => itemsQuery.data?.pages.flatMap((p) => p.items) ?? [], [itemsQuery.data]);
  const listTotal = itemsQuery.data?.pages[0]?.total ?? 0;
  const {
    data: summary = EMPTY_SUMMARY
  } = useQuery({
    queryKey: ["sc-summary", sessionId],
    queryFn: () => getStockCountSummary(sessionId),
    staleTime: 15e3
  });
  const qtyOf = reactExports.useCallback((it) => it.id in edits ? edits[it.id] : it.physical_qty, [edits]);
  const visible = items;
  const totalProducts = summary.total || session?.total_products || listTotal || 0;
  const liveStats = reactExports.useMemo(() => {
    const s = {
      ...summary
    };
    const editIds = Object.keys(edits);
    if (editIds.length === 0) return s;
    const map = new Map(items.map((i) => [i.id, i]));
    const classify = (q, frozen) => {
      if (q === null || q === void 0) return "not";
      const d = q - frozen;
      if (d > 0) return "extra";
      if (d < 0) return "missing";
      return "nodiff";
    };
    for (const id of editIds) {
      const it = map.get(id);
      if (!it) continue;
      const newQty = edits[id];
      const oldQty = it.physical_qty;
      const frozen = Number(it.frozen_qty) || 0;
      const price = Number(it.purchase_price) || 0;
      const oldEff = oldQty ?? frozen;
      const newEff = newQty ?? frozen;
      const dq = newEff - oldEff;
      s.currTotalQty += dq;
      s.currTotalValue += dq * price;
      s.diffValue += dq * price;
      if (oldQty === null && newQty !== null) s.counted += 1;
      if (oldQty !== null && newQty === null) s.counted -= 1;
      const oldC = classify(oldQty, frozen);
      const newC = classify(newQty, frozen);
      if (oldC === "extra") {
        const od = oldQty - frozen;
        s.extra -= od;
        s.extraValue -= od * price;
        s.extraProducts -= 1;
      } else if (oldC === "missing") {
        const od = frozen - oldQty;
        s.missing -= od;
        s.missingValue -= od * price;
        s.missingProducts -= 1;
      } else if (oldC === "nodiff") {
        s.nodiffProducts -= 1;
      }
      if (newC === "extra") {
        const nd = newQty - frozen;
        s.extra += nd;
        s.extraValue += nd * price;
        s.extraProducts += 1;
      } else if (newC === "missing") {
        const nd = frozen - newQty;
        s.missing += nd;
        s.missingValue += nd * price;
        s.missingProducts += 1;
      } else if (newC === "nodiff") {
        s.nodiffProducts += 1;
      }
      const wasDiff = oldC === "extra" || oldC === "missing";
      const isDiff = newC === "extra" || newC === "missing";
      if (wasDiff && !isDiff) s.diffCount -= 1;
      if (!wasDiff && isDiff) s.diffCount += 1;
    }
    return s;
  }, [summary, edits, items]);
  const stats = liveStats;
  const saveTimers = reactExports.useRef(/* @__PURE__ */ new Map());
  const saveMut = useMutation({
    mutationFn: async ({
      id,
      qty
    }) => {
      await updateItemQty(id, qty);
    },
    onSuccess: (_d, vars) => {
      qc.setQueriesData({
        queryKey: ["sc-items", sessionId]
      }, (prev) => {
        if (!prev?.pages) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page) => ({
            ...page,
            items: page.items.map((x) => x.id === vars.id ? {
              ...x,
              physical_qty: vars.qty
            } : x)
          }))
        };
      });
      qc.invalidateQueries({
        queryKey: ["sc-summary", sessionId]
      });
      qc.invalidateQueries({
        queryKey: ["sc-session", sessionId]
      });
      setEdits((e) => {
        const n = {
          ...e
        };
        delete n[vars.id];
        return n;
      });
    },
    onError: (e) => toast.error(e?.message ?? "Save failed")
  });
  const scheduleSave = reactExports.useCallback((id, qty) => {
    const timers = saveTimers.current;
    const t = timers.get(id);
    if (t) clearTimeout(t);
    const handle = setTimeout(() => {
      saveMut.mutate({
        id,
        qty
      });
      timers.delete(id);
    }, 500);
    timers.set(id, handle);
  }, [saveMut]);
  const setQty = reactExports.useCallback((it, qty) => {
    setEdits((e) => ({
      ...e,
      [it.id]: qty
    }));
    scheduleSave(it.id, qty);
  }, [scheduleSave]);
  const flushPendingEdits = reactExports.useCallback(async () => {
    const timers = saveTimers.current;
    const pending = [];
    timers.forEach((t, id) => {
      clearTimeout(t);
      if (id in edits) {
        pending.push(updateItemQty(id, edits[id]).catch(() => {
        }));
      }
    });
    timers.clear();
    if (pending.length === 0) return;
    await Promise.all(pending);
    setEdits({});
    await qc.invalidateQueries({
      queryKey: ["sc-items", sessionId]
    });
    await qc.invalidateQueries({
      queryKey: ["sc-summary", sessionId]
    });
    await qc.invalidateQueries({
      queryKey: ["sc-session", sessionId]
    });
  }, [edits, qc, sessionId]);
  const [flushing, setFlushing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handler = () => {
      saveTimers.current.forEach((t, id) => {
        clearTimeout(t);
        const qty = edits[id];
        if (qty !== void 0) {
          updateItemQty(id, qty).catch(() => {
          });
        }
      });
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      handler();
    };
  }, [edits]);
  reactExports.useEffect(() => {
    if (!session) return;
    const id = setInterval(() => {
      refreshProgress(sessionId).then(() => {
        qc.invalidateQueries({
          queryKey: ["sc-session", sessionId]
        });
        qc.invalidateQueries({
          queryKey: ["sc-summary", sessionId]
        });
      });
    }, 15e3);
    return () => clearInterval(id);
  }, [session, sessionId, qc]);
  const handleScan = reactExports.useCallback(async (code) => {
    const c = code.trim();
    if (!c) return;
    const match = items.find((it) => String(it.barcode ?? "").trim() === c) ?? await getItemByBarcode(sessionId, c);
    if (!match) {
      setScanMsg(`Not found: ${c}`);
      return;
    }
    const current = qtyOf(match) ?? 0;
    if (mode === "increment") {
      setQty(match, current + 1);
      setScanMsg(`${match.name} → ${current + 1}`);
    } else {
      setSearch(match.barcode ?? match.name);
      setScanMsg(`Selected: ${match.name}`);
      setTimeout(() => {
        const el = document.querySelector(`input[data-item-id="${match.id}"]`);
        el?.focus();
        el?.select();
      }, 350);
    }
  }, [items, mode, qtyOf, setQty, sessionId]);
  const parentRef = reactExports.useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: visible.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 8
  });
  const virtualItems = rowVirtualizer.getVirtualItems();
  reactExports.useEffect(() => {
    const last = virtualItems[virtualItems.length - 1];
    if (!last || !itemsQuery.hasNextPage || itemsQuery.isFetchingNextPage) return;
    if (last.index >= visible.length - 8) itemsQuery.fetchNextPage();
  }, [virtualItems, visible.length, itemsQuery.hasNextPage, itemsQuery.isFetchingNextPage, itemsQuery.fetchNextPage]);
  const [reviewOpen, setReviewOpen] = reactExports.useState(false);
  const [approveOpen, setApproveOpen] = reactExports.useState(false);
  const [resetOpen, setResetOpen] = reactExports.useState(false);
  const [summaryOpen, setSummaryOpen] = reactExports.useState(false);
  const resetMut = useMutation({
    mutationFn: () => resetStockCountSession(sessionId),
    onSuccess: (n) => {
      toast.success(`Reset done. ${n} products re-snapshotted.`);
      setEdits({});
      qc.invalidateQueries({
        queryKey: ["sc-items", sessionId]
      });
      qc.invalidateQueries({
        queryKey: ["sc-summary", sessionId]
      });
      qc.invalidateQueries({
        queryKey: ["sc-session", sessionId]
      });
      setResetOpen(false);
    },
    onError: (e) => toast.error(e?.message ?? "Reset failed")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-[calc(100dvh-3.5rem-var(--mobile-bottom-nav-height,0px)-env(safe-area-inset-bottom,0px))] w-full max-w-3xl flex-col overflow-hidden md:h-[calc(100dvh-3.5rem-2rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-20 border-b bg-background/95 px-2 py-1 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => navigate({
          to: "/stock-count"
        }), className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-semibold leading-tight", children: session?.name ?? "Loading…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-full px-1.5 py-0 text-[10px]", children: session?.status?.replace("_", " ") }),
            blind && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "rounded-full px-1.5 py-0 text-[10px]", children: "Blind" })
          ] })
        ] }),
        !readonly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-7 rounded-full px-2 text-xs", onClick: () => setResetOpen(true), title: "Reset counts (keeps actual stock)", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "me-1 h-3 w-3" }),
            " Reset"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-7 rounded-full px-2 text-xs", disabled: flushing, onClick: async () => {
            setFlushing(true);
            try {
              await flushPendingEdits();
            } finally {
              setFlushing(false);
            }
            setReviewOpen(true);
          }, children: [
            flushing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "me-1 h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "me-1 h-3 w-3" }),
            " Review"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { stats, total: totalProducts, blind, open: summaryOpen, onToggle: () => setSummaryOpen((v) => !v) }),
      !readonly && /* @__PURE__ */ jsxRuntimeExports.jsx(ScanBar, { ref: scanInputRef, onScan: handleScan, mode, onModeChange: (m) => {
        updateSession(sessionId, {
          scan_mode: m
        }).then(() => {
          qc.invalidateQueries({
            queryKey: ["sc-session", sessionId]
          });
        });
      }, blind, onBlindChange: (v) => {
        updateSession(sessionId, {
          blind_count: v
        }).then(() => {
          qc.invalidateQueries({
            queryKey: ["sc-session", sessionId]
          });
        });
      }, message: scanMsg }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search name or barcode", className: "h-8 pl-7 text-xs" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 mt-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [["all", `All (${totalProducts})`], ["counted", `✅ Checked (${stats.counted})`], ["not_counted", `Not Checked (${Math.max(0, totalProducts - stats.counted)})`], ["pos", `🟢 Extra (${stats.extraProducts})`], ["neg", `🔴 Missing (${stats.missingProducts})`], ["nodiff", `⚪ No Diff (${stats.nodiffProducts})`], ["diff", `Any Diff (${stats.diffCount})`]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(k), className: `whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${filter === k ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted/60 text-muted-foreground"}`, children: label }, k)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: parentRef, className: "flex-1 overflow-y-auto px-2 pb-3 pt-1", children: itemsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      " Loading items…"
    ] }) : visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: "No products match." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      height: rowVirtualizer.getTotalSize(),
      position: "relative"
    }, children: virtualItems.map((vi) => {
      const it = visible[vi.index];
      const physical = qtyOf(it);
      const diff = physical === null || physical === void 0 ? null : physical - it.frozen_qty;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: rowVirtualizer.measureElement, "data-index": vi.index, style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(${vi.start}px)`
      }, className: "pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductRow, { item: it, physical, diff, blind, readonly, onChange: (q) => setQty(it, q) }) }, it.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewSheet, { open: reviewOpen, onOpenChange: setReviewOpen, sessionId, stats: {
      ...stats,
      total: totalProducts
    }, readonly, isAdmin, onApprove: async () => {
      await flushPendingEdits();
      setReviewOpen(false);
      setApproveOpen(true);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ApproveDialog, { open: approveOpen, onOpenChange: setApproveOpen, sessionId, onApproved: () => {
      qc.invalidateQueries({
        queryKey: ["sc-session", sessionId]
      });
      qc.invalidateQueries({
        queryKey: ["sc-items", sessionId]
      });
      qc.invalidateQueries({
        queryKey: ["sc-summary", sessionId]
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
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: resetOpen, onOpenChange: setResetOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reset stock count?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This clears all counted values and re-snapshots the Previous Stock baseline from your current warehouse stock." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Actual warehouse stock is NOT changed." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setResetOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", onClick: () => resetMut.mutate(), disabled: resetMut.isPending, children: [
          resetMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "me-1 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "me-1 h-4 w-4" }),
          "Reset counts"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-2 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/stock-count", className: "text-[11px] text-muted-foreground underline", children: "← Sessions" }) })
  ] });
}
const ScanBar = reactExports.forwardRef(function ScanBar2({
  onScan,
  mode,
  onModeChange,
  blind,
  onBlindChange,
  message
}, ref) {
  const [val, setVal] = reactExports.useState("");
  const submit = () => {
    if (!val.trim()) return;
    onScan(val);
    setVal("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Scan, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ref, value: val, onChange: (e) => setVal(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }, placeholder: "Scan or type barcode", className: "h-8 pl-8 text-sm", inputMode: "search", autoComplete: "off" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, className: "h-8 rounded-xl px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scan, { className: "h-3.5 w-3.5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: mode, onValueChange: (v) => onModeChange(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-6 w-auto rounded-full px-2 text-[10px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "manual", children: "Manual qty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "increment", children: "+1 per scan" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onBlindChange(!blind), className: "flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0 text-[10px] text-muted-foreground", children: [
        blind ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Blind: ",
          blind ? "ON" : "OFF"
        ] })
      ] })
    ] }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground", children: message })
  ] });
});
function ProductRow({
  item,
  physical,
  diff,
  blind,
  readonly,
  onChange
}) {
  const isCounted = physical !== null && physical !== void 0;
  const showPrev = !blind || isCounted;
  const status = isCounted ? {
    label: "Checked",
    cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
  } : {
    label: "Not counted",
    cls: "bg-muted text-muted-foreground"
  };
  const diffBadge = isCounted && !blind ? diff === 0 ? {
    label: "0",
    cls: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
  } : (diff ?? 0) > 0 ? {
    label: `+${diff}`,
    cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
  } : {
    label: `${diff}`,
    cls: "bg-red-500/15 text-red-700 dark:text-red-300"
  } : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[13px] font-medium leading-tight", children: item.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-1.5 gap-y-0 text-[10px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Previous: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "tabular-nums text-foreground", children: showPrev ? item.frozen_qty : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Current: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "tabular-nums text-foreground", children: isCounted ? physical : "—" })
        ] }),
        diffBadge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-1 py-0 text-[9px] font-semibold ${diffBadge.cls}`, children: diffBadge.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-0.5 rounded-full px-1 py-0 text-[9px] font-medium ${status.cls}`, children: [
        isCounted && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
        status.label
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", "data-item-id": item.id, disabled: readonly, value: physical === null || physical === void 0 ? "" : String(physical), onChange: (e) => {
      const v = e.target.value;
      if (v === "") onChange(null);
      else {
        const n = Number(v);
        if (Number.isFinite(n)) onChange(n);
      }
    }, className: "h-8 w-[4rem] text-center text-sm font-semibold tabular-nums", placeholder: "qty" })
  ] }) });
}
function SummaryCard({
  stats,
  total,
  blind,
  open,
  onToggle
}) {
  const netQty = stats.currTotalQty - stats.prevTotalQty;
  const netVal = stats.currTotalValue - stats.prevTotalValue;
  const remaining = Math.max(0, total - stats.counted);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-1 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-2 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onToggle, className: "shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted", title: open ? "Hide details" : "View details", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CompactStat, { label: "Total", value: total }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CompactStat, { label: "Checked", value: stats.counted, tone: "green" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CompactStat, { label: "Remaining", value: remaining, tone: remaining > 0 ? "red" : void 0 }),
        !blind && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CompactStat, { label: "Net Diff", value: `${netQty >= 0 ? "+" : ""}${fmt(netQty)}`, tone: netQty === 0 ? void 0 : netQty > 0 ? "green" : "red" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CompactStat, { label: "Value Diff", value: Math.abs(netVal), tone: netVal === 0 ? void 0 : netVal > 0 ? "green" : "red", isMoney: true })
        ] })
      ] })
    ] }),
    open && !blind && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 bg-muted/20 px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Prev Qty", value: fmt(stats.prevTotalQty) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Curr Qty", value: fmt(stats.currTotalQty) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Net Diff", value: `${netQty >= 0 ? "+" : ""}${fmt(netQty)}`, tone: netQty === 0 ? void 0 : netQty > 0 ? "green" : "red" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ValStat, { label: "Prev Value", value: stats.prevTotalValue }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ValStat, { label: "Curr Value", value: stats.currTotalValue }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ValStat, { label: "Diff Value", value: netVal, tone: netVal >= 0 ? "green" : "red", sign: netVal >= 0 ? "+" : "−", abs: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 grid grid-cols-3 gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Extra", value: stats.extraProducts, tone: "green" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Missing", value: stats.missingProducts, tone: "red" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "No Diff", value: stats.nodiffProducts })
      ] })
    ] })
  ] });
}
function CompactStat({
  label,
  value,
  tone,
  isMoney
}) {
  const t = tone === "green" ? "text-emerald-700 dark:text-emerald-300" : tone === "red" ? "text-red-600 dark:text-red-400" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex shrink-0 flex-col items-center justify-center rounded-md border px-1.5 py-1 ${isMoney ? "min-w-[6.5rem]" : "min-w-[3.75rem]"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-wide leading-none text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-0.5 whitespace-nowrap text-[11px] font-bold tabular-nums leading-tight ${t}`, children: isMoney ? /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "sm", className: t, showSign: false }) : value })
  ] });
}
function MiniStat({
  label,
  value,
  tone
}) {
  const t = tone === "green" ? "text-emerald-700 dark:text-emerald-300" : tone === "red" ? "text-red-600 dark:text-red-400" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9.5px] uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-bold tabular-nums ${t}`, children: value })
  ] });
}
function ValStat({
  label,
  value,
  tone,
  sign,
  abs
}) {
  const t = tone === "green" ? "text-emerald-700 dark:text-emerald-300" : tone === "red" ? "text-red-600 dark:text-red-400" : "";
  const v = abs ? Math.abs(value) : value;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-background p-1.5 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9.5px] uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-bold ${t}`, children: [
      sign && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "me-0.5", children: sign }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: v, size: "sm", className: t })
    ] })
  ] });
}
function fmt(n) {
  const sign = n < 0 ? "-" : "";
  return sign + new Intl.NumberFormat("en", {
    maximumFractionDigits: 2
  }).format(Math.abs(n));
}
function ReviewSheet({
  open,
  onOpenChange,
  sessionId,
  stats,
  readonly,
  isAdmin,
  onApprove
}) {
  const {
    data: adjustments = []
  } = useQuery({
    queryKey: ["sc-adj", sessionId],
    queryFn: () => listAdjustments(sessionId),
    enabled: readonly && open,
    staleTime: 6e4
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "flex max-h-[90dvh] flex-col rounded-t-2xl p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "border-b px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Review Stock Count" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Products", value: stats.total }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Counted", value: stats.counted }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "With difference", value: stats.diffCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Missing qty", value: stats.missing, tone: "red" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Extra qty", value: stats.extra, tone: "green" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Inventory diff (value)", value: stats.diffValue.toFixed(2), tone: stats.diffValue >= 0 ? "green" : "red" })
      ] }),
      readonly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Adjustments" }),
        adjustments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No adjustments were recorded for this session." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: adjustments.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-medium", children: a.product_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] text-muted-foreground", children: a.reason ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right tabular-nums", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: a.diff_qty > 0 ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold", children: a.diff_qty > 0 ? `+${a.diff_qty}` : a.diff_qty }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10.5px] text-muted-foreground", children: [
              a.system_qty,
              " → ",
              a.physical_qty
            ] })
          ] })
        ] }, a.id)) })
      ] })
    ] }),
    !readonly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 border-t bg-background px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      isAdmin && onApprove && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onApprove, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "me-1 h-4 w-4" }),
        " Approve Stock Count"
      ] })
    ] })
  ] }) });
}
function Stat({
  label,
  value,
  tone
}) {
  const t = tone === "green" ? "text-emerald-700" : tone === "red" ? "text-red-600" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-base font-semibold tabular-nums ${t}`, children: value })
  ] });
}
function ApproveDialog({
  open,
  onOpenChange,
  sessionId,
  onApproved
}) {
  const [reason, setReason] = reactExports.useState(REASON_OPTIONS[0]);
  const [note, setNote] = reactExports.useState("");
  const mut = useMutation({
    mutationFn: () => approveSession(sessionId, reason, note),
    onSuccess: (r) => {
      toast.success(`Approved. ${r.adjustments} adjustments applied.`);
      onApproved();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e?.message ?? "Approval failed")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Approve & adjust stock" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Stock will be adjusted to match counted quantities. This action cannot be undone." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium", children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: reason, onValueChange: setReason, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: REASON_OPTIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium", children: "Note (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: note, onChange: (e) => setNote(e.target.value), rows: 2 })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => mut.mutate(), disabled: mut.isPending, children: [
        mut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "me-1 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "me-1 h-4 w-4" }),
        "Approve"
      ] })
    ] })
  ] }) });
}
export {
  SessionPage as component
};
