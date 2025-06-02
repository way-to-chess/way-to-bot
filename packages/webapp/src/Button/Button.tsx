import {AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, FC, ReactNode, Ref,} from "react";
import classes from "./Button.module.css";
import clsx from "clsx";
import {Link} from "react-router";

interface IButtonBaseProps {
    variant?: "primary";
    size?: "L";
    as?: "button" | "a" | "link";
    to?: string;
    textAlign?: CSSProperties["textAlign"];
    ref?: Ref<HTMLAnchorElement>;
    value?: ReactNode;
    loading?: boolean;
}

type IButtonProps = IButtonBaseProps &
    (
        | ({ as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>)
        | ({ as: "a" } & AnchorHTMLAttributes<HTMLAnchorElement>)
        | ({ as: "link"; to: string } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        "href"
    >)
        );

const Button: FC<IButtonProps> = (
    {
        children,
        variant = "primary",
        size = "L",
        className,
        as = "button",
        to,
        textAlign,
        value,
        loading,
        ...props
    }) => {
    const buttonClassName = clsx(
        classes.button,
        classes[variant],
        classes[size],
        loading && classes.loading,
        className,
    );

    const style = textAlign ? {textAlign} : undefined;

    // When loading, we should disable the button to prevent multiple submissions
    const buttonProps = loading ? { ...props, disabled: true } : props;

    if (as === "link" && to) {
        return (
            <Link
                to={to}
                className={buttonClassName}
                style={style}
                {...(buttonProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children || value}
            </Link>
        );
    }

    if (as === "a") {
        return (
            <a
                className={buttonClassName}
                style={style}
                {...(buttonProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children || value}
            </a>
        );
    }

    return (
        <button
            className={buttonClassName}
            style={style}
            {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children || value}
        </button>
    );
};

export {Button};
