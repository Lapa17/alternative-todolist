import React, { useEffect, useState } from 'react'
import { todolistAPI } from '../api/todolist-api'

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists().then(res => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = 'Todo of tasks'
        todolistAPI.createTodolist(title).then(res => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '109e9e8e-a8eb-4e22-adb3-43b26fe6ef71'
        todolistAPI.deleteTodolist(todolistId).then(res => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '27709629-69bb-4905-a432-1dcd4a48235a'
        const title = 'Some todo'
        todolistAPI.updateTodolist({todolistId,title}).then(res => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '27709629-69bb-4905-a432-1dcd4a48235a'
        todolistAPI.getTasks(todolistId).then(res => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '27709629-69bb-4905-a432-1dcd4a48235a'
        const title = 'Task 1'
        todolistAPI.createTask({title , todolistId}).then(res => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '27709629-69bb-4905-a432-1dcd4a48235a'
        const taskId = '42e6fe2a-c95a-4104-9fc3-64689c7a2907'
        todolistAPI.deleteTask({todolistId, taskId}).then(res => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '27709629-69bb-4905-a432-1dcd4a48235a'
        const taskId = '75c4d903-ec58-4d4f-9b9c-0dc3b9459b86'
        const item = {
            description: 'asdasdasdad',
            order: 2,
            priority: 1,
            status: 1,
            title: "WORK!!!!!!!",
        }
        todolistAPI.updateTask({todolistId,taskId, item}).then(res => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}