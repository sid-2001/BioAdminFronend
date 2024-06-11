import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const StyledTitle = styled(Typography)`
  color: var(--Grey-5, #323232);
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  width: fit-content;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
