import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tags, Plus, Pencil, Trash2, Search, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

type Category = { id: string; name: string; txn_type: "cash_in" | "cash_out"; icon: string | null };
type SubCategory = { id: string; name: string; category_id: string };

export function CategoryManager() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [q, setQ] = useState("");
  const [activeCatId, setActiveCatId] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => ((await (supabase as any).from("categories").select("*").eq("is_deleted", false).order("name")).data ?? []) as Category[],
  });
  const { data: subs = [] } = useQuery<SubCategory[]>({
    queryKey: ["sub_categories"],
    queryFn: async () => ((await (supabase as any).from("sub_categories").select("*").eq("is_deleted", false).order("name")).data ?? []) as SubCategory[],
  });

  const filteredCats = categories.filter((c) =>
    !q || c.name.toLowerCase().includes(q.toLowerCase())
  );
  const activeCat = categories.find((c) => c.id === activeCatId);
  const activeSubs = subs.filter((s) => s.category_id === activeCatId);

  const deleteCat = async (id: string) => {
    if (!(await confirm({ title: "Move category to Recycle Bin?", description: "Old entries will still display this category. You can restore it anytime from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    const { softDelete } = await import("@/lib/soft-delete");
    const { error } = await softDelete("categories", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      if (activeCatId === id) setActiveCatId(null);
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["sub_categories"] });
    }
  };

  const deleteSub = async (id: string) => {
    if (!(await confirm({ title: "Move sub-category to Recycle Bin?", description: "Existing entries keep this sub-category. Recover it from the Recycle Bin anytime.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    const { softDelete } = await import("@/lib/soft-delete");
    const { error } = await softDelete("sub_categories", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      qc.invalidateQueries({ queryKey: ["sub_categories"] });
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          <Tags className="h-4 w-4 text-primary" /> Categories & Sub-categories
        </h2>
        <CategoryFormDialog userId={user?.id} />
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search categories…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Categories list */}
        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </div>
          {filteredCats.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No categories.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {filteredCats.map((c) => {
                const isIn = c.txn_type === "cash_in";
                const isActive = c.id === activeCatId;
                return (
                  <li
                    key={c.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors",
                      isActive ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                    onClick={() => setActiveCatId(c.id)}
                  >
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                      isIn ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {isIn ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    </div>
                    <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
                    <CategoryFormDialog userId={user?.id} editing={c} trigger={
                      <button onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    } />
                    <button onClick={(e) => { e.stopPropagation(); deleteCat(c.id); }} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Sub-categories */}
        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {activeCat ? `Sub-categories of ${activeCat.name}` : "Sub-categories"}
            </span>
            {activeCat && <SubCategoryFormDialog userId={user?.id} categoryId={activeCat.id} />}
          </div>
          {!activeCat ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Select a category to view its sub-categories.</p>
          ) : activeSubs.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No sub-categories yet.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {activeSubs.map((s) => (
                <li key={s.id} className="flex items-center gap-2 px-3 py-2.5">
                  <span className="flex-1 truncate text-sm">{s.name}</span>
                  <SubCategoryFormDialog userId={user?.id} categoryId={s.category_id} editing={s} trigger={
                    <button className="text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  } />
                  <button onClick={() => deleteSub(s.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}

// ───────────────────────────────────────────────
function CategoryFormDialog({
  userId, editing, trigger,
}: { userId?: string; editing?: Category; trigger?: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(editing?.name ?? "");
  const [type, setType] = useState<"cash_in" | "cash_out">(editing?.txn_type ?? "cash_out");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    const payload = { name: name.trim(), txn_type: type };
    const { error } = editing
      ? await (supabase as any).from("categories").update(payload).eq("id", editing.id)
      : await (supabase as any).from("categories").insert({ ...payload, created_by: userId });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Updated" : "Added");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      if (!editing) setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add category</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} category</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="e.g. Rent" />
          </div>
          <div>
            <Label>Transaction type</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash_in">Cash In</SelectItem>
                <SelectItem value="cash_out">Cash Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy} className="w-full">{busy ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubCategoryFormDialog({
  userId, categoryId, editing, trigger,
}: { userId?: string; categoryId: string; editing?: SubCategory; trigger?: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(editing?.name ?? "");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    const { error } = editing
      ? await (supabase as any).from("sub_categories").update({ name: name.trim() }).eq("id", editing.id)
      : await (supabase as any).from("sub_categories").insert({ name: name.trim(), category_id: categoryId, created_by: userId });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Updated" : "Added");
      qc.invalidateQueries({ queryKey: ["sub_categories"] });
      setOpen(false);
      if (!editing) setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm" variant="outline"><Plus className="mr-1 h-3.5 w-3.5" /> Add sub</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} sub-category</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="e.g. Electricity" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy} className="w-full">{busy ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
