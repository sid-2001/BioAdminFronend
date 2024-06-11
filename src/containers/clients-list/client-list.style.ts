import { SxProps, Theme } from "@mui/material";

 export const textFieldStyle: SxProps<Theme> = {
    width: "333px",
    height: "40px",
    borderRadius: "4px",
    outline: "none",
    paddingTop: "6px",
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
 }