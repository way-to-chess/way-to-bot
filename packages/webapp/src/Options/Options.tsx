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
}

interface IOptionsProps<Value> {
    options: IOption<Value>[]
    value?: IOption<Value>["value"]
    onValueChange?: ((value: IOption<Value>["value"], event: Event) => void)
}

const Options = <Value, >({options, value, onValueChange}: IOptionsProps<Value>) => {
    const _onValueChange = (value: unknown, event: Event) => onValueChange?.(value as Value, event)

    return <RadioGroup className={classes.options} value={value} onValueChange={_onValueChange}>
        {options.map(({title, value, icon, description, disabled}) => {
            const large = title && description
            const Wrapper = large ? "div" : Fragment

            return (
                <label className={clsx(classes.option, large && classes.large, disabled && classes.disabled)}>
                    {icon}
                    <Wrapper className={"flex1"}>
                        <Typography type={"title6"} value={title} className={"flex1"}/>
                        {
                            description ? <Typography type={"text2"} value={description}/> : null
                        }
                    </Wrapper>
                    <Radio.Root value={value} className={classes.radio}>
                        <Radio.Indicator className={classes.indicator}/>
                    </Radio.Root>
                </label>
            )
        })}
    </RadioGroup>
}

export {Options, type IOption}