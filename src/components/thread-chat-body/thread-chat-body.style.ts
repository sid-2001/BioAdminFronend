import { styled } from "@mui/material/styles";
import { Box, Typography, Avatar, Button, Switch } from "@mui/material";

export const MessageAvatar = styled(Avatar)`
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 20px;
  background: #d2ffce;
  color: var(--Others-Dark-Green, #0e6e11);
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`;

export const ThreadChatBody = styled(Box)`
  background: #fff;
  flex: 1;
  overflow-y: scroll;
  /* padding: 0 1.25rem; */
  &::-webkit-scrollbar {
    width: 0px; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  scrollbar-width: none;
`;

export const MessageTimeBox = styled(Box)`
  display: flex;
  align-items: center;
`;

export const MessageTime = styled(Typography)`
  margin: 0px;
  letter-spacing: 0.4px;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.66;
  color: rgba(58, 53, 65, 0.6);
`;

export const MessageText = styled(Typography)`
  color: var(--Grey-9, #212121);
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
`;

export const ReceivedText = styled(Typography)`
  letter-spacing: 0.15px;
  font-family:
    Inter,
    sans-serif,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol";
  font-weight: 400;
  line-height: 1.5;
  box-shadow:
    rgba(58, 53, 65, 0.2) 0px 2px 1px -1px,
    rgba(58, 53, 65, 0.14) 0px 1px 1px 0px,
    rgba(58, 53, 65, 0.12) 0px 1px 3px 0px;
  border-radius: 0px 6px 6px 6px;
  max-width: 70%;
  width: fit-content;
  font-size: 0.875rem;
  overflow-wrap: break-word;
  padding: 0.75rem 1rem;
  background-color: #fff;
  color: #000;
`;

export const AttachmentMessage = styled(Box)`
  display: flex;
  padding: 8px 12px;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  background: var(--Grey-2, #f0f0f0);
  color: var(--Grey-9, #212121);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: fit-content;
`;

export const BoldButton = styled(Button)(({}) => ({
  color: "#212121",
  fontSize: "14px",
  fontWeight: "700 !important",
}));

export const IOSSwitch = styled(Switch)(({}) => ({
  width: 22,
  height: 12,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    transitionDuration: "300ms",
    transform: "translate(4px, 2px)",
    "& + .MuiSwitch-track": {
      backgroundColor: "white",
      opacity: 1,
      border: "2px solid black",
      padding: "2px",
    },
    "&.Mui-checked": {
      transform: "translate(10px, 2px)",
      color: "black",
      "& + .MuiSwitch-track": {
        backgroundColor: "white",
        opacity: 1,
        border: "2px solid black",
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 1,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "black",
      border: "6px solid black",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: "black",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 1,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 8,
    height: 8,
    backgroundColor: "black",
  },
  "& .MuiSwitch-track": {
    borderRadius: 8,
    backgroundColor: "white",
    opacity: 1,
  },
}));

// export const MessageText = styled(Typography)`
//   width: 11.875rem;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
// `;
