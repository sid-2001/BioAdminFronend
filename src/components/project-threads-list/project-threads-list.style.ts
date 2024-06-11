import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const ThreadCard = styled(Box)`
  width: 100%;
  height: 62px;
  padding: 0.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: 6px;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: pointer;
  background-color: #fff;
  border-radius: 0;
  background: #fff;
  margin: 0 0;
  border-bottom: 1px solid #e4e4e4;

  &:hover,
  &.active {
    box-shadow:
      0px 8px 24px 4px rgba(228, 211, 255, 0.25),
      0px 8px 12px 0px rgba(138, 138, 138, 0.25);
  }
  //
`;

export const StyledThreadStatus = styled(Box)(() => ({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
}));

export const MessageTitle = styled(Typography)`
  margin: 0px;
  letter-spacing: 0.15px;
  font-family: Inter;
  width: 12.25rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #323232;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
`;

export const MessageText = styled(Typography)`
  margin: 0px;
  letter-spacing: 0.15px;
  font-family: Inter;
  font-weight: 400;
  font-size: 0.875rem;
  width: 16.25rem;
  max-height: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #212121;
  font-size: 14px;
  font-weight: 300;
  line-height: normal;
`;

export const MessageTime = styled(Typography)`
  margin: 0px;
  line-height: 1.5;
  letter-spacing: 0.15px;
  font-family: Inter;
  font-weight: 400;
  font-size: 0.675rem;
  width: 3.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: -4px;
`;
