import { createPropertySelectors } from "../Utils/CreatePropertySelectors";
import { AppState } from "../App/CreateStore";
import { getNotNil } from "../../Utils/GetNotNil";
import { TLocationUpdatePayload } from "../../../../src/types/location.types";

const locationsSelectors = createPropertySelectors(
  (state: AppState) => state.locations,
);

const locationByIdSelector = (id: string) => (state: AppState) => {
  const locations = locationsSelectors.data(state);

  const location = locations.find((it) => String(it.id) === id);

  return getNotNil(location, "locationByIdSelector");
};

const updateLocationFormInitialValuesByIdSelector =
  (id: string) =>
  (state: AppState): TLocationUpdatePayload => {
    const location = locationByIdSelector(id)(state);

    return {
      id: location.id,
      title: location.title ?? "",
      address: location.address ?? "",
      url: location.url ?? "",
      previewId: location?.preview?.id,
    };
  };

export { locationsSelectors, updateLocationFormInitialValuesByIdSelector };
