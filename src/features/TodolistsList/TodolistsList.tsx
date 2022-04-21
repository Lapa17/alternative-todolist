import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useAppDispatch} from '../../app/store'
import {addTodolistTC, changeTodolistTitleTC, fetchTodolistsTC, removeTodolistTC} from './todolists-reducer'
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

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px', width: '260px'}}>
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
