import React from 'react'
import ComplaintSection from '../../../components/ComplaintsSection/ComplaintsSection'
import './TeachersComplaintPage.scss'
import { decodeSessionStorage } from '../../../helpers/helpers';

const TeachersComplaintPage = () => {
    return (
        <ComplaintSection 
            APIurl={`http://localhost:5000/complaint/get/all/school/${decodeSessionStorage().school_id}`}
            ListItemLink='/complaints/'
        />
    )
}

export default TeachersComplaintPage