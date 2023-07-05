import React from 'react'
import ComplaintSection from '../../../components/ComplaintsSection/ComplaintsSection'
import './StudentsComplaintPage.Styles.scss'
import { decodeSessionStorage } from '../../../helpers/helpers';

const StudentsComplaintPage = () => {
    return (
        <ComplaintSection 
            APIurl={`${process.env.REACT_APP_API}/complaint/get/all/student/${decodeSessionStorage()._id}`}
            ListItemLink='/my-complaints/'
        />
    )
}

export default StudentsComplaintPage