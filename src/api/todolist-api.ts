import axios, { AxiosResponse } from "axios"

type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

type CommonResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data:T
}

type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: number
    startDate: string
    status: number
    title: string
    todoListId: string
}

type GetTasksType = {
    error: string
    items: Array<TaskType>
    totalCount: number
}

type UpdatedTask = {
    description: string
    order: number
    priority: number
    status: number
    title: string
}

type CommonResponseTaskType<D = {}> = {
    data: D
    fieldsErrors: []
    messages: Array<string>
    resultCode: number
}

type PostResType = CommonResponseType<{item: TodolistType}>

type TaskPostResType = CommonResponseTaskType<{item: TaskType}>


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': 'ed0fa8fa-ddbb-478a-b370-1f41a9c286be'
    }
})

export const todolistAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<PostResType,AxiosResponse<PostResType>, {title: string}>('todo-lists', { title })
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(params: {todolistId: string, title: string}) {
        return instance.put<CommonResponseType>(`todo-lists/${params.todolistId}`, { title: params.title })
    },
    getTasks(todolistId:string) {
        return instance.get<GetTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(params: {todolistId: string, title: string}) {
        return instance.post<TaskPostResType, AxiosResponse<TaskPostResType>, {title: string}>(`todo-lists/${params.todolistId}/tasks`, { title:params.title })
    },
    deleteTask(params:{todolistId: string,taskId:string}) {
        return instance.delete<CommonResponseTaskType>(`todo-lists/${params.todolistId}/tasks/${params.taskId}`)
    },
    updateTask(params: {todolistId: string, taskId:string, item:UpdatedTask}) {
        return instance.put<CommonResponseTaskType>(`todo-lists/${params.todolistId}/tasks/${params.taskId}`,
            { ...params.item})
    },
}

