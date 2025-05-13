import classes from "./ImgWithContainer.module.css";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {CameraIcon} from "../Icons/CameraIcon";
import {FC, useState} from "react";
import clsx from "clsx";

interface IImgWithContainerProps {
    previewUrl?: string;
    className?: string;
}

const ImgWithContainer: FC<IImgWithContainerProps> = (
    {
        previewUrl,
        className,
    }) => {
    const [hasError, setHasError] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    const onError = () => {
        setHasError(true)
    }

    const onLoad = () => {
        setIsLoaded(true)
    }

    const shouldShowFallback = !previewUrl || !isLoaded || hasError

    return (
        <div className={clsx(classes.imgContainer, className)}>
            {shouldShowFallback ? (
                <div className={classes.emptyImg}>
                    <CameraIcon width={"70%"} height={"70%"}/>
                </div>
            ) : <img alt={"image"} src={getPreviewSrc(previewUrl)} onError={onError} onLoad={onLoad}/>}
        </div>
    );
};

export {ImgWithContainer};
