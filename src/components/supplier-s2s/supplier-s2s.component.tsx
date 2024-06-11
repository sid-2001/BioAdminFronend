import { Box, Button, Grid, IconButton, Stack, Switch, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Edit } from "@mui/icons-material";
import TextField from "../text-field";
import CustomDividerComponent from "../custom-divider";
import { SuppliersService } from "@/services/supplier.sevice";
import LoadingSpinner from "../loader";

interface s2sPayload {
  s2sCompleted: any;
  s2sQuotaFull: any;
  s2sTerminate: any;
  s2sSecurity: any;
  s2sEnable: any;
}


const SupplierS2SComponent = ({ data, GetData, rowId }: any) => {
  let { enqueueSnackbar } = useSnackbar();
  const [addData, setAddData] = useState(true);
  const [isEdit, setIsEdit] = useState({
    disabled: false,
    edit: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const suppliersService = new SuppliersService();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    register,
  } = useForm({
    defaultValues: {
      s2sCompleted: "",
      s2sQuotaFull: "",
      s2sTerminate: "",
      s2sSecurity: "",
      s2sEnable: false,
    },
  });

  const label = (value: string, required?: boolean) => {
    return (
      <Box fontWeight="400" fontSize="12px" color="rgba(0, 0, 0, 0.85)" pb={0.5}>
        {value} {required ? <span>* &nbsp;</span> : ""}
      </Box>
    );
  };

  let { supplierId } = useParams();

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [data]);

  const getData = async () => {
    if (data !== null) {
      if (data.s2sEnable || data.s2sEnable === false) {
        setAddData(false);
        setIsEdit({
          disabled: true,
          edit: false,
        });
      } else {
        setAddData(true);
      }
      setValue("s2sCompleted", data.s2sCompleted);
      setValue("s2sQuotaFull", data.s2sQuotaFull);
      setValue("s2sTerminate", data.s2sTerminate);
      setValue("s2sSecurity", data.s2sSecurity);
      setValue("s2sEnable", data.s2sEnable);
    } else {
      setAddData(true);
      setIsEdit({
        disabled: false,
        edit: false,
      });
    }
  };

  const save = async (data: s2sPayload) => {
    setIsLoading(true);
    let payload = {
      // S2S payload
      s2s_enable: data.s2sEnable,
      s2s_completed: data.s2sCompleted,
      s2s_terminate: data.s2sTerminate,
      s2s_quota_full: data.s2sQuotaFull,
      s2s_security: data.s2sSecurity,
    };
    try {
      await suppliersService.putSupplierS2s(Number(supplierId), rowId, payload);
      await GetData();
      setIsLoading(false);
      enqueueSnackbar("S2S save successfully", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("Opps somthing went wrong !", {
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    enqueueSnackbar("URL copy Successfully!", {
      variant: "success",
    });
  }

  return (
    <form onSubmit={handleSubmit(save)} noValidate>
      {isLoading ? <LoadingSpinner /> : ""}
      <Stack mb={1.5}>
        <Box pb={1.2} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap="15px">
            <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>S2S URL(s)</Typography>
            <Switch
              size="small"
              disabled={isEdit.disabled === true}
              sx={{ marginTop: "2px" }}
              checked={watch("s2sEnable")}
              onChange={e => {
                setValue("s2sEnable", e.target.checked);
              }}
            />
          </Box>
          <Box>
            {isEdit.disabled === true ? (
              <IconButton
                size="small"
                onClick={() => {
                  setIsEdit({
                    disabled: false,
                    edit: true,
                  });
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            ) : (
              <Box display="flex" alignItems="center" gap="10px">
                <Button
                  variant="text"
                  color="inherit"
                  size="small"
                  onClick={async () => {
                    if (!addData) {
                      await GetData();
                      setIsEdit({
                        disabled: true,
                        edit: false,
                      });
                    } else {
                      reset({
                        s2sCompleted: "",
                        s2sQuotaFull: "",
                        s2sTerminate: "",
                        s2sSecurity: "",
                      });
                    }
                  }}
                >
                  &nbsp;cancel
                </Button>
                <Button variant="contained" color="info" type="submit" size="small">
                  save
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        <CustomDividerComponent />
      </Stack>
      {isEdit.edit || addData ? (
        <Grid container spacing={3} sx={{ display: !watch("s2sEnable") ? "none" : "" }}>
          <Grid item xs={12} md={12}>
            {label("S2S Completed", true)}
            <Controller
              name="s2sCompleted"
              control={control}
              rules={{
                required: watch("s2sEnable") ? `S2S Completed is required!` : false,
              }}
              render={({ field }) => (
                <Box sx={{ position: "relative" }}>
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isEdit.disabled}
                    size="small"
                    variant="outlined"
                    placeholder="S2S Completed"
                    {...register("s2sCompleted", {
                      pattern: {
                        value:
                          //eslint-disable-next-line
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                        message: "invalid URl ",
                      },
                    })}
                    error={errors?.s2sCompleted ? true : false}
                    helperText={errors?.s2sCompleted ? errors.s2sCompleted.message : null}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 4, right: 5 }}
                    size="small"
                    onClick={() => {
                      copy(watch("s2sCompleted"));
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            {label("S2S Quota Full")}
            <Controller
              name="s2sQuotaFull"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <Box sx={{ position: "relative" }}>
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isEdit.disabled}
                    size="small"
                    variant="outlined"
                    placeholder="S2S QuotaFull"
                    {...register("s2sQuotaFull", {
                      pattern: {
                        value:
                          //eslint-disable-next-line
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                        message: "invalid URl ",
                      },
                    })}
                    error={errors?.s2sQuotaFull ? true : false}
                    helperText={errors?.s2sQuotaFull ? errors.s2sQuotaFull.message : null}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 4, right: 5 }}
                    size="small"
                    onClick={() => {
                      copy(watch("s2sCompleted"));
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            {label("S2S Terminate", true)}
            <Controller
              name="s2sTerminate"
              control={control}
              rules={{
                required: watch("s2sEnable") ? `S2S Terminate is required!` : false,
              }}
              render={({ field }) => (
                <Box sx={{ position: "relative" }}>
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isEdit.disabled}
                    size="small"
                    variant="outlined"
                    placeholder="S2S Terminate"
                    {...register("s2sTerminate", {
                      pattern: {
                        value:
                          //eslint-disable-next-line
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                        message: "invalid URl ",
                      },
                    })}
                    error={errors?.s2sTerminate ? true : false}
                    helperText={errors?.s2sTerminate ? errors.s2sTerminate.message : null}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 4, right: 5 }}
                    size="small"
                    onClick={() => {
                      copy(watch("s2sTerminate"));
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            {label("S2S Security")}
            <Controller
              name="s2sSecurity"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <Box sx={{ position: "relative" }}>
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isEdit.disabled}
                    size="small"
                    variant="outlined"
                    placeholder="S2S Security"
                    {...register("s2sSecurity", {
                      pattern: {
                        value:
                          //eslint-disable-next-line
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                        message: "invalid URl ",
                      },
                    })}
                    error={errors?.s2sSecurity ? true : false}
                    helperText={errors?.s2sSecurity ? errors.s2sSecurity.message : null}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 4, right: 5 }}
                    size="small"
                    onClick={() => {
                      copy(watch("s2sSecurity"));
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3} sx={{ display: !watch("s2sEnable") ? "none" : "" }}>
          <Grid item xs={12} md={12}>
            {label("S2S Completed", true)}
            <Typography fontSize="14px" fontWeight="600">
              {watch("s2sCompleted") ? watch("s2sCompleted") : "NA"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            {label("S2S Quota Full")}
            <Typography fontSize="14px" fontWeight="600">
              {watch("s2sQuotaFull") ? watch("s2sQuotaFull") : "NA"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            {label("S2S Terminate", true)}
            <Typography fontSize="14px" fontWeight="600">
              {watch("s2sTerminate") ? watch("s2sTerminate") : "NA"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            {label("S2S Security")}
            <Typography fontSize="14px" fontWeight="600">
              {watch("s2sSecurity") ? watch("s2sSecurity") : "NA"}
            </Typography>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

export default SupplierS2SComponent;
