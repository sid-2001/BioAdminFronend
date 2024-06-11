import { styled } from "@mui/material/styles";
import { Box, Typography, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { theme } from "@/constants/theme";

interface StyledContentBoxProps {
  shouldScroll?: boolean;
}

export const StyledOptionsBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "start",
  flexDirection: "row",
  width: "100%",
  gap: "2rem",
  boxSizing: "border-box",
  marginTop: "1rem",
  padding: "0rem   0.7rem",
}));

export const StyledCardAnswerCode = styled(Box)(({ theme }) => ({
  fontSize: "14px",
  fontStyle: "normal",
  lineHeight: "140%",
  color: theme.palette.grey[600],
  wordBreak: "break-word",
}));

export const StyledCardAnswerText = styled(Box)(({ theme }) => ({
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "140%",
  color: theme.palette.grey[800],
  wordBreak: "break-word",
}));

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

export const StyledEditOptionsBox = styled(Box)(({}) => ({
    display: "flex",
  alignItems: "center",
  flexDirection: "row",
  // justifyContent: "space-between",
  width: "100%",
  boxSizing: "border-box",
  padding: "0rem  0rem",
  marginBottom: "0rem",
}));

export const MDInput = styled(TextField)(({}) => ({
  width: "50%",
  boxSizing: "border-box",
  "& label": {},
  "& .MuiInputBase-input": {
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
    fontSize: "0.8rem",
    lineHeight: "100%",
    color: theme.palette.grey[500],
  },
}));

export const ErrorBox = styled(Box)(({}) => ({
  fontSize: "12px",
  color: theme.palette.error.main,
  // marginLeft: "4rem  "
}));

export const StyledTextBox = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "column",
  // marginLeft: "4rem "
}));

export const MdBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexDirection: "row",
  gap: "10px",
  padding: "2rem 1rem 1rem 2rem",
  // position: "fixed",
  right: "40px",
  background: "white",
  bottom: "10px",
}));

export const BoxWrapper = styled(Box)(({}) => ({
  position: "relative",
}));

export const StyledTypeText = styled(Typography)(({}) => ({
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "140%",
  color: "black",
  padding: "0px 10px",
}));

export const StyledRowWrapper = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

export const StyledRowGapWrapper = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "1rem",
  paddingLeft: "32px",
}));

export const StyledGridContainer = styled(Grid)(() => ({
  marginBottom: "1rem",
  paddingLeft: "10px",
  paddingRight: "10px",
}));

export const StyledGridContainerCount = styled(Grid)(() => ({
  display: "flex",
  alignItems: "center",
}));