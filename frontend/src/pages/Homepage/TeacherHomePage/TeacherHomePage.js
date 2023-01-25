import React from 'react'
import ViewComplaint from '../../../components/TeachersComponenets/ViewComplaints/ViewComaplaints'
import ViewNotifications from '../../../components/TeachersComponenets/ViewNotifications/ViewNotifications'
import './TeacherHomePage.Styles.scss'

const TeacherHomePage = () => {
    return (
        <div className='teacher-homepage'>
            <ViewComplaint />
            <ViewNotifications />
        </div>
    )
}

export default TeacherHomePage