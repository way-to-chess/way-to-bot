import {Provider} from "react-redux";
import {store} from "./Store/Store";
import {RouterProvider} from "react-router";
import {ROUTER} from "./Router";
import {createRoot} from "react-dom/client";
import "./main.css";
import "@ant-design/v5-patch-for-react-19";

const App = () => {
    return (
        <Provider store={store}>
            <RouterProvider router={ROUTER}/>
        </Provider>
    );
};

createRoot(document.getElementById("root")!).render(<App/>);


