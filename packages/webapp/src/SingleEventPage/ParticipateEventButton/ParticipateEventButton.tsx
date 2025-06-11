import {Button} from "../../Button/Button";
import classes from "./ParticipateEventButton.module.css";
import {FC, memo, useRef, useState} from "react";
import {eventApi} from "../../Store/Event/EventApi";
import {EEventStatus} from "@way-to-bot/shared/api/enums";
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
    ChevronDownIcon,
    CircleDollarSignIcon,
    CreditCardIcon,
    EditIcon,
    Hourglass,
    PaperclipIcon,
    UploadIcon
} from "lucide-react";
import {IOption, Options} from "../../Options/Options";
import {splitAmountAndCurrency} from "./SplitAmountAndCurrency";
import {useUploadFile} from "../../Hooks/UseUploadFile";
import {participateRequestApi} from "../../Store/ParticipateRequest/ParticipateRequestApi";
import {getNotNil} from "@way-to-bot/shared/utils/getNotNil";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";

interface IWithEventId {
    eventId: string
}

const User: FC<IWithId> = ({id}) => {
    const {data, isLoading} = userApi.useGetUserByIdQuery(id.toString())

    if (isLoading) {
        return <Skeleton style={{height: 124, width: "100%", borderRadius: 16}}/>
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

type TPaymentMethod = "card" | "cash" | "receipt"

const PAYMENT_METHODS: IOption<TPaymentMethod>[] = [
    {
        value: "card",
        title: "Карта",
        description: "Оплата онлайн через приложение",
        icon: <CreditCardIcon color={"#007AFF"}/>,
        disabled: true

    },
    {
        value: "cash",
        title: "Наличными на месте",
        description: "Оплата при встрече на месте",
        icon: <BanknoteIcon color={"#007AFF"}/>,
        disabled: true
    },
    {
        value: "receipt",
        title: "Прикрепить чек",
        description: "Пришлите фото чека после перевода",
        icon: <PaperclipIcon color={"#007AFF"}/>
    }
]

interface ISelectMethodProps {
    value: null | TPaymentMethod;
    onChange: (method: TPaymentMethod | null) => void
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

    const onValueChange = (value: null | TPaymentMethod) => {
        onChange(value)
        setOpen(false)
    }


    return <BottomSheet trigger={trigger} title={"Оплата"} open={open} onOpenChange={setOpen}>
        <Options options={PAYMENT_METHODS} value={value} onValueChange={onValueChange}/>
    </BottomSheet>
}

const Payment: FC<IWithEventId & { closeModal: VoidFunction }> = ({eventId, closeModal}) => {

    const [paymentMethod, setPaymentMethod] = useState<null | TPaymentMethod>(null)
    const {data: event} = eventApi.useGetEventByIdQuery(eventId)

    const amountAndCurrency = event?.price ? splitAmountAndCurrency(event.price) : ["0", ""]

    const amount = Number(amountAndCurrency[0])

    if (Number.isNaN(amount)) {
        throw new Error("Price num is NaN")
    }

    const total = amount + (amountAndCurrency[1] ?? "")


    const fileInputRef = useRef<HTMLInputElement>(null)

    const setPaymentMethodChange = (method: TPaymentMethod | null) => {
        if (method === "receipt") {
            fileInputRef.current?.click()
        }

        setPaymentMethod(method)
    }

    const {onChange, fileName, fileId, isLoading: fileUploadLoading, error} = useUploadFile()

    const disabled = !paymentMethod || (paymentMethod === "receipt" && !fileId)

    const text = fileName ?? (error ? "Ошибка при загрузке" : "Загрузить документ")


    const [createParticipateRequest, {isLoading}] = participateRequestApi.useCreateParticipateRequestMutation()

    const send = () => {
        if (disabled) {
            return
        }

        createParticipateRequest({
            eventId: Number(eventId),
            fileId: getNotNil(fileId, "ParticipateEventButton -> Payment -> createParticipateRequest -> fileId"),
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
                paymentMethod === "receipt" ?
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

const Participate: FC<{ authId: number } & IWithEventId> = ({authId, eventId}) => {
    const [open, setOpen] = useState(false)
    const {data, isLoading} = participateRequestApi.useGetAllParticipateRequestsQuery()


    if (isLoading) {
        return null
    }

    const lastRequest = data?.find((request) => String(request.eventId) === eventId)

    const closeModal = () => setOpen(false)


    const titleNode = (
        <div className={classes.statusBlock}>
            <div className={classes.status}>
                <Hourglass color={"#fff"} width={20} height={20}/>
            </div>

            <div className={classes.participantText}>
                <Typography type={"title4"} value={"Заявка на рассмотрении"} color={"textColor2"}/>
                <Typography type={"text2"} value={"Сегодня, 8 марта, 12:23"} color={"textColor3"}/>
            </div>
        </div>
    )

    return <BottomSheet className={classes.popup} title={lastRequest ? undefined : "Отправить заявку"}
                        onOpenChange={setOpen} open={open}
                        titleNode={lastRequest ? titleNode : null}
                        trigger={<Button className={classes.button}
                                         value={lastRequest ? "Моя заявка" : "Участвовать"}/>}>

        <User id={authId}/>

        {
            lastRequest ?
                <div className={clsx(classes.block, classes.paymentMethod)}>
                    <Typography type={"title4"} value={"Способ оплаты"}/>
                    <a href={getPreviewSrc(lastRequest.receipt?.url)} target={"_blank"} rel={"noreferrer noopener"}
                       className={clsx(classes.paymentMethodSelect, classes.selected)}>
                        <PaperclipIcon color={"#007AFF"}/>

                        <Typography type={"title5"} color={"mainColor"} className={"flex1"} value={"Посмотреть чек"}/>

                        <ImgWithContainer className={classes.receiptContainer}
                                          previewUrl={lastRequest.receipt?.previewUrl}/>
                    </a>
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

    if (!authId) {
        return <Button as={"link"} className={classes.button} value={"Создать профиль"} to={"/profile"}/>
    }

    return <Participate eventId={eventId} authId={authId}/>
})

export {ParticipateEventButton}