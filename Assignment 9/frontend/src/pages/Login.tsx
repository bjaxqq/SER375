import { useState } from 'react'
import styles from './Login.module.css'
import { login } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    if (localStorage.getItem('TOKEN')) {
        navigate('/')
    }

    async function submitForm(e: any) {
        e.preventDefault()
        setErrorMessage('')
        if (!username) {
            setErrorMessage('Username cannot be empty!')
            return
        }
        if (!password) {
            setErrorMessage('Password cannot be empty!')
            return
        }
        try {
            const token = await login(username, password)
            localStorage.setItem('TOKEN', token)
            window.dispatchEvent(new Event("storage"));
            navigate('/')
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setErrorMessage('Incorrect username and/or password')
                    return
                }
            }
            setErrorMessage('Unable to login -- please try again later')
        }
    }

    return (
        <div className={styles['main-container']}>
            <h1>Login</h1>
            <p>Please enter in your username and password.</p>
            <form onSubmit={submitForm}>
                <div className={styles['form-container']}>
                    <div className={styles['field-container']}>
                        <p className={styles['field-label']}>Username:</p>
                        <input className={styles['field-input']} value={username} type="text" onChange={(e) => { setUsername(e.target.value)}}/>
                    </div>
                    <div className={styles['field-container']}>
                        <p className={styles['field-label']}>Password:</p>
                        <input className={styles['field-input']} value={password} type="password" onChange={(e) => { setPassword(e.target.value)}}/>
                    </div>
                </div>
                <button className={styles.button} type='submit'>Submit</button>
                <p className={styles.error}>{errorMessage}</p>
            </form>
        </div>
    )
}