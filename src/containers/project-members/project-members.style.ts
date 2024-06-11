import { Box, Typography, styled } from "@mui/material"
import TableCell from "@mui/material/TableCell"

export const DetailsBox = styled(Box)(({}) => ({
  boxSizing: "border-box",
  // maxWidth: "1584px",
  width: "100%",
  height: "calc(100vh - 232px)",
  padding: "1rem 2rem 2rem 2rem",
  // paddingBottom: "1rem",
  background: "#FFFFFF",
  borderRadius: "1rem",
  transition: "box-shadow 0.3s ease-in-out",
  marginBottom: "1rem",
  boxShadow:
    "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
  overflowX: "auto",
  // "&::-webkit-scrollbar": {
  //   width: "0.5em",
  // },
  // "&::-webkit-scrollbar-thumb": {
  //   backgroundColor: "transparent",
  // },
}))

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

const NameTag = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.1375rem",
  lineHeight: "140%",
  color: theme.palette.primary.main,
}))

const Avatar = styled(Box)(({ theme }) => ({
  width: "2.5rem",
  height: "2.5rem",
  background: theme.palette.grey[300],
  borderRadius: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  margin: "0.5rem 1.5rem",
}))

const StyledModalListName = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontStyle: "normal",
  fonteWight: 400,
  lineeiHght: "140%",
  color: theme.palette.grey[800],
}))

const StyledModalListRole = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontStyle: "normal",
  fonteWight: 400,
  lineeiHght: "140%",
  letterSpacing: "0.28px",
  color: theme.palette.grey[800],
}))

const StyledModalTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "19px",
  lineHeight: "140%",
  color: theme.palette.grey[800],
}))

const StyledAddRow = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "15px",
  lineHeight: "140%",
  color: theme.palette.primary.main,
}))

const AddTeamMember = styled(Typography)(({}) => ({
  fontSize: "19px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "140%",
  letterSpacing: "0.38px",
  color: "#033530",
}))

const StyledHeadTableCellMain = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "14px",
  // lineHeight: "140%",
  fontStyle: "normal",
  color: theme.palette.grey[600],
  paddingBottom: "5px",
  lineHeight: 0,
}))

export {
  StyledHeadTableCellMain,
  StyledHeadTableCell,
  StyledTableCell,
  NameTag,
  Avatar,
  StyledModalTypography,
  StyledAddRow,
  AddTeamMember,
  StyledModalListName,
  StyledModalListRole,
}
