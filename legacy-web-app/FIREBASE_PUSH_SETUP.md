# Firebase Cloud Messaging (FCM) Setup for Android

This app uses `@capacitor/push-notifications` (FCM) + `@capacitor/local-notifications`.
Device tokens are stored in the `notification_tokens` table and linked to the logged-in user.

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project**
2. Name it (e.g. "ShRiAh ERP") → continue → create.

## 2. Register the Android app
1. In the Firebase project → **Project settings** → **Your apps** → **Add app** → Android.
2. **Android package name** must match `appId` in `capacitor.config.ts`:
   ```
   com.shriahgroup.erp
   ```
3. App nickname: `ShRiAh ERP` (optional).
4. SHA‑1: optional for FCM, required only if you also use Google Sign-In.
5. Click **Register app**.

## 3. Download `google-services.json`
1. Download the `google-services.json` file Firebase gives you.
2. Place it at:
   ```
   android/app/google-services.json
   ```
   (This file is gitignored by default in Capacitor's `.gitignore`. Keep it secret.)

## 4. Verify Gradle wiring (Capacitor 6 does this automatically)
Capacitor's push plugin already adds the Google Services Gradle plugin when you run
`npm run cap:sync`. After placing `google-services.json`, run:

```bash
npm run cap:sync
```

If for any reason the plugin isn't applied, ensure these are present:

**`android/build.gradle`** (project-level, inside `buildscript { dependencies { ... } }`):
```gradle
classpath 'com.google.gms:google-services:4.4.2'
```

**`android/app/build.gradle`** (bottom of the file):
```gradle
apply plugin: 'com.google.gms.google-services'
```

## 5. Build the APK
```bash
npm run cap:sync
npm run cap:open
```
In Android Studio → **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

## 6. Send a test notification
1. Install the APK on a device and sign in.
2. Open the Firebase Console → **Engage → Messaging → Create your first campaign → Firebase Notification messages**.
3. Enter title + body, target your Android app, send.
4. To target a single device:
   - Open the app and sign in.
   - Run this SQL to get your token:
     ```sql
     select token from public.notification_tokens
     where user_id = '<your-user-id>' order by updated_at desc limit 1;
     ```
   - In Firebase Console → Messaging → **Send test message** → paste FCM token.

## 7. How it works in-app
- On sign-in (and on cold start when a session exists), the app:
  1. Requests `POST_NOTIFICATIONS` permission (Android 13+).
  2. Calls `PushNotifications.register()` to obtain an FCM token.
  3. Upserts the token into `public.notification_tokens` linked to `auth.uid()`.
- **Foreground** notifications are displayed using `LocalNotifications` (FCM doesn't show a system notification while the app is open).
- **Background / killed** notifications are shown by the Android system automatically.
- Tapping a notification with `data.url` navigates the app to that URL.

## 8. Sending from your backend (optional)
Use the Firebase Admin SDK with the `FIREBASE_SERVICE_ACCOUNT_JSON` secret already
configured in Lovable Cloud. Example payload:

```json
{
  "message": {
    "token": "<device_fcm_token>",
    "notification": { "title": "New sale", "body": "Sale #123 created" },
    "data": { "url": "/sales/123" },
    "android": { "priority": "high" }
  }
}
```

## 9. Troubleshooting
- **No token received** → Check `google-services.json` package name matches `com.shriahgroup.erp`.
- **Permission denied on Android 13+** → User must allow notifications in the system prompt; re-install or toggle permission in app settings.
- **Notification not shown in foreground** → Expected; the app uses LocalNotifications to display it. Confirm Local Notification permission was granted.
- **Token not saved to DB** → User must be signed in; check RLS — `notification_tokens` requires `auth.uid() = user_id`.

## 10. Generating the Firebase service account (for server-side sending)
If you want your backend (TanStack server functions) to push notifications to users:

1. Firebase Console → **Project settings** → **Service accounts** tab.
2. Click **Generate new private key** → confirm → a JSON file downloads.
3. Open that JSON file, copy its **entire contents** (it's a single JSON object with `type`, `project_id`, `private_key`, `client_email`, etc.).
4. In Lovable → **Cloud → Secrets** → add a secret named:
   ```
   FIREBASE_SERVICE_ACCOUNT_JSON
   ```
   Paste the full JSON as the value. Never commit this file to git.
5. The secret is then available to server functions via `process.env.FIREBASE_SERVICE_ACCOUNT_JSON`.

> ⚠️ This key grants full admin access to your Firebase project. Treat it like a root password.

## 11. Server-side send example (TanStack server function)
Create `src/lib/send-push.functions.ts`:

```ts
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const InputSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(500),
  url: z.string().max(500).optional(),
});

export const sendPushToUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => InputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    // 1. Fetch all device tokens for the target user
    const { data: tokens, error } = await supabase
      .from("notification_tokens")
      .select("token")
      .eq("user_id", data.userId);

    if (error) throw new Error(error.message);
    if (!tokens?.length) return { sent: 0 };

    // 2. Get an OAuth2 access token from the Firebase service account
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);
    const accessToken = await getGoogleAccessToken(sa);

    // 3. Send via FCM HTTP v1 API
    let sent = 0;
    for (const { token } of tokens) {
      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token,
              notification: { title: data.title, body: data.body },
              data: data.url ? { url: data.url } : undefined,
              android: { priority: "HIGH" },
            },
          }),
        },
      );
      if (res.ok) sent++;
    }

    return { sent };
  });

// Mints a short-lived OAuth2 token from the service-account JWT
async function getGoogleAccessToken(sa: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const enc = (o: object) =>
    Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${enc(header)}.${enc(claim)}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const jwt = `${unsigned}.${Buffer.from(sig).toString("base64url")}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  return Buffer.from(b64, "base64").buffer as ArrayBuffer;
}
```

Call it from anywhere in the app:
```ts
import { useServerFn } from "@tanstack/react-start";
import { sendPushToUser } from "@/lib/send-push.functions";

const sendPush = useServerFn(sendPushToUser);
await sendPush({ data: { userId, title: "Hello", body: "Test", url: "/dashboard" } });
```

## 12. Token lifecycle & hygiene
- **On sign-out**: delete or mark stale tokens for the current device so a different user on the same device doesn't receive the previous user's pushes.
- **On token refresh**: FCM rotates tokens automatically — the `registration` listener fires again and the upsert keeps the table in sync.
- **On send failure**: if FCM returns `UNREGISTERED` or `INVALID_ARGUMENT` for a token, delete that row from `notification_tokens` to avoid future wasted sends.
- **Multi-device**: A user can have multiple rows (one per device). The send function loops through all tokens — that's intentional.

## 13. Production checklist
- [ ] `google-services.json` placed in `android/app/` (NOT committed to git)
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` secret added in Lovable Cloud
- [ ] Package name matches in **Firebase Console**, `capacitor.config.ts`, and `android/app/build.gradle`
- [ ] APK signed with a release keystore (not debug) for Play Store
- [ ] Tested cold-start, foreground, and background notification delivery
- [ ] Verified tap-to-open navigation via `data.url`
- [ ] Confirmed RLS prevents users from reading other users' tokens

## 14. Useful references
- FCM HTTP v1 API: https://firebase.google.com/docs/cloud-messaging/send-message
- Capacitor Push Notifications: https://capacitorjs.com/docs/apis/push-notifications
- Android 13 notification permission: https://developer.android.com/develop/ui/views/notifications/notification-permission
