import {Dialog,} from "@base-ui-components/react";
import {Typography} from "../Typography/Typography";
import classes from "./BottomSheet.module.css";
import {CloseIcon} from "../Icons/CloseIcon";
import {FC, Fragment, PropsWithChildren} from "react";
import clsx from "clsx";

type TBottomSheetTrigger = Dialog.Trigger.Props["render"]

interface IBottomSheetProps extends PropsWithChildren {
    title?: string
    description?: string
    trigger: TBottomSheetTrigger
    className?: string
    open?: boolean;
    onOpenChange?: Dialog.Root.Props["onOpenChange"]
}

const BottomSheet: FC<IBottomSheetProps> = ({trigger, title, description, children, className, open, onOpenChange}) => {
    const Wrapper = title && description ? "div" : Fragment

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger render={trigger}/>
            <Dialog.Portal>
                <Dialog.Backdrop className={classes.backdrop}/>
                <Dialog.Popup className={clsx(classes.popup, className)}>
                    <div className={classes.top}>
                        <Wrapper>
                            {
                                title ?
                                    <Dialog.Title render={<Typography type={"title3"} value={title}/>}/>
                                    : null
                            }
                            {
                                description ?
                                    <Dialog.Description render={<Typography type={"text2"} value={description}/>}/>
                                    : null
                            }
                        </Wrapper>
                        <Dialog.Close className={classes.close}>{CloseIcon}</Dialog.Close>
                    </div>
                    {children}
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export {BottomSheet};
export type {TBottomSheetTrigger}
