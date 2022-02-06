import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { todolistAPI } from '../api/todolist-api'

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
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
        todolistAPI.deleteTodolis(todolistId).then(res => {
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

