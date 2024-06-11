import { Stack } from "@mui/material";
import styled from "styled-components";

export const StackButton = styled(Stack)(({}) => ({
  padding: "5px 5px",
  borderRadius: "4px",
  border: "1px solid #D9D9D9",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  },
}));

export const StyledLabel = (styled as any).label`
  padding: 5px 5px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;
