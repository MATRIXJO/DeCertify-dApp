   import * as Sentry from "@sentry/react";
   import { BrowserTracing } from "@sentry/tracing";

   Sentry.init({
     dsn: "https://b2cefe974cfbaab01a96928f13c0f7e6@o4509450935140352.ingest.de.sentry.io/4509450942742608", // Replace with your Sentry DSN
     integrations: [new BrowserTracing()],
     tracesSampleRate: 1.0, // Adjust for performance monitoring
   });
