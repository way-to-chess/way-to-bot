import {useDispatch} from "react-redux";
import {AppDispatch} from "../Store/App/CreateStore";

const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export {useAppDispatch};
