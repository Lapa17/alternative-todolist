import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from '../../../api/todolists-api'
import {changeTodolistFilterAC, FilterValuesType, TodolistDomainType} from '../todolists-reducer'
import {useDispatch} from 'react-redux'
import {fetchTasksTC} from '../tasks-reducer'
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    addTask: (title: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean
}

export const Todolist = React.memo(function ({
                                                 demo = false,
                                                 todolist,
                                                 tasks,
                                                 addTask,
                                                 changeTodolistTitle,
                                                 removeTodolist,
                                                 ...props
                                             }: PropsType) {

    const dispatch = useDispatch()
    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTasksTC(todolist.id))
    }, [])

    const addTaskHandler = useCallback((title: string) => {
        addTask(title, todolist.id)
    }, [addTask, todolist.id])

    const removeTodolistHandler = useCallback(() => {
        removeTodolist(todolist.id)
    },[todolist.id])
    const changeTodolistTitleHandler = useCallback((title: string) => {
        changeTodolistTitle(todolist.id, title)
    }, [todolist.id, changeTodolistTitle])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC({id: todolistId, filter: value}))
    }, [])

    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const filterButton = (filter: FilterValuesType, color: OverridableStringUnion<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        ButtonPropsColorOverrides>, text: string) => {
        return <Button variant={todolist.filter === filter ? 'outlined' : 'text'}
                       onClick={() => changeFilter(filter, todolist.id)}
                       color={color}
        >{text}</Button>
    }

    return <div>
        <h3 style={{position: 'relative'}}><EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler}/>
            <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}
                        style={{position: 'absolute', top: '-25px', right: '-5px'}}>
                <ClearIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === 'loading'} label={'New task'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            {filterButton('all', 'inherit', 'All')}
            {filterButton('active', 'primary', 'Active')}
            {filterButton('completed', 'secondary', 'Completed')}
        </div>
    </div>
})


