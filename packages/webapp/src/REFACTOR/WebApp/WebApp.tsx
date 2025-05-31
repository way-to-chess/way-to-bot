import {RouterProvider} from "react-router";
import {WEB_APP_ROUTER} from "./Routes";
import {Provider} from "react-redux";
import "../../Assets/Style/Global.css";
import "../../Assets/SDK/TelegramWebApp.min.js";
import {store} from "../Store/Store";
import {webAppAuthApi} from "../Store/WebAppAuthApi";
import {FC, PropsWithChildren} from "react";


const WithAut: FC<PropsWithChildren> = ({children}) => {
    webAppAuthApi.useAuthByTelegramQuery()

    return children
}

const WebApp = () => (
    <Provider store={store}>
        <WithAut>
            <RouterProvider router={WEB_APP_ROUTER}/>
        </WithAut>
    </Provider>

);

export {WebApp};
