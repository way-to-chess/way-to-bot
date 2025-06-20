import classes from "./Layout.module.css";
import {BottomNavBar} from "../BottomNavBar/BottomNavBar";
import {ScrollAreaViewport, ScrollThumb} from "../Scroll/Scroll";
import {Outlet} from "react-router";
import {ScrollArea} from "@base-ui-components/react";
import {WithTelegram} from "../Telegram/Telegram";


const Layout = () => (
    <WithTelegram>
        <ScrollArea.Root className={classes.main} render={<main/>}>
            <ScrollAreaViewport>
                <Outlet/>
            </ScrollAreaViewport>
            <ScrollThumb/>
        </ScrollArea.Root>
        <BottomNavBar/>
    </WithTelegram>
)

export {Layout};
