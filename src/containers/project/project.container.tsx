import Tabs from '@/components/tabs'
import { ProjectService } from '@/services/projects.service'
import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { logger } from '@/helpers/logger'
import {
  // Box,
  FormControl,
  // Button,
  IconButton,
  // Menu,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { PageWrapper } from '@/styles/page-wrapper'
import { ContactType, PrimaryBox } from '@/components/project-card/project-card.style'
import { Project } from '@/types/project.type'
import { backIcon } from '@/assets/images'
import { theme } from '@/constants/theme'
// import { MoreHorizOutlined } from "@mui/icons-material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { SurveysService } from '@/services/surveys.service'

const ProjectContainer = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const projectService = new ProjectService()
  const surveysService = new SurveysService()
  const [surveyFirst, setSurveyFirst] = useState(false)

  const { projectId, surveyId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [value, setValue] = useState(0)
  const [project, setProject] = useState<Project | null>(null)
  const [selectSurveys, setSelectSurveys] = useState<Array<any>>([])
  const [selectedSurvey, setSelectedSurvey] = useState<number | null>(null)
  const [surveys, setSurveys] = useState<Array<any>>([])

  // const [anchorEl, setAnchorEl] = useState(null)

  const pathArray = location.pathname?.split('/')

  // const open = Boolean(anchorEl)

  // const handleClick = (event: any) => {
  //   setAnchorEl(event.currentTarget)
  // }
  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  async function getSurveys() {
    setSelectSurveys([])
    // console.log(setSelectSurveys, "setSelectSurveyssetSelectSurveyssetSelectSurveys")
    setLoading(true)
    try {
      if (projectId) {
        const data = await surveysService.getsurveysByProjectId(projectId)
        if (data) {
          setSurveys(data)
          // console.log(data?.length, "data?.lengthdata?.length", surveyId)
          if (data && !selectedSurvey) {
            setSelectedSurvey(data[0]?.id)
          }

          const surveyData = data.map((client) => ({
            text: client.survey_name,
            language_name: client.language_name,
            value: client?.id?.toString() || '',
          }))

          // console.log(data, surveyData, "surveyDatasurveyDatasurveyData")
          setSelectSurveys(surveyData)
        }
        setLoading(false)
      }
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching survey failed</Typography>, {
        variant: 'error',
      })
      setLoading(false)
    }
  }

  const get_project_byid = async () => {
    setLoading(true)
    try {
      const data = await projectService.get_project_by_id(Number(projectId))

      // console.log(data, "datadatadata")
      setProject(data)
      setLoading(false)
    } catch (error) {
      logger.error(error)
      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar('Access denied: Insufficient permissions.', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar('Project does not exist.', {
          variant: 'error',
        })
        navigate('/projects')
      }
      setLoading(false)
    }
  }

  function truncateText(text: any, length: number) {
    // Check if the input is a string and if it exceeds the required length
    if (typeof text === 'string' && text.length > length) {
      return `${text.substr(0, length)}...`
    }
    return text // This will return the input as is, if it's not a string or if it's within the length limit
  }

  useEffect(() => {
    if (projectId) {
      get_project_byid()
      getSurveys()
    }
  }, [projectId])

  useEffect(() => {
    if (projectId && selectedSurvey && surveyId && surveys?.length && Number(surveyId) !== Number(selectedSurvey)) {
      const checkSurveyInlist = surveys?.find((item) => Number(item?.id) == Number(surveyId))
      if (checkSurveyInlist) {
        setSelectedSurvey(Number(surveyId))
      } else {
        navigate(`/projects/${projectId}/overview`)
      }
      // console.log(checkSurveyInlist, projectId, selectedSurvey, surveyId, surveys, surveys[0]?.id, "checkSurveyInlistcheckSurveyInlistcheckSurveyInlist")
    }
  }, [projectId, surveys, selectedSurvey, surveyId])

  useEffect(() => {
    if (location.pathname === `/projects/${projectId}/overview`) {
      setValue(0)
    } else if (location.pathname === `/projects/${projectId}/survey/${selectedSurvey}/builder`) {
      setValue(1)
    } else if (location.pathname === `/projects/${projectId}/survey/${selectedSurvey}/threads`) {
      setValue(2)
      // } else if (location.pathname === `projects/${projectId}/requests`) {
      //   setValue(3);
    } else if (location.pathname === `/projects/${projectId}/survey/${selectedSurvey}/files`) {
      setValue(3)
    } else if (location.pathname === `/projects/${projectId}/survey/${selectedSurvey}/data`) {
      setValue(4)
    } else if (location.pathname === `/projects/${projectId}/survey/${selectedSurvey}/estimates`) {
      setValue(5)
    } else if (location.pathname === `/projects/${projectId}/survey/${selectedSurvey}/members`) {
      setValue(6)
    } else if (location.pathname.includes(`surveys`)) {
      setValue(7)
    }
  }, [location, selectedSurvey])

  console.log(value, 'value')

  const BackGroundColor = (bgId: any) => {
    if (bgId == 1) {
      return '#CCCCCC'
    } else if (bgId == 2) {
      return '#fff4e5'
    } else if (bgId == 3) {
      return '#90EE90'
    } else if (bgId == 4) {
      return '#D8BFD8'
    } else if (bgId == 5) {
      return '#FFD700'
    } else if (bgId == 6) {
      return '#E0FFFF'
    } else if (bgId == 7) {
      return '#E0FFE5'
    } else if (bgId == 8) {
      return '#fff0f0'
    } else if (bgId == 9) {
      return '#e5f9ff'
    } else if (bgId == 10) {
      return '#e5e5ff'
    } else if (bgId == 11) {
      return '#E0E0E0'
    }
  }

  // const TypoColor = () => {
  //   // if (bgId == 1) {
  //   return "#000";
  //   // } else if (bgId == 2) {
  //   //   return "#000";
  //   // } else if (bgId == 3) {
  //   //   return "#000";
  //   // } else if (bgId == 4) {
  //   //   return "#000";
  //   // } else if (bgId == 5) {
  //   //   return "#";
  //   // } else if (bgId == 6) {
  //   //   return "#15450D";
  //   // } else if (bgId == 7) {
  //   //   return "#9620B4";
  //   // }
  // };

  const handleSelectSurvey = (event: any) => {
    const newSelectedSurvey = event.target.value
    setSelectedSurvey(newSelectedSurvey)
    setSurveyFirst(true)
    const basePath = `/projects/${projectId}`
    let nextPath = basePath
    if (location.pathname.includes(`/overview`)) {
      nextPath += `/overview`
    } else if (location.pathname.includes('/survey') && location.pathname.includes('/builder')) {
      nextPath += `/survey/${newSelectedSurvey}/builder`
    } else if (location.pathname.includes('/surveys')) {
      nextPath += `/surveys`
    } else if (location.pathname.includes('/data') && location.pathname.includes('/data/summary')) {
      nextPath += `/survey/${newSelectedSurvey}/data/summary`
    } else if (location.pathname.includes('/data') && location.pathname.includes('/data/data-tabulation')) {
      nextPath += `/survey/${newSelectedSurvey}/data/data-tabulation`
    } else if (location.pathname.includes('/data') && location.pathname.includes('/data/banner-planner')) {
      nextPath += `/survey/${newSelectedSurvey}/data/banner-planner`
    } else if (location.pathname.includes('/data/pipelines') && location.pathname.includes('/pipelines')) {
      nextPath += `/survey/${newSelectedSurvey}/data/pipelines`
    } else if (location.pathname.includes('/data') && location.pathname.includes('/data/schema-manager')) {
      nextPath += `/survey/${newSelectedSurvey}/data/schema-manager`
    } else if (location.pathname.includes('/members')) {
      nextPath += `/members`
    } else if (location.pathname.includes('/survey') && location.pathname.includes('/threads')) {
      nextPath += `/survey/${newSelectedSurvey}/threads`
    } else if (location.pathname.includes('/files')) {
      nextPath += `/survey/${newSelectedSurvey}/files`
    } else if (location.pathname.includes('/survey') && location.pathname.includes('/estimates')) {
      nextPath += `/survey/${newSelectedSurvey}/estimates`
    }
    navigate(nextPath, { replace: true })
    // window.location.href = nextPath

    // handleClose()
  }

  // const surveyItem = selectSurveys.find(value => value.value == selectedSurvey);

  // console.log(project, "projectprojectproject");

  return (
    <PageWrapper>
      <header
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'top',
          marginBottom: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              navigate('/projects')
            }}
          >
            <img src={backIcon} />
          </IconButton>
          {/* <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}> */}
          <Tooltip title={project?.project_name}>
            <Typography variant="h6" style={{ marginBottom: '0' }}>
              {truncateText(project?.project_name && project?.project_name?.charAt(0)?.toUpperCase() + project?.project_name?.slice(1), 30)}
            </Typography>
          </Tooltip>
          {selectSurveys &&
            selectSurveys?.length > 0 &&
            location.pathname?.split('/')?.pop() !== 'overview' &&
            location.pathname?.split('/')?.pop() !== 'surveys' &&
            location.pathname?.split('/')?.pop() !== 'members' &&
            pathArray[pathArray?.length - 3] !== 'surveys' && (
              <PrimaryBox
                display="flex"
                justifyContent="center"
                sx={{
                  background: BackGroundColor(surveys && surveys?.find((item) => item?.id == selectedSurvey)?.status_id),
                  // opacity: 0.8,
                }}
              >
                <ContactType
                  sx={{
                    color: 'black',
                  }}
                >
                  {surveys &&
                    surveys?.find((item) => item?.id == selectedSurvey)?.survey_status_name &&
                    surveys &&
                    surveys
                      ?.find((item) => item?.id == selectedSurvey)
                      ?.survey_status_name?.charAt(0)
                      ?.toUpperCase() +
                      surveys
                        ?.find((item) => item?.id == selectedSurvey)
                        ?.survey_status_name?.slice(1)
                        ?.toLowerCase()}
                </ContactType>
              </PrimaryBox>
            )}
          {/* </div> */}

          {selectSurveys &&
            selectSurveys?.length > 0 &&
            location.pathname?.split('/')?.pop() !== 'overview' &&
            location.pathname?.split('/')?.pop() !== 'surveys' &&
            location.pathname?.split('/')?.pop() !== 'members' &&
            pathArray[pathArray?.length - 3] !== 'surveys' && (
              <Stack direction="row" spacing={2} alignItems="top" style={{ padding: '0px !important' }}>
                <FormControl variant="standard" size="small" style={{ padding: '0px !important' }}>
                  <Select
                    size="small"
                    value={(selectedSurvey || '') as any}
                    onChange={handleSelectSurvey}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Select survey' }}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      // background: 'white',
                      color: theme.palette.primary.main,
                      '& .MuiSvgIcon-root': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {selectSurveys.map((survey) => (
                      <MenuItem key={survey.value} value={survey.value}>
                        {`${survey.text}(${survey.language_name})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}
        </div>
      </header>
      <Tabs
        setValue={setValue}
        value={value}
        labels={[
          {
            label: 'Overview',
            isDisabled: false,
            route: `/projects/${projectId}/overview`,
          },
          {
            label: 'Builder',
            isDisabled: false,
            route: `/projects/${projectId}/survey/${selectedSurvey}/builder`,
          },
          {
            label: 'Threads',
            isDisabled: false,
            route: `/projects/${projectId}/survey/${selectedSurvey}/threads`,
          },
          // {
          //   label: "Requests",
          //   isDisabled: false,
          //   route: `/projects/${projectId}/requests`,
          // },
          {
            label: 'Files',
            isDisabled: false,
            route: `/projects/${projectId}/survey/${selectedSurvey}/files`,
          },
          {
            label: 'Data',
            isDisabled: false,
            route: `/projects/${projectId}/survey/${selectedSurvey}/data/summary`,
          },
          {
            label: 'Estimates',
            isDisabled: false,
            route: `/projects/${projectId}/survey/${selectedSurvey}/estimates`,
          },
          {
            label: 'Members',
            isDisabled: false,
            route: `/projects/${projectId}/members`,
          },
          {
            label: 'Surveys',
            isDisabled: false,
            route: `/projects/${projectId}/surveys`,
          },
        ]}
        tabpanels={
          <Outlet
            context={{
              project,
              get_project_byid,
              loading,
              getSurveys,
              surveys,
              selectedSurvey,
              surveyFirst,
              setSurveyFirst,
            }}
          />
        }
      />
    </PageWrapper>
  )
}
export default ProjectContainer
