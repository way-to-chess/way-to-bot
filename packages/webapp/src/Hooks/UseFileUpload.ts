import { message } from "antd";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { useCallback, useMemo } from "react";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { BASE_API_URL } from "../HttpApi/RequestUtils";

interface IUseFileUploadProps {
  onRemove?: VoidFunction;
  onDone?: (fileId: number) => void;
  onError?: VoidFunction;
}

const useFileUpload = ({ onRemove, onDone, onError }: IUseFileUploadProps) => {
  const onChange = useCallback(
    (
      info: UploadChangeParam<UploadFile<IResponseWithData<{ id: number }>>>,
    ) => {
      switch (info.file.status) {
        case "removed":
          onRemove?.();
          break;
        case "done":
          message.success(TEXT.api.success);

          console.dir(info);

          onDone?.(
            getNotNil(
              info.file?.response?.data.id,
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
      action: `${BASE_API_URL}/file/upload`,
      accept: "image/png, image/jpeg",
    }),
    [onChange],
  );
};

export { useFileUpload };
