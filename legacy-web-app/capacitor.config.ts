import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.shriahgroup.erp",
  appName: "ShRiAh ERP",
  webDir: "www",
  server: {
    url: "https://sharia-flow-boss.lovable.app",
    cleartext: false,
  },
  android: {
    buildOptions: {
      releaseType: "APK",
    },
  },
  plugins: {},
};

export default config;
