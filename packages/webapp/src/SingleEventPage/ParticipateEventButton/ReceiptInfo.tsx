import classes from "./ParticipateEventButton.module.css";
import {useWatch} from "react-hook-form";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {Typography} from "../../Typography/Typography";

const _ = (
    <>
        <Typography type={"text1"} value={"+375292399949 (Альфа)"}/>
        <Typography
            type={"text2"}
            color={"textColor2"}
            value={
                'Или в приложении банка выбрать "система расчета ЕРИП"->"Банковские,финансовые услуги"->"Банки,НКФО"->"АльфаБанк"->"пополнение счета"-> BY56ALFA3014301V1F0020270000'
            }
        />
    </>
)

const BLACK_PAW_INFO = (
    <>
        <Typography type={"title4"} value={"Как оплатить"}/>
        <Typography
            type={"text2"}
            value={
                'ЕРИП — Туризм и отдых — Активный отдых, развлечения — Книжный шкап — Организация мероприятий — Название мероприятия: "Кубок черной пешки" - ФИО шахматиста'
            }
        />
        <Typography
            type={"text2"}
            color={"textColor2"}
            value={
                'Пожалуйста, указывайте фамилию игрока, за которого производится оплата, и пишите в назначении платежа: «Кубок Черной пешки» * Членам БФШ скидка 5 рублей'
            }
        />
        <Typography
            type={"text2"}
            color={"textColor2"}
            value={
                '* Членам БФШ скидка 5 рублей'
            }
        />
    </>
)

const ReceiptInfo = () => {
    const paymentType = useWatch({name: "paymentType"})

    if (paymentType !== EParticipateRequestPaymentType.RECEIPT) {
        return null
    }

    return <div className={classes.block}>
        <div className={classes.total}>
            {BLACK_PAW_INFO}
        </div>
    </div>
}

export {ReceiptInfo}