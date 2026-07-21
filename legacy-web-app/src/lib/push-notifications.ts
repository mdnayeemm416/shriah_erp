import { Capacitor } from "@capacitor/core";
import {
  PushNotifications,
  type Token,
  type PushNotificationSchema,
  type ActionPerformed,
} from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { supabase } from "@/integrations/supabase/client";

let initialized = false;

async function saveToken(token: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase.from("notification_tokens") as any).upsert(
    {
      user_id: user.id,
      token,
      platform: Capacitor.getPlatform(),
      device_info: { ua: typeof navigator !== "undefined" ? navigator.userAgent : null },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "token" },
  );
}

export async function initPushNotifications() {
  if (initialized) return;
  if (!Capacitor.isNativePlatform()) return;
  initialized = true;

  try {
    // Local notifications permission (used to display while app is in foreground)
    await LocalNotifications.requestPermissions();

    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") {
      perm = await PushNotifications.requestPermissions();
    }
    if (perm.receive !== "granted") return;

    await PushNotifications.register();

    PushNotifications.addListener("registration", async (token: Token) => {
      try {
        await saveToken(token.value);
      } catch (e) {
        console.error("Failed to save FCM token", e);
      }
    });

    PushNotifications.addListener("registrationError", (err) => {
      console.error("Push registration error", err);
    });

    // Foreground: show as local notification
    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification: PushNotificationSchema) => {
        try {
          await LocalNotifications.schedule({
            notifications: [
              {
                id: Math.floor(Math.random() * 2_000_000_000),
                title: notification.title ?? "Notification",
                body: notification.body ?? "",
                extra: notification.data,
              },
            ],
          });
        } catch (e) {
          console.error("Local notif schedule failed", e);
        }
      },
    );

    // Background tap
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action: ActionPerformed) => {
        const url = (action.notification.data as { url?: string } | undefined)?.url;
        if (url && typeof window !== "undefined") {
          window.location.href = url;
        }
      },
    );
  } catch (e) {
    console.error("initPushNotifications failed", e);
  }
}

export async function removeCurrentDeviceToken() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await PushNotifications.removeAllListeners();
  } catch {
    // ignore
  }
}
