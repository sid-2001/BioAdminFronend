import { Box, Button, IconButton } from '@mui/material'
import { PageWrapper } from '@/styles/page-wrapper'
import { Inputs as SurveyType } from '@/containers/surveys-list/surveys-list.container'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { SurveysService } from '@/services/surveys.service'
import { useSnackbar } from 'notistack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const ProjectSurveyNavigationContainer = () => {
  const { getSurveys } = useOutletContext<any>()
  const navigate = useNavigate()
  const SurveyService = new SurveysService()
  const { surveyId, projectId } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const [survey, setSurvey] = useState<SurveyType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  async function getAndUpdateSurvey() {
    setLoading(true)
    try {
      const data = await SurveyService.getSurvey(surveyId || '')

      setSurvey(data)
      getSurveys()
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

  return (
    <>
      <PageWrapper
        style={{
          // background: "white",
          borderRadius: '12px',
          height: 'calc(100vh - 228px)',
          // overflow: 'scroll',
        }}
      >
        <Box
          style={{
            width: '100%',
            position: 'sticky',
            top: '0px',
            // background: "white",
            zIndex: 500,
            padding: '0rem 1rem 0rem 1rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{
              borderRadius: '4px',
            }}
            onClick={() => navigate(`/projects/${projectId}/surveys`)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Button onClick={() => navigate('overview')}>Overview</Button>
          <Button onClick={() => navigate('qualification')}>Qualification</Button>
          {/* <Button onClick={() => navigate('quotas')}>Quotas</Button> */}
          <Button onClick={() => navigate('quota')}>Quota</Button>
          <Button onClick={() => navigate('supply')}>Supply</Button>
          <Button onClick={() => navigate('security')}>Security Config</Button>
          <Button onClick={() => navigate('reports')}>Reports</Button>
        </Box>
        <Outlet context={{ survey, getAndUpdateSurvey, isLoading: loading }} />
      </PageWrapper>
    </>
  )
}

export default ProjectSurveyNavigationContainer
