import { v1 } from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistActionType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST": {
            return action.todolists.map( tl => ({...tl, filter: 'all'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolist.id,
                title: action.todolist.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const
}

export const setTodolistAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLIST', todolists} as const
}




export const setTodosTС = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolists().then((res)=>{
        dispatch(setTodolistAC(res.data))
    })
}

export const addTodosTС = (title:string) => (dispatch: Dispatch) => {
    todolistsAPI.createTodolist(title).then((res)=>{
        dispatch(addTodolistAC(res.data.data.item))
    })
}

export const deleteTodosTС = (todolistId:string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTodolist(todolistId).then((res)=>{
        dispatch(removeTodolistAC(todolistId))
    })
}

export const changeTodosTitleTС = (id: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id,title).then((res)=>{
        dispatch(changeTodolistTitleAC(id,title ))
    })
}
