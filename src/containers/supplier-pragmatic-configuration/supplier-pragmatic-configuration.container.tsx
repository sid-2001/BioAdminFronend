import { DetailsBox, StyledKeys, StyledValues, StyledValueswithIcons } from "@/components/project-details/project-details.style";
import { Box, Button, DialogTitle, FormHelperText, Grid, IconButton, Typography, } from "@mui/material";
import { useEffect, useState } from "react";
import { SuppliersService } from "@/services/supplier.sevice";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/loader";
import EditIcon from "@mui/icons-material/Edit";
import MultipleSelectCheckmarks from "@/components/multiple-select";
import { ListService } from "@/services/list.service";
import { useForm } from "react-hook-form";
import TextField from '@/components/text-field'
import { IFormMetrics } from "@/types/survey-builder.type";
import { enqueueSnackbar } from "notistack";


// interface Configuration {
//   min_vcpi: NumericField<float>;
//   max_vcpi: NumericField<float>;
//   min_loi: NumericField<int>;
//   max_loi: NumericField<int>;
//   min_ir: NumericField<float>;
//   max_ir: NumericField<float>;
//   min_conversion: NumericField<float>;
//   min_epc: NumericField<float>;
//   min_sample_required: NumericField<int>;
//   min_cpi: NumericField<float>;
//   max_cpi: NumericField<float>;
// }

// interface NumericField<T> {
//   type: string;
//   default: T;
//   constraints: string[];
// }

// type float = number;
// type int = number;


const initialFormValues = {
  account_ids: [],
  min_vcpi: 0,
  max_vcpi: 2,
  min_loi: 1,
  max_loi: 100,
  min_ir: 1,
  max_ir: 100,
  min_conversion: 0,
  min_epc: 0,
  min_sample_required: 0,
  min_cpi: 0.01,
  max_cpi: 50,
};

