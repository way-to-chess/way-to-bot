import classes from "./Error.module.css";
import {Typography} from "../Typography/Typography";
import {FC, PropsWithChildren} from "react";
import {Button} from "../../Button/Button";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

interface IErrorProps extends PropsWithChildren {
    title: string,
    text: string,
}

const Error: FC<IErrorProps> = ({title, text, children}) => {
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
    const text = error && "error" in error ? error.error : JSON.stringify(error)

    return <Error title={"Ошибка при отправке запроса"} text={text}>
        <Button onClick={refetch}>
            {"Попробовать снова"}
        </Button>
    </Error>
}

export {Error, RefetchError}