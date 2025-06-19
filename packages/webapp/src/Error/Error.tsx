import classes from "./Error.module.css";
import {Typography} from "../Typography/Typography";
import {Component, FC, PropsWithChildren} from "react";
import {Button} from "../Button/Button";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

interface IErrorProps extends PropsWithChildren {
    title: string,
    text: string | number,
}

const Error: FC<IErrorProps> = ({title, text, children, ...rest}) => {
    return <div className={classes.error}>
        <div className={classes.imgContainer}/>
        <Typography type={"title4"} value={title} className={classes.title}/>
        <Typography type={"text2"} value={text} className={classes.text}/>
        {children}
    </div>
}

interface IRefetchError {
    error?: FetchBaseQueryError | SerializedError
    refetch: () => void
}

const RefetchError: FC<IRefetchError> = ({refetch, error}) => {
    const text = error && "status" in error ? error.status : JSON.stringify(error)

    return <Error title={"Ошибка при отправке запроса"} text={text}>
        <Button onClick={refetch}>
            {"Попробовать снова"}
        </Button>
    </Error>
}

class ErrorBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
    constructor(props: PropsWithChildren) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    override render() {
        if (this.state.hasError) {
            return <Error title={""} text={""}/>
        }

        return this.props.children;
    }
}

export {Error, RefetchError, ErrorBoundary}