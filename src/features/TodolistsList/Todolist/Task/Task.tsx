import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from '../../../../api/todolists-api'
import {removeTaskTC, updateTaskTC} from "../../tasks-reducer";
import {useAppDispatch} from "../../../../app/store";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo(({task, todolistId, ...props}: TaskPropsType) => {

    const dispatch = useAppDispatch()

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskTC({taskId: id, todolistId}))
    }, [])

    const changeTaskStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC({taskId: id, domainModel: {status}, todolistId}))
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTC({taskId: id, domainModel: {title: newTitle}, todolistId}))
    }, [])

    const onRemoveTaskHandler = useCallback(() => removeTask(task.id, todolistId), [task.id, todolistId]);

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New, todolistId)
    }, [task.id, todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        changeTaskTitle(task.id, newValue, todolistId)
    }, [task.id, todolistId]);

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}
                style={{position: 'relative', width: 230}}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeTaskStatusHandler}
        />

        <EditableSpan value={task.title} onChange={onTitleChangeHandler} status={task.status}/>
        <IconButton onClick={onRemoveTaskHandler} style={{position: 'absolute', right: -35, top: 0}}>
            <Delete/>
        </IconButton>
    </div>
})
