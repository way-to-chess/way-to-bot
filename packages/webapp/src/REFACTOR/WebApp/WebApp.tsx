import { RouterProvider } from "react-router";
import { WEB_APP_ROUTER } from "./Routes";
import { Provider, useDispatch, useSelector } from "react-redux";
import "../../Assets/Style/Global.css";
import { store } from "../Store";
import { createContext, FC, PropsWithChildren, useEffect } from "react";
import { selectHistoryStack } from "../../Store/Router/HistoryReducer";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";
import { replace } from "@lagunovsky/redux-react-router";
import { IUser } from "@way-to-bot/shared/interfaces/user.interface";

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

interface IAuthContext {
  telegram: typeof Telegram.WebApp.initDataUnsafe.user;
  user: IUser;
}

const AuthContext = createContext({
  telegram: null,
  user: null,
});

const AuthContextProvider = ({ children }) => {
  const value = {};

  return <AuthContext>{children}</AuthContext>;
};

const WebApp = () => (
  <Provider store={store}>
    <AuthContext>
      <RouterProvider router={WEB_APP_ROUTER} />
    </AuthContext>
  </Provider>
);

export { WebApp };
