import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
// import { theme } from "@/constants/theme";

export const StyledCard1 = styled(Card)`
  padding: 15px 20px;
  border-radius: 16px;
  /* background: #fafafa; */
  width: 300px;
  height: 170px;
  cursor: pointer;
  /* background-color: #fdf6ff; */
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
`


export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "disable",
})(({ disable }: any) => ({
  padding: '15px 20px',
  borderRadius: '16px',
  width: '300px',
  height: '170px',
  cursor: 'pointer',
  backgroundColor: disable ? 'rgba(0, 0, 0, 0.1)' : '#fdf6ff',
  boxShadow: '0px 2px 4px 0px rgba(169, 169, 169, 0.25), 0px 4px 12px 0px rgba(222, 222, 222, 0.25)',
  '&:hover': disable ? {} : {
    backgroundColor: '#f4ddff',
    boxShadow: '0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)',
    cursor: 'pointer',
  },
}));