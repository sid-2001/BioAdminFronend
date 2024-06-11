import { CircularProgress } from "@mui/material";
import {
  // Loader,
  // OuterCircle,
  // InnerCircle,
  CenteredContainer,
} from "./loader.style";

const LoadingSpinner = () => (
  <CenteredContainer>
    <CircularProgress />
  </CenteredContainer>
);

export default LoadingSpinner;
