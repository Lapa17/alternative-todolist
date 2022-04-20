import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { loginTC } from './auth-reducer';
import { LoginDataType } from '../../api/todolists-api';
import {AppDispatchType, AppRootStateType, useAppDispatch} from '../../app/store';
import { Navigate } from 'react-router-dom';
import {Paper} from "@mui/material";



export const Login = () => {

    const isLogedIn = useSelector<AppRootStateType>(state=> state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: Partial<Omit<LoginDataType, 'captcha'>> = {};
            if (!values.email) {
                errors.email = 'Required';
            }
            else if (!values.password){
                errors.password = 'Password is required'
            } 
            // else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            //     errors.email = 'Invalid email address';
            // }
            // else if (!/^(?=.*[a-z])(?=.*[0-9]).{6,}/.test(values.password)){
            //    errors.password = 'Invalid password (pass must contain one main letter, one number and 6 symbols)'
            // }
            return errors;
        },

        onSubmit: async (values, formikHelpers )=> {
            const res = await dispatch(loginTC(values));
            if (loginTC.rejected.match(res) ){
                if (res.payload?.fieldsErrors?.length){
                    debugger
                    const error = res.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }

            }
            //formik.resetForm()
        },
    })

    if (isLogedIn) {
        return <Navigate to='/'/>
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <Paper style={{padding: '25px', marginTop:'30px'}}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>

                    <FormGroup>
                        <TextField label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                            onBlur={formik.handleBlur} 
                            />
                            {formik.touched.email && formik.errors.email && <div style={{color: "red"}}>{formik.errors.email}</div>}
                        <TextField type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && <div style={{color: "red"}}>{formik.errors.password}</div>}
                        <FormControlLabel 
                        label={'Remember me'} 
                        control={<Checkbox />} 
                        {...formik.getFieldProps('rememberMe')}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                </FormControl>
            </form>
            </Paper>
        </Grid>
    </Grid>
}

