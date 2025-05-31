import {createSlice} from "@reduxjs/toolkit";
import {webAppAuthApi} from "../WebAppAuthApi";
import {AuthDTO} from "@way-to-bot/shared/api/DTO/common/auth.DTO";
import {TExtractData} from "@way-to-bot/shared/interfaces/utility.interface";


interface IAuthState {
    authByTelegram: TExtractData<AuthDTO> | null
}

const initialState: IAuthState = {
    authByTelegram: null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            webAppAuthApi.endpoints.authByTelegram.matchFulfilled,
            (state, {payload}) => {
                state.authByTelegram = payload
            }
        )
    },
    selectors: {
        isAuthorizedByTg: (sliceState) => !!sliceState.authByTelegram,
        token: (sliceState) => sliceState.authByTelegram?.token,
        id: (sliceState) => sliceState.authByTelegram?.id,
    }
})

export {authSlice}