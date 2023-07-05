import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import {  AiOutlineSearch, AiFillQuestionCircle, AiOutlineQuestionCircle } from 'react-icons/ai'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'
import './ViewComplaints.Styles.scss'
import axios from 'axios';
import { toast } from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";
import moment from 'moment';
import { Link } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import { decodeSessionStorage } from '../../../helpers/helpers';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const ViewComplaint = () => {
    const [complaints, setComplaints] = useState([])
    const [maxComplaints, setMaxComplaints] = useState(false)
    const [viewUnresolved, setViewUnresolved] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        axios.post(
            `${process.env.REACT_APP_API}/complaint/get/all/student/${decodeSessionStorage()._id}`, 
            { offset: 0 },
            { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        )
        .then(res => {
            setComplaints(res.data)
        })
        .catch(err => {
            toast.error('Unable to fetch complaints')
        })
    }, [])

    const fetchMoreComplaints = async() => {
        await axios.post(
            `${process.env.REACT_APP_API}/complaint/get/all/school/${decodeSessionStorage().school_id}`, 
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
        <div className='view-complaints'>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Paper sx={{ width: '100%', height: '100%' }}>
                    <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
                    Complaints
                    </Typography>
                    <List id='complaints-list' sx={{ mb: 2, pt: 0 }} style={{maxHeight: '80%', overflow: 'auto'}}>
                        <InfiniteScroll
                            dataLength={complaints.length}
                            next={fetchMoreComplaints}
                            hasMore={!maxComplaints}
                            loader={<Typography variant='h6' align='center'>Loading...</Typography>}
                            scrollableTarget="complaints-list"
                        >
                        {filteredComplaints.map((complaint) => (
                            <Link to={`/my-complaints/${complaint._id}`} key={complaint._id}>
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
                </Paper>
                <AppBar position="absolute" sx={{ top: 'auto', bottom: 0 }}>
                    <Toolbar>
                    <Link to='/my-complaints' style={{color: 'white'}}>
                        <IconButton color="inherit" aria-label="open drawer">
                            <HiOutlineDocumentDuplicate />
                        </IconButton>
                    </Link>
                    <Box sx={{ flexGrow: 1 }} />
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
                    <IconButton color="inherit" onClick={() => setViewUnresolved(!viewUnresolved)}>
                        { viewUnresolved ? <AiFillQuestionCircle /> : <AiOutlineQuestionCircle /> }
                    </IconButton>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </div>
    );
}

export default ViewComplaint;