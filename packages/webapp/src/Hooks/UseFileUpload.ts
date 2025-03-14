import { message } from "antd";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { useCallback, useMemo } from "react";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";

import { BASE_API_URL } from "@way-to-bot/shared/constants/envs";

interface IFileUploadResponse {
  id: number;
  url: string;
}

interface IUseFileUploadProps {
  onRemove?: VoidFunction;
  onDone?: (data: IFileUploadResponse) => void;
  onError?: VoidFunction;
}

const useFileUpload = ({ onRemove, onDone, onError }: IUseFileUploadProps) => {
  const onChange = useCallback(
    (
      info: UploadChangeParam<
        UploadFile<IResponseWithData<IFileUploadResponse>>
      >,
    ) => {
      switch (info.file.status) {
        case "removed":
          onRemove?.();
          break;
        case "done":
          message.success(TEXT.success);

          onDone?.(
            getNotNil(
              info.file?.response?.data,
              "useFileUpload -> onChange -> done",
            ),
          );
          break;
        case "error":
          message.error(TEXT.error);
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

export { useFileUpload, type IFileUploadResponse };
