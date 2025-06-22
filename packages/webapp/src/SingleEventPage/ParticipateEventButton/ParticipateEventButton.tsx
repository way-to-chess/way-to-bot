import {Button} from "../../Button/Button";
import classes from "./ParticipateEventButton.module.css";
import {FC, memo, ReactNode, useRef, useState} from "react";
import {eventApi} from "../../Store/Event/EventApi";
import {
    EEventStatus,
    EParticipateRequestPaymentType,
    EParticipateRequestStatus
} from "@way-to-bot/shared/api/enums/index";
import {BottomSheet} from "../../BottomSheet/BottomSheet";
import {useSelector} from "react-redux";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";
import {userApi} from "../../Store/User/UserApi";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {ImgWithContainer} from "../../ImgWithContainer/ImgWithContainer";
import {Typography} from "../../Typography/Typography";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {Skeleton} from "../../Skeleton/Skeleton";
import clsx from "clsx";
import {
    BanknoteIcon,
    CheckIcon,
    ChevronDownIcon,
    CircleDollarSignIcon,
    CreditCardIcon,
    EditIcon,
    Hourglass,
    PaperclipIcon,
    UploadIcon,
    XIcon
} from "lucide-react";
import {IOption, Options} from "../../Options/Options";
import {splitAmountAndCurrency} from "./SplitAmountAndCurrency";
import {useUploadFile} from "../../Hooks/UseUploadFile";
import {participateRequestApi} from "../../Store/ParticipateRequest/ParticipateRequestApi";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import dayjs from "dayjs";

interface IWithEventId {
    eventId: string
}

const User: FC<IWithId> = ({id}) => {
    const {data, isLoading} = userApi.useGetUserByIdQuery(id.toString())

    if (isLoading) {
        return <Skeleton style={{height: 78, width: "100%", borderRadius: 16}}/>
    }

    if (!data) {
        return null
    }


    return <div className={clsx(classes.block, classes.participant)}>
        <ImgWithContainer className={classes.participantImg} previewUrl={data.photo?.previewUrl}/>
        <div className={classes.participantText}>
            <Typography type={"title6"} value={getUserFullName(data.firstName, data.lastName)}/>
            <Typography type={"text2"} value={data.username} color={"textColor2"}/>
        </div>
    </div>
}

const PAYMENT_METHODS: IOption<EParticipateRequestPaymentType>[] = [
    {
        value: EParticipateRequestPaymentType.ONLINE,
        title: "Карта",
        description: "Оплата онлайн через приложение",
        icon: <CreditCardIcon color={"#007AFF"}/>,
        disabled: true
    },
    {
        value: EParticipateRequestPaymentType.CASH,
        title: "Наличными на месте",
        description: "Оплата при встрече на месте",
        icon: <BanknoteIcon color={"#007AFF"}/>,
    },
    {
        value: EParticipateRequestPaymentType.RECEIPT,
        title: "Прикрепить чек",
        description: "Пришлите фото чека после перевода",
        icon: <PaperclipIcon color={"#007AFF"}/>
    }
]

interface ISelectMethodProps {
    value: null | EParticipateRequestPaymentType;
    onChange: (method: EParticipateRequestPaymentType | null) => void
}

const SelectMethod: FC<ISelectMethodProps> = ({value, onChange}) => {
    const [open, setOpen] = useState(false)

    const methodObject = PAYMENT_METHODS.find((it) => it.value === value)

    const trigger = (
        <button className={classes.paymentMethodSelect}>
            {
                methodObject ? methodObject.icon : <CircleDollarSignIcon color={"#007AFF"}/>
            }
            {
                methodObject ?
                    <Typography type={"title5"} color={"mainColor"} className={"flex1"} value={methodObject.title}/>
                    : <Typography type={"text2"} color={"textColor2"} className={"flex1"}
                                  value={"Выберите способ оплаты"}/>
            }

            <ChevronDownIcon color={"#007AFF"}/>
        </button>
    )

    const onValueChange = (value: null | EParticipateRequestPaymentType) => {
        onChange(value)
        setOpen(false)
    }


    return <BottomSheet trigger={trigger} title={"Оплата"} open={open} onOpenChange={setOpen}>
        <Options options={PAYMENT_METHODS} value={value} onValueChange={onValueChange}/>
    </BottomSheet>
}

