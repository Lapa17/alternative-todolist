import React, {ChangeEvent, useState} from 'react';
import TextField from '@mui/material/TextField';
import {TaskStatuses} from "../../api/todolists-api";

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    status?: TaskStatuses
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
    console.log('EditableSpan called');
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const completedStyle = props.status === TaskStatuses.Completed ? {
        color: '#c9c5c5',
        textDecoration: 'line-through'
    } : {}

    return editMode
        ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode}/>
        : <span onDoubleClick={activateEditMode} style={completedStyle}>{props.value}</span>
});
