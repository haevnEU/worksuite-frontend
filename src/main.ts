import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { appConfig } from "./app/app.config";
import { consoleInterceptor } from "./services/ConsoleInterceptor.ts";

consoleInterceptor.init();
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
