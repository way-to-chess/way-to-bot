import { useLocation } from "react-router";
import {
  createContext,
  FC,
  PropsWithChildren,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import { ScrollArea } from "@base-ui-components/react";
import classes from "./Scoll.module.css";

const useScrollToTop = () => {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return ref;
};

const ScrollContext = createContext<RefObject<HTMLDivElement | null>>({
  current: null,
});

const useScrollContext = () => {
  const scrollContext = useContext(ScrollContext);
  if (!scrollContext) {
    throw new Error("useScrollContext must be used within ScrollContext");
  }

  return scrollContext;
};

const ScrollThumb = () => {
  return (
    <ScrollArea.Scrollbar className={classes.scrollbar}>
      <ScrollArea.Thumb className={classes.thumb} />
    </ScrollArea.Scrollbar>
  );
};

const ScrollAreaViewport: FC<PropsWithChildren> = ({ children }) => {
  const ref = useScrollToTop();

  return (
    <ScrollArea.Viewport className={classes.viewport} ref={ref}>
      <ScrollContext value={ref}>{children}</ScrollContext>
    </ScrollArea.Viewport>
  );
};

export { useScrollContext, ScrollAreaViewport, ScrollThumb };
