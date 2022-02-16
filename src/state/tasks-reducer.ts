import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

export type AddTaskActionType = ReturnType<typeof addTaskAC>

export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>

export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

export type SetTasksActionType = ReturnType<typeof setTasksAC>


type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | SetTasksActionType

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {

        case 'SET-TODOLIST': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case "SET-TASKS": {
            return {...state,[action.todolistId]: action.tasks}
        }

        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId) }
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }

        case 'CHANGE-TASK-STATUS': {
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, status: action.status} : t)}
        }
        case 'CHANGE-TASK-TITLE': {
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, title: action.title} : t)}

        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET-TASKS', tasks, todolistId} as const
}


export const setTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId).then((res) => {
        dispatch(setTasksAC(res.data.items, todolistId ))
    })
}

export const deleteTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(taskId, todolistId))
        }
    })
}

export const addTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todolistId, title).then((res) => {
        dispatch(addTaskAC(res.data.data.item))
    })
}

export const updateTaskStatusTS = (todolistId: string, taskId: string, status: TaskStatuses) =>
    (dispatch: Dispatch, getState: ()=> AppRootStateType) => {

    const task = getState().tasks[todolistId].find(ts => ts.id === taskId)
        if (task){
            const model:UpdateTaskModelType  = {
                title: task.title,
                status,
                description: task.description,
                priority: task.priority,
                startDate:task.startDate,
                deadline: task.deadline,
            }
            todolistsAPI.updateTask(todolistId, taskId, model).then(res => {
                dispatch(changeTaskStatusAC(taskId,status,todolistId ))
            })
        }


}

export const updateTaskTitleTS = (todolistId: string, taskId: string, title: string) =>
    (dispatch: Dispatch, getState: ()=> AppRootStateType) => {

        const task = getState().tasks[todolistId].find(ts => ts.id === taskId)
        if (task){
            const model:UpdateTaskModelType  = {
                title,
                status: task.status,
                description: task.description,
                priority: task.priority,
                startDate:task.startDate,
                deadline: task.deadline,
            }
            todolistsAPI.updateTask(todolistId, taskId, model).then(res => {
                dispatch(changeTaskTitleAC(taskId,title,todolistId ))
            })
        }


    }