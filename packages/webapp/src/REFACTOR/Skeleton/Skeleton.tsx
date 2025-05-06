import clsx from "clsx";
import classes from "./Skeleton.module.css";
import { CSSProperties } from "react";

interface ISkeletonProps {
  style?: CSSProperties;
  className?: string;
}

const Skeleton = ({ className, style }: ISkeletonProps) => (
  <div className={clsx(classes.skeleton, className)} style={style} />
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
