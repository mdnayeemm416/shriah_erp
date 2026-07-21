import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { av as useHighlightRecord, a_ as Route, k as useAuth, C as Card, ah as CardContent, B as Button, d as cn, Z as DropdownMenu, _ as DropdownMenuTrigger, $ as DropdownMenuContent, a0 as DropdownMenuItem, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, aA as sendAuditEmail, o as useWorkingDate, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, I as Input, T as Textarea, G as DialogFooter, az as useSignedAttachmentUrl, h as Badge, af as SAR } from "./router-KeVl8_Ln.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { E as EmployeeFormDialog } from "./employee-form-dialog-BkPxYhm1.mjs";
import { E as EmployeeExpenseDialog } from "./employee-expense-dialog-Z_5ikAO2.mjs";
import { E as EditHistoryButton } from "./edit-history-D9fAqzXB.mjs";
import { A as AttachmentLightbox } from "./attachment-lightbox-DWyyAMyd.mjs";
import { s as shareToWhatsApp } from "./whatsapp-share-Bc5049Za.mjs";
import { softDelete } from "./soft-delete-DQY0d6eC.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { as as ArrowLeft, I as MessageCircle, a5 as Pencil, T as Trash2, aa as Store, x as Phone, bG as IdCard, ad as CircleArrowUp, bf as CircleArrowDown, q as Paperclip, av as EllipsisVertical, Y as Share2, $ as FileText, P as Plus, X, aT as CalendarDays, D as UserRound } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


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




