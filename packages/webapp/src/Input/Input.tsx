import {Input as BaseInput} from "@base-ui-components/react"
import {FC, ReactNode, Ref} from "react";
import clsx from "clsx";
import classes from "./Input.module.css";

interface IInputProps extends BaseInput.Props {
    before?: ReactNode
    after?: ReactNode
    invalid?: boolean
    ref?: Ref<HTMLInputElement>
}

const Input: FC<IInputProps> = ({children, className, before, after, invalid, onClick, ...rest}) => {
    return <div className={clsx(classes.container, className, invalid && classes.invalid)} onClick={onClick}>
        {before}
        <div className={classes.inputContainer}>
            <BaseInput className={classes.input} {...rest}/>
        </div>
        {after}
    </div>
}

export {Input}
export type {IInputProps}
