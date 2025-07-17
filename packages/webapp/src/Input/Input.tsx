import {Input as BaseInput} from "@base-ui-components/react"
import {FC, ReactNode} from "react";
import clsx from "clsx";
import classes from "./Input.module.css";

interface IInputProps extends BaseInput.Props {
    before?: ReactNode
    after?: ReactNode
    invalid?: boolean
}

const Input: FC<IInputProps> = ({children, className, before, after, invalid, onClick, ...rest}) => {
    return <div className={clsx(classes.container, className, invalid && classes.invalid)} onClick={onClick}>
        {before}
        <BaseInput className={classes.input} {...rest}/>
        {after}
    </div>
}

export {Input}
