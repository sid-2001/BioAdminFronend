import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";


export const QuestionNameInput = styled(TextField)(({ theme }) => ({
    width: "50%",
    boxSizing: "border-box",
    "& label": {},
    "& .MuiInputBase-input": {
        border: "none",
        color: theme.palette.grey[800],
        fontWeight: 400,
        fontSize: "0.8rem",
        lineHeight: "140%",
        fontFamily: "Inter, sans-serif",
    },
    "& .MuiFormLabel-root": {
        marginTop: "0.1875rem",
        color: theme.palette.grey[500],
        height: "0.9375rem",
        fontWeight: 400,
        fontSize: "0.75rem",
        lineHeight: "0.9375rem",
        letterSpacing: "0.02em",
        width: "100%",
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "0.5rem",
        width: "100%",
        minHeight: "1rem",
        // border: "none",  // Add this line
        border: "2px solid", // Add focus border
        borderColor: "#ffffff",
        "&:hover": {
            border: "2px solid", // Add hover border
            borderColor: theme.palette.grey[300], // Set hover border color
        },
        "&.Mui-focused": {
            border: "2px solid", // Add focus border
            borderColor: theme.palette.primary.main, // Set focus border color
        },
    },
    "& .MuiOutlinedInput-notchedOutline": {
        border: "none", // Remove default border
    },
    "& label.Mui-focused": {
        color: theme.palette.grey[500],
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "none", // Remove border on focus
    },
    "&.Mui-focused .MuiFormLabel-root": {},
    "& .MuiInputBase-input::placeholder": {
        fontWeight: 400,
        fontSize: "0.8rem",
        lineHeight: "100%",
        color: theme.palette.grey[500],
    },
}));
