import { Box } from '@mui/system'
import {
  // CardMenu,
  // CardSubMenu,
  DetailsBox,
  StyledKeys,
  StyledValues,
  StyledValueswithIcons,
} from '@/components/project-details/project-details.style'
import { Avatar, Button, Grid, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import TextField from '@/components/text-field'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import LoadingSpinner from '@/components/loader'
import EditIcon from '@mui/icons-material/Edit'
import { useParams } from 'react-router-dom'
import { useOutletContext } from 'react-router'
import { SurveysService } from '@/services/surveys.service'
import { Inputs as SurveyType } from '@/containers/surveys-list/surveys-list.container'
import moment from 'moment'
import Select from '@/components/select'
import { ProjectService } from '@/services/projects.service'
import { Project } from '@/types/project.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { URL_REGEX } from '@/constants/constants'
import { ListService } from '@/services/list.service'
import MultipleSelectCheckmarks from '@/components/multiple-select'
// import { SurveySchema } from "@/containers/surveys-list/create-survey"
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import FolderIcon from '@mui/icons-material/Folder'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { logger } from '@/helpers/logger'

const SurveySchema = z.object({
  survey_live_link: z
    .string()
    .optional()
    .refine((value): value is string => typeof value === 'string' && (value === '' || URL_REGEX.test(value)), {
      message: 'Valid URL required',
    }),
  survey_test_link: z
    .string()
    .optional()
    .refine((value): value is string => typeof value === 'string' && (value === '' || URL_REGEX.test(value)), {
      message: 'Valid URL required',
    }),
  sp_live_link: z
    .string()
    .optional()
    .refine((value): value is string => typeof value === 'string' && (value === '' || URL_REGEX.test(value)), {
      message: 'Valid URL required',
    }),
  // project_id: z.number(),
  // survey_name: z.string({
  //   required_error: "Survey Name required",
  // }),
  survey_name: z.string().min(1, { message: 'Survey name is required' }),
  // start_date: z.string({
  //   required_error: "Start Date required",
  // }),
  // end_date: z.string({
  //   required_error: "End Date required",
  // }),
  // description: z.string({}).optional(),
  // language_id: z.number(),
  // cpi: z.string({
  //   required_error: "Is required",
  // }),
  // loi: z.string(),
  // sample_size: z.string(),
})

// export const statusList = [
//   {
//     id: 3,
//     name: "DRAFT",
//   },
//   {
//     id: 4,
//     name: "LIVE",
//   },
//   {
//     id: 2,
//     name: "COMPLETE",
//   },
//   {
//     id: 5,
//     name: "PAUSE",
//   },
//   {
//     id: 1,
//     name: "CLOSE",
//   },
// ];

export const deviceType = [
  {
    value: 1,
    text: 'Mobile',
  },
  {
    value: 2,
    text: 'Tablet',
  },
  {
    value: 3,
    text: 'Desktop',
  },
]

function SurveyOverviewContainer() {
  const { survey, getAndUpdateSurvey, isLoading } = useOutletContext<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState(false)
  const [marketList, setMarketList] = useState<any>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [surveyTypeList, setSurveyTypeList] = useState<any>([])
  const [industryList, setIndustryList] = useState<any>([])
  const surveysService = new SurveysService()
  const projectService = new ProjectService()
  const listService = new ListService()
  const [statusList, setSurveyList] = useState<any>([])

  const { projectId, surveyId } = useParams()

  // files
  const [definitionFile, setDefinitionFile] = useState(null)
  const [dataFile, setDataFile] = useState(null)

  const handleDataFileChange = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      setDataFile(file)
    }
    event.target.value = null
  }

  const handleDefinitionFileChange = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      setDefinitionFile(file)
    }
    event.target.value = null
  }

  const removeDataFile = () => {
    setDataFile(null)
  }

  const removeDefinitionFile = () => {
    setDefinitionFile(null)
  }

  const handleSubmitFiles = async () => {
    if (dataFile) {
      const formData = new FormData()
      formData.append('files', dataFile)
      try {
        await projectService.postProjectDataFile(Number(projectId), Number(surveyId), formData, (_progressEvent: any) => { })

        setDataFile(null)
        enqueueSnackbar('Data File Sucessfully Uploded', {
          variant: 'success',
        })
      } catch (error) {
        logger.error(error)
      }
    }
    if (definitionFile) {
      const formData = new FormData()
      formData.append('files', definitionFile)
      try {
        await projectService.postProjectDefinitionFile(Number(projectId), Number(surveyId), formData, (_progressEvent: any) => { })

        setDefinitionFile(null)
        enqueueSnackbar('Defination File Sucessfully Uploded', {
          variant: 'success',
        })
        // console.log(data)
      } catch (error) {
        logger.error(error)
      }
    }
    // get_project_byid()
  }
  // const { surveyId } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SurveyType>({
    resolver: zodResolver(SurveySchema),
  })
  const [formState, setFormState] = useState<SurveyType>({
    cpi: -1,
    description: '',
    end_date: '',
    id: -1,
    language_id: -1,
    loi: -1,
    project_id: -1,
    sample_size: -1,
    ir: 0,
    start_date: '',
    survey_live_link: '',
    survey_name: '',
    survey_test_link: '',
    status_id: 3,
    device: [],
    survey_type_id: -1,
    industry_id: -1,
    sp_test_link: '',
    sp_live_link: '',
    sp_project_id: '',
  })

  const resetForm = () => {
    const devices = []
    if (survey?.is_mobile_allowed) {
      devices.push(1)
    }
    if (survey?.is_tablet_allowed) {
      devices.push(2)
    }
    if (survey?.is_desktop_allowed) {
      devices.push(3)
    }
    setFormState({
      cpi: survey?.cpi,
      description: survey?.description,
      end_date: survey?.end_date,
      id: survey?.id,
      language_id: survey?.language_id,
      ir: survey?.ir,
      loi: survey?.loi,
      project_id: survey?.project_id,
      sample_size: survey?.sample_size,
      start_date: survey?.start_date,
      survey_live_link: survey?.survey_live_link,
      survey_test_link: survey?.survey_test_link,
      survey_name: survey?.survey_name,
      sp_test_link: survey?.sp_test_link,
      sp_live_link: survey?.sp_live_link,
      status_id: survey?.status_id,
      device: devices,
      survey_type_id: survey?.survey_type_id,
      industry_id: survey?.industry_id,
    })
  }

  const cannotSave =
    loading ||
    !formState.device ||
    !formState.device.length ||
    (formState.status_id === 7 && formState.cpi === 0) ||
    (formState.status_id === 7 && formState.loi === 0) ||
    (formState.status_id === 7 && formState.ir === 0) ||
    (formState.status_id === 7 && formState.sample_size === 0) ||
    (formState.status_id === 7 && (formState.sp_live_link == null || formState.sp_live_link === '')) ||
    (formState.status_id === 7 && (formState.survey_live_link == null || formState.survey_live_link === ''));
  // (formState.status_id === 7 && formState.survey_test_link === "") ||
  // (formState.status_id === 7 && formState.sp_test_link === "");

  useEffect(() => {
    if (survey) {
      let payload: any = { ...survey }
      payload.device = []
      if (survey.is_mobile_allowed) {
        payload.device.push(1)
      }
      if (survey.is_tablet_allowed) {
        payload.device.push(2)
      }
      if (survey.is_desktop_allowed) {
        payload.device.push(3)
      }

      setFormState(payload)
      console.log(payload)
    }
  }, [survey])

  async function updatesurvey() {
    setLoading(true)
    let payload: any = { ...formState }
    // console.log(payload, "payloadpayload")
    payload.cpi = Number(parseFloat(String(formState.cpi)).toFixed(2))
    payload.is_mobile_allowed = formState?.device?.includes(1) ? true : false
    payload.is_tablet_allowed = formState?.device?.includes(2) ? true : false
    payload.is_desktop_allowed = formState?.device?.includes(3) ? true : false
    delete payload.device
    delete payload.data_file_url
    delete payload.definition_file_url
    delete payload.schema_file_url
    try {
      await surveysService.putsurvey(payload)
      getAndUpdateSurvey()
      setLoading(false)
    } catch (error) {
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    getAndUpdateSurvey()
  }, [])

  const onSubmit: SubmitHandler<SurveyType> = async () => {
    if (dataFile || definitionFile) {
      await handleSubmitFiles()
    }
    removeDataFile()
    removeDefinitionFile()

    await updatesurvey()
    setIsEdit(false)
  }

  async function getMarket() {
    try {
      const data = await listService.get_market_list()
      if (data && data) {
        const marketListData = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }))
        setMarketList(marketListData)
      }
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching Market List failed</Typography>, {
        variant: 'error',
      })
    }
  }

  useEffect(() => {
    if (survey?.project_id) getMarket()
  }, [survey])

  async function getProjects() {
    try {
      const data = await projectService.projectFilterList({
        statuses: [],
        clients: [],
      })

      setProjects(data)
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching projects failed</Typography>, {
        variant: 'error',
      })
    }
  }

  useEffect(() => {
    if (survey) getProjects()
  }, [survey])

  async function surveyType() {
    try {
      const data = await listService.get_survey_type_list()
      if (data && data) {
        const surveyTypeData = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }))
        setSurveyTypeList(surveyTypeData)
      }
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching Survey Type List failed</Typography>, {
        variant: 'error',
      })
    }
  }
  async function getIndustry() {
    try {
      const data = await listService.get_industry_list()
      if (data && data) {
        const industryData = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }))
        setIndustryList(industryData)
      }
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching Survey Type List failed</Typography>, {
        variant: 'error',
      })
    }
  }

  // async function SurveyStatusList() {

  //   try {
  //     const data = await listService.get_project_status()

  //     // console.log(data, "datadatadatadatadatafghjk")
  //     if (data) {
  //       setSurveyList(data)
  //     }
  //   } catch (error) {
  //     enqueueSnackbar("An error occurred. Please try again.", {
  //       variant: "error",
  //     })
  //   }
  // }

  async function SurveyStatusList() {
    try {
      const data = await listService.get_survey_status()

      console.log(data, 'datadatadatadatadatafghjk')
      if (data) {
        setSurveyList(data)
      }
    } catch (error) {
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
    }
  }

  useEffect(() => {
    SurveyStatusList()
  }, [])

  useEffect(() => {
    surveyType()
    getIndustry()
  }, [])

  const handleChange = (selected: { value: string | number; text: string }[]) => {
    setFormState((prev: any) => {
      return {
        ...prev,
        device: selected.map((item) => Number(item.value)),
      }
    })
  }

  function truncateText(text: string, length: number) {
    if (text.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === '.') {
      e.preventDefault()
    }
  }

  return (
    <DetailsBox sx={{ padding: '2rem', display: 'flex', height: 'calc(100vh - 270px)' }}>
      {isEdit ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '60%' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Project*</label>
                <Select
                  disabled={true}
                  value={survey?.project_id?.toString() || ''}
                  items={projects.map((project) => ({
                    text: project.project_name,
                    value: project.project_id as any,
                  }))}
                  name="project_id"
                  register={register as any}
                  label=""
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>

              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Survey Name*</label>
                <TextField
                  {...register('survey_name')}
                  sx={{ paddingTop: '5px' }}
                  value={formState.survey_name}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        survey_name: e.target.value,
                      }
                    })
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Cpi($)*</label>
                <TextField
                  type="text"
                  // onKeyPress={handleKeyPress}
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
                  {...(register("cpi"), { required: true })}
                  sx={{ paddingTop: "5px" }}
                  value={formState.cpi}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      //@ts-ignore
                      setFormState((prev) => {
                        return {
                          ...prev,
                          cpi: value,
                        };
                      });
                    }
                  }}
                  error={formState.status_id === 7 && formState.cpi === 0}
                  helperText={formState.status_id === 7 && formState.cpi === 0 ? 'CPI cannot be zero when status is Live' : ''}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>LOI*</label>
                <TextField
                  type="number"
                  onKeyPress={handleKeyPress}
                  autoSelectOnFocus
                  {...(register('loi'), { required: true })}
                  sx={{ paddingTop: '5px' }}
                  value={formState.loi}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        loi: Number(e.target.value),
                      }
                    })
                  }}
                  error={formState.status_id === 7 && formState.loi === 0}
                  helperText={formState.status_id === 7 && formState.loi === 0 ? 'LOI cannot be zero when status is Live' : ''}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px', marginBottom: '5px' }}>Sample Size*</label>
                <TextField
                  onKeyPress={handleKeyPress}
                  autoSelectOnFocus
                  type="number"
                  {...(register('sample_size'), { required: true })}
                  sx={{ paddingTop: '5px' }}
                  value={formState.sample_size}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        sample_size: Number(e.target.value),
                      }
                    })
                  }}
                  error={formState.status_id === 7 && formState.sample_size === 0}
                  helperText={formState.status_id === 7 && formState.sample_size === 0 ? 'Sample Size cannot be zero when status is Live' : ''}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Incident rate*</label>
                <TextField
                  type="number"
                  onKeyPress={handleKeyPress}
                  autoSelectOnFocus
                  {...(register('ir'), { required: true })}
                  sx={{ paddingTop: '5px' }}
                  value={formState.ir}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        ir: Number(e.target.value),
                      }
                    })
                  }}
                  error={formState.status_id === 7 && formState.ir === 0}
                  helperText={formState.status_id === 7 && formState.ir === 0 ? 'Incident Rate cannot be zero when status is Live' : ''}
                />
              </Grid>

              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Start Date*</label>
                <TextField
                  type="date"
                  {...(register('start_date'), { required: true })}
                  sx={{ paddingTop: '5px' }}
                  value={moment(formState.start_date).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        start_date: e.target.value,
                      }
                    })
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>End Date*</label>
                <TextField
                  type="date"
                  {...(register('end_date'), { required: true })}
                  sx={{ paddingTop: '5px' }}
                  value={moment(formState.end_date || '').format('YYYY-MM-DD')}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        end_date: e.target.value,
                      }
                    })
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Status*</label>
                <Select
                  value={formState.status_id?.toString() || ''}
                  items={statusList.map((item: { name: any; id: { toString: () => any } }) => ({
                    text: item.name,
                    value: item?.id?.toString() || '',
                  }))}
                  onChange={(e) =>
                    setFormState((prev) => {
                      return {
                        ...prev,
                        status_id: Number(e.target.value),
                      }
                    })
                  }
                  name="status_id"
                  register={register as any}
                  label=""
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Device*</label>
                <MultipleSelectCheckmarks
                  width="100%"
                  items={deviceType}
                  label=""
                  handleChange={handleChange}
                  selectedOptions={formState.device}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Market*</label>
                <Select
                  value={formState.language_id?.toString() || ''}
                  items={marketList}
                  onChange={(e) =>
                    setFormState((prev) => {
                      return {
                        ...prev,
                        language_id: Number(e.target.value),
                      }
                    })
                  }
                  name="language_id"
                  register={register as any}
                  label=""
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Survey Type*</label>
                <Select
                  value={formState.survey_type_id?.toString() || ''}
                  items={surveyTypeList}
                  onChange={(e) =>
                    setFormState((prev) => {
                      return {
                        ...prev,
                        survey_type_id: Number(e.target.value),
                      }
                    })
                  }
                  name="survey_type_id"
                  register={register as any}
                  label=""
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Industry*</label>
                <Select
                  value={formState.industry_id?.toString() || ''}
                  items={industryList}
                  onChange={(e) =>
                    setFormState((prev) => {
                      return {
                        ...prev,
                        industry_id: Number(e.target.value),
                      }
                    })
                  }
                  name="industry_id"
                  register={register as any}
                  label=""
                  isRequired={true}
                  style={{ paddingTop: '5px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: '5px' }}>Sp Survey Id</label>
                <TextField
                  {...register('sp_project_id')}
                  sx={{ paddingTop: '5px' }}
                  value={formState.sp_project_id}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        sp_project_id: e.target.value,
                      }
                    })
                  }}
                />
              </Grid>
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
                  {...register('description', { required: false })}
                  sx={{ paddingTop: '10px', paddingBottom: '20px' }}
                  value={formState.description || ''}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        description: e.target.value,
                      }
                    })
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px' }}>Survey Live Link</label>
                <TextField
                  {...register('survey_live_link')}
                  sx={{ paddingTop: '5px' }}
                  value={formState.survey_live_link || ''}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        survey_live_link: e.target.value,
                      }
                    })
                  }}
                  error={formState.status_id === 7 && (formState.survey_live_link === null || formState.survey_live_link === '')}
                  helperText={
                    formState.status_id === 7 && (formState.survey_live_link === null || formState.survey_live_link === '') ? 'Survey Live Link cannot be blank when status is Live' : ''
                  }
                />
                <Typography variant="body1" sx={{ color: 'red', margin: '1rem' }}>
                  {errors.survey_live_link?.message}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px' }}>Survey Test Link</label>
                <TextField
                  {...register('survey_test_link')}
                  sx={{ paddingTop: '5px' }}
                  value={formState.survey_test_link || ''}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        survey_test_link: e.target.value,
                      }
                    })
                  }}
                />
                <Typography variant="body1" sx={{ color: 'red', margin: '1rem' }}>
                  {errors.survey_test_link?.message}
                </Typography>
              </Grid>

              {/*  */}

              <Grid item xs={12}>
                <label style={{ marginLeft: '5px' }}>SP Live URL</label>
                <TextField
                  {...register('sp_live_link')}
                  sx={{ paddingTop: '5px' }}
                  value={formState.sp_live_link || ''}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        sp_live_link: e.target.value,
                      }
                    })
                  }}
                  error={formState.status_id === 7 && (formState.sp_live_link === null || formState.sp_live_link === '')}
                  helperText={formState.status_id === 7 && (formState.sp_live_link === null || formState.sp_live_link === '') ? 'SP Live Link cannot be blank when status is Live' : ''}
                />
                <Typography variant="body1" sx={{ color: 'red', margin: '1rem' }}>
                  {errors.sp_live_link?.message}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: '5px' }}>SP Test URL</label>
                <TextField
                  {...register('sp_test_link')}
                  sx={{ paddingTop: '5px' }}
                  value={formState.sp_test_link || ''}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        sp_test_link: e.target.value,
                      }
                    })
                  }}
                />
                <Typography variant="body1" sx={{ color: 'red', margin: '1rem' }}>
                  {errors.sp_test_link?.message}
                </Typography>
              </Grid>

              {/* -- */}
              {/* <Grid item xs={6}>
                <List>
                  {formState?.data_file_url && (
                    <ListItem
                      sx={{
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                        marginBottom: '10px',
                      }}
                      secondaryAction={
                        <Link
                          href={formState?.data_file_url}
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
                          formState?.data_file_url && formState?.data_file_url?.split('/')?.pop() ? truncateText(String(formState?.data_file_url?.split('/')?.pop()), 30) : null
                        }
                      />
                    </ListItem>
                  )}
                  {formState?.definition_file_url && (
                    <ListItem
                      sx={{
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                        marginBottom: '10px',
                      }}
                      secondaryAction={
                        <Link
                          href={`${formState?.definition_file_url}`}
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
                          formState?.definition_file_url && formState?.definition_file_url?.split('/')?.pop()
                            ? truncateText(String(formState?.definition_file_url?.split('/')?.pop()), 30)
                            : null
                        }
                      />
                    </ListItem>
                  )}
                  {formState?.schema_url && (
                    <ListItem
                      sx={{
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                      }}
                      secondaryAction={
                        <Link
                          href={formState?.schema_url}
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
                        secondary={formState?.schema_url?.split('/')?.pop() ? truncateText(String(formState?.schema_url?.split('/')?.pop()), 35) : null}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid> */}

              <Grid item xs={6}>
                <Box style={{ padding: '0.5rem' }}>
                  <List>
                    {(formState?.data_file_url || isEdit) && (
                      <Tooltip title={dataFile ? (dataFile as any)?.name : formState?.data_file_url?.split('/')?.pop()} placement="bottom-start">
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
                                href={`${formState?.data_file_url}`}
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
                                : formState?.data_file_url?.split('/')?.pop()
                                  ? truncateText(String(formState?.data_file_url?.split('/')?.pop()), 30)
                                  : null
                            }
                          />
                        </ListItem>
                      </Tooltip>
                    )}
                    {(formState?.definition_file_url || isEdit) && (
                      <Tooltip
                        title={definitionFile ? (definitionFile as any)?.name : formState?.definition_file_url?.split('/')?.pop()}
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
                                href={`${formState?.definition_file_url}`}
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
                                : formState?.definition_file_url?.split('/')?.pop()
                                  ? truncateText(String(formState?.definition_file_url?.split('/')?.pop()), 30)
                                  : null
                            }
                          />
                        </ListItem>
                      </Tooltip>
                    )}
                  </List>
                </Box>
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
                  resetForm()
                }}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={cannotSave}>
                Save
              </Button>
            </Box>
          </form>
        </>
      ) : (
        <Box component="div" sx={{ display: 'flex', gap: '2rem', width: '60%' }}>
          <Box component="div" sx={{ flex: 1 }}>
            <Grid container spacing={2} sx={{ marginBottom: '3rem' }}>
              <Grid item xs={12} md={6}>
                <StyledKeys>Project</StyledKeys>
                <StyledValueswithIcons>
                  <StyledValues>{projects?.find((val: any) => Number(val.project_id) === Number(survey?.project_id))?.project_name}</StyledValues>
                </StyledValueswithIcons>
              </Grid>

              <Grid item xs={12} md={6} sx={{ wordBreak: 'break-word' }}>
                <StyledKeys>Survey</StyledKeys>
                <StyledValues>
                  {survey && survey?.survey_name && survey?.survey_name?.charAt(0)?.toUpperCase() + survey?.survey_name?.slice(1)}
                </StyledValues>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>CPI($)</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.cpi?.toFixed(2)}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>LOI</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.loi}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Sample Size</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.sample_size}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Incident rate</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.ir}</StyledValues>
                </StyledValueswithIcons>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledKeys>Start Date</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{moment(survey?.start_date).format('YYYY MMMM DD') || ''}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>End Date</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{moment(survey?.end_date).format('YYYY MMMM DD') || ''}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Status</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>
                    {survey?.status_name || ''}
                  </StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Device</StyledKeys>
                <StyledValueswithIcons>
                  <StyledValues>
                    {deviceType
                      .filter((val: any) => formState?.device?.includes(val.value))
                      .map((device: any, index: any) => (
                        <span>
                          {index > 0 && ', '}
                          {device.text}
                        </span>
                      ))}
                  </StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Market</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{marketList?.find((val: any) => Number(val.value) === Number(formState.language_id))?.text}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Survey Type</StyledKeys>
                <StyledValueswithIcons>
                  <StyledValues>{surveyTypeList?.find((val: any) => Number(val.value) === Number(formState.survey_type_id))?.text}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Industry</StyledKeys>
                <StyledValueswithIcons>
                  <StyledValues>{industryList?.find((val: any) => Number(val.value) === Number(formState.industry_id))?.text}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Sp Survey Id</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.sp_project_id}</StyledValues>
                </StyledValueswithIcons>
              </Grid>

              <Grid item xs={12}>
                <StyledKeys>Description</StyledKeys>
                <StyledValueswithIcons>
                  <StyledValues>{survey?.description}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12}>
                <StyledKeys>Survey Live Link</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.survey_live_link}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12}>
                <StyledKeys>Survey Test Link</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.survey_test_link}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              {/*  */}
              <Grid item xs={12}>
                <StyledKeys>SP Live Link</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.sp_live_link}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12}>
                <StyledKeys>SP Test Link</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{survey?.sp_test_link}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={6}>
                <List>
                  {formState?.data_file_url && (
                    <ListItem
                      sx={{
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                        marginBottom: '10px',
                      }}
                      secondaryAction={
                        <Link
                          href={formState?.data_file_url}
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
                          formState?.data_file_url && formState?.data_file_url?.split('/')?.pop()
                            ? truncateText(String(formState?.data_file_url?.split('/')?.pop()), 30)
                            : null
                        }
                      />
                    </ListItem>
                  )}
                  {formState?.definition_file_url && (
                    <ListItem
                      sx={{
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                        marginBottom: '10px',
                      }}
                      secondaryAction={
                        <Link
                          href={`${formState?.definition_file_url}`}
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
                          formState?.definition_file_url && formState?.definition_file_url?.split('/')?.pop()
                            ? truncateText(String(formState?.definition_file_url?.split('/')?.pop()), 30)
                            : null
                        }
                      />
                    </ListItem>
                  )}
                  {formState?.schema_url && (
                    <ListItem
                      sx={{
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                      }}
                      secondaryAction={
                        <Link
                          href={formState?.schema_url}
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
                        secondary={
                          formState?.schema_url?.split('/')?.pop() ? truncateText(String(formState?.schema_url?.split('/')?.pop()), 35) : null
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
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
              onClick={() => {
                setIsEdit(true)
                // handleClose(e)
              }}
              size="small"
              style={{ alignItems: 'start' }}
            >
              {/* <EditIcon fontSize="medium" style={{ color: "#5D5D5D" }} /> */}
              <EditIcon fontSize="medium" style={{ color: '#5D5D5D' }} />
            </IconButton>
          </Box>
        </Box>
      )}
      {loading || isLoading ? <LoadingSpinner /> : null}
    </DetailsBox>
  )
}

export default SurveyOverviewContainer
