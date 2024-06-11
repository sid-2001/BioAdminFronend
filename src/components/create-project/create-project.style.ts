import { SxProps, Theme } from "@mui/material";

export const textFieldStyle: SxProps<Theme> = {
  width: "333px",
  height: "40px",
  "& fieldset": { border: "none" },
};

export const selectStyle: SxProps<Theme> = {
  // width: "333px",
  //  height: "40px",
  display: "flex",
  flexDirection: "column",
  borderColor: "#9C9C9C",
  paddingTop: "10px",
  "@media (max-width: 963px)": {
    width: "300px",
  },
  "@media (max-width: 733px)": {
    width: "250px",
  },
  "@media (max-width: 627px)": {
    width: "200px",
  },
  "@media (max-width: 523px)": {
   width: "150px",
 },
};

export const boxStyle: SxProps<Theme> = {
  display: "flex",
  width: "418px",
  height: "56px",
  border: "1px solid lightgrey",
  borderRadius: "6px",
  marginTop: "10px",
  alignItems: "center",
  "@media (max-width: 963px)": {
    width: "300px",
  },
  "@media (max-width: 733px)": {
    width: "250px",
  },
  "@media (max-width: 627px)": {
    width: "200px",
  },
  "@media (max-width: 523px)": {
    width: "150px",
  },
};
