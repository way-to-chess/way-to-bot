import { useDispatch as useReduxDispatch } from "react-redux";
import { STORE } from "../store";

const useDispatch = useReduxDispatch<typeof STORE.dispatch>;

export { useDispatch };
