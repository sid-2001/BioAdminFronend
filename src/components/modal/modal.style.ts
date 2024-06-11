import styled from "styled-components";
import Typography from "@mui/material/Typography";
 
export const FlexContainer = styled.div(({}) => ({
  // display: "flex",
  // alignItems: "flex-start",
  gap: "1.25rem",
}));
 
export const TitleContainer = styled.div(({}) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1.25rem",
}));
 
export const Desc = styled(Typography)(({ theme }) => ({
  display: "block",
  fontWeight: 400,
  fontSize: "1.1875rem",
  lineHeight: "140%",
  color: theme?.palette?.grey[900] || "#161C24",
  marginTop: "3rem !important",
}));
 
 
export const PageTitleModal = styled(Typography)(({ }) => ({
  fontWeight: 700,
  color: "#033530",
  // color: theme.palette.primary.dark,
  lineHeight: "140%",
  fontSize: "23px",
  // marginBottom: "1rem",
  fontStyle: "normal"
}));