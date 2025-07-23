import {createBrowserRouter, Navigate, redirect} from "react-router";
import {Layout} from "./Layout/Layout";
import {Domains} from "./Domains/Domains";

const ROUTER = createBrowserRouter([
    {
        Component: Layout,
        errorElement: <Navigate to="/admin"/>,
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

                    ...Domains.map(({path, Component}) => ({
                        path,
                        index: true,
                        Component,
                    })),
                ],
            },
        ],
    },
]);

export {ROUTER};
