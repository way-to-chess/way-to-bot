import {BottomSheet, IBottomSheetProps} from "../BottomSheet/BottomSheet";
import {IOptionsProps, Options} from "../Options/Options";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {IInputProps, Input} from "../Input/Input";
import clsx from "clsx";
import classes from "./Select.module.css";
import {ChevronDownIcon} from "lucide-react";
import {ReactNode, Ref, useRef} from "react";
import {mergeRefs} from "react-merge-refs";


type TInputProps = Pick<IInputProps, "placeholder" | "before" | "onFocus" | "invalid">

interface ISelectProps<V> extends Omit<IOptionsProps<V>, "onValueChange">, TInputProps {
    bottomSheetProps?: Omit<IBottomSheetProps, "open" | "onOpenChange" | "trigger" | "children">
    onChange?: (...event: any[]) => void
    onBlur?: VoidFunction
    disabled?: boolean
    ref?: Ref<HTMLSelectElement>;
    name?: string
    icon?: ReactNode
}

const Select = <Value extends string, >(
    {
        options,
        value,
        onChange,
        onBlur,
        placeholder,
        before,
        bottomSheetProps,
        ref,
        onFocus,
        disabled,
        invalid,
        name,
        icon
    }: ISelectProps<Value>) => {
    const [open, {toggle, setFalse}] = useBoolean()

    const selected = options.find((it) => it.value === value)

    const select = useRef<HTMLSelectElement>(null)

    const mergedRef = mergeRefs([select, ref])


    const _onValueChange = (value: string, event: Event) => {
        if (select.current) {
            select.current.value = value
            select.current.dispatchEvent(new Event("change", {bubbles: true}))

            setFalse()
            select.current.dispatchEvent(new Event("blur", {bubbles: true}))
        }
    }

    const trigger = (
        <Input
            disabled={disabled}
            onFocus={onFocus}
            before={selected ? selected.icon : before}
            type={"button"}
            className={clsx(!selected && classes.placeholder)}
            value={selected ? selected.title : placeholder}
            placeholder={placeholder}
            after={icon ? icon : <ChevronDownIcon/>}
            invalid={invalid}
        />
    )

    return <>
        <select style={{display: "none"}} ref={mergedRef} onChange={onChange} onBlur={onBlur} disabled={disabled}
                name={name}>
            {options.map(({value, title}, index) => <option key={index} value={value}>{title}</option>)}
        </select>

        <BottomSheet open={open} onOpenChange={toggle} trigger={trigger} {...bottomSheetProps}>
            <Options options={options} value={value} onValueChange={_onValueChange}/>
        </BottomSheet>
    </>
}

export {Select}
export type {ISelectProps}