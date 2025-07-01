import { createRoot } from "react-dom/client";
import "./main.css";
import { Provider } from "react-redux";
import { store } from "./Store/Store";
import { RouterProvider } from "react-router";
import { ROUTER } from "./Router";
import { FC, PropsWithChildren, useLayoutEffect, useState } from "react";
import { authApi } from "@way-to-bot/shared/redux/authApi";
import { Skeleton } from "antd";
import "@ant-design/v5-patch-for-react-19";

const WithAuth: FC<PropsWithChildren> = ({ children }) => {
  const [tgId, setTgId] = useState(() =>
    localStorage.getItem("tgId") ? Number(localStorage.getItem("tgId")) : 0,
  );

  const { isLoading, isError } = authApi.useAuthByTelegramQuery({ tgId });

  useLayoutEffect(() => {
    new Promise<string | number | null>((resolve) => {
      const value = tgId || window.prompt("Пароль");

      resolve(value);
    }).then((value) => {
      if (!value) {
        return;
      }

      setTgId(Number(value));
      localStorage.setItem("tgId", String(value));
    });
  }, []);

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return "Errror";
  }

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <WithAuth>
        <RouterProvider router={ROUTER} />
      </WithAuth>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
