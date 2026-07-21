import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Party } from "@/components/party-manager";

export function PartyCombobox({
  partyId,
  partyName,
  onChange,
  placeholder = "Select or type party…",
}: {
  partyId: string | null;
  partyName: string;
  onChange: (next: { party_id: string | null; party_name: string }) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: parties = [] } = useQuery<Party[]>({
    queryKey: ["parties"],
    queryFn: async () =>
      (((await (supabase as any).from("parties").select("*").eq("is_deleted", false).order("name")).data) ?? []) as Party[],
  });

  const display = partyName || "";
  const trimmedSearch = search.trim();
  const exactMatch = parties.some((p) => p.name.toLowerCase() === trimmedSearch.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !display && "text-muted-foreground")}>
            {display || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter>
          <CommandInput placeholder="Search party…" value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>
              {trimmedSearch ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ party_id: null, party_name: trimmedSearch });
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  Use "<span className="font-medium">{trimmedSearch}</span>" (not saved as party)
                </button>
              ) : (
                <span className="block px-3 py-2 text-sm text-muted-foreground">No parties.</span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {parties.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.name}
                  onSelect={() => {
                    onChange({ party_id: p.id, party_name: p.name });
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", partyId === p.id ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{p.name}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.party_type}
                  </span>
                </CommandItem>
              ))}
              {trimmedSearch && !exactMatch && (
                <CommandItem
                  value={`__new_${trimmedSearch}`}
                  onSelect={() => {
                    onChange({ party_id: null, party_name: trimmedSearch });
                    setOpen(false);
                  }}
                >
                  <span className="text-primary">+ Use "{trimmedSearch}"</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
