import { MenuItem } from "@mui/base";
import {
  InputLabel,
  ListItemText,
  OutlinedInput,
  Select,
  styled,
  Checkbox,
  Theme,
  SxProps,
} from "@mui/material";

export const StyledInputLabel = styled(InputLabel)<
  { theme: Theme } & SxProps<Theme>
>(({ theme }) => ({
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "15px",
  letterSpacing: "0.02em",
  color: theme.palette.grey[500],
  paddingLeft: "4px",
  paddingTop: "4px",
  "&.Mui-focused": {
    color: theme.palette.grey[500],
    paddingTop: "8px",
  },
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "140%",
  color: theme.palette.grey[800],
}));

export const StyledOutlinedInput = styled(OutlinedInput)(({}) => ({
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "red",
  },
}));

export const StyledListItemText = styled(ListItemText)(({}) => ({
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "140%",
  color: "#454F5B",
  "&.Mui-selected": {
    fontWeight: "700!important",
    fontSize: "14px!important",
    lineHeight: "140%!important",
    background: "#454F5B!important",
  },
}));

export const StyledMenuItem = styled(MenuItem)(({}) => ({
  "&.Mui-selected": {
    backgroundColor: "#F5F5F5 !important",
    fontWeight: "700 !important",
    fontSize: "14px !important",
    lineHeight: "140% !important",
    color: "#454F5B !important",
  },
}));

export const StyledCheckbox = styled(Checkbox)(({}) => ({
  color: "#000000",
}));
