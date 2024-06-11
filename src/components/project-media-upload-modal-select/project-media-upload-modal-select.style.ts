import { Box, styled, ImageListItem } from '@mui/material';


export const StyledBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.divider}`,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
}));

export const StyledAudioItem = styled(ImageListItem)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // height: '40px',
    // backgroundColor: theme.palette.background.paper,
    // boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    padding: theme.spacing(1)
}));