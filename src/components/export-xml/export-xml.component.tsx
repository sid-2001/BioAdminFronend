import { ExportXmlComponentProps } from './export-xml.type'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { Grid } from '@mui/material'
import Select from '@/components/select'
import { useEffect, useState } from 'react'
import { ProgrammingSoftwareListType } from '@/services/list.service'
import LoadingSpinner from '../loader'
import { useSnackbar } from 'notistack'
import { ProjectService } from '@/services/projects.service'
import { useParams } from 'react-router-dom'
import { ClientsService } from '@/services/client.service'
import { logger } from '@/helpers/logger'

const ExportXmlComponent = (props: ExportXmlComponentProps) => {
  const { open, handleClose, clientId } = props
  const [spClient, setSpClient] = useState<null | number>(null)
  const [spClientList, setSpClientList] = useState<ProgrammingSoftwareListType[]>([])
  const [loading, setLoading] = useState(false)
  const projectService = new ProjectService()
  const clientService = new ClientsService()
  const { projectId, surveyId } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const getClientsSPList = async () => {
    try {
      const data = await clientService.getClientSP(clientId)
      setSpClientList(data)
    } catch (error) {
      logger.error(error)
    }
  }
  useEffect(() => {
    getClientsSPList()
  }, [])

  const ProjectXmlExport = async () => {
    const obj = {
      sp_id: String(spClient),
      project_id: String(projectId),
    }
    setLoading(true)
    if (projectId && surveyId)
      try {
        let data = await projectService.project_xml_export(Number(surveyId), obj)

        if (data?.log_file_path) {
          // Fetch the file and initiate download
          const response = await fetch(data?.log_file_path)
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data?.file_name // Change the filename as needed
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        }

        setLoading(false)
        handleClose()
        enqueueSnackbar('Project xml export successfully', {
          variant: 'success',
        })
      } catch (e) {
        console.log(e)
        enqueueSnackbar('Oops somthing went wrong !!', {
          variant: 'error',
        })
        setLoading(false)
      }
  }

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      {loading && <LoadingSpinner />}
      <DialogTitle>{'Export XML'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label style={{ marginLeft: '5px' }}>Programming Software*</label>
              <Select
                value={spClient?.toString() || ''}
                items={spClientList.map((spClient: any) => ({
                  text: spClient.name,
                  value: spClient?.id?.toString() || '',
                }))}
                onChange={(e) => {
                  setSpClient(Number(e.target.value))
                }}
                name="spClient"
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
        <Button onClick={ProjectXmlExport} variant="contained" disabled={!spClient ? true : false}>
          Export
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExportXmlComponent
