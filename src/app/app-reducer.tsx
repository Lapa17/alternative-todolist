export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
   status: 'idle' as RequestStatusType
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
   switch (action.type) {
       case 'APP/SET-STATUS':
           return {...state, status: action.status}
       default:
           return state
   }
}

export const setAppStatusAC = (mainStatus: RequestStatusType) => ({type:'APP/SET-STATUS', status:mainStatus})

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>

export type AppActionsType = SetAppStatusActionType

