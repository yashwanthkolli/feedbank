import { Avatar, Divider, Paper, Typography, DialogContentText, DialogActions } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './ProfilePage.Styles.scss'
import { styled } from '@mui/material/styles';
import { decodeSessionStorage } from '../../helpers/helpers';
import CustomButton from '../../components/CustomButton/CustomButton'
import CustomDialogue from '../../components/CustomDialogue/CustomDialogue';
import CustomInput from '../../components/CustomInput/CustomInput';
import { toast } from 'react-toastify';

const PaperComponent = styled(Paper)(( ) => ({
    width: '80%',
    position: 'absolute', 
    top: '120px'
}));

const avatarStyles = {
    width: 152, 
    height: 152, 
    bgcolor: '#607EAA', 
    my: 1, 
    fontSize: 36, 
    position: 'absolute', 
    top: '-10%',
    transform: 'translateX(50%)'
}

const ProfilePage = () => {
    const [user, setUser] = useState({})
    const [dialogueOpen, setDialogueOpen] = useState(false)
    const [newEmail, setNewEmail] = useState()
    const [newPhone, setNewPhone] = useState()
    const [newPassword, setNewPassword] = useState('')
    const [password, setPassword] = useState('')
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/user/get/${decodeSessionStorage()._id}`)
        .then(res => {
            setUser(res.data)
            setNewEmail(res.data.contact.email)
            setNewPhone(res.data.contact.phone_number)
        })
        .catch(e => toast.error('Unable to fetch data'))
    }, [update])

    const onCancel = () => {
        setNewEmail(user.contact.email)
        setNewPhone(user.contact.phone_number)
        setNewPassword('')
        setDialogueOpen(false)
    }

    const onSave = async () => {
        if(newEmail !== user.contact.email || newPhone !== user.contact.phone_number) {
            await axios.post(`${process.env.REACT_APP_API}/user/update/contact`, {
                    username: user.username, 
                    password, 
                    email: newEmail,
                    phone_number: newPhone
                }
            )
            .then(res => {
                setUpdate(!update)
                setDialogueOpen(false)
                toast.success('ContactDetails Changed')
            })
            .catch(e => toast.error('Failed to Update Contact Details'))
        }
        if(newPassword){
            await axios.post(`${process.env.REACT_APP_API}/user/update/password`, {
                    username: user.username, 
                    password, 
                    newPassword
                }
            )
            .then(res => {
                setNewPassword('')
                setDialogueOpen(false)
                toast.success('Password Changed')
            })
            .catch(e => toast.error('Failed to Update Contact Details'))
        } 
    }

    return (
        <PaperComponent>
        {
            user.name && user.role && user.username ? 
            <div className='profile-page'>
                <div className='avatar-container'>
                    <Avatar sx={avatarStyles}>
                    {
                        user.name.split(' ').length > 1 ? 
                            `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`
                        :
                            user.name[0]
                    }
                    </Avatar>
                </div>
                <div className='heading'>
                    <Typography variant='h4'>{user.name}</Typography>
                    <Typography variant='h5'>{user.role}</Typography>
                </div>
                <Divider sx={{mb: '40px', width:'100%'}} />
                <div className='content'>
                    <div className='profile-element'>
                        <div className='label'>Username</div>
                        <div className='value'>{user.username}</div>
                    </div>
                    <div className='profile-element'>
                        <div className='label'>Email</div>
                        <div className='value'>
                            <CustomInput fullWidth value={newEmail} size='small' onChange={(e) => setNewEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className='profile-element'>
                        <div className='label'>Mobile No.</div>
                        <div className='value'>
                            <CustomInput fullWidth value={newPhone} size='small' onChange={(e) => setNewPhone(e.target.value)} />
                        </div>
                    </div>
                    <div className='profile-element'>
                        <div className='label'>School</div>
                        <div className='value'>{user.school_id.name}</div>
                    </div>
                    <div className='profile-element'>
                        <div className='label'>Change Password</div>
                        <div className='value'>
                            <CustomInput fullWidth value={newPassword} size='small' type='password' onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                    </div>
                </div>
                <Divider sx={{mv: '20px', width:'100%'}} />
                <div className='buttons'>
                    <CustomButton varient='outlined' label='Cancel' onclick={onCancel} />
                    <CustomButton varient='contained' label='Save'  onclick={() => setDialogueOpen(true)} />
                </div>
            </div>
            :
            <div>Loading...</div>
        }

            <CustomDialogue
                    open={dialogueOpen}
                    onclose={() => setDialogueOpen(false)}
                    title='Update Profile?'
                    maxWidth='sm'
                    content={
                        <React.Fragment>
                            <DialogContentText>
                                To edit your profile, please enter your password here. 
                            </DialogContentText>
                            <div className='password-input-container'>
                                <CustomInput
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <DialogActions>
                                <CustomButton label='Cancel' onclick={onCancel} />
                                <CustomButton label='Save' onclick={onSave} />
                            </DialogActions>
                        </React.Fragment>
                    }
            />
        </PaperComponent>
    )
}

export default ProfilePage