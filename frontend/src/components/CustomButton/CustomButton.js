import { Button, createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import './CustomButton.Styles.scss'

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

const CustomButton = ({ onclick, label, varient }) => {
    return (
        <ThemeProvider theme={theme}>
            <Button variant={varient} disableElevation onClick={onclick}>{label}</Button>
        </ThemeProvider>
    )
}

export default CustomButton