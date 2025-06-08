import {ComponentProps, FC} from "react";
import {Input} from "../Input/Input";
import clsx from "clsx";
import classes from "./Field.module.css";

interface IFieldProps {
    title?: string;
    error?: string;
    className?: string;
    inputProps: ComponentProps<typeof Input>;
}

const Field: FC<IFieldProps> = ({title, error, className, inputProps}) => {
    return (
        <div className={clsx(classes.container, className)}>
            {title ? <div className={classes.title}>{title}</div> : null}
            <Input {...inputProps} invalid={!!error}/>
            {error && <div className={classes.error}>{error}</div>}
        </div>
    );
};

export {Field};
