import { styled } from "@mui/material/styles";
import { Box, Button, Stack } from "@mui/material";

export const ThreadsList = styled(Box)`
  display: "flex";
  flex: "1";
  max-width: "331px";
  padding: "24px";
  flex-direction: "column";
  align-items: "flex-start";
  gap: "40px";
  border-radius: "12px";
  background: "red";
`;

export const ResolvedBtn = styled(Button)(({}) => ({
  padding: "0px 8px",
  borderRadius: "15px",
  background: "#EBFFEC",
  color: "#0E6E11",
  fontSize: "12px",
  fontWeight: "400",
  border: "1px solid transparent",

  "&:hover": {
    border: "1px solid var(--Others-Dark-Green, #0E6E11)",
    background: "#A8FBAC",
  },
  "&.active": {
    border: "1px solid var(--Others-Dark-Green, #0E6E11)",
    background: "#A8FBAC",
  },
}));

export const UnResolvedBtn = styled(Button)(({}) => ({
  padding: "0px 8px",
  borderRadius: "15px",
  background: "#EBFAFF",
  color: "#222AE0",
  fontSize: "12px",
  fontWeight: "400",
  border: "1px solid transparent",

  "&:hover": {
    border: "1px solid var(--Others-Dark-Green, #222AE0)",
    background: "#A8C9FB",
  },
  "&.active": {
    border: "1px solid var(--Others-Dark-Green, #222AE0)",
    background: "#A8C9FB",
  },
}));

export const StyledContainer = styled(Stack)(({}) => ({
  flex: 1,
  padding: "0.3125rem 1rem",
  borderRadius: "4px",

  "& *": {
    border: "none !important",
    outline: "none !important",
    boxShadow: "none !important",
  },

  "& .ck-editor": {
    maxWidth: "calc(100vw - 670px) !important"
  },

  "& .ck-editor .ck-insert-table-dropdown-grid-box": {
    border: "1px solid black !important"
  },

  "& .ck-editor__editable": {
    // maxWidth: "600px",
    maxWidth: "calc(100vw - 670px) !important",
    padding: "0 30px !important",
    maxHeight: "100px",
  },

  "& .ck-editor__editable table td": {
    border: "1px solid black !important"
  },
  // "@media(min-width: 1048px)": {
  //   "& .ck-editor__editable": {
  //     maxWidth: "820px",
  //   },
  // },

  // "@media(min-width: 1390px)": {
  //   "& .ck-editor__editable": {
  //     maxWidth: "880px",
  //   },
  // },

  // "@media(min-width: 1512px)": {
  //   "& .ck-editor__editable": {
  //     maxWidth: "950px",
  //   },
  // },
}));

// 1048 : 600
// 1366 : 820
// 1440 : 880
// 1512: 950
