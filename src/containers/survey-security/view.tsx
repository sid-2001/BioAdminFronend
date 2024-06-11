import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Box, Grid, Typography } from "@mui/material";
import { StyledValues } from "@/components/project-details/project-details.style";
import { SecurityType } from "@/containers/survey-security/survey-security.container";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

function View({ security }: { security: SecurityType }) {
  return (
    <Box>
      <Box
        sx={{
          marginTop: "1rem",
          border: "1px solid #9C9C9C",
          borderRadius: "12px",
          padding: "10px",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            marginBottom: "0.5rem",
          }}
          variant="h6"
        >
          Deduplication
        </Typography>

        <Divider
          variant="inset"
          sx={{
            marginLeft: "-0.5px",
            borderBottomWidth: 3
          }}
        />

        <Grid
          sx={{
            alignItems: "center",
            margin: "10px 0px 20px 0px",
          }}
          container
          spacing={2}
        >
          <Grid item xs={4}>
            <FormControlLabel
              control={<Switch />}
              label="IP (Unique IP)"
              checked={security?.unique_ip}
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              checked={security?.unique_user}
              control={<Switch />}
              label="Unique User"
              disabled
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          marginTop: "2rem",
          border: "1px solid #9C9C9C",
          borderRadius: "12px",
          padding: "10px",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            marginBottom: "0.5rem",
          }}
          variant="h6"
        >
          Other Security
        </Typography>

        <Divider
          variant="inset"
          sx={{
            marginLeft: "-0.5px",
            borderBottomWidth: 3
          }}
        />

        <Grid
          sx={{
            alignItems: "center",
            margin: "10px 0px 20px 0px",
          }}
          container
          spacing={2}
        >
          <Grid item xs={4}>
            <FormControlLabel
              control={<Switch />}
              label="Country Mismatch"
              checked={security?.country_mismatch}
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              checked={security?.research_defender}
              control={<Switch />}
              label="Research Defender"
              disabled
            />
          </Grid>
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            item
            xs={4}
          >
            <StyledValues>Research Defender Score: </StyledValues>
            <TextField
              sx={{
                width: "90px",
              }}
              disabled
              InputProps={{ sx: { borderRadius: 0 } }}
              value={security?.research_defenderscore}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          marginTop: "2rem",
          border: "1px solid #9C9C9C",
          borderRadius: "12px",
          padding: "10px",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            marginBottom: "0.5rem",
          }}
          variant="h6"
        >
          Validation
        </Typography>
        <Divider
          variant="inset"
          sx={{
            marginLeft: "-0.5px",
            borderBottomWidth: 3
          }}
        />

        <Grid
          sx={{
            alignItems: "center",
            margin: "10px 0px 20px 0px",
          }}
          container
          spacing={2}
        >
          <Grid
            sx={{
              display: "flex",
              gap: "4px",
              alignItems: "center",
            }}
            item
            xs={4}
          >
            <FormControlLabel
              checked={security?.min_loi > 0}
              control={<Switch />}
              // disabled={true}
              label="Min Loi:"
              disabled
            />
            {/* <StyledValues>Min Loi:</StyledValues> */}
            <TextField
              sx={{
                width: "200px",
              }}
              disabled
              InputProps={{ sx: { borderRadius: 0 } }}
              value={security?.min_loi}
            />
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: "4px",

              alignItems: "center",
            }}
            item
            xs={4}
          >
            <FormControlLabel
              checked={security?.max_loi > 0}
              control={<Switch />}
              // disabled={true}
              label="Max Loi:"
              disabled
            />
            {/* <StyledValues>Max Loi:</StyledValues> */}
            <TextField
              sx={{
                width: "200px",
              }}
              disabled
              InputProps={{ sx: { borderRadius: 0 } }}
              value={security?.max_loi}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default View;
