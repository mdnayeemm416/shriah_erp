import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, Image as ImageIcon,
  Eye, EyeOff, Calendar,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ProductImageUpload } from "@/components/product-image-upload";
import { useConfirm } from "@/hooks/use-confirm";

type Banner = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  link_type: "none" | "product" | "category" | "url";
  link_value: string | null;
  is_active: boolean;
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
};

const COLS =
  "id,image_url,title,description,link_type,link_value,is_active,sort_order,start_date,end_date";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function toLocalInput(v: string | null) {
  if (!v) return "";
  const d = new Date(v);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string) {
  return v ? new Date(v).toISOString() : null;
}

export function WebsiteBannersManager() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);

  const list = useQuery({
    queryKey: ["website-banners-admin"],
    queryFn: async (): Promise<Banner[]> => {
      const { data, error } = await (supabase as any)
        .from("shop_banners")
        .select(COLS)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Banner[];
    },
  });

  const products = useQuery({
    queryKey: ["website-banners-products"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_products")
        .select("id,name")
        .eq("is_deleted", false)
        .order("name");
      if (error) throw error;
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  const categories = useQuery({
    queryKey: ["website-banners-cats"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_categories")
        .select("id,name")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["website-banners-admin"] });
    qc.invalidateQueries({ queryKey: ["store-banners"] });
  };

  const save = useMutation({
    mutationFn: async (b: Partial<Banner>) => {
      if (!b.image_url) throw new Error("Banner image is required");
      const payload: any = {
        image_url: b.image_url,
        title: b.title?.trim() || null,
        description: b.description?.trim() || null,
        link_type: b.link_type || "none",
        link_value: b.link_type && b.link_type !== "none" ? (b.link_value || null) : null,
        is_active: b.is_active ?? true,
        sort_order: b.sort_order ?? 0,
        start_date: b.start_date || null,
        end_date: b.end_date || null,
      };
      if (b.id) {
        const { error } = await (supabase as any).from("shop_banners").update(payload).eq("id", b.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("shop_banners").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { invalidate(); setEditing(null); toast.success("Banner saved"); },
    onError: (e: any) => toast.error(e.message ?? "Save failed"),
  });

  const toggleActive = useMutation({
    mutationFn: async (b: Banner) => {
      const { error } = await (supabase as any)
        .from("shop_banners").update({ is_active: !b.is_active }).eq("id", b.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const reorder = useMutation({
    mutationFn: async ({ id, sort_order }: { id: string; sort_order: number }) => {
      const { error } = await (supabase as any)
        .from("shop_banners").update({ sort_order }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("shop_banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Banner deleted"); },
  });

  const items = list.data ?? [];
  const nextOrder = useMemo(
    () => (items.length ? Math.max(...items.map((b) => b.sort_order)) + 1 : 0),
    [items],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Website Banners</h2>
          <p className="text-xs text-muted-foreground">
            Shown on the customer storefront top carousel.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditing({ is_active: true, sort_order: nextOrder, link_type: "none" })}>
          <Plus className="me-1 h-4 w-4" /> Add Banner
        </Button>
      </div>

      {list.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-8 text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No banners yet. Add your first banner.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((b, idx) => {
            const now = new Date();
            const scheduled =
              (b.start_date && new Date(b.start_date) > now) ||
              (b.end_date && new Date(b.end_date) < now);
            return (
              <Card key={b.id} className="flex items-center gap-3 overflow-hidden p-2">
                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {b.image_url ? (
                    <img src={b.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{b.title || "Untitled banner"}</p>
                    {!b.is_active && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                    {scheduled && b.is_active && <Badge variant="outline" className="text-[10px]">Scheduled</Badge>}
                  </div>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                    Order {b.sort_order} · Link: {b.link_type}
                  </p>
                </div>
                <div className="flex flex-col">
                  <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === 0}
                    onClick={() => {
                      const prev = items[idx - 1];
                      if (!prev) return;
                      reorder.mutate({ id: b.id, sort_order: prev.sort_order });
                      reorder.mutate({ id: prev.id, sort_order: b.sort_order });
                    }}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === items.length - 1}
                    onClick={() => {
                      const next = items[idx + 1];
                      if (!next) return;
                      reorder.mutate({ id: b.id, sort_order: next.sort_order });
                      reorder.mutate({ id: next.id, sort_order: b.sort_order });
                    }}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="icon" variant="ghost" onClick={() => toggleActive.mutate(b)} aria-label="Toggle">
                  {b.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditing(b)} aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete"
                  onClick={async () => {
                    const ok = await confirm({ title: "Delete banner?", description: "This cannot be undone." });
                    if (ok) del.mutate(b.id);
                  }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Banner image *">
                <ProductImageUpload
                  value={editing.image_url ?? null}
                  onChange={(url) => setEditing({ ...editing, image_url: url ?? undefined })}
                />
              </Field>
              <Field label="Title (optional)">
                <Input value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Mega Sale" />
              </Field>
              <Field label="Description (optional)">
                <Textarea rows={2} value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Short message" />
              </Field>
              <Field label="Link type">
                <Select
                  value={editing.link_type ?? "none"}
                  onValueChange={(v) => setEditing({ ...editing, link_type: v as any, link_value: null })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No link</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="url">External URL</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {editing.link_type === "product" && (
                <Field label="Choose product">
                  <Select value={editing.link_value ?? ""}
                    onValueChange={(v) => setEditing({ ...editing, link_value: v })}>
                    <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>
                      {(products.data ?? []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              {editing.link_type === "category" && (
                <Field label="Choose category">
                  <Select value={editing.link_value ?? ""}
                    onValueChange={(v) => setEditing({ ...editing, link_value: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {(categories.data ?? []).map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              {editing.link_type === "url" && (
                <Field label="URL">
                  <Input type="url" value={editing.link_value ?? ""}
                    onChange={(e) => setEditing({ ...editing, link_value: e.target.value })}
                    placeholder="https://…" />
                </Field>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date (optional)">
                  <Input type="datetime-local" value={toLocalInput(editing.start_date ?? null)}
                    onChange={(e) => setEditing({ ...editing, start_date: fromLocalInput(e.target.value) })} />
                </Field>
                <Field label="End date (optional)">
                  <Input type="datetime-local" value={toLocalInput(editing.end_date ?? null)}
                    onChange={(e) => setEditing({ ...editing, end_date: fromLocalInput(e.target.value) })} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Display order">
                  <Input type="number" value={editing.sort_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })} />
                </Field>
                <div className="flex items-end gap-2 pb-1">
                  <Switch checked={editing.is_active ?? true}
                    onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>

              {(editing.start_date || editing.end_date) && (
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Banner will only show between the selected dates.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save.mutate(editing)} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
