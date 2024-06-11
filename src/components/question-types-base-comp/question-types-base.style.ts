import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Grid,
  TextareaAutosize,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { theme } from "@/constants/theme";

interface StyledContentBoxProps {
  shouldScroll?: boolean;
}

export const StyledCardHeading = styled(Typography)(({ theme }) => ({
  fontSize: "19px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "140%",
  color: theme.palette.secondary.main,
  wordBreak: "break-word",
  padding: "0rem 2rem",
}));

export const StyledContentBox = styled(Box)<StyledContentBoxProps>(
  ({ shouldScroll }) => ({
    padding: "2rem 0rem 0rem 0rem",
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

export const StyledHeadingBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  gap: "1.5rem",
  flex: "1 0 0",
}));

export const StyledCardQuestionHeadingCode = styled(Typography)(
  ({ theme }) => ({
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "140%",
    color: theme.palette.grey[800],
    wordBreak: "break-word",
    padding: "0px 10px 16px 10px",
    alignItems: "center",
    gap: "8px",
    width: "15%",
  })
);

export const StyledCardQuestionHeadingTitle = styled(Typography)(({}) => ({
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "140%",
  // color: theme.palette.grey[800],
  wordBreak: "break-word",
  // padding: "0px 15px 0px 10px",
  alignItems: "center",
  gap: "8px",
  fontFamily: "Arial, sans-serif",
  letterSpacing: "0.5px",
  color: "black",
  // width: "100%",
}));

export const StyledCardQuestionText = styled(Typography)(({}) => ({
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "140%",
  color: "black",
  fontFamily: "Arial, sans-serif",
  letterSpacing: "0.5px",
  wordBreak: "break-word",
  // padding: "0px 10px 0px 10px",
  alignItems: "center",
  gap: "8px",

  "& .ck-editor__editable": {
    // maxWidth: "600px",
    // maxWidth: "calc(100vw - 584px) !important",
    padding: "0 30px !important",
    
    // maxHeight: "100px",
  },
}));

export const StyledLabel = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  fontStyle: "normal",
  width: "100%",
  fontWeight: 600,
  lineHeight: "140%",
  color: theme.palette.grey[600],
  padding: "0px 0px",
  gap: "8px",
  paddingTop: "1rem",
  // paddingBottom: "10px",
}));

export const StyledWrapper = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  gap: "10px",
  flexDirection: "column",
}));

export const StyledWrapperEnd = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  marginTop: "15px",
}));

export const StyledLabelBold = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "140%",
  color: theme.palette.primary.dark,
  // padding: "0px 10px",
  gap: "8px",
  marginTop: "20px",
}));

export const MDInput = styled(TextField)(({}) => ({
  width: "100%",
  boxSizing: "border-box",
  "& label": {},
  "& .MuiInputBase-input": {
    color: theme.palette.grey[800],
    fontWeight: 400,
    fontSize: "1rem",
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
    // background: "#f5f5f5",
    minHeight: "2.5rem",
  },
  "& label.Mui-focused": {
    color: theme.palette.grey[500],
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[800],
  },
  "&.Mui-focused .MuiFormLabel-root": {},
  "& .MuiInputBase-input::placeholder": {
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: "140%",
    color: theme.palette.grey[500],
  },
}));

export const MDTextarea = styled(TextareaAutosize)(({}) => ({
  width: "100%",
  boxSizing: "border-box",
  resize: "vertical",
  color: theme.palette.grey[800],
  fontWeight: 400,
  fontSize: "1rem",
  lineHeight: "140%",
  fontFamily: "Inter, sans-serif",
  borderRadius: "0.5rem",
  minHeight: "2.5rem",
  padding: "10px",
  "&::placeholder": {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "140%",
    color: theme.palette.grey[500],
  },
}));

export const ItalicText = styled("i")(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const CardMenu = styled(Menu)(({}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "0.5rem",
  borderRadius: "0.5rem",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow:
      "0rem 0rem 0.125rem rgba(145, 158, 171, 0.25), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.25)",
  },
}));

export const CardSubMenu = styled(MenuItem)(({}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0.25rem 1rem",
  fontSize: "12px",
  height: "2rem",
  opacity: 0.8,
  width: "200px",
  borderRadius: "0.5rem",
}));

export const SelectQuestionTypeGrid = styled(Grid)(() => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
}));

export const ErrorBox = styled(Box)(({}) => ({
  fontSize: "12px",
  color: theme.palette.error.main,
}));

export const StyleGridSubContainer = styled(Grid)(() => ({
  display: "flex",
}));
