import { message } from "antd";
import { getNotNil } from "../Utils/GetNotNil";
import { BASE_API_URL } from "../HttpApi/RequestUtils";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { useCallback, useMemo } from "react";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

interface IUseFileUploadProps {
  onRemove?: VoidFunction;
  onDone?: (fileId: number) => void;
  onError?: VoidFunction;
}

const useFileUpload = ({ onRemove, onDone, onError }: IUseFileUploadProps) => {
  const onChange = useCallback(
    (info: UploadChangeParam<UploadFile<{ addedFiles: { id: number }[] }>>) => {
      switch (info.file.status) {
        case "removed":
          onRemove?.();
          break;
        case "done":
          message.success(TEXT.api.success);

          onDone?.(
            getNotNil(
              info.file?.response?.addedFiles[0].id,
              "useFileUpload -> onChange -> done",
            ),
          );
          break;
        case "error":
          message.error(TEXT.api.error);
          onError?.();
      }
    },
    [onRemove, onDone],
  );

  return useMemo(
    () => ({
      onChange,
      action: `${BASE_API_URL}/file/add`,
      accept: "image/png, image/jpeg",
    }),
    [onChange],
  );
};

export { useFileUpload };
