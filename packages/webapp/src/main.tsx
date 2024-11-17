import { createRoot } from "react-dom/client";
import "./main.css";
import { isDev, isHttps } from "./Utils/OneLineUtils";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./Store/App/CreateStore";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useHref,
  useNavigate,
} from "react-router-dom";
import { ReduxRouter } from "@lagunovsky/redux-react-router";
import { createBrowserHistory } from "history";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { ManageUsersPage } from "./ManageUsersPage/ManageUsersPage";

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

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  return (
    <NextThemesProvider attribute="class" forcedTheme={theme}>
      {children}
    </NextThemesProvider>
  );
};

const UIProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </NextUIProvider>
  );
};

const history = createBrowserHistory();

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <ReduxRouter history={history}>
      <UIProvider>
        <ThemeProvider>
          <Routes>
            <Route path={WEBAPP_ROUTES.anyRoute}>
              <Route
                index
                element={<Navigate to={WEBAPP_ROUTES.manageUsersRoute} />}
              />

              <Route
                path={WEBAPP_ROUTES.manageUsersRoute}
                element={<ManageUsersPage />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </UIProvider>
    </ReduxRouter>
  </ReduxProvider>,
);
