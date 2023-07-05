import { CssBaseline } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import { TeacherProtectedRoute } from '../../components/ProtectedRoutes/ProtectedRoutes'
import { decodeSessionStorage } from '../../helpers/helpers'
import './Homepage.Styles.scss'
import ProfilePage from '../ProfilePage/ProfilePage'
import StudentHomePage from './StudentHomePage/StudentHomePage'
import TeacherHomePage from './TeacherHomePage/TeacherHomePage'
import CreateNotificationsPage from '../CreateNotificationsPage/CreateNotificationsPage'
import TeacherNotificationPage from '../NotificationsPage/TeacherNotificationPage/TeacherNotificationPage'
import StudentsListPage from '../StudentsListPage/StudentsListPage'
import TeachersComplaintPage from '../ComplaintsPage/TeachersComplaintPage/TeachersComplaintPage'
import CreateComplaint from '../CreateComplaint/CreateComplaint'
import StudentsComplaintPage from '../ComplaintsPage/StudentsComplaintPage/StudentsComplaintPage'
import StudentNotificationPage from '../NotificationsPage/StudentsNotificationPage/StudentsNotificationPage'

const Homepage = () => {
    const { pathname } = useLocation()

    const [user, setUser] = useState({})

    useEffect(() => {
        setUser(decodeSessionStorage())
    }, [])

    const MainComponent = () => {
        if(user.role && user.role === 'Student') return <StudentHomePage />
        if(user.role && user.role === 'Teacher') return <TeacherHomePage />
    } 
    
    return (
        <div className='homepage'>
            <CssBaseline />
            <Navbar />
            <Routes>
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/create/notification' element={<TeacherProtectedRoute><CreateNotificationsPage /></TeacherProtectedRoute>} />
                <Route path='/notifications/' element={<TeacherProtectedRoute><TeacherNotificationPage /></TeacherProtectedRoute>} />
                <Route path='/notifications/:id' element={<TeacherProtectedRoute><TeacherNotificationPage /></TeacherProtectedRoute>} />
                <Route path='/complaints/' element={<TeacherProtectedRoute><TeachersComplaintPage /></TeacherProtectedRoute>} />
                <Route path='/complaints/:id' element={<TeacherProtectedRoute><TeachersComplaintPage /></TeacherProtectedRoute>} />
                <Route path='/students' element={<TeacherProtectedRoute><StudentsListPage /></TeacherProtectedRoute>} />

                <Route path='/create/complaint' element={<CreateComplaint />} />
                <Route path='/my-notifications' element={<StudentNotificationPage />} />
                <Route path='/my-notifications/:id' element={<StudentNotificationPage />} />
                <Route path='/my-complaints' element={<StudentsComplaintPage />} />
                <Route path='/my-complaints/:id' element={<StudentsComplaintPage />} />
            </Routes>
            { pathname === '/' ? MainComponent() : null }
            <Footer />
        </div>
    )
}

export default Homepage