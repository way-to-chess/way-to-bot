import {RouterProvider} from "react-router";
import {WEB_APP_ROUTER} from "./Routes";
import {Provider} from "react-redux";
import "../Assets/Style/Global.css";
import "../Assets/SDK/TelegramWebApp.min.js";
import {store} from "../Store/Store";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {FC, PropsWithChildren} from "react";
import {ErrorBoundary} from "../Error/Error";


const WithAuth: FC<PropsWithChildren> = ({children}) => {
    authApi.useAuthByTelegramQuery({
        tgId: Telegram.WebApp.initDataUnsafe.user?.id,
        username: Telegram.WebApp.initDataUnsafe.user?.username,
    })

    return children
}


const WebApp = () => (
    <ErrorBoundary>
        <Provider store={store}>
            <WithAuth>
                <RouterProvider router={WEB_APP_ROUTER}/>
            </WithAuth>
        </Provider>
    </ErrorBoundary>

);

export {WebApp};
