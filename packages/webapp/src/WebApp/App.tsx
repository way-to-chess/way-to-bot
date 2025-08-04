import {RouterProvider} from "react-router";
import {WEB_APP_ROUTER} from "./Routes";
import {Provider} from "react-redux";
import "../Assets/Style/Global.css";
import "../Assets/SDK/TelegramWebApp.min.js";
import {store} from "../Store/Store";
import {ErrorBoundary} from "../Error/Error";
import {z} from "zod";
import {YMInitializer} from "react-yandex-metrika";

z.config({
    customError: () => "Неверное значение"
});


const YMInitializerProps = {
    accounts: [103541945],
    options: {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true
    }
}

const App = () => (<>
    <YMInitializer {...YMInitializerProps}  />

    <ErrorBoundary>
        <Provider store={store}>
            <RouterProvider router={WEB_APP_ROUTER}/>
        </Provider>
    </ErrorBoundary>
</>)

export {App};
