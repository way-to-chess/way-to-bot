import { GetThunkAPI } from "@reduxjs/toolkit";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { IWithError } from "@way-to-bot/shared/interfaces/error.interface";

const wrapApiRequestWithThunk =
  <Data, Arg>(
    request: (arg: Arg) => Promise<IResponseWithData<Data> | IWithError | Data>,
  ) =>
  async (arg: Arg | never, thunkAPI: GetThunkAPI<{}>) => {
    const response = await request(arg);

    if (typeof response !== "object" || response === null) {
      return thunkAPI.fulfillWithValue(response);
    }

    if ("error" in response) {
      return thunkAPI.rejectWithValue(response);
    }

    if ("data" in response) {
      return thunkAPI.fulfillWithValue(response.data);
    }

    return thunkAPI.fulfillWithValue(response);
  };

export { wrapApiRequestWithThunk };
