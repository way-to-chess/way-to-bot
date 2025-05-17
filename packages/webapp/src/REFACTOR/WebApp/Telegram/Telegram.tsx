import {FC, PropsWithChildren, useEffect, useRef} from "react";
import {Location, useLocation} from "react-router";


const useBackButton = () => {
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

}

const WithTelegram: FC<PropsWithChildren> = ({children}) => {
    useBackButton()

    useEffect(() => {
        if (Telegram.WebApp.platform === "unknown") {
            document.body.setAttribute("data-dev", "true");
        }
    }, []);


    return children
}

export {WithTelegram}