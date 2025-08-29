import classes from "./ParticipateEventButton.module.css";
import {useWatch} from "react-hook-form";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {Typography} from "../../Typography/Typography";
import {Button} from "../../Button/Button";

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
                'Пожалуйста, указывайте фамилию игрока, за которого производится оплата, и пишите в назначении платежа: «Кубок Черной пешки»'
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

const INFO_2 = (
    <>
        <Typography type={"title4"} value={"Как оплатить"}/>
        <Typography
            type={"text2"}
            value={
                'ЕРИП — Банковские, финансовые услуги — Банки, НКФО — БСБ Банк — Пополнение счета — BY52UNBS30150032900080000933'
            }
        />
        <Typography
            type={"text2"}
            value={
                'После оплаты, сохраните чек и отправьте его с помощью кнопки "Загрузить документ".'
            }
        />
        <Typography
            type={"text2"}
            color={"textColor2"}
            value={
                '"ООО Белорусская федерация шахмат" УНП 100376428'
            }
        />

    </>
)

const INFO_EZHA = (
    <div className={classes.block}>
        <div className={classes.total}>
            <Typography type={"title4"} value={"Участие в турнире бесплатное, но проход на само мероприятие платный!"}/>

            <Typography
                type={"text2"}
            >
                {'Узнать стоймость и купить билет можно на официальном сайте '}
                <a style={{color: "var(--main-color)", textDecoration: "underline"}}
                   href={"https://vulitsaezha.by/ticket"}
                   target={"_blank"}
                   rel={"noopener noreferer"}>
                    {"https://vulitsaezha.by/ticket"}
                </a>
            </Typography>
        </div>

    </div>
)


const ReceiptInfo = () => {
    const paymentType = useWatch({name: "paymentType"})

    if (paymentType !== EParticipateRequestPaymentType.RECEIPT) {
        return INFO_EZHA
    }

    return <div className={classes.block}>
        <div className={classes.total}>
            {INFO_2}
        </div>
    </div>
}

export {ReceiptInfo}