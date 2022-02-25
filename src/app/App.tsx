import React, { useEffect } from 'react'
import './App.css'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'
import { useDispatch, useSelector } from 'react-redux'
import { AppRootStateType } from './store'
import { RequestStatusType, setInitializedAC } from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import { Menu } from '@mui/icons-material';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import { Login } from '../features/Login/Login'
import { Page404 } from '../features/404/404'
import { initializeAppTC, logoutTC } from '../features/Login/auth-reducer'
import CircularProgress from '@mui/material/CircularProgress'

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
    const isLogedIn = useSelector<AppRootStateType>(state=> state.auth.isLoggedIn)

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    if(!isInitialized){
        return <div
        style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
        <CircularProgress/>
    </div>
 
    }

    return (
        
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLogedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList demo={demo}/>} />
                    <Route path='login' element={<Login  />} />
                    <Route path='404' element={<Page404 />} />
                    <Route path="*" element={<Navigate to='404'/>}/>
                </Routes>
            </Container>
        </div>
        
    )
}

export default App
