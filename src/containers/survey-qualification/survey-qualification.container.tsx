import { DetailsBox } from '@/components/project-details/project-details.style'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import * as React from 'react'
import AddQualificationComponent from '@/components/add-qualification'
import { useParams } from 'react-router-dom'
import { QualificationService } from '@/services/qualification.service'
import { logger } from '@/helpers/logger'
import { useSnackbar } from 'notistack'
import EditQualificationComponent from '@/components/edit-qualification'
import LoadingSpinner from '@/components/loader'
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd'

function SurveyQualificationContainer() {
  const { surveyId } = useParams()
  const qualificationServices = new QualificationService()
  const { enqueueSnackbar } = useSnackbar()
  const [qualifications, setQualifications] = React.useState<Array<any>>([])
  const [loading, setLoading] = React.useState(false)

  const getQualificationsData = async () => {
    setLoading(true)
    try {
      const data = await qualificationServices.get_qualifications_data(String(surveyId))
      setQualifications(data)
      setLoading(false)
    } catch {
      logger.log()
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
      setLoading(false)
    }
  }

  React.useEffect(() => {
    getQualificationsData()
  }, [surveyId])

  const onDragEnd = async (result: DropResult) => {
    const { destination } = result
    if (!destination) {
      return
    }
    const reorderedSections = Array.from(qualifications)
    const [moved] = reorderedSections.splice(result.source.index, 1)
    reorderedSections.splice(Number(result && result.destination && result?.destination?.index), 0, moved)

    const updatedAnswers = reorderedSections.map((qualification, index) => ({
      ...qualification,
      sort_order: index + 1,
    }))
    await setQualifications(updatedAnswers)
    QuestionSortOrder(updatedAnswers)
  }

  const QuestionSortOrder = async (qualificationData: any) => {
    setLoading(true)
    let obj = qualificationData.map((qualification: any) => {
      return {
        qualification_id: Number(qualification.qualification_id),
        sort_order: Number(qualification.sort_order),
      }
    })
    try {
      await qualificationServices.sort_qualifications({ order: obj }, Number(surveyId))
      getQualificationsData()
      enqueueSnackbar('Qualifications sort successfully', {
        variant: 'success',
      })
      setLoading(false)
    } catch (e) {
      console.log(e)
      enqueueSnackbar('Oops somthing went wrong !!', {
        variant: 'error',
      })
      setLoading(false)
    }
  }

  return (
    <DetailsBox padding="1rem 1.5rem" sx={{ height: 'calc(100vh - 270px)' }}>
      {loading && <LoadingSpinner />}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ background: '#f5f5f5' }}>
          <TableRow>
            <TableCell width="50px" />
            {/* <TableCell align="left" width="200px">
              Question Type
            </TableCell> */}
            <TableCell>Question</TableCell>
            <TableCell align="center">{qualifications.length > 0 ? 'Action' : ''}</TableCell>
          </TableRow>
        </TableHead>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="qualifications">
            {(provided) => (
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                {qualifications.map((row: any, i: any) => (
                  <Draggable key={String(row.qualification_id)} draggableId={String(row.qualification_id)} index={i}>
                    {(provided) => <EditQualificationComponent getQualificationsData={getQualificationsData} row={row} provided={provided} />}
                  </Draggable>
                ))}
                <AddQualificationComponent getQualificationsData={getQualificationsData} qualificationsData={qualifications} />
              </TableBody>
            )}
          </Droppable>
        </DragDropContext>
      </Table>
    </DetailsBox>
  )
}

export default SurveyQualificationContainer