const Payment: FC<IWithEventId & { closeModal: VoidFunction }> = ({eventId, closeModal}) => {

    const [paymentMethod, setPaymentMethod] = useState<null | EParticipateRequestPaymentType>(null)
    const {data: event} = eventApi.useGetEventByIdQuery(eventId)

    const amountAndCurrency = event?.price ? splitAmountAndCurrency(event.price) : ["0", ""]

    const amount = Number(amountAndCurrency[0])

    if (Number.isNaN(amount)) {
        throw new Error("Price num is NaN")
    }

    const total = amount + (amountAndCurrency[1] ?? "")


    const fileInputRef = useRef<HTMLInputElement>(null)

    const setPaymentMethodChange = (method: EParticipateRequestPaymentType | null) => {
        if (method === EParticipateRequestPaymentType.RECEIPT) {
            fileInputRef.current?.click()
        }

        setPaymentMethod(method)
    }

    const {onChange, fileName, fileId, isLoading: fileUploadLoading, error} = useUploadFile()

    const disabled = !paymentMethod || (paymentMethod === EParticipateRequestPaymentType.RECEIPT && !fileId)

    const text = fileName ?? (error ? "Ошибка при загрузке" : "Загрузить документ")

    const [createParticipateRequest, {isLoading}] = participateRequestApi.useCreateParticipateRequestMutation()

    const send = () => {
        if (disabled) {
            return
        }

        createParticipateRequest({
            eventId: Number(eventId),
            fileId,
            paymentType: paymentMethod,
            additionalUsers: []
        }).unwrap().then(closeModal)
    }

    return <>
        <div className={clsx(classes.block, classes.paymentMethod)}>
            <Typography type={"title4"} value={"Способ оплаты"}/>
            <SelectMethod value={paymentMethod} onChange={setPaymentMethodChange}/>
        </div>

        <div className={clsx(classes.block, classes.total)}>
            {/*<Typography type={"title4"} value={"К оплате"}/>*/}
            {/*<div className={classes.totalItems}>*/}
            {/*    <div className={classes.totalItem}>*/}
            {/*        <Typography type={"text2"} color={"textColor2"} value={"Участник №1"}/>*/}
            {/*        <Typography type={"title6"} value={amountAndCurrency.join("")}/>*/}
            {/*    </div>*/}
            {/*</div>*/}


            <div className={classes.totalItem}>
                <Typography type={"title4"} value={"К оплате"}/>
                <Typography type={"title4"} value={total}/>
            </div>

            {
                paymentMethod === EParticipateRequestPaymentType.RECEIPT ?
                    <Button variant={"secondary"} as={"label"} loading={fileUploadLoading} className={classes.upload}>
                        <input type={"file"} onChange={onChange}/>
                        {fileId ? null : <UploadIcon/>}
                        {text}
                        {fileId ? <EditIcon width={14} height={14}/> : null}
                    </Button>
                    : null
            }

        </div>

        <Button disabled={disabled} onClick={send} value={"Отправить заявку"} loading={isLoading}/>
    </>
}

