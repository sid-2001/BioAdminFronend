// import { Box, Card, Menu, MenuItem } from "@mui/material";
// import { styled } from "@mui/system";

// export const CardMenu = styled(Menu)(({ theme }) => ({
//   position: "absolute",
//   zIndex: 1000, // ensure it's on top
//   maxWidth:"200px",
//   maxHeight:"200px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   padding: "0.5rem",
//   borderRadius: "0.5rem",
//   transition: "box-shadow 0.3s ease-in-out",

//   "&:hover": {
//     boxShadow: "0rem 0rem 0.125rem rgba(145, 158, 171, 0.25), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.25)",
//   },
// }));

// export const CardSubMenu = styled(MenuItem)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "row",
//   alignItems: "center",
//   padding: "0.25rem 0.5rem",
//   width: "8rem",
//   height: "2rem",
//   opacity: 0.8,
//   borderRadius: "0.5rem",
// }));

// export const CardHeader = styled(Box)(({ theme }) => ({
//   display: "flex",
//   justifyContent: "flex-end",
// }));

// export const CardActions = styled(Card)(({ theme }) => ({
//   boxSizing: "border-box",
//   background: "#FFFFFF",
//   border: `0.0625rem solid ${theme.palette.grey[300]}`,
//   borderRadius: "1.5rem",
//   padding: "1.5rem",
//   display: "flex",
//   flexDirection: "column",
// }));

import { Box, Card, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/system";

export const CardMenu = styled(Menu)(({ }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "0.5rem",
  borderRadius: "0.5rem",
  transition: "box-shadow 0.3s ease-in-out",

  "&:hover": {
    boxShadow:
      "0rem 0rem 0.125rem rgba(145, 158, 171, 0.25), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.25)",
  },
}));

export const CardSubMenu = styled(MenuItem)(({ }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0.25rem 0.5rem",
  width: "8rem",
  height: "2rem",
  opacity: 0.8,
  borderRadius: "0.5rem",
  "&:hover": {
    backgroundColor: "#DFE3E8"
  }
}));

export const CardHeader = styled(Box)(({ }) => ({
  display: "flex",
  justifyContent: "flex-end",
}));

export const CardActions = styled(Card)(({ theme }) => ({
  boxSizing: "border-box",
  background: "#FFFFFF",
  border: `0.0625rem solid ${theme.palette.grey[300]}`,
  borderRadius: "1.5rem",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
}));
