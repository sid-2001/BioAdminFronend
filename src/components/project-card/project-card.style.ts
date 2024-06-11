import { styled } from "@mui/material/styles";

import { Avatar, Box, Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { theme } from "@/constants/theme";

export const StyledCard = styled(Card)`
  color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  background-color: #FAFAFA;
  height: 170px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px 20px;
  background-color: #fdf6ff;
  box-shadow:
    0px 2px 4px 0px rgba(169, 169, 169, 0.25),
    0px 4px 12px 0px rgba(222, 222, 222, 0.25);
  &:hover {
    background-color: #f4ddff;
    box-shadow:
      0px 2px 4px 0px rgba(232, 204, 255, 0.12),
      0px 4px 12px 0px rgba(228, 152, 255, 0.25);
    cursor: pointer;
  }
`;

export const StyledTypography = styled(Typography)`
  color: ${theme.palette.text.primary};
  line-height: 140%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FlexRowBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

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
`;

export const StyledAvatar = styled(Avatar)`
  width: 24px;
  height: 24px;
  font-size: 10px;
`;

export const StyledAvatarTypography = styled(Typography)`
  color: ${theme.palette.text.primary};
  margin-top: 0.4rem;
  font-weight: 700;
  font-family: ${theme.typography.fontFamily};
`;

export const StyledDiscriptionTypography = styled(Typography)`
  color: ${theme.palette.grey[500]};
  font-family: ${theme.typography.fontFamily};
`;

export const StyledAddIcon = styled(AddIcon)`
  color: #3e3beb;
`;
export const StyledMoreVertIcon = styled(MoreVertIcon)`
  color: #3e3beb;
`;

export const PrimaryBox = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  padding: "4px 16px",
  background: "#FAF6CF",
  borderRadius: "4px",
}));

export const ContactType = styled(Box)(({}) => ({
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "140%",
  textTransform: "capitalize",
  color: "#9A8C00",
}));
