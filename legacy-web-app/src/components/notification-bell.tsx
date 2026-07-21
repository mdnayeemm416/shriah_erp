import { useState } from "react";
import { Bell, BellOff, MessageCircle, Eye, Check, Volume2, VolumeX, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOrderNotifications } from "@/hooks/use-order-notifications";

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function NotificationBell({ className }: { className?: string }) {
  const { notifications, unread, muted, setMuted, permission, requestPermission, markAllRead, markRead, clear, openWhatsApp } = useOrderNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className={cn(
            "relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-muted active:scale-95 transition-transform",
            className,
          )}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[92vw] max-w-[360px] p-0">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Notifications</p>
            {unread > 0 && (
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {unread} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMuted(!muted)}
              title={muted ? "Unmute" : "Mute"}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            {notifications.length > 0 && (
              <>
                <button
                  onClick={markAllRead}
                  title="Mark all read"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={clear}
                  title="Clear"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {permission !== "granted" && permission !== "unsupported" && (
          <div className="border-b border-border/60 bg-muted/30 px-3 py-2">
            <div className="flex items-start gap-2">
              <BellOff className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium">Enable browser alerts</p>
                <p className="text-[11px] text-muted-foreground">Get alerts even when tab is in background.</p>
              </div>
              <Button size="sm" variant="default" className="h-7 text-[11px]" onClick={requestPermission}>
                Allow
              </Button>
            </div>
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-[12px] text-muted-foreground">No notifications yet</p>
              <p className="text-[11px] text-muted-foreground/70">New orders will appear here instantly.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "px-3 py-2.5 transition-colors",
                    !n.read && "bg-primary/[0.04]",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "mt-0.5 h-2 w-2 rounded-full shrink-0",
                      n.read ? "bg-transparent" : "bg-primary",
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold truncate">🛒 Order #{n.orderNumber}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="text-[12px] text-muted-foreground truncate">
                        {n.customer} — {n.itemCount} items · SAR {n.total.toFixed(2)}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Link
                          to="/store-admin"
                          search={{ tab: "notifications" } as any}
                          onClick={() => { markRead(n.id); setOpen(false); }}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:opacity-90"
                        >
                          <Eye className="h-3 w-3" /> View
                        </Link>
                        <button
                          onClick={() => openWhatsApp(n)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-emerald-700"
                        >
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </button>
                        {!n.read && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
