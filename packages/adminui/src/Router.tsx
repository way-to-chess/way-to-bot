import {createBrowserRouter, redirect} from "react-router";
import {Layout} from "./Layout/Layout";
import {Domains, IDomain} from "./Domains/Domains";
import {Page} from "./Components/Page";

const ROUTER = createBrowserRouter([
    {
        Component: Layout,
        children: [
            {
                path: "/",
                element: null,

                loader: () => redirect("/admin"),
            },
            {
                path: "/admin",
                children: [
                    {
                        index: true,
                        element: null,
                        loader: () => redirect("users"),
                    },

                    ...Domains.map((domain) => ({
                        path: domain.path,
                        index: true,
                        element: <Page {...domain as IDomain}/>
                    })),
                ],
            },
        ],
    },
]);

export {ROUTER};
