import { Box, TextField } from "@mui/material"
import styled from "styled-components"

export const DetailsBox = styled(Box)(({}) => ({
  boxSizing: "border-box",
  width: "100%",
  background: "#FFFFFF",
  borderRadius: "1rem",
  transition: "box-shadow 0.3s ease-in-out",
  marginBottom: "1rem",
  padding: "0rem 1rem 1rem 1rem",
  boxShadow:
    "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
}))

export const SearchInput = styled(TextField)(({}) => ({
  boxShadow: "none",
  padding: 0,
  background: "#F3F3F3",
  borderRadius: "1rem",
  ".MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  "& .MuiInputBase-input::placeholder": {
    fontWeight: 400,
    fontSize: "0.8rem",
  },
}))
