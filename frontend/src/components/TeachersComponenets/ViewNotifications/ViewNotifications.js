import React, { useEffect, useState } from 'react';
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
import ListItemText from '@mui/material/ListItemText';
import {  AiOutlineSearch } from 'react-icons/ai'
import { MdOutlineNotificationsActive } from 'react-icons/md'
import { Link } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import './ViewNotifications.Styles.scss'
import { Divider } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
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

const ViewNotifications = () => {
    const [ notifications, setNotifications ] = useState([])
    const [ search, setSearch ] = useState('')

    useEffect(() => {
        axios.get(
            `http://localhost:5000/notification/get/weekly/${decodeSessionStorage().school_id}`, 
            { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        )
        .then(res => {
            setNotifications(res.data)
        })
        .catch(err => {
            toast.error('Unable to fetch notifications')
        })
    }, [])

    const filteredNotifications = notifications.filter(notification => notification.heading.includes(search))

    return (
        <div className='view-notifications'>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Paper sx={{ width: '100%', height: '100%' }}>
                    <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
                    Weekly Notifications
                    </Typography>
                    <List sx={{ mb: 2, pt: 0 }} style={{maxHeight: '100%', overflow: 'auto'}}>
                    {filteredNotifications.map((notification) => (
                        <Link to={`/notifications/${notification._id}`} key={notification._id}>
                            <ListItem button>
                                <ListItemText primary={notification.heading} secondary={notification.body} />
                                <div style={{textAlign: 'right', marginLeft: '30px', width: '30%'}}>
                                    <Typography variant='caption'>{moment(notification.date).calendar()}</Typography><br />
                                </div>
                            </ListItem>
                            <Divider />
                        </Link>
                    ))}
                    </List>
                </Paper>
                <AppBar position="absolute" sx={{ top: 'auto', bottom: 0 }}>
                    <Toolbar>
                    <Link to='/notifications' style={{color: 'white'}}>
                        <IconButton color="inherit" aria-label="open drawer">
                            <MdOutlineNotificationsActive />
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
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </div>
    );
}

export default ViewNotifications;