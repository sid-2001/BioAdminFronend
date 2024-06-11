import { Box, Typography } from "@mui/material";
import { styled } from "styled-components";

export const StyledContainer = styled(Box)(({ }) => ({
  padding: "2.3rem",
  borderRadius: "1rem",
  background: '#FFFFFF',
  transition: "box-shadow 0.3s ease-in-out",
  // "&:hover": {
  boxShadow:
    "0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)",
  // }
}))

export const StyledQualifications = styled(Typography)(({ }) => ({
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
  // color: "#033530"
}))

export const StyledAddQualifications = styled(Typography)(({ }) => ({
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "140%",
  color: "#3366FF"
}))