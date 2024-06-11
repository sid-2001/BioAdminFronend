import { EditOutlined, InfoOutlined } from '@mui/icons-material'
import { Box, Button, Divider, FormControl, Grid, IconButton, Menu, MenuItem, Select, Stack, Typography } from '@mui/material'
import { DetailsBox } from '@/components/project-details/project-details.style'
// import CustomDividerComponent from '@/components/custom-divider'
import { useOutletContext, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { QualificationService } from '@/services/qualification.service'
import { useSnackbar } from 'notistack'
import { logger } from '@/helpers/logger'
import NestedQuotaTable from '@/components/nested-quota-table/nested-quota-table'
import { QuotaListIcon } from '@/assets/images'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Controller, useForm } from 'react-hook-form'
import TextField from '@/components/text-field'
import { QuotaService } from '@/services/quotas.service'
import LoadingSpinner from '@/components/loader'
import NestedQuotaQualificationsComponent from '@/components/nested-quota-qualifications'
import { ListService, StatusListType } from '@/services/list.service'
import { SurveysService } from '@/services/surveys.service'

const NestedQuotaContainer = () => {
  const [qualification, setQualification] = useState<any>([])
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])
  const [addData, setAddData] = useState(true)
  const [qualOpen, setQualOpen] = useState(false)
  const [getQuotaData, setGetQuotaData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [quotaSumError, setQuotaSumError] = useState(false)
  const [quotaSurveyError, setQuotaSurveyError] = useState(false)
  const [getQual, setGetQual] = useState(false)
  const [isEdit, setIsEdit] = useState({
    disabled: false,
    edit: false,
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const qualificationServices = new QualificationService()
  const quotaServices = new QuotaService()

  const listServices = new ListService();
  const surveysService = new SurveysService();

  const [surveyCalcList, setSurveyCalcList] = useState<StatusListType[]>([]);

  let { surveyId } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const { survey, getAndUpdateSurvey } = useOutletContext<any>()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      target: 0,
      survey_calc_type: 1,
      fillTarget: 1,
      missingTarget: 0,
    },
  })

  const GetSurveyCalcTypes = async () => {
    try {
      const data = await listServices.get_survey_calc_types()
      setSurveyCalcList(data)
    } catch (error) {
      logger.error(error)
    }
  }


  async function UpdateSurveyCalcType() {
    setIsLoading(true);
    const payload: any = { ...survey };
    payload.survey_calc_type = watch('survey_calc_type')
    console.log(payload, "payloadpayload")
    try {
      await surveysService.putsurvey(payload);
      // getAndUpdateSurvey();
      setIsLoading(false);
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      });
      setIsLoading(false);
    }
  }


  const changeCalculation = async () => {
    setIsLoading(true)
    let payload = {
      fill_target_id: watch('fillTarget'),
      // sample_size: watch('target'),
    }
    try {
      await quotaServices.nested_quota_fill_target(String(surveyId), payload)
      // await getAndUpdateSurvey()
      setIsLoading(false)
    } catch (e) {
      console.log(e)
      enqueueSnackbar('Oopss! somthig went wrong', {
        variant: 'error',
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (survey?.fill_target_id) {
      setValue('fillTarget', survey?.fill_target_id)
    }
  }, [survey])

  useEffect(() => {
    let count = 0
    rows.map((val: any) => {
      count = count + Number(val.quota.completes)
    })
    setValue('missingTarget', Number(Number(watch('target')) - count))
  }, [rows, watch('target')])

  useEffect(() => {
    if (rows.length > 0) {
      let count = 0
      rows
        .filter((val: any) => val.quota.isActive)
        .map((val: any) => {
          count = count + val.quota.sampleNumber
        })
      if (count === 0) {
        setValue('target', Number(survey?.sample_size))
      } else {
        setValue('target', Number(count))
      }
    } else if (survey?.sample_size) {
      setValue('target', Number(survey?.sample_size))
    }
  }, [rows, survey])

  useEffect(() => {
    if (Number(watch('target')) > Number(survey?.sample_size)) {
      setQuotaSurveyError(true)
    } else {
      setQuotaSurveyError(false)
    }

    let count = 0
    rows.map((val: any) => {
      count = count + Number(val.quota.sampleNumber)
    })
    if (count > Number(watch('target'))) {
      setQuotaSumError(true)
    } else {
      setQuotaSumError(false)
    }
  }, [rows, watch('target')])

  function fillTargets(quotas: any, noOfTargets: any) {
    let length = quotas.length
    let zp = length - (noOfTargets % length)
    let pp = Math.floor(noOfTargets / length)
    let i = 0
    for (let surveyQuota of quotas) {
      if (i >= zp) surveyQuota.quota.sampleNumber = pp + 1
      else surveyQuota.quota.sampleNumber = pp
      i++
    }
    return quotas
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const getQualificationList = async () => {
    try {
      const data = await qualificationServices.get_qualifications_data(String(surveyId))
      let tempQualificationQuestions = data?.map((qualification: any) => {
        qualification.checked = false
        qualification.isActive = qualification.is_active
        if (qualification.qualification_type_id === 4) {
          let ranges = qualification.answer_texts.map((value: any) => {
            let rangeValue = value.split('-')
            let payload = {
              min: parseInt(rangeValue[0]),
              max: parseInt(rangeValue[1]),
            }
            return payload
          })
          qualification.range = ranges
          qualification.selectedRange = ranges
          qualification.selectedRangeCheck = []
        } else if (qualification.qualification_type_id === 3) {
          qualification.text = qualification?.answer_texts
          qualification.selectedText = qualification?.answer_texts
          qualification.selectedTextCheck = []
        } else {
          qualification.selectedAnswers = qualification.answer_ids
          qualification.selectedAnsCheck = []
        }
        delete qualification.answer_ids
        delete qualification.answer_texts
        delete qualification.is_active
        return qualification
      })
      tempQualificationQuestions.sort((a, b) => a.qualification_id - b.qualification_id)
      await setQualification(tempQualificationQuestions)
    } catch {
      logger.log()
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
    }
  }

  let getQuotasList = async () => {
    setIsLoading(true)
    try {
      const data = await quotaServices.get_nested_quota(String(surveyId))

      let payload = data.data.quota.map((value: any) => {
        value.isActive = value.is_active
        value.quotaCpi = value.quota_cpi
        value.quotaTarget = value.quota_target
        value.sampleNumber = value.sample_size
        delete value.is_active
        delete value.quota_cpi
        delete value.quota_target
        delete value.sample_size
        value.conditions = value.conditions.map((val: any) => {
          val.answerId = val.answer_ids
          val.answerText = val.answer_texts
          val.isActive = val.is_active
          delete val.answer_ids
          delete val.answer_texts
          delete val.is_active
          return val
        })
        return { quota: value }
      })
      if (payload.length > 0) {
        setGetQuotaData(payload)
        setAddData(false)
        setIsEdit({
          disabled: true,
          edit: false,
        })
      } else {
        setIsLoading(false)
      }
      setIsLoading(false)
    } catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }

  const callApi = async () => {
    setIsLoading(true)
    await getQualificationList()
    await getQuotasList()
  }

  useEffect(() => {
    if (surveyId) {
      callApi()
    }
  }, [surveyId])

  const save = async () => {
    let payload = JSON.parse(JSON.stringify(rows))
    let localdata = payload.map((val: any) => {
      delete val.quota.quotaCpi
      delete val.quota.completes
      delete val.quota.quotaTarget
      delete val.quota.remaining
      delete val.quota.starts
      val.quota.is_active = val.quota.isActive
      val.quota.sample_size = val.quota.sampleNumber
      let localQuota = val.quota.conditions
        .filter((value: any) => value.qualification_id)
        .map((value: any) => {
          if (value.answerId) {
            value.answer_ids = value.answerId
            delete value.answerId
            delete value.answerText
          } else {
            value.answer_texts = value.answerText
            delete value.answerText
          }
          value.is_active = value.isActive
          value.qualification_id = value.qualification_id
          delete value.isActive
          return value
        })
      val.quota.conditions = localQuota
      delete val.quota.sampleNumber
      delete val.quota.isActive
      return val.quota
    })

    let finalPayload = {
      survey_id: Number(surveyId),
      quotas: localdata,
    }
    setIsLoading(true)
    try {
      if (addData) {
        await quotaServices.post_survey_nested_quotas(String(surveyId), finalPayload)
        if (watch('survey_calc_type')) {
          await UpdateSurveyCalcType()
        }
      } else {
        await quotaServices.put_survey_nested_quotas(String(surveyId), finalPayload)
        if (watch('survey_calc_type')) {
          await UpdateSurveyCalcType()
        }
      }
      await changeCalculation()
      await getAndUpdateSurvey()
      await getQualificationList()
      await getQuotasList()
      enqueueSnackbar('Quota is saved successfully', {
        variant: 'success',
      })
      setIsLoading(false)
    } catch (e) {
      console.log(e)
      enqueueSnackbar('Oopss! somthig went wrong', {
        variant: 'error',
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let idsArray: number[] = []
    getQuotaData.map((val: any) =>
      val.quota.conditions.map((value: any) => {
        if (!idsArray.includes(Number(value.qualification_id))) {
          idsArray.push(value.qualification_id)
        }
      }),
    )

    let createColumns = qualification
      .filter((val: any) => idsArray.includes(Number(val.qualification_id)))
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
      {
        id: 'isActive',
        numeric: true,
        disablePadding: false,
        label: 'Actions',
      },
    ]

    let copyArray = JSON.parse(JSON.stringify(getQuotaData))
    let localData = copyArray.map((val: any) => {
      val.quota.conditions.map((value: any) => {
        if (value.answerId && value.answerId.length > 0) {
          let ansText = ''
          let findQues = qualification.find((ques: any) => Number(value.qualification_id) === Number(ques.qualification_id))
          if (findQues) {
            ansText = findQues.answers.find((ans: any) => Number(value.answerId[0]) === Number(ans.answer_id))?.answer_text
            if (ansText) {
              value.answerText = [ansText]
            }
          }
        } else {
          delete value.answerId
        }
        return value
      })
      return val
    })

    const newColumn = createColumns.concat(uniqueColumn)
    setColumns(newColumn)

    if (qualification.length > 0) {
      setRows(localData)
      setTimeout(() => {
        setGetQual(true)
      }, 200)
    }
  }, [getQuotaData])

  useEffect(() => {
    if (getQual) {
      let idsArray: number[] = []
      getQuotaData.map((val: any) =>
        val.quota.conditions.map((value: any) => {
          if (!idsArray.includes(Number(value.qualification_id))) {
            idsArray.push(value.qualification_id)
          }
        }),
      )

      let payload = [...qualification]
      payload.map((val) => {
        let answerId: any = []
        let answerText: any = []
        getQuotaData.map((quota: any) => {
          quota.quota.conditions
            .filter((value: any) => Number(value.qualification_id) === Number(val.qualification_id))
            .map((value: any) => {
              if (value?.answerId?.length > 0) {
                if (!answerId.includes(Number(value.answerId[0]))) {
                  answerId.push(value.answerId[0])
                }
              } else {
                if (!answerText.includes(value.answerText[0])) {
                  answerText.push(value.answerText[0])
                }
              }
            })
        })
        if (val.qualification_type_id === 1 || val.qualification_type_id === 2) {
          val.selectedAnswers = val.selectedAnswers
          val.selectedAnsCheck = answerId.length > 0 ? answerId : val.selectedAnsCheck
        } else if (val.qualification_type_id === 4) {
          let localRange = val.range.map((rangeVal: any) => {
            return `${rangeVal.min}-${rangeVal.max}`
          })

          let selectedIndex: any = []

          answerText.map((ansText: any) => {
            if (!localRange.includes(ansText)) {
              localRange.push(ansText)
            }
          })

          localRange.map((ansText: any, index: any) => {
            if (answerText.includes(ansText)) {
              if (!selectedIndex.includes(index)) {
                selectedIndex.push(index)
              }
            }
          })

          val.range = localRange.map((value: any) => {
            let rangeValue = value.split('-')
            let payload = {
              min: parseInt(rangeValue[0]),
              max: parseInt(rangeValue[1]),
            }
            return payload
          })
          val.selectedRange = val.range
          val.selectedRangeCheck = selectedIndex
        } else {
          let selectedTextIndex: any = []

          answerText.map((ansText: any) => {
            if (!val.text.includes(ansText)) {
              val.text.push(ansText)
            }
          })

          val?.text?.map((ansText: any, index: any) => {
            if (answerText.includes(ansText)) {
              if (!selectedTextIndex.includes(index)) {
                selectedTextIndex.push(index)
              }
            }
          })
          val.selectedText = val.text
          val.selectedTextCheck = selectedTextIndex
        }
        if (idsArray.includes(val.qualification_id)) {
          val.checked = true
        }
        return val
      })
      setQualification(payload)
      if (qualification.length > 0) {
        setGetQual(false)
        setIsLoading(false)
      }
    }
  }, [getQuotaData, getQual])

  useEffect(() => {
    if (addData) {
      setQualOpen(true)
    } else {
      setQualOpen(false)
    }
  }, [addData, isEdit])

  const QuotaActiveDeactive = async (isActive: boolean, quotaId: any) => {
    setIsLoading(true)
    try {
      await quotaServices.active_deactive_nested_quota(String(surveyId), String(quotaId), {
        is_active: isActive,
      })
      await getQuotasList()
      enqueueSnackbar(`Quota ${isActive ? 'active' : 'deactive'} successfully`, {
        variant: 'success',
      })
      setIsLoading(false)
    } catch (e: any) {
      console.log(e)
      enqueueSnackbar(`${e?.error_message?.data?.message ? e?.error_message?.data?.message : 'Oopss! somthig went wrong'}`, {
        variant: 'error',
      })
      setIsLoading(false)
    }
  }


  useEffect(() => {
    if (survey?.survey_calc_type) {
      setValue("survey_calc_type", survey?.survey_calc_type);
    }
  }, [survey]);


  useEffect(() => {
    GetSurveyCalcTypes()
  }, [surveyId])

  return (
    <form onSubmit={handleSubmit(save)} noValidate>
      {isLoading && <LoadingSpinner />}

      <DetailsBox padding="0rem 1.5rem" sx={{ height: 'calc(100vh - 275px) !important' }}>
        <Stack
          sx={{
            marginBottom: '1rem',
            paddingTop: '1rem',
            position: 'sticky',
            top: 0,
            background: 'white',
            zIndex: 1,
          }}
          spacing={1}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Quota</Typography>
            {isEdit.edit || addData ? (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  color="primary"
                  variant="text"
                  sx={{ display: !qualOpen && (addData || isEdit.edit) ? '' : 'none' }}
                  size="small"
                  startIcon={<EditOutlinedIcon sx={{ height: '1.5rem !important' }} />}
                  onClick={() => {
                    setQualOpen(true)
                  }}
                >
                  Qualification
                </Button>

                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ display: addData || isEdit.edit ? '' : 'none' }}
                  onClick={async () => {
                    if (addData) {
                      setRows([])
                      setGetQuotaData([])
                      await getQualificationList()
                    } else {
                      await callApi()
                    }
                    setQualOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  type="submit"
                  disabled={rows.length <= 0 || quotaSumError || quotaSurveyError}
                  sx={{ display: addData || isEdit.edit ? '' : 'none' }}
                >
                  Save
                </Button>
              </Stack>
            ) : (
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<EditOutlined />}
                onClick={() => {
                  setIsEdit({
                    disabled: false,
                    edit: true,
                  })
                }}
              >
                Edit
              </Button>
            )}
          </Stack>
          <Divider />
          {/* <CustomDividerComponent /> */}
        </Stack>
        <Grid container spacing={2} px={1}>
          <Grid xs={qualOpen ? 2.5 : 0} sx={{ paddingTop: '4px !important', display: !qualOpen ? 'none' : '' }}>
            <NestedQuotaQualificationsComponent
              qualification={qualification}
              setQualification={setQualification}
              setRows={setRows}
              setColumns={setColumns}
              addData={addData}
              setQualOpen={setQualOpen}
            />
          </Grid>
          <Grid item xs={qualOpen ? 9.5 : 12} sx={{ paddingTop: '4px !important' }}>
            <Box sx={{ height: `calc(100vh - 350px)`, overflowY: 'auto', paddingInline: isEdit.disabled ? '' : '10px' }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                {/* <img src={QuotaIcon} /> */}
                <Typography fontWeight="600" fontSize="18px" color="primary">
                  Quotas
                </Typography>
                <IconButton
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  size="small"
                >
                  <InfoOutlined />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  sx={{ padding: '1rem !important' }}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <ol
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      margin: '0rem 1rem 0rem 2rem',
                      color: 'black',
                    }}
                  >
                    <li>
                      Select Qualification
                      <ul style={{ marginLeft: '1rem' }}>
                        <li>select options</li>
                        <li>configure range</li>
                        <li>open-end qualifications</li>
                      </ul>
                    </li>
                    <li>
                      Proceed to create quotas
                      <ul style={{ marginLeft: '1rem' }}>
                        <li> specify target required</li>
                        <li>quota type</li>
                        <li>target fill type</li>
                      </ul>
                    </li>
                  </ol>
                </Menu>
              </Stack>

              <Grid container spacing={2} mb={3} sx={{ display: rows.length <= 0 ? 'none' : '' }}>
                <Grid item xs={2}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Target*</label>
                  {isEdit.edit || addData ? (
                    <Controller
                      name="target"
                      control={control}
                      rules={{
                        required: 'Target is required!',
                      }}
                      render={({ field }) => (
                        <TextField
                          sx={{ marginTop: '10px' }}
                          size="small"
                          {...field}
                          fullWidth
                          disabled={isEdit.disabled}
                          variant="outlined"
                          placeholder="Target"
                          error={errors?.target || quotaSumError || quotaSurveyError ? true : false}
                          helperText={
                            errors?.target
                              ? errors.target.message
                              : quotaSumError
                                ? 'Quota sum should not be greater then target'
                                : quotaSurveyError
                                  ? 'Target can not be greater then survey sample size'
                                  : null
                          }
                        />
                      )}
                    />
                  ) : (
                    <Typography fontSize="14px" fontWeight="600">
                      {watch('target')}
                    </Typography>
                  )}
                </Grid>


                <Grid item xs={2}>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Calculation Type*</label>
                  {isEdit.edit || addData ? (
                    <FormControl fullWidth>
                      <Select
                        sx={{ borderRadius: "4px !important", height: "38px", marginTop: "10px" }}
                        size="small"
                        value={watch("survey_calc_type")}
                        onChange={e => {
                          setValue("survey_calc_type", Number(e.target.value));
                        }}
                      >
                        {
                          surveyCalcList && surveyCalcList?.map((item) => (
                            <MenuItem value={item?.id}>{item?.name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography fontSize="14px" fontWeight="600">
                      {surveyCalcList && surveyCalcList?.find((item: any) => item.id == watch('survey_calc_type'))?.name}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={2}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Missing*</label>
                  <Typography fontSize="14px" fontWeight="600" sx={{ marginTop: isEdit.edit || addData ? '15px' : '' }}>
                    {watch('missingTarget')}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Fill Targets*</label>
                  {isEdit.edit || addData ? (
                    <FormControl fullWidth>
                      <Select
                        sx={{ borderRadius: '4px !important', height: '38px', marginTop: '10px' }}
                        size="small"
                        value={watch('fillTarget')}
                        onChange={(e) => {
                          setValue('fillTarget', Number(e.target.value))
                        }}
                      >
                        <MenuItem value={1}>Total Target</MenuItem>
                        <MenuItem value={2}>Remaining Target</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography fontSize="14px" fontWeight="600">
                      {Number(watch('fillTarget')) === 1 ? 'Total Target' : 'Remaining Target'}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Button
                    onClick={() => {
                      let localRows = [...rows]
                      let oldRows = rows.filter((val: any) => !val.quota.isActive)
                      if (Number(watch('fillTarget')) === 1) {
                        localRows = fillTargets(
                          rows.filter((val: any) => val.quota.isActive),
                          watch('target'),
                        )
                      } else {
                        localRows = fillTargets(
                          rows.filter((val: any) => val.quota.isActive),
                          watch('missingTarget'),
                        )
                      }
                      let newRow = oldRows.concat(localRows)
                      setRows(JSON.parse(JSON.stringify(newRow)))
                    }}
                    color="primary"
                    size="small"
                    variant="contained"
                    sx={{ marginTop: '2.15rem', display: isEdit.edit || addData ? '' : 'none' }}
                  >
                    Fill Targets
                  </Button>
                </Grid>
              </Grid>
              {rows.length > 0 ? (
                <Stack spacing={1}>
                  <Stack spacing={1} direction="row" alignItems="center">
                    <img src={QuotaListIcon} />
                    <Typography fontWeight="600" fontSize="18px" color="primary">
                      Quota List
                    </Typography>
                  </Stack>

                  <NestedQuotaTable
                    rows={rows}
                    columns={columns}
                    setRows={setRows}
                    addData={addData}
                    isEdit={isEdit}
                    QuotaActiveDeactive={QuotaActiveDeactive}
                  />
                </Stack>
              ) : (
                <Box fontSize="15px" fontWeight="500" display="flex" alignItems="center" justifyContent="center" mt={5}>
                  There are no quotas yet, please select qualifications & options to create quotas !
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DetailsBox>
    </form>
  )
}

export default NestedQuotaContainer
