import Tabs from '@/components/tabs'
import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
// import { logger } from "@/helpers/logger"
import {
  // Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { PageWrapper } from '@/styles/page-wrapper'
// import {
//   ContactType,
//   PrimaryBox,
// } from "@/components/project-card/project-card.style"
import { backIcon } from '@/assets/images'
// import { MoreHorizOutlined } from "@mui/icons-material"
import { SurveysService } from '@/services/surveys.service'
import { Inputs as SurveyType } from '@/containers/surveys-list/surveys-list.container'

function SurveyDetailsContainer() {
  const { surveyId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const SurveyService = new SurveysService()
  const { enqueueSnackbar } = useSnackbar()

  const [survey, setSurvey] = useState<SurveyType | null>(null)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)

  async function getAndUpdateSurvey() {
    setLoading(true)
    try {
      const data = await SurveyService.getSurvey(surveyId || '')

      setSurvey(data)
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
  }, [surveyId])

  useEffect(() => {
    if (location.pathname === `/surveys/${surveyId}/overview`) {
      setValue(0)
    } else if (location.pathname === `/surveys/${surveyId}/qualification`) {
      setValue(1)
    } else if (location.pathname === `/surveys/${surveyId}/quotas`) {
      setValue(2)
    } else if (location.pathname === `/surveys/${surveyId}/supply`) {
      setValue(3)
    }
  }, [location])

  return (
    <PageWrapper>
      <header
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              navigate('/surveys')
            }}
          >
            <img src={backIcon} />
          </IconButton>
          <Tooltip title={survey?.survey_name}>
            <Typography variant="h6" style={{ marginBottom: '0' }}>
              {survey?.survey_name || ''}
            </Typography>
          </Tooltip>

          {/* <MoreHorizOutlined /> */}
        </div>
      </header>
      <Tabs
        setValue={setValue}
        value={value}
        labels={[
          {
            label: 'Overview',
            isDisabled: false,
            route: `/surveys/${surveyId}/overview`,
          },
          {
            label: 'Qualification',
            isDisabled: false,
            route: `/surveys/${surveyId}/qualification`,
          },
          {
            label: 'Quotas',
            isDisabled: false,
            route: `/surveys/${surveyId}/quotas`,
          },
          {
            label: 'Supply',
            isDisabled: false,
            route: `/surveys/${surveyId}/supply`,
          },
          {
            label: 'Security Config',
            isDisabled: false,
            route: `/surveys/${surveyId}/security`,
          },
        ]}
        tabpanels={<Outlet context={{ survey, getAndUpdateSurvey, isLoading: loading }} />}
      />
    </PageWrapper>
  )
}

export default SurveyDetailsContainer
