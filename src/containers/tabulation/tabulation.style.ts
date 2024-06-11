import { MenuItem } from "@mui/material";
import styled from "styled-components";
// import { styled as styles } from "@mui/material/styles"


export const StyledLabel = styled.label`
  display: block;
  width: 100%;
  height: 56px;
  border: 1px solid darkgray;
  padding: 16.5px 14px;
  border-radius: 1rem;
  margin-top: 1rem;
  color: darkgray;
  cursor: pointer;
`;

export const StyledMenuItems = styled(MenuItem)(() => ({
  padding: "8px 16px",
  width: "190px",
  height: "40px",
  display: "flex",
  gap: "8px",
}))