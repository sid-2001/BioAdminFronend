import TextField from "@/components/text-field";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const Input = styled(TextField)(({}) => ({
  display: "block",
  marginBottom: "1rem",
}));

export const StyledForgetPassword = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
}));
