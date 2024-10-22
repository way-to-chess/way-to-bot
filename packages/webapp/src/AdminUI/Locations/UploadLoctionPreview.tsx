import { BASE_API_URL } from "../../HttpApi/RequestUtils.ts";
import { Button, FormInstance, message, Upload, UploadProps } from "antd";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { UploadOutlined } from "@ant-design/icons";
import { FC } from "react";

const UploadLocationPreview: FC<{
  setFieldValue: FormInstance["setFieldValue"];
}> = ({ setFieldValue }) => {
  const onChange: UploadProps<{ addedFiles: { id: number }[] }>["onChange"] = (
    info,
  ) => {
    switch (info.file.status) {
      case "removed":
        setFieldValue("previewId", undefined);
        break;
      case "done":
        message.success(`${info.file.name} file uploaded successfully`);
        const previewId = getNotNil(
          info.file?.response?.addedFiles[0].id,
          "CreateLocationForm -> onChange -> previewId",
        );
        setFieldValue("previewId", previewId);
        break;
      case "error":
        message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Upload
      onChange={onChange}
      action={`${BASE_API_URL}/file/add`}
      accept={"image/png, image/jpeg"}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};

export { UploadLocationPreview };