const ICON_BY_STATUS: Record<EParticipateRequestStatus, ReactNode> = {
    [EParticipateRequestStatus.WAITING]: <Hourglass color={"#fff"} width={20} height={20}/>,
    [EParticipateRequestStatus.APPROVED]: <CheckIcon color={"#fff"} width={20} height={20}/>,
    [EParticipateRequestStatus.REJECTED]: <XIcon color={"#fff"} width={20} height={20}/>
}
const TEXT_BY_STATUS: Record<EParticipateRequestStatus, ReactNode> = {
    [EParticipateRequestStatus.WAITING]: <Typography type={"title4"} value={"Заявка на рассмотрении"}
                                                     color={"textColor2"}/>,
    [EParticipateRequestStatus.APPROVED]: <Typography type={"title4"} value={"Заявка подтверждена"}
                                                      color={"greenColor"}/>,
    [EParticipateRequestStatus.REJECTED]: <Typography type={"title4"} value={"Заявка отклонена"} color={"redColor"}/>
}

const Participate: FC<{ authId: number } & IWithEventId> = ({authId, eventId}) => {
    const [open, setOpen] = useState(false)
    const {data, isLoading} = participateRequestApi.useGetAllParticipateRequestsQuery()


    if (isLoading) {
        return null
    }

    const lastRequest = data?.find((request) => String(request.eventId) === eventId)

    const closeModal = () => setOpen(false)

    const titleNode = lastRequest ? (
        <div className={classes.statusBlock}>
            <div className={clsx(classes.status, classes[lastRequest.status])}>
                {ICON_BY_STATUS[lastRequest.status]}
            </div>

            <div className={classes.participantText}>
                {TEXT_BY_STATUS[lastRequest.status]}
                <Typography type={"text2"} value={dayjs(lastRequest.createdAt).format("D MMMM, dd HH:mm")}
                            color={"textColor3"}/>
            </div>

        </div>
    ) : null

    return <BottomSheet className={classes.popup} title={lastRequest ? undefined : "Отправить заявку"}
                        onOpenChange={setOpen} open={open}
                        titleNode={titleNode}
                        trigger={<Button className={classes.button}
                                         value={lastRequest ? "Моя заявка" : "Участвовать"}/>}>
        {
            lastRequest?.message ? <Typography type={"text2"} value={lastRequest.message}/> : null
        }

        <User id={authId}/>


        {
            lastRequest ?
                <div className={clsx(classes.block, classes.paymentMethod)}>
                    <Typography type={"title4"} value={"Способ оплаты"}/>
                    {lastRequest.paymentType === EParticipateRequestPaymentType.RECEIPT ?
                        <a href={getPreviewSrc(lastRequest.receipt?.url)} target={"_blank"} rel={"noreferrer noopener"}
                           className={clsx(classes.paymentMethodSelect, classes.selected)}>
                            <PaperclipIcon color={"#007AFF"}/>

                            <Typography type={"title5"} color={"mainColor"} className={"flex1"}
                                        value={"Посмотреть чек"}/>

                            <ImgWithContainer className={classes.receiptContainer}
                                              previewUrl={lastRequest.receipt?.previewUrl}/>
                        </a> : null
                    }
                    {
                        lastRequest.paymentType === EParticipateRequestPaymentType.CASH ?
                            <div className={clsx(classes.paymentMethodSelect, classes.selected)}>
                                <BanknoteIcon color={"#007AFF"}/>
                                <Typography type={"title5"} color={"mainColor"} className={"flex1"}
                                            value={"Наличними на месте"}/>
                            </div> : null
                    }
                </div> :
                <Payment eventId={eventId} closeModal={closeModal}/>
        }
    </BottomSheet>

}

const ParticipateEventButton = memo<IWithEventId>(({eventId}) => {
    const {data: event} = eventApi.useGetEventByIdQuery(eventId)
    const authId = useSelector(authSlice.selectors.id)

    if (event?.status !== EEventStatus.WAITING) {
        return null
    }

    if (event.host.id === authId) {
        return null
    }

    if (event.users.length >= Number(event.participantsLimit)) {
        return null
    }

    if (!authId) {
        return <Button as={"link"} className={classes.button} value={"Создать профиль"} to={"/profile"}/>
    }

    return <Participate eventId={eventId} authId={authId}/>
})

export {ParticipateEventButton}