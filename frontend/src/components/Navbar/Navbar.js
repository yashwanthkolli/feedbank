import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import {HiMenuAlt1} from 'react-icons/hi'
import './Navbar.Styles.scss'
import { ThemeProvider } from '@emotion/react';
import { createTheme, Divider, List, Typography, ListItem, ListItemButton, ListItemText, ListItemIcon, Icon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { decodeSessionStorage, signout } from '../../helpers/helpers';
import { toast } from 'react-toastify';
import { FaRegUserCircle, FaUsers } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import { MdNotificationsActive, MdOutlineNotificationAdd } from 'react-icons/md';
import { HiOutlineDocumentDuplicate, HiOutlineDocumentAdd } from 'react-icons/hi';

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

const Navbar = () => {
    const navigate = useNavigate()
    const user = decodeSessionStorage();

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const logout = () => {
        toast.error('Logged out!')
        signout()
        navigate('/login')
    }

    const teacherNav = [
        { id: 1,path: `/profile`, text: 'Profile', icon: FaRegUserCircle },
        { id: 2,path: `/`, text: 'Home', icon: AiOutlineHome },
        { id: 3,path: `/notifications`, text: 'Notifications', icon: MdNotificationsActive },
        { id: 4,path: `/complaints`, text: 'Complaints', icon: HiOutlineDocumentDuplicate },
        { id: 5,path: `/create/notification`, text: 'Create Notification', icon: MdOutlineNotificationAdd },
        { id: 6,path: `/students`, text: 'Students', icon: FaUsers }
    ]

    const studentNav = [
        { id: 1,path: `/profile`, text: 'Profile', icon: FaRegUserCircle },
        { id: 2,path: `/`, text: 'Home', icon: AiOutlineHome },
        { id: 3,path: `/my-notifications`, text: 'Notifications', icon: MdNotificationsActive },
        { id: 4,path: `/my-complaints`, text: 'My Complaints', icon: HiOutlineDocumentDuplicate },
        { id: 5,path: `/create/complaint`, text: 'Create Complaint', icon: HiOutlineDocumentAdd }
    ]

    const adminNav = [
        { id: 1,path: `/profile`, text: 'Profile', icon: FaRegUserCircle },
        { id: 2,path: `/home`, text: 'Home', icon: AiOutlineHome },
        { id: 3,path: `/schools`, text: 'Notifications', icon: MdNotificationsActive }
    ]

    let roleNavbar;
    switch(user.role){
        case 'Teacher':
            roleNavbar = teacherNav
            break;
        case 'Student':
            roleNavbar = studentNav
            break;
        case 'Staff':
            roleNavbar = adminNav
            break;
        default:
            break;
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <HiMenuAlt1 className='icon' />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to='/' className='heading-primary'>FeedBank</Link>
                    </Typography>
                    <Button color="inherit" onClick={logout}>LogOut</Button>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                anchor="left"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpen={() => setSidebarOpen(true)}
            >
                <div className='sidebar'>
                    <Avatar sx={{ width: 96, height: 96, bgcolor: '#607EAA', my: 1 }}>
                        {
                            user.name.split(' ').length > 1 ? 
                                `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`
                            :
                                user.name[0]
                        }
                    </Avatar>
                    <Typography variant='h6'>
                        {user.name}
                    </Typography>
                    <Typography variant='subtitle2'>
                        {user.role}
                    </Typography>
                    <Divider sx={{my: 3, width:'80%'}} />

                    <List>
                        {
                            roleNavbar.map((element) => (
                                <Link to={element.path} key={element.id} onClick={() => setSidebarOpen(false)}>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon><Icon sx={{color: '#1C3879'}} component={element.icon} /></ListItemIcon>
                                            <ListItemText primary={element.text} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            ))
                        }
                    </List>
                </div>
            </SwipeableDrawer>
        </ThemeProvider>
    )
}

export default Navbar