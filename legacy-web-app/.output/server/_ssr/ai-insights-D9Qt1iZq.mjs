import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { aY as Route$a, s as useUserAccess, d as cn, I as Input, B as Button, C as Card, af as SAR, v as pageKeyFromPath, h as Badge, aX as SHOP_ORDER } from "./router-KeVl8_Ln.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { p as parseSmartQuery } from "./smart-query-D0_hbLNl.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { AiShareModal } from "./ai-share-modal-BfCrU7G9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { l as Sparkles, at as Calendar, y as Search, X, k as LoaderCircle, b3 as Send, aQ as ArrowRight, bt as Compass, $ as FileText, bu as MicOff, bv as Mic, ae as TrendingUp, bw as ExternalLink, Y as Share2, aA as Info, m as ChevronDown, aa as Store, ai as Building2, U as Users, v as Package, W as Wallet, bx as ReceiptText } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
const METRIC_LABEL = {
  cash_sale: "Cash Sale",
  pos_sale: "POS Sale",
  bank_sale: "Bank Sale",
  credit_sale: "Credit Sale",
  total_sale: "Total Sale",
  cash_buy: "Cash Buy",
  due_payment: "Due Payment",
  credit_buy: "Credit Buy",
  total_purchase: "Total Purchase",
  expense: "Expense",
  withdraw: "Withdraw",
  employee_given: "Employee Given",
  employee_received: "Employee Received",
  other_income: "Other Income",
  cash_position: "Cash Position",
  plus_minus: "Plus / Minus",
  daily_closing: "Daily Closing",
  expected_cash: "Expected Cash",
  actual_cash: "Actual Cash"
};
const METRIC_PHRASES = [
  [/\btotal\s*sale(s)?\b/, "total_sale"],
  [/\btotal\s*purchase(s)?\b/, "total_purchase"],
  [/\bcash\s*sale\b/, "cash_sale"],
  [/\bpos\s*sale\b/, "pos_sale"],
  [/\bbank\s*sale\b/, "bank_sale"],
  [/\bcredit\s*sale\b/, "credit_sale"],
  [/\bcash\s*buy\b/, "cash_buy"],
  [/\bcredit\s*buy\b/, "credit_buy"],
  [/\bdue\s*payment\b|\bdue\b/, "due_payment"],
  [/\bemployee\s*given\b|\bgiven\s*employee\b|\bsalary\s*given\b/, "employee_given"],
  [/\bemployee\s*received\b|\breceived\s*employee\b|\bsalary\s*received\b/, "employee_received"],
  [/\bemployee\s*payment\b|\bemployee\b/, "employee_given"],
  [/\bother\s*income\b|\bextra\s*income\b/, "other_income"],
  [/\bcash\s*position\b/, "cash_position"],
  [/\bplus\s*minus\b|\bdifference\b/, "plus_minus"],
  [/\bdaily\s*closing\b|\bclosing\b/, "daily_closing"],
  [/\bexpected\s*cash\b/, "expected_cash"],
  [/\bactual\s*cash\b|\bcounted\s*cash\b/, "actual_cash"],
  [/\bexpense(s)?\b/, "expense"],
  [/\bwithdraw(al)?\b/, "withdraw"],
  [/\bpurchase(s)?\b/, "total_purchase"],
  [/\bsale(s)?\b/, "total_sale"]
];
const REPORT_RE = /\ball\s*shop\s*report\b|\bfull\s*report\b|\bcompany\s*summary\b|\ball\s*shops\s*summary\b|\bcompany\s*report\b|\breport\b|\bsummary\b/;
const SHOP_NAMES = [...SHOP_ORDER, "Warehouse"];
const DEFAULT_CASHIERS = ["Anwer", "Imran", "Sajib", "Saiful"];
function matchName(low, names) {
  for (const n of names) {
    const re = new RegExp(`\\b${n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (re.test(low)) return n;
  }
  return null;
}
function parseErpIntent(input, entities = {}) {
  const matched = [];
  const low = " " + (input || "").toLowerCase() + " ";
  let reportMode = false;
  const reportHit = low.match(REPORT_RE);
  if (reportHit) {
    reportMode = true;
    matched.push(reportHit[0].trim());
  }
  let scope = "all";
  for (const name of SHOP_NAMES) {
    const re = new RegExp(`\\b${name.toLowerCase()}\\b`);
    const m = low.match(re);
    if (m) {
      scope = name.toLowerCase() === "warehouse" ? "warehouse" : name;
      matched.push(m[0].trim());
      break;
    }
  }
  const cashierPool = Array.from(/* @__PURE__ */ new Set([...entities.cashiers ?? [], ...DEFAULT_CASHIERS]));
  const cashier = matchName(low, cashierPool);
  if (cashier) matched.push(cashier.toLowerCase());
  const employee = matchName(low, entities.employees ?? []);
  if (employee) matched.push(employee.toLowerCase());
  const party = matchName(low, entities.parties ?? []);
  if (party) matched.push(party.toLowerCase());
  let metric = null;
  if (!reportMode) {
    for (const [re, m] of METRIC_PHRASES) {
      const hit = low.match(re);
      if (hit) {
        metric = m;
        matched.push(hit[0].trim());
        break;
      }
    }
  }
  if (!metric && !reportMode && party) metric = "total_purchase";
  if (!metric && !reportMode && employee) metric = "employee_given";
  return { metric, scope, cashier, employee, party, reportMode, matched };
}
function hasErpIntent(i) {
  return i.reportMode || i.metric != null;
}
async function fetchShopIdByName(name) {
  const { data } = await supabase.from("shops").select("id, name").eq("is_deleted", false).ilike("name", name).limit(1);
  return data?.[0]?.id ?? null;
}
async function fetchCashierIdByName(name, shopId) {
  let qb = supabase.from("cashiers").select("id, name, shop_id").eq("is_deleted", false).ilike("name", name);
  if (shopId) qb = qb.eq("shop_id", shopId);
  const { data } = await qb.limit(1);
  return data?.[0]?.id ?? null;
}
async function fetchEmployeeIdByName(name) {
  const { data } = await supabase.from("employees").select("id, name").eq("is_deleted", false).ilike("name", name).limit(1);
  return data?.[0]?.id ?? null;
}
async function shopAggregates(shopId, cashierId, b) {
  let qb = supabase.from("shop_entries").select("id, txn_date, entry_type, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, notes, shop_id, cashier_id, shops(name), cashiers(name)").eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  if (shopId) qb = qb.eq("shop_id", shopId);
  if (cashierId) qb = qb.eq("cashier_id", cashierId);
  const { data } = await qb.order("txn_date", { ascending: false }).limit(2e3);
  const tot = { cash_sale: 0, pos_sale: 0, bank_sale: 0, credit_sale: 0, purchase: 0, withdraw: 0, expense: 0 };
  const rows = data ?? [];
  for (const r of rows) {
    if (r.entry_type === "sale") {
      tot.cash_sale += +r.cash_sale || 0;
      tot.pos_sale += +r.pos_sale || 0;
      tot.bank_sale += +r.bank_sale || 0;
      tot.credit_sale += +r.credit_sale || 0;
    } else if (r.entry_type === "purchase") tot.purchase += +r.purchase_amount || 0;
    else if (r.entry_type === "withdraw") tot.withdraw += +r.withdraw_amount || 0;
    else if (r.entry_type === "expense") tot.expense += +r.expense_amount || 0;
  }
  return { tot, rows };
}
async function warehouseAggregates(party, b) {
  let qb = supabase.from("warehouse_ledger").select("id, txn_date, entry_type, payment_status, amount, paid_amount, remaining_due, party_name, notes").eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  if (party) qb = qb.ilike("party_name", party);
  const { data } = await qb.order("txn_date", { ascending: false }).limit(2e3);
  const tot = { cash_buy: 0, credit_buy: 0, due_payment: 0, total_purchase: 0 };
  const rows = data ?? [];
  for (const r of rows) {
    if (r.entry_type === "warehouse_purchase") {
      const a = +r.amount || 0;
      tot.total_purchase += a;
      if (r.payment_status === "cash") tot.cash_buy += a;
      else if (r.payment_status === "credit") tot.credit_buy += a;
      else if (r.payment_status === "partial") {
        tot.cash_buy += +r.paid_amount || 0;
        tot.credit_buy += +r.remaining_due || 0;
      }
    } else if (r.entry_type === "supplier_payment") {
      tot.due_payment += +r.amount || 0;
    }
  }
  return { tot, rows };
}
async function employeeAggregates(employeeId, b) {
  let qb = supabase.from("employee_entries").select("id, txn_date, entry_type, amount, notes, employee_id, employees:employee_id(name)").eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  if (employeeId) qb = qb.eq("employee_id", employeeId);
  const { data } = await qb.order("txn_date", { ascending: false }).limit(2e3);
  const tot = { given: 0, received: 0 };
  const rows = data ?? [];
  for (const r of rows) {
    const a = +r.amount || 0;
    if (r.entry_type === "given") tot.given += a;
    else tot.received += a;
  }
  return { tot, rows };
}
async function otherIncome(b) {
  let qb = supabase.from("overview_entries").select("entry_type, amount").eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  const { data } = await qb.limit(2e3);
  let total = 0;
  for (const r of data ?? []) {
    if (r.entry_type === "income" || r.entry_type === "other_income") total += +r.amount || 0;
  }
  return total;
}
async function closingAggregates(b) {
  let qb = supabase.from("daily_closings").select("expected_cash, counted_cash, difference, closing_date").eq("is_deleted", false);
  if (b.from) qb = qb.gte("closing_date", b.from);
  if (b.to) qb = qb.lte("closing_date", b.to);
  const { data } = await qb.limit(1e3);
  const tot = { expected: 0, actual: 0, diff: 0, count: 0 };
  for (const r of data ?? []) {
    tot.expected += +r.expected_cash || 0;
    tot.actual += +r.counted_cash || 0;
    tot.diff += +r.difference || 0;
    tot.count++;
  }
  return tot;
}
function scopeLabel(intent) {
  const bits = [];
  if (intent.scope === "warehouse") bits.push("Warehouse");
  else if (intent.scope !== "all") bits.push(intent.scope);
  if (intent.cashier) bits.push(intent.cashier);
  if (intent.employee) bits.push(intent.employee);
  if (intent.party) bits.push(intent.party);
  return bits.length ? bits.join(" · ") : "All Shops";
}
function dateLabel(b) {
  if (!b.from && !b.to) return "All time";
  if (b.from && b.to && b.from === b.to) return b.from;
  return `${b.from ?? "…"} → ${b.to ?? "…"}`;
}
function shopEntriesToBreakdown(rows, pick, label, limit = 25) {
  return rows.map((r) => ({
    id: r.id,
    kind: "shop",
    label: label(r),
    date: r.txn_date,
    amount: pick(r),
    note: r.notes ?? void 0
  })).filter((e) => e.amount > 0).slice(0, limit);
}
async function runMetric(intent, b) {
  if (!intent.metric) return null;
  const sLabel = scopeLabel(intent);
  const dLabel = dateLabel(b);
  const m = intent.metric;
  const shopId = intent.scope !== "all" && intent.scope !== "warehouse" ? await fetchShopIdByName(intent.scope) : null;
  const cashierId = intent.cashier ? await fetchCashierIdByName(intent.cashier, shopId) : null;
  const employeeId = intent.employee ? await fetchEmployeeIdByName(intent.employee) : null;
  if (["cash_sale", "pos_sale", "bank_sale", "credit_sale", "total_sale", "expense", "withdraw"].includes(m)) {
    const { tot: t, rows } = await shopAggregates(shopId, cashierId, b);
    let value = 0;
    let entries = [];
    if (m === "cash_sale") {
      value = t.cash_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"), (r) => +r.cash_sale || 0, (r) => `Cash Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "pos_sale") {
      value = t.pos_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"), (r) => +r.pos_sale || 0, (r) => `POS Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "bank_sale") {
      value = t.bank_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"), (r) => +r.bank_sale || 0, (r) => `Bank Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "credit_sale") {
      value = t.credit_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"), (r) => +r.credit_sale || 0, (r) => `Credit Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "total_sale") {
      value = t.cash_sale + t.pos_sale + t.bank_sale + t.credit_sale;
      entries = shopEntriesToBreakdown(
        rows.filter((r) => r.entry_type === "sale"),
        (r) => (+r.cash_sale || 0) + (+r.pos_sale || 0) + (+r.bank_sale || 0) + (+r.credit_sale || 0),
        (r) => `Sale · ${r.shops?.name ?? ""}`
      );
    } else if (m === "expense") {
      value = t.expense;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "expense"), (r) => +r.expense_amount || 0, (r) => `Expense · ${r.shops?.name ?? ""}`);
    } else if (m === "withdraw") {
      value = t.withdraw;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "withdraw"), (r) => +r.withdraw_amount || 0, (r) => `Withdraw · ${r.shops?.name ?? ""}`);
    }
    const breakdown = m === "total_sale" ? [
      { label: "Cash", value: t.cash_sale },
      { label: "POS", value: t.pos_sale },
      { label: "Bank", value: t.bank_sale },
      { label: "Credit", value: t.credit_sale }
    ] : void 0;
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, breakdown, entries, intent };
  }
  if (m === "cash_position") {
    const { tot: t } = await shopAggregates(shopId, cashierId, b);
    const value = t.cash_sale + t.withdraw - (t.purchase + t.expense);
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, intent };
  }
  if (["cash_buy", "credit_buy", "due_payment", "total_purchase"].includes(m)) {
    const { tot: w, rows } = await warehouseAggregates(intent.party, b);
    const value = w[m] ?? 0;
    const entries = rows.filter((r) => {
      if (m === "due_payment") return r.entry_type === "supplier_payment";
      if (m === "credit_buy") return r.entry_type === "warehouse_purchase" && (r.payment_status === "credit" || r.payment_status === "partial");
      if (m === "cash_buy") return r.entry_type === "warehouse_purchase" && (r.payment_status === "cash" || r.payment_status === "partial");
      return r.entry_type === "warehouse_purchase";
    }).slice(0, 25).map((r) => ({
      id: r.id,
      kind: "warehouse",
      label: `${r.entry_type === "supplier_payment" ? "Payment" : "Purchase"} · ${r.party_name ?? ""}`,
      date: r.txn_date,
      amount: +r.amount || 0,
      note: r.notes ?? void 0
    }));
    return {
      metric: m,
      label: METRIC_LABEL[m],
      value,
      scopeLabel: intent.party ? `${intent.party} · Warehouse` : "Warehouse",
      dateLabel: dLabel,
      entries,
      intent
    };
  }
  if (m === "employee_given" || m === "employee_received") {
    const { tot: e, rows } = await employeeAggregates(employeeId, b);
    const value = m === "employee_given" ? e.given : e.received;
    const entries = rows.filter((r) => r.entry_type === (m === "employee_given" ? "given" : "received")).slice(0, 25).map((r) => ({
      id: r.id,
      kind: "employee",
      label: `${m === "employee_given" ? "Given" : "Received"} · ${r.employees?.name ?? ""}`,
      date: r.txn_date,
      amount: +r.amount || 0,
      note: r.notes ?? void 0
    }));
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, entries, intent };
  }
  if (m === "other_income") {
    const value = await otherIncome(b);
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, intent };
  }
  if (m === "plus_minus" || m === "expected_cash" || m === "actual_cash" || m === "daily_closing") {
    const c = await closingAggregates(b);
    const value = m === "plus_minus" ? c.diff : m === "expected_cash" ? c.expected : m === "actual_cash" ? c.actual : c.diff;
    const breakdown = m === "daily_closing" ? [
      { label: "Expected", value: c.expected },
      { label: "Actual", value: c.actual },
      { label: "Difference", value: c.diff },
      { label: "Closings", value: c.count }
    ] : void 0;
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, breakdown, intent };
  }
  return null;
}
async function runReport(intent, b) {
  const sLabel = scopeLabel(intent);
  const dLabel = dateLabel(b);
  const shopId = intent.scope !== "all" && intent.scope !== "warehouse" ? await fetchShopIdByName(intent.scope) : null;
  const cashierId = intent.cashier ? await fetchCashierIdByName(intent.cashier, shopId) : null;
  const employeeId = intent.employee ? await fetchEmployeeIdByName(intent.employee) : null;
  const [s, w, e, c] = await Promise.all([
    shopAggregates(shopId, cashierId, b),
    warehouseAggregates(intent.party, b),
    employeeAggregates(employeeId, b),
    closingAggregates(b)
  ]);
  const totalSale = s.tot.cash_sale + s.tot.pos_sale + s.tot.bank_sale + s.tot.credit_sale;
  const cashPosition = s.tot.cash_sale + s.tot.withdraw - (s.tot.purchase + s.tot.expense);
  return {
    scopeLabel: sLabel,
    dateLabel: dLabel,
    intent,
    rows: [
      { label: "Cash Sale", value: s.tot.cash_sale },
      { label: "POS Sale", value: s.tot.pos_sale },
      { label: "Bank Sale", value: s.tot.bank_sale },
      { label: "Credit Sale", value: s.tot.credit_sale },
      { label: "Total Sale", value: totalSale, emphasis: true },
      { label: "Shop Purchase", value: s.tot.purchase },
      { label: "Warehouse Purchase", value: w.tot.total_purchase },
      { label: "Expense", value: s.tot.expense },
      { label: "Withdraw", value: s.tot.withdraw },
      { label: "Employee Given", value: e.tot.given },
      { label: "Employee Received", value: e.tot.received },
      { label: "Cash Position", value: cashPosition, emphasis: true },
      { label: "Plus / Minus", value: c.diff, emphasis: true }
    ]
  };
}
const W = 1080;
const H = 1350;
function nowStamp() {
  const d = /* @__PURE__ */ new Date();
  const pad2 = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function fmt(n) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(n || 0);
}
function setupCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#6366f1");
  grad.addColorStop(1, "#22d3ee");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 12);
  return { ctx, canvas };
}
function drawHeader(ctx, query) {
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 56px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("Magic Search", 80, 140);
  ctx.fillStyle = "#64748b";
  ctx.font = "500 28px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("AI ERP Reporting", 80, 188);
  ctx.fillStyle = "#f1f5f9";
  const qy = 230;
  const padX = 32, padY = 22;
  ctx.font = "500 30px system-ui, -apple-system, 'Segoe UI', sans-serif";
  const tw = Math.min(ctx.measureText(query).width + padX * 2, W - 160);
  roundRect(ctx, 80, qy, tw, 64, 16);
  ctx.fill();
  ctx.fillStyle = "#334155";
  ctx.fillText(truncate(ctx, query, W - 160 - padX * 2), 80 + padX, qy + 64 - padY);
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function truncate(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 4 && ctx.measureText(s + "…").width > maxW) s = s.slice(0, -1);
  return s + "…";
}
function drawFooter(ctx) {
  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 22px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(`Generated ${nowStamp()}`, 80, H - 130);
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 28px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("Generated by Manager AhsAN", 80, H - 80);
  ctx.fillStyle = "#64748b";
  ctx.font = "500 24px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("ShRiAh Group", 80, H - 48);
}
function renderMetricImage(r, query) {
  const { ctx, canvas } = setupCanvas();
  drawHeader(ctx, query || r.label);
  const cardY = 340;
  ctx.fillStyle = "#fafafa";
  roundRect(ctx, 80, cardY, W - 160, 380, 28);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#64748b";
  ctx.font = "600 26px system-ui, -apple-system, sans-serif";
  ctx.fillText(r.label.toUpperCase(), 120, cardY + 70);
  ctx.fillStyle = "#0f172a";
  ctx.font = "800 110px system-ui, -apple-system, sans-serif";
  ctx.fillText(`SAR ${fmt(r.value)}`, 120, cardY + 200);
  ctx.fillStyle = "#475569";
  ctx.font = "500 26px system-ui, -apple-system, sans-serif";
  ctx.fillText(`Scope: ${r.scopeLabel}`, 120, cardY + 260);
  ctx.fillText(`Date: ${r.dateLabel}`, 120, cardY + 300);
  if (r.intent.cashier) ctx.fillText(`Cashier: ${r.intent.cashier}`, 120, cardY + 340);
  if (r.breakdown && r.breakdown.length) {
    let y = cardY + 440;
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 30px system-ui, -apple-system, sans-serif";
    ctx.fillText("Breakdown", 80, y);
    y += 40;
    for (const b of r.breakdown) {
      ctx.fillStyle = "#64748b";
      ctx.font = "500 26px system-ui, -apple-system, sans-serif";
      ctx.fillText(b.label, 100, y);
      ctx.fillStyle = "#0f172a";
      ctx.font = "700 26px system-ui, -apple-system, sans-serif";
      const t = fmt(b.value);
      ctx.fillText(t, W - 80 - ctx.measureText(t).width, y);
      y += 44;
    }
  }
  drawFooter(ctx);
  return canvas.toDataURL("image/png");
}
function renderReportImage(r, query) {
  const { ctx, canvas } = setupCanvas();
  drawHeader(ctx, query || `${r.scopeLabel} Report`);
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 36px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${r.scopeLabel} Summary`, 80, 360);
  ctx.fillStyle = "#64748b";
  ctx.font = "500 24px system-ui, -apple-system, sans-serif";
  ctx.fillText(r.dateLabel, 80, 396);
  let y = 460;
  for (const row of r.rows) {
    ctx.fillStyle = row.emphasis ? "#0f172a" : "#475569";
    ctx.font = `${row.emphasis ? 700 : 500} 28px system-ui, -apple-system, sans-serif`;
    ctx.fillText(row.label, 100, y);
    const t = fmt(row.value);
    ctx.fillText(t, W - 100 - ctx.measureText(t).width, y);
    if (row.emphasis) {
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, y + 14);
      ctx.lineTo(W - 80, y + 14);
      ctx.stroke();
    }
    y += 50;
  }
  drawFooter(ctx);
  return canvas.toDataURL("image/png");
}
function renderCompareImage(r, query) {
  const { ctx, canvas } = setupCanvas();
  drawHeader(ctx, query || `${r.aLabel} vs ${r.bLabel}`);
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 38px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${r.aLabel}  vs  ${r.bLabel}`, 80, 360);
  ctx.fillStyle = "#64748b";
  ctx.font = "500 24px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${r.kind.toUpperCase()} · ${r.dateLabel}`, 80, 396);
  if (r.winner !== "tie") {
    ctx.fillStyle = "#b45309";
    ctx.font = "700 28px system-ui, -apple-system, sans-serif";
    const lead = r.winner === "a" ? r.aLabel : r.bLabel;
    ctx.fillText(`🏆 ${lead} leads on ${r.headline.label}`, 80, 440);
  }
  let y = 500;
  ctx.fillStyle = "#64748b";
  ctx.font = "600 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("METRIC", 100, y);
  ctx.textAlign = "right";
  ctx.fillText(r.aLabel.toUpperCase(), 640, y);
  ctx.fillText(r.bLabel.toUpperCase(), W - 100, y);
  ctx.textAlign = "left";
  y += 36;
  for (const row of r.rows) {
    ctx.fillStyle = "#475569";
    ctx.font = "500 26px system-ui, -apple-system, sans-serif";
    ctx.fillText(row.label, 100, y);
    ctx.textAlign = "right";
    ctx.fillStyle = row.a > row.b ? "#059669" : "#0f172a";
    ctx.font = `${row.a > row.b ? 700 : 500} 26px system-ui, -apple-system, sans-serif`;
    ctx.fillText(fmt(row.a), 640, y);
    ctx.fillStyle = row.b > row.a ? "#059669" : "#0f172a";
    ctx.font = `${row.b > row.a ? 700 : 500} 26px system-ui, -apple-system, sans-serif`;
    ctx.fillText(fmt(row.b), W - 100, y);
    ctx.textAlign = "left";
    y += 44;
  }
  drawFooter(ctx);
  return canvas.toDataURL("image/png");
}
function shareCaption(label, value, scope, range, query) {
  return `*AI Copilot*
${label}: ${SAR(value)}
${scope} · ${range}
Query: "${query}"
— Manager AhsAN · ShRiAh Group`;
}
function deepLinkFromMetric(r) {
  const params = {};
  const scope = r.intent.scope;
  if (scope && scope !== "all" && scope !== "warehouse") params.shop = scope;
  const m = r.metric;
  if (["cash_sale", "pos_sale", "bank_sale", "credit_sale", "total_sale"].includes(m)) {
    params.source = "shop";
  } else if (m === "expense") params.source = "expense";
  else if (m === "withdraw") params.source = "withdraw";
  else if (m === "cash_buy" || m === "credit_buy" || m === "total_purchase") params.source = "purchase";
  if (r.entries && r.entries.length > 0) {
    const dates = r.entries.map((e) => e.date).filter((d) => !!d).sort();
    if (dates[0]) params.from = dates[0];
    if (dates[dates.length - 1]) params.to = dates[dates.length - 1];
  }
  return params;
}
function ActionRow({ onInfo, onShare, onOpen, infoOpen }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-end gap-1", children: [
    onOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onOpen,
        className: "inline-flex h-8 items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/15 active:bg-primary/20",
        "aria-label": "Open source entries",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
          " Open Entries"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onInfo,
        className: "inline-flex h-8 items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2.5 text-[11px] font-medium text-foreground/80 hover:bg-muted active:bg-muted/80",
        "aria-label": "Show calculation breakdown",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }),
          " Info",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("h-3 w-3 transition-transform", infoOpen && "rotate-180") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onShare,
        className: "inline-flex h-8 items-center gap-1 rounded-full bg-emerald-500 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-600 active:bg-emerald-700",
        "aria-label": "Share via WhatsApp",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
          " Share"
        ]
      }
    )
  ] });
}
function ErpMetricCard({
  r,
  query = "",
  onOpenEntry
}) {
  const [infoOpen, setInfoOpen] = reactExports.useState(false);
  const [shareOpen, setShareOpen] = reactExports.useState(false);
  const [shareUrl, setShareUrl] = reactExports.useState(null);
  const navigate = useNavigate();
  const handleShare = () => {
    setShareUrl(renderMetricImage(r, query));
    setShareOpen(true);
  };
  const handleEntry = (e) => {
    if (onOpenEntry) return onOpenEntry(e);
    if (e.kind === "employee") {
      navigate({ to: "/employees" });
    } else {
      navigate({ to: "/summary" });
    }
  };
  const handleOpenSource = () => {
    const params = deepLinkFromMetric(r);
    if (r.intent.scope === "warehouse") {
      navigate({ to: "/summary" });
    } else {
      navigate({ to: "/summary", search: params });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-3.5 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
      " AI Copilot"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: handleOpenSource,
        className: "mt-1 flex w-full items-baseline justify-between gap-2 rounded-lg text-left hover:bg-primary/5 active:bg-primary/10 -mx-1 px-1 py-0.5 transition-colors",
        "aria-label": "Open source entries",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[13px] font-medium text-foreground/90", children: r.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: r.value, size: "xl" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: [
      r.scopeLabel,
      " · ",
      r.dateLabel
    ] }),
    r.breakdown && r.breakdown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid grid-cols-2 gap-1.5", children: r.breakdown.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md bg-muted/40 px-2 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: b.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold tabular-nums", children: Math.abs(b.value).toLocaleString("en", { maximumFractionDigits: 2 }) })
    ] }, b.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ActionRow,
      {
        onInfo: () => setInfoOpen((v) => !v),
        onShare: handleShare,
        onOpen: handleOpenSource,
        infoOpen
      }
    ),
    infoOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-xl border border-border/50 bg-muted/30 p-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Live Calculation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-foreground/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          r.label,
          ":"
        ] }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: SAR(r.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-1.5 space-y-0.5 text-[10.5px] text-muted-foreground", children: [
        r.intent.scope !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Shop: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: r.intent.scope === "warehouse" ? "Warehouse" : r.intent.scope })
        ] }),
        r.intent.cashier && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Cashier: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: r.intent.cashier })
        ] }),
        r.intent.employee && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Employee: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: r.intent.employee })
        ] }),
        r.intent.party && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Party: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: r.intent.party })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Date: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: r.dateLabel })
        ] })
      ] }),
      r.entries && r.entries.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          "Included entries (",
          r.entries.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1 max-h-56 divide-y divide-border/40 overflow-y-auto rounded-md border border-border/40 bg-background", children: r.entries.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleEntry(e),
            className: "flex w-full items-center justify-between gap-2 px-2 py-2 text-left hover:bg-muted/60 active:bg-muted/80",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] font-medium", children: e.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: e.date })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[11px] font-semibold tabular-nums", children: SAR(e.amount) })
            ]
          }
        ) }, e.id)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[10.5px] italic text-muted-foreground/80", children: "No itemised entries for this metric." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AiShareModal,
      {
        open: shareOpen,
        onOpenChange: setShareOpen,
        dataUrl: shareUrl,
        filename: `magic-${r.metric}.png`,
        caption: shareCaption(r.label, r.value, r.scopeLabel, r.dateLabel, query)
      }
    )
  ] });
}
function ErpReportCard({
  r,
  query = ""
}) {
  const [shareOpen, setShareOpen] = reactExports.useState(false);
  const [shareUrl, setShareUrl] = reactExports.useState(null);
  const navigate = useNavigate();
  const handleShare = () => {
    setShareUrl(renderReportImage(r, query));
    setShareOpen(true);
  };
  const handleOpenSource = () => {
    const scope = r.intent.scope;
    const params = {};
    if (scope && scope !== "all" && scope !== "warehouse") params.shop = scope;
    if (scope === "warehouse") {
      navigate({ to: "/summary" });
    } else {
      navigate({ to: "/summary", search: params });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-3.5 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
      " AI Copilot · Report"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: handleOpenSource,
        className: "mt-0.5 flex w-full items-baseline justify-between gap-2 rounded-lg text-left hover:bg-primary/5 active:bg-primary/10 -mx-1 px-1 py-0.5 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[13px] font-semibold", children: [
            r.scopeLabel,
            " Summary"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: r.dateLabel })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 divide-y divide-border/40", children: r.rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        className: cn(
          "flex items-center justify-between gap-2 py-1.5",
          row.emphasis && "font-semibold"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[12px]", !row.emphasis && "text-muted-foreground"), children: row.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] tabular-nums", children: row.value.toLocaleString("en", { maximumFractionDigits: 2 }) })
        ]
      },
      row.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-end gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleOpenSource,
          className: "inline-flex h-8 items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/15 active:bg-primary/20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
            " Open Entries"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleShare,
          className: "inline-flex h-8 items-center gap-1 rounded-full bg-emerald-500 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-600 active:bg-emerald-700",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
            " Share"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AiShareModal,
      {
        open: shareOpen,
        onOpenChange: setShareOpen,
        dataUrl: shareUrl,
        filename: "copilot-report.png",
        caption: `*AI Copilot Report*
${r.scopeLabel} · ${r.dateLabel}
Query: "${query}"
— Manager AhsAN · ShRiAh Group`
      }
    )
  ] });
}
const NAV_PATTERNS = [
  [/\b(open|go to|show)\s+(shop|shops)\b/i, "/shop", "Shop"],
  [/\b(open|go to|show)\s+report(s)?\b/i, "/reports", "Reports"],
  [/\b(open|go to|show)\s+(transactions?|txn)\b/i, "/summary", "Transactions"],
  [/\b(open|go to|show)\s+(daily\s*closing|closing)\b/i, "/daily-closing", "Daily Closing"],
  [/\b(open|go to|show)\s+employees?\b/i, "/employees", "Employees"],
  [/\b(open|go to|show)\s+summary\b/i, "/summary", "Summary"],
  [/\b(open|go to|show)\s+settings\b/i, "/settings", "Settings"]
];
function detectNavigationIntent(input) {
  for (const [re, to, label] of NAV_PATTERNS) {
    if (re.test(input)) return { kind: "navigate", to, label };
  }
  return null;
}
function detectEntryIntent(raw, sq, erp) {
  if (sq.amount == null) return null;
  const low = raw.toLowerCase();
  let type = null;
  if (/\bpurchase|buy|bought\b/.test(low)) type = "purchase";
  else if (/\bexpense|cost|spent|fuel\b/.test(low)) type = "expense";
  else if (/\bwithdraw\b/.test(low)) type = "withdraw";
  else if (/\b(employee\s+given|given\s+employee|salary\s+given)\b/.test(low)) type = "employee_given";
  else if (/\b(employee\s+received|received\s+employee|salary\s+received)\b/.test(low)) type = "employee_received";
  if (!type) return null;
  const note = (sq.text || "").trim() || null;
  return {
    kind: "entry",
    type,
    amount: sq.amount,
    date: sq.dateFrom ?? sq.dateTo ?? null,
    shop: erp.scope !== "all" && erp.scope !== "warehouse" ? erp.scope : null,
    party: erp.party,
    employee: erp.employee,
    note
  };
}
const INSIGHT_SUGGESTIONS = [
  "Summarise this week's performance",
  "Which shop has highest expense?",
  "Flag cash differences over SAR 100",
  "Top suppliers by spend",
  "Show employee payout summary",
  "Which employee received most money?"
];
function pad$1(n) {
  return String(n).padStart(2, "0");
}
function ymd$1(d) {
  return `${d.getFullYear()}-${pad$1(d.getMonth() + 1)}-${pad$1(d.getDate())}`;
}
function resolveQuickRange(r) {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  let from = new Date(today), to = new Date(today);
  switch (r) {
    case "today":
      break;
    case "yesterday":
      from.setDate(from.getDate() - 1);
      to = new Date(from);
      break;
    case "this_week":
      from.setDate(from.getDate() - from.getDay());
      break;
    case "this_month":
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "last_month":
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "custom":
      return null;
  }
  return { from: ymd$1(from), to: ymd$1(to) };
}
const TIME_PHRASES = [
  "today",
  "yesterday",
  "this week",
  "last week",
  "this month",
  "last month"
];
const TYPE_PHRASES = [
  "purchase",
  "sale",
  "expense",
  "withdraw",
  "due",
  "cash sale",
  "credit sale",
  "bank sale",
  "pos sale",
  "total sale",
  "cash buy",
  "credit buy",
  "due payment",
  "total purchase",
  "employee given",
  "employee received",
  "salary",
  "other income",
  "cash position",
  "plus minus",
  "daily closing",
  "expected cash",
  "actual cash",
  "all shop report",
  "full report",
  "company summary",
  "cash position",
  "cash health",
  "business stability score"
];
const WHY_PHRASES = [
  "Why was cash short yesterday?",
  "Why did expense increase this week?",
  "Why is warehouse cost high?",
  "Why was sale low yesterday?",
  "Why did purchase spike this month?",
  "Compare this month vs last month",
  "Top suppliers this month",
  "Highest due supplier",
  "Which employee received most money?",
  "Employee payout summary",
  "How healthy is cash flow this month?",
  "Business stability score",
  "Daily summary",
  "Weekly summary"
];
const SHOP_PHRASES = ["azzouz", "nujum", "aklas", "khaled", "warehouse"];
const CASHIER_PHRASES = ["anwer", "imran", "sajib", "saiful"];
const BASE_TEMPLATES = (() => {
  const out = [];
  for (const t of TIME_PHRASES) {
    for (const ty of TYPE_PHRASES) {
      out.push(`${t} ${ty}`);
      out.push(`${ty} ${t}`);
    }
  }
  for (const sh of SHOP_PHRASES) {
    for (const ty of TYPE_PHRASES) out.push(`${sh} ${ty}`);
    for (const t of TIME_PHRASES) {
      out.push(`${t} ${sh} cash sale`);
      out.push(`${t} ${sh} purchase`);
      out.push(`${t} ${sh} expense`);
    }
  }
  for (const c of CASHIER_PHRASES) {
    out.push(`${c} cash sale today`);
    out.push(`${c} pos sale`);
    out.push(`${c} total sale`);
    out.push(`today ${c} cash sale`);
    out.push(`this month ${c} total sale`);
  }
  for (const t of TIME_PHRASES) {
    out.push(`${t} all shop report`);
    out.push(`${t} full report`);
    out.push(`${t} employee given`);
    out.push(`${t} employee received`);
  }
  for (const t of TIME_PHRASES) out.push(t);
  for (const ty of TYPE_PHRASES) out.push(ty);
  return Array.from(new Set(out));
})();
const PARTY_SUFFIXES = [
  "due",
  "purchase",
  "cash buy",
  "credit buy",
  "monthly purchase",
  "payment",
  "this month"
];
function buildSuggestionPool(parties, cashiers = [], employees = []) {
  const pool = [...BASE_TEMPLATES];
  for (const p of parties) {
    const name = p.trim();
    if (!name) continue;
    pool.push(name);
    for (const s of PARTY_SUFFIXES) pool.push(`${name} ${s}`);
  }
  for (const c of cashiers) {
    const n = c.trim();
    if (!n) continue;
    pool.push(`${n} cash sale today`);
    pool.push(`${n} pos sale`);
    pool.push(`${n} total sale`);
    pool.push(`this month ${n} total sale`);
  }
  for (const e of employees) {
    const n = e.trim();
    if (!n) continue;
    pool.push(`${n} employee given`);
    pool.push(`${n} employee payment`);
    pool.push(`this month ${n} salary`);
  }
  for (const w of WHY_PHRASES) pool.push(w);
  return pool;
}
function rankSuggestions(input, pool, limit = 6) {
  const q = input.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  for (const s of pool) {
    const low = s.toLowerCase();
    if (low === q) continue;
    let score = -1;
    if (low.startsWith(q)) score = 3;
    else if (low.includes(" " + q)) score = 2;
    else if (low.includes(q)) score = 1;
    if (score > 0) scored.push({ s, score: score * 100 - s.length });
  }
  scored.sort((a, b) => b.score - a.score);
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const { s } of scored) {
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}
const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "sept",
  "oct",
  "nov",
  "dec",
  "january",
  "february",
  "march",
  "april",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];
