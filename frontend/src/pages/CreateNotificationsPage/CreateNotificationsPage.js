import React, { useState } from 'react'
import { Paper, Typography, DialogContentText, DialogActions } from '@mui/material'
import { styled } from '@mui/material/styles';
import './CreateNotificationsPage.Styles.scss'
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { toast } from 'react-toastify';
import CustomDialogue from '../../components/CustomDialogue/CustomDialogue';
import axios from 'axios';
import { decodeSessionStorage } from '../../helpers/helpers';

const PaperComponent = styled(Paper)(( ) => ({
    width: '80%',
    padding: '30px 5%',
}));

const CreateNotificationsPage = () => {
    const [heading, setHeading] = useState('')
    const [body, setBody] = useState('')
    const [dialogueOpen, setDialogueOpen] = useState(false)

    const onSave = () => {
        if(heading && body){
            setDialogueOpen(true)
        } else {
            toast.error('Subject and body cannot be empty!')
        }
    }

    const onCancel = () => {
        setDialogueOpen(false)
        setBody('')
    }

    const onConfirm = async () => {
        const id = toast.loading("Please wait...")
        await axios.post('http://localhost:5000/notification/register', {
                    heading, 
                    body, 
                    school_id: decodeSessionStorage().school_id
                },
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
            )
            .then(res => {
                toast.update(id, { 
                    render: "Notification Created!", 
                    type: "success", 
                    isLoading: false,
                    autoClose: 2000
                });
                setDialogueOpen(false)
            })
            .catch(e => {
                toast.update(id, { 
                    render: "Unable to create Notification!", 
                    type: "error", 
                    isLoading: false,
                    autoClose: 5000
                });
                setDialogueOpen(false)
            })
    }

    return (
        <PaperComponent>
            <Typography variant='h5'>Create a New Notification</Typography>
            <div className='input-container'>
                <CustomInput
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    label='Subject'
                    fullWidth
                    type='text'
                />
            </div>
            <div className='input-container'>
                <CustomInput
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    label='Body'
                    fullWidth
                    type='text'
                    multiline
                    rows={10}
                />
            </div>
            <div className='button-container'>
                <CustomButton varient='contained' label='Save' onclick={onSave} />
            </div>

            <CustomDialogue
                    open={dialogueOpen}
                    onclose={() => setDialogueOpen(false)}
                    title='Create Notification?'
                    maxWidth='sm'
                    content={
                        <React.Fragment>
                            <DialogContentText>
                                Are you sure you want to post this complaint?
                            </DialogContentText>
                            <DialogActions>
                                <CustomButton label='Cancel' onclick={onCancel} />
                                <CustomButton label='Confirm' onclick={onConfirm} />
                            </DialogActions>
                        </React.Fragment>
                    }
            />
        </PaperComponent>
    )
}

export default CreateNotificationsPage