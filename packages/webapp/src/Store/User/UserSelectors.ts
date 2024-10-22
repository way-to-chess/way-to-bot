import { AppState } from "../App/CreateStore.ts";
import { getNotNil, getNotNilSelector } from "../../Utils/GetNotNil.ts";
import { createPropertySelectors } from "../Utils/CreatePropertySelectors.ts";

const userSelectors = createPropertySelectors((state: AppState) => state.user);

const userStatusSelector = userSelectors.status;

const userInfoNotNilSelector = (state: AppState) =>
  getNotNil(userSelectors.info(state), "userInfoNotNilSelector");

const userProfilePageErrorNotNilSelector = getNotNilSelector(
  userSelectors.profilePageError,
);

const userInfoUsernameNotNilSelector = (state: AppState) =>
  getNotNil(
    userSelectors.info(state)?.username,
    "userInfoUsernameNotNilSelector",
  );

const userProfilePageNotNilSelector = getNotNilSelector(
  userSelectors.profilePage,
);

const userInfoUserIdSelector = (state: AppState) =>
  userSelectors.info(state)?.id;

export {
  userStatusSelector,
  userInfoNotNilSelector,
  userProfilePageErrorNotNilSelector,
  userSelectors,
  userInfoUsernameNotNilSelector,
  userProfilePageNotNilSelector,
  userInfoUserIdSelector,
};
