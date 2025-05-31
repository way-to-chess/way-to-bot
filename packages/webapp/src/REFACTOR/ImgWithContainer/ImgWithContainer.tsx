import classes from "./ImgWithContainer.module.css";
import {CameraIcon} from "../Icons/CameraIcon";
import {FC, useEffect, useState} from "react";
import clsx from "clsx";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";

interface IImgWithContainerProps {
    previewUrl?: string;
    className?: string;
}

const ImgWithContainer: FC<IImgWithContainerProps> = (
    {
        previewUrl,
        className,
    }) => {
    const [loadedSrc, setLoadedSrc] = useState<string>("")

    useEffect(() => {
        const src = getPreviewSrc(previewUrl)

        if (src) {
            const img = new Image();

            img.src = src;

            img.onload = () => setLoadedSrc(src);
            img.onerror = () => setLoadedSrc("");
        } else {
            setLoadedSrc("");
        }
    }, [previewUrl]);

    return (
        <div className={clsx(classes.imgContainer, className)}>
            {!loadedSrc ? (
                <div className={classes.emptyImg}>
                    <CameraIcon width={"70%"} height={"70%"}/>
                </div>
            ) : <img alt={"image"} src={loadedSrc}/>}
        </div>
    );
};

export {ImgWithContainer};
