import {BottomSheet, IBottomSheetProps} from "../BottomSheet/BottomSheet";
import {IOptionsProps, Options} from "../Options/Options";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {Input} from "../Input/Input";
import clsx from "clsx";
import classes from "./Select.module.css";
import {ChevronDownIcon} from "lucide-react";
import {ReactNode} from "react";

interface ISelectProps<V> extends IOptionsProps<V>, Omit<IBottomSheetProps, "open" | "onOpenChange" | "trigger" | "title"> {
    placeholder?: string
    before?: ReactNode
    bottomSheetTitle?: string
    title?: string
}

const Select = <Value, >(
    {
        options,
        value,
        onValueChange,
        placeholder,
        before,
        bottomSheetTitle,
        ...bottomSheetProps
    }: ISelectProps<Value>) => {
    const [open, {toggle, setFalse}] = useBoolean()

    const selected = options.find((it) => it.value === value)

    const _onValueChange = (value: unknown, event: Event) => {
        onValueChange?.(value as Value, event)
        setFalse()
    }

    const trigger = (
        <Input
            before={selected ? selected.icon : before}
            type={"button"}
            className={clsx(!selected && classes.placeholder)}
            value={selected ? selected.title : placeholder}
            placeholder={placeholder}
            after={<ChevronDownIcon color={"var(--main-color)"}/>}
        />
    )


    return <>
        <BottomSheet open={open} onOpenChange={toggle} trigger={trigger} title={bottomSheetTitle} {...bottomSheetProps}>
            <Options options={options} value={value} onValueChange={_onValueChange}/>
        </BottomSheet>
    </>
}

export {Select}