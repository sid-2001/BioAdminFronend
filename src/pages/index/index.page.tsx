import { Box, Typography } from "@mui/material";
import "./index.css";
import { theme } from "@/constants/theme";

function IndexPage() {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "calc(100vh - 142px)",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h1">Dashborad</Typography>
        <Typography variant="h6" color={theme.palette.grey[500]}>
          Comming soon
        </Typography>
      </Box>
    </>
  );
}

export default IndexPage;
