import {RouterProvider} from "react-router";
import {WEB_APP_ROUTER} from "./Routes";
import {Provider} from "react-redux";
import "../../Assets/Style/Global.css";
import {store} from "../Store";

if (!Telegram.WebApp || Telegram.WebApp.platform === "unknown") {
    document.body.setAttribute("data-dev", "true");
}

const WebApp = () => (
    <Provider store={store}>
        <RouterProvider router={WEB_APP_ROUTER}/>
    </Provider>

);

export {WebApp};
