import { Box, styled } from "@mui/material"

interface DetailsBoxProps {
  isActive: boolean
}

export const DetailsBox = styled(Box)(({ isActive }: DetailsBoxProps) => ({
  boxSizing: "border-box",
  width: "100%",
  borderRadius: "0.4rem",
  transition: "box-shadow 0.3s ease-in-out",
  marginBottom: "1rem",
  paddingLeft: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  "&:hover": {
    background: "#FFFFFF",
    // boxShadow:
    //   "0rem 0rem 0.125rem rgba(145, 158, 171, 0.25), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.25)",
    filter:
      "drop-shadow(0px 8px 24px rgba(228, 211, 255, 0.25)) drop-shadow(0px 8px 12px rgba(138, 138, 138, 0.25))",
  },
  background: isActive ? "#FFFFFF" : "",
  filter: isActive
    ? "drop-shadow(0px 8px 24px rgba(228, 211, 255, 0.25)) drop-shadow(0px 8px 12px rgba(138, 138, 138, 0.25))"
    : "",
}))