import "../_libs/isbot.mjs";
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
import "./image-upload-CX99TgIR.mjs";
function EmployeeEntryDialog({
  open,
  onOpenChange,
  employeeId,
  initialType = "given",
  entry
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const editing = !!entry;
  const { workingDate } = useWorkingDate();
  const [type, setType] = reactExports.useState(initialType);
  const [amount, setAmount] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(workingDate);
  const [notes, setNotes] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [keepUrl, setKeepUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (open) {
      setType(entry?.entry_type ?? initialType);
      setAmount(entry ? String(entry.amount) : "");
      setDate(entry?.txn_date ?? workingDate);
      setNotes(entry?.notes ?? "");
      setFile(null);
      setKeepUrl(entry?.attachment_url ?? null);
    }
  }, [open, entry, initialType, workingDate]);
  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const amt = parseFloat(amount || "0");
      if (!amt || amt <= 0) throw new Error("Enter a valid amount");
      let url = keepUrl;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/employees/entries/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (up.error) throw up.error;
        url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      }
      const payload = {
        employee_id: employeeId,
        entry_type: type,
        amount: amt,
        txn_date: date,
        notes: notes.trim() || null,
        attachment_url: url
      };
      if (editing && entry) {
        const { error } = await supabase.from("employee_entries").update(payload).eq("id", entry.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("employee_entries").insert({ ...payload, created_by: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Entry updated" : "Entry saved");
      qc.invalidateQueries({ queryKey: ["employee-entries"] });
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      try {
        sendAuditEmail({
          action: editing ? "edited" : "created",
          module: "Employee Transaction",
          userName: user?.email || null,
          recordId: entry?.id ?? null,
          oldValues: editing ? entry : null,
          newValues: {
            employee_id: employeeId,
            entry_type: type,
            amount: parseFloat(amount || "0"),
            txn_date: date,
            notes: notes.trim() || null
          },
          notes: notes.trim() || null,
          amount: parseFloat(amount || "0")
        });
      } catch (e) {
      }
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message || "Failed to save entry")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit entry" : "New entry" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TypePill,
          {
            active: type === "given",
            onClick: () => setType("given"),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4" }),
            label: "Money Given",
            tone: "destructive"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TypePill,
          {
            active: type === "received",
            onClick: () => setType("received"),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-4 w-4" }),
            label: "Money Received",
            tone: "success"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (SAR) *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            inputMode: "decimal",
            min: 0,
            step: "0.01",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            placeholder: "0.00",
            className: "text-lg font-semibold tabular-nums"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), maxLength: 500, rows: 2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Attachment" }),
        keepUrl && !file && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Existing attachment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setKeepUrl(null), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-2 text-xs text-muted-foreground hover:border-primary/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3.5 w-3.5" }),
          file ? file.name : "Choose file",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: "image/*,application/pdf",
              className: "hidden",
              onChange: (e) => setFile(e.target.files?.[0] ?? null)
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => save.mutate(), disabled: save.isPending, children: save.isPending ? "Saving…" : editing ? "Save changes" : "Save entry" })
    ] })
  ] }) });
}
function TypePill({
  active,
  onClick,
  icon,
  label,
  tone
}) {
  const activeCls = tone === "destructive" ? "border-destructive bg-destructive/10 text-destructive" : "border-success bg-success/10 text-success";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: cn(
        "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all tap",
        active ? activeCls : "border-border/60 text-muted-foreground hover:border-primary/40"
      ),
      children: [
        icon,
        label
      ]
    }
  );
}
const COMPANY = "ShRiAh Group";
function fmt$1(n) {
  return new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
async function buildEmployeeShareImage(entry) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const isGiven = entry.entryType === "given";
  const accent = isGiven ? "#EF4444" : "#10B981";
  const accentSoft = isGiven ? "#FCA5A5" : "#86EFAC";
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0B1220");
  bg.addColorStop(1, "#111B30");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.85, 100, 40, W * 0.85, 100, 600);
  glow.addColorStop(0, accent + "55");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  const cardX = 70;
  const cardY = 180;
  const cardW = W - 140;
  const cardH = H - 360;
  roundRect$1(ctx, cardX, cardY, cardW, cardH, 36);
  const cardBg = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
  cardBg.addColorStop(0, "#15213A");
  cardBg.addColorStop(1, "#0F1A2E");
  ctx.fillStyle = cardBg;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#F8FAFC";
  ctx.font = "700 44px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(COMPANY, 90, 110);
  ctx.fillStyle = "#94A3B8";
  ctx.font = "500 24px Inter, system-ui, sans-serif";
  ctx.fillText("Employee receipt", 90, 145);
  const pillText = isGiven ? "MONEY GIVEN" : "MONEY RECEIVED";
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  const pillW = ctx.measureText(pillText).width + 44;
  const pillX = W - pillW - 90;
  const pillY = 80;
  roundRect$1(ctx, pillX, pillY, pillW, 48, 24);
  ctx.fillStyle = accent + "22";
  ctx.fill();
  ctx.strokeStyle = accent + "88";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.textAlign = "center";
  ctx.fillText(pillText, pillX + pillW / 2, pillY + 32);
  ctx.textAlign = "center";
  ctx.fillStyle = "#64748B";
  ctx.font = "600 24px Inter, system-ui, sans-serif";
  ctx.fillText("AMOUNT", W / 2, cardY + 90);
  ctx.fillStyle = "#94A3B8";
  ctx.font = "600 32px Inter, system-ui, sans-serif";
  const sarOffsetX = -160;
  ctx.fillText("SAR", W / 2 + sarOffsetX, cardY + 200);
  ctx.fillStyle = "#F8FAFC";
  ctx.font = "800 132px Inter, system-ui, sans-serif";
  ctx.fillText(fmt$1(entry.amount), W / 2 + 30, cardY + 220);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.setLineDash([8, 8]);
  ctx.moveTo(cardX + 50, cardY + 290);
  ctx.lineTo(cardX + cardW - 50, cardY + 290);
  ctx.stroke();
  ctx.setLineDash([]);
  const rows = [
    ["Employee", entry.employeeName],
    ["Shop", entry.shopName || "—"],
    ["Date", entry.date]
  ];
  if (entry.balanceAfter != null) {
    rows.push(["Balance after", `SAR ${fmt$1(entry.balanceAfter)}${entry.balanceAfter > 0 ? " Due" : entry.balanceAfter < 0 ? " Advance" : ""}`]);
  }
  if (entry.notes) rows.push(["Notes", entry.notes]);
  let y = cardY + 360;
  ctx.textAlign = "left";
  for (const [label, value] of rows) {
    ctx.fillStyle = "#64748B";
    ctx.font = "500 26px Inter, system-ui, sans-serif";
    ctx.fillText(label, cardX + 60, y);
    ctx.fillStyle = "#F1F5F9";
    ctx.font = "600 30px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    wrapTextRight(ctx, value, cardX + cardW - 60, y, cardW - 280, 36);
    ctx.textAlign = "left";
    y += 64;
  }
  ctx.textAlign = "center";
  ctx.fillStyle = accentSoft;
  ctx.font = "700 28px Inter, system-ui, sans-serif";
  ctx.fillText(isGiven ? "Cash Out · From Company" : "Cash In · To Company", W / 2, H - 130);
  ctx.fillStyle = "#475569";
  ctx.font = "500 22px Inter, system-ui, sans-serif";
  ctx.fillText("Auto-generated by " + COMPANY + " ERP", W / 2, H - 80);
  return await new Promise((res) => canvas.toBlob((b) => res(b), "image/png", 0.95));
}
function roundRect$1(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrapTextRight(ctx, text, x, y, maxW, lh) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  const max = Math.min(lines.length, 2);
  for (let i = 0; i < max; i++) {
    ctx.fillText(lines[i] + (i === 1 && lines.length > 2 ? "…" : ""), x, y + i * lh);
  }
}
async function shareEmployeeEntry(entry) {
  const blob = await buildEmployeeShareImage(entry);
  const file = new File([blob], `employee-${entry.employeeName.replace(/\s+/g, "-")}.png`, { type: "image/png" });
  const navAny = navigator;
  if (navAny.canShare && navAny.canShare({ files: [file] })) {
    try {
      await navAny.share({
        files: [file],
        title: `${entry.employeeName} — ${entry.entryType === "given" ? "Money Given" : "Money Received"}`,
        text: `${COMPANY} · ${entry.entryType === "given" ? "Given" : "Received"} SAR ${fmt$1(entry.amount)}`
      });
      return;
    } catch {
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4e3);
  const text = encodeURIComponent(
    `${COMPANY}
${entry.entryType === "given" ? "Money Given to" : "Money Received from"} ${entry.employeeName}
Amount: SAR ${fmt$1(entry.amount)}
Date: ${entry.date}${entry.notes ? "\nNotes: " + entry.notes : ""}`
  );
  window.open(`https://wa.me/?text=${text}`, "_blank");
}
function EmployeeEntryDetailDialog({
  open,
  onOpenChange,
  entry,
  employeeName,
  createdByName,
  isAdmin,
  onEdit,
  onDelete,
  onShare
}) {
  const url = useSignedAttachmentUrl(entry?.attachment_url ?? null);
  const [zoom, setZoom] = reactExports.useState(false);
  if (!entry) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Entry" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "Entry not available." })
    ] }) });
  }
  const isGiven = entry.entry_type === "given";
  const isImage = entry.attachment_url && /\.(png|jpe?g|webp|gif)$/i.test(entry.attachment_url);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
        "flex h-8 w-8 items-center justify-center rounded-lg",
        isGiven ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
      ), children: isGiven ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isGiven ? "Money Given" : "Money Received" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-auto text-[10px]", children: employeeName })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-muted/30 p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SARAmount,
          {
            value: Number(entry.amount),
            size: "3xl",
            whole: false,
            className: cn("mt-1", isGiven ? "text-destructive" : "text-success")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-xl border border-border/40 p-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }), label: "Date", children: new Date(entry.txn_date).toLocaleDateString() }),
        entry.notes && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }), label: "Notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap", children: entry.notes }) }),
        createdByName && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-3.5 w-3.5" }), label: "Created by", children: createdByName })
      ] }),
      entry.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3" }),
          " Attachment"
        ] }),
        isImage && url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setZoom(true),
            className: "block w-full overflow-hidden rounded-xl border border-border/60",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: url, alt: "attachment", className: "h-40 w-full object-cover" })
          }
        ) : url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: url,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-1.5 text-xs text-primary underline",
            children: "Open attachment"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Loading…" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: onShare, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
          " Share"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "border-success/40 text-success hover:bg-success/10",
            onClick: async () => {
              await shareToWhatsApp({
                title: isGiven ? "Money Given" : "Money Received",
                subtitle: employeeName,
                amount: SAR(Number(entry.amount)),
                amountLabel: isGiven ? "Given" : "Received",
                date: new Date(entry.txn_date).toLocaleDateString(),
                rows: [
                  { label: "Employee", value: employeeName },
                  { label: "Type", value: isGiven ? "Given" : "Received" },
                  { label: "Amount", value: SAR(Number(entry.amount)) }
                ],
                notes: entry.notes,
                badge: isGiven ? "OUT" : "IN",
                accent: isGiven ? "out" : "in",
                caption: `${isGiven ? "Money Given" : "Money Received"} · Employee: ${employeeName} · Date: ${new Date(entry.txn_date).toLocaleDateString()} · Amount: ${SAR(Number(entry.amount))}`
              });
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
              " WhatsApp"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(EditHistoryButton, { entityType: "employee_entries", entityId: entry.id, label: "History", variant: "outline" }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: onEdit, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
            " Edit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "text-destructive hover:text-destructive", onClick: onDelete, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
            " Delete"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentLightbox, { open: zoom, url, onClose: () => setZoom(false) })
  ] }) });
}
function Row({ icon, label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right font-medium", children })
  ] });
}
const COMPANY_DEFAULT = "ShRiAh Group";
const C = {
  bg: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E5E7EB",
  borderSoft: "#EEF1F5",
  text: "#111827",
  textSoft: "#6B7280",
  textMute: "#9CA3AF",
  accent: "#14B8A6",
  accentSoft: "#E6FFFB",
  accentDeep: "#0F9488",
  redDeep: "#DC2626",
  redSoft: "#FEE2E2",
  greenDeep: "#16A34A",
  greenSoft: "#DCFCE7"
};
function fmt(n) {
  return new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}
