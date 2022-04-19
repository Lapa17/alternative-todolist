import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {loginTC, setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";


export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, {dispatch,rejectWithValue}) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
       return
    }
   catch (err:any) {
       const error: AxiosError = err
       handleServerNetworkError(error, dispatch)
       return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
   }
})

// export const initializeAppTC_ = () => (dispatch: Dispatch) => {
//     authAPI.me()
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: true}));
//             } else {
//             }
//         }).finally(() => {
//         dispatch(setInitializedAC({isInitialized: true}))
//     })
// }

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
    extraReducers(builder){
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = sliсe.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    isInitialized: boolean
}

export const {setAppErrorAC, setAppStatusAC} = sliсe.actions

