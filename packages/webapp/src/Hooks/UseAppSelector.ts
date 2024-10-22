import { useSelector } from "react-redux";
import { AppState } from "../Store/App/CreateStore";

const useAppSelector = useSelector.withTypes<AppState>();

export { useAppSelector };
