import classes from "./ParticipateEventButton.module.css";
import {useWatch} from "react-hook-form";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {Typography} from "../../Typography/Typography";

const ReceiptInfo = () => {
    const paymentType = useWatch({name: "paymentType"})

    if (paymentType !== EParticipateRequestPaymentType.RECEIPT) {
        return null
    }

    return <div className={classes.block}>
        <div className={classes.total}>
            <Typography type={"text1"} value={"+375292399949 (Альфа)"}/>
            <Typography
                type={"text2"}
                color={"textColor2"}
                value={
                    'Или в приложении банка выбрать "система расчета ЕРИП"->"Банковские,финансовые услуги"->"Банки,НКФО"->"АльфаБанк"->"пополнение счета"-> BY56ALFA3014301V1F0020270000'
                }
            />
        </div>
    </div>
}

export {ReceiptInfo}