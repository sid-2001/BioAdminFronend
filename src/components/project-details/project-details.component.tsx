import { Box } from '@mui/system'
import {
  // CardMenu,
  // CardSubMenu,
  DetailsBox,
  StyledKeys,
  StyledValues,
  StyledValueswithIcons,
} from './project-details.style'
// import MultipleSelectCheckmarks from '../multiple-select'
import {
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  // Link, List, ListItem, ListItemAvatar, Avatar, ListItemText, Stack
} from '@mui/material'
// import FolderIcon from '@mui/icons-material/Folder'
import { ProjectDetailsProps } from './project-details.type'
import { useEffect, useState } from 'react'
import { ListService, ProgrammingSoftwareListType } from '@/services/list.service'
import { logger } from '@/helpers/logger'
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextField from '../text-field'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IFormProject } from '../create-project/create-project.type'
import { ProjectService } from '@/services/projects.service'
import { useSnackbar } from 'notistack'
import Select from '@/components/select'
import LoadingSpinner from '../loader'
// import Attachments from "@/assets/images/Frame 48097132.svg";
// import Tick from "@/assets/images/Frame 48097133.svg";
// import { useNavigate, useParams } from "react-router-dom";
// import InputAdornment from "@mui/material/InputAdornment";
// import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from '@mui/icons-material/Edit'
// import Divider from "@mui/material/Divider";
// import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
// import TerminalIcon from '@mui/icons-material/Terminal';
// import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { ActivityLogs } from '@/types/project.type'
import {
  ObjectTypes,
  //  ProjecFileType
} from '@/enums'
import { useParams } from 'react-router-dom'
import moment from 'moment'
// import ContentCopyIcon from '@mui/icons-material/ContentCopy'
// import OpenInNewIcon from '@mui/icons-material/OpenInNew'
// import CloudUploadIcon from '@mui/icons-material/CloudUpload'
// import { CopyToClipboard } from 'react-copy-to-clipboard'
// import CloseIcon from "@mui/icons-material/Close";
// import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import { theme } from '@/constants/theme'
import { ClientsService } from '@/services/client.service'
import MultipleSelectCheckmarks from '../multiple-select'

interface ThemeListTypes {
  text: string
  value: number
}

