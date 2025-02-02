import { useSelector } from "react-redux";

const useParamSelector = <S, A extends any[], R>(
  selector: (state: S, ...args: A) => R,
  ...args: A
) =>
  useSelector((state: S) => selector(state, ...args)) as A["length"] extends 0
    ? never
    : R;

export { useParamSelector };