const SupplierPragmaticConfigurationContainer = () => {
  let { supplierId } = useParams();
  let list_service = new ListService();
  const suppliersService = new SuppliersService();
  const [loading, setLoading] = useState<boolean>(false)

  const [tenantList, setTenantList] = useState<any>([]);
  const [supplierAccounts, setSupplierAccounts] = useState<any>([]);
  const [supplierConfigs, setSupplierConfigs] = useState<IFormMetrics>(initialFormValues);

  const [isEdit, setIsEdit] = useState(false)

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<IFormMetrics>({
    defaultValues: initialFormValues,
  });

  const getTenantList = async () => {
    setLoading(true)
    try {
      const data = await list_service.get_accounts_list();
      const newProperties = data && data?.map((item: { name: any; id: any; }) => ({
        text: item?.name,
        value: item?.id,
      }))

      setTenantList(newProperties);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const getSupplierAccountsList = async () => {
    setLoading(true)
    try {
      const data = await suppliersService.getSupplierAccounts(Number(supplierId));
      const accountIds = data && data?.map((item: { account_id: number; }) => item.account_id);
      setValue('account_ids', accountIds)
      setSupplierAccounts(accountIds)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };


  const PutSupplierAccountsList = async (account_ids: number[]) => {
    try {
      const data = await suppliersService.PutSupplierAccounts(Number(supplierId), account_ids);
      return data
    } catch (error) {
      console.log(error);
    }
  };

  function isKeyOfIFormMetrics(key: any): key is keyof IFormMetrics {
    return ['min_vcpi', 'max_vcpi', 'min_loi', 'max_loi', 'min_ir', 'max_ir', 'min_conversion', 'min_epc', 'min_sample_required', 'min_cpi', 'max_cpi'].includes(key);
  }

  const GetSupplierConfigs = async () => {
    setLoading(true)
    try {
      const data = await suppliersService.getSupplierConfigInAccounts(Number(supplierId));

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (isKeyOfIFormMetrics(key)) {
            setValue(key, value);
          }
        });
      }
      // @ts-ignore
      setSupplierConfigs(data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const PutSupplierConfigs = async (config_object: any) => {
    try {
      const data = await suppliersService.putSupplierConfigInAccounts(Number(supplierId), config_object);
      return data
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (selected: { value: string | number; text: string }[]) => {
    setValue(
      'account_ids',
      selected.map((item) => Number(item.value)),
    )
  }

  const onSubmit = async (data: { [x: string]: any; account_ids: number[]; }) => {
    setLoading(true)
    // console.log(data, "datadata")
    const { account_ids, ...restData } = data;

    const putData = Object.keys(restData).reduce((acc: any, key) => {
      acc[key] = Number(restData[key]);
      return acc;
    }, {});

    const [accountsResponse, configResponse] = await Promise.all([
      PutSupplierAccountsList(account_ids),
      PutSupplierConfigs(putData)
    ]);
    if (accountsResponse?.status && configResponse?.status) {
      setIsEdit(false)
      enqueueSnackbar(
        <Typography variant="body1">Supplier configurations has been updated successfully.</Typography>,
        {
          variant: "success",
        }
      );
      getSupplierAccountsList()
      GetSupplierConfigs()
    }
    setLoading(false)
  }

  useEffect(() => {
    getTenantList()
    getSupplierAccountsList()
    GetSupplierConfigs()
  }, [])

  // const handleKeyPressCpi = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === '-') {
  //     e.preventDefault();
  //   }
  // };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === '.') {
      e.preventDefault();
    }
  };

  return (
    <DetailsBox sx={{ padding: "2rem" }}>
      {loading ? <LoadingSpinner /> : null}
      {isEdit ?
        <>
          <form onSubmit={handleSubmit(onSubmit)} style={{}}>
            <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
              <Grid item xs={6}>
                <DialogTitle id="alert-dialog-title" color="black" style={{ padding: "0rem" }}>
                  Accounts
                </DialogTitle>
              </Grid>
              <Grid item xs={6}>
              </Grid>
              <Grid item xs={6} md={6}>
                <label style={{ marginLeft: '5px' }}>Accounts*</label>
                <MultipleSelectCheckmarks
                  width="100%"
                  items={tenantList}
                  label=""
                  // disabled={true}
                  handleChange={handleChange}
                  selectedOptions={watch('account_ids') || []}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
              <Grid item xs={6} md={6}>
                <DialogTitle id="alert-dialog-title" color="black" style={{ padding: "0rem" }}>
                  Supplier Supply Configurations
                </DialogTitle>
              </Grid>
              <Grid item xs={6} md={6}>
              </Grid>

              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Min Cpi($)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  // onKeyPress={handleKeyPressCpi}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                      e.preventDefault();
                    }
                    const value = e.currentTarget.value;
                    if (e.key === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  autoSelectOnFocus
                  value={watch('min_cpi')}
                  InputProps={{
                    inputProps: {
                      min: 0,

                    }
                  }}
                  type="text"
                  placeholder="Min Cpi($)"
                  {...register("min_cpi", {
                    required: "Min Cpi is required."
                  })}
                />
                {/* </Box> */}
                {errors.min_cpi && <FormHelperText error>{errors.min_cpi.message}</FormHelperText>}
              </Grid>

              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Max Cpi($)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  // onKeyPress={handleKeyPressCpi}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                      e.preventDefault();
                    }
                    const value = e.currentTarget.value;
                    if (e.key === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  autoSelectOnFocus
                  value={watch('max_cpi')}
                  InputProps={{
                    inputProps: {
                      min: watch('min_cpi'),

                    }
                  }}
                  type="text"
                  placeholder="Max Cpi($)"
                  // {...register("max_cpi", { required: "Max Cpi is required.", min: (watch('min_cpi') || 0) })}
                  {...register("max_cpi", {
                    required: "Max Cpi is required.",
                    validate: value => parseFloat(String(value)) >= parseFloat(String(watch('min_cpi'))) || `Max Cpi must be greater than or equal to ${watch('min_cpi')}`
                  })}
                />
                {/* </Box> */}
                {errors.max_cpi && <FormHelperText error>{errors.max_cpi.message}</FormHelperText>}
              </Grid>

              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Min Ir(%)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  // onKeyPress={handleKeyPressCpi}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                      e.preventDefault();
                    }
                    const value = e.currentTarget.value;
                    if (e.key === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  autoSelectOnFocus
                  value={watch('min_ir')}
                  InputProps={{
                    inputProps: {
                      min: 0,
                      max: 100,

                    }
                  }}
                  type="text"
                  placeholder="Min Ir(%)"
                  {...register("min_ir", { required: "Min Ir is required.", max: 100, min: 0 })}
                />
                {errors.min_ir && <FormHelperText error>{errors.min_ir.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>
              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Max Ir(%)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  // onKeyPress={handleKeyPressCpi}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                      e.preventDefault();
                    }
                    const value = e.currentTarget.value;
                    if (e.key === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  autoSelectOnFocus
                  value={watch('max_ir')}
                  InputProps={{
                    inputProps: {
                      min: watch('min_ir'),
                      max: 100,

                    }
                  }}
                  type="text"
                  placeholder="Max Ir(%)"
                  {...register("max_ir", {
                    required: "Max Ir is required.",
                    validate: value => parseFloat(String(value)) >= parseFloat(String(watch('min_ir'))) || `Max Ir must be greater than or equal to ${watch('min_ir')}`,
                    max: 100
                  })}
                />
                {errors.max_ir && <FormHelperText error>{errors.max_ir.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>

              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Min Loi(mins)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  onKeyPress={handleKeyPress}
                  autoSelectOnFocus
                  value={watch('min_loi')}
                  InputProps={{
                    inputProps: {
                      min: 0,

                    }
                  }}
                  type="number"
                  placeholder="Min Loi(mins)"
                  {...register("min_loi", { required: "Min Loi is required.", min: 0 })}
                />
                {errors.min_loi && <FormHelperText error>{errors.min_loi.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>

              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Max Loi(mins)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  onKeyPress={handleKeyPress}
                  autoSelectOnFocus
                  value={watch('max_loi')}
                  InputProps={{
                    inputProps: {
                      min: watch('min_loi'),

                    }
                  }}
                  type="number"
                  placeholder="Max Loi(mins)"
                  {...register("max_loi", {
                    required: "Max Loi is required.",
                    validate: value => String(value) >= String(watch('min_loi')) || `Max loi must be greater than or equal to ${watch('min_loi')}`,
                    // min: watch('min_loi')
                  })}
                />
                {errors.max_loi && <FormHelperText error>{errors.max_loi.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>

              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Min VCpi($)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  // onKeyPress={handleKeyPressCpi}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                      e.preventDefault();
                    }
                    const value = e.currentTarget.value;
                    if (e.key === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  autoSelectOnFocus
                  value={watch('min_vcpi')}
                  InputProps={{
                    inputProps: {
                      // min: 0,

                    }
                  }}
                  type="text"
                  placeholder="Min VCpi($)"
                  {...register("min_vcpi", { required: "Min VCpi is required.", min: 0 })}
                />
                {errors.min_vcpi && <FormHelperText error>{errors.min_vcpi.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>
              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Max VCpi($)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  // onKeyPress={handleKeyPressCpi}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                      e.preventDefault();
                    }
                    const value = e.currentTarget.value;
                    if (e.key === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  autoSelectOnFocus
                  value={watch('max_vcpi')}
                  InputProps={{
                    inputProps: {
                      min: watch('min_vcpi'),

                    }
                  }}
                  type="text"
                  placeholder="Max VCpi($)"
                  {...register("max_vcpi", {
                    required: "Max VCpi is required.",
                    validate: value => parseFloat(String(value)) >= parseFloat(String(watch('min_vcpi'))) || `Max vcpi must be greater than or equal to ${watch('min_vcpi')}`,
                    // min: watch('min_vcpi')
                  })}
                />
                {errors.max_vcpi && <FormHelperText error>{errors.max_vcpi.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>

              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Min Sample Required*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  onKeyPress={handleKeyPress}
                  autoSelectOnFocus
                  value={watch('min_sample_required')}
                  InputProps={{
                    inputProps: {
                      min: 0,

                    }
                  }}
                  type="number"
                  placeholder="Min Sample Required"
                  {...register("min_sample_required", { required: "Min Sample is required.", min: 0 })}
                />
                {errors.min_sample_required && <FormHelperText error>{errors.min_sample_required.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>

              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Min Conversion(%)*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  // onKeyPress={handleKeyPressCpi}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                      e.preventDefault();
                    }
                    const value = e.currentTarget.value;
                    if (e.key === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  autoSelectOnFocus
                  value={watch('min_conversion')}
                  InputProps={{
                    inputProps: {
                      min: 0,
                      max: 100,

                    }
                  }}
                  type="text"
                  placeholder="Min Conversion(%)"
                  {...register("min_conversion", {
                    required: "Min Conversion is required.",
                    validate: value => parseFloat(String(value)) <= 100 || `Min Conversion must be less than or equal to 100`,
                    min: 0
                  })}
                />
                {errors.min_conversion && <FormHelperText error>{errors.min_conversion.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>


              <Grid item xs={3}>
                <label style={{ marginLeft: "5px" }}>Min Epic*</label>
                {/* <Box sx={boxStyle}> */}
                <TextField
                  // onKeyPress={handleKeyPressCpi}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                      e.preventDefault();
                    }
                    const value = e.currentTarget.value;
                    if (e.key === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  autoSelectOnFocus
                  value={watch('min_epc')}
                  InputProps={{
                    inputProps: {
                      min: 0,

                    }
                  }}
                  type="text"
                  placeholder="Min Epic"
                  {...register("min_epc", { required: "Min Epic is required.", min: 0 })}
                />
                {errors.min_epc && <FormHelperText error>{errors.min_epc.message}</FormHelperText>}
                {/* </Box> */}
              </Grid>

            </Grid>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                pt: 7,
                paddingBottom: '1rem',
              }}
            >
              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                onClick={() => {
                  setIsEdit(false)
                  reset({ ...supplierConfigs, account_ids: supplierAccounts })
                }}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </form>
        </>

        :

        <>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={11}>
              <DialogTitle id="alert-dialog-title" color="black" style={{ padding: "0rem" }}>
                Accounts
              </DialogTitle>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-controls="menu"
                aria-haspopup="true"
                onClick={() => {
                  setIsEdit(true);
                }}
                size="small"
                style={{ alignItems: "center" }}
              >
                <EditIcon fontSize="medium" style={{ color: "#5D5D5D" }} />
              </IconButton>
            </Grid>
            <Grid item xs={6} md={6}>
              <StyledKeys>Accounts</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>
                  {tenantList
                    .filter((val: any) => watch('account_ids')?.includes(val.value))
                    .map((device: any, index: any) => (
                      <span>
                        {index > 0 && ', '}
                        {device.text}
                      </span>
                    ))}
                </StyledValues>
              </StyledValueswithIcons>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={6} md={6}>
              <DialogTitle id="alert-dialog-title" color="black" style={{ padding: "0rem" }}>
                Supplier Supply Configurations
              </DialogTitle>
            </Grid>
            <Grid item xs={6} md={6}>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>

            <Grid item xs={3}>
              <StyledKeys>Min Cpi($)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('min_cpi')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Max Cpi($)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('max_cpi')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Min Ir(%)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('min_ir')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Max Ir(%)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('max_ir')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Min Loi(mins)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('min_loi')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Max Loi(mins)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('max_loi')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Min VCpi($)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('min_vcpi')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Min VCpi($)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('max_vcpi')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Min Sample Required</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('min_sample_required')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Min Conversion(%)</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('min_conversion')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>

            <Grid item xs={3}>
              <StyledKeys>Min Epic</StyledKeys>
              <StyledValueswithIcons>
                <StyledValues>{watch('min_epc')}</StyledValues>
              </StyledValueswithIcons>
            </Grid>
          </Grid>
        </>
      }
    </DetailsBox>
  );
};

export default SupplierPragmaticConfigurationContainer;
