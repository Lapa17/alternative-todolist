import { todolistsAPI, authAPI, LoginDataType } from './../../api/todolists-api';
import { Dispatch } from 'redux'
import { setAppStatusAC, setInitializedAC } from '../../app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export const loginTC = createAsyncThunk('auth/login', async (data: LoginDataType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
    try{
    const res = await authAPI.login(data)
            if (res.data.resultCode === 0) {
                
                thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
                return { value: true }
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch);
                return { value: false }
            }
    }
    catch(error:any) {
            handleServerNetworkError(error, thunkAPI.dispatch) 
            return { value: false }
            
    }
})

export const loginTC_ = (data: LoginDataType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({ value: true }))
                dispatch(setAppStatusAC({ status: 'succeeded' }))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers(builder){
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
    }
})

export const authReducer = slice.reducer

export const { setIsLoggedInAC } = slice.actions


// thunks



export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({ value: false }))
                dispatch(setAppStatusAC({ status: 'succeeded' }))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const initializeAppTC = () => (dispatch: Dispatch) => {

    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({ value: true }));
            } else {
            }
        }).finally(() => {
            dispatch(setInitializedAC({ isInitialized: true }))
        })
}


