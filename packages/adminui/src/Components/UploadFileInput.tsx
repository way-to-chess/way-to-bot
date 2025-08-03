import {FC, useCallback, useState} from "react";
import {Button, message, Upload, UploadFile, UploadProps} from "antd";
import {EFileAssigment} from "@way-to-bot/shared/api/enums/EFileAssigment";

type TUploadProps = Omit<
    UploadProps, "action" | "method" | "listType" | "style" | "onChange"
> & {
    onChange?: (fileList: UploadFile[]) => void;
    assigment: EFileAssigment;
};

const UploadFileInput: FC<TUploadProps> = (
    {
        onChange: onChangeFromProps,
        assigment,
        ...props
    }) => {
    const [hideInput, setHideInput] = useState(
        props.fileList && props.fileList?.length > 0,
    );

    const onChange: UploadProps["onChange"] = (info) => {
        const {status} = info.file;

        if (status === "uploading") {
            setHideInput(true);
        }

        if (status === "done") {
            setHideInput(true);
            message.success(`${info.file.name} успешно загружен`);
        }
        if (status === "error") {
            setHideInput(false);
            message.error(`${info.file.name} ошибка загрузки`);
        }
        if (status === "removed") {
            setHideInput(false);
        }

        onChangeFromProps?.(info.fileList);
    };

    const customRequest = useCallback((options: Parameters<NonNullable<UploadProps["customRequest"]>>[0]) => {
        const formData = new FormData()

        formData.append("file", options.file)
        formData.append("assigment", assigment)

        return fetch(`${import.meta.env.VITE_API_URL}/client/file`, {
            method: "POST",
            body: formData
        }).then((response) => response.json()).then(options.onSuccess).catch(options.onError)
    }, [assigment])

    return (
        <Upload
            accept={"image/*"}
            listType={"picture"}
            onChange={onChange}
            style={{width: "100%"}}
            customRequest={customRequest}
            {...props}
        >
            {hideInput ? null : (
                <Button style={{width: "100%"}} type={"dashed"} size={"large"}>
                    {"Загрузить файл"}
                </Button>
            )}
        </Upload>
    );
};

export {UploadFileInput}