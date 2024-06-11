import { theme } from "@/constants/theme";
import styled, { keyframes } from "styled-components";

const spinClockwise = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinAnticlockwise = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

export const Loader = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

export const OuterCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 8px solid ${theme.palette.primary.main};
  border-top: 8px solid #ffffff;
  border-radius: 50%;
  animation: ${spinClockwise} 2s linear infinite;
`;

export const InnerCircle = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 68px;
  height: 68px;
  border: 8px solid ${theme.palette.primary.light};
  border-bottom: 8px solid #ffffff;
  border-radius: 50%;
  animation: ${spinAnticlockwise} 1s linear infinite;
`;

export const CenteredContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 99999,
}));
