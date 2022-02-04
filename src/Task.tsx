import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskType} from "./Todolist";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";

type TaskPropsType = {
    taskId:string
    todolistId: string
}


export const Task = React.memo(({taskId, todolistId, ...props}: TaskPropsType) => {

    const task = useSelector<AppRootStateType, TaskType>(
        state => state.tasks[todolistId].filter(t => t.id === taskId)[0])

    const dispatch = useDispatch()

    const onClickHandler = useCallback(() => dispatch(removeTaskAC(taskId,todolistId)), [dispatch, taskId, todolistId])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(changeTaskStatusAC(taskId, newIsDoneValue, todolistId))
    }, [dispatch, taskId, todolistId])
    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(changeTaskTitleAC(taskId,newValue,todolistId))
    }, [dispatch, taskId, todolistId])


    return <div key={task.id} className={task.isDone ? "is-done" : ""}>
        <Checkbox
            checked={task.isDone}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
        <IconButton onClick={onClickHandler}>
            <Delete />
        </IconButton>
    </div>
})