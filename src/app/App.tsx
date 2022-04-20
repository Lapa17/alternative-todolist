import React, {useEffect, useState} from 'react'
import './App.css'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'
import { useDispatch, useSelector } from 'react-redux'
import { AppRootStateType } from './store'
import {initializeAppTC, RequestStatusType} from './app-reducer'
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
import {logoutTC } from '../features/Login/auth-reducer'
import CircularProgress from '@mui/material/CircularProgress'
import backgroundImg from '../assets/background-min.jpg'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {Switch} from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
    const isLogedIn = useSelector<AppRootStateType>(state=> state.auth.isLoggedIn)



    const [theme, setTheme] = useState(lightTheme)
    const [checked, setChecked] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        if (checked){
            setTheme(lightTheme)
        }
        else{
            setTheme(darkTheme)
        }
    };

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
    const background = theme === lightTheme ? `url(${backgroundImg})` : '#7D7B7B'

    return (
        <ThemeProvider theme={theme}>
        <div className="App" style={{background: background, overflowX : 'auto', height: '100vh'}}>
            <ErrorSnackbar/>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" style={{marginRight:15}}>
                        Menu
                    </Typography>
                    {theme === lightTheme ? <span>light theme</span> : <span>dark theme</span>}
                    <Switch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    {isLogedIn && <Button color="inherit"
                                          variant={"outlined"}
                                          style={{marginRight:'20px', position: 'absolute', right: 0}}
                                          onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            
            <Container fixed style={{marginTop: '90px'}}>
                <Routes>
                    <Route path='/' element={<TodolistsList demo={demo}/>} />
                    <Route path='login' element={<Login  />} />
                    <Route path='404' element={<Page404 />} />
                    <Route path="*" element={<Navigate to='404'/>}/>
                </Routes>
            </Container>
        </div>
        </ThemeProvider>
    )
}

export default App
