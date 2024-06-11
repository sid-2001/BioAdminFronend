import { styled } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: "flex",
  maxWidth: "14.0625rem",
  margin: "0 auto",
  marginTop: "0.375rem",
  borderRadius: "2rem",

  " &.active .MuiListItemText-root": {
    maxWidth: "fit-content",
  },

  " &.active": {
    color: "#fff",
    boxShadow: "rgba(58, 53, 65, 0.42) 0px 4px 8px -4px",
    backgroundColor: theme.palette.primary.main,
  },

  " &.sublistActive": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  marginRight: "0.625rem",
  minWidth: "0",
  color: theme.palette.secondary.dark,
}));
