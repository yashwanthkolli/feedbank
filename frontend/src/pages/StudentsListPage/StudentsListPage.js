import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import axios from 'axios'
import { decodeSessionStorage } from '../../helpers/helpers';
import {  AiOutlineSearch } from 'react-icons/ai'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './StudentsListPage.Styles.scss'
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';

const PaperComponent = styled(Paper)(( ) => ({
    width: '80%',
    padding: '30px',
    height: 'calc(100vh - 200px)'
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

const columns = [
    {
        name: 'Username',
        selector: row => row.username,
        sortable: true,
    }, 
    {
        name: 'Name',
        selector: row => row.name,
        sortable: true,
    }, 
    {
        name: 'Email',
        selector: row => row.contact.email,
    }, 
    {
        name: 'Phone Number',
        selector: row => row.contact.phone_number,
    },  
    {
        name: 'Number of Strikes',
        selector: row => row.number_of_strikes,
        sortable: true,
    }
]

const StudentsListPage = () => {
    const [students, setStudents] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:5000/user/get/school/${decodeSessionStorage().school_id}`)
        .then(res => setStudents(res.data))
        .catch(e => toast.error('Unable to fetch details!'))
    })

    const filteredStudents = students.filter(student => student.name.includes(search) || student.username.includes(search))

    return (
        <PaperComponent>
            <div className='students-section'>
                <div className='title'>
                    <Typography variant='h5' sx={{marginBottom: '30px'}}>Students</Typography>
                </div>
                <div className='search'>
                    <ThemeProvider theme={theme}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <AiOutlineSearch style={{margin: '5px 10px'}} />
                            <TextField id="input-with-sx" label="Search" variant="standard" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </Box>
                    </ThemeProvider>
                </div>
            </div>
            {
                students ? 
                <DataTable
                    columns={columns}
                    data={filteredStudents}
                    pagination
                    paginationComponentOptions={{noRowsPerPage: true}}
                    paginationPerPage={7}
                />
                : <div>Loading...</div>
            }
        </PaperComponent>
    )
}

export default StudentsListPage