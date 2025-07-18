import classes from "./ProfilePage.module.css";
import {Button} from "../Button/Button";
import {ChangeEventHandler, FC} from "react";
import {userApi} from "../Store/User/UserApi";
import {TextField} from "../Field/Field";
import {useSelector} from "react-redux";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";
import {Navigate} from "react-router";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {ImgWithContainer} from "../ImgWithContainer/ImgWithContainer";
import {Typography} from "../Typography/Typography";
import {useUploadFile} from "../Hooks/UseUploadFile";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ClientSchemaUserCreate, TClientUserCreatePayload} from "@way-to-bot/shared/api/zod/client/user.schema";

interface IFileInput {
    onChange: ChangeEventHandler<HTMLInputElement>
    previewUrl: string | undefined;
    clearPreviewUrl: () => void
}

const FileInput: FC<IFileInput> = ({onChange, previewUrl, clearPreviewUrl}) => {

    return (
        <div className={classes.preview}>
            <ImgWithContainer
                className={classes.imgContainer}
                previewUrl={previewUrl}
            />
            <label className={classes.fileInput}>
                {previewUrl ? (
                    <Typography
                        type={"title5"}
                        value={"Изменить фото"}
                        color={"mainColor"}
                    />
                ) : (
                    <Typography
                        type={"title5"}
                        value={"Добавить фото"}
                        color={"mainColor"}
                    />
                )}

                <input
                    type={"file"}
                    accept={"image/png, image/jpeg"}
                    onChange={onChange}
                />
            </label>
            {previewUrl ? (
                <button onClick={clearPreviewUrl}>
                    <Typography
                        type={"title5"}
                        value={"Удалить фото"}
                        color={"redColor"}
                    />
                </button>
            ) : null}
        </div>
    );
};

const CreateProfile = () => {
    const form = useForm({
        resolver: zodResolver(ClientSchemaUserCreate),
        defaultValues: {
            fileId: null,
            tgId: String(Telegram.WebApp.initDataUnsafe.user?.id),
            username: Telegram.WebApp.initDataUnsafe.user?.username
        }
    })

    const {onChange, fileUrl, clearFile} = useUploadFile(({id}) => {
        form.setValue("fileId", id)
    })

    const [createUser] = userApi.useCreateUserMutation();

    const [auth, {isFetching}] = authApi.useLazyAuthByTelegramQuery()

    const onSubmit = (values: TClientUserCreatePayload) => {

        createUser(values).unwrap().then(() => {
            auth({
                tgId: Telegram.WebApp.initDataUnsafe.user?.id,
                username: Telegram.WebApp.initDataUnsafe.user?.username,
            })
        })
    };


    const clearPreviewUrl = () => {
        clearFile()
        form.setValue("fileId", null)
    }

    return (
        <FormProvider {...form}>
            <form className={classes.page} onSubmit={form.handleSubmit(onSubmit)}>
                <FileInput onChange={onChange} previewUrl={fileUrl} clearPreviewUrl={clearPreviewUrl}/>

                <TextField
                    controllerProps={{name: "firstName"}}
                    inputProps={{
                        placeholder: "Имя",
                    }}
                />

                <TextField
                    controllerProps={{name: "lastName"}}
                    inputProps={{
                        placeholder: "Фамилия",
                    }}
                />

                <Button
                    type={"submit"}
                    className={classes.button}
                    loading={isFetching}
                >
                    {"Создать профиль"}
                </Button>
            </form>
        </FormProvider>

    );
}

const ProfilePage = () => {
    const authId = useSelector(authSlice.selectors.id)

    return authId ? <Navigate to={`/users/${authId}`}/> : <CreateProfile/>
};

export {ProfilePage};
