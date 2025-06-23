import classes from "./ProfilePage.module.css";
import {Button} from "../Button/Button";
import {ChangeEventHandler, FC, FormEventHandler, useState} from "react";
import {userApi} from "../Store/User/UserApi";
import {Field} from "../Field/Field";
import {useSelector} from "react-redux";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";
import {Navigate} from "react-router";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {ImgWithContainer} from "../ImgWithContainer/ImgWithContainer";
import {Typography} from "../Typography/Typography";
import {useUploadFile} from "../Hooks/UseUploadFile";

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

const validateValue = (value: string) => {
    let error: undefined | string = undefined;

    // Проверка на пустоту
    if (!value.trim()) {
        error = 'Обязательное поле';
    }
    // Проверка на минимальную длину
    else if (value.trim().length < 2) {
        error = 'Минимум 2 символа';
    }
    // Проверка на разрешенные символы
    else if (!/^[\p{L}\s\-']+$/u.test(value)) {
        error = 'Допустимы только буквы, дефисы и апострофы';
    }
    // Проверка на максимальную длину
    else if (value.length > 30) {
        error = 'Максимум 30 символов';
    }

    return error;
}

const CreateProfile = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const {onChange, fileId, fileUrl, clearFile} = useUploadFile()
    const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
    const [lastNameError, setLastNameError] = useState<string | undefined>(undefined);

    const [createUser] = userApi.useCreateUserMutation();

    const [auth, {isFetching}] = authApi.useLazyAuthByTelegramQuery()

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const _firstNameError = validateValue(firstName)
        const _lastNameError = validateValue(lastName)

        if (_firstNameError || _lastNameError) {
            setFirstNameError(_firstNameError)
            setLastNameError(_lastNameError)
            return
        }

        createUser({
            firstName,
            lastName,
            fileId,
            tgId: String(Telegram.WebApp.initDataUnsafe.user?.id),
            username: Telegram.WebApp.initDataUnsafe.user?.username
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
        setFirstNameError(undefined)
    };

    const onLastNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setLastName(e.target.value ?? "");
        setLastNameError(undefined)

    };

    const onFirstNameBlur = () => {
        setFirstNameError(validateValue(firstName))
    }
    const onLastNameBlur = () => {
        setLastNameError(validateValue(firstName))
    }

    return (
        <form className={classes.page} onSubmit={onSubmit}>
            <FileInput onChange={onChange} previewUrl={fileUrl} clearPreviewUrl={clearFile}/>

            <Field
                error={firstNameError}
                inputProps={{
                    onBlur: onFirstNameBlur,
                    placeholder: "Имя",
                    value: firstName,
                    onChange: onFirstNameChange
                }}
            />

            <Field
                error={lastNameError}
                inputProps={{
                    onBlur: onLastNameBlur,
                    placeholder: "Фамилия",
                    value: lastName,
                    onChange: onLastNameChange
                }}
            />

            <Button
                type={"submit"}
                disabled={isButtonDisabled}
                className={classes.button}
                loading={isFetching}
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
