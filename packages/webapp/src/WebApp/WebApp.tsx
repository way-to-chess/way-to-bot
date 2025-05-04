import { RouterProvider } from "react-router";
import { WEB_APP_ROUTER } from "./Routes";
import { store } from "../Store/App/CreateStore";
import { Provider } from "react-redux";
import "../Assets/Style/Global.css";

const WebApp = () => (
  <Provider store={store}>
    <RouterProvider router={WEB_APP_ROUTER} />
  </Provider>
);

export { WebApp };
