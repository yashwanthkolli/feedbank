import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import emptyMessageIllustration from '../../assets/Begin-chat.svg'
import moment from 'moment'
import { TbMessageReport } from 'react-icons/tb'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { AiOutlineSend } from 'react-icons/ai'
import { decodeSessionStorage, socket } from '../../helpers/helpers'
import './ChatSection.Styles.scss'
import { Button, Typography, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    flex: 1,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.1),
    },
    '& .MuiInputBase-input': {
        padding: '5px 20px',
        width: '100%'
    },
}));

const ChatSection = ({update, setUpdate}) => {
    const params = useParams()
    
    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const [selectedComplaintChat, setSelectedComplaintChat] = useState([])
    const [message, setMessage] = useState('')
    
    useEffect(() => {
        if(params.id) {
            axios.get(`${process.env.REACT_APP_API}/chat/get/${params.id}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } })
            .then(res => {
                setSelectedComplaint(res.data.complaint)
                setSelectedComplaintChat(res.data.chat)
            })
            .catch(e => toast.error('Unable to get details!'))

            // socket.emit('join chat', params.id)
        }
    }, [params])

    useEffect(() => {
        const scrollEndElement = document.getElementById('scroll-to-end');
        if (scrollEndElement) {
            scrollEndElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedComplaintChat])

    useEffect  (() => {
        console.log(0)
        const interval = setInterval(() => {
            console.log(1)
            axios.get(`${process.env.REACT_APP_API}/chat/get/${params.id}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } })
            .then(res => {
                setSelectedComplaintChat(res.data.chat)
                console.log(2)
            })
            .catch(e => toast.error('Unable to get details!'))
        }, 3000)
        
        return () => clearInterval(interval)
    }, [selectedComplaintChat, params.id])

    const onSendMessage = async () => {
        axios.post(
            `${process.env.REACT_APP_API}/chat/register`, 
            {
                text: message,
                sender_id: decodeSessionStorage()._id,
                complaint_id: selectedComplaint._id
            },
            { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        )
        .then(res => {
            setMessage('')
            // socket.emit('new message', res.data.chat)
            setSelectedComplaintChat([...selectedComplaintChat, res.data.chat])
        })
        .catch(e => {
            console.log(e)
            toast.error('Unable to send messages!')
        })
    }

    const onMarkAsResolved = async() => {
        axios.get(`${process.env.REACT_APP_API}/complaint/${selectedComplaint._id}/resolved`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } })
        .then(res => {
            toast.success('Marked as Resolved')
            setUpdate(!update)
        })
        .catch(e => toast.error('Failed to process'))
    }

    const onReport = async() => {
        console.log(socket.listeners())
        axios.get(`${process.env.REACT_APP_API}/user/strike/${selectedComplaint.student_id._id}`)
        .then(res => {
            toast.error('Account Reported')
        })
        .catch(e => toast.error('Failed to process'))
    }

    // useEffect(() => {
    //     socket.on('recieve message', async (msg) => {
    //         await axios.get(`${process.env.REACT_APP_API}/chat/get/${params.id}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } })
    //         .then(res => {
    //             if(msg.complaint_id === params.id){
    //                 setSelectedComplaintChat(res.data.chat)
    //             }
    //         })
    //         .catch(e => console.log(e))
    //         // if(msg.complaint_id === params.id){
    //         //     setSelectedComplaintChat([...selectedComplaintChat, msg])
    //         // }
    //     })
    // }, [])

    return (
        <div className='chat-section'>
            {
                selectedComplaint ?
                <React.Fragment>
                    <div className='complaint-section'>
                        <div className='complaint-details'>
                            <Typography variant="h5" component="div" sx={{mb: 1}}>{selectedComplaint.subject}</Typography> 
                            <Typography variant="subtitle2" component="div" sx={{mb: 2}}>{selectedComplaint.anonymity ? 'Anonymous' : selectedComplaint.student_id.name}</Typography> 
                            <Typography variant="body1" component="div">{selectedComplaint.complaint_details}</Typography> 
                        </div>
                        <div className='complaint-chat'>
                            {
                                selectedComplaintChat.map(chat => 
                                    <div className={chat.sender_id._id === decodeSessionStorage()._id || chat.sender_id === decodeSessionStorage()._id ? 'message right' : 'message left'} key={chat._id}>
                                        <div className={chat.sender_id._id === decodeSessionStorage()._id || chat.sender_id === decodeSessionStorage()._id ? 'chat-bubble border-box-right' : 'chat-bubble border-box-left'}>
                                            { chat.sender_id._id === decodeSessionStorage()._id || chat.sender_id === decodeSessionStorage()._id ? 
                                                null : 
                                                <Typography variant="subtitle2" sx={{color: chat.sender_id.role === 'Student' ? '#607EAA' : '#FDA769'}}>{selectedComplaint.anonymity ? 'Anonymous' : chat.sender_id.name}</Typography> }
                                            <Typography variant="body2">{chat.text}</Typography> 
                                        </div>
                                        <Typography variant='caption'>{moment(chat.date).calendar()}</Typography>
                                    </div>
                                )
                            }
                            <div id='scroll-to-end'></div>
                        </div>
                    </div>
                    <div className='chat-actions'>
                        {decodeSessionStorage().role === 'Teacher' ? <Button variant="contained" color="error" disableElevation sx={{fontSize: '24px'}} onClick={onReport}><TbMessageReport /></Button> : null}
                        <Button variant="contained" color="success" disableElevation sx={{fontSize: '24px'}} onClick={onMarkAsResolved}><IoIosCheckmarkCircleOutline /></Button>
                        <StyledInputBase 
                            placeholder="Type a Message"
                            inputProps={{ 'aria-label': 'search' }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button variant="contained" disableElevation sx={{fontSize: '24px'}} onClick={onSendMessage}><AiOutlineSend /></Button>
                    </div>
                </React.Fragment>
                :
                <div className='empty-complaint'>
                    <div className='image-container'>
                        <img src={emptyMessageIllustration} alt='empty' />
                    </div>
                    <h1 className='heading'>FeedBank</h1>
                    <p className='text'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus eleifend neque ut mattis. Vestibulum lacinia 
                    turpis nisi, eget fringilla quam pellentesque sit amet. Duis sapien neque, fermentum varius leo ut, feugiat molestie eros. 
                    </p>
                </div>
            }
        </div>
    )
}

export default ChatSection