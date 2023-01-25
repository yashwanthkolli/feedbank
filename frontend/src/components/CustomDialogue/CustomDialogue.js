import { Dialog, DialogContent, DialogTitle, ThemeProvider, createTheme } from '@mui/material'
import React from 'react'

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

const CustomDialogue = ({open, onclose, title, maxwidth, content, fullWidth}) => {
    return (
        <ThemeProvider theme={theme}>
            <Dialog 
                open={open} 
                onClose={onclose}
                maxWidth={maxwidth}
                fullWidth={fullWidth}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {content}
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    )
}

export default CustomDialogue