import React, { useEffect, useState } from 'react'
import { Divider, Paper, Typography, DialogContentText, DialogActions, Pagination, Stack, List, ListItem, ListItemText } from '@mui/material'
import { styled } from '@mui/material/styles';
import './StudentsNotificationPage.Styles.scss'
import axios from 'axios';
import { decodeSessionStorage } from '../../../helpers/helpers';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import CustomDialogue from '../../../components/CustomDialogue/CustomDialogue';
import CustomButton from '../../../components/CustomButton/CustomButton';

const PaperComponent = styled(Paper)(( ) => ({
    width: '80%',
    padding: '30px',
    height: 'calc(100vh - 200px)'
}));

const StudentNotificationPage = () => {
    const params = useParams()

    const [notifications, setNotifications] = useState([])
    const [page, setPage] = useState(1)
    const [pagesCount, setPagesCount] = useState(1)
    const [dialogueOpen, setDialogueOpen] = useState(false)
    const [selectedNotification, setSelectedNotification] = useState({})

    useEffect(() => {
        if(params.id) {
            axios.get(`${process.env.REACT_APP_API}/notification/get/${params.id}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } })
            .then(res => setSelectedNotification(res.data))
            .catch(e => toast.error('Unable to get details!'))
            setDialogueOpen(true)
        }
    }, [params])

    useEffect(() => {
        axios.post(
            `${process.env.REACT_APP_API}/notification/get/all/${decodeSessionStorage().school_id}`,
            {
                offset: 7*(page-1),
                limit: 7
            },
            { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        )
        .then(res => {
            let count = Math.ceil(res.data.totalNotification/7)
            if(count !== pagesCount) setPagesCount(count)

            setNotifications(res.data.notifications)
        })
        .catch(e => toast.error('Unable to fetch notifications!'))
    }, [page])

    return (
        <PaperComponent>
            <div className='notifications-page'>
                <Typography variant='h5' sx={{marginBottom: '30px'}}>Notifications</Typography>
                <div className='content'>
                    <List sx={{ mb: 2, pt: 0 }} style={{maxHeight: '100%', overflow: 'auto'}}>
                    {notifications.map((notification) => (
                        <Link to={`/my-notifications/${notification._id}`} key={notification._id}>
                            <ListItem button>
                                <ListItemText primary={notification.heading} />
                                <div style={{textAlign: 'right', marginLeft: '30px', width: '30%'}}>
                                    <Typography variant='caption'>{moment(notification.date).calendar()}</Typography><br />
                                </div>
                            </ListItem>
                            <Divider />
                        </Link>
                    ))}
                    </List>
                </div>
                <Stack alignItems='center' marginTop='30px'>
                    <Pagination count={pagesCount} page={page} onChange={(e, value) => setPage(value)} showFirstButton showLastButton />
                </Stack>
            </div>

            <CustomDialogue
                    open={dialogueOpen}
                    onclose={() => setDialogueOpen(false)}
                    title={selectedNotification ? selectedNotification.heading : ''}
                    maxWidth='lg'
                    fullWidth
                    content={
                        <React.Fragment>
                            <DialogContentText>
                            {selectedNotification ? selectedNotification.body : 'Loading...'}
                            </DialogContentText>
                        </React.Fragment>
                    }
            />
        </PaperComponent>
    )
}

export default StudentNotificationPage