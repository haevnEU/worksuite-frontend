import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    plugins: [
      react({
        // Deaktiviert Fast-Refresh/HMR-Preamble-Hooks im Prod-Build zwingend!
        fastRefresh: !isBuild,
      }),
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        isBuild ? "production" : "development"
      ),
      "process.env": {},
      global: "window",

      // Falls der Minifier/Bundler doch HMR-Module zieht,
      // ersetzen wir alle Vite-Dev-Tokens durch leere Strings:
      __DEFINES__: "{}",
      __HMR_CONFIG_NAME__: '""',
      __HMR_PROTOCOL__: '""',
      __HMR_HOSTNAME__: '""',
      __HMR_PORT__: '""',
      __HMR_DIRECT_TARGET__: '""',
      __HMR_BASE__: '""',
      __HMR_TIMEOUT__: '0',
      __HMR_ENABLE_OVERLAY__: 'false',
      __WS_TOKEN__: '""',
      __SERVER_HOST__: '""',
      __BASE__: '"/"',
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      target: "es2022",
      // Verhindert das Bündeln von Dev-Client-Polyfills
      modulePreload: {
        polyfill: false,
      },
    },
    // WICHTIG: Den server-Block mit HMR NUR für 'serve' (Entwicklung) konfigurieren!
    ...(isBuild
      ? {}
      : {
        server: {
          host: "0.0.0.0",
          port: 3000,
          strictPort: true,
          watch: {
            usePolling: true,
            interval: 100,
          },
          hmr: {
            protocol: "ws",
            host: "localhost",
            clientPort: 80,
          },
        },
      }),
  };
});