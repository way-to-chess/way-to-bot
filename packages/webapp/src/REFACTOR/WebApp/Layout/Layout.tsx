import classes from "./Layout.module.css";
import {BottomNavBar} from "../BottomNavBar/BottomNavBar";
import {ScrollAreaViewport, ScrollThumb} from "../Scroll/Scroll";
import {Location, Outlet, useLocation} from "react-router";
import {ScrollArea} from "@base-ui-components/react";
import {useEffect, useRef} from "react";

const Layout = () => {
    const location = useLocation()
    const historyStack = useRef<Location[]>([])

    const handler = useRef(() => {
        history.back()
        historyStack.current.pop()
    })

    useEffect(() => {
        Telegram.WebApp.BackButton.onClick(handler.current);

        return () => {
            Telegram.WebApp.BackButton.offClick(handler.current)
        }
    }, []);

    useEffect(() => {
        const stack = historyStack.current

        if (stack[stack.length - 1]?.pathname !== location.pathname) {
            stack.push(location)
        }

        if (stack.length > 10) {
            stack.shift()
        }

        if (stack.length >= 2) {
            Telegram.WebApp.BackButton.show();
        } else {
            Telegram.WebApp.BackButton.hide();
        }

    }, [location])


    return (
        <>
            <ScrollArea.Root className={classes.main} render={<main/>}>
                <ScrollAreaViewport>
                    <Outlet/>
                </ScrollAreaViewport>
                <ScrollThumb/>
            </ScrollArea.Root>
            <BottomNavBar/>
        </>
    )
};

export {Layout};
