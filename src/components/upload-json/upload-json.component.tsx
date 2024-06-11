import { UploadJsonComponentProps } from './upload-json.type'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'
import Select from '@/components/select'
import { useEffect, useState } from 'react'

import LoadingSpinner from '../loader'
import { useSnackbar } from 'notistack'

import { useParams } from 'react-router-dom'

import { logger } from '@/helpers/logger'
import { QuestionnaireService } from '@/services/questionnaire.sevice'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
const ExportJSONComponent = (props: UploadJsonComponentProps) => {
  const { open, handleClose } = props
  const [jsonClient, setjsonClient] = useState<null | number>(null)
  const [jsonClientList, setjsonClientList] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const { projectId, surveyId } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  // const fileHandler = (e: any) => {
  //   setLoading(true)
  //   const file = e.target.files[0]
  //   if (projectId && surveyId)
  //     questionnaireService
  //       .uploadQuestionnaire(Number(projectId), Number(surveyId), {
  //         files: file,
  //         type_id: jsonClient,
  //       })
  //       .then(() => {
  //         enqueueSnackbar('Successfully uploaded', { variant: 'success' })
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         enqueueSnackbar('Oops somthing went wrong !!', { variant: 'error' })
  //       })
  //       .finally(() => {
  //         setLoading(false)
  //         handleClose()
  //       })
  // }
  const fileHandler = () => {
    setLoading(true)
    const fileInput = document.getElementById('upload_json_new')
    fileInput?.addEventListener('change', (event: any) => {
      const file = event?.target?.files[0]
      if (projectId && surveyId) {
        questionnaireService
          .uploadQuestionnaire(Number(projectId), Number(surveyId), {
            files: file,
            type_id: jsonClient,
          })
          .then(() => {
            enqueueSnackbar('Successfully uploaded', { variant: 'success' })
          })
          .catch((err) => {
            console.log(err)
            enqueueSnackbar('Oops something went wrong !!', { variant: 'error' })
          })
          .finally(() => {
            setLoading(false)
            handleClose()
          })
      }
    })
  }
  let jsonClients = [
    {
      name: 'Brisk',
      value: 1,
    },
    {
      name: 'BioBrain',
      value: 2,
    },
  ]

  const getClientsJsonList = async () => {
    try {
      setjsonClientList(jsonClients)
    } catch (error) {
      logger.error(error)
    }
  }
  useEffect(() => {
    getClientsJsonList()
  }, [])

  const questionnaireService = new QuestionnaireService()

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      {loading && <LoadingSpinner />}
      <DialogTitle>{'Upload Questionnaire JSON'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label style={{ marginLeft: '5px' }}>JSON LIST</label>
              <Select
                value={jsonClient?.toString() || ''}
                items={jsonClientList.map((client: any) => ({
                  text: client ? client.name : '',
                  value: client?.value?.toString() || '',
                }))}
                onChange={(e) => {
                  console.log('CLICKED', e.target.value)
                  setjsonClient(Number(e.target.value))
                }}
                name="jsonClient"
                label=""
                isRequired={true}
                style={{ paddingTop: '5px' }}
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>cancel</Button>
        <Button
          variant="contained"
          disabled={!jsonClient ? true : false}
          onClick={() => {
            document.getElementById('upload_json_new')?.click()
          }}
          startIcon={<CloudUploadIcon />}
        >
          <Typography variant="caption">Upload JSON</Typography>
        </Button>
      </DialogActions>

      <input onClick={fileHandler} id="upload_json_new" accept=".json" style={{ display: 'none' }} type="file" />
    </Dialog>
  )
}

export default ExportJSONComponent