const ProjectDetailsComponent = (props: ProjectDetailsProps) => {
  const { project, get_project_byid, isLoading } = props
  const [marketList, setMarketList] = useState<any>([])
  const [isEdit, setIsEdit] = useState(false)
  const [_anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [clients, setClients] = useState<any[]>([])
  const [statusList, setStatusList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [activityList, setActivityList] = useState<Array<ActivityLogs>>()
  const [programmingSoftwareList, setProgrammingSoftwareList] = useState<Array<ProgrammingSoftwareListType>>([])
  const [themeList, setThemeList] = useState<ThemeListTypes[]>([])
  // files
  // const [definitionFile, setDefinitionFile] = useState(null)
  // const [dataFile, setDataFile] = useState(null)
  const [clientId, setClientId] = useState<number>()
  // console.log(definitionFile, "definitionFiledefinitionFile")
  // const handleDataFileChange = (event: any) => {
  //   const file = event.target.files[0]
  //   if (file) {
  //     setDataFile(file)
  //   }
  //   event.target.value = null
  // }

  // const handleDefinitionFileChange = (event: any) => {
  //   const file = event.target.files[0]
  //   if (file) {
  //     setDefinitionFile(file)
  //   }
  //   event.target.value = null
  // }

  // const removeDataFile = () => {
  //   setDataFile(null)
  // }

  // const removeDefinitionFile = () => {
  //   setDefinitionFile(null)
  // }

  // const handleSubmitFiles = async () => {
  //   let surveyId
  //   if (dataFile) {
  //     const formData = new FormData()
  //     formData.append('files', dataFile)
  //     try {
  //       await projectService.postProjectDataFile(Number(projectId), Number(surveyId), formData, (_progressEvent: any) => { })

  //       setDataFile(null)
  //       enqueueSnackbar('Data File Sucessfully Uploded', {
  //         variant: 'success',
  //       })
  //     } catch (error) {
  //       logger.error(error)
  //     }
  //   }
  //   if (definitionFile) {
  //     const formData = new FormData()
  //     formData.append('files', definitionFile)
  //     try {
  //       await projectService.postProjectDefinitionFile(Number(projectId), formData, (_progressEvent: any) => { })

  //       setDefinitionFile(null)
  //       enqueueSnackbar('Defination File Sucessfully Uploded', {
  //         variant: 'success',
  //       })
  //       // console.log(data)
  //     } catch (error) {
  //       logger.error(error)
  //     }
  //   }
  //   get_project_byid()
  // }

  const projectService = new ProjectService()
  const listServices = new ListService()
  const clientService = new ClientsService()
  const { enqueueSnackbar } = useSnackbar()
  // let nevigate = useNavigate();
  const { projectId } = useParams()

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
      bb_live_link: '',
      bb_test_link: '',
      sp_live_link: '',
      sp_test_link: '',
      programming_software: null,
      theme: '',
    },
  })

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   event.stopPropagation();
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleCopyToClipboard = () => {
  //   enqueueSnackbar('Copied to clipboard', {
  //     variant: 'success',
  //   })
  // }

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(null)
  }
  // const open = Boolean(anchorEl);

  const canSave = !!watch('client_id') && !!watch('project_name') && !!watch('project_code') && watch('market_id').length !== 0

  const handleChange = (selected: { value: string | number; text: string }[]) => {
    setValue(
      'market_id',
      selected.map((item) => Number(item.value)),
    )
  }

  const getAndSetClients = async () => {
    try {
      const data: any = await projectService.get_clients()
      setClients(data?.clients)
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

  const getActivity = async () => {
    try {
      const data: any = await projectService.get_activity_logs(Number(projectId), ObjectTypes.PROJECT)
      setActivityList(data)
    } catch (error) {
      logger.error(error)
    }
  }

  const getProjectStatus = async () => {
    try {
      const data = await listServices.get_project_status()
      if (data && data) {
        // @ts-ignore
        const response = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }))
        setStatusList(response)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  const getThemeList = async () => {
    try {
      const data = await listServices.get_theme_list()
      if (data && data) {
        const themeData = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }))
        setThemeList(themeData)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  const getClientsSPList = async () => {
    try {
      if (clientId) {
        const data = await clientService.getClientSP(clientId)
        setProgrammingSoftwareList(data)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  useEffect(() => {
    getAndSetClients()
    getMarketList()
    getProjectStatus()
    getActivity()
    getThemeList()
  }, [])

  // const deleteProject = async () => {
  //   try {
  //     await projectService.delete_project(String(projectId));
  //     nevigate("/projects");
  //   } catch (error) {
  //     logger.error(error);
  //   }
  // };

  const onSubmit: SubmitHandler<IFormProject> = async (data) => {
    setLoading(true)

    // if (dataFile || definitionFile) {
    //   await handleSubmitFiles()
    // }
    // removeDataFile()
    // removeDefinitionFile()

    const payload = {
      client_id: Number(data.client_id),
      project_name: data.project_name,
      // opportunity_cost: Number(data.opportunity_cost),
      project_code: data.project_code,
      status_id: Number(data.status_id),
      project_description: data.project_description,
      bb_test_link: data.bb_test_link,
      bb_live_link: data.bb_live_link,
      sp_test_link: data.sp_test_link,
      sp_live_link: data.sp_live_link,
      market_id: data.market_id,
      sp_document_url: (project as any)?.sp_document_url || '',
      programming_software: data.programming_software,
      layout_id: Number(data.theme),
    }
    try {
      const data = await projectService.put_project(String(project.project_id), payload)
      enqueueSnackbar('Project Successfully Updated', {
        variant: 'success',
      })
      setIsEdit(false)
      if (data) {
        get_project_byid()
        getActivity()
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      enqueueSnackbar('Oops something went wrong !!', {
        variant: 'error',
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    if (project !== null) {
      setClientId(project?.client_id)
      setValue('client_id', project?.client_id)
      setValue('market_id', project?.market_id)
      setValue('project_code', project?.project_code)
      setValue('project_name', project?.project_name)
      setValue('project_description', project?.project_description)
      setValue('bb_live_link', project?.bb_live_link)
      setValue('bb_test_link', project?.bb_test_link)
      setValue('sp_live_link', project?.sp_live_link)
      setValue('sp_test_link', project?.sp_test_link)
      setValue('status_id', Number(project?.status_id))
      setValue('programming_software', Number(project?.programming_software))
      // setValue("data_file_url", String(project?.data_file_url));
      // setValue("definition_file_url", String(project?.definition_file_url));
      setValue('xml_schema_url', String(project?.xml_schema_url))
      setValue('sp_xml_url', String(project?.sp_xml_url))
      setValue('theme', String(project?.layout_id))

      // projectService.get_project_files(projectId, []).then((response) => {
      //   response.filter((e) => e.filetype_id == ProjecFileType.DOCS)
      //   const data_file = response.filter((e) => e.filetype_id == ProjecFileType.PROJ_RESP_DATA)

      //   const definition_file = response.filter((e) => e.filetype_id == ProjecFileType.PROJ_DEFINITION)
      //   if (data_file.length > 0) {
      //     setValue('data_file_url', String(data_file[0].file_url))
      //     project.data_file_url = String(data_file[0].file_url)
      //   }
      //   if (definition_file.length > 0) {
      //     setValue('definition_file_url', String(definition_file[0].file_url))
      //     project.definition_file_url = String(definition_file[0].file_url)
      //   }
      // })
    }
  }, [project])

  // function truncateText(text: string, length: number) {
  //   if (text.length <= length) {
  //     return text
  //   }
  //   return `${text.substr(0, length)}...`
  // }

  useEffect(() => {
    if (clientId) {
      getClientsSPList()
    }
  }, [clientId])
  return (
    <DetailsBox sx={{ padding: '2rem', display: 'flex' }}>
      {isEdit ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '60%' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Client*</label>
                <Select
                  value={watch('client_id')?.toString() || ''}
                  items={clients.map((client) => ({
                    text: client.name,
                    value: client?.id?.toString() || '',
                  }))}
                  name="client_id"
                  register={register as any}
                  label=""
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Project Name*</label>
                <TextField
                  InputProps={
                    {
                      // startAdornment: (
                      //   <InputAdornment>
                      //     <FolderIcon sx={{marginRight: "10px"}}/>
                      //   </InputAdornment>
                      // ),
                    }
                  }
                  {...register('project_name', { required: true })}
                  sx={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Project Code*</label>
                <TextField
                  {...register('project_code', { required: true })}
                  InputProps={
                    {
                      // startAdornment: (
                      //   <InputAdornment>
                      //     <FolderIcon sx={{marginRight: "10px"}}/>
                      //   </InputAdornment>
                      // ),
                    }
                  }
                  sx={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Programming Software*</label>
                <Select
                  value={watch('programming_software')?.toString() || ''}
                  items={programmingSoftwareList.map((software) => ({
                    text: software.name,
                    value: software.id?.toString() || '',
                  }))}
                  name="programming_software"
                  label=""
                  register={register as any}
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Status*</label>
                <Select
                  value={watch('status_id')?.toString() || ''}
                  items={statusList}
                  name="status_id"
                  label=""
                  register={register as any}
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Market*</label>
                <MultipleSelectCheckmarks
                  width="100%"
                  items={marketList}
                  label=""
                  disabled={true}
                  handleChange={handleChange}
                  selectedOptions={watch('market_id')}
                  style={{ paddingTop: '5px' }}
                />
                {/* <Select
                  value={watch('market_id')?.toString() || ''}
                  items={marketList}
                  name="market_id"
                  label=""
                  register={register as any}
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                /> */}
              </Grid>

              {/* <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Opportunity cost*</label>
                <TextField
                  type="number"
                  {...register("opportunity_cost", { required: true })}

                  sx={{ paddingTop: "5px" }}
                />
              </Grid> */}
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Theme</label>
                <Select
                  value={watch('theme')?.toString() || ''}
                  items={themeList}
                  name="theme"
                  label=""
                  register={register as any}
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px', marginBottom: '5px' }}>Description</label>
                <TextField
                  placeholder="Add Project description here"
                  fullWidth
                  multiline={true}
                  rows={3}
                  style={{}}
                  InputProps={{
                    style: {
                      padding: '10px',
                    },
                  }}
                  {...register('project_description', { required: false })}
                  sx={{ paddingTop: '5px' }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <label style={{ marginLeft: '5px', marginBottom: '5px' }}>Test URL</label>
                <TextField
                  placeholder="Test URL"
                  fullWidth
                  multiline={true}
                  rows={2}
                  style={{}}
                  InputProps={{
                    style: {
                      padding: '10px',
                    },
                  }}
                  {...register('bb_test_link', { required: false })}
                  sx={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px', marginBottom: '5px' }}>Live URL</label>
                <TextField
                  placeholder="Live URL"
                  fullWidth
                  multiline={true}
                  rows={2}
                  style={{}}
                  InputProps={{
                    style: {
                      padding: '10px',
                    },
                  }}
                  {...register('bb_live_link', { required: false })}
                  sx={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px', marginBottom: '5px' }}>SP Test URL</label> 
                <TextField
                  placeholder="Test URL"
                  fullWidth
                  multiline={true}
                  rows={2}
                  style={{}}
                  InputProps={{
                    style: {
                      padding: '10px',
                    },
                  }}
                  {...register('sp_test_link', { required: false })}
                  sx={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px', marginBottom: '5px' }}>SP Live URL</label>
                <TextField
                  placeholder="Live URL"
                  fullWidth
                  multiline={true}
                  rows={2}
                  style={{}}
                  InputProps={{
                    style: {
                      padding: '10px',
                    },
                  }}
                  {...register('sp_live_link', { required: false })}
                  sx={{ paddingTop: '5px' }}
                />
              </Grid> */}

              {/* <Grid item xs={6}>
                <Box style={{ padding: '0.5rem' }}>
                  <List>
                    {(project?.data_file_url || isEdit) && (
                      <Tooltip title={dataFile ? (dataFile as any)?.name : project?.data_file_url?.split('/')?.pop()} placement="bottom-start">
                        <ListItem
                          sx={{
                            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                            marginBottom: '10px',
                          }}
                          secondaryAction={
                            <Stack direction="row" spacing={0.5}>
                              <input type="file" accept=".xlsx" onChange={handleDataFileChange} style={{ display: 'none' }} id="data-file-upload" />
                              <label htmlFor="data-file-upload">
                                <IconButton component="span">
                                  <CloudUploadIcon />
                                </IconButton>
                              </label>
                              <Link
                                href={`${project?.data_file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <IconButton edge="end" aria-label="delete">
                                  <DownloadForOfflineIcon />
                                </IconButton>
                              </Link>
                            </Stack>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <FolderIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Data File"
                            secondary={
                              dataFile
                                ? truncateText((dataFile as any)?.name, 30)
                                : project?.data_file_url?.split('/')?.pop()
                                  ? truncateText(String(project?.data_file_url?.split('/')?.pop()), 30)
                                  : null
                            }
                          />
                        </ListItem>
                      </Tooltip>
                    )}
                    {(project?.definition_file_url || isEdit) && (
                      <Tooltip
                        title={definitionFile ? (definitionFile as any)?.name : project?.definition_file_url?.split('/')?.pop()}
                        placement="bottom-start"
                      >
                        <ListItem
                          sx={{
                            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                          }}
                          secondaryAction={
                            <Stack direction="row" spacing={0.5}>
                              <input
                                type="file"
                                accept=".xml"
                                onChange={handleDefinitionFileChange}
                                style={{ display: 'none' }}
                                id="definition-file-upload"
                              />
                              <label htmlFor="definition-file-upload">
                                <IconButton component="span">
                                  <CloudUploadIcon />
                                </IconButton>
                              </label>

                              <Link
                                href={`${project?.definition_file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <IconButton edge="end" aria-label="delete">
                                  <DownloadForOfflineIcon />
                                </IconButton>
                              </Link>
                            </Stack>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <FolderIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Definition File"
                            secondary={
                              definitionFile
                                ? truncateText((definitionFile as any)?.name, 30)
                                : project?.definition_file_url?.split('/')?.pop()
                                  ? truncateText(String(project?.definition_file_url?.split('/')?.pop()), 30)
                                  : null
                            }
                          />
                        </ListItem>
                      </Tooltip>
                    )}
                  </List>
                </Box>
              </Grid> */}
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 7 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                onClick={() => {
                  setIsEdit(false)
                }}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={!canSave || loading}>
                Save
              </Button>
            </Box>
          </form>
          {/* <Divider orientation="vertical" variant="middle" flexItem sx={{ marginLeft: "30px", borderRightWidth: 2, backgroundColor: "#5D5D5D"}}/> */}
        </>
      ) : (
        <>
          <Box component="div" sx={{ display: 'flex', gap: '2rem', width: '60%' }}>
            <Box component="div" sx={{ flex: 1 }}>
              <Grid container spacing={2} sx={{ marginBottom: '3rem' }}>
                <Grid item xs={6} md={6} sx={{ wordBreak: 'break-word' }}>
                  <StyledKeys>Client</StyledKeys>
                  <StyledValues>
                    {project && project?.client_name && project?.client_name?.charAt(0)?.toUpperCase() + project?.client_name?.slice(1)}
                  </StyledValues>
                </Grid>
                <Grid item xs={6} md={6}>
                  <StyledKeys>Project Name</StyledKeys>
                  <StyledValueswithIcons>
                    {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                    <StyledValues>{project?.project_name}</StyledValues>
                  </StyledValueswithIcons>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledKeys>Project code</StyledKeys>
                  <StyledValueswithIcons>
                    {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                    <StyledValues>{project?.project_code}</StyledValues>
                  </StyledValueswithIcons>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledKeys>Programming Software</StyledKeys>
                  <StyledValueswithIcons>
                    {/* <TerminalIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                    <StyledValues>
                      {programmingSoftwareList
                        .filter((val: any) => Number(val.id) === Number(watch('programming_software')))
                        .map((software: any, index: any) => (
                          <span>
                            {index > 0 && ', '}
                            {software.name}
                          </span>
                        ))}
                    </StyledValues>
                  </StyledValueswithIcons>
                </Grid>
                <Grid item xs={6}>
                  <StyledKeys>Status</StyledKeys>
                  <StyledValueswithIcons>
                    {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                    <StyledValues>{project?.status_name}</StyledValues>
                  </StyledValueswithIcons>
                </Grid>
                <Grid item xs={6}>
                  <StyledKeys>Market</StyledKeys>
                  <StyledValueswithIcons>
                    {/* <PublicOutlinedIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                    <StyledValues>
                      {marketList
                        .filter((val: any) => watch('market_id')?.includes(val.value))
                        .map((market: any, index: any) => (
                          <span>
                            {index > 0 && ', '}
                            {market.text}
                          </span>
                        ))}
                    </StyledValues>
                  </StyledValueswithIcons>
                </Grid>
                {/* <Grid item xs={6} md={6}>
                  <StyledKeys>Opportunity cost</StyledKeys>
                  <StyledValueswithIcons>
                    <StyledValues>{project?.opportunity_cost}</StyledValues>
                  </StyledValueswithIcons>
                </Grid> */}
                <Grid item xs={6}>
                  <StyledKeys>Theme</StyledKeys>
                  <StyledValueswithIcons>
                    {/* <PublicOutlinedIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                    <StyledValues>{themeList.find((val: any) => Number(watch('theme')) === Number(val.value))?.text}</StyledValues>
                  </StyledValueswithIcons>
                </Grid>
                <Grid item xs={12}>
                  <StyledKeys>Description</StyledKeys>
                  <StyledValues>{project?.project_description}</StyledValues>
                </Grid>
                {/* {project?.bb_test_link && (
                  <Grid item xs={12}>
                    <StyledKeys>Test URL</StyledKeys>
                    <StyledValueswithIcons>
                      {project?.bb_test_link && (
                        <>
                          {project?.bb_test_link}
                          <Box>
                            <CopyToClipboard text={project?.bb_test_link} onCopy={handleCopyToClipboard}>
                              <IconButton>
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </CopyToClipboard>
                            <IconButton>
                              <OpenInNewIcon fontSize="small" onClick={() => window.open(project.bb_test_link, '_blank')} />
                            </IconButton>
                          </Box>
                        </>
                      )}
                    </StyledValueswithIcons>
                  </Grid>
                )}
                {project?.bb_live_link && (
                  <Grid item xs={12}>
                    <StyledKeys>Live URL</StyledKeys>
                    <StyledValueswithIcons>
                      {project?.bb_live_link && (
                        <>
                          {project?.bb_live_link}
                          <Box>
                            <CopyToClipboard text={project?.bb_live_link} onCopy={handleCopyToClipboard}>
                              <IconButton>
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </CopyToClipboard>
                            <IconButton>
                              <OpenInNewIcon fontSize="small" onClick={() => window.open(project.bb_live_link, '_blank')} />
                            </IconButton>
                          </Box>
                        </>
                      )}
                    </StyledValueswithIcons>
                  </Grid>
                )}
                {project?.sp_test_link && (
                  <Grid item xs={12}>
                    <StyledKeys>SP Test URL</StyledKeys>
                    <StyledValueswithIcons>
                      {project?.sp_test_link && (
                        <>
                          {project?.sp_test_link}
                          <Box>
                            <CopyToClipboard text={project?.sp_test_link} onCopy={handleCopyToClipboard}>
                              <IconButton>
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </CopyToClipboard>
                            <IconButton>
                              <OpenInNewIcon fontSize="small" onClick={() => window.open(project.sp_test_link, '_blank')} />
                            </IconButton>
                          </Box>
                        </>
                      )}
                    </StyledValueswithIcons>
                  </Grid>
                )}
                {project?.sp_test_link && (
                  <Grid item xs={12}>
                    <StyledKeys>SP Live URL</StyledKeys>
                    <StyledValueswithIcons>
                      {project?.sp_live_link && (
                        <>
                          {project?.sp_live_link}
                          <Box>
                            <CopyToClipboard text={project?.sp_live_link} onCopy={handleCopyToClipboard}>
                              <IconButton>
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </CopyToClipboard>
                            <IconButton>
                              <OpenInNewIcon fontSize="small" onClick={() => window.open(project.sp_live_link, '_blank')} />
                            </IconButton>
                          </Box>
                        </>
                      )}
                    </StyledValueswithIcons>
                  </Grid>
                )} */}

                {/* <Grid item xs={6}>
                  <List>
                    {project?.data_file_url && (
                      <ListItem
                        sx={{
                          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                          marginBottom: '10px',
                        }}
                        secondaryAction={
                          <Link
                            href={`${project?.data_file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <IconButton edge="end" aria-label="delete">
                              <DownloadForOfflineIcon />
                            </IconButton>
                          </Link>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Data File"
                          secondary={
                            project?.data_file_url.split('/')?.pop() ? truncateText(String(project?.data_file_url.split('/')?.pop()), 30) : null
                          }
                        />
                      </ListItem>
                    )}
                    {project?.definition_file_url && (
                      <ListItem
                        sx={{
                          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                          marginBottom: '10px',
                        }}
                        secondaryAction={
                          <Link
                            href={`${project?.definition_file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <IconButton edge="end" aria-label="delete">
                              <DownloadForOfflineIcon />
                            </IconButton>
                          </Link>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Definition File"
                          secondary={
                            project?.definition_file_url.split('/')?.pop()
                              ? truncateText(String(project?.definition_file_url.split('/')?.pop()), 30)
                              : null
                          }
                        />
                      </ListItem>
                    )}
                    {project?.schema_url && (
                      <ListItem
                        sx={{
                          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                        }}
                        secondaryAction={
                          <Link
                            href={`${project?.schema_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <IconButton edge="end" aria-label="delete">
                              <DownloadForOfflineIcon />
                            </IconButton>
                          </Link>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Schema File"
                          secondary={project?.schema_url.split('/')?.pop() ? truncateText(String(project?.schema_url.split('/')?.pop()), 35) : null}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid> */}
              </Grid>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-top',
                height: '32px',
              }}
            >
              <IconButton
                aria-controls="menu"
                aria-haspopup="true"
                onClick={(e) => {
                  setIsEdit(true)
                  handleClose(e)
                }}
                size="small"
                style={{ alignItems: 'start' }}
              >
                {/* <EditIcon fontSize="medium" style={{ color: "#5D5D5D" }} /> */}
                <EditIcon fontSize="medium" style={{ color: '#5D5D5D' }} />
              </IconButton>
              {/* <CardMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              //@ts-ignore
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <CardSubMenu
                onClick={(e) => {
                  deleteProject();
                  handleClose(e);
                }}
              >
                Delete
              </CardSubMenu>
              <CardSubMenu
                onClick={(e) => {
                  setIsEdit(true);
                  handleClose(e);
                }}
              >
                Edit
              </CardSubMenu>
            </CardMenu> */}
            </Box>
          </Box>

          {/* <Divider orientation="vertical" variant="middle" flexItem sx={{ marginLeft: "30px", borderRightWidth: 2, backgroundColor: "#5D5D5D"}}/> */}

          <Timeline position="right" sx={{ maxHeight: '700px', overflowY: 'auto' }}>
            {activityList?.map((activity: ActivityLogs, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <div
                    style={{
                      width: '300px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Tooltip placement="left" arrow title={activity?.log_name.length > 25 ? activity?.log_name : ''}>
                      <span>
                        {activity?.log_name && activity?.log_name.length > 25 ? activity?.log_name.substring(0, 25) + '...' : activity?.log_name}
                      </span>
                    </Tooltip>
                  </div>

                  <Typography
                    sx={{
                      marginTop: '1px',
                      fontSize: '13px',
                      color: theme.palette.secondary.light,
                    }}
                  >
                    {/* {activity?.user_name} */}
                  </Typography>
                  <Tooltip placement="left" arrow title={activity?.description.length > 40 ? activity?.description : ''}>
                    <Typography
                      sx={{
                        marginTop: '1px',
                        color: theme.palette.grey[500],
                        fontSize: '12px',
                      }}
                    >
                      {activity?.description && activity?.description.length > 45
                        ? activity?.description.substring(0, 45) + '...'
                        : activity?.description}
                    </Typography>
                  </Tooltip>

                  <div
                    style={{
                      // display: "flex",
                      marginTop: '5px',
                      fontSize: '12px',
                      // alignItems: "flex-end",
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <span
                      style={{
                        color: theme.palette.primary.main,
                        fontSize: '12px',
                      }}
                    >
                      {activity?.user_name}
                    </span>
                    |
                    <span
                      style={{
                        color: theme.palette.grey[500],
                        fontSize: '12px',
                        marginLeft: '3px',
                      }}
                    >
                      {activity?.created_at ? moment(activity.created_at).fromNow() : 'NA'}
                    </span>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </>
      )}
      {loading || isLoading ? <LoadingSpinner /> : null}
    </DetailsBox>
  )
}
export default ProjectDetailsComponent
