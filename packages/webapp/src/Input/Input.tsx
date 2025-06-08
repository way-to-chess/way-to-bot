import {Input as BaseInput} from "@base-ui-components/react"
import {FC, ReactNode} from "react";
import clsx from "clsx";
import classes from "./Input.module.css";

interface IInputProps extends BaseInput.Props {
    before?: ReactNode
}

const Input: FC<IInputProps> = ({children, className, before, ...rest}) => {
    return <div className={clsx(classes.container, className)}>
        {before}
        <BaseInput className={classes.input} {...rest}/>
    </div>
}

export {Input}