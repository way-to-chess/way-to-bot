import {BanknoteIcon, CircleDollarSignIcon, CreditCardIcon, PaperclipIcon} from "lucide-react";
import {IOption} from "../../Options/Options";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {SelectField} from "../../Field/Field";
import {FC} from "react";


const getPaymentTypes = (availableType: EParticipateRequestPaymentType): IOption<EParticipateRequestPaymentType>[] =>
    [
        {
            value: EParticipateRequestPaymentType.CASH,
            title: "Наличными на месте",
            description: "Оплата при встрече на месте",
            icon: <BanknoteIcon color={"var(--main-color)"}/>,
            disabled: availableType !== EParticipateRequestPaymentType.CASH,
        },
        {
            value: EParticipateRequestPaymentType.RECEIPT,
            title: "Банковский перевод",
            description: "Пришлите фото чека после перевода",
            icon: <PaperclipIcon color={"var(--main-color)"}/>,
            disabled: availableType !== EParticipateRequestPaymentType.RECEIPT,
        },
        {
            value: EParticipateRequestPaymentType.ONLINE,
            title: "Карта",
            description: "Оплата онлайн через приложение",
            icon: <CreditCardIcon color={"var(--main-color)"}/>,
            disabled: true,
        },
    ]

const PaymentTypeSelect: FC<{ availableType: EParticipateRequestPaymentType }> = ({availableType}) => {

    return <SelectField
        label={"Способ оплаты"}
        inputProps={{
            options: getPaymentTypes(availableType),
            before: <CircleDollarSignIcon color={"var(--main-color)"}/>,
            bottomSheetProps: {title: "Оплата"},
            placeholder: "Выберите способ оплаты"
        }}
        controllerProps={{name: "paymentType"}}
    />
}

export {PaymentTypeSelect}