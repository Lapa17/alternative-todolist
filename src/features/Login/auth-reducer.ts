import { todolistsAPI, authAPI, LoginDataType } from './../../api/todolists-api';
import { Dispatch } from 'redux'
import { setAppStatusAC, setInitializedAC } from '../../app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false
}


const slise = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action:PayloadAction<{value:boolean}>) {
            state.isLoggedIn = action.payload.value 
        }
    }
})

export const authReducer = slise.reducer

export const {setIsLoggedInAC} = slise.actions


// thunks

export const loginTC = (data: LoginDataType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:true}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const logoutTC = () => (dispatch: Dispatch)=> {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:false}))
                dispatch(setAppStatusAC({status:'succeeded'}))
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
                dispatch(setIsLoggedInAC({value:true}));
            } else {
            }
        }).finally(() => {
            dispatch(setInitializedAC({isInitialized: true}))
        })
}


