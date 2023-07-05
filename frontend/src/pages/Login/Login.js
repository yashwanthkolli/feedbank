import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Login.Styles.scss'
import { setSessionStorage } from '../../helpers/helpers'
import { useNavigate } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaMediumM, FaTwitter } from 'react-icons/fa'
import illustration from '../../assets/Student-Discussing-in-library.svg'
import CustomButton from '../../components/CustomButton/CustomButton'
import CustomInput from '../../components/CustomInput/CustomInput'

const Login = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async() => {
        const id = toast.loading("Please wait...")
        await axios.post(`${process.env.REACT_APP_API}/user/login`, { username, password })
        .then(res => {
            setSessionStorage('token', res.data.token)
            toast.update(id, { 
                render: "Login Succesful", 
                type: "success", 
                isLoading: false,
                autoClose: 2000
            });
            navigate('/')
        })
        .catch(err => {
            setUsername('')
            setPassword('')
            toast.update(id, { 
                render: "User not found!", 
                type: "error", 
                isLoading: false,
                autoClose: 5000
            });
        })
    }

    return (
        <div className='login-page'>
            <div className='content'>
                <h1 className='heading'>FeedBank</h1>
                <p className='text'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus eleifend neque ut mattis. Vestibulum lacinia 
                    turpis nisi, eget fringilla quam pellentesque sit amet. Duis sapien neque, fermentum varius leo ut, feugiat molestie eros. 
                </p>
                <div className='login'>
                    <CustomInput value={username} onChange={(e) => setUsername(e.target.value)} label='Username' fullWidth type='text' />
                    <div style={{width: '10px', height: '20px'}}></div>
                    <CustomInput value={password} onChange={(e) => setPassword(e.target.value)} label='Password' fullWidth type='password' />
                    <div style={{width: '10px', height: '20px'}}></div>
                    <CustomButton onclick={handleLogin} varient='contained' label='Login' />
                </div>
            </div>
            <div className='svg-container'>
                <img src={illustration} alt='icon' />
            </div>
            <div className='socials'>
                <FaFacebookF />
                <FaTwitter />
                <FaLinkedinIn />
                <FaMediumM />
                <FaInstagram />
            </div>
        </div>
    )
}

export default Login