import {createBrowserRouter, redirect} from "react-router";
import {Layout} from "./Layout/Layout";
import {UsersTable} from "./Domains/Users/Table";
import {ParticipateRequestsTable} from "./Domains/ParticipateRequests/Table";


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
                    {
                        path: "users",
                        children: [
                            {
                                index: true,
                                Component: UsersTable
                            }
                        ]
                    },
                    {
                        path: "participate-requests",
                        children: [
                            {
                                index: true,
                                Component: ParticipateRequestsTable
                            }
                        ]
                    }
                ],
            }
        ],
    },
])

export {ROUTER}