function initials(name) {
  return name.split(/\s+/).filter(Boolean).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}
function shortId(input) {
  const s = `${input.employeeName}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  return (Math.abs(h).toString(16).toUpperCase() + "000000").slice(0, 6);
}
async function buildEmployeeStatementImage(input) {
  const company = input.company || COMPANY_DEFAULT;
  const DPR = 2;
  const W = 1200;
  const PAD = 56;
  const rows = input.entries.slice(0, 24);
  const rowH = 78;
  const headerH = 150;
  const summaryH = 220;
  const totalsH = 110;
  const tableHeadH = 56;
  const tableH = rows.length * rowH + (input.entries.length > rows.length ? 48 : 0);
  const finalH = 170;
  const footerH = 70;
  const H = headerH + summaryH + totalsH + tableHeadH + tableH + finalH + footerH;
  const canvas = document.createElement("canvas");
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(DPR, DPR);
  ctx.textRendering = "geometricPrecision";
  ctx.imageSmoothingQuality = "high";
  const bg = ctx.createLinearGradient(0, 0, 0, 200);
  bg.addColorStop(0, "#FAFBFC");
  bg.addColorStop(1, C.bg);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, 200);
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 200, W, H - 200);
  const bal = input.balance;
  const isDue = bal > 0;
  const isAdv = bal < 0;
  const balDeep = isDue ? C.redDeep : isAdv ? C.greenDeep : C.textSoft;
  const balSoft = isDue ? C.redSoft : isAdv ? C.greenSoft : "#F1F5F9";
  const balLabel = isDue ? "Due from Employee" : isAdv ? "Payable to Employee" : "Settled";
  const markX = PAD, markY = 50, markS = 48;
  roundRect(ctx, markX, markY, markS, markS, 12);
  const markGrad = ctx.createLinearGradient(markX, markY, markX + markS, markY + markS);
  markGrad.addColorStop(0, C.accent);
  markGrad.addColorStop(1, C.accentDeep);
  ctx.fillStyle = markGrad;
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 22px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", markX + markS / 2, markY + markS / 2 + 1);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = C.text;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.fillText(company, markX + markS + 14, markY + 20);
  ctx.fillStyle = C.textSoft;
  ctx.font = "500 13px Inter, system-ui, sans-serif";
  ctx.fillText("Employee Statement", markX + markS + 14, markY + 40);
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const sid = `#${shortId(input)}`;
  ctx.textAlign = "right";
  ctx.fillStyle = C.text;
  ctx.font = "600 13px Inter, system-ui, sans-serif";
  ctx.fillText(today, W - PAD, markY + 20);
  ctx.fillStyle = C.textMute;
  ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(`Statement ${sid}`, W - PAD, markY + 40);
  ctx.strokeStyle = C.borderSoft;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, headerH - 20);
  ctx.lineTo(W - PAD, headerH - 20);
  ctx.stroke();
  const sx = PAD, sy = headerH, sw = W - PAD * 2, sh = 180;
  lightCard(ctx, sx, sy, sw, sh, 18);
  const avS = 64, avX = sx + 24, avY = sy + 28;
  roundRect(ctx, avX, avY, avS, avS, 16);
  ctx.fillStyle = C.accentSoft;
  ctx.fill();
  ctx.fillStyle = C.accentDeep;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials(input.employeeName), avX + avS / 2, avY + avS / 2 + 1);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = C.text;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.fillText(input.employeeName, avX + avS + 16, avY + 24);
  ctx.font = "500 12px Inter, system-ui, sans-serif";
  const metaItems = [];
  if (input.shopName) metaItems.push(["Shop", input.shopName]);
  if (input.mobile) metaItems.push(["Mobile", input.mobile]);
  if (input.iqama) metaItems.push(["Iqama", input.iqama]);
  let my = avY + 46;
  metaItems.forEach(([k, v]) => {
    ctx.fillStyle = C.textMute;
    ctx.fillText(k, avX + avS + 16, my);
    const kw = ctx.measureText(k).width;
    ctx.fillStyle = C.text;
    ctx.font = "600 12px Inter, system-ui, sans-serif";
    ctx.fillText(v, avX + avS + 16 + kw + 8, my);
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    my += 18;
  });
  const balBoxW = 380;
  const balBoxX = sx + sw - balBoxW - 24;
  const balBoxY = sy + 24;
  const balBoxH = sh - 48;
  roundRect(ctx, balBoxX, balBoxY, balBoxW, balBoxH, 16);
  ctx.fillStyle = balSoft;
  ctx.fill();
  const pillText = balLabel;
  ctx.font = "700 10px Inter, system-ui, sans-serif";
  const pw = ctx.measureText(pillText).width + 20;
  const px = balBoxX + 20, py = balBoxY + 18;
  roundRect(ctx, px, py, pw, 22, 11);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.fillStyle = balDeep;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(pillText.toUpperCase(), px + 10, py + 11);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.textSoft;
  ctx.font = "500 11px Inter, system-ui, sans-serif";
  ctx.fillText("CURRENT BALANCE", balBoxX + 20, balBoxY + 68);
  ctx.fillStyle = balDeep;
  ctx.font = "600 15px Inter, system-ui, sans-serif";
  ctx.fillText("SAR", balBoxX + 20, balBoxY + 112);
  ctx.font = "800 40px Inter, system-ui, sans-serif";
  ctx.fillText(fmt(Math.abs(bal)), balBoxX + 64, balBoxY + 114);
  const ty = sy + sh + 24;
  const colW = (sw - 16) / 2;
  miniStat(ctx, sx, ty, colW, 86, "Total Given", `SAR ${fmt(input.totalGiven)}`, C.redDeep, C.redSoft);
  miniStat(ctx, sx + colW + 16, ty, colW, 86, "Total Received", `SAR ${fmt(input.totalReceived)}`, C.greenDeep, C.greenSoft);
  const histTop = ty + 86 + 28;
  ctx.fillStyle = C.text;
  ctx.font = "700 15px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Transaction History", PAD, histTop);
  ctx.fillStyle = C.textMute;
  ctx.font = "500 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${input.entries.length} entr${input.entries.length === 1 ? "y" : "ies"}`, W - PAD, histTop);
  let y = histTop + 20;
  for (const e of rows) {
    const isGiven = e.entry_type === "given";
    const accent = isGiven ? C.redDeep : C.greenDeep;
    const accentSoft = isGiven ? C.redSoft : C.greenSoft;
    roundRect(ctx, PAD, y, W - PAD * 2, rowH - 10, 12);
    ctx.fillStyle = C.card;
    ctx.fill();
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1;
    ctx.stroke();
    const tagText = isGiven ? "GIVEN" : "RECEIVED";
    ctx.font = "700 10px Inter, system-ui, sans-serif";
    const tw = ctx.measureText(tagText).width + 16;
    const tx = PAD + 18;
    const tagY = y + 16;
    roundRect(ctx, tx, tagY, tw, 22, 11);
    ctx.fillStyle = accentSoft;
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tagText, tx + 8, tagY + 11);
    ctx.textBaseline = "alphabetic";
    if (e.notes) {
      ctx.fillStyle = C.text;
      ctx.font = "600 13px Inter, system-ui, sans-serif";
      const notes = clip(ctx, e.notes, 520);
      ctx.fillText(notes, tx + tw + 12, tagY + 16);
    }
    ctx.fillStyle = C.textSoft;
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    ctx.fillText(fmtDate(e.txn_date), tx, y + rowH - 22);
    ctx.textAlign = "right";
    ctx.fillStyle = accent;
    ctx.font = "700 18px Inter, system-ui, sans-serif";
    ctx.fillText(`${isGiven ? "−" : "+"} SAR ${fmt(Number(e.amount))}`, W - PAD - 20, y + 36);
    y += rowH;
  }
  if (input.entries.length > rows.length) {
    ctx.fillStyle = C.textMute;
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`+ ${input.entries.length - rows.length} more entries — see PDF for full history`, W / 2, y + 24);
    y += 48;
  } else {
    y += 8;
  }
  const fy = y + 16;
  const fh = 130;
  roundRect(ctx, PAD, fy, W - PAD * 2, fh, 20);
  const fg = ctx.createLinearGradient(PAD, fy, W - PAD, fy + fh);
  fg.addColorStop(0, C.accentSoft);
  fg.addColorStop(1, "#F0FDFA");
  ctx.fillStyle = fg;
  ctx.fill();
  ctx.strokeStyle = "rgba(20,184,166,0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = C.accentDeep;
  ctx.font = "600 11px Inter, system-ui, sans-serif";
  ctx.fillText("FINAL BALANCE", PAD + 28, fy + 36);
  ctx.fillStyle = C.text;
  ctx.font = "600 14px Inter, system-ui, sans-serif";
  ctx.fillText(balLabel, PAD + 28, fy + 84);
  ctx.textAlign = "right";
  ctx.fillStyle = balDeep;
  ctx.font = "600 14px Inter, system-ui, sans-serif";
  ctx.fillText("SAR", W - PAD - 24 - ctx.measureText(fmt(Math.abs(bal))).width * 0 - 160, fy + 56);
  ctx.font = "800 38px Inter, system-ui, sans-serif";
  ctx.fillText(fmt(Math.abs(bal)), W - PAD - 24, fy + 88);
  ctx.textAlign = "left";
  ctx.fillStyle = C.textMute;
  ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(`${company} · ${sid}`, PAD, H - 28);
  ctx.textAlign = "right";
  ctx.fillText(today, W - PAD, H - 28);
  return await new Promise((res) => canvas.toBlob((b) => res(b), "image/png", 1));
}
function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function lightCard(ctx, x, y, w, h, r) {
  ctx.save();
  ctx.shadowColor = "rgba(17,24,39,0.05)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = C.card;
  ctx.fill();
  ctx.restore();
  roundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.stroke();
}
function miniStat(ctx, x, y, w, h, label, value, color, tint) {
  lightCard(ctx, x, y, w, h, 14);
  ctx.beginPath();
  ctx.arc(x + 24, y + h / 2, 6, 0, Math.PI * 2);
  ctx.fillStyle = tint;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 24, y + h / 2, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.textAlign = "left";
  ctx.fillStyle = C.textSoft;
  ctx.font = "500 11px Inter, system-ui, sans-serif";
  ctx.fillText(label.toUpperCase(), x + 42, y + 32);
  ctx.fillStyle = color;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.fillText(value, x + 42, y + 62);
}
function clip(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(s + "…").width > maxW) s = s.slice(0, -1);
  return s + "…";
}
async function shareEmployeeStatementWhatsApp(input) {
  const blob = await buildEmployeeStatementImage(input);
  const fileName = `${input.employeeName.replace(/\s+/g, "-")}-statement.png`;
  const file = new File([blob], fileName, { type: "image/png" });
  const phone = normalizeWhatsAppPhone(input.mobile);
  const navAny = navigator;
  const canShareFiles = !!(navAny.canShare && navAny.share && navAny.canShare({ files: [file] }));
  if (canShareFiles) {
    try {
      await navAny.share({ files: [file] });
      return { kind: "shared" };
    } catch (err) {
      if (err?.name === "AbortError") return { kind: "cancelled" };
    }
  }
  let copied = false;
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": blob })
      ]);
      copied = true;
    }
  } catch {
  }
  if (phone) {
    window.open(`https://wa.me/${phone}`, "_blank", "noopener,noreferrer");
    return { kind: "fallback-link", phone };
  }
  if (copied) {
    return { kind: "fallback-link", phone: null };
  }
  return { kind: "unsupported", blob, fileName, phone, text: "" };
}
function downloadStatementImage(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function normalizeWhatsAppPhone(value) {
  const digits = (value ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `966${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("5")) return `966${digits}`;
  return digits;
}
function EmployeeDetail() {
  useHighlightRecord();
  const {
    employeeId
  } = Route.useParams();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [entryOpen, setEntryOpen] = reactExports.useState(false);
  const [entryType, setEntryType] = reactExports.useState("given");
  const [editEntry, setEditEntry] = reactExports.useState(null);
  const [delOpen, setDelOpen] = reactExports.useState(false);
  const [delEntry, setDelEntry] = reactExports.useState(null);
  const [delEmployee, setDelEmployee] = reactExports.useState(false);
  const [detailEntry, setDetailEntry] = reactExports.useState(null);
  const {
    user
  } = useAuth();
  const {
    data: isAdmin = false
  } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    }
  });
  const {
    data: employee,
    isLoading
  } = useQuery({
    queryKey: ["employees", employeeId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("employees").select("*").eq("id", employeeId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: entries = []
  } = useQuery({
    queryKey: ["employee-entries", employeeId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("employee_entries").select("id, employee_id, entry_type, amount, txn_date, notes, attachment_url, created_at").eq("employee_id", employeeId).eq("is_deleted", false).order("txn_date", {
        ascending: false
      }).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const totals = reactExports.useMemo(() => {
    const t = {
      given: 0,
      received: 0
    };
    for (const e of entries) {
      if (e.entry_type === "given") t.given += Number(e.amount);
      else t.received += Number(e.amount);
    }
    return {
      ...t,
      balance: t.given - t.received
    };
  }, [entries]);
  const delEntryMut = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await softDelete("employee_entries", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Entry deleted");
      qc.invalidateQueries({
        queryKey: ["employee-entries"]
      });
      qc.invalidateQueries({
        queryKey: ["employees"]
      });
      qc.invalidateQueries({
        queryKey: ["transactions"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      setDelOpen(false);
      setDelEntry(null);
    },
    onError: (e) => toast.error(e.message || "Failed to delete")
  });
  const delEmpMut = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await softDelete("employees", employeeId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Employee removed");
      qc.invalidateQueries({
        queryKey: ["employees"]
      });
      nav({
        to: "/employees"
      });
    },
    onError: (e) => toast.error(e.message || "Failed to delete employee")
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 animate-pulse rounded-2xl bg-muted/40" });
  }
  if (!employee) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Employee not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employees", className: "mt-3 inline-block text-xs text-primary underline", children: "Back to employees" })
    ] }) });
  }
  const statement = {
    employeeName: employee.name,
    shopName: employee.shop_name,
    mobile: employee.mobile,
    iqama: employee.iqama,
    totalGiven: totals.given,
    totalReceived: totals.received,
    balance: totals.balance,
    entries: entries.map((e) => ({
      id: e.id,
      entry_type: e.entry_type,
      amount: Number(e.amount),
      txn_date: e.txn_date,
      notes: e.notes
    }))
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/employees", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " All employees"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "border-primary/30 text-primary hover:bg-primary/10 hover:text-primary", onClick: async () => {
          try {
            const res = await shareEmployeeStatementWhatsApp(statement);
            if (res.kind === "fallback-link") {
              toast.message("WhatsApp opened. Image copied — paste it into the chat.");
            } else if (res.kind === "unsupported") {
              toast.message("Sharing not supported on this device.", {
                action: {
                  label: "Download Image",
                  onClick: () => downloadStatementImage(res.blob, res.fileName)
                }
              });
            }
          } catch (e) {
            toast.error(e?.message || "Failed to share statement");
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
          " Share History"
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => setEditOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
            " Edit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "text-destructive hover:text-destructive", onClick: () => setDelEmployee(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "card-hero", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)]", children: employee.name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold leading-tight", children: employee.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground", children: [
            employee.shop_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3" }),
              employee.shop_name
            ] }),
            employee.mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
              employee.mobile
            ] }),
            employee.iqama && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "h-3 w-3" }),
              employee.iqama
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Current Balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Math.abs(totals.balance), size: "3xl", className: cn("mt-1", totals.balance > 0 && "text-destructive", totals.balance < 0 && "text-success", totals.balance === 0 && "text-muted-foreground") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: totals.balance > 0 ? "Due from employee" : totals.balance < 0 ? "Advance held" : "Fully settled" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Total Given" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.given, size: "md", className: "mt-0.5 text-destructive" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Total Received" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.received, size: "md", className: "mt-0.5 text-success" })
        ] })
      ] }),
      employee.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-border/40 bg-muted/30 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs", children: employee.notes })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-12 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive", onClick: () => {
        setEntryType("given");
        setEditEntry(null);
        setEntryOpen(true);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4" }),
        " Money Given"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-12 border-success/30 text-success hover:bg-success/10 hover:text-success", onClick: () => {
        setEntryType("received");
        setEditEntry(null);
        setEntryOpen(true);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-4 w-4" }),
        " Money Received"
      ] })
    ] }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeExpensesAdminSection, { employeeId }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Recent entries" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
          entries.length,
          " total"
        ] })
      ] }),
      entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 text-center text-xs text-muted-foreground", children: "No entries yet. Add money given or received above." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: entries.map((e) => {
        const isGiven = e.entry_type === "given";
        const shareEntry = () => shareEmployeeEntry({
          employeeName: employee.name,
          shopName: employee.shop_name,
          amount: Number(e.amount),
          entryType: e.entry_type,
          date: new Date(e.txn_date).toLocaleDateString(),
          notes: e.notes,
          balanceAfter: totals.balance
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-record-id": e.id, role: "button", tabIndex: 0, onClick: () => setDetailEntry(e), onKeyDown: (ev) => {
          if (ev.key === "Enter" || ev.key === " ") setDetailEntry(e);
        }, className: "group flex cursor-pointer items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 transition-all hover:border-primary/30 hover:bg-muted/30 active:scale-[0.99]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", isGiven ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"), children: isGiven ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: isGiven ? "Given" : "Received" }),
              e.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3 text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
              new Date(e.txn_date).toLocaleDateString(),
              e.notes ? " · " + e.notes : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(e.amount), size: "md", className: cn("shrink-0", isGiven ? "text-destructive" : "text-success") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 shrink-0 text-muted-foreground", onClick: (ev) => ev.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", onClick: (ev) => ev.stopPropagation(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: shareEntry, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
                " Share to WhatsApp"
              ] }),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => {
                setEditEntry(e);
                setEntryOpen(true);
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
                " Edit"
              ] }),
              e.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => window.open(e.attachment_url, "_blank"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
                " View attachment"
              ] }),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => {
                setDelEntry(e);
                setDelOpen(true);
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                " Delete"
              ] })
            ] })
          ] })
        ] }, e.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      setEditEntry(null);
      setEntryType("given");
      setEntryOpen(true);
    }, className: "fixed end-5 z-30 hidden h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-1 ring-primary/20 transition-transform hover:scale-105 active:scale-95 md:bottom-8 md:flex md:h-14 md:w-14", "aria-label": "New entry", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeFormDialog, { open: editOpen, onOpenChange: setEditOpen, employee }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeEntryDialog, { open: entryOpen, onOpenChange: setEntryOpen, employeeId, initialType: entryType, entry: editEntry }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeEntryDetailDialog, { open: !!detailEntry, onOpenChange: (v) => {
      if (!v) setDetailEntry(null);
    }, entry: detailEntry, employeeName: employee.name, isAdmin, onEdit: () => {
      if (!detailEntry) return;
      setEditEntry(detailEntry);
      setDetailEntry(null);
      setEntryOpen(true);
    }, onDelete: () => {
      if (!detailEntry) return;
      setDelEntry(detailEntry);
      setDetailEntry(null);
      setDelOpen(true);
    }, onShare: () => {
      if (!detailEntry) return;
      shareEmployeeEntry({
        employeeName: employee.name,
        shopName: employee.shop_name,
        amount: Number(detailEntry.amount),
        entryType: detailEntry.entry_type,
        date: new Date(detailEntry.txn_date).toLocaleDateString(),
        notes: detailEntry.notes,
        balanceAfter: totals.balance
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: delOpen, onOpenChange: setDelOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this entry?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "The linked transaction will also be removed. Cash balances will update automatically." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => delEntry && delEntryMut.mutate(delEntry.id), className: "bg-destructive text-destructive-foreground", children: "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: delEmployee, onOpenChange: setDelEmployee, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remove this employee?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "All entries will be removed and linked transactions reversed. Admin only." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => delEmpMut.mutate(), className: "bg-destructive text-destructive-foreground", children: "Remove" })
      ] })
    ] }) })
  ] });
}
function EmployeeExpensesAdminSection({
  employeeId
}) {
  const qc = useQueryClient();
  const [expDlgOpen, setExpDlgOpen] = reactExports.useState(false);
  const [editExp, setEditExp] = reactExports.useState(null);
  const [delExp, setDelExp] = reactExports.useState(null);
  const [dlgKind, setDlgKind] = reactExports.useState("expense");
  const {
    data: rows = []
  } = useQuery({
    queryKey: ["employee-wallet", employeeId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("employee_expenses").select("id, employee_id, kind, status, amount, category, note, txn_date, attachment_url, created_at, created_by").eq("employee_id", employeeId).eq("is_deleted", false).order("txn_date", {
        ascending: false
      }).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const totals = (() => {
    const monthPrefix = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
    let d = 0, e = 0, dm = 0, em = 0;
    for (const r of rows) {
      const amt = Number(r.amount);
      if (r.kind === "deposit") {
        if (r.status === "verified") {
          d += amt;
          if (r.txn_date.startsWith(monthPrefix)) dm += amt;
        }
      } else {
        e += amt;
        if (r.txn_date.startsWith(monthPrefix)) em += amt;
      }
    }
    return {
      deposit: d,
      expense: e,
      balance: d - e,
      depositMonth: dm,
      expenseMonth: em
    };
  })();
  const verifyMut = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("employee_expenses").update({
        status: "verified",
        verified_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deposit verified");
      qc.invalidateQueries({
        queryKey: ["employee-wallet"]
      });
    },
    onError: (e) => toast.error(e.message || "Failed")
  });
  const delMut = useMutation({
    mutationFn: async (row) => {
      const {
        error
      } = await supabase.from("employee_expenses").delete().eq("id", row.id);
      if (error) throw error;
      sendAuditEmail({
        action: "deleted",
        module: "Employee Wallet",
        recordId: row.id,
        amount: Number(row.amount),
        notes: row.note,
        oldValues: {
          employee_id: row.employee_id,
          kind: row.kind,
          amount: row.amount,
          category: row.category,
          note: row.note,
          txn_date: row.txn_date,
          attachment_url: row.attachment_url
        }
      });
    },
    onSuccess: () => {
      toast.success("Entry deleted");
      qc.invalidateQueries({
        queryKey: ["employee-wallet"]
      });
      setDelExp(null);
    },
    onError: (e) => toast.error(e.message || "Failed to delete")
  });
  const openNew = (k) => {
    setDlgKind(k);
    setEditExp(null);
    setExpDlgOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-2xl border border-primary/20 bg-primary/[0.02] p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Employee Wallet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Tracking only — does not affect company accounting." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => openNew("expense"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " Expense"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => openNew("deposit"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " Deposit"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: "Balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.balance, size: "sm", className: totals.balance >= 0 ? "text-primary" : "text-destructive" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: "Deposit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.deposit, size: "sm", className: "text-success" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: "Expense" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.expense, size: "sm", className: "text-destructive" })
      ] })
    ] }),
    rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-xs text-muted-foreground", children: "No wallet entries yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: rows.slice(0, 20).map((e) => {
      const isDep = e.kind === "deposit";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border/50 bg-card p-2.5 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", isDep ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"), children: isDep ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: isDep ? "Deposit" : e.category ?? "Expense" }),
            e.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: e.attachment_url, target: "_blank", rel: "noreferrer", className: "text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3" }) }),
            e.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-warning/10 px-1.5 py-0.5 text-[9px] font-medium text-warning-foreground", children: "Pending" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[10px] text-muted-foreground", children: [
            new Date(e.txn_date).toLocaleDateString(),
            " · ",
            e.note
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(e.amount), size: "sm", className: isDep ? "text-success" : "text-destructive" }),
        e.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7 text-success", title: "Verify", onClick: () => verifyMut.mutate(e.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: () => {
          setDlgKind(e.kind);
          setEditExp(e);
          setExpDlgOpen(true);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7 text-destructive", onClick: () => setDelExp(e), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
      ] }, e.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeExpenseDialog, { open: expDlgOpen, onOpenChange: setExpDlgOpen, employeeId, expense: editExp, initialKind: dlgKind, isAdmin: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!delExp, onOpenChange: (v) => {
      if (!v) setDelExp(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this wallet entry?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Wallet-only record. Does not affect any company accounting." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-destructive text-destructive-foreground", onClick: () => delExp && delMut.mutate(delExp), children: "Delete" })
      ] })
    ] }) })
  ] });
}
export {
  EmployeeDetail as component
};
