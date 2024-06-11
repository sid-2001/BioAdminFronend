import { DetailsBox } from '@/components/project-details/project-details.style'
import { Box, Typography, IconButton } from '@mui/material'
import Form from './form'
import { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import View from './view'
import { SurveySecurityService } from '@/services/survey-security.service'
import { useSnackbar } from 'notistack'
import { useParams } from 'react-router-dom'
import LoadingSpinner from '@/components/loader'
// import CancelRoundedIcon from "@mui/icons-material/CancelRounded"

export interface SecurityType {
  unique_ip: boolean
  unique_user: boolean
  country_mismatch: boolean
  research_defender: boolean
  research_defenderscore: number
  min_loi: number
  max_loi: number
  survey_id: number
  acceptMinLoi: boolean
  acceptMaxLoi: boolean
}

function SurveySecurityContainer() {
  const [editMode, setEditMode] = useState(false)
  const [security, setSecurity] = useState<SecurityType | null>(null)
  const surveySecurityService = new SurveySecurityService()
  const { enqueueSnackbar } = useSnackbar()
  const { surveyId } = useParams()
  const [loading, setLoading] = useState(true)

  async function updateSecurity(obj: SecurityType) {
    setLoading(true)
    try {
      await surveySecurityService.putSurveySecurity(surveyId || '', obj)

      setLoading(false)
      setEditMode(false)

      fetchSecurity()
    } catch (error) {
      setLoading(false)
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
    }
  }

  async function fetchSecurity() {
    setLoading(true)
    try {
      const data = await surveySecurityService.getSurveySecurity(surveyId || '')

      setLoading(false)

      setSecurity(data)
    } catch (error) {
      setLoading(false)
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
    }
  }

  useEffect(() => {
    fetchSecurity()
  }, [])

  return (
    <DetailsBox marginBottom="50px" sx={{ minWidth: '100%', padding: '1rem', height: 'calc(100vh - 270px)' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Security</Typography>
        {!editMode ? (
          <IconButton
            aria-controls="menu"
            aria-haspopup="true"
            onClick={() => {
              setEditMode(true)
              // handleClose(e)
            }}
            disabled={!security}
            size="small"
            style={{ alignItems: 'start' }}
          >
            <EditIcon fontSize="medium" style={{ color: '#5D5D5D' }} />
          </IconButton>
        ) : null}
      </Box>

      {security || !loading ? (
        <Box>
          {editMode ? (
            <Form
              updateSecurity={updateSecurity}
              // @ts-ignore
              security={security}
              setEditMode={setEditMode}
              loading={loading}
            />
          ) : (
            // @ts-ignore
            <View security={security} />
          )}
        </Box>
      ) : loading ? (
        <LoadingSpinner />
      ) : null}
    </DetailsBox>
  )
}

export default SurveySecurityContainer
