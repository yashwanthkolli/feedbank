import React from 'react'
import ComplaintSection from '../../../components/ComplaintsSection/ComplaintsSection'
import './TeachersComplaintPage.scss'
import { decodeSessionStorage } from '../../../helpers/helpers';

const TeachersComplaintPage = () => {
    return (
        <ComplaintSection 
            APIurl={`${process.env.REACT_APP_API}/complaint/get/all/school/${decodeSessionStorage().school_id}`}
            ListItemLink='/complaints/'
        />
    )
}

export default TeachersComplaintPage