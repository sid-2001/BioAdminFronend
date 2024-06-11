import { Box, Button, Grid, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useForm } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import { StyledValues } from "@/components/project-details/project-details.style";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { SecurityType } from "@/containers/survey-security/survey-security.container";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/loader";

interface Input extends SecurityType { }

function Form({
  setEditMode,
  security,
  updateSecurity,
  loading,
}: {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  security: SecurityType;
  updateSecurity: (obj: SecurityType) => void;
  loading: boolean;
}) {
  const { register, handleSubmit } = useForm<Input>();

  const onSubmit = () => {
    if (showLoiError) return;

    updateSecurity(formState);
  };

  // const [formState, setFormState] = useState<Input>({
  //   ...security,
  // });

  const [formState, setFormState] = useState<Input>(() => {
    const { min_loi, max_loi, ...rest } = security || {};

    return {
      ...rest,
      min_loi: min_loi || 0,
      max_loi: max_loi || 0,
      acceptMaxLoi:
        max_loi !== undefined &&
        max_loi !== null &&
        String(max_loi) !== "" &&
        max_loi !== 0,
      acceptMinLoi:
        min_loi !== undefined &&
        min_loi !== null &&
        String(min_loi) !== "" &&
        min_loi !== 0,
    };
  });

  const [showLoiError, setShowLoiError] = useState(false);

  function toggler(e: React.ChangeEvent<HTMLInputElement>) {
    setFormState((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.checked,
      };
    });
  }

  useEffect(() => {
    if (formState) {
      if (formState?.min_loi > formState?.max_loi) setShowLoiError(true);
      else setShowLoiError(false);
    }
  }, [formState]);

  useEffect(() => {
    if (!formState?.acceptMinLoi) {
      // If acceptMinLoi is false, set min_loi to an empty string
      setFormState((prev) => ({
        ...prev,
        min_loi: 0,
      }));
    }

    if (!formState?.acceptMaxLoi) {
      // If acceptMaxLoi is false, set max_loi to an empty string
      setFormState((prev) => ({
        ...prev,
        max_loi: 0,
      }));
    }
  }, [formState?.acceptMinLoi, formState?.acceptMaxLoi]);

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                borderBottomWidth: 3,
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
                  {...register("unique_ip")}
                  control={<Switch onChange={toggler} />}
                  label="IP (Unique IP)"
                  checked={formState?.unique_ip}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  {...register("unique_user")}
                  control={<Switch onChange={toggler} />}
                  label="Unique User"
                  checked={formState?.unique_user}
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
                borderBottomWidth: 3,
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
                  {...register("country_mismatch")}
                  control={<Switch onChange={toggler} />}
                  label="Country Mismatch"
                  checked={formState?.country_mismatch}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  {...register("research_defender")}
                  control={<Switch onChange={toggler} />}
                  label="Research Defender"
                  checked={formState?.research_defender}
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
                  {...register("research_defenderscore")}
                  type="number"
                  InputProps={{ sx: { borderRadius: 0 } }}
                  value={formState?.research_defenderscore}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        research_defenderscore: Number(e.target.value),
                      };
                    });
                  }}
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
                borderBottomWidth: 3,
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
                  {...register("acceptMinLoi")}
                  control={<Switch onChange={toggler} />}
                  checked={formState?.acceptMinLoi}
                  label="Min Loi:"
                />
                <Box>
                  <TextField
                    disabled={!formState?.acceptMinLoi}
                    sx={{
                      width: "200px",
                    }}
                    {...register("min_loi")}
                    type="number"
                    InputProps={{ sx: { borderRadius: 0 } }}
                    value={String(formState?.min_loi)}
                    onChange={(e) => {
                      setFormState((prev) => {
                        return {
                          ...prev,
                          min_loi: Number(e.target.value),
                        };
                      });
                    }}
                  />
                  {showLoiError ? (
                    <Typography
                      sx={{
                        color: "red",
                      }}
                    >
                      Min loi should be smaller than max loi
                    </Typography>
                  ) : null}
                </Box>
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
                  {...register("acceptMaxLoi")}
                  control={<Switch onChange={toggler} />}
                  checked={formState?.acceptMaxLoi}
                  label="Max Loi:"
                />
                <Box>
                  <TextField
                    disabled={!formState?.acceptMaxLoi}
                    sx={{
                      width: "200px",
                    }}
                    {...register("max_loi")}
                    type="number"
                    InputProps={{ sx: { borderRadius: 0 } }}
                    value={String(formState?.max_loi)}
                    onChange={(e) => {
                      setFormState((prev) => {
                        return {
                          ...prev,
                          max_loi: Number(e.target.value),
                        };
                      });
                    }}
                  />
                  {showLoiError ? (
                    <Typography
                      sx={{
                        color: "red",
                      }}
                    >
                      Min loi should be smaller than max loi
                    </Typography>
                  ) : null}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              flexDirection: "row-reverse",
              margin: "2rem 1.5rem 2rem 0",
            }}
          >
            <Button
              disabled={
                !!(
                  showLoiError ||
                  Number(formState?.acceptMinLoi) ^
                  Number(formState?.acceptMaxLoi)
                )
              }
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}

export default Form;
