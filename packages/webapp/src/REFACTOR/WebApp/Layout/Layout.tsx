import classes from "./Layout.module.css";
import { BottomNavBar } from "../BottomNavBar/BottomNavBar";
import { ScrollAreaViewport, ScrollThumb } from "../Scroll/Scroll";
import { Outlet } from "react-router";
import { ScrollArea } from "@base-ui-components/react";

const Layout = () => (
  <>
    <ScrollArea.Root className={classes.main} render={<main />}>
      <ScrollAreaViewport>
        <Outlet />
      </ScrollAreaViewport>
      <ScrollThumb />
    </ScrollArea.Root>
    <BottomNavBar />
  </>
);

export { Layout };
