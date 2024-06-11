import ReactDOM from "react-dom/client"
import { ThemeProvider } from "@mui/material/styles"
// import { store } from "./store.ts"
// import { Provider } from "react-redux"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

import App from "./App.tsx";
import "./index.css";
import { theme } from "./constants/theme.ts";
import { SnackbarProvider } from "notistack";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        {/* <Provider store={store}> */}
        <App />
        {/* </Provider> */}
      </SnackbarProvider>
    </ThemeProvider>
  </LocalizationProvider>,
)
