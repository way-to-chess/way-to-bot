import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  FC,
  Ref,
} from "react";
import classes from "./Button.module.css";
import clsx from "clsx";
import { Link } from "react-router";

interface IButtonBaseProps {
  variant?: "primary";
  size?: "L";
  as?: "button" | "a" | "link";
  to?: string;
  textAlign?: CSSProperties["textAlign"];
  ref?: Ref<HTMLAnchorElement>;
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

const Button: FC<IButtonProps> = ({
  children,
  variant = "primary",
  size = "L",
  className,
  as = "button",
  to,
  textAlign,
  ...props
}) => {
  const buttonClassName = clsx(
    classes.button,
    classes[variant],
    classes[size],
    className,
  );

  const style = textAlign ? { textAlign } : undefined;

  if (as === "link" && to) {
    return (
      <Link
        to={to}
        className={buttonClassName}
        style={style}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  if (as === "a") {
    return (
      <a
        className={buttonClassName}
        style={style}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={buttonClassName}
      style={style}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export { Button };
