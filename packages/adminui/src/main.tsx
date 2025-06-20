import {createRoot} from "react-dom/client";
import "./main.css";
import {Provider} from "react-redux";
import {store} from "./Store/Store";
import {RouterProvider} from "react-router";
import {ROUTER} from "./Router";
import {FC, PropsWithChildren} from "react";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {Skeleton} from "antd";
import '@ant-design/v5-patch-for-react-19';


const WithAuth: FC<PropsWithChildren> = ({children}) => {
    const {isLoading, isError} = authApi.useAuthByTelegramQuery({
        tgId: 409658449,
    })

    if (isLoading) {
        return <Skeleton/>
    }

    if (isError) {
        return "Errror"
    }

    return children
}

const App = () => {
    return (
        <Provider store={store}>
            <WithAuth>
                <RouterProvider router={ROUTER}/>
            </WithAuth>
        </Provider>
    );
};

createRoot(document.getElementById("root")!).render(<App/>);
