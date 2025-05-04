import { createRoot } from "react-dom/client";
import { isDev, isHttps } from "./Utils/OneLineUtils";
import { useDispatch, useSelector } from "react-redux";
import { replace } from "@lagunovsky/redux-react-router";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { selectHistoryStack } from "./Store/Router/HistoryReducer";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";
import { WebApp } from "./WebApp/WebApp";

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

if (isDev && !isHttps) {
  document.body.setAttribute("data-dev", "true");
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

const useViewport = () => {
  document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;

  Telegram.WebApp.onEvent("viewportChanged", ({ isStateStable }) => {
    if (!isStateStable) {
      document.body.style.height = `${Telegram.WebApp.viewportHeight}px`;

      return;
    }

    document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;
  });
};

const BackButtonHandler: FC<PropsWithChildren> = ({ children }) => {
  const historyStack = useSelector(selectHistoryStack);

  const dispatch = useDispatch();

  useEffect(() => {
    if (historyStack?.length >= 2) {
      Telegram.WebApp.BackButton.show();

      const handler = () => {
        const historyItem = getNotNil(
          historyStack[historyStack.length - 2],
          `historyItem | stack: ${JSON.stringify(historyStack)}`,
        );

        dispatch(
          replace(historyItem.location.pathname, {
            fromBackButton: true,
          }),
        );
      };

      Telegram.WebApp.BackButton.onClick(handler);

      return () => {
        Telegram.WebApp.BackButton.offClick(handler);
      };
    }

    Telegram.WebApp.BackButton.hide();

    return () => {};
  }, [historyStack, dispatch]);

  return children;
};

createRoot(document.getElementById("root")!).render(<WebApp />);
