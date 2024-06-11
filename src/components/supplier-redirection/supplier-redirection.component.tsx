import { Box, Button, Grid, IconButton, Stack, Typography } from "@mui/material";

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

interface SupplierRedirection {
  vendorCompleted: string;
  vendorTerminate: string;
  vendorQuotaFull: string;
  vendorSecurity: string;
}

const SupplierRedirectionComponent = ({ data, GetData, rowId }: any) => {
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
      vendorCompleted: "",
      vendorQuotaFull: "",
      vendorTerminate: "",
      vendorSecurity: "",
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
      if (data.vendorCompleted) {
        setAddData(false);
        setIsEdit({
          disabled: true,
          edit: false,
        });
      } else {
        setAddData(true);
      }
      setValue("vendorCompleted", data.vendorCompleted);
      setValue("vendorQuotaFull", data.vendorQuotaFull);
      setValue("vendorTerminate", data.vendorTerminate);
      setValue("vendorSecurity", data.vendorSecurity);
    } else {
      setAddData(true);
    }
  };

  const save = async (data: SupplierRedirection) => {
    setIsLoading(true);
    let payload = {
      // redirection payload
      redirect_enable: false,
      redirect_completed: data.vendorCompleted,
      redirect_terminate: data.vendorTerminate,
      redirect_quota_full: data.vendorQuotaFull,
      redirect_security: data.vendorSecurity,
    };
    try {
      await suppliersService.putSupplierRedirection(Number(supplierId), rowId, payload);
      await GetData();
      setIsLoading(false);
      enqueueSnackbar("Redirection save successfully", {
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
          <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>Redirection URL(s)</Typography>
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
                        vendorCompleted: "",
                        vendorQuotaFull: "",
                        vendorTerminate: "",
                        vendorSecurity: "",
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            {label("Supplier Completed", true)}
            <Controller
              name="vendorCompleted"
              control={control}
              rules={{
                required: `Supplier Completed is required!`,
              }}
              render={({ field }) => (
                <Box sx={{ position: "relative" }}>
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    disabled={isEdit.disabled}
                    variant="outlined"
                    placeholder="Supplier Completed"
                    {...register("vendorCompleted", {
                      pattern: {
                        value:
                          //eslint-disable-next-line
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                        message: "invalid URl ",
                      },
                    })}
                    error={errors?.vendorCompleted ? true : false}
                    helperText={errors?.vendorCompleted ? errors.vendorCompleted.message : null}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 4, right: 5 }}
                    size="small"
                    onClick={() => {
                      copy(watch("vendorCompleted"));
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            {label("Supplier Quota Full")}
            <Controller
              name="vendorQuotaFull"
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
                    placeholder="Supplier QuotaFull"
                    {...register("vendorQuotaFull", {
                      pattern: {
                        value:
                          //eslint-disable-next-line
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                        message: "invalid URl ",
                      },
                    })}
                    error={errors?.vendorQuotaFull ? true : false}
                    helperText={errors?.vendorQuotaFull ? errors.vendorQuotaFull.message : null}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 4, right: 5 }}
                    size="small"
                    onClick={() => {
                      copy(watch("vendorQuotaFull"));
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            {label("Supplier Terminate", true)}
            <Controller
              name="vendorTerminate"
              control={control}
              rules={{
                required: `Supplier Terminate is required!`,
              }}
              render={({ field }) => (
                <Box sx={{ position: "relative" }}>
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isEdit.disabled}
                    size="small"
                    variant="outlined"
                    placeholder="Supplier Terminate"
                    {...register("vendorTerminate", {
                      pattern: {
                        value:
                          //eslint-disable-next-line
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                        message: "invalid URl ",
                      },
                    })}
                    error={errors?.vendorTerminate ? true : false}
                    helperText={errors?.vendorTerminate ? errors.vendorTerminate.message : null}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 4, right: 5 }}
                    size="small"
                    onClick={() => {
                      copy(watch("vendorTerminate"));
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            {label("Supplier Security")}
            <Controller
              name="vendorSecurity"
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
                    placeholder="Supplier Security"
                    {...register("vendorSecurity", {
                      pattern: {
                        value:
                          //eslint-disable-next-line
                          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                        message: "invalid URl ",
                      },
                    })}
                    error={errors?.vendorSecurity ? true : false}
                    helperText={errors?.vendorSecurity ? errors.vendorSecurity.message : null}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 4, right: 5 }}
                    size="small"
                    onClick={() => {
                      copy(watch("vendorSecurity"));
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            {label("Supplier Completed", true)}
            <Typography fontSize="14px" fontWeight="600">
              {watch("vendorCompleted") ? watch("vendorCompleted") : "NA"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            {label("Supplier Quota Full")}
            <Typography fontSize="14px" fontWeight="600">
              {watch("vendorQuotaFull") ? watch("vendorQuotaFull") : "NA"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            {label("Supplier Terminate", true)}
            <Typography fontSize="14px" fontWeight="600">
              {watch("vendorTerminate") ? watch("vendorTerminate") : "NA"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            {label("Supplier Security")}
            <Typography fontSize="14px" fontWeight="600">
              {watch("vendorSecurity") ? watch("vendorSecurity") : "NA"}
            </Typography>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

export default SupplierRedirectionComponent;
