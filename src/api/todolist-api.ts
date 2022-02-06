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

type PostResType = CommonResponseType<{item: TodolistType}>


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
    deleteTodolis(todolistId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(params: {todolistId: string, title: string}) {
        return instance.put<CommonResponseType>(`todo-lists/${params.todolistId}`, { title: params.title })
    }
}

