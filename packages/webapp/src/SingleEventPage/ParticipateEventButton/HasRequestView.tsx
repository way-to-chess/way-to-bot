import {FC, ReactNode} from "react";
import classes from "./ParticipateEventButton.module.css";
import clsx from "clsx";
import {Typography} from "../../Typography/Typography";
import dayjs from "dayjs";
import {ClientDTOParticipateRequestGetMany} from "@way-to-bot/shared/api/DTO/client/participate-request.DTO";
import {EParticipateRequestStatus} from "@way-to-bot/shared/api/enums/EParticipateRequestStatus";
import {BanknoteIcon, CheckIcon, Hourglass, PaperclipIcon, XIcon} from "lucide-react";
import {Button} from "../../Button/Button";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {ImgWithContainer} from "../../ImgWithContainer/ImgWithContainer";
import {BottomSheet} from "../../BottomSheet/BottomSheet";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {CreateRequestForm} from "./CreateRequestForm";

const ICON_BY_STATUS: Record<EParticipateRequestStatus, ReactNode> = {
    [EParticipateRequestStatus.WAITING]: (
        <Hourglass color={"#fff"} width={20} height={20}/>
    ),
    [EParticipateRequestStatus.APPROVED]: (
        <CheckIcon color={"#fff"} width={20} height={20}/>
    ),
    [EParticipateRequestStatus.REJECTED]: (
        <XIcon color={"#fff"} width={20} height={20}/>
    ),
};

const TEXT_BY_STATUS: Record<EParticipateRequestStatus, ReactNode> = {
    [EParticipateRequestStatus.WAITING]: (
        <Typography
            type={"title4"}
            value={"Заявка на рассмотрении"}
            color={"textColor2"}
        />
    ),
    [EParticipateRequestStatus.APPROVED]: (
        <Typography
            type={"title4"}
            value={"Заявка подтверждена"}
            color={"greenColor"}
        />
    ),
    [EParticipateRequestStatus.REJECTED]: (
        <Typography type={"title4"} value={"Заявка отклонена"} color={"redColor"}/>
    ),
};

const Title: FC<Pick<ClientDTOParticipateRequestGetMany, "status" | "createdAt">> = ({status, createdAt}) => {
    return <div className={classes.statusBlock}>
        <div className={clsx(classes.status, classes[status])}>
            {ICON_BY_STATUS[status]}
        </div>

        <div className={classes.participantText}>
            {TEXT_BY_STATUS[status]}
            <Typography
                type={"text2"}
                value={dayjs(createdAt).format("D MMMM, dd HH:mm")}
                color={"textColor3"}
            />
        </div>
    </div>
}

const Receipt: FC<Pick<ClientDTOParticipateRequestGetMany, "receipt">> = ({receipt}) => {
    return <a
        href={getPreviewSrc(receipt?.url)}
        target={"_blank"}
        rel={"noreferrer noopener"}
        className={clsx(classes.paymentMethodSelect, classes.selected)}
    >
        <PaperclipIcon color={"var(--main-color)"}/>

        <Typography
            type={"title5"}
            color={"mainColor"}
            className={"flex1"}
            value={"Посмотреть чек"}
        />

        <ImgWithContainer
            className={classes.receiptContainer}
            previewUrl={receipt?.previewUrl}
        />
    </a>
}

const Cash = () => {
    return <div
        className={clsx(classes.paymentMethodSelect, classes.selected)}
    >
        <BanknoteIcon color={"var(--main-color)"}/>
        <Typography
            type={"title5"}
            color={"mainColor"}
            className={"flex1"}
            value={"Наличними на месте"}
        />
    </div>
}

const HasRequestView: FC<ClientDTOParticipateRequestGetMany> = (
    {
        message,
        status,
        createdAt,
        receipt,
        paymentType,
        eventId
    }) => {
    const [open, {toggle}] = useBoolean(false)


    return <BottomSheet
        className={classes.popup}
        onOpenChange={toggle}
        titleNode={<Title status={status} createdAt={createdAt}/>}
        open={open}
        trigger={
            <Button
                className={classes.button}
                value={"Моя заявка"}
            />
        }
    >
        {message ? <Typography type={"text2"} value={message}/> : null}

        <div className={clsx(classes.block, classes.paymentMethod)}>
            <Typography type={"title4"} value={"Способ оплаты"}/>
            {paymentType === EParticipateRequestPaymentType.RECEIPT ? <Receipt receipt={receipt}/> : null}
            {paymentType === EParticipateRequestPaymentType.CASH ? <Cash/> : null}
        </div>

        {
            status === EParticipateRequestStatus.REJECTED ?
                <CreateRequestForm eventId={String(eventId)} title={"Отправить повторно"}
                                   className={classes.send}/> : null
        }
    </BottomSheet>
}

export {HasRequestView}