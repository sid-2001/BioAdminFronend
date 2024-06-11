import { Box, Button, Checkbox, FormControlLabel, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { EditIcon, NestedQualificationIcon } from '@/assets/images'
import { useParams } from 'react-router-dom'
import QualConfigurationComponent from '../qual-configuration'

const NestedQuotaQualificationsComponent = ({ qualification, setQualification, setRows, setColumns, addData, setQualOpen }: any) => {
  const [qualId, setQualId] = useState<number[]>([])
  const [open, setOpen] = useState(false)
  const [editQual, setEditQual] = useState(null)
  const [valid, setValid] = useState(false)
  let { surveyId } = useParams()

  const handleClose = () => {
    setOpen(false)
    setEditQual(null)
  }

  useEffect(() => {
    let check = false
    qualification.filter((qual: any) => {
      if (qual.qualification_type_id === 1 || qual.qualification_type_id === 2) {
        if (qual.checked === true) {
          if (qual.selectedAnsCheck.length > 0) {
            check = true
          } else {
            check = false
          }
        }
      } else if (qual.qualification_type_id === 3) {
        if (qual.checked === true) {
          if (qual.selectedTextCheck.length > 0) {
            check = true
          } else {
            check = false
          }
        }
      } else {
        if (qual.checked === true) {
          if (qual.selectedRangeCheck.length > 0) {
            check = true
          } else {
            check = false
          }
        }
      }
    })
    setValid(check)
  }, [qualification])

  function crossJoin(surveyId: any, questions: any) {
    // Initialize result array
    let result: any = []
    // Recursive function to generate combinations
    function generateCombinations(surveyId: any, index: any, currentCombination: any) {
      // If index is equal to the number of questions, we've reached the end
      if (index === questions.length) {
        let quota = {
          name: '',
          quotaCpi: 0,
          completes: 0,
          starts: 0,
          quotaTarget: null,
          sampleNumber: 0,
          remaining: 0,
          isActive: true,
          conditions: currentCombination.slice(),
        }
        result.push({ surveyId: surveyId, quota: quota })
        return
      }

      // Iterate over answers for the current question
      for (let answerObj of questions[index].answers) {
        // Add current answer to the combination
        if (questions[index].qualification_type_id == 4 || questions[index].qualification_type_id == 3) {
          let answerText = [answerObj.qualificationAnswerDesc]
          currentCombination.push({
            qualification_id: questions[index].qualification_id,
            qualification_category_id: questions[index].qualification_category_id,
            qualification_type_id: questions[index].qualification_type_id,
            answerText,
            isActive: true,
          })
        } else {
          let answerText = [answerObj.qualificationAnswerDesc]
          let answerId = [answerObj.id]
          currentCombination.push({
            qualification_id: questions[index].qualification_id,
            qualification_category_id: questions[index].qualification_category_id,
            qualification_type_id: questions[index].qualification_type_id,
            answerId,
            answerText,
            isActive: true,
          })
        }

        // Recur to next question
        generateCombinations(surveyId, index + 1, currentCombination)
        // Backtrack - remove the last added answer
        currentCombination.pop()
      }
    }
    // Start generating combinationscd
    generateCombinations(surveyId, 0, [])
    return result
  }

  const onPrceed = () => {
    let data = JSON.parse(JSON.stringify(qualification))
    let proceedData = JSON.parse(
      JSON.stringify(
        data
          .filter((val: any) => {
            if (val.checked && val.isActive) {
              return true
            } else {
              return false
            }
          })
          .map((val: any) => {
            if (val.qualification_type_id === 1 || val.qualification_type_id === 2) {
              val.answers = val.answers
                .filter((ans: any) => val.selectedAnsCheck.includes(Number(ans.answer_id)))
                .map((ans: any) => {
                  delete ans.createdAt
                  delete ans.createdBy
                  delete ans.answerRefId
                  delete ans.isActive
                  delete ans.precode
                  delete ans.questionId
                  delete ans.updatedAt
                  delete ans.updatedBy
                  let payload = {
                    id: Number(ans.answer_id),
                    qualificationAnswerDesc: ans.answer_text,
                  }
                  ans = payload
                  return ans
                })
              delete val.selectedAnsCheck
              delete val.selectedAnswers
            } else if (val.qualification_type_id === 3) {
              val.answers = val.text
                .filter((_ans: any, textIndex: any) => val.selectedTextCheck.includes(Number(textIndex)))
                .map((ans: any) => {
                  return {
                    id: null,
                    qualificationAnswerDesc: ans,
                  }
                })
              delete val.selectedText
              delete val.selectedTextCheck
              delete val.text
            } else {
              val.answers = val.range
                .filter((_ans: any, rangeIndex: any) => val.selectedRangeCheck.includes(Number(rangeIndex)))
                .map((ans: any) => {
                  return {
                    id: null,
                    qualificationAnswerDesc: `${ans.min}-${ans.max}`,
                  }
                })
              delete val.selectedRange
              delete val.selectedRangeCheck
              delete val.range
            }
            return val
          }),
      ),
    )

    let createColumns = proceedData
      .filter((val: any) => val.isActive)
      .map((val: any) => {
        return {
          id: Number(val.qualification_id),
          numeric: false,
          disablePadding: false,
          label: val.qualification_name,
          code: val.qualification_code,
          question_text: val.qualification_question_text,
        }
      })
    let uniqueColumn = [
      {
        id: 'sampleNumber',
        numeric: true,
        disablePadding: false,
        label: 'Quota',
      },
      {
        id: 'starts',
        numeric: true,
        disablePadding: false,
        label: 'Starts',
      },
      {
        id: 'completes',
        numeric: true,
        disablePadding: false,
        label: 'Completes',
      },
      {
        id: 'conversion',
        numeric: true,
        disablePadding: false,
        label: 'Conversion',
      },
      {
        id: 'remaining',
        numeric: true,
        disablePadding: false,
        label: 'Remaining',
      },
    ]

    const newColumn = createColumns.concat(uniqueColumn)
    if (!addData) {
      newColumn.push({
        id: 'isActive',
        numeric: true,
        disablePadding: false,
        label: 'Actions',
      })
    }
    setColumns(newColumn)
    const result = crossJoin(surveyId, proceedData)
    console.log(result, 'result')
    setRows(JSON.parse(JSON.stringify(result)))
    setQualOpen(false)
  }

  return (
    <Box
      sx={{
        height: `calc(100vh - 350px)`,
        overflowY: 'auto',
        borderRight: '1px solid var(--Grey-3, #E4E4E4)',

        paddingRight: '1rem',
      }}
    >
      <QualConfigurationComponent
        open={open}
        handleClose={handleClose}
        editQual={editQual}
        setEditQual={setEditQual}
        qualification={qualification}
        setQualification={setQualification}
      />
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          paddingTop: '0.5rem',
          paddingInline: '0.5rem',
          top: 0,
          position: 'sticky',
          background: 'white',
          zIndex: 2,
          marginBottom: '0.5rem',
        }}
      >
        <img src={NestedQualificationIcon} />
        <Typography fontWeight="600" fontSize="18px" color="primary">
          Qualifications
        </Typography>
      </Stack>
      {qualification.length > 0 ? (
        qualification?.map((val: any, qualIndex: number) => {
          return (
            <Box sx={{ background: !val.isActive ? '#f5f5f5' : '' }} key={qualIndex}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py={0.5}
                sx={{
                  borderBottom: qualId.includes(val.survey_qualification_id) ? `1px solid black` : '1px solid #E4E4E4',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={0}>
                  <Checkbox
                    disabled={!val.isActive}
                    color="primary"
                    checked={val.isActive && val.checked ? true : false}
                    onChange={(e) => {
                      let payload = [...qualification]
                      payload[qualIndex].checked = e.target.checked
                      if (e.target.checked === false) {
                        if (val.qualification_type_id === 1 || val.qualification_type_id === 2) {
                          payload[qualIndex].selectedAnsCheck = []
                        } else if (val.qualification_type_id === 3) {
                          payload[qualIndex].selectedTextCheck = []
                        } else {
                          payload[qualIndex].selectedRangeCheck = []
                        }
                      } else {
                        if (val.qualification_type_id === 1 || val.qualification_type_id === 2) {
                          payload[qualIndex].selectedAnsCheck = qualification[qualIndex].selectedAnswers
                        } else if (val.qualification_type_id === 3) {
                          payload[qualIndex].selectedTextCheck = qualification[qualIndex].text.map((_val: any, index: number) => Number(index))
                        } else {
                          payload[qualIndex].selectedRangeCheck = qualification[qualIndex].range.map((_val: any, index: number) => Number(index))
                        }
                      }
                      setQualification(payload)
                      let payloadCheck = [...qualId]
                      if (!qualId.includes(val.survey_qualification_id)) {
                        payloadCheck.push(Number(val.survey_qualification_id))
                      }
                      setQualId(payloadCheck)
                    }}
                  />
                  <Typography
                    fontWeight="400"
                    fontSize="14px"
                    dangerouslySetInnerHTML={{
                      __html: `${val?.qualification_code}-${val?.qualification_name}`,
                    }}
                  ></Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0}>
                  <IconButton
                    disabled={!val.isActive}
                    sx={{
                      display: val.qualification_type_id === 4 || val.qualification_type_id === 3 ? '' : 'none',
                    }}
                    onClick={() => {
                      setOpen(true)
                      setEditQual(JSON.parse(JSON.stringify(val)))
                      let payload = [...qualId]
                      if (!qualId.includes(val.survey_qualification_id)) {
                        payload.push(Number(val.survey_qualification_id))
                      }
                      setQualId(payload)
                    }}
                  >
                    <img src={EditIcon} height="15px" />
                  </IconButton>
                  <IconButton
                    sx={{ padding: '6px !important' }}
                    onClick={() => {
                      let payload = [...qualId]
                      if (qualId.includes(val.survey_qualification_id)) {
                        payload = qualId.filter((valId) => valId !== Number(val.survey_qualification_id))
                      } else {
                        payload.push(Number(val.survey_qualification_id))
                      }
                      setQualId(payload)
                    }}
                  >
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: '1.5rem',
                        transform: qualId.includes(val.survey_qualification_id) ? 'rotate(180deg)' : '',
                      }}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Box
                sx={{
                  display: !qualId.includes(Number(val.survey_qualification_id)) ? 'none' : '',
                }}
              >
                {val.qualification_type_id === 1 || val.qualification_type_id === 2
                  ? val.answers
                      .filter((ans: any) => val.selectedAnswers.includes(Number(ans.answer_id)))
                      .map((ans: any, ansI: number) => {
                        return (
                          <Stack sx={{ marginLeft: '1rem', borderBottom: '1px solid #E4E4E4' }} key={ansI}>
                            <FormControlLabel
                              sx={{ paddingInline: '0.2rem' }}
                              control={
                                <Checkbox
                                  disabled={!val.isActive}
                                  checked={val.isActive && val.selectedAnsCheck.includes(Number(ans.answer_id))}
                                  color="primary"
                                  onChange={(e) => {
                                    let payload = [...qualification]
                                    if (e.target.checked) {
                                      payload[qualIndex].selectedAnsCheck.push(Number(ans.answer_id))
                                    } else {
                                      payload[qualIndex].selectedAnsCheck = qualification[qualIndex].selectedAnsCheck.filter(
                                        (value: any) => value !== Number(ans.answer_id),
                                      )
                                    }
                                    if (payload[qualIndex].selectedAnsCheck.length > 0) {
                                      payload[qualIndex].checked = true
                                    } else {
                                      payload[qualIndex].checked = false
                                    }
                                    setQualification(payload)
                                  }}
                                />
                              }
                              label={
                                <span
                                  style={{ fontSize: '14px', fontWeight: '400' }}
                                  dangerouslySetInnerHTML={{
                                    __html: `${ans.answer_text}`,
                                  }}
                                ></span>
                              }
                              key={ansI}
                            />
                          </Stack>
                        )
                      })
                  : val.qualification_type_id === 3
                    ? val?.text?.map((textValue: any, textI: number) => {
                        return (
                          <Stack sx={{ marginLeft: '1rem', borderBottom: '1px solid #E4E4E4' }} key={textI}>
                            <FormControlLabel
                              sx={{ paddingInline: '0.2rem' }}
                              control={
                                <Checkbox
                                  disabled={!val.isActive}
                                  color="primary"
                                  checked={val.isActive && val.selectedTextCheck.includes(Number(textI))}
                                  onChange={(e) => {
                                    let payload = [...qualification]
                                    if (e.target.checked) {
                                      payload[qualIndex].selectedTextCheck.push(Number(textI))
                                    } else {
                                      payload[qualIndex].selectedTextCheck = qualification[qualIndex].selectedTextCheck.filter(
                                        (value: any) => value !== Number(textI),
                                      )
                                    }
                                    if (payload[qualIndex].selectedTextCheck.length > 0) {
                                      payload[qualIndex].checked = true
                                    } else {
                                      payload[qualIndex].checked = false
                                    }
                                    setQualification(payload)
                                  }}
                                />
                              }
                              label={
                                <span
                                  style={{ fontSize: '14px', fontWeight: '400' }}
                                  dangerouslySetInnerHTML={{
                                    __html: `${textValue}`,
                                  }}
                                ></span>
                              }
                              key={textI}
                            />
                          </Stack>
                        )
                      })
                    : val.qualification_type_id === 4
                      ? val?.range?.map((rangeValue: any, rangeI: number) => {
                          return (
                            <Stack sx={{ marginLeft: '1rem', borderBottom: '1px solid #E4E4E4' }} key={rangeI}>
                              <FormControlLabel
                                sx={{ paddingInline: '0.2rem' }}
                                control={
                                  <Checkbox
                                    disabled={!val.isActive}
                                    checked={val.isActive && val.selectedRangeCheck.includes(Number(rangeI))}
                                    color="primary"
                                    onChange={(e) => {
                                      let payload = [...qualification]
                                      if (e.target.checked) {
                                        payload[qualIndex].selectedRangeCheck.push(Number(rangeI))
                                      } else {
                                        payload[qualIndex].selectedRangeCheck = qualification[qualIndex].selectedRangeCheck.filter(
                                          (value: any) => value !== Number(rangeI),
                                        )
                                      }
                                      if (payload[qualIndex].selectedRangeCheck.length > 0) {
                                        payload[qualIndex].checked = true
                                      } else {
                                        payload[qualIndex].checked = false
                                      }
                                      setQualification(payload)
                                    }}
                                  />
                                }
                                label={
                                  <span
                                    style={{ fontSize: '14px', fontWeight: '400' }}
                                    dangerouslySetInnerHTML={{
                                      __html: `${rangeValue.min}-${rangeValue.max}`,
                                    }}
                                  ></span>
                                }
                                key={rangeI}
                              />
                            </Stack>
                          )
                        })
                      : ''}
              </Box>
            </Box>
          )
        })
      ) : (
        <Box fontSize="15px" fontWeight="500" display="flex" mt={5} alignItems="center" justifyContent="center">
          There are no Qualification here!
        </Box>
      )}

      <Stack
        sx={{
          paddingBottom: '0.5rem',
          paddingInline: '0.2rem',
          bottom: 0,
          position: 'sticky',
          background: 'white',
          zIndex: 2,
          marginTop: '1rem',
          display: qualification.length <= 0 ? 'none' : '',
        }}
      >
        <Button
          fullWidth
          variant="contained"
          disabled={valid ? false : true}
          onClick={() => {
            onPrceed()
          }}
        >
          Proceed
        </Button>
      </Stack>
    </Box>
  )
}

export default NestedQuotaQualificationsComponent
