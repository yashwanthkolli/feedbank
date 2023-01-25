import React, { useState, useEffect } from 'react'
import { Paper, Typography, DialogContentText, DialogActions, Stack, FormControlLabel, Switch } from '@mui/material'
import { styled } from '@mui/material/styles';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { toast } from 'react-toastify';
import CustomDialogue from '../../components/CustomDialogue/CustomDialogue';
import axios from 'axios';
import { decodeSessionStorage } from '../../helpers/helpers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './CreateComplaint.Styles.scss'

const PaperComponent = styled(Paper)(( ) => ({
    width: '80%',
    padding: '30px 5%',
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#1C3879',
        }
    },
    typography: {
        fontFamily: "'Open Sans', sans-serif",
    }
});

const CreateComplaint = () => {
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [anonymity, setAnonymity] = useState(false)
    const [dialogueOpen, setDialogueOpen] = useState(false)

    const onSave = () => {
        if(subject && body){
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
        await axios.post('http://localhost:5000/complaint/register', {
                    subject, 
                    complaint_details: body, 
                    student_id: decodeSessionStorage()._id,
                    school_id: decodeSessionStorage().school_id,
                    anonymity
                },
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
            )
            .then(res => {
                toast.update(id, { 
                    render: "Complaint Posted!", 
                    type: "success", 
                    isLoading: false,
                    autoClose: 2000
                });
                setDialogueOpen(false)
            })
            .catch(e => {
                toast.update(id, { 
                    render: "Unable to post Complaint!", 
                    type: "error", 
                    isLoading: false,
                    autoClose: 5000
                });
                setDialogueOpen(false)
            })
    }

    return (
        <PaperComponent>
            <Typography variant='h5'>Register a Complaint</Typography>
            <div className='input-container'>
                <CustomInput
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
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
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <CustomButton varient='contained' label='Post' onclick={onSave} />
                <ThemeProvider theme={theme}>
                    <FormControlLabel control={<Switch checked={anonymity} onChange={(e) => setAnonymity(e.target.checked)} />} label="Post Anonymously" />
                </ThemeProvider>
            </Stack>

            <CustomDialogue
                    open={dialogueOpen}
                    onclose={() => setDialogueOpen(false)}
                    title='Create Notification?'
                    maxWidth='sm'
                    content={
                        <React.Fragment>
                            <DialogContentText>
                                Please confirm to post the complaint.
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

export default CreateComplaint