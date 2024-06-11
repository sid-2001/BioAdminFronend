import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
import { theme } from "@/constants/theme";

export const StyledCard = styled(Card)`
  color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  background-color: #fafafa;
  height: 170px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  border: 0.0625rem solid white;
  &:hover {
    background: rgba(200, 215, 250, 0.25);
    border: 0.0625rem solid ${theme.palette.primary.main};
    cursor: pointer;
  }
`;
