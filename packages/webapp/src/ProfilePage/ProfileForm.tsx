import classes from "./ProfilePage.module.css";
import {Button} from "../Button/Button";
import {FC, useState} from "react";
import {userApi} from "../Store/User/UserApi";
import {TextField} from "../Field/Field";
import {ImgWithContainer} from "../ImgWithContainer/ImgWithContainer";
import {Typography} from "../Typography/Typography";
import {FormProvider, useForm, useFormContext} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ClientSchemaUserUpdate, TClientUserUpdatePayload} from "@way-to-bot/shared/api/zod/client/user.schema";
import {ErrorMessage} from "@hookform/error-message";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {Skeleton} from "../Skeleton/Skeleton";
import {RefetchError} from "../Error/Error";
import {ClientDTOUserGetOne} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {useUploadFile} from "../Hooks/UseUploadFile";

const FileInput: FC<Pick<ClientDTOUserGetOne, "photo">> = ({photo}) => {
    const [previewUrl, setPreviewUrl] = useState(photo?.previewUrl)

    const form = useFormContext()

    const {onChange, clearFile, isLoading} = useUploadFile(({id, url}) => {
        form.setValue("fileId", id)
        setPreviewUrl(url)
    })

    const onClear = () => {
        form.setValue("fileId", null)
        clearFile()
        setPreviewUrl(null)
    }

    return (
        <div className={classes.preview}>
            <ImgWithContainer
                className={classes.imgContainer}
                previewUrl={previewUrl}
            />
            <label className={classes.fileInput}>
                <Button size={"S"} loading={isLoading}>
                    {previewUrl ? "Изменить фото" : "Добавить фото"}
                </Button>

                <input
                    type={"file"}
                    accept={"image/*"}
                    onChange={onChange}
                />
            </label>
            {previewUrl ? (
                <Button onClick={onClear} size={"S"} variant={"secondary"} danger className={classes.delete}>
                    {"Удалить фото"}
                </Button>
            ) : null}
        </div>
    );
};

const renderWithoutTgWarning = () => {
    return <div>
        <Typography type={"text2"}>
            {"Вы пытаетесь зарегистрироваться без Telegram ID."}
        </Typography>
        <Typography type={"text2"}>
            {"Если приложение запущено через Telegram, попробуйте перезагрузить его."}
        </Typography>
        <Typography type={"title5"}>
            {"Вне Telegram регистрация пока невозможна."}
        </Typography>
    </div>
}

type TFormValues = Pick<ClientDTOUserGetOne, "firstName" | "lastName" | "photo" | "email" | "birthDate" | "phoneNumber" | "id">

const Form: FC<TFormValues> = (
    {
        firstName,
        lastName,
        photo,
        id
    }) => {

    const form = useForm({
        resolver: zodResolver(ClientSchemaUserUpdate),
        defaultValues: {
            firstName,
            lastName,
            fileId: photo?.id,
        }
    })

    const [updateUser, {isLoading}] = userApi.useUpdateUserMutation();


    const onSubmit = (values: TClientUserUpdatePayload) => {
        updateUser({...values, id})
    };

    return (
        <FormProvider {...form}>
            <form className={classes.form} onSubmit={form.handleSubmit(onSubmit)}>
                <FileInput photo={photo}/>
                <div className={classes.block}>

                    <TextField
                        label={"Имя"}
                        controllerProps={{name: "firstName"}}
                        inputProps={{
                            placeholder: "Ваше имя",
                        }}
                    />

                    <TextField
                        label={"Фамилия"}
                        controllerProps={{name: "lastName"}}
                        inputProps={{
                            placeholder: "Ваша фамилия",
                        }}
                    />


                    {/*<TextField*/}
                    {/*    label={"Дата рождения"}*/}
                    {/*    controllerProps={{name: "birthDate"}}*/}
                    {/*    inputProps={{*/}
                    {/*        placeholder: "Ваша дата рождения",*/}
                    {/*    }}*/}
                    {/*/>*/}

                    {/*<TextField*/}
                    {/*    label={"Эл. почта"}*/}
                    {/*    controllerProps={{name: "email"}}*/}
                    {/*    inputProps={{*/}
                    {/*        placeholder: "example@mail.com",*/}
                    {/*    }}*/}
                    {/*/>*/}


                    {/*<TextField*/}
                    {/*    label={"Номер телефона"}*/}
                    {/*    controllerProps={{name: "phoneNumber"}}*/}
                    {/*    inputProps={{*/}
                    {/*        placeholder: "Ваш номер телефона",*/}
                    {/*    }}*/}
                    {/*/>*/}

                    <ErrorMessage name={"tgId"}
                                  errors={form.formState.errors}
                                  render={renderWithoutTgWarning}/>
                </div>

                <Button
                    type={"submit"}
                    className={classes.button}
                    loading={isLoading}
                >
                    {"Сохранить"}
                </Button>
            </form>
        </FormProvider>

    );
}

const ProfileForm: FC<IWithId> = ({id}) => {
    const {data: user, isFetching, isError, refetch, error} = userApi.useGetUserByIdQuery(String(id))

    if (isFetching) {
        return <Skeleton/>
    }

    if (isError) {
        return <RefetchError refetch={refetch} error={error}/>
    }


    return user ?
        <Form firstName={user.firstName} lastName={user.lastName} photo={user.photo} birthDate={user.birthDate}
              email={user.email} phoneNumber={user.email} id={user.id}/> : null
};

export {ProfileForm};
