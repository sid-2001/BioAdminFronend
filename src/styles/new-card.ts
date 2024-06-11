import { Box, Card, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import Avatar from "@mui/material/Avatar"

export const NewCard = styled(Card)(({}) => ({
  display: "flex",
  width: "248px",
  height: "313px",
  padding: "20px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "24px",
  borderRadius: "12px",
  backgroundColor: "#FCFCFC",
  boxShadow: "0px 4px 12px 0px rgba(228, 211, 255, 0.25)",
  "&.shortCard": {
    height: "260px",
  },
  "&.disabled": {
    pointerEvents: "none",
    backgroundColor: "#F0F0F0 ",
  },
  "& .nextBtn": {
    opacity: 0,
  },
  "&:hover": {
    backgroundColor: "#6F10C0",
    boxShadow: "0px 4px 12px 0px rgba(228, 211, 255, 0.25)",
    cursor: "pointer",
  },
  "&:hover .clname": {
    color: "#FBFBFB",
  },
  "&:hover .cldesc": {
    color: "#F0F0F0",
  },
  "&:hover .cldetails": {
    color: "#CCC",
  },
  "&:hover .iconstext": {
    color: "#FDB447",
  },
  "&:hover .allIcons": {
    display: "none",
  },
  "&:hover .allIcons1": {
    filter: "brightness(100)",
  },
  "&:hover .allIconsHover": {
    display: "block !important",
  },
  "&:hover .statusbox": {
    borderColor: "#F8F8F8",
  },
  "&:hover .statustext": {
    color: "#F8F8F8",
  },
  "&:hover .nextBtn": {
    opacity: 1,
  },
}))

export const StyledHeading = styled(Typography)(({}) => ({
  color: "#212121",
  lineHeight: "18px",
  fontWeight: 700,
  fontStyle: "normal",
  fontSize: "14px",
  marginBottom: "12px",
  maxWidth: "196px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}))

export const StyledDetails = styled(Typography)(({ theme }) => ({
  color: "#616161",
  fontSize: "12px",
  fontFamily: theme.typography.fontFamily,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  maxWidth: "196px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}))

export const ProjectDetails = styled(Typography)(({ theme }) => ({
  color: "#7A7A7A",
  fontSize: "12px",
  fontFamily: theme.typography.fontFamily,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "14.52px",
  maxWidth: "196px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}))

export const IconsText = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  color: "#6F10C0",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
}))

export const StyledDiscription = styled(Typography)(({ theme }) => ({
  color: "#9C9C9C",
  fontFamily: theme.typography.fontFamily,
  lineHeight: "normal",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "12px",
  maxWidth: "196px",
  height: "48px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "wrap",
}))

export const StatusBox = styled(Box)(({}) => ({
  display: "flex",
  height: "24px",
  padding: "4px 16px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  border: "1px solid #2444EA",
}))

export const StatusBoxTypography = styled(Typography)(({}) => ({
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "normal",
  color: "#2444EA",
}))

export const TextAvatar = styled(Avatar)(() => ({
  height: "32px",
  width: "32px",
  backgroundColor: "#66D36A",
  color: "#212121",
  fontSize: "14px",
  fontWeight: "600",
}))
export const TextAvatarSupplier = styled(Avatar)(() => ({
  height: "32px",
  width: "32px",
  backgroundColor: "#AEF482",
  color: "#212121",
  fontSize: "14px",
  fontWeight: "600",
}))
export const TextAvatarUser = styled(Avatar)(() => ({
  height: "32px",
  width: "32px",
  backgroundColor: "#D2A70B",
  color: "#212121",
  fontSize: "14px",
  fontWeight: "600",
}))
