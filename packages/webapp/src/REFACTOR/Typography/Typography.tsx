import {createElement, ElementType, FC, PropsWithChildren} from "react";
import clsx from "clsx";
import classes from "./Typography.module.css";

type TTypographyType =
    | "title2"
    | "title3"
    | "text1"
    | "buttonTitle"
    | "title4"
    | "text2"
    | "title5"
    | "title6"

type TColor =
    | "textColor1"
    | "textColor2"
    | "textColor5"
    | "mainColor"
    | "redColor";

interface IWithValue {
    value?: string | number;
}

interface IWithType {
    type: TTypographyType;
}

interface IWithClassName {
    className?: string;
}

type TTypographyProps = PropsWithChildren &
    IWithType &
    IWithValue & { color?: TColor } & { id?: string } & IWithClassName;

const CLASSNAME_BY_TYPE: Record<TTypographyType, string | undefined> = {
    title2: classes.title2,
    title3: classes.title3,
    text1: classes.text1,
    buttonTitle: classes.buttonTitle,
    title4: classes.title4,
    text2: classes.text2,
    title5: classes.title5,
    title6: classes.title6,
};

const TAG_BY_TYPE: Record<TTypographyType, ElementType> = {
    title2: "h2",
    title3: "h3",
    text1: "p",
    buttonTitle: "span",
    title4: "h4",
    text2: "p",
    title5: "h5",
    title6: "h6",
};

const CLASSNAME_BY_COLOR: Record<TColor, string | undefined> = {
    textColor1: classes.textColor1,
    textColor2: classes.textColor2,
    textColor5: classes.textColor5,
    mainColor: classes.mainColor,
    redColor: classes.redColor,
};

const getTypographyClassName = ({
                                    type,
                                    className,
                                    color = "textColor1",
                                }: IWithType & IWithClassName & { color?: TColor }) => {
    return clsx(
        classes.typography,
        CLASSNAME_BY_TYPE[type],
        CLASSNAME_BY_COLOR[color],
        className,
    );
};

const getTypographyTag = (type: TTypographyType) => TAG_BY_TYPE[type];

const Typography: FC<TTypographyProps> = ({
                                              type,
                                              value,
                                              id,
                                              className: externalClassName,
                                              children,
                                              color,
                                          }) => {
    const className = getTypographyClassName({
        type,
        color,
        className: externalClassName,
    });
    const tag = getTypographyTag(type);

    return createElement(tag, {className, id}, children || value);
};

export {Typography, getTypographyClassName};
