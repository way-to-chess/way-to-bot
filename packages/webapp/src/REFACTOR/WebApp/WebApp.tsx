import {RouterProvider} from "react-router";
import {WEB_APP_ROUTER} from "./Routes";
import {Provider} from "react-redux";
import "../../Assets/Style/Global.css";
import {store} from "../Store";
import {createContext} from "react";

if (!Telegram.WebApp || Telegram.WebApp.platform === "unknown") {
    document.body.setAttribute("data-dev", "true");
}

interface IAuthContext {
    telegram: typeof Telegram.WebApp.initDataUnsafe.user;
    user: unknown;
}

const AuthContext = createContext({
    telegram: null,
    user: null,
});

const AuthContextProvider = ({children}) => {
    const value = {};

    return <AuthContext>{children}</AuthContext>;
};

const WebApp = () => (
    <Provider store={store}>
        <RouterProvider router={WEB_APP_ROUTER}/>
    </Provider>

);

export {WebApp};
