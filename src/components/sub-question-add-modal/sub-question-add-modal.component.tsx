import { Grid, IconButton, Stack } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import SinglePunch from '../questions-component/single-punch'
import MultiPunch from '../questions-component/multi-punch'
import NumericList from '../questions-component/numeric-list'
import { useEffect, useState } from 'react'
import Select from '@/components/select'
import LoadingSpinner from '../loader'
import TextList from '../questions-component/text-list'
import Ranking from '../questions-component/ranking'
import GridSinglePunch from '../questions-component/grid-single-punch'

const QUESTION_TYPE_COMPONENTS = {
  1: SinglePunch,
  2: MultiPunch,
  7: TextList,
  8: NumericList,
  9: Ranking,
  12: GridSinglePunch,
}

const Type = [
  {
    value: 1,
    text: 'Single Punch',
  },
  {
    value: 2,
    text: 'Multi Punch',
  },
  {
    value: 7,
    text: 'Text List',
  },
  {
    value: 8,
    text: 'Numeric List',
  },
  {
    value: 9,
    text: 'Ranking',
  },
  {
    value: 12,
    text: 'Grid Single Select',
  },
]

const SubQuestionAddModalComponent = ({ open, handleClose, sortingList, SaveSubQuestion, selectedQuestion, loading }: any) => {
  const [selectType, setSelectType] = useState<string | number>(1)
  const [question, setQuestion] = useState<any>(null)

  useEffect(() => {
    if (selectedQuestion && open) {
      let payload: any = {
        question_code: 'Q1',
        question_name: '',
        question_data_code: `${selectedQuestion?.question_name}${selectedQuestion?.sub_questions?.length + 1}`,
        required_question: true,
        answer_sorting_order: 1,
      }
      setQuestion(payload)
    }
  }, [open, selectType])

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      {loading && <LoadingSpinner />}
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <span>Create Question</span>
          <IconButton
            onClick={() => {
              handleClose()
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Select
                sx={{ marginTop: '5px' }}
                value={selectType.toString() || ''}
                items={Type}
                onChange={(e) => {
                  setSelectType(Number(e.target.value))
                }}
                label="Select question type"
                name="Type"
                isRequired={true}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              {(() => {
                // @ts-ignore
                const QuestionComponent =
                  // @ts-ignore
                  QUESTION_TYPE_COMPONENTS[selectType]
                return QuestionComponent ? (
                  <QuestionComponent
                    question={question}
                    surveyQuestionId={null}
                    add={true}
                    sortingList={sortingList}
                    SaveQuestion={SaveSubQuestion}
                  />
                ) : null
              })()}
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default SubQuestionAddModalComponent
