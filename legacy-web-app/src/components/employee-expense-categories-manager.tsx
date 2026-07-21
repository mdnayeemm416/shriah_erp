import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export type ExpenseCategoryRow = {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
};

export function EmployeeExpenseCategoriesManager() {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["employee-expense-categories", "manage"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employee_expense_categories")
        .select("id, name, is_active, sort_order")
        .order("sort_order").order("name");
      if (error) throw error;
      return (data ?? []) as ExpenseCategoryRow[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["employee-expense-categories"] });
  };

  const addMut = useMutation({
    mutationFn: async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Enter a name");
      const nextOrder = (rows.reduce((m, r) => Math.max(m, r.sort_order), 0) || 0) + 10;
      const { error } = await (supabase as any)
        .from("employee_expense_categories")
        .insert({ name: trimmed, sort_order: nextOrder });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Category added"); setNewName(""); invalidate(); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const renameMut = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!name.trim()) throw new Error("Enter a name");
      const { error } = await (supabase as any)
        .from("employee_expense_categories").update({ name: name.trim() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Renamed"); setEditingId(null); invalidate(); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const toggleMut = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await (supabase as any)
        .from("employee_expense_categories").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("employee_expense_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: any) => toast.error(e.message || "Cannot delete (may be in use)"),
  });

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Manage categories employees can pick when submitting expenses. Disable to hide from the picker.
      </p>

      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          onKeyDown={(e) => { if (e.key === "Enter") addMut.mutate(newName); }}
        />
        <Button onClick={() => addMut.mutate(newName)} disabled={addMut.isPending || !newName.trim()}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {isLoading ? (
        <div className="h-20 animate-pulse rounded-xl bg-muted/40" />
      ) : rows.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="space-y-1.5">
          {rows.map((r) => {
            const editing = editingId === r.id;
            return (
              <div key={r.id} className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-2.5">
                {editing ? (
                  <>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 flex-1" autoFocus />
                    <Button size="icon" variant="ghost" className="h-8 w-8"
                      onClick={() => renameMut.mutate({ id: r.id, name: editName })}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <p className={`flex-1 text-sm font-medium ${r.is_active ? "" : "text-muted-foreground line-through"}`}>{r.name}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>{r.is_active ? "Active" : "Off"}</span>
                      <Switch checked={r.is_active}
                        onCheckedChange={(v) => toggleMut.mutate({ id: r.id, is_active: v })} />
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8"
                      onClick={() => { setEditingId(r.id); setEditName(r.name); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                      onClick={() => { if (confirm(`Delete "${r.name}"?`)) delMut.mutate(r.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
