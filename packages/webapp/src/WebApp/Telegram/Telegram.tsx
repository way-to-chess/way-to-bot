import {FC, PropsWithChildren, useEffect, useRef} from "react";
import {Location, useLocation, useNavigate} from "react-router";

const useBackButton = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const historyStack = useRef<Location[]>([])

    useEffect(() => {
        const handler = () => {
            navigate(-1)
            historyStack.current.pop()
        }

        Telegram.WebApp.BackButton.onClick(handler);

        return () => {
            Telegram.WebApp.BackButton.offClick(handler)
        }

    }, [navigate]);


    useEffect(() => {
        const stack = historyStack.current

        if (stack[stack.length - 1]?.pathname !== location.pathname) {
            stack.push(location)
        }

        if (stack.length > 5) {
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


        document.body.insertAdjacentText("beforebegin", JSON.stringify(Telegram.WebApp.safeAreaInset))
    }, []);


    return children
}

export {WithTelegram}