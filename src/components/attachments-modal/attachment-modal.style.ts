import { theme } from "@/constants/theme";
import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)`
  color: #ffffff;
  border-radius: ${theme.shape.borderRadius};
  padding: 1.5rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  height: 250px;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #f5f5f5;
  text-align: center;
  align-items: center;
  padding: 20px;
  &:hover {
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    background: rgba(200, 215, 250, 0.25);
    border: 0.0625rem solid ${theme.palette.primary.main};
    cursor: pointer;
  }
`;
