import classes from "./ProfilePage.module.css";
import {ImgWithContainer} from "../ImgWithContainer/ImgWithContainer";
import {Typography} from "../Typography/Typography";
import {Button} from "../../Button/Button";
import {fileApi} from "../Store/File/FileApi";
import {ChangeEventHandler, FC, FormEventHandler, useState} from "react";
import {userApi} from "../Store/User/UserApi";
import {Input} from "../Input/Input";
import {useSelector} from "react-redux";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";
import {Navigate} from "react-router";
import {authApi} from "@way-to-bot/shared/redux/authApi";

interface IFileInput {
    setFileId: (fileId: undefined | number) => void;
}

const FileInput: FC<IFileInput> = ({setFileId}) => {
    const [uploadFile] = fileApi.useUploadFileMutation();
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.item(0);

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            uploadFile(formData)
                .unwrap()
                .then(({url, id}) => {
                    setFileId(id);
                    setPreviewUrl(url);
                });
        }
    };

    const clearPreviewUrl = () => {
        setFileId(undefined);
        setPreviewUrl(undefined);
    };

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
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [fileId, setFileId] = useState<undefined | number>(undefined);

    const [createUser] = userApi.useCreateUserMutation();

    const [auth] = authApi.useLazyAuthByTelegramQuery()

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        createUser({
            firstName,
            lastName,
            fileId,
        }).unwrap().then(() => {
            auth({
                tgId: Telegram.WebApp.initDataUnsafe.user?.id,
                username: Telegram.WebApp.initDataUnsafe.user?.username,
            })
        })
    };

    const isButtonDisabled = !lastName || !firstName;

    const onFirstNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFirstName(e.target.value ?? "");
    };

    const onLastNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setLastName(e.target.value ?? "");
    };

    return (
        <form className={classes.page} onSubmit={onSubmit}>
            <FileInput setFileId={setFileId}/>

            <Input placeholder={"Имя"} value={firstName} onChange={onFirstNameChange}/>
            <Input placeholder={"Фамилия"} value={lastName} onChange={onLastNameChange}/>

            <Button
                type={"submit"}
                disabled={isButtonDisabled}
                className={classes.button}
            >
                {"Создать профиль"}
            </Button>

        </form>
    );
}

const ProfilePage = () => {
    const authId = useSelector(authSlice.selectors.id)

    return authId ? <Navigate to={`/users/${authId}`}/> : <CreateProfile/>
};

export {ProfilePage};
