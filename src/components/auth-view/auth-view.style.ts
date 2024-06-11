import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import { LoginPng } from "@/assets/images";
import { TextField, Typography } from "@mui/material";

export const MainContainer = styled(Grid)(({}) => ({
  height: "100vh",
}));

export const LeftContainer = styled("div")(({}) => ({
  backgroundImage: `url(${LoginPng})`,
  // margin: "1rem",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  // backgroundPosition: "center",
  height: "100vh",
}));

export const RightContainer = styled(Grid)(({}) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const FormContainer = styled(Box)(({}) => ({
  width: "90%",
  maxWidth: "20.625rem",
  margin: "0 auto",
}));

export const Heading = styled(Typography)(({}) => ({
  fontWeight: 700,
  lineHeight: "140%",
  marginBottom: "1rem",
}));

export const SubHeading = styled(Typography)(({}) => ({
  fontWeight: 400,
  lineHeight: "140%",
  marginBottom: "2rem",
  color: "#aaa",
}));

export const Btn = styled(Button)(({ theme }) => ({
  display: "flex",
  width: "100%",
  height: "56px",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "0.5rem 1.25rem",
  borderRadius: "0.5rem",
  fontWeight: 700,
  fontSize: "0.875rem",
  lineHeight: "140%",
  color: theme.palette.grey[100],
  textTransform: "none",
  marginTop: "2.75rem",
}));

export const Input = styled(TextField)(({}) => ({
  display: "block",
  marginBottom: "1rem",
}));

export const Link = styled(MuiLink)(({}) => ({
  marginTop: "1rem",
  display: "inline-block",
}));

export const StyledForgetPassword = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
}));
