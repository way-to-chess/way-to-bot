import {BanknoteIcon, CircleDollarSignIcon, CreditCardIcon, PaperclipIcon} from "lucide-react";
import {IOption} from "../../Options/Options";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {SelectField} from "../../Field/Field";

const PAYMENT_TYPES: IOption<EParticipateRequestPaymentType>[] = [
    {
        value: EParticipateRequestPaymentType.ONLINE,
        title: "Карта",
        description: "Оплата онлайн через приложение",
        icon: <CreditCardIcon color={"#007AFF"}/>,
        disabled: true,
    },
    {
        value: EParticipateRequestPaymentType.CASH,
        title: "Наличными на месте",
        description: "Оплата при встрече на месте",
        icon: <BanknoteIcon color={"#007AFF"}/>,
    },
    {
        value: EParticipateRequestPaymentType.RECEIPT,
        title: "Банковский перевод",
        description: "Пришлите фото чека после перевода",
        icon: <PaperclipIcon color={"#007AFF"}/>,
    },
];

const PaymentTypeSelect = () => {


    return <SelectField
        label={"Способ оплаты"}
        inputProps={{
            options: PAYMENT_TYPES,
            before: <CircleDollarSignIcon color={"var(--main-color)"}/>,
            bottomSheetProps: {title: "Оплата"},
            placeholder: "Выберите способ оплаты"
        }}
        controllerProps={{name: "paymentType"}}
    />
}

export {PaymentTypeSelect}