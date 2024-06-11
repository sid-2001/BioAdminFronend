import { useParams, useOutletContext } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import LoadingSpinner from '@/components/loader'
import { CommentIcon, FillIcon, RefreshIcon } from '@/assets/images'
import { theme } from '@/constants/theme'
// import { SettingsOutlined } from "@mui/icons-material";
import { DetailsBox } from '@/components/tabulation-list/tabulation-list.style'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { OtaQuestionsList } from '@/types/project-ota.types'
import OtaQuestionListComponent from '@/components/ota-question-list'
import ViewAnalyse from '../view-analyse'
// import { ProjectService } from "@/services/projects.service";
import { useSnackbar } from 'notistack'
import { ProjectDataService } from '@/services/project-data.services'
import moment from 'moment'
// import DUMMY_DATA from "./dummy.json";
import axios from 'axios'

function TextAnalysisContainer() {
  // const navigate = useNavigate();
  const { projectId } = useParams()
  const { dataExportConfig, allRunsByRunId } = useOutletContext<any>()
  const [loading, setLoading] = useState(false)
  const [questionsList, setQuestionList] = useState<OtaQuestionsList | null>(null)

  // console.log(allRunsByRunId, "dssadxczdsfdscxz");

  const [hide, setHide] = useState(false)
  const [fullViewMode, setFullViewMode] = useState(false)
  const [questionId, setQuestionId] = useState<null | string>(null)
  //   const projectService = new ProjectService();
  const { enqueueSnackbar } = useSnackbar()

  const screen1 = useFullScreenHandle()

  const reportChange = useCallback(
    (state: any, handle: any) => {
      if (handle === screen1) {
        setFullViewMode(state)
      }
    },
    [screen1],
  )

  const getQuestions = async () => {
    if (allRunsByRunId && allRunsByRunId.logs && allRunsByRunId.logs.length) {
      try {
        const jobLogs = allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 7)
        const filePath = jobLogs?.[0]?.output_files?.[0]?.file_path
        const obj = allRunsByRunId.logs[6]

        if (obj.output_files && obj.output_files.length) {
          setLoading(true)
          const { data } = await axios.get(filePath)

          setQuestionList(data)
          setLoading(false)
        }
      } catch (error) {
        enqueueSnackbar('An error occurred. Please try again.', {
          variant: 'error',
        })
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    getQuestions()
  }, [projectId, allRunsByRunId])

  function refreshData() {
    const service = new ProjectDataService()
    service.refreshDataRequest(Number(projectId))
  }

  return (
    <FullScreen handle={screen1} onChange={reportChange}>
      <div id={fullViewMode ? 'bodyBackground' : ''}>
        {loading ? <LoadingSpinner /> : null}
        <Box
          style={{
            width: '100%',
            zIndex: 500,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            background: fullViewMode ? 'white' : 'none',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">Text Analysis</Typography>
              <IconButton size="small" onClick={refreshData}>
                <img src={RefreshIcon} height="18px" />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: theme.palette.grey[600],
                }}
              >
                {moment(dataExportConfig?.published_time).fromNow()}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton size="small">
              <img src={CommentIcon} height="23px" />
            </IconButton>

            {/* <IconButton size="small">
              <SettingsOutlined
                sx={{ color: theme.palette.grey[500] }}
                onClick={() =>
                  navigate(`/projects/${projectId}/data/config/cleaning`)
                }
              />
            </IconButton> */}
            <IconButton
              onClick={() => {
                if (!fullViewMode) {
                  screen1.enter()
                } else {
                  screen1.exit()
                }
              }}
            >
              {!fullViewMode ? <FullscreenIcon sx={{ color: theme.palette.grey[500], fontSize: '1.3rem' }} /> : <img src={FillIcon} height="20px" />}
            </IconButton>
          </Stack>
        </Box>

        {questionsList && questionsList?.questions?.length > 0 ? (
          <Grid container spacing={2} style={{ background: fullViewMode ? 'white' : 'none', height: fullViewMode ? '100vh' : 'auto' }}>
            <Grid item xs={hide ? 0.2 : 1.8} sx={{ position: 'relative' }}>
              <IconButton
                onClick={() => {
                  setHide(!hide)
                }}
                size="small"
                sx={{
                  position: 'absolute',
                  top: hide ? '22px' : '40px',
                  zIndex: 5,
                  right: '-10px',
                  background: '#E4E4E4',
                  padding: '1px',
                }}
              >
                {!hide ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
              </IconButton>
              <Box sx={{ display: hide ? 'none' : '' }}>
                <OtaQuestionListComponent questionList={questionsList} fullViewMode={fullViewMode} setQuestionId={setQuestionId} />
              </Box>
            </Grid>
            <Grid item xs={hide ? 11.8 : 10.2}>
              <DetailsBox
                sx={{
                  paddingTop: '0.5rem',
                  height: fullViewMode ? 'calc(100vh - 100px)' : 'calc(100vh - 270px)',
                  overflow: 'auto',
                }}
              >
                {questionId ? (
                  <ViewAnalyse
                    //@ts-ignore
                    data={
                      questionsList?.questions?.find((question) => question.question_id === questionId)?.analysis_data
                        ? questionsList?.questions?.find((question) => question.question_id === questionId)?.analysis_data
                        : []
                    }
                    questionName={
                      questionsList?.questions?.find((question) => question.question_id === questionId)?.question_text
                        ? questionsList?.questions?.find((question) => question.question_id === questionId)?.question_text
                        : ''
                    }
                    fullViewMode={fullViewMode}
                  />
                ) : (
                  <Stack
                    direction="row"
                    alignItems="center"
                    display={loading ? 'none' : ''}
                    justifyContent="center"
                    textAlign="center"
                    marginTop="5rem"
                    fontSize="14px"
                    fontWeight={600}
                    color="rgb(69, 79, 91)"
                  >
                    Please select question to view its <br />
                    content here
                  </Stack>
                )}
              </DetailsBox>
            </Grid>
          </Grid>
        ) : !loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2rem',
            }}
          >
            <Typography variant="h5">{!loading ? 'No data to show !' : null}</Typography>
          </Box>
        ) : null}
      </div>
    </FullScreen>
  )
}

export default TextAnalysisContainer
