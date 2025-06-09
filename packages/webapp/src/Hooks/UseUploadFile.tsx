import {fileApi} from "../Store/File/FileApi";
import {ChangeEventHandler, useCallback, useState} from "react";

interface IFile {
    url: string
    id: number
    name: string
}

const useUploadFile = () => {
    const [uploadFile, {error, isLoading}] = fileApi.useUploadFileMutation();
    const [file, setFile] = useState<IFile | undefined>(undefined);

    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        const file = e.target.files?.item(0);

        if (!file) {
            return
        }

        const fileName = file.name

        const formData = new FormData();
        formData.append("file", file);

        uploadFile(formData)
            .unwrap()
            .then(({url, id}) => {
                setFile({
                    id,
                    url,
                    name: fileName
                })
            }).catch((error) => {
            console.log(error, 123)
        });
    }, []);

    const clearFile = useCallback(() => {
        setFile(undefined);
    }, [])


    return {
        fileId: file?.id,
        fileUrl: file?.url,
        fileName: file?.name,
        error,
        isLoading,
        clearFile,
        onChange
    }
}

export {useUploadFile}