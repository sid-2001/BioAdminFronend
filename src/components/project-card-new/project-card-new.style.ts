import { styled } from "@mui/material/styles"

import { Avatar, Box, Card, MenuItem, Typography } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { theme } from "@/constants/theme"




export const FlexRowBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const StatusBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
  border-radius: 4px;
  background: #d0d0d0;
  color: black;
  font-family: ${theme.typography.fontFamily};
  font-size: 14px;
`

export const StyledAvatar = styled(Avatar)`
  width: 24px;
  height: 24px;
  font-size: 10px;
`

export const StyledAvatarTypography = styled(Typography)`
  color: ${theme.palette.text.primary};
  margin-top: 0.4rem;
  font-weight: 700;
  font-family: ${theme.typography.fontFamily};
`



export const StyledAddIcon = styled(AddIcon)`
  color: #3e3beb;
`
export const StyledMoreVertIcon = styled(MoreVertIcon)`
  color: #3e3beb;
`

export const PrimaryBox = styled(Box)(({ }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  padding: "4px 16px",
  background: "#FAF6CF",
  borderRadius: "4px",
}))

export const ContactType = styled(Box)(({ }) => ({
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "140%",
  textTransform: "capitalize",
  color: "#9A8C00",
}))

export const StyledCard = styled(Card)(({ }) => ({
  borderRadius: '16px',
  padding: '16px',
  height: '244px',
  width: '364px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  backgroundColor: '#FBFBFB',
  boxShadow: '0px 2px 4px 0px rgba(169, 169, 169, 0.25), 0px 4px 12px 0px rgba(222, 222, 222, 0.25)',
  '&:hover': {
    backgroundColor: '#8E27D7',
    boxShadow: '0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)',
    cursor: 'pointer',
  },
  '&:hover .nametypo': {
    color: '#FBFBFB',
  },
  '&:hover .nametypodesc': {
    color: '#F3F3F3',
  },
  "&:hover .nametypodesctext": {
    color: "#A7A7A7 !important",
  },
  '&:hover .allIcons': {
    display: "none"
  },
  '&:hover .allIconsHover': {
    display: "block !important"
  },
}));

export const StyledCard1 = styled(Card)(({}) => ({
  borderRadius: "16px",
  padding: "16px",
  height: "244px",
  width: "364px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  backgroundColor: "#FCFCFC",
  boxShadow:
    "0px 2px 4px 0px rgba(169, 169, 169, 0.25), 0px 4px 12px 0px rgba(222, 222, 222, 0.25)",
  "&:hover": {
    backgroundColor: "#6F10C0",
    boxShadow:
      "0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)",
    cursor: "pointer",
  },
  "&:hover .nametypo": {
    color: "#FBFBFB",
  },
  "&:hover .nametypodesc": {
    color: "#F3F3F3 !important",
  },
  "&:hover .nametypodesctext": {
    color: "#A7A7A7 !important",
  },
  "&:hover .green": {
    color: "#1DA522 !important",
  },
  "&:hover .allIcons": {
    display: "none",
  },
  "&:hover .allIconsHover": {
    display: "block !important",
  },
  "& .nextBtn": {
    opacity: 0,
  },
  "&:hover .nextBtn": {
    opacity: 1,
  },
}))

export const StyledTypography = styled(Typography)(({ }) => ({
  color: '#323232',
  lineHeight: '19.36px',
  fontWeight: 500,
  fontSize: '16px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const StyledDiscriptionTypography = styled(Typography)(({ theme }) => ({
  color: '#9C9C9C',
  fontFamily: theme.typography.fontFamily,
  lineHeight: '14.52px',
  fontWeight: 400,
  fontSize: '12px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const StyledMenuItems = styled(MenuItem)(() => ({
  padding: "8px 16px",
  width: "190px",
  height: "40px",
  display: "flex",
  gap: "8px",
}))

export const StyledStatusTypography = styled(Typography)(({ theme }) => ({
  // color: '#9C9C9C',
  fontFamily: theme.typography.fontFamily,
  lineHeight: '18px',
  fontWeight: 500,
  fontSize: '12px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));