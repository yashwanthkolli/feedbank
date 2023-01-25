import { createTheme, TextField, ThemeProvider } from '@mui/material'
import React from 'react'
import './CustomInput.Styles.scss'

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

const CustomInput = ({value, onChange, label, fullWidth, size, type, multiline, rows}) => {
    return (
        <ThemeProvider theme={theme}>
            <TextField variant="outlined" fullWidth={fullWidth} value={value} onChange={onChange} label={label} size={size} type={type} multiline={multiline} rows={rows} />
        </ThemeProvider>
    )
}

export default CustomInput