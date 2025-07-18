import classes from "./ParticipateEventButton.module.css";
import {Button} from "../../Button/Button";
import {Typography} from "../../Typography/Typography";
import clsx from "clsx";
import {AdditionalFields, VALIDATION_EXTENSION} from "./AdditionalFields";
import {BottomSheet} from "../../BottomSheet/BottomSheet";
import {participateRequestApi} from "../../Store/ParticipateRequest/ParticipateRequestApi";
import {FormProvider, useForm} from "react-hook-form";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {FC} from "react";
import {ReceiptInput} from "./ReceiptInput";
import {eventApi} from "../../Store/Event/EventApi";
import {ReceiptInfo} from "./ReceiptInfo";
import {PaymentTypeSelect} from "./PaymentTypeSelect";
import {userApi} from "../../Store/User/UserApi";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";
import {useSelector} from "react-redux";
import {Skeleton} from "../../Skeleton/Skeleton";
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod";
import {
    ClientSchemaParticipateRequestAdditionalUserSchema
} from "@way-to-bot/shared/api/zod/common/base/participate-request.schema";
import {
    ClientSchemaParticipateRequestCreate,
    TClientParticipateRequestCreatePayload
} from "@way-to-bot/shared/api/zod/client/participate-request.schema";

interface IWithEventId {
    eventId: string;
}

const shema = ClientSchemaParticipateRequestCreate.extend({
    additionalUsers: z.array(ClientSchemaParticipateRequestAdditionalUserSchema.extend(VALIDATION_EXTENSION))
})

const Form: FC<IWithEventId & { closeModal: VoidFunction }> = ({eventId, closeModal}) => {
    const [createParticipateRequest, {isLoading}] = participateRequestApi.useCreateParticipateRequestMutation();
    const authId = useSelector(authSlice.selectors.id)

    const {data: user, isFetching: userIsFetching} = userApi.useGetUserByIdQuery(String(authId))

    const {data: event, isFetching: eventIsFetching} = eventApi.useGetEventByIdQuery(eventId);

    const form = useForm({
        resolver: zodResolver(shema),
        defaultValues: {
            eventId: Number(eventId),
            additionalUsers: [
                {
                    firstName: user?.firstName,
                    lastName: user?.lastName
                }
            ]

        }
    })


    if (eventIsFetching || userIsFetching) {
        return <Skeleton style={{width: "100%", height: "100dvh", borderRadius: 16}}/>
    }

    const send = (values: TClientParticipateRequestCreatePayload) => {
        createParticipateRequest(values)
            .unwrap()
            .then(closeModal);
    };

    return <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(send)} className={classes.form}>
            <Typography type={"text2"}>
                {"Организатор просить предоставить дополнительную информацию для регистрации"}
            </Typography>

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
                type={"submit"}
                value={"Отправить заявку"}
                loading={isLoading}
            />
        </form>
    </FormProvider>
}

const CreateRequestForm: FC<IWithEventId> = ({eventId}) => {
    const [open, {toggle, setFalse}] = useBoolean(false)

    return <BottomSheet
        title={"Отправить заявку"}
        onOpenChange={toggle}
        open={open}
        trigger={<Button className={classes.button} value={"Участвовать"}/>}
        className={classes.popup}
    >
        <Form eventId={eventId} closeModal={setFalse}/>
    </BottomSheet>
}

export {CreateRequestForm}