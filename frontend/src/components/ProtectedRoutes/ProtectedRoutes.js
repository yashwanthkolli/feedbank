import React from 'react'
import { Navigate } from 'react-router-dom'
import { decodeSessionStorage, isAuth } from '../../helpers/helpers'

export const ProtectedRoute = ({children}) => {
    if (!isAuth()) {
        return <Navigate to="/login" replace />
    }
    return children
}

export const TeacherProtectedRoute = ({children}) => {
    const user = decodeSessionStorage()
    if (!isAuth()) {
        return <Navigate to="/login" replace />
    }
    if(user.role === 'Student'){
        return <Navigate to="/" replace />
    }
    return children
}
