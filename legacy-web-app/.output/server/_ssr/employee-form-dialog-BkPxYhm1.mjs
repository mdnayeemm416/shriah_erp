import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, I as Input, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, T as Textarea, G as DialogFooter, B as Button } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { X, q as Paperclip } from "../_libs/lucide-react.mjs";
function EmployeeFormDialog({
  open,
  onOpenChange,
  employee
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const editing = !!employee;
  const [name, setName] = reactExports.useState("");
  const [shopId, setShopId] = reactExports.useState("");
  const [mobile, setMobile] = reactExports.useState("");
  const [iqama, setIqama] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [monthlySalary, setMonthlySalary] = reactExports.useState("");
  const [userId, setUserId] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [keepUrl, setKeepUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (open) {
      setName(employee?.name ?? "");
      setShopId(employee?.shop_id ?? "");
      setMobile(employee?.mobile ?? "");
      setIqama(employee?.iqama ?? "");
      setNotes(employee?.notes ?? "");
      setMonthlySalary(
        employee?.monthly_salary != null ? String(employee.monthly_salary) : ""
      );
      setUserId(employee?.user_id ?? "");
      setFile(null);
      setKeepUrl(employee?.attachment_url ?? null);
    }
  }, [open, employee]);
  const { data: shops = [] } = useQuery({
    queryKey: ["shops-active"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shops").select("id, name").eq("is_deleted", false).order("name");
      if (error) throw error;
      return data;
    }
  });
  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles-for-employee-link"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!name.trim()) throw new Error("Name is required");
      let url = keepUrl;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/employees/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (up.error) throw up.error;
        url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      }
      const shop = shops.find((s) => s.id === shopId);
      const payload = {
        name: name.trim(),
        shop_id: shopId || null,
        shop_name: shop?.name ?? null,
        mobile: mobile.trim() || null,
        iqama: iqama.trim() || null,
        notes: notes.trim() || null,
        monthly_salary: Number(monthlySalary) || 0,
        attachment_url: url,
        user_id: userId || null
      };
      if (editing && employee) {
        const { error } = await supabase.from("employees").update(payload).eq("id", employee.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("employees").insert({ ...payload, created_by: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Employee updated" : "Employee added");
      qc.invalidateQueries({ queryKey: ["employees"] });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message || "Failed to save")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit employee" : "Add employee" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Morshed", maxLength: 120 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Shop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: shopId || "none", onValueChange: (v) => setShopId(v === "none" ? "" : v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select shop" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— None —" }),
            shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mobile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: mobile, onChange: (e) => setMobile(e.target.value), placeholder: "05XXXXXXXX", maxLength: 20 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Iqama" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: iqama, onChange: (e) => setIqama(e.target.value), placeholder: "ID number", maxLength: 30 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Monthly Salary (SAR)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            inputMode: "decimal",
            min: 0,
            step: "any",
            value: monthlySalary,
            onChange: (e) => setMonthlySalary(e.target.value),
            placeholder: "e.g. 1500"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Used in Profit Summary salary calculation. Does not affect the employee ledger." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Linked Login (for Employee Expense)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: userId || "none", onValueChange: (v) => setUserId(v === "none" ? "" : v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select login user" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Not linked —" }),
            profiles.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.full_name || p.email || p.id.slice(0, 8) }, p.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Link this employee to a login user so they can submit their own Employee Expenses." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), maxLength: 500, rows: 2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Attachment (image or PDF)" }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => save.mutate(), disabled: save.isPending, children: save.isPending ? "Saving…" : editing ? "Save changes" : "Add employee" })
    ] })
  ] }) });
}
export {
  EmployeeFormDialog as E
};
