import { useDispatch } from "react-redux";
import { type AppDispatch } from "../Store/App/AppStore.ts";

const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export { useAppDispatch };
