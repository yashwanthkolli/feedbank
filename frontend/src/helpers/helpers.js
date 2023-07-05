import { decodeToken } from 'react-jwt';
import io from 'socket.io-client'

export const socket = io(process.env.REACT_APP_API, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
})

export const setSessionStorage = (key, value) => {
    if(window !== 'undefined'){
        sessionStorage.setItem(key, value)
    }
}

export const removeSessionStorage = key => {
    if(window !== 'undefined'){
        sessionStorage.removeItem(key)
    }
}

export const setLocalStorage = (key, value) => {
    if(window !== 'undefined'){
        localStorage.setItem(key, JSON.stringify(value))
    }
}

export const removeLocalStorage = (key) => {
    if(window !== 'undefined'){
        localStorage.removeItem(key)
    }
}

export const decodeSessionStorage = () => {

    const payload_token = sessionStorage.getItem("token");

    const myDecodedToken = decodeToken(payload_token);

    return myDecodedToken
}

export const isAuth = () => {
    if(!sessionStorage.getItem('token')) return false;

    if(!decodeSessionStorage() || !decodeSessionStorage().role) return false;

    return true
}

export const signout = () => {
    removeSessionStorage('token')
}