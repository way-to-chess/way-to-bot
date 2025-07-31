import {FC, useState} from "react";
import {Button, message, Upload, UploadFile, UploadProps} from "antd";

type TUploadProps = Omit<
    UploadProps,
    "accept" | "action" | "method" | "listType" | "style" | "onChange"
> & {
    onChange?: (fileList: UploadFile[]) => void;
};

const UploadImage: FC<TUploadProps> = (
    {
        onChange: onChangeFromProps,
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

    const action = `${import.meta.env.VITE_API_URL}/client/file`;

    return (
        <Upload
            accept={"image/*"}
            action={action}
            method={"POST"}
            listType={"picture"}
            onChange={onChange}
            style={{width: "100%"}}
            {...props}
        >
            {hideInput ? null : (
                <Button style={{width: "100%"}} type={"dashed"} size={"large"}>
                    {"Загрузить изображение"}
                </Button>
            )}
        </Upload>
    );
};

export {UploadImage}