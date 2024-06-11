import { createTheme, useTheme } from "@mui/material";
import { useMemo } from "react";

const useTableTheme = () => {
  const globalTheme = useTheme();
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode,
          primary: globalTheme.palette.primary,
          info: {
            main: "rgb(255,122,0)",
          },
          background: {
            default: globalTheme.palette.mode === "light" ? "#fff" : "#000",
          },
        },
        typography: {
          button: {
            textTransform: "none",
            fontSize: "0.8rem",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "0.8rem",
              },
            },
          },
          //   MuiSwitch: {
          //     fontSize: "5rem",
          //     // styleOverrides: {=
          //     // },
          //   },
        },
      }),
    [globalTheme]
  );

  return tableTheme;
};

export default useTableTheme;
