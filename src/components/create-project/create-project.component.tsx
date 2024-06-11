import { CreateProjectProps, IFormProject } from "./create-project.type"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { Autocomplete, Box, Button, Checkbox, Chip, Grid, IconButton, ListItemText, TextField as TextFieldMui } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import React, { useEffect, useState } from "react"
import TextField from "../text-field"
import Select from "@/components/select"
import { ProjectService } from "@/services/projects.service"
import { logger } from "@/helpers/logger"
import {
  ListService,
  ProgrammingSoftwareListType,
} from "@/services/list.service"
import { useSnackbar } from "notistack"
// import MultipleSelectCheckmarks from "../multiple-select"
import LoadingSpinner from "../loader"
import { useNavigate } from "react-router"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
// import Client from "@/assets/images/iconamoon_profile-fill.svg";
import Folder from "@/assets/images/material-symbols-light_folder.svg"
import Title from "@/assets/images/Vector.svg"
import { boxStyle, textFieldStyle } from "./create-project.style"
import { ClientsService } from "@/services/client.service"
// import MultipleSelectCheckmarks from '../multiple-select'
// import { ClientSPType } from "@/types/client.types"

const CreateProject = (props: CreateProjectProps) => {
  const { open, handleClose } = props
  const [clients, setClients] = React.useState<any[]>([])
  const [clientSelected, setClientSelected] = useState(false)
  const [marketList, setMarketList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  const clientService = new ClientsService()
  const projectService = new ProjectService()
  const listServices = new ListService()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, setValue } = useForm<IFormProject>({
    defaultValues: {
      client_id: null,
      project_name: '',
      project_code: '',
      market_id: [],
      status_id: null,
      start_date: '',
      end_date: '',
      project_description: '',
      // opportunity_cost: 0,
      programming_software: 0,
    },
  })

  const [programmingSoftwareList, setProgrammingSoftwareList] = useState<Array<ProgrammingSoftwareListType>>([])

  // useEffect(() => {
  //   listServices
  //     .get_programming_software_list()
  //     .then((data) => setProgrammingSoftwareList(data))
  // }, [])

  useEffect(() => {
    if (clientSelected && watch('client_id')) {
      clientService.getClientSP(watch('client_id')).then((data) => setProgrammingSoftwareList(data))
    }
  }, [clientSelected, watch('client_id')])

  const getAndSetClients = async () => {
    try {
      const data: any = await projectService.get_clients()
      setClients(data?.clients)
    } catch (error) {
      logger.error(error)
    }
  }

  const getClientsSPList = async () => {
    try {
      const data = await clientService.getClientSP(watch('client_id'))
      console.log(data)
    } catch (error) {
      logger.error(error)
    }
  }

  const getMarketList = async () => {
    try {
      const data = await listServices.get_market_list()
      if (data && data) {
        const serviceNames = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }))
        setMarketList(serviceNames)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  React.useEffect(() => {
    getAndSetClients()
    getMarketList()
  }, [])

  const onSubmit: SubmitHandler<IFormProject> = async (data) => {
    setLoading(true)
    const payload = {
      client_id: Number(data.client_id),
      project_name: data.project_name,
      project_code: data.project_code,
      status_id: 1,
      project_description: data.project_description,
      market_id: data.market_id,
      programming_software: data.programming_software,
      // opportunity_cost: Number(data?.opportunity_cost),
    }
    console.log(payload)

    try {
      const data = await projectService.post_project(payload)
      handleClose()
      resetForm()
      navigate(`/projects/${data?.project_id}/overview`)
      enqueueSnackbar('Project Sucessfully Created', {
        variant: 'success',
      })
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
      enqueueSnackbar('Oops somthing went wrong !!', {
        variant: 'error',
      })
    }
  }

  const canSave =
    !!watch('client_id') &&
    !!watch('project_name') &&
    !!watch('project_code') &&
    // !!watch("opportunity_cost") &&
    watch('market_id').length !== 0

  const newprojectName = watch('project_name')
  const newClientName = watch('client_id')
  const data = clients.find((item) => item?.client_id && item.client_id == String(newClientName))?.client_name

  React.useEffect(() => {
    let projectCode = ''

    if (data) {
      projectCode = data?.slice(0, 2).toUpperCase()
    }

    if (newprojectName && projectCode) {
      projectCode += '/'
    }

    projectCode += newprojectName?.slice(0, 2).toUpperCase()
    setValue('project_code', projectCode)
  }, [newprojectName, newClientName, setValue])

  const resetForm = () => {
    setValue('client_id', null)
    setValue('market_id', [])
    setValue('project_code', '')
    setValue('project_name', '')
    setValue('project_description', '')
    setValue('programming_software', null)
    // setValue("opportunity_cost", 0)
  }

  // const handleChange = (selected: { value: string | number; text: string }[]) => {
  //   setValue(
  //     'market_id',
  //     selected.map((item) => Number(item.value)),
  //   )
  // }

  const handleChange = (_event: any, newValue: any[]) => {
    const selectedIds = newValue.map((item: any) => item?.value)
    setValue('market_id', selectedIds);
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginRight: '10px',
          marginTop: '10px',
        }}
      >
        <DialogTitle id="alert-dialog-title" color="black" style={{ padding: "0rem 1.5rem" }}>
          Create New Project
        </DialogTitle>
        <IconButton
          onClick={() => {
            resetForm()
            handleClose()
          }}
          sx={{ width: '40px', height: '40px' }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            width: '0.5em',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent',
          },
          padding: "0rem 1.5rem 1.5rem 1.5rem"
        }}
      >
        <React.Fragment>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} marginTop={'0.10rem'}>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Client*</label>
                <Select
                  value={watch('client_id')?.toString() || ''}
                  items={clients.map((client) => ({
                    text: client.name,
                    value: client?.id?.toString() || '',
                  }))}
                  name="client_id"
                  label=""
                  register={register as any}
                  isRequired={true}
                  onChange={() => {
                    setClientSelected(true)
                    getClientsSPList()
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: '#9C9C9C',
                    paddingTop: '10px',
                    '@media (max-width: 963px)': {
                      width: '300px',
                    },
                    '@media (max-width: 733px)': {
                      width: '250px',
                    },
                    '@media (max-width: 627px)': {
                      width: '200px',
                    },
                    '@media (max-width: 523px)': {
                      width: '150px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Project Name*</label>
                <Box sx={boxStyle}>
                  <img src={Folder} alt="" style={{ paddingLeft: '10px' }} />
                  <TextField placeholder="Name" {...register('project_name', { required: true })} sx={textFieldStyle} />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Project Code*</label>
                <Box sx={boxStyle}>
                  <img src={Title} alt="" style={{ paddingLeft: '10px' }} />
                  <TextField
                    placeholder="Code"
                    {...register('project_code', { required: true })}
                    InputLabelProps={{
                      shrink: data || (newprojectName && data) || newprojectName ? true : false,
                    }}
                    sx={textFieldStyle}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Programming Software*</label>
                <Select
                  value={watch('programming_software')?.toString() || ''}
                  items={programmingSoftwareList.map((software) => ({
                    text: software.name,
                    value: software.id?.toString() || '',
                  }))}
                  register={register as any}
                  name="programming_software"
                  label=""
                  isRequired={true}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: '#9C9C9C',
                    paddingTop: '10px',
                    '@media (max-width: 963px)': {
                      width: '300px',
                    },
                    '@media (max-width: 733px)': {
                      width: '250px',
                    },
                    '@media (max-width: 627px)': {
                      width: '200px',
                    },
                    '@media (max-width: 523px)': {
                      width: '150px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px' }}>Market*</label>
                <Autocomplete
                  multiple
                  id="size-small-standard-multi"
                  // size="small"
                  options={marketList}
                  getOptionLabel={(option) => option.text}
                  value={marketList.filter((item: any) => watch('market_id')?.includes(item.value))}
                  onChange={handleChange}
                  disableCloseOnSelect
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.text}
                        {...getTagProps({ index })}
                        disabled={option.disabled}
                      />
                    ))
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <ListItemText primary={option.text} />
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextFieldMui
                      {...params}
                      variant="standard"
                      // label={'Questions'}
                      placeholder="Search markets"
                    />
                  )}

                  sx={{
                    paddingTop: "0.5rem",
                    '& .MuiAutocomplete-inputRoot': {
                      flexWrap: 'nowrap !important',
                      overflowX: 'auto',
                    },
                    '& .MuiAutocomplete-tag': {
                      margin: '2px',
                      flexShrink: 0,
                    },
                    '& .MuiAutocomplete-tagList': {
                      display: 'flex',
                      flexDirection: 'row',
                      overflowX: 'auto',
                      flexWrap: 'nowrap',
                    },
                    '& .MuiAutocomplete-paper': {
                      overflow: 'visible',
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      position: 'relative',
                      right: 0,
                      display: 'none',
                    },
                    '.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      '& > :nth-last-child(-n+2)': {
                        flexBasis: '100%',
                        width: '100%',
                      },
                    },
                  }}
                />
                {/* <MultipleSelectCheckmarks
                  label=""
                  width="100%"
                  items={marketList}
                  handleChange={handleChange}
                  selectedOptions={watch('market_id')}
                  style={{ marginTop: '10px' }}
                /> */}
                {/* <Select
                  value={watch('market_id')?.toString() || ''}
                  items={marketList}
                  name="market_id"
                  label=""
                  register={register as any}
                  isRequired={true}
                  // onChange={() => {
                  //   setClientSelected(true)
                  //   getClientsSPList()
                  // }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: '#9C9C9C',
                    paddingTop: '10px',
                    '@media (max-width: 963px)': {
                      width: '300px',
                    },
                    '@media (max-width: 733px)': {
                      width: '250px',
                    },
                    '@media (max-width: 627px)': {
                      width: '200px',
                    },
                    '@media (max-width: 523px)': {
                      width: '150px',
                    },
                  }}
                /> */}
              </Grid>
              {/* <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Opportunity cost*</label>
                <Box sx={boxStyle}>
                  <TextField
                    type="number"
                    // placeholder='Opportunity cost'
                    {...register('opportunity_cost', { required: true })}
                    sx={{
                      // width: "333px",
                      height: '40px',
                      '& fieldset': { border: 'none' },
                    }}
                  />
                </Box>
              </Grid> */}
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px' }}>Description</label>
                <TextField
                  placeholder="Type here"
                  fullWidth
                  multiline={true}
                  rows={5}
                  InputProps={{
                    style: {
                      padding: '10px',
                    },
                  }}
                  {...register('project_description', { required: false })}
                  sx={{ paddingTop: '10px', paddingBottom: '40px' }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              {/* <Button
                onClick={() => {
                  resetForm();
                  handleClose();
                }}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                Cancel
              </Button> */}
              <Button type="submit" variant="contained" disabled={!canSave || loading}>
                Create
              </Button>
            </Box>
          </form>
        </React.Fragment>
      </DialogContent>
      {loading ? <LoadingSpinner /> : null}
    </Dialog>
  )
}

export default CreateProject
