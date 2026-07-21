import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, Image as ImageIcon,
  Eye, EyeOff, Link as LinkIcon, GripVertical,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Ad = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  button_text: string | null;
  placement: "home" | "success" | "both";
  link_type: "none" | "product" | "category" | "url";
  link_value: string | null;
  is_active: boolean;
  sort_order: number;
};

const COLS = "id,title,subtitle,image_url,button_text,placement,link_type,link_value,is_active,sort_order";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function BannerAdsManager() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Partial<Ad> | null>(null);

  const list = useQuery({
    queryKey: ["banner-ads"],
    queryFn: async (): Promise<Ad[]> => {
      const { data, error } = await (supabase as any)
        .from("shop_ads")
        .select(COLS)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Ad[];
    },
  });

  const products = useQuery({
    queryKey: ["banner-ads-products"],
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
    queryKey: ["banner-ads-cats"],
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
    qc.invalidateQueries({ queryKey: ["banner-ads"] });
    qc.invalidateQueries({ queryKey: ["admin-shop-ads"] });
    qc.invalidateQueries({ queryKey: ["store-ads"] });
    qc.invalidateQueries({ queryKey: ["shop-ads-active-count"] });
  };

  const save = useMutation({
    mutationFn: async (a: Partial<Ad>) => {
      if (!a.image_url) throw new Error("Please upload a banner image");
      const linkType = (a.link_type ?? "none") as Ad["link_type"];
      const payload: any = {
        title: a.title?.trim() || null,
        subtitle: a.subtitle?.trim() || null,
        image_url: a.image_url.trim(),
        button_text: a.button_text?.trim() || null,
        placement: (a.placement ?? "home") as Ad["placement"],
        link_type: linkType,
        link_value: linkType === "none" ? null : (a.link_value?.trim() || null),
        is_active: a.is_active ?? true,
        sort_order: Number(a.sort_order ?? (list.data?.length ?? 0)),
      };
      if (a.id) {
        const { error } = await (supabase as any).from("shop_ads").update(payload).eq("id", a.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("shop_ads").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { invalidate(); setEditing(null); toast.success("Banner saved"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed to save"),
  });

  const toggle = useMutation({
    mutationFn: async (a: Ad) => {
      const { error } = await (supabase as any).from("shop_ads").update({ is_active: !a.is_active }).eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("shop_ads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Banner deleted"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const swap = useMutation({
    mutationFn: async ({ a, b }: { a: Ad; b: Ad }) => {
      // Use a temporary -1 to avoid unique conflicts if you ever add a unique idx.
      const { error: e1 } = await (supabase as any).from("shop_ads").update({ sort_order: b.sort_order }).eq("id", a.id);
      if (e1) throw e1;
      const { error: e2 } = await (supabase as any).from("shop_ads").update({ sort_order: a.sort_order }).eq("id", b.id);
      if (e2) throw e2;
    },
    onSuccess: invalidate,
  });

  const move = (idx: number, dir: -1 | 1) => {
    const rows = list.data ?? [];
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const a = { ...rows[idx] };
    const b = { ...rows[target] };
    if (a.sort_order === b.sort_order) {
      a.sort_order = idx;
      b.sort_order = target;
    }
    swap.mutate({ a, b });
  };

  const placementLabel = (p: string) => p === "home" ? "Home" : p === "success" ? "Order Success" : "Home + Success";

  const linkLabel = (a: Ad) => {
    if (a.link_type === "none" || !a.link_value) return "No link";
    if (a.link_type === "product") return "Product · " + (products.data?.find(p => p.id === a.link_value)?.name ?? "—");
    if (a.link_type === "category") return "Category · " + (categories.data?.find(c => c.id === a.link_value)?.name ?? "—");
    return a.link_value;
  };

  const activeCount = useMemo(() => (list.data ?? []).filter(a => a.is_active).length, [list.data]);

  return (
    <div className="space-y-4">
      {/* Header summary */}
      <Card className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Total banners</p>
          <p className="text-xl font-semibold">
            {list.data?.length ?? 0}
            <span className="ms-2 text-xs font-normal text-muted-foreground">{activeCount} active</span>
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 rounded-2xl"
          onClick={() => setEditing({
            is_active: true,
            placement: "home",
            link_type: "none",
            sort_order: list.data?.length ?? 0,
          })}
        >
          <Plus className="h-5 w-5" /> New banner
        </Button>
      </Card>

      {/* List */}
      {list.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !list.data?.length ? (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="rounded-full bg-muted p-4"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div>
          <div>
            <p className="font-semibold">No banners yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Add your first promotional banner. It will appear on the storefront home page or order success page.</p>
          </div>
          <Button
            className="mt-1 gap-2 rounded-2xl"
            onClick={() => setEditing({
              is_active: true, placement: "home", link_type: "none", sort_order: 0,
            })}
          >
            <Plus className="h-4 w-4" /> Add first banner
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {list.data.map((a, idx) => (
            <Card key={a.id} className="overflow-hidden">
              <div className="flex items-stretch">
                {/* Reorder */}
                <div className="flex flex-col items-center justify-center gap-1 bg-muted/40 px-1.5 py-2">
                  <Button
                    size="icon" variant="ghost" className="h-7 w-7"
                    disabled={idx === 0} onClick={() => move(idx, -1)}
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <Button
                    size="icon" variant="ghost" className="h-7 w-7"
                    disabled={idx === (list.data?.length ?? 0) - 1} onClick={() => move(idx, 1)}
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                {/* Thumb */}
                <div className="h-24 w-28 flex-shrink-0 overflow-hidden bg-muted sm:w-36">
                  {a.image_url ? (
                    <img src={a.image_url} alt={a.title ?? "banner"} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">No image</div>
                  )}
                </div>
                {/* Body */}
                <div className="min-w-0 flex-1 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold leading-tight">{a.title || "(untitled banner)"}</p>
                      {a.subtitle && <p className="truncate text-xs text-muted-foreground">{a.subtitle}</p>}
                    </div>
                    <Switch checked={a.is_active} onCheckedChange={() => toggle.mutate(a)} aria-label="Active" />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">{placementLabel(a.placement)}</Badge>
                    {a.button_text && <Badge variant="outline" className="text-[10px]">CTA: {a.button_text}</Badge>}
                    {!a.is_active && <Badge variant="secondary" className="text-[10px]">Disabled</Badge>}
                  </div>
                  <p className="mt-1.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                    <LinkIcon className="h-3 w-3" /> {linkLabel(a)}
                  </p>
                  <div className="mt-2 flex gap-1">
                    <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-full" onClick={() => setEditing(a)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="h-8 gap-1.5 rounded-full text-rose-600 hover:text-rose-700"
                      onClick={async () => { if (await confirm({ title: "Delete this banner?", description: "The banner will be removed from the storefront immediately.", confirmText: "Delete", tone: "danger" })) remove.mutate(a.id); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Editor */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit banner" : "New banner"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              {/* Live preview */}
              <div className="overflow-hidden rounded-2xl border bg-muted/40">
                <div className="aspect-[16/7] w-full bg-muted">
                  {editing.image_url ? (
                    <img loading="lazy" decoding="async" src={editing.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Banner preview
                    </div>
                  )}
                </div>
                {(editing.title || editing.subtitle || editing.button_text) && (
                  <div className="space-y-1 p-3">
                    {editing.title && <p className="font-semibold leading-tight">{editing.title}</p>}
                    {editing.subtitle && <p className="text-xs text-muted-foreground">{editing.subtitle}</p>}
                    {editing.button_text && (
                      <span className="mt-1 inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
                        {editing.button_text}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Image */}
              <Field label="Banner image" hint="Tap to upload from your phone gallery or take a photo. Recommended 16:7.">
                <ProductImageUpload
                  value={editing.image_url ?? null}
                  onChange={(url) => setEditing({ ...editing, image_url: url })}
                  searchHints={{ name: editing.title ?? undefined }}
                />
              </Field>

              {/* Text */}
              <Field label="Title (optional)">
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Weekend Mega Sale"
                />
              </Field>
              <Field label="Subtitle (optional)">
                <Input
                  value={editing.subtitle ?? ""}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                  placeholder="e.g. Up to 40% off this Friday only"
                />
              </Field>
              <Field label="Button text (optional)">
                <Input
                  value={editing.button_text ?? ""}
                  onChange={(e) => setEditing({ ...editing, button_text: e.target.value })}
                  placeholder="e.g. Shop now"
                />
              </Field>

              {/* Placement */}
              <Field label="Show on">
                <Select
                  value={editing.placement ?? "home"}
                  onValueChange={(v) => setEditing({ ...editing, placement: v as Ad["placement"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home page</SelectItem>
                    <SelectItem value="success">Order success page</SelectItem>
                    <SelectItem value="both">Both pages</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* Link */}
              <Field label="When tapped">
                <Select
                  value={editing.link_type ?? "none"}
                  onValueChange={(v) => setEditing({ ...editing, link_type: v as Ad["link_type"], link_value: null })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Do nothing</SelectItem>
                    <SelectItem value="product">Open product page</SelectItem>
                    <SelectItem value="category">Open category page</SelectItem>
                    <SelectItem value="url">Open custom link</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {editing.link_type === "product" && (
                <Field label="Product">
                  <Select
                    value={editing.link_value ?? ""}
                    onValueChange={(v) => setEditing({ ...editing, link_value: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Choose product…" /></SelectTrigger>
                    <SelectContent className="max-h-64">
                      {(products.data ?? []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              {editing.link_type === "category" && (
                <Field label="Category">
                  <Select
                    value={editing.link_value ?? ""}
                    onValueChange={(v) => setEditing({ ...editing, link_value: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Choose category…" /></SelectTrigger>
                    <SelectContent className="max-h-64">
                      {(categories.data ?? []).map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              {editing.link_type === "url" && (
                <Field label="Custom link">
                  <Input
                    value={editing.link_value ?? ""}
                    onChange={(e) => setEditing({ ...editing, link_value: e.target.value })}
                    placeholder="https://…"
                    inputMode="url"
                  />
                </Field>
              )}

              {/* Active */}
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="flex items-center gap-2 text-sm">
                  {editing.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  <span>{editing.is_active ? "Banner is active" : "Banner is disabled"}</span>
                </div>
                <Switch
                  checked={editing.is_active ?? true}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={save.isPending} onClick={() => editing && save.mutate(editing)}>
              {save.isPending ? "Saving…" : "Save banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
