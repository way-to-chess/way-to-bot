import {FC} from "react";
import {IInputProps, Input} from "../Input/Input";
import clsx from "clsx";
import classes from "./Field.module.css";
import {ErrorMessage,} from "@hookform/error-message";
import {Controller, useFormContext} from "react-hook-form";
import {ISelectProps, Select} from "../Select/Select";
import {ControllerProps} from "react-hook-form/dist/types/controller";
import {Typography} from "../Typography/Typography";

interface IBaseFieldProps extends ControllerProps {
    label?: string;
    description?: string;
    className?: string;
}

interface IFieldProps<InputProps> extends Pick<IBaseFieldProps, "label" | "className" | "description"> {
    inputProps: InputProps;
    controllerProps: Omit<ControllerProps, "render">
}

const Error: FC<Pick<ControllerProps, "name">> = ({name}) => {
    const form = useFormContext()

    return <ErrorMessage name={name} errors={form.formState.errors}
                         render={({message}) => <div className={classes.error}>{message}</div>}/>
}

const Field: FC<IBaseFieldProps> = ({label, description, className, ...controllerProps}) => {

    return (
        <div className={clsx(classes.container, className)}>
            {label ? <label htmlFor={controllerProps.name} className={classes.label}>{label}</label> : null}
            <Controller {...controllerProps} />
            <Error name={controllerProps.name}/>
            {description ? <Typography type={"text2"} color={"textColor2"} value={description}/> : null}
        </div>
    );
}

const TextField: FC<IFieldProps<IInputProps>> = (
    {
        label,
        description,
        className,
        inputProps,
        controllerProps
    }) => {

    const render: ControllerProps["render"] = ({field, fieldState: {invalid}}) => {
        return <Input {...field}
                      invalid={invalid} {...inputProps}/>
    }

    return <Field label={label} description={description} className={className} {...controllerProps} render={render}/>
};

const SelectField = <V, >(
    {
        controllerProps,
        inputProps,
        description,
        label,
        className
    }: IFieldProps<ISelectProps<V>>) => {

    const render: ControllerProps["render"] = ({field, fieldState: {invalid}}) => {
        return <Select {...field} invalid={invalid} {...inputProps}/>
    }

    return <Field label={label} description={description} className={className} {...controllerProps} render={render}/>
}

export {TextField, SelectField};
