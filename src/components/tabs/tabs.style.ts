import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiButtonBase-root": {
    textTransform: "none",
    margin: "0 0.2rem 0 0",
    fontSize: "0.8rem",
    fontWeight: 400,
    lineHeight: "140%",
    color: theme.palette.grey[600],
  },
  "& .MuiButtonBase-root:last-child": {
    margin: 0,
  },
  "& .Mui-selected": {
    color: `${theme.palette.grey[800]} !important`,
    fontWeight: 700,
  },
}));
