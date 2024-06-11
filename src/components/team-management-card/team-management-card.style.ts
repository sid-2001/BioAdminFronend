import { styled } from "@mui/material/styles";
// import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Card, Menu, MenuItem } from "@mui/material";

export const StyledCard = styled(Card)`
  color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  background-color: #fafafa;
  height: 170px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px 20px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    cursor: pointer;
  }
`;
export const CardHeader = styled(Box)(({}) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const Avatar = styled(Box)(({ theme }) => ({
  width: "4rem",
  height: "4rem",
  background: theme.palette.grey[300],
  borderRadius: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
}));

export const CardContentWrapper = styled(CardContent)(({}) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "0rem",
}));

export const ClientName = styled(Typography)(({}) => ({
  fontWeight: 400,
  fontSize: "1.1875rem",
  lineHeight: "140%",
  width: "100%",
  boxSizing: "border-box",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const ClientInfo = styled("span")(({ theme }) => ({
  fontWeight: 400,
  fontSize: "0.875rem",
  lineHeight: "140%",
  color: theme.palette.grey[600],
  marginBottom: "1rem",
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const PhoneNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "0.875rem",
  lineHeight: "140%",
  color: theme.palette.grey[600],
}));

export const PrimaryBox = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  padding: "4px 16px",
  background: "#FAF6CF",
  borderRadius: "4px",
}));

export const NameTag = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.4375rem",
  lineHeight: "140%",
  color: theme.palette.primary.dark,
}));

export const ContactType = styled(Typography)(({ }) => ({
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "140%",
  textTransform: "capitalize",
  color: "#9A8C00",
}));

export const CardMenu = styled(Menu)(({}) => ({
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

export const CardSubMenu = styled(MenuItem)(({}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0.25rem 0.5rem",
  width: "8rem",
  height: "2rem",
  opacity: 0.8,
  borderRadius: "0.5rem",
  "&:hover": {
    backgroundColor: "#DFE3E8",
  },
}));

export const StyledRole = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "140%",
  color: theme.palette.grey[600],
}));

export const FlexRowBox = styled(Box)`
display: flex;
flex-direction: row;
justify-content: space-between;
margin-bottom: 10px;
align-items: center;
width: 100%;
`;