import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
// import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
// import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { ProjectDataService } from '@/services/project-data.services'
import LoadingSpinner from '@/components/loader'
import EditIcon from '@mui/icons-material/Edit'
import ChartsConfigurationsTable from '@/components/charts-configurations-table'
import { ListService } from '@/services/list.service'
import { ConfigQuestionType, ListsTypes, UpdateDataType } from '@/components/charts-configurations-table/charts-configurations-table.type'
import CustomQualComponent from '@/components/custom-qual/custom-qual.component'

function ProjectChartsConfigContainer() {
  const service = new ProjectDataService()
  const listService = new ListService()
  const [loading, setLoading] = useState(false)
  const { projectId, surveyId } = useParams()
  const [questionList, setQuestionList] = useState<ConfigQuestionType[]>([])
  const [charts, setCharts] = useState<ListsTypes[]>([])
  const [questionTypes, setQuestionTypes] = useState<ListsTypes[]>([])
  const [editConfig, setEditConfig] = useState(false)
  const [customQualOpen, setCustomQualOpen] = useState(false)

  async function UpdateConfigData(payload: UpdateDataType[]) {
    // console.log("Posting payload:", payload);
    setLoading(true)
    if (projectId && surveyId)
      try {
        const data = await service.UpdateChartsQuestionsById(Number(projectId), Number(surveyId), payload)
        if (data) {
          setEditConfig(false)
          GetChartsQuestionsById()
          enqueueSnackbar(<Typography variant="body1">Configurations Updated Successfully.</Typography>, {
            variant: 'success',
          })
        } else {
          enqueueSnackbar(<Typography variant="body1">Updating Configurations requests failed</Typography>, {
            variant: 'error',
          })
        }
      } catch (error) {
        enqueueSnackbar(<Typography variant="body1">Updating Configurations requests failed</Typography>, {
          variant: 'error',
        })
      } finally {
        setLoading(false)
      }
  }

  async function GetChartsQuestionsById() {
    setLoading(true)
    try {
      const data = await service.getChartsQuestionsById(Number(projectId), Number(surveyId))
      // console.log(data, "dataqwert");
      if (data) {
        // @ts-ignore
        setQuestionList(data)
      }
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching requests failed</Typography>, {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  async function GetChartsLists() {
    setLoading(true)
    try {
      const data = await listService.get_charts_types()
      // console.log(data, "dataqwert");
      if (data) {
        setCharts(data)
      }
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching requests failed</Typography>, {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  async function GetQuestionListLists() {
    setLoading(true)
    try {
      const data = await listService.get_charts_questions_types()
      // console.log(data, "dataqwert");
      if (data) {
        setQuestionTypes(data)
      }
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching requests failed</Typography>, {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId && surveyId) {
      GetChartsQuestionsById()
    }
  }, [projectId, surveyId])

  useEffect(() => {
    GetChartsLists()
    GetQuestionListLists()
  }, [])

  const handleClose = () => {
    setCustomQualOpen(false)
  }

  return (
    <>
      {loading ? <LoadingSpinner /> : null}
      {customQualOpen ? <CustomQualComponent handleClose={handleClose} questionList={questionList} GetChartsQuestionsById={GetChartsQuestionsById} setLoading={setLoading} /> : null}
      <Box
        sx={{ flex: '1', overflow: 'scroll' }}
        style={{
          background: 'white',
          borderRadius: '12px',
          height: 'calc(100vh - 273px)',
          width: '100%',
        }}
      >
        <Box
          style={{
            width: '100%',
            position: 'sticky',
            top: '0px',
            background: 'white',
            zIndex: 10,
            padding: '1rem 2rem 0rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">
            Schema Manager
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            {!editConfig &&
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setCustomQualOpen(true)
                }}
              >
                Custom Qualification
              </Button>
            }
            <IconButton
              aria-controls="menu"
              aria-haspopup="true"
              onClick={() => setEditConfig(true)}
              size="small"
              style={{ alignItems: 'start', display: editConfig ? 'none' : 'inherit' }}
            >
              <EditIcon fontSize="medium" style={{ color: '#5D5D5D' }} />
            </IconButton>
          </Stack>

        </Box>
        <Box sx={{ padding: '0rem 2rem 0rem 2rem', zIndex: 5, }}>
          <ChartsConfigurationsTable
            UpdateConfigData={UpdateConfigData}
            questionList={questionList}
            setQuestionList={setQuestionList}
            charts={charts}
            questionTypesList={questionTypes}
            editConfig={editConfig}
            setEditConfig={setEditConfig}
          />
        </Box>
      </Box>
    </>
  )
}

export default ProjectChartsConfigContainer
