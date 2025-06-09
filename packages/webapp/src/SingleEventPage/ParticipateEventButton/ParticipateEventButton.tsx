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
    PaperclipIcon,
    UploadIcon
} from "lucide-react";
import {IOption, Options} from "../../Options/Options";
import {splitAmountAndCurrency} from "./SplitAmountAndCurrency";
import {useUploadFile} from "../../Hooks/UseUploadFile";

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
        icon: <BanknoteIcon color={"#007AFF"}/>
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

const Payment: FC<IWithEventId> = ({eventId}) => {
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

    const {onChange, fileName, isLoading} = useUploadFile()
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

            <Button variant={"secondary"} as={"label"} loading={isLoading} className={classes.upload}>
                <input type={"file"} onChange={onChange}/>
                <UploadIcon/>
                {fileName ?? "Загрузить документ"}
            </Button>

        </div>

        <Button className={clsx(classes.button, classes.open)} value={"Отправить запрос"}/>
    </>
}


const AddParticipant = () => {
    const trigger = (<button>
        <Typography type={"buttonTitle"} color={"mainColor"} value={"+ Добавить участника"}/>
    </button>)


    return <BottomSheet trigger={trigger} title={"Добавить участника"}>
        {"hello"}
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

    return <BottomSheet className={classes.popup}
                        trigger={<Button className={classes.button} value={"Участвовать"}/>}
                        title={"Отправить заявку"}
                        description={"Проверь данные"}>
        <User id={authId}/>
        {/*<AddParticipant/>*/}
        <Payment eventId={eventId}/>
    </BottomSheet>

})

export {ParticipateEventButton}