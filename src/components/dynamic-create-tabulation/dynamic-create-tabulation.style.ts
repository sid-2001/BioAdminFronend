import { styled } from "@mui/material/styles";
import { Box, } from "@mui/material";


interface StyledContentBoxProps {
    shouldScroll?: boolean;
}


export const StyledContentBox = styled(Box)<StyledContentBoxProps>(
    ({ shouldScroll }) => ({
        // padding: "0rem 0rem 0rem 2rem",
        height: shouldScroll ? "calc(100vh - 400px)" : "auto",
        overflow: shouldScroll ? "auto" : "visible",
        scrollbarWidth: "none",
        msOverflowStyle: "none",

        "&::-webkit-scrollbar": {
            width: 0,
        },

        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgray",
            borderRadius: 4,
        },

        "&::-webkit-scrollbar-track": {
            backgroundColor: "lightgray",
            borderRadius: 4,
        },
    })
);

export const StyledCardAnswerText = styled(Box)(({ theme }) => ({
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "140%",
    color: theme.palette.grey[800],
    wordBreak: "break-word",
}));