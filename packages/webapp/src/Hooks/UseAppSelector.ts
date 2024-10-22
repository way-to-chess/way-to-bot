import { useSelector } from "react-redux";
import { AppState } from "../Store/App/CreateStore.ts";

const useAppSelector = useSelector.withTypes<AppState>();

export { useAppSelector };