const TX_TYPES = [
  "sale",
  "sales",
  "purchase",
  "purchases",
  "buy",
  "bought",
  "expense",
  "expenses",
  "withdraw",
  "withdrawal",
  "withdrawn",
  "cost",
  "spent",
  "salary",
  "payroll",
  "employee",
  "staff",
  "worker",
  "supplier",
  "ledger",
  "closing",
  "close",
  "ocr",
  "scan"
];
const PAYMENTS = ["cash", "bank", "pos", "card", "credit", "due", "pending"];
const COMMANDS = [
  "open",
  "go",
  "show",
  "view",
  "report",
  "reports",
  "summary",
  "compare",
  "vs",
  "versus",
  "top",
  "highest",
  "lowest",
  "why",
  "how",
  "when",
  "what",
  "total",
  "this",
  "last",
  "next",
  "today",
  "yesterday",
  "week",
  "month",
  "year",
  "given",
  "received",
  "income",
  "money",
  "position",
  "difference",
  "stability",
  "health",
  "score",
  "payment",
  "payments"
];
const TIME_GLUE = ["today", "yesterday", "week", "month", "year", "weekend"];
const TYPO_FIX = {
  azzoz: "azzouz",
  azouz: "azzouz",
  azouze: "azzouz",
  azzou: "azzouz",
  nojom: "nujum",
  nujm: "nujum",
  nujom: "nujum",
  aklass: "aklas",
  aklaas: "aklas",
  khald: "khaled",
  khalid: "khaled",
  warehous: "warehouse",
  wherehouse: "warehouse",
  emplye: "employee",
  emploee: "employee",
  employe: "employee",
  emplyee: "employee",
  wdraw: "withdraw",
  withraw: "withdraw",
  withdr: "withdraw",
  withdrawl: "withdrawal",
  exprnse: "expense",
  expence: "expense",
  expenes: "expense",
  prchase: "purchase",
  purchse: "purchase",
  perchase: "purchase",
  recived: "received",
  recieved: "received",
  recive: "receive",
  empoyee: "employee",
  suplier: "supplier",
  suppler: "supplier",
  ystrday: "yesterday",
  yesturday: "yesterday",
  yestrday: "yesterday",
  todayy: "today",
  tody: "today",
  rport: "report",
  reort: "report",
  reprt: "report",
  setings: "settings",
  setting: "settings",
  comapre: "compare",
  comp: "compare",
  // Bengali / Arabic-ish phonetic short forms
  almeray: "almarai",
  almerai: "almarai",
  almeraie: "almarai"
};
let _dict = null;
let _dictArr = [];
function buildDictionary(extra = {}) {
  const all = /* @__PURE__ */ new Set();
  const add = (w) => {
    const t = (w || "").trim().toLowerCase();
    if (t && /^[a-z][a-z0-9]*$/.test(t)) all.add(t);
    if (t) {
      for (const p of t.split(/\s+/)) if (/^[a-z][a-z0-9]*$/.test(p)) all.add(p);
    }
  };
  [...MONTHS, ...TX_TYPES, ...PAYMENTS, ...COMMANDS, ...TIME_GLUE].forEach(add);
  ["azzouz", "nujum", "aklas", "khaled", "warehouse", "anwer", "imran", "sajib", "saiful"].forEach(add);
  (extra.shops ?? []).forEach(add);
  (extra.cashiers ?? []).forEach(add);
  (extra.employees ?? []).forEach(add);
  (extra.parties ?? []).forEach(add);
  _dict = all;
  _dictArr = Array.from(all);
}
function ensureDict() {
  if (!_dict) buildDictionary();
  return _dict;
}
function lev(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}
function correctToken(tok) {
  const low = tok.toLowerCase();
  if (!low || low.length < 2) return tok;
  if (/^\d+(\.\d+)?$/.test(low)) return low;
  if (TYPO_FIX[low]) return TYPO_FIX[low];
  const dict = ensureDict();
  if (dict.has(low)) return low;
  if (!/^[a-z]{3,}$/.test(low)) return tok;
  let best = null;
  for (const w of _dictArr) {
    if (Math.abs(w.length - low.length) > 2) continue;
    const d = lev(low, w);
    if (d <= 1 || low.length >= 5 && d === 2) {
      if (!best || d < best.d || d === best.d && w.length > best.word.length) {
        best = { word: w, d };
      }
    }
  }
  return best ? best.word : tok;
}
function splitGlued(tok) {
  const low = tok.toLowerCase();
  if (!low || low.length < 4) return [tok];
  if (/^\d+$/.test(low)) return [low];
  if (low.includes(" ")) return [low];
  const dict = ensureDict();
  if (dict.has(low)) return [low];
  const m = low.match(/^(\d{1,2})([a-z]+)$/);
  if (m) {
    const rest = splitGlued(m[2]);
    return [m[1], ...rest];
  }
  const out = [];
  let i = 0;
  while (i < low.length) {
    let matched = "";
    for (let j = Math.min(low.length, i + 14); j > i + 1; j--) {
      const sub = low.slice(i, j);
      if (dict.has(sub) || TYPO_FIX[sub]) {
        matched = sub;
        break;
      }
    }
    if (!matched) {
      for (let j = Math.min(low.length, i + 8); j >= i + 4; j--) {
        const sub = low.slice(i, j);
        const fix = correctToken(sub);
        if (fix !== sub) {
          matched = fix;
          i = j;
          break;
        }
      }
      if (!matched) return [low];
    } else {
      i += matched.length;
    }
    out.push(TYPO_FIX[matched] ?? matched);
  }
  return out.length > 1 ? out : [low];
}
function normalizeQuery(raw) {
  if (!raw) return "";
  let s = raw.toString();
  s = s.replace(/(\d)([a-zA-Z])/g, "$1 $2").replace(/([a-zA-Z])(\d)/g, "$1 $2");
  s = s.replace(/\s+/g, " ").trim();
  const tokens = s.split(" ");
  const out = [];
  for (const tok of tokens) {
    if (!tok) continue;
    if (/^\d+(\.\d+)?$/.test(tok)) {
      out.push(tok);
      continue;
    }
    const parts = splitGlued(tok);
    for (const p of parts) out.push(correctToken(p));
  }
  return out.join(" ");
}
function suggestCorrection(raw) {
  const n = normalizeQuery(raw);
  if (!n || n.toLowerCase() === raw.toLowerCase().replace(/\s+/g, " ").trim()) return null;
  return n;
}
const COMPARE_RE = /\bcompare\s+(.+?)\s+(?:and|vs|versus|with|to)\s+(.+)$/i;
const VS_RE = /^(.+?)\s+(?:vs|versus)\s+(.+)$/i;
const PERIOD_TOKENS = [
  "this month",
  "last month",
  "this week",
  "last week",
  "today",
  "yesterday",
  "this year",
  "last year"
];
function detectCompareIntent(input, entities = {}) {
  const raw = input.trim();
  const m = raw.match(COMPARE_RE) ?? raw.match(VS_RE);
  if (!m) return null;
  const a = m[1].trim().replace(/[?.!]+$/, "");
  const b = m[2].trim().replace(/[?.!]+$/, "");
  if (!a || !b) return null;
  const lowA = a.toLowerCase(), lowB = b.toLowerCase();
  if (PERIOD_TOKENS.includes(lowA) && PERIOD_TOKENS.includes(lowB)) {
    return { kind: "period", a: lowA, b: lowB, raw };
  }
  const find = (s, pool) => (pool ?? []).find((n) => n.toLowerCase() === s);
  for (const [kind, pool] of [
    ["shop", entities.shops],
    ["cashier", entities.cashiers],
    ["employee", entities.employees],
    ["party", entities.parties]
  ]) {
    const ma = find(lowA, pool);
    const mb = find(lowB, pool);
    if (ma && mb) return { kind, a: ma, b: mb, raw };
  }
  for (const [kind, pool] of [
    ["shop", entities.shops],
    ["cashier", entities.cashiers],
    ["employee", entities.employees],
    ["party", entities.parties]
  ]) {
    const ma = (pool ?? []).find((n) => lowA.includes(n.toLowerCase()));
    const mb = (pool ?? []).find((n) => lowB.includes(n.toLowerCase()));
    if (ma && mb) return { kind, a: ma, b: mb, raw };
  }
  return null;
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function ymd(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function periodToBounds(p) {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  let f = new Date(today), t = new Date(today);
  if (p === "today") ;
  else if (p === "yesterday") {
    f.setDate(f.getDate() - 1);
    t = new Date(f);
  } else if (p === "this week") {
    f.setDate(f.getDate() - f.getDay());
  } else if (p === "last week") {
    f.setDate(f.getDate() - f.getDay() - 7);
    t = new Date(f);
    t.setDate(t.getDate() + 6);
  } else if (p === "this month") {
    f = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (p === "last month") {
    f = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    t = new Date(today.getFullYear(), today.getMonth(), 0);
  } else if (p === "this year") {
    f = new Date(today.getFullYear(), 0, 1);
  } else if (p === "last year") {
    f = new Date(today.getFullYear() - 1, 0, 1);
    t = new Date(today.getFullYear() - 1, 11, 31);
  }
  return { from: ymd(f), to: ymd(t) };
}
async function shopAgg(filter, b) {
  let qb = supabase.from("shop_entries").select("entry_type, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, shops!inner(name), cashiers(name)").eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  if (filter.shopName) qb = qb.ilike("shops.name", filter.shopName);
  if (filter.cashierName) qb = qb.ilike("cashiers.name", filter.cashierName);
  const { data } = await qb.limit(5e3);
  const t = { cash_sale: 0, pos_sale: 0, bank_sale: 0, credit_sale: 0, total_sale: 0, purchase: 0, withdraw: 0, expense: 0 };
  for (const r of data ?? []) {
    if (r.entry_type === "sale") {
      t.cash_sale += +r.cash_sale || 0;
      t.pos_sale += +r.pos_sale || 0;
      t.bank_sale += +r.bank_sale || 0;
      t.credit_sale += +r.credit_sale || 0;
    } else if (r.entry_type === "purchase") t.purchase += +r.purchase_amount || 0;
    else if (r.entry_type === "withdraw") t.withdraw += +r.withdraw_amount || 0;
    else if (r.entry_type === "expense") t.expense += +r.expense_amount || 0;
  }
  t.total_sale = t.cash_sale + t.pos_sale + t.bank_sale + t.credit_sale;
  return t;
}
async function employeeAgg(name, b) {
  let qb = supabase.from("employee_entries").select("entry_type, amount, employees!inner(name)").eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  qb = qb.ilike("employees.name", name);
  const { data } = await qb.limit(2e3);
  const t = { given: 0, received: 0, net: 0 };
  for (const r of data ?? []) {
    const a = +r.amount || 0;
    if (r.entry_type === "given") t.given += a;
    else t.received += a;
  }
  t.net = t.given - t.received;
  return t;
}
async function partyAgg(name, b) {
  let qb = supabase.from("warehouse_ledger").select("entry_type, payment_status, amount, paid_amount, remaining_due").eq("is_deleted", false).ilike("party_name", name);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  const { data } = await qb.limit(2e3);
  const t = { total_purchase: 0, cash_buy: 0, credit_buy: 0, due_payment: 0 };
  for (const r of data ?? []) {
    if (r.entry_type === "warehouse_purchase") {
      const a = +r.amount || 0;
      t.total_purchase += a;
      if (r.payment_status === "cash") t.cash_buy += a;
      else if (r.payment_status === "credit") t.credit_buy += a;
      else if (r.payment_status === "partial") {
        t.cash_buy += +r.paid_amount || 0;
        t.credit_buy += +r.remaining_due || 0;
      }
    } else if (r.entry_type === "supplier_payment") t.due_payment += +r.amount || 0;
  }
  return t;
}
async function runCompare(intent, bounds) {
  const dLabel = bounds.from && bounds.to ? bounds.from === bounds.to ? bounds.from : `${bounds.from} → ${bounds.to}` : "All time";
  if (intent.kind === "shop") {
    const [A2, B2] = await Promise.all([
      shopAgg({ shopName: intent.a }, bounds),
      shopAgg({ shopName: intent.b }, bounds)
    ]);
    const rows2 = [
      { label: "Total Sale", a: A2.total_sale, b: B2.total_sale },
      { label: "Cash Sale", a: A2.cash_sale, b: B2.cash_sale },
      { label: "POS Sale", a: A2.pos_sale, b: B2.pos_sale },
      { label: "Bank Sale", a: A2.bank_sale, b: B2.bank_sale },
      { label: "Credit Sale", a: A2.credit_sale, b: B2.credit_sale },
      { label: "Purchase", a: A2.purchase, b: B2.purchase },
      { label: "Expense", a: A2.expense, b: B2.expense },
      { label: "Withdraw", a: A2.withdraw, b: B2.withdraw }
    ];
    return finalize(intent, dLabel, rows2, "Total Sale");
  }
  if (intent.kind === "cashier") {
    const [A2, B2] = await Promise.all([
      shopAgg({ cashierName: intent.a }, bounds),
      shopAgg({ cashierName: intent.b }, bounds)
    ]);
    const rows2 = [
      { label: "Total Sale", a: A2.total_sale, b: B2.total_sale },
      { label: "Cash Sale", a: A2.cash_sale, b: B2.cash_sale },
      { label: "POS Sale", a: A2.pos_sale, b: B2.pos_sale },
      { label: "Bank Sale", a: A2.bank_sale, b: B2.bank_sale },
      { label: "Expense Handled", a: A2.expense, b: B2.expense },
      { label: "Withdraw Handled", a: A2.withdraw, b: B2.withdraw }
    ];
    return finalize(intent, dLabel, rows2, "Total Sale");
  }
  if (intent.kind === "employee") {
    const [A2, B2] = await Promise.all([
      employeeAgg(intent.a, bounds),
      employeeAgg(intent.b, bounds)
    ]);
    const rows2 = [
      { label: "Given", a: A2.given, b: B2.given },
      { label: "Received", a: A2.received, b: B2.received },
      { label: "Net", a: A2.net, b: B2.net }
    ];
    return finalize(intent, dLabel, rows2, "Given");
  }
  if (intent.kind === "party") {
    const [A2, B2] = await Promise.all([
      partyAgg(intent.a, bounds),
      partyAgg(intent.b, bounds)
    ]);
    const rows2 = [
      { label: "Total Purchase", a: A2.total_purchase, b: B2.total_purchase },
      { label: "Cash Buy", a: A2.cash_buy, b: B2.cash_buy },
      { label: "Credit Buy", a: A2.credit_buy, b: B2.credit_buy },
      { label: "Due Payment", a: A2.due_payment, b: B2.due_payment }
    ];
    return finalize(intent, dLabel, rows2, "Total Purchase");
  }
  const [bA, bB] = [periodToBounds(intent.a), periodToBounds(intent.b)];
  const [A, B] = await Promise.all([shopAgg({}, bA), shopAgg({}, bB)]);
  const rows = [
    { label: "Total Sale", a: A.total_sale, b: B.total_sale },
    { label: "Cash Sale", a: A.cash_sale, b: B.cash_sale },
    { label: "POS Sale", a: A.pos_sale, b: B.pos_sale },
    { label: "Expense", a: A.expense, b: B.expense },
    { label: "Withdraw", a: A.withdraw, b: B.withdraw },
    { label: "Purchase", a: A.purchase, b: B.purchase }
  ];
  return finalize(
    { ...intent, a: titleCase(intent.a), b: titleCase(intent.b) },
    `${bA.from}…${bA.to}  vs  ${bB.from}…${bB.to}`,
    rows,
    "Total Sale"
  );
}
function titleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
function finalize(intent, dateLabel2, rows, headlineLabel) {
  const headline = rows.find((r) => r.label === headlineLabel) ?? rows[0];
  const winner = headline.a > headline.b ? "a" : headline.b > headline.a ? "b" : "tie";
  return {
    kind: intent.kind,
    aLabel: intent.a,
    bLabel: intent.b,
    dateLabel: dateLabel2,
    rows,
    winner,
    headline
  };
}
const PER_TABLE_LIMIT = 200;
const MAX_RETURN = 60;
function withinAmount(amt, target) {
  if (target == null) return { include: true, delta: 0 };
  const delta = Math.abs(amt - target);
  const tolerance = Math.max(50, target * 0.15);
  return { include: delta <= tolerance, delta };
}
function escapeLike(s) {
  return s.replace(/[%_]/g, (m) => `\\${m}`);
}
async function runMagicSearch(input) {
  if (input.amount == null && !input.text && !input.dateFrom) {
    return { exact: [], nearby: [], total: 0 };
  }
  const textLike = input.text ? `%${escapeLike(input.text)}%` : null;
  const hits = [];
  const [shopRes, empRes] = await Promise.all([
    supabase.from("shops").select("id,name"),
    supabase.from("employees").select("id,name")
  ]);
  const shopMap = new Map((shopRes.data ?? []).map((s) => [s.id, s.name]));
  const empMap = new Map((empRes.data ?? []).map((e) => [e.id, e.name]));
  const queries = [];
  queries.push((async () => {
    let q = supabase.from("shop_entries").select("id,txn_date,shop_id,entry_type,pos_sale,cash_sale,bank_sale,credit_sale,purchase_amount,withdraw_amount,expense_amount,notes").eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.ilike("notes", textLike);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const shop = r.shop_id && shopMap.get(r.shop_id) || "Shop";
      const cols = [
        ["POS Sale", Number(r.pos_sale)],
        ["Cash Sale", Number(r.cash_sale)],
        ["Bank Sale", Number(r.bank_sale)],
        ["Credit Sale", Number(r.credit_sale)],
        ["Purchase", Number(r.purchase_amount)],
        ["Withdraw", Number(r.withdraw_amount)],
        ["Expense", Number(r.expense_amount)]
      ];
      for (const [label, amt] of cols) {
        if (!amt) continue;
        const m = withinAmount(amt, input.amount);
        if (!m.include) continue;
        hits.push({
          id: `${r.id}-${label}`,
          rawId: r.id,
          module: `Shop · ${shop}`,
          refType: label,
          reference: shop,
          note: r.notes ?? "",
          amount: amt,
          date: r.txn_date,
          delta: m.delta,
          link: `/shop?highlight=${r.id}`,
          highlightId: r.id
        });
      }
    }
  })());
  queries.push((async () => {
    let q = supabase.from("company_transactions").select("id,txn_date,txn_type,category,amount,notes").eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.or(`notes.ilike.${textLike},category.ilike.${textLike}`);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const amt = Number(r.amount);
      const m = withinAmount(amt, input.amount);
      if (!m.include) continue;
      hits.push({
        id: r.id,
        rawId: r.id,
        module: "Company",
        refType: `${r.txn_type ?? ""} · ${r.category ?? ""}`.trim(),
        reference: r.category ?? "",
        note: r.notes ?? "",
        amount: amt,
        date: r.txn_date,
        delta: m.delta,
        link: `/company-transactions?highlight=${r.id}`,
        highlightId: r.id
      });
    }
  })());
  queries.push((async () => {
    let q = supabase.from("employee_entries").select("id,txn_date,employee_id,entry_type,amount,notes").eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.ilike("notes", textLike);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const amt = Number(r.amount);
      const m = withinAmount(amt, input.amount);
      if (!m.include) continue;
      const name = r.employee_id && empMap.get(r.employee_id) || "Employee";
      hits.push({
        id: r.id,
        rawId: r.id,
        module: `Employee · ${name}`,
        refType: r.entry_type === "given" ? "Given" : "Received",
        reference: name,
        note: r.notes ?? "",
        amount: amt,
        date: r.txn_date,
        delta: m.delta,
        link: r.employee_id ? `/employees/${r.employee_id}?highlight=${r.id}` : `/employees?highlight=${r.id}`,
        highlightId: r.id
      });
    }
  })());
  queries.push((async () => {
    let q = supabase.from("cash_flow_purchases").select("id,day_date,shop_id,company,cash_amount,due_amount,credit_amount,notes").eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("day_date", input.dateFrom);
    if (input.dateTo) q = q.lte("day_date", input.dateTo);
    if (textLike) q = q.or(`notes.ilike.${textLike},company.ilike.${textLike}`);
    q = q.order("day_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const shop = r.shop_id && shopMap.get(r.shop_id) || "Shop";
      const cols = [
        ["Cash Buy", Number(r.cash_amount)],
        ["Due Buy", Number(r.due_amount)],
        ["Credit Buy", Number(r.credit_amount)]
      ];
      for (const [label, amt] of cols) {
        if (!amt) continue;
        const m = withinAmount(amt, input.amount);
        if (!m.include) continue;
        hits.push({
          id: `${r.id}-${label}`,
          rawId: r.id,
          module: `Cash Flow · ${shop}`,
          refType: label,
          reference: r.company ?? "",
          note: r.notes ?? "",
          amount: amt,
          date: r.day_date,
          delta: m.delta,
          link: `/cash-flow?highlight=${r.id}`,
          highlightId: r.id
        });
      }
    }
  })());
  queries.push((async () => {
    let q = supabase.from("warehouse_ledger").select("id,txn_date,party_name,entry_type,payment_status,amount,paid_amount,remaining_due,notes").eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.or(`notes.ilike.${textLike},party_name.ilike.${textLike}`);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const amt = Number(r.amount);
      const m = withinAmount(amt, input.amount);
      if (!m.include) continue;
      hits.push({
        id: r.id,
        rawId: r.id,
        module: "Wholesale",
        refType: `${r.entry_type} · ${r.payment_status}`,
        reference: r.party_name ?? "",
        note: r.notes ?? "",
        amount: amt,
        date: r.txn_date,
        delta: m.delta,
        link: `/cash-flow?highlight=${r.id}`,
        highlightId: r.id
      });
    }
  })());
  queries.push((async () => {
    let q = supabase.from("transactions").select("id,txn_date,type,amount,notes,category,payment_method").eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.or(`notes.ilike.${textLike},category.ilike.${textLike}`);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const amt = Number(r.amount);
      const m = withinAmount(amt, input.amount);
      if (!m.include) continue;
      hits.push({
        id: r.id,
        rawId: r.id,
        module: "Transactions",
        refType: `${r.type} · ${r.payment_method ?? ""}`.trim(),
        reference: r.category ?? "",
        note: r.notes ?? "",
        amount: amt,
        date: r.txn_date,
        delta: m.delta,
        link: `/summary?highlight=${r.id}`,
        highlightId: r.id
      });
    }
  })());
  await Promise.all(queries);
  const sorted = hits.sort((a, b) => {
    const da = a.delta ?? 0;
    const db = b.delta ?? 0;
    if (da !== db) return da - db;
    return b.date.localeCompare(a.date);
  });
  const exact = input.amount != null ? sorted.filter((h) => (h.delta ?? 0) === 0) : sorted.filter((h) => true);
  const nearby = input.amount != null ? sorted.filter((h) => (h.delta ?? 0) > 0) : [];
  return {
    exact: exact.slice(0, MAX_RETURN),
    nearby: nearby.slice(0, MAX_RETURN),
    total: sorted.length
  };
}
function moduleIcon(m) {
  if (m.startsWith("Shop")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5" });
  if (m.startsWith("Company")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5" });
  if (m.startsWith("Employee")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" });
  if (m.startsWith("Wholesale")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" });
  if (m.startsWith("Cash Flow")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "h-3.5 w-3.5" });
}
function HitRow({ h, target }) {
  const router = useRouter();
  const body = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 px-3 py-2.5 transition-colors hover:bg-muted/60 active:bg-muted", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: moduleIcon(h.module) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: h.module }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: h.refType })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 truncate text-[12.5px] font-medium leading-tight", children: h.note || h.reference || "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] text-muted-foreground", children: h.date })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold tabular-nums", children: SAR(h.amount) }),
      target != null && (h.delta ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9.5px] text-muted-foreground", children: [
        "±",
        SAR(h.delta)
      ] })
    ] })
  ] });
  if (h.link) {
    const [path, qs] = h.link.split("?");
    const search = Object.fromEntries(new URLSearchParams(qs ?? ""));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => router.navigate({ to: path, search }),
        className: "block w-full text-left border-b border-border/40 last:border-0",
        children: body
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/40 last:border-0", children: body });
}
function MagicSearchCard({
  result,
  query,
  target
}) {
  const hasResults = result.exact.length > 0 || result.nearby.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "m-2 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/8 via-background to-background animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-border/40 px-3.5 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80", children: "Magic Search" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[12.5px] font-medium", children: [
            '"',
            query,
            '"'
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
        result.exact.length + result.nearby.length,
        " hit",
        result.exact.length + result.nearby.length === 1 ? "" : "s"
      ] })
    ] }),
    !hasResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3.5 py-6 text-center text-xs text-muted-foreground", children: "No matching records found across the ERP." }),
    result.exact.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/40 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Exact Matches" }),
      result.exact.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(HitRow, { h, target }, h.id))
    ] }),
    result.nearby.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/40 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Similar Values" }),
      result.nearby.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(HitRow, { h, target }, h.id))
    ] })
  ] });
}
const KEY = "ai-insights-history-v1";
const MAX = 40;
function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function pushHistory(item) {
  const next = {
    id: Math.random().toString(36).slice(2, 9),
    createdAt: Date.now(),
    ...item
  };
  const list = [next, ...loadHistory()].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
  }
  return next;
}
const LANG_LABEL = {
  "en-US": "EN",
  "bn-BD": "BN",
  "ar-SA": "AR"
};
const LANG_ORDER = ["en-US", "bn-BD", "ar-SA"];
const LS_KEY = "ai_voice_lang";
function getInitialLang() {
  if (typeof window === "undefined") return "en-US";
  const v = window.localStorage.getItem(LS_KEY) || "";
  return LANG_ORDER.includes(v) ? v : "en-US";
}
function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}
function VoiceMicButton({
  onTranscript,
  onInterim,
  size = "md",
  showLangToggle = false,
  className
}) {
  const SR = typeof window !== "undefined" ? getSpeechRecognition() : null;
  const [supported] = reactExports.useState(!!SR);
  const [listening, setListening] = reactExports.useState(false);
  const [processing, setProcessing] = reactExports.useState(false);
  const [lang, setLang] = reactExports.useState(getInitialLang);
  const recRef = reactExports.useRef(null);
  const finalRef = reactExports.useRef("");
  reactExports.useEffect(() => {
    return () => {
      try {
        recRef.current?.stop?.();
      } catch {
      }
      recRef.current = null;
    };
  }, []);
  function cycleLang() {
    const idx = LANG_ORDER.indexOf(lang);
    const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
    setLang(next);
    try {
      localStorage.setItem(LS_KEY, next);
    } catch {
    }
  }
  function stop() {
    try {
      recRef.current?.stop?.();
    } catch {
    }
  }
  function start() {
    if (!SR) {
      toast.error("Voice not supported", { description: "Your browser does not support speech input." });
      return;
    }
    if (listening) {
      stop();
      return;
    }
    finalRef.current = "";
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript;
        else interim += r[0].transcript;
      }
      onInterim?.((finalRef.current + " " + interim).trim());
    };
    rec.onerror = (e) => {
      setListening(false);
      setProcessing(false);
      const err = e?.error || "error";
      if (err === "not-allowed" || err === "service-not-allowed") {
        toast.error("Microphone permission required", { description: "Enable mic access in your browser settings." });
      } else if (err === "no-speech") {
        toast.message("Didn't hear anything", { description: "Tap the mic and try again." });
      } else if (err !== "aborted") {
        toast.error("Voice error", { description: err });
      }
    };
    rec.onend = () => {
      setListening(false);
      const text = finalRef.current.trim();
      if (!text) {
        setProcessing(false);
        return;
      }
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        onTranscript(text);
      }, 120);
    };
    recRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      toast.error("Could not start mic", { description: err?.message ?? "" });
      setListening(false);
    }
  }
  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  if (!supported) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        disabled: true,
        "aria-label": "Voice not supported",
        title: "Voice search isn't supported in this browser",
        className: cn(
          "flex items-center justify-center rounded-xl border border-border/40 bg-muted/30 text-muted-foreground/50",
          dim,
          className
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: iconSize })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1", className), children: [
    showLangToggle && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: cycleLang,
        title: `Voice language: ${LANG_LABEL[lang]} — tap to switch`,
        className: "rounded-md border border-border/50 bg-background/70 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-muted-foreground hover:bg-muted",
        children: LANG_LABEL[lang]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: start,
        "aria-label": listening ? "Stop voice input" : "Start voice input",
        "aria-pressed": listening,
        className: cn(
          "relative flex shrink-0 items-center justify-center rounded-xl transition-all active:scale-95",
          dim,
          listening ? "bg-destructive text-destructive-foreground shadow-[0_0_0_4px_hsl(var(--destructive)/0.18)]" : processing ? "bg-primary/15 text-primary" : "bg-muted/60 text-foreground/70 hover:bg-muted"
        ),
        children: [
          processing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: cn(iconSize, "animate-spin") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: iconSize }),
          listening && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute inset-0 -z-10 rounded-xl bg-destructive/50 animate-ping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pointer-events-none absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-end gap-[2px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-[2px] rounded-full bg-destructive animate-pulse", style: { animationDelay: "0ms" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-[2px] rounded-full bg-destructive animate-pulse", style: { animationDelay: "120ms" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-[2px] rounded-full bg-destructive animate-pulse", style: { animationDelay: "240ms" } })
            ] })
          ] })
        ]
      }
    )
  ] });
}
function VoiceStatusPill({ listening, processing, interim }) {
  if (!listening && !processing) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11.5px] text-foreground/80 backdrop-blur animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
      "inline-block h-2 w-2 rounded-full",
      listening ? "bg-destructive animate-pulse" : "bg-primary"
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: processing ? "Understanding…" : "Listening…" }),
    interim && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-muted-foreground italic", children: interim })
  ] });
}
const AiCompareCard = reactExports.lazy(() => import("./ai-compare-card-CZIDPBPc.mjs").then((m) => ({
  default: m.AiCompareCard
})));
reactExports.lazy(() => import("./ai-quick-panels-DGoIeCAu.mjs").then((m) => ({
  default: m.AiQuickPanels
})));
reactExports.lazy(() => import("./ai-share-modal-BfCrU7G9.mjs").then((m) => ({
  default: m.AiShareModal
})));
const QUICK_RANGES = [{
  id: "today",
  label: "Today"
}, {
  id: "yesterday",
  label: "Yesterday"
}, {
  id: "this_week",
  label: "This Week"
}, {
  id: "this_month",
  label: "This Month"
}, {
  id: "last_month",
  label: "Last Month"
}, {
  id: "custom",
  label: "Custom"
}];
const ROTATING_PLACEHOLDERS = ["This Month Azzouz Total Sale", "Today Withdraw", "Why was cash short yesterday?", "Top suppliers this month", "Open Shop", "23 May Azzouz Purchase 5000", "Compare this month vs last month", "Business stability score"];
function uid() {
  return Math.random().toString(36).slice(2, 9);
}
function AiInsightsPage() {
  const navigate = useNavigate();
  const search = Route$a.useSearch();
  const access = useUserAccess();
  const [input, setInput] = reactExports.useState("");
  const [bubbles, setBubbles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [quick, setQuick] = reactExports.useState("this_month");
  const [from, setFrom] = reactExports.useState("");
  const [to, setTo] = reactExports.useState("");
  const [parties, setParties] = reactExports.useState([]);
  const [shops, setShops] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const [shareOpen, setShareOpen] = reactExports.useState(false);
  const [shareUrl, setShareUrl] = reactExports.useState(null);
  const [shareCaption2, setShareCaption] = reactExports.useState("");
  const [cashiers, setCashiers] = reactExports.useState([]);
  const [employees, setEmployees] = reactExports.useState([]);
  const [focused, setFocused] = reactExports.useState(false);
  const [placeholderIdx, setPlaceholderIdx] = reactExports.useState(0);
  const [filtersOpen, setFiltersOpen] = reactExports.useState(false);
  const [voiceInterim, setVoiceInterim] = reactExports.useState(null);
  const [includeClosed, setIncludeClosed] = reactExports.useState(false);
  const [openMonthStart, setOpenMonthStart] = reactExports.useState(null);
  const endRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const r = resolveQuickRange("this_month");
    if (r) {
      setFrom(r.from);
      setTo(r.to);
    }
  }, []);
  reactExports.useEffect(() => {
    if (input || focused) return;
    const t = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(t);
  }, [input, focused]);
  reactExports.useEffect(() => {
    let alive = true;
    (async () => {
      const [p, c, e, s] = await Promise.all([supabase.from("parties").select("name").eq("is_deleted", false).limit(200), supabase.from("cashiers").select("name").eq("is_deleted", false).limit(200), supabase.from("employees").select("name").eq("is_deleted", false).limit(200), supabase.from("shops").select("name").eq("is_deleted", false).limit(100)]);
      if (!alive) return;
      const pn = (p.data ?? []).map((r) => r.name).filter(Boolean);
      const cn2 = (c.data ?? []).map((r) => r.name).filter(Boolean);
      const en = (e.data ?? []).map((r) => r.name).filter(Boolean);
      const sn = (s.data ?? []).map((r) => r.name).filter(Boolean);
      setParties(pn);
      setCashiers(cn2);
      setEmployees(en);
      setShops(sn);
      buildDictionary({
        shops: sn,
        cashiers: cn2,
        employees: en,
        parties: pn
      });
    })();
    buildDictionary();
    setHistory(loadHistory());
    (async () => {
      const {
        data
      } = await supabase.from("monthly_closings").select("month").eq("status", "closed").order("month", {
        ascending: false
      }).limit(1);
      const last = data?.[0]?.month;
      if (last) {
        const d = new Date(last);
        const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const y = next.getFullYear();
        const m = String(next.getMonth() + 1).padStart(2, "0");
        setOpenMonthStart(`${y}-${m}-01`);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  reactExports.useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [bubbles, loading]);
  const pool = reactExports.useMemo(() => buildSuggestionPool(parties, cashiers, employees), [parties, cashiers, employees]);
  const [debouncedInput, setDebouncedInput] = reactExports.useState("");
  reactExports.useEffect(() => {
    const t = setTimeout(() => setDebouncedInput(input), 120);
    return () => clearTimeout(t);
  }, [input]);
  const autocompletes = reactExports.useMemo(() => {
    const trimmed = debouncedInput.trim();
    if (trimmed.length < 1) return [];
    const norm = normalizeQuery(trimmed) || trimmed;
    const primary = rankSuggestions(norm, pool, 7);
    if (primary.length >= 3 || norm.toLowerCase() === trimmed.toLowerCase()) return primary;
    const fallback = rankSuggestions(trimmed, pool, 7);
    return Array.from(/* @__PURE__ */ new Set([...primary, ...fallback])).slice(0, 7);
  }, [debouncedInput, pool]);
  function pickQuick(r) {
    setQuick(r);
    if (r === "custom") return;
    const range = resolveQuickRange(r);
    if (range) {
      setFrom(range.from);
      setTo(range.to);
    }
  }
  async function run(rawQ) {
    const original = rawQ.trim();
    if (!original) return;
    const normalized = normalizeQuery(original) || original;
    const text = normalized;
    const corrected = suggestCorrection(original);
    setInput("");
    setBubbles((b) => [...b, {
      id: uid(),
      kind: "user",
      text: original
    }]);
    if (corrected && corrected.toLowerCase() !== original.toLowerCase()) {
      toast.message("Auto-corrected", {
        description: `Interpreted as: ${corrected}`
      });
    }
    const nav = detectNavigationIntent(text);
    if (nav) {
      const key = pageKeyFromPath(nav.to);
      if (key && !access.hasPage(key)) {
        setBubbles((b) => [...b, {
          id: uid(),
          kind: "empty",
          query: text,
          reason: `Access Restricted — you can't open ${nav.label}. Ask an admin to grant access.`
        }]);
        return;
      }
      setBubbles((b) => [...b, {
        id: uid(),
        kind: "navigate",
        query: text,
        to: nav.to,
        label: nav.label
      }]);
      setTimeout(() => navigate({
        to: nav.to
      }), 400);
      return;
    }
    setLoading(true);
    try {
      const sq = parseSmartQuery(text);
      const erp = parseErpIntent(text, {
        cashiers,
        employees,
        parties
      });
      const draft = detectEntryIntent(text, sq, erp);
      if (draft) {
        setBubbles((b) => [...b, {
          id: uid(),
          kind: "entry",
          query: text,
          draft
        }]);
        setHistory((h) => [pushHistory({
          query: text,
          summary: `Draft: ${draft.type} ${SAR(draft.amount)}`
        }), ...h]);
        return;
      }
      const bounds = {
        from: sq.dateFrom ?? from ?? null,
        to: sq.dateTo ?? to ?? null
      };
      const cmp = detectCompareIntent(text, {
        shops,
        cashiers,
        employees,
        parties
      });
      if (cmp) {
        const result2 = await runCompare(cmp, bounds);
        setBubbles((b) => [...b, {
          id: uid(),
          kind: "compare",
          query: text,
          result: result2
        }]);
        setHistory((h) => [pushHistory({
          query: text,
          summary: `Compare ${result2.aLabel} vs ${result2.bLabel}`
        }), ...h]);
        return;
      }
      if (hasErpIntent(erp)) {
        if (erp.reportMode || !erp.metric) {
          const result2 = await runReport(erp, bounds);
          setBubbles((b) => [...b, {
            id: uid(),
            kind: "report",
            query: text,
            result: result2
          }]);
          setHistory((h) => [pushHistory({
            query: text,
            summary: `Report · ${result2.scopeLabel}`
          }), ...h]);
        } else {
          const result2 = await runMetric(erp, bounds);
          if (result2) {
            setBubbles((b) => [...b, {
              id: uid(),
              kind: "metric",
              query: text,
              result: result2
            }]);
            setHistory((h) => [pushHistory({
              query: text,
              summary: `${result2.label}: ${SAR(result2.value)}`
            }), ...h]);
          } else {
            setBubbles((b) => [...b, {
              id: uid(),
              kind: "empty",
              query: text,
              reason: "No matching data found."
            }]);
          }
        }
        return;
      }
      const hasMagicSignal = sq.amount != null || sq.text && sq.text.trim().length >= 2 || sq.dateFrom != null;
      if (hasMagicSignal) {
        let magicFrom = sq.dateFrom ?? bounds.from;
        if (!includeClosed && openMonthStart) {
          if (!magicFrom || magicFrom < openMonthStart) magicFrom = openMonthStart;
        }
        const magic = await runMagicSearch({
          amount: sq.amount,
          text: sq.text?.trim() || null,
          dateFrom: magicFrom,
          dateTo: sq.dateTo ?? bounds.to
        });
        if (magic.exact.length > 0 || magic.nearby.length > 0) {
          const scopeNote = includeClosed ? "all history" : "current open month";
          setBubbles((b) => [...b, {
            id: uid(),
            kind: "magic",
            query: text,
            result: magic,
            target: sq.amount
          }]);
          setHistory((h) => [pushHistory({
            query: text,
            summary: `Magic · ${magic.exact.length + magic.nearby.length} hits · ${scopeNote}`
          }), ...h]);
          return;
        }
      }
      const result = await runReport(erp, bounds);
      setBubbles((b) => [...b, {
        id: uid(),
        kind: "report",
        query: text,
        result
      }]);
      setHistory((h) => [pushHistory({
        query: text,
        summary: `Report · ${result.scopeLabel}`
      }), ...h]);
    } catch (e) {
      toast.error(e?.message ?? "Failed to run query");
      setBubbles((b) => [...b, {
        id: uid(),
        kind: "empty",
        query: text,
        reason: "Could not understand. Try a different query."
      }]);
    } finally {
      setLoading(false);
    }
  }
  async function saveDraft(draft) {
    try {
      const {
        data: userData
      } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) throw new Error("Not signed in");
      const date = draft.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      if (draft.type === "expense" || draft.type === "withdraw" || draft.type === "purchase") {
        let shopId = null;
        if (draft.shop) {
          const {
            data: s
          } = await supabase.from("shops").select("id").ilike("name", draft.shop).limit(1);
          shopId = s?.[0]?.id ?? null;
        }
        if (shopId) {
          const payload = {
            txn_date: date,
            shop_id: shopId,
            entry_type: draft.type,
            created_by: userId,
            notes: draft.note,
            purchase_amount: draft.type === "purchase" ? draft.amount : 0,
            expense_amount: draft.type === "expense" ? draft.amount : 0,
            withdraw_amount: draft.type === "withdraw" ? draft.amount : 0
          };
          const {
            error: error2
          } = await supabase.from("shop_entries").insert(payload);
          if (error2) throw error2;
          toast.success("Entry saved");
          navigate({
            to: "/shop"
          });
          return;
        }
        const {
          error
        } = await supabase.from("transactions").insert({
          txn_date: date,
          type: draft.type === "purchase" ? "purchase" : draft.type,
          amount: draft.amount,
          notes: draft.note,
          created_by: userId,
          payment_method: "cash"
        });
        if (error) throw error;
        toast.success("Transaction saved");
        navigate({
          to: "/summary"
        });
        return;
      }
      if (draft.type === "employee_given" || draft.type === "employee_received") {
        if (!draft.employee) {
          toast.error("Employee not specified");
          return;
        }
        const {
          data: emp
        } = await supabase.from("employees").select("id").ilike("name", draft.employee).limit(1);
        const empId = emp?.[0]?.id;
        if (!empId) throw new Error("Employee not found");
        const {
          error
        } = await supabase.from("employee_entries").insert({
          txn_date: date,
          employee_id: empId,
          entry_type: draft.type === "employee_given" ? "given" : "received",
          amount: draft.amount,
          notes: draft.note,
          created_by: userId
        });
        if (error) throw error;
        toast.success("Employee entry saved");
        navigate({
          to: "/employees"
        });
        return;
      }
    } catch (e) {
      toast.error(e?.message ?? "Failed to save");
    }
  }
  function clearAll() {
    setBubbles([]);
  }
  const ranOnceRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const q = (search?.q ?? "").toString().trim();
    if (!q || ranOnceRef.current === q) return;
    ranOnceRef.current = q;
    const t = setTimeout(() => run(q), 250);
    return () => clearTimeout(t);
  }, [search?.q]);
  const currentPlaceholder = ROTATING_PLACEHOLDERS[placeholderIdx];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack mx-auto max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mx-3 mb-4 px-3 pb-3 pt-2 md:-mx-6 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("mb-2 flex items-center justify-between gap-2"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80", children: "Ask AI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-base font-bold leading-none", children: "Ask AI" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFiltersOpen((v) => !v), className: "flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-[10px] font-medium text-foreground/70 hover:bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          QUICK_RANGES.find((r) => r.id === quick)?.label ?? "Range"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        run(input);
      }, className: cn("group relative flex items-center gap-2 rounded-2xl border bg-background p-1.5 pl-3 shadow-sm transition-all", focused ? "border-primary/50 ring-2 ring-primary/20 shadow-[0_0_40px_-8px_hsl(var(--primary)/0.35)]" : "border-border/60"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: cn("h-4 w-4 shrink-0 transition-colors", focused ? "text-primary" : "text-muted-foreground") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onFocus: () => setFocused(true), onBlur: () => setTimeout(() => setFocused(false), 150), placeholder: currentPlaceholder, className: "h-10 flex-1 border-0 bg-transparent text-sm shadow-none transition-all focus-visible:ring-0" }),
        input && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setInput("");
          inputRef.current?.focus();
        }, className: "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted", "aria-label": "Clear input", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(VoiceMicButton, { size: "md", showLangToggle: true, onInterim: (t) => setVoiceInterim(t), onTranscript: (t) => {
          setVoiceInterim(null);
          toast.message("You said", {
            description: t
          });
          run(t);
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "icon", className: "h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm transition-all hover:from-primary hover:to-primary", disabled: loading || !input.trim(), children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) }),
        focused && autocompletes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-border/60 bg-background shadow-md animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pt-2 pb-1 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Smart Suggestions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "pb-1.5", children: autocompletes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onMouseDown: (e) => {
            e.preventDefault();
            run(s);
          }, className: "flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] hover:bg-muted/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 shrink-0 text-primary/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: s }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-auto h-3 w-3 text-muted-foreground" })
          ] }) }, s)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VoiceStatusPill, { listening: voiceInterim !== null && voiceInterim !== "", processing: false, interim: voiceInterim }),
      filtersOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-2 border-border/60 bg-background p-2.5 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: QUICK_RANGES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => pickQuick(r.id), className: cn("rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors", quick === r.id ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-background text-foreground/80 hover:bg-muted"), children: r.label }, r.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: from, onChange: (e) => {
            setFrom(e.target.value);
            setQuick("custom");
          }, className: "h-8 text-[12px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: to, onChange: (e) => {
            setTo(e.target.value);
            setQuick("custom");
          }, className: "h-8 text-[12px]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setIncludeClosed((v) => !v), className: cn("mt-2 flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors", includeClosed ? "border-primary/50 bg-primary/10 text-primary" : "border-border/60 bg-background text-foreground/80 hover:bg-muted"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex flex-col items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Magic Search Scope" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-normal text-muted-foreground", children: includeClosed ? "Searching all history" : "Current open month only" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider", includeClosed ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"), children: includeClosed ? "Closed: ON" : "Closed: OFF" })
        ] })
      ] })
    ] }),
    bubbles.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 space-y-4 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            " Welcome"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-lg font-bold leading-tight", children: "Ask anything about your business" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[12.5px] text-muted-foreground", children: "Get instant reports, detect anomalies, create entries, or just navigate — all with natural language." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Try asking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: INSIGHT_SUGGESTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => run(s), className: "rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11px] font-medium text-foreground/80 shadow-sm transition-all hover:scale-[1.02] hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]", children: s }, s)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      bubbles.map((b) => {
        if (b.kind === "user") {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-br from-primary to-primary/85 px-3.5 py-2 text-sm text-primary-foreground shadow-md", children: b.text }) }, b.id);
        }
        if (b.kind === "metric") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErpMetricCard, { r: b.result, query: b.query }) }, b.id);
        if (b.kind === "report") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErpReportCard, { r: b.result, query: b.query }) }, b.id);
        if (b.kind === "navigate") {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "m-2 flex items-center gap-3 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-3 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: "Navigating" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm font-medium", children: [
                "Opening ",
                b.label,
                "…"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground" })
          ] }, b.id);
        }
        if (b.kind === "entry") {
          const d = b.draft;
          const typeLabel = d.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "m-2 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/8 via-background to-background p-3.5 shadow-md animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
              " Confirm Entry"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-base font-semibold", children: typeLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-2 space-y-1 text-[12px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Amount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tabular-nums", children: SAR(d.amount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d.date ?? "Today" })
              ] }),
              d.shop && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shop" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d.shop })
              ] }),
              d.party && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Supplier" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d.party })
              ] }),
              d.employee && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Employee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d.employee })
              ] }),
              d.note && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Note" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d.note })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setBubbles((bs) => bs.filter((x) => x.id !== b.id)), children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                const path = d.type.startsWith("employee") ? "/employees" : d.shop ? "/shop" : "/summary";
                navigate({
                  to: path
                });
              }, children: "Edit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => saveDraft(d), children: "Save" })
            ] })
          ] }, b.id);
        }
        if (b.kind === "compare") {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "m-2 p-4 text-xs text-muted-foreground", children: "Loading comparison…" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(AiCompareCard, { r: b.result, onShare: () => {
            setShareUrl(renderCompareImage(b.result, b.query));
            setShareCaption(`*AI Compare*
${b.result.aLabel} vs ${b.result.bLabel}
${b.result.dateLabel}
— ShRiAh Group`);
            setShareOpen(true);
          } }) }) }, b.id);
        }
        if (b.kind === "magic") {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MagicSearchCard, { result: b.result, query: b.query, target: b.target }) }, b.id);
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "m-2 flex items-center gap-3 p-3 animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: b.reason })
        ] }, b.id);
      }),
      loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/30 px-3 py-2 text-sm text-muted-foreground animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-foreground/80 via-primary to-foreground/80 bg-[length:200%_auto] bg-clip-text text-transparent animate-pulse", children: "Thinking…" })
      ] }),
      bubbles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearAll, className: "rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[10.5px] font-medium text-muted-foreground hover:bg-muted", children: "Clear conversation" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: endRef })
    ] })
  ] });
}
export {
  AiInsightsPage as component
};
