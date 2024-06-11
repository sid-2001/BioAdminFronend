import { Menu, Typography, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "styled-components";

export const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
export const DetailsBox = styled(Box)(({}) => ({
  boxSizing: "border-box",
  // maxWidth: "1584px",
  width: "100%",
  height: "calc(100vh - 232px)",
  // paddingBottom: "1rem",
  background: "#FFFFFF",
  borderRadius: "1rem",
  transition: "box-shadow 0.3s ease-in-out",
  marginBottom: "1rem",
  boxShadow:
    "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
  overflowX: "scroll",
  "&::-webkit-scrollbar": {
    width: "0.5em",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
  },
}));

export const StyledKeys = styled(Typography)(({}) => ({
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "15px",
  letterSpacing: "0.02em",
  color: "#637381",
  marginBottom: "0.3rem !important",
}));

export const StyledValues = styled(Typography)(({}) => ({
  fontWeight: "500 !important" ,
  fontSize: "16px  !important",
  lineHeight: "140%",
  color: "#323232",
}));

export const StyledValueswithIcons = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
}));

export const CardMenu = styled(Menu)(({}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "0.5rem !important",
  borderRadius: "0.5rem",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow:
      "0rem 0rem 0.125rem rgba(145, 158, 171, 0.25), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.25)",
  },
}));

export const CardSubMenu = styled(MenuItem)(({}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  borderRadius: "5px !important",
  width: "8rem",
  margin: "0.5rem !important",
  height: "2rem",
  opacity: 0.8,
  "&:hover": {
    backgroundColor: "#DFE3E8",
  },
}));
