import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    // color: theme.palette.grey[800],
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: "140%",
    fontFamily: "Inter, sans-serif",
  },
  "& .MuiFormLabel-root": {
    marginTop: "0.1875rem",
    // color: theme.palette.grey[500],
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
    minHeight: "2.5rem",
  },
  "& label.Mui-focused": {
    // color: theme.palette.grey[500],
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    // borderColor: theme.palette.grey[800],
  },
  "&.Mui-focused .MuiFormLabel-root": {},
  "& .MuiInputBase-input::placeholder": {
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: "140%",
    // color: theme.palette.grey[500],
  },
}));
