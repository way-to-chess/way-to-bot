import {useEffect, useRef} from "react";
import {Location, useLocation, useNavigate} from "react-router";
import YM from 'react-yandex-metrika';

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


        YM('hit', location.pathname);


    }, [location])

}

const WithTelegram = () => {
    useBackButton()

    useEffect(() => {
        document.documentElement.style.setProperty("--bottom-bar-height", 56 + Telegram.WebApp.safeAreaInset.bottom + "px")
    }, []);

    return null
}

export {WithTelegram}