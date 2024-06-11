import { Box, TableRow, Typography, styled } from "@mui/material"
import TableCell from "@mui/material/TableCell"

const StyledHeadTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: 14,
  lineHeight: "140%",
  color: theme.palette.grey[600],
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "400",
  fontSize: 14,
  lineHeight: "140%",
  color: theme.palette.grey[800],
}))

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
}))

const DisabledTableRow = styled(TableRow)(() => ({
  backgroundColor: "#f4f6f8",
  opacity: 0.5,
  pointerEvents: "none",
}))

const StyledModalTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "19px",
  lineHeight: "140%",
  color: theme.palette.grey[800],
}))

const StyledAddRow = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "140%",
  color: theme.palette.secondary.main,
}))

const CenteredContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: "999",
}))

export const DetailsBox = styled(Box)(({}) => ({
  boxSizing: "border-box",
  maxWidth: "99rem",
  padding: "2rem",
  background: "#FFFFFF",
  borderRadius: "1rem",
  transition: "box-shadow 0.3s ease-in-out",

  // "&:hover": {
  boxShadow:
    "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
  // },
}))

export {
  StyledHeadTableCell,
  MoneyBox,
  StyledTableCell,
  DisabledTableRow,
  StyledModalTypography,
  StyledAddRow,
  CenteredContainer,
}
