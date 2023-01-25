import React, { useState, useEffect } from 'react'
import { Divider, Paper, Typography, DialogContentText, DialogActions, Pagination, Stack, List, ListItem, ListItemText, CssBaseline, IconButton, AppBar, InputBase, Box, Avatar, ListItemAvatar } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {  AiOutlineSearch, AiFillQuestionCircle, AiOutlineQuestionCircle } from 'react-icons/ai'
import InfiniteScroll from "react-infinite-scroll-component";
import './ComplaintsSection.Styles.scss'
import CustomDialogue from '../CustomDialogue/CustomDialogue';
import CustomButton from '../CustomButton/CustomButton';
import ChatSection from '../ChatSection/ChatSection';
import { decodeSessionStorage } from '../../helpers/helpers';

const PaperComponent = styled(Paper)(( ) => ({
    width: '95%',
    height: 'calc(100vh - 150px)'
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

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.1),
    },
    margin: '10px 20px',
    width: '100%'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%'
    },
}));

const ComplaintSection = ({APIurl, ListItemLink}) => {
    const [complaints, setComplaints] = useState([])
    const [maxComplaints, setMaxComplaints] = useState(false)
    const [viewUnresolved, setViewUnresolved] = useState(false)
    const [search, setSearch] = useState('')
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        axios.post(
            APIurl, 
            { offset: 0 },
            { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        )
        .then(res => {
            setComplaints(res.data)
        })
        .catch(err => {
            console.log(err)
            toast.error('Unable to fetch complaints')
        })
    }, [update])

    const fetchMoreComplaints = async() => {
        await axios.post(
            APIurl, 
            { offset: complaints.length },
            { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        )
        .then(res => {
            if(res.data.length !== 0 ) return setComplaints([...complaints, ...res.data]);
            setMaxComplaints(true)
        })
        .catch(err => {
            toast.error('Unable to fetch complaints')
        })
    }
    let filteredComplaints = complaints.filter(comp => comp.subject.includes(search) || (!comp.anonymity ? comp.student_id.name.includes(search) : 'Anonymous'.includes(search)))
    filteredComplaints = viewUnresolved ? filteredComplaints.filter(comp => comp.resolved === false) : filteredComplaints

    return (
        <PaperComponent>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className='complaints-page'>
                    <div className='complaints-list'>
                        <AppBar position='static'>
                            <Stack 
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                                sx={{ paddingY: 1, paddingX: 3 }}
                            >
                                <Typography variant="h6" component="div">Complaints</Typography>
                                <IconButton color="inherit" onClick={() => setViewUnresolved(!viewUnresolved)}>
                                    { viewUnresolved ? <AiFillQuestionCircle /> : <AiOutlineQuestionCircle /> }
                                </IconButton>
                            </Stack>
                        </AppBar>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Search>
                                <SearchIconWrapper>
                                    <AiOutlineSearch />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Search>
                        </Box>
                        <List id='complaints-list' sx={{ mb: 2, pt: 0 }} style={{maxHeight: '80%', overflow: 'auto'}}>
                            <InfiniteScroll
                                dataLength={complaints.length}
                                next={fetchMoreComplaints}
                                hasMore={!maxComplaints}
                                loader={<Typography variant='h6' align='center'>Loading...</Typography>}
                                scrollableTarget="complaints-list"
                            >
                            {filteredComplaints.map((complaint) => (
                                <Link to={ListItemLink+complaint._id} key={complaint._id}>
                                    <ListItem button sx={{bgcolor: complaint.resolved ? '#1bb21ea3' : 'auto'}}>
                                        <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: complaint.anonymity ? 'grey' : '#607EAA' }}>
                                            {
                                                complaint.anonymity ? 
                                                    'A' 
                                                : 
                                                    complaint.student_id.name.split(' ').length > 1 ? 
                                                        `${complaint.student_id.name.split(' ')[0][0]}${complaint.student_id.name.split(' ')[1][0]}`
                                                    :
                                                        complaint.student_id.name[0]
                                            }
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={complaint.anonymity ? 'Anonymous' : complaint.student_id.name} secondary={complaint.subject} />
                                        <div style={{textAlign: 'right'}}>
                                            <Typography variant='caption'>{moment(complaint.date).calendar()}</Typography><br />
                                            <Typography variant='caption'>{complaint.resolved ? 'Resolved' : ''}</Typography>
                                        </div>
                                    </ListItem>
                                </Link>
                            ))}
                            </InfiniteScroll>
                        </List>
                    </div>
                    <ChatSection setUpdate={setUpdate} update={update} />
                </div>
            </ThemeProvider>
        </PaperComponent>
    )
}

export default ComplaintSection