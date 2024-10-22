import { Selector } from "react-redux";
import { AppState } from "../Store/App/CreateStore.ts";

const getNotNil = <T>(candidate: T, entity: string): NonNullable<T> => {
  if (!candidate) {
    throw `GET NOT NIL ERROR FROM ENTITY: ${entity}`;
  }

  return candidate;
};

const getNotNilSelector =
  <T>(selector: Selector<AppState, T>) =>
  (state: AppState) => {
    return getNotNil(selector(state), selector.name);
  };

export { getNotNil, getNotNilSelector };
