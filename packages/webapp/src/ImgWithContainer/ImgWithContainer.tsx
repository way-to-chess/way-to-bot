import classes from "./ImgWithContainer.module.css";
import {FC, PropsWithChildren, useEffect, useState} from "react";
import clsx from "clsx";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {CameraIcon} from "lucide-react";

interface IImgWithContainerProps extends PropsWithChildren {
    previewUrl?: string | null;
    className?: string;
    link?: string
}

const ImgWithContainer: FC<IImgWithContainerProps> = (
    {
        previewUrl,
        className,
        link,
        children
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

    const Container = link ? "a" : "div"

    const props = link ? {
        target: "_blank",
        rel: "noopener noreferer",
        href: link
    } : {}

    return (
        <Container className={clsx(classes.imgContainer, className)}  {...props}>
            {!loadedSrc ? (
                <div className={classes.emptyImg}>
                    <CameraIcon width={"70%"} height={"70%"}/>
                </div>
            ) : <img alt={"image"} src={loadedSrc} loading={"lazy"}/>}
            {children}
        </Container>
    );
};

export {ImgWithContainer};
