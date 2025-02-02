import { useDispatch } from "react-redux";
import { ActionCreator } from "@reduxjs/toolkit";

const useActionCreator = <A extends ActionCreator<any>>(
  action: A,
  payload?: Parameters<A>[0],
) => {
  const dispatch = useDispatch();

  return () => {
    dispatch(action(payload));
  };
};

export { useActionCreator };
