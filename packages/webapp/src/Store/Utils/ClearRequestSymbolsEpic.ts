import { of } from "rxjs";
import { requestManagerSlice } from "../RequestManager/RequestManagerSlice.ts";

const clearRequestSymbolsEpic =
  (...symbols: symbol[]) =>
  () =>
    of(requestManagerSlice.actions.clear({ symbol: symbols }));

export { clearRequestSymbolsEpic };
