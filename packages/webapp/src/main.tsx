import {createRoot} from "react-dom/client";
import {isDev} from "./Utils/OneLineUtils";
import {useEffect, useState} from "react";
import * as Sentry from "@sentry/react";
import {App} from "./WebApp/App";

if (!isDev) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
        ],
        // Tracing
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
}

const useTheme = () => {
    const [theme, setTheme] = useState(Telegram.WebApp.colorScheme);

    useEffect(() => {
        const handler = () => {
            setTheme(Telegram.WebApp.colorScheme);
        };

        Telegram.WebApp.onEvent("themeChanged", handler);

        return () => {
            Telegram.WebApp.offEvent("themeChanged", handler);
        };
    }, [setTheme]);

    return theme;
};

createRoot(document.getElementById("root")!).render(<App/>);
