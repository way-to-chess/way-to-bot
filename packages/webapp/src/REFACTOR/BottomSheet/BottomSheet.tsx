import {Dialog} from "@base-ui-components/react";
import {Typography} from "../Typography/Typography";
import classes from "./BottomSheet.module.css";
import {CloseIcon} from "../Icons/CloseIcon";
import {FC, PropsWithChildren} from "react";

type TBottomSheetTrigger = Dialog.Trigger.Props["render"]

interface IBottomSheetProps extends PropsWithChildren {
    title?: string
    trigger: TBottomSheetTrigger
}

const BottomSheet: FC<IBottomSheetProps> = ({trigger, title, children}) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger render={trigger}/>
            <Dialog.Portal>
                <Dialog.Backdrop className={classes.backdrop}/>
                <Dialog.Popup className={classes.popup}>
                    <div className={classes.top}>
                        <Dialog.Title
                            render={<Typography type={"title3"} value={title}/>}
                        />
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
