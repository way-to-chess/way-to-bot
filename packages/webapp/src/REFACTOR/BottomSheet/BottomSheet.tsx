import { Dialog } from "@base-ui-components/react";
import { Typography } from "../Typography/Typography";
import classes from "./BottomSheet.module.css";
import { CloseIcon } from "../Icons/CloseIcon";

const BottomSheet = ({ trigger, title, children }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{"Trigger"}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={classes.backdrop} />
        <Dialog.Popup className={classes.popup}>
          <div className={classes.top}>
            <Dialog.Title
              render={<Typography type={"title3"} value={title} />}
            />
            <Dialog.Close className={classes.close}>{CloseIcon}</Dialog.Close>
          </div>
          <div className={classes.content}>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { BottomSheet };
