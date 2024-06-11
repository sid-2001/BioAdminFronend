import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import TextField from "../text-field";
import CustomDividerComponent from "../custom-divider";
import { Edit } from "@mui/icons-material";
import LoadingSpinner from "../loader";
import { SuppliersService } from "@/services/supplier.sevice";

interface variablePayload {
  variable_1: string;
  variable_2: string;
  variable_3: string;
  variable_4: string;
  incomingAutoPunch?: any;
  incoming_auto_punch?: any;
}

const SupplierVariablesComponent = ({ data, GetData, rowId }: any) => {
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
  } = useForm({
    defaultValues: {
      variable_1: "",
      variable_2: "",
      variable_3: "",
      variable_4: "",
      incomingAutoPunch: false,
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
      if (data.variable_1) {
        setAddData(false);
        setIsEdit({
          disabled: true,
          edit: false,
        });
      } else {
        setAddData(true);
      }
      setValue("variable_1", data.variable_1);
      setValue("variable_2", data.variable_2);
      setValue("variable_3", data.variable_3);
      setValue("variable_4", data.variable_4);
      setValue("incomingAutoPunch", data.incomingAutoPunch);
    } else {
      setAddData(true);
      setIsEdit({
        disabled: false,
        edit: false,
      });
    }
  };

  const save = async (data: variablePayload) => {
    setIsLoading(true);
    let payload = {
      ...data,
    };
    payload.incoming_auto_punch = data.incomingAutoPunch;
    delete payload.incomingAutoPunch;
    try {
      await suppliersService.putSupplierVariable(Number(supplierId), rowId, payload);
      await GetData(true);
      setIsLoading(false);
      enqueueSnackbar("Variable save successfully", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("Opps somthing went wrong !", {
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(save)} noValidate>
      {isLoading ? <LoadingSpinner /> : ""}
      <Stack mb={1.5}>
        <Box pb={1.2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>Variables</Typography>
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
                        variable_1: "",
                        variable_2: "",
                        variable_3: "",
                        variable_4: "",
                        incomingAutoPunch: false,
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
          <Grid item xs={12} md={6}>
            {label("Variable 1", true)}
            <Controller
              name="variable_1"
              control={control}
              rules={{
                required: "Variable 1 is required!",
              }}
              render={({ field }) => <TextField size="small" {...field} fullWidth disabled={isEdit.disabled} type="text" variant="outlined" placeholder="Variable 1" error={errors?.variable_1 ? true : false} helperText={errors?.variable_1 ? errors.variable_1.message : null} />}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            {label("Variable 2")}
            <Controller
              name="variable_2"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => <TextField size="small" {...field} fullWidth disabled={isEdit.disabled} type="text" variant="outlined" placeholder="Variable 2" error={errors?.variable_2 ? true : false} helperText={errors?.variable_2 ? errors.variable_2.message : null} />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {label("Variable 3")}
            <Controller
              name="variable_3"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => <TextField size="small" {...field} fullWidth type="text" disabled={isEdit.disabled} variant="outlined" placeholder="Variable 3" error={errors?.variable_3 ? true : false} helperText={errors?.variable_3 ? errors.variable_3.message : null} />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {label("Variable 4")}
            <Controller
              name="variable_4"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => <TextField size="small" {...field} fullWidth type="text" disabled={isEdit.disabled} variant="outlined" placeholder="Variable 4" error={errors?.variable_4 ? true : false} helperText={errors?.variable_4 ? errors.variable_4.message : null} />}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack direction="row" spacing={2}>
              <FormControlLabel
                control={<Checkbox checked={watch("incomingAutoPunch")} />}
                label="Incoming Autopunch"
                onChange={(e: any) => {
                  setValue("incomingAutoPunch", e.target.checked);
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Tooltip title="Vendor Primary Variable" placement="top">
            <Grid item xs={12} md={6}>
              {label("Variable 1", true)}
              <Typography fontSize="14px" fontWeight="600">
                {watch("variable_1") ? watch("variable_1") : "NA"}
              </Typography>
            </Grid>
          </Tooltip>
          <Tooltip title="Vendor User Id variable" placement="top">
            <Grid item xs={12} md={6}>
              {label("Variable 2")}
              <Typography fontSize="14px" fontWeight="600">
                {watch("variable_2") ? watch("variable_2") : "NA"}
              </Typography>
            </Grid>
          </Tooltip>
          <Tooltip title="Additional Vendor Variable" placement="top">
            <Grid item xs={12} md={6}>
              {label("Variable 3")}
              <Typography fontSize="14px" fontWeight="600">
                {watch("variable_3") ? watch("variable_3") : "NA"}
              </Typography>
            </Grid>
          </Tooltip>
          <Tooltip title="Additional Vendor Variable" placement="top">
            <Grid item xs={12} md={6}>
              {label("Variable 4")}
              <Typography fontSize="14px" fontWeight="600">
                {watch("variable_4") ? watch("variable_4") : "NA"}
              </Typography>
            </Grid>
          </Tooltip>
          <Grid item xs={12} md={12}>
            <Stack direction="row" spacing={2}>
              <FormControlLabel control={<Checkbox disabled checked={watch("incomingAutoPunch")} />} label="Incoming Autopunch" />
            </Stack>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

export default SupplierVariablesComponent;
