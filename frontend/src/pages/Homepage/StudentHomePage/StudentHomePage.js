import React from 'react'
import ViewComplaint from '../../../components/StudentComponents/ViewComplaints/ViewComaplaints'
import ViewNotifications from '../../../components/StudentComponents/ViewNotifications/ViewNotifications'
import './StudentHomePage.Styles.scss'

const StudentHomePage = () => {
    return (
      <div className='student-homepage'>
          <ViewComplaint />
          <ViewNotifications />
      </div>
    )
}

export default StudentHomePage