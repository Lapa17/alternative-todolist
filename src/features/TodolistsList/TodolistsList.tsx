import React, {useCallback, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useAppDispatch} from '../../app/store'
import {addTodolistTC, changeTodolistOrderTC, changeTodolistTitleTC, fetchTodolistsTC, removeTodolistTC} from './todolists-reducer'
import {addTaskTC} from './tasks-reducer'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {selectIsLoggedIn} from '../../selectors/auth-selectors'
import {selectTodolists} from '../../selectors/todolist-selectors'
import {selectTasks} from '../../selectors/todolist-selectors copy'

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const [currentTodo, setCurrentTodo] = useState<any>(null)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        dispatch(fetchTodolistsTC())
    }, [])


    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC({title, todolistId}))
    }, [])


    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC({todolistId: id}))
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleTC({id, title}))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC({title}))
    }, [])


    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, tl:any) {
        console.log('drag', tl)
        setCurrentTodo(tl)
    }
    function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {

    }
    function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {

    }
    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
    }
    function dropHandler(e: React.DragEvent<HTMLDivElement>, tl:any) {
        e.preventDefault()
        // todolists.map(todo => {
        //     if(todo.id === tl.id){
        //         return {...todo, order: currentTodo.order}
        //     }
        //     if(todo.id === currentTodo.id){
        //         return {...todo, order: tl.order}
        //     }
        //     return todo
        // })
        dispatch(changeTodolistOrderTC({id: tl.id, afterItemId: currentTodo.id}))
    }


    if (!isLoggedIn) {
        return <Navigate to='/login'/>
    }
    return <>
        <Grid container style={{padding: '20px 0'}}>
            <Paper style={{padding: '10px'}}>
                <AddItemForm addItem={addTodolist} label={'New card'}/>
            </Paper>
        </Grid>
        <Grid container spacing={3} style={{flexWrap: 'nowrap'}}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id} >
                        <Paper style={{padding: '10px', width: '260px'}}
                               draggable={true}
                               onDragStart={(e)=> dragStartHandler(e, tl)}
                               onDragLeave={(e)=> dragLeaveHandler(e)}
                               onDragEnd={(e)=> dragEndHandler(e)}
                               onDragOver={(e)=> dragOverHandler(e)}
                               onDrop={(e)=> dropHandler(e, tl)}
                        >
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                addTask={addTask}
                                removeTodolist={removeTodolist}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
