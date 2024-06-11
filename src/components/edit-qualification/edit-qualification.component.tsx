import { useEffect, useState } from 'react'
import { Button, Checkbox, Box, Typography, Grid, FormControlLabel, IconButton, Stack, TableRow, TableCell } from '@mui/material'
import { EditQualificationComponentProps, QualificationType } from './edit-qualification.type'
import TextFieldNew from '../text-field-new/text-field-new.component'
import TextField from '../text-field'
import { Delete } from '@mui/icons-material'
import { QualificationService } from '@/services/qualification.service'
import { logger } from '@/helpers/logger'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Edit } from '@mui/icons-material'
import { Switch } from '@mui/material'
import Collapse from '@mui/material/Collapse'
import LoadingSpinner from '../loader'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

const EditQualificationComponent = ({ getQualificationsData, row, provided }: EditQualificationComponentProps) => {
  const [qualifications, setQualifications] = useState<QualificationType[]>([])
  const [error, setError] = useState(false)
  const { surveyId } = useParams()
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const qualificationServices = new QualificationService()
  const { enqueueSnackbar } = useSnackbar()

  const CreateQuestionData = async () => {
    if (row) {
      const payload: any = {
        id: row.qualification_id,
        name: row?.qualification_code,
        qualificationTypeId: row.qualification_type_id,
        questionText: row.qualification_question_text,
        survey_qualification_id: row.survey_qualification_id,
      }

      if (row.qualification_type_id === 1 || row.qualification_type_id === 2) {
        payload.answers = row.answers.map((ans: any) => {
          return {
            id: ans.answer_id,
            label: ans.answer_text,
          }
        })
        payload.selectedAnswers = row.answer_ids
      } else if (row.qualification_type_id === 3) {
        payload.text = row.answer_texts[0]
      } else if (row.qualification_type_id === 4) {
        payload.selectedRange = row.answer_texts.map((value: any) => {
          const rangeValue = value.split('-')
          const payload = {
            min: parseInt(rangeValue[0]),
            max: parseInt(rangeValue[1]),
          }
          return payload
        })
      }
      setQualifications([payload])
    }
  }

  useEffect(() => {
    CreateQuestionData()
  }, [row])

  useEffect(() => {
    if (qualifications.length > 0) {
      if (qualifications[0]?.selectedAnswers?.length <= 0) {
        setError(true)
      } else if (qualifications[0]?.text === '') {
        setError(true)
      } else if (qualifications[0]?.selectedRange?.length > 0) {
        const error = qualifications[0]?.selectedRange?.some(
          (value) =>
            value.min === '' || value.max === '' || Number(value.min) > Number(value.max) || Number(value.min) < 18 || Number(value.max) > 100,
        )
        setError(error ? error : false)
      } else {
        setError(false)
      }
    }
  }, [qualifications])

  const save = async () => {
    setIsLoading(true)
    const payload: any = {
      qualification_id: qualifications[0]?.id,
      qualification_category_id: qualifications[0]?.qualificationCategoryId,
      qualification_conditions: {},
    }
    if (qualifications[0]?.qualificationTypeId === 1 || qualifications[0]?.qualificationTypeId === 2) {
      payload.qualification_conditions.answer_ids = qualifications[0].selectedAnswers
    } else if (qualifications[0]?.qualificationTypeId === 3) {
      payload.qualification_conditions.answer_texts = [qualifications[0]?.text]
    } else {
      payload.qualification_conditions.answer_texts = qualifications[0]?.selectedRange?.map((value) => {
        return `${value.min}-${value.max}`
      })
    }
    try {
      await qualificationServices.put_qualification(String(surveyId), String(qualifications[0]?.survey_qualification_id), payload)
      getQualificationsData()
      setEdit(false)
      enqueueSnackbar('Qualification updated sucessfully', {
        variant: 'success',
      })
      setIsLoading(false)
    } catch (e) {
      logger.log()
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
      setIsLoading(false)
    }
    setQualifications([])
    setError(false)
  }

  const ActiveDeactiveQualification = async (value: boolean) => {
    setIsLoading(true)
    let payload = {
      is_active: value,
    }
    try {
      await qualificationServices.active_deactive_qualification(String(surveyId), String(qualifications[0]?.survey_qualification_id), payload)
      getQualificationsData()
      setEdit(false)
      enqueueSnackbar(`Qualification ${value ? 'active' : 'deactive'} sucessfully`, {
        variant: 'success',
      })
      setIsLoading(false)
    } catch (e) {
      logger.log()
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
      setIsLoading(false)
    }
  }

  // console.log(qualifications, "qualificationsqualificationsqualifications")
  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DragIndicatorIcon />
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Stack>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box sx={{ width: 'calc(100vw - 700px)' }} dangerouslySetInnerHTML={{ __html: truncateText(row?.qualification_question_text, 180) }}></Box>
        </TableCell>
        {/* <TableCell align="left">{row?.qualification_category_id === 2 ? "Custom" : "Standard"}</TableCell> */}
        <TableCell align="left">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              size="small"
              checked={row.is_active}
              onChange={(e) => {
                ActiveDeactiveQualification(e.target.checked)
              }}
            />
            <IconButton
              size="small"
              sx={{ display: !row.is_active ? 'none' : '' }}
              onClick={() => {
                setEdit(true)
                setOpen(true)
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: !open ? 0 : '' }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {qualifications.map((value: QualificationType, i) => {
              return (
                <Box
                  key={i}
                  sx={{
                    // background: "#326fa820",
                    minHeight: '150px',
                    padding: '0.5rem',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '5px',
                    }}
                  >
                    <span> {value.name}</span> : <span dangerouslySetInnerHTML={{ __html: value?.questionText }}></span>
                  </Typography>

                  {value.qualificationTypeId === 1 || value.qualificationTypeId === 2 ? (
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={!edit}
                              size="small"
                              checked={qualifications[0]?.answers.length === qualifications[0]?.selectedAnswers?.length}
                              onChange={(e) => {
                                if (e.target.checked === true) {
                                  const payload: any = [...qualifications]
                                  payload[i].selectedAnswers = qualifications[i].answers.map((qual) => qual.id)
                                  setQualifications(payload)
                                } else {
                                  const payload: any = [...qualifications]
                                  payload[i].selectedAnswers = []
                                  setQualifications(payload)
                                }
                              }}
                            />
                          }
                          label="Select All"
                        />
                        {error && value?.selectedAnswers.length <= 0 ? <Box sx={{ color: 'red' }}>Please select atleast one field</Box> : ''}
                      </Grid>

                      {value?.answers?.map((ans) => {
                        return (
                          <Grid item xs={6}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={!edit}
                                  checked={qualifications[i]?.selectedAnswers?.includes(Number(ans.id)) ? true : false}
                                  size="small"
                                  onChange={(e) => {
                                    if (e.target.checked === true) {
                                      const payload: any = [...qualifications]
                                      payload[i].selectedAnswers.push(Number(ans.id))
                                      setQualifications(payload)
                                    } else {
                                      const payload: any = [...qualifications]
                                      payload[i].selectedAnswers = payload[i].selectedAnswers.filter((id: number) => ans.id !== id)
                                      console.log(payload)
                                      setQualifications(payload)
                                    }
                                  }}
                                />
                              }
                              // label={ans.label}
                              label={
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: ans.label,
                                  }}
                                ></p>
                              }
                            />
                          </Grid>
                        )
                      })}
                    </Grid>
                  ) : value.qualificationTypeId === 3 ? (
                    <TextFieldNew
                      multiline
                      //@ts-ignore
                      minRows={5}
                      value={value.text}
                      disabled={!edit}
                      onChange={(e) => {
                        const payload: any = [...qualifications]
                        payload[i].text = String(e.target.value)
                        setQualifications(payload)
                      }}
                    />
                  ) : (
                    value?.selectedRange?.map((range, index) => {
                      return (
                        <Grid container spacing={2} marginBottom="1rem">
                          <Grid item xs={3}>
                            <TextField
                              disabled={!edit}
                              autoSelectOnFocus
                              value={range.min}
                              fullWidth
                              onChange={(e) => {
                                const payload: any = [...qualifications]
                                payload[i].selectedRange[index].min = String(e.target.value)
                                setQualifications(payload)
                              }}
                              label="Min"
                              size="small"
                              type="number"
                              error={range.min === '' ? true : Number(range.min) < 18 ? true : false}
                              helperText={range.min === '' ? 'This field is Required' : Number(range.min) < 18 ? 'Min can not be less then 18' : ''}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              disabled={!edit}
                              autoSelectOnFocus
                              value={range.max}
                              onChange={(e) => {
                                const payload: any = [...qualifications]
                                payload[i].selectedRange[index].max = String(e.target.value)
                                setQualifications(payload)
                              }}
                              fullWidth
                              label="Max"
                              size="small"
                              type="number"
                              error={range.max === '' ? true : Number(range.min) > Number(range.max) ? true : Number(range.max) > 100 ? true : false}
                              helperText={
                                range.max === ''
                                  ? 'This field is Required'
                                  : Number(range.max) > 100
                                    ? 'Max can not be greater than 100'
                                    : Number(range.min) > Number(range.max)
                                      ? 'Max cannot be less than Min'
                                      : ''
                              }
                            />
                          </Grid>
                          <Grid item xs={2} display={edit && qualifications[i].selectedRange?.length > 1 ? '' : 'none'}>
                            <IconButton
                              onClick={() => {
                                const payload: any = [...qualifications]
                                // payload[i].selectedRange.splice(1, index)
                                payload[i].selectedRange.splice(index, 1)
                                setQualifications(payload)
                              }}
                            >
                              <Delete style={{ color: 'red' }} />
                            </IconButton>
                          </Grid>
                          <Grid item xs={4}></Grid>
                          <Grid
                            item
                            xs={6}
                            display={
                              //@ts-ignore
                              index === Number(value?.selectedRange?.length - 1) ? 'flex' : 'none'
                            }
                            alignItems="center"
                            justifyContent="flex-end"
                          >
                            <Button
                              variant="text"
                              size="small"
                              disabled={!edit}
                              onClick={() => {
                                const payload: any = [...qualifications]
                                payload[i].selectedRange.push({
                                  min: '18',
                                  max: '99',
                                })
                                setQualifications(payload)
                              }}
                            >
                              + Add more input
                            </Button>
                          </Grid>
                        </Grid>
                      )
                    })
                  )}
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} display={edit ? '' : 'none'}>
                    <Button
                      variant="text"
                      color="inherit"
                      onClick={() => {
                        setOpen(false)
                        setEdit(false)
                        getQualificationsData()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="info"
                      variant="contained"
                      disabled={error || !edit || isLoading}
                      onClick={() => {
                        save()
                      }}
                    >
                      Save
                    </Button>
                  </Stack>
                </Box>
              )
            })}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default EditQualificationComponent
