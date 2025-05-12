import classes from "./ImgWithContainer.module.css";
import { getPreviewSrc } from "@way-to-bot/shared/utils/GetPreviewSrc";
import { CameraIcon } from "../Icons/CameraIcon";
import { FC } from "react";
import clsx from "clsx";

interface IImgWithContainerProps {
  previewUrl?: string;
  className?: string;
}

const ImgWithContainer: FC<IImgWithContainerProps> = ({
  previewUrl,
  className,
}) => {
  return (
    <div className={clsx(classes.imgContainer, className)}>
      {previewUrl ? (
        <img alt={"event cover"} src={getPreviewSrc(previewUrl)} />
      ) : (
        <div className={classes.emptyImg}>
          <CameraIcon width={"70%"} height={"70%"} />
        </div>
      )}
    </div>
  );
};

export { ImgWithContainer };
