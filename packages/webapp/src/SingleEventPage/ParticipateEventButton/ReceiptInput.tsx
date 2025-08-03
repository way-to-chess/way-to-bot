import {Button} from "../../Button/Button";
import classes from "./ParticipateEventButton.module.css";
import {EditIcon, UploadIcon} from "lucide-react";
import {useUploadFile} from "../../Hooks/UseUploadFile";
import {useFormContext} from "react-hook-form";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";

const ReceiptInput = () => {
    const form = useFormContext()

    const paymentType = form.watch("paymentType")

    const {
        onChange,
        fileName,
        fileId,
        isLoading: fileUploadLoading,
        error,
    } = useUploadFile(({id}) => {
        form.setValue("fileId", id)
    });

    if (paymentType !== EParticipateRequestPaymentType.RECEIPT) {
        return null
    }

    const text = fileName ?? (error ? "Ошибка при загрузке" : "Загрузить документ");

    return <>
        <Button
            variant={"secondary"}
            as={"label"}
            loading={fileUploadLoading}
            className={classes.upload}
        >
            <input type={"file"} onChange={onChange}/>
            {fileId ? null : <UploadIcon/>}
            {text}
            {fileId ? <EditIcon width={14} height={14}/> : null}
        </Button>
    </>
}

export {ReceiptInput}