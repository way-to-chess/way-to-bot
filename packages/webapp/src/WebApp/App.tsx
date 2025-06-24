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

// const WithHeight: FC<PropsWithChildren> = ({children}) => {
//     useLayoutEffect(() => {
//         document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;
//
//         const handler = ({isStateStable}: { isStateStable: boolean }) => {
//             if (!isStateStable) {
//                 document.body.style.height = `${Telegram.WebApp.viewportHeight}px`;
//
//                 return;
//             }
//
//             document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;
//         }
//
//         Telegram.WebApp.onEvent("viewportChanged", handler);
//
//         return () => {
//             Telegram.WebApp.onEvent("viewportChanged", handler)
//         }
//
//     }, []);
//
//
//     return children
// }

const App = () => (
    <ErrorBoundary>
        <Provider store={store}>
            <WithAuth>
                <RouterProvider router={WEB_APP_ROUTER}/>
            </WithAuth>
        </Provider>
    </ErrorBoundary>
);

export {App};
