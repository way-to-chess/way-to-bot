import classes from "./Options.module.css";
import {Typography} from "../Typography/Typography";
import {Radio, RadioGroup} from "@base-ui-components/react";
import {Fragment, ReactNode} from "react";
import clsx from "clsx";

interface IOption<Value> {
    title: string
    value: Value
    description?: string
    icon?: ReactNode
    disabled?: boolean
    indicator?: ReactNode
    danger?: boolean
    className?: string
}

interface IOptionsProps<Value> {
    options: IOption<Value>[]
    value?: IOption<Value>["value"]
    onValueChange?: ((value: IOption<Value>["value"], event: Event) => void)
}

const Options = <Value, >({options, value, onValueChange}: IOptionsProps<Value>) => {
    const _onValueChange = (value: unknown, event: Event) => onValueChange?.(value as Value, event)

    return <RadioGroup className={classes.options} value={value} onValueChange={_onValueChange}>
        {options.map(({title, value, icon, description, disabled, indicator, danger, className}, index) => {
            const large = title && description
            const Wrapper = large ? "div" : Fragment
            const props = large ? {className: "flex1"} : {}

            const enhancedClassName = clsx(
                classes.option,
                large && classes.large,
                disabled && classes.disabled,
                danger && classes.danger,
                className
            )

            return (
                <label className={enhancedClassName} key={index}>
                    {icon}
                    <Wrapper {...props}>
                        <Typography type={"title6"} value={title} color={danger ? "redColor" : "textColor1"}
                                    className={"flex1"}/>
                        {
                            description ? <Typography type={"text2"} color={danger ? "redColor" : "textColor1"}
                                                      value={description}/> : null
                        }
                    </Wrapper>

                    {indicator ? <Radio.Root value={value}>{indicator}</Radio.Root> :
                        <Radio.Root value={value} className={classes.radio}>
                            {indicator || <Radio.Indicator className={classes.indicator}/>}
                        </Radio.Root>}
                </label>
            )
        })}
    </RadioGroup>
}

export {Options, type IOption, type IOptionsProps}