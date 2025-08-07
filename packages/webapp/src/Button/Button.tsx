import {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    CSSProperties,
    FC,
    LabelHTMLAttributes,
    ReactNode,
    Ref,
} from "react";
import classes from "./Button.module.css";
import clsx from "clsx";
import {Link} from "react-router";

interface IButtonBaseProps {
    variant?: "primary" | "secondary";
    size?: "L" | "S";
    as?: "button" | "a" | "link" | "label";
    to?: string;
    textAlign?: CSSProperties["textAlign"];
    ref?: Ref<HTMLAnchorElement>;
    value?: ReactNode;
    loading?: boolean;
    disabled?: boolean
    danger?: boolean
}

type IButtonProps = IButtonBaseProps &
    (
        | ({ as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>)
        | ({ as: "a" } & AnchorHTMLAttributes<HTMLAnchorElement>)
        | ({ as: "link"; to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
        | ({ as: "label" } & LabelHTMLAttributes<HTMLLabelElement>)
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
        disabled,
        danger,
        ...props
    }) => {
    const buttonProps = loading ? {...props, disabled: true} : props;

    const buttonClassName = clsx(
        classes.button,
        classes[variant],
        classes[size],
        loading && classes.loading,
        (disabled || loading) && classes.disabled,
        danger && classes.danger,
        className,
    );

    const style = textAlign ? {textAlign} : undefined;

    // When loading, we should disable the button to prevent multiple submissions

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

    if (as === "label") {
        return (
            <label
                className={buttonClassName}
                style={style}
                {...(buttonProps as LabelHTMLAttributes<HTMLLabelElement>)}
            >
                {children || value}
            </label>
        )
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
