import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
// import { theme } from "@/constants/theme";

const fontFamily = '"Inter", sans-serif';


export const StyledCard = styled(Box)`
  padding: 4px 16px 16px 16px;
  /* padding: 4px 12px 4px 12px; */
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #FFFFFF;
  width: 348px;
  height: 122px;
  cursor: pointer;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
  /* @media (max-width: 1550px) {
    width: 300px;
  height: 100px;
  } */
  //
`;

export const StyledConfigTypography = styled(Typography)(() => ({
    fontWeight: 'bold',
    fontSize: "12px",
    lineHeight: "14.52px",
    color: "#0F0F0F",
    fontFamily: fontFamily
}))

export const StyledSubConfigTypography = styled(Typography)(() => ({
    fontWeight: 400,
    fontSize: "10px",
    lineHeight: "12.1px",
    color: "#0F0F0F",
    fontFamily: fontFamily
}))

export const StyledStycTimeTypography = styled(Typography)(() => ({
    fontWeight: 400,
    fontSize: "8px",
    lineHeight: "9.68px",
    color: "#9C9C9C",
    fontFamily: fontFamily
}))

export const StyledNotReTypography = styled(Typography)(() => ({
    fontWeight: 'bold',
    fontSize: "14px",
    lineHeight: "16.94px",
    color: "#000000",
    fontFamily: fontFamily,
    '& span': {
        fontWeight: 'bold',
        fontSize: "14px",
        lineHeight: "16.94px",
        fontFamily: fontFamily,

    }
}))

export const StyledStycTimeTypeTypography = styled(Typography)(() => ({
    fontWeight: 400,
    fontSize: "8px",
    lineHeight: "9.68px",
    color: "#000000",
    fontFamily: fontFamily
}))