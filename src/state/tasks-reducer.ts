import { TasksStateType } from '../App';
import { v1 } from 'uuid';
import { AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType } from './todolists-reducer';
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from '../api/todolists-api'
import { Dispatch } from "redux";
import { AppRootStateType, AppThunk } from "./store";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

export type AddTaskActionType = ReturnType<typeof addTaskAC>


export type SetTasksActionType = ReturnType<typeof setTasksAC>

export type UpdateTasksActionType = ReturnType<typeof updateTaskAC>


export type TaskActionsType = RemoveTaskActionType | AddTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | SetTasksActionType
    | UpdateTasksActionType


export type UpdateTaskDomainModelType = {
        title?: string
        description?: string
        status?: TaskStatuses
        priority?: TaskPriorities
        startDate?: string
        deadline?: string
    }

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

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {

        case 'SET-TODOLIST': {
            const stateCopy = { ...state }
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case "SET-TASKS": {
            return { ...state, [action.todolistId]: action.tasks }
        }

        case 'REMOVE-TASK': {
            return { ...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId) }
        }
        case 'ADD-TASK': {
            return { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] }
        }

        case 'ADD-TODOLIST': {
            return { ...state, [action.todolist.id]: [] }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = { ...state };
            delete copyState[action.id];
            return copyState;
        }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.domainModel} : t)
            }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return { type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId } as const
}
export const addTaskAC = (task: TaskType) => {
    return { type: 'ADD-TASK', task } as const
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return { type: 'SET-TASKS', tasks, todolistId } as const
}
export const updateTaskAC = (taskId: string, todolistId: string, domainModel: UpdateTaskDomainModelType) => {
    return { type: 'UPDATE-TASK', taskId, todolistId, domainModel } as const
}


export const setTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    todolistsAPI.getTasks(todolistId).then((res) => {
        dispatch(setTasksAC(res.data.items, todolistId))
    })
}

export const deleteTasksTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(taskId, todolistId))
        }
    })
}

export const addTasksTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    todolistsAPI.createTask(todolistId, title).then((res) => {
        dispatch(addTaskAC(res.data.data.item))
    })
}

    export const updateTaskTS = (todolistId: string, taskId: string, domainModel: UpdateTaskDomainModelType): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {

        const task = getState().tasks[todolistId].find(ts => ts.id === taskId)
        if (task) {
            const model: UpdateTaskModelType = {
                title: task.title,
                status: task.status,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...domainModel
            }
            todolistsAPI.updateTask(todolistId, taskId, model).then(res => {
                dispatch(updateTaskAC(taskId, todolistId, domainModel))
            })
        }


    }