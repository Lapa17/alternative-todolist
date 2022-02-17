export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppErrorType = string | null

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as AppErrorType
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.status }
        case 'APP/SET-ERROR':
            return { ...state, error: action.error }
        default:
            return state
    }
}

export const setAppStatusAC = (mainStatus: RequestStatusType) => ({ type: 'APP/SET-STATUS', status: mainStatus } as const)
export const setAppErrorsAC = (error: AppErrorType) => ({ type: 'APP/SET-ERROR', error } as const)

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorsAC>

export type AppActionsType = SetAppStatusActionType | SetAppErrorActionType

