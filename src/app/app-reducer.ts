import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError} from "../utils/error-utils";


export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, {dispatch, rejectWithValue}) => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}));
    } else {
        handleServerAppError(res.data, dispatch);
    }

})

const sliсe = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
    },
    extraReducers(builder) {
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = sliсe.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export const {setAppErrorAC, setAppStatusAC} = sliсe.actions

