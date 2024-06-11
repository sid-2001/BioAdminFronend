import { TableRow, Typography, styled } from "@mui/material";
import TableCell from "@mui/material/TableCell";

const StyledHeadTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "14px",
  lineHeight: 0,
  color: theme.palette.grey[600],
  paddingBottom: "5px",
  fontWeight: 700,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "400",
  fontSize: 14,
  lineHeight: "140%",
  color: theme.palette.grey[800],
  border: "none",
  borderBottom: "1px solid #F4F6F8",
}));

const MoneyBox = styled("div")(({ theme }) => ({
  boxSizing: "border-box",
  width: "4.0625rem",
  height: "1.75rem",
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: "0.5rem",
  padding: "0.25rem 0.5rem",
  fontWeight: "400",
  fontSize: 14,
  lineHeight: "140%",
  color: theme.palette.grey[800],
  display: "flex",
  alignItems: "center",
}));

const DisabledTableRow = styled(TableRow)(({}) => ({
  backgroundColor: "#f4f6f8",
  opacity: 0.5,
  pointerEvents: "none",
}));

const StyledModalTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "19px",
  lineHeight: "140%",
  color: theme.palette.grey[800],
}));

const StyledAddRow = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "140%",
  color: theme.palette.secondary.main,
}));

export {
  StyledHeadTableCell,
  MoneyBox,
  StyledTableCell,
  DisabledTableRow,
  StyledModalTypography,
  StyledAddRow,
};
