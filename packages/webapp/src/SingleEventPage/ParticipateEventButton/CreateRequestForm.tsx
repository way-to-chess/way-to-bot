import classes from "./ParticipateEventButton.module.css";
import {Button} from "../../Button/Button";
import {Typography} from "../../Typography/Typography";
import clsx from "clsx";
import {AdditionalFields, VALIDATION_EXTENSION} from "./AdditionalFields";
import {BottomSheet} from "../../BottomSheet/BottomSheet";
import {participateRequestApi} from "../../Store/ParticipateRequest/ParticipateRequestApi";
import {FormProvider, useForm} from "react-hook-form";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {FC, useEffect} from "react";
import {ReceiptInput} from "./ReceiptInput";
import {eventApi} from "../../Store/Event/EventApi";
import {ReceiptInfo} from "./ReceiptInfo";
import {PaymentTypeSelect} from "./PaymentTypeSelect";
import {Skeleton} from "../../Skeleton/Skeleton";
import {z} from "zod";
import {
    ClientSchemaParticipateRequestAdditionalUserSchema
} from "@way-to-bot/shared/api/zod/common/base/participate-request.schema";
import {
    ClientSchemaParticipateRequestCreate,
    TClientParticipateRequestCreatePayload
} from "@way-to-bot/shared/api/zod/client/participate-request.schema";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {EventLeaguesSelect} from "./EventLeaguesSelect";
import {useDispatch, useSelector} from "react-redux";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";
import {userApi} from "../../Store/User/UserApi";
import {ClientDTOUserGetOne} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {zodResolver} from "@hookform/resolvers/zod";

interface IWithEventId {
    eventId: string;
}

interface ICreateFormProps extends IWithEventId {
    closeModal: VoidFunction;
    user?: ClientDTOUserGetOne
}

const CreateForm: FC<ICreateFormProps> = (
    {
        eventId,
        closeModal,
        user
    }) => {
    const [createParticipateRequest, {isLoading}] = participateRequestApi.useCreateParticipateRequestMutation();

    const {data: event} = eventApi.useGetEventByIdQuery(eventId);

    const [authByTelegram] = authApi.useLazyAuthByTelegramQuery()

    const tgId = Telegram.WebApp.initDataUnsafe.user?.id ? String(Telegram.WebApp.initDataUnsafe.user?.id) : undefined

    const hasEventLeagues = event?.eventLeagues && event.eventLeagues.filter((it) => it.name !== "DEFAULT").length > 0

    const form = useForm({
        resolver: zodResolver(ClientSchemaParticipateRequestCreate.extend({
            additionalUsers: z.array(ClientSchemaParticipateRequestAdditionalUserSchema.extend({
                ...VALIDATION_EXTENSION,
                elIds: z.array(z.number()).min(hasEventLeagues ? 1 : 0),
            })),
        })),
        defaultValues: {
            paymentType: EParticipateRequestPaymentType.CASH,
            eventId: Number(eventId),
            tgId,
            additionalUsers: [
                {
                    firstName: user?.firstName ?? undefined,
                    lastName: user?.lastName ?? undefined,
                    birthDate: user?.birthDate ?? "1999-07-13",
                    tgId,
                    elIds: []
                }
            ]

        }
    })

    const dispatch = useDispatch()

    const send = (values: TClientParticipateRequestCreatePayload) => {
        createParticipateRequest(values)
            .unwrap()
            .then(() => {
                closeModal()
                if (user) {
                    dispatch(participateRequestApi.util.invalidateTags([{type: "PARTICIPATE_REQUEST"}]))
                } else {
                    authByTelegram({
                        tgId: Telegram.WebApp.initDataUnsafe.user?.id,
                        username: Telegram.WebApp.initDataUnsafe.user?.username,
                    }).then(() => {
                        dispatch(participateRequestApi.util.invalidateTags([{type: "PARTICIPATE_REQUEST"}]))
                    })
                }
            });
    };

    return <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(send)} className={classes.form}>
            {
                event?.eventLeagues && event.eventLeagues.filter((it) => it.name !== "DEFAULT").length > 0 ?
                    <div className={classes.block}>
                        <EventLeaguesSelect eventId={eventId}/>
                    </div> :
                    null
            }

            <div className={clsx(classes.block, classes.paymentMethod)}>
                <AdditionalFields/>
            </div>

            <div className={classes.block}>
                <PaymentTypeSelect/>
            </div>

            <ReceiptInfo/>

            <div className={clsx(classes.block, classes.total)}>

                <div className={classes.totalItem}>
                    <Typography type={"title4"} value={"К оплате"}/>
                    <Typography type={"title4"} value={event?.price}/>
                </div>

                <ReceiptInput/>
            </div>

            <Button
                className={classes.send}
                type={"submit"}
                value={"Отправить заявку"}
                loading={isLoading}
            />
        </form>
    </FormProvider>
}

const CreateRequestForm: FC<IWithEventId> = ({eventId}) => {
    const [open, {toggle, setFalse}] = useBoolean(false)

    const authId = useSelector(authSlice.selectors.id)

    const [trigger, {isFetching: userIsFetching, data: user}] = userApi.useLazyGetUserByIdQuery()

    useEffect(() => {
        if (authId) {
            trigger(String(authId))
        }
    }, [authId])

    const {isFetching: eventIsFetching} = eventApi.useGetEventByIdQuery(eventId);

    return <BottomSheet
        title={"Отправить заявку"}
        onOpenChange={toggle}
        open={open}
        trigger={<Button className={classes.button} value={"Участвовать"}/>}
        className={classes.popup}
    >
        {eventIsFetching || userIsFetching ? <Skeleton style={{width: "100%", height: "100dvh", borderRadius: 16}}/> :
            <CreateForm eventId={eventId} closeModal={setFalse} user={user}/>}
    </BottomSheet>
}

export {CreateRequestForm}