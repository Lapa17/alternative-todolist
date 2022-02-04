import React, {useCallback} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from "./Task";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolistId: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = React.memo(({todolistId, title, tasks, ...props}: PropsType) => {
    console.log('Todolist')
    const addTaskHandler = useCallback((title: string) => {
        props.addTask(title, todolistId);
    }, [])

    const removeTodolistHandler = () => {
        props.removeTodolist(todolistId);
    }
    const changeTodolistTitleHandler = (newTitle: string) => {
        props.changeTodolistTitle(todolistId, newTitle);
    }


    const onAllClickHandler = useCallback(() => props.changeFilter("all", todolistId), [todolistId]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", todolistId), [todolistId]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", todolistId), [todolistId]);

    let tasksForTodolist = tasks;

    if (props.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
    }
    return <div>
        <h3> <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
            <IconButton onClick={removeTodolistHandler}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskHandler}/>
        <div>
            {
                tasksForTodolist.map(t => {



                    return <Task
                        key={t.id}
                        taskId={t.id}
                        todolistId={todolistId}
                    />
                })
            }
        </div>
        <div>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'default'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


