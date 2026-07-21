import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, aA as sendAuditEmail, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as cn, L as Label, I as Input, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, T as Textarea, B as Button, G as DialogFooter } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { compressImage } from "./image-upload-CX99TgIR.mjs";
import { ad as CircleArrowUp, bf as CircleArrowDown, X, i as Camera, a0 as Image } from "../_libs/lucide-react.mjs";
function EmployeeExpenseDialog({
  open,
  onOpenChange,
  employeeId,
  expense,
  initialKind = "expense",
  isAdmin = false
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const editing = !!expense;
  const [kind, setKind] = reactExports.useState(initialKind);
  const [amount, setAmount] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [file, setFile] = reactExports.useState(null);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const [keepUrl, setKeepUrl] = reactExports.useState(null);
  const cameraRef = reactExports.useRef(null);
  const galleryRef = reactExports.useRef(null);
  const { data: categories = [] } = useQuery({
    queryKey: ["employee-expense-categories", "active"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employee_expense_categories").select("id, name, is_active").eq("is_active", true).order("sort_order").order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  reactExports.useEffect(() => {
    if (open) {
      setKind(expense?.kind ?? initialKind);
      setAmount(expense ? String(expense.amount) : "");
      setCategory(expense?.category ?? "");
      setNote(expense?.note ?? "");
      setDate(expense?.txn_date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
      setFile(null);
      setPreviewUrl(null);
      setKeepUrl(expense?.attachment_url ?? null);
    }
  }, [open, expense, initialKind]);
  reactExports.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  reactExports.useEffect(() => {
    if (open && !editing && kind === "expense" && !category && categories.length > 0) {
      setCategory(categories[0].name);
    }
  }, [open, editing, kind, category, categories]);
  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const amt = parseFloat(amount || "0");
      if (!amt || amt <= 0) throw new Error("Enter a valid amount");
      if (kind === "expense" && !category) throw new Error("Select a category");
      if (!file && !keepUrl) throw new Error("Receipt photo is required");
      let url = keepUrl;
      if (file) {
        if (!file.type.startsWith("image/")) throw new Error("Only images are allowed");
        const blob = await compressImage(file);
        const path = `${user.id}/employee-expenses/${Date.now()}.jpg`;
        const up = await supabase.storage.from("attachments").upload(path, blob, {
          contentType: "image/jpeg",
          upsert: false
        });
        if (up.error) throw up.error;
        url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      }
      const status = kind === "deposit" && !isAdmin ? "pending" : "verified";
      const payload = {
        employee_id: employeeId,
        kind,
        status,
        amount: amt,
        category: kind === "expense" ? category : null,
        note: note.trim(),
        txn_date: date,
        attachment_url: url
      };
      const oldValues = editing && expense ? {
        kind: expense.kind,
        amount: expense.amount,
        category: expense.category,
        note: expense.note,
        txn_date: expense.txn_date,
        attachment_url: expense.attachment_url
      } : null;
      if (editing && expense) {
        const { error } = await supabase.from("employee_expenses").update(payload).eq("id", expense.id);
        if (error) throw error;
        sendAuditEmail({
          action: "edited",
          module: "Employee Wallet",
          recordId: expense.id,
          amount: amt,
          notes: note.trim(),
          oldValues,
          newValues: payload
        });
      } else {
        const { data: ins, error } = await supabase.from("employee_expenses").insert({
          ...payload,
          created_by: user.id,
          user_id: user.id
        }).select("id").single();
        if (error) throw error;
        sendAuditEmail({
          action: "created",
          module: "Employee Wallet",
          recordId: ins?.id ?? null,
          amount: amt,
          notes: note.trim(),
          newValues: payload
        });
      }
      return { kind, status };
    },
    onSuccess: (r) => {
      toast.success(
        editing ? "Wallet entry updated" : r.status === "pending" ? "Deposit submitted — pending admin verification" : r.kind === "deposit" ? "Deposit saved" : "Expense saved"
      );
      qc.invalidateQueries({ queryKey: ["employee-expenses"] });
      qc.invalidateQueries({ queryKey: ["employee-wallet"] });
      qc.invalidateQueries({ queryKey: ["employees"] });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message || "Failed to save")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit wallet entry" : kind === "deposit" ? "New deposit" : "New expense" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setKind("expense"),
            className: cn(
              "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition-colors",
              kind === "expense" ? "border-destructive/60 bg-destructive/5 text-destructive" : "border-border/60 text-muted-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-5 w-5" }),
              "Expense"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setKind("deposit"),
            className: cn(
              "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition-colors",
              kind === "deposit" ? "border-success/60 bg-success/5 text-success" : "border-border/60 text-muted-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-5 w-5" }),
              "Deposit"
            ]
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
      kind === "expense" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: category, onValueChange: setCategory, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-xs text-muted-foreground", children: "No active categories. Ask admin to add some in Settings." }) : categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.name, children: c.name }, c.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
          "Note ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: note,
            onChange: (e) => setNote(e.target.value),
            maxLength: 500,
            rows: 2,
            placeholder: kind === "deposit" ? "Who gave you this money and why?" : "What was this expense for?"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
          "Receipt photo * ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(camera or gallery only)" })
        ] }),
        (previewUrl || keepUrl) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: previewUrl ?? keepUrl,
              alt: "Receipt",
              className: "max-h-40 rounded-lg border border-border/60"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setFile(null);
                setKeepUrl(null);
              },
              className: "absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => cameraRef.current?.click(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
            " Camera"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => galleryRef.current?.click(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }),
            " Gallery"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: cameraRef,
              type: "file",
              accept: "image/*",
              capture: "environment",
              className: "hidden",
              onChange: (e) => setFile(e.target.files?.[0] ?? null)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: galleryRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: (e) => setFile(e.target.files?.[0] ?? null)
            }
          )
        ] })
      ] }),
      kind === "deposit" && !isAdmin && !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-warning/40 bg-warning/5 p-2 text-[11px] text-warning-foreground", children: [
        "This deposit will be marked ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Pending Verification" }),
        " until an admin confirms it."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => save.mutate(), disabled: save.isPending, children: save.isPending ? "Saving…" : editing ? "Save changes" : "Save" })
    ] })
  ] }) });
}
export {
  EmployeeExpenseDialog as E
};
