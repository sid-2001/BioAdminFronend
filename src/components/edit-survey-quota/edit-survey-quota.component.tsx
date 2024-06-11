import { Box, Button, Checkbox, FormControlLabel, Grid } from "@mui/material"
import { useForm } from "react-hook-form"
import {
  StyledContainer,
  StyledKeys,
  StyledValues,
} from "./edit-survey-quota.style"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import Input from "@/components/text-field"
import {
  FormControl,
  Select,
  MenuItem,
  TextField as MDInput,
  InputLabel,
  ListSubheader,
  IconButton,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import Stack from "@mui/material/Stack"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import CustomCardMenu from "../card-menu"
import { ArrowDown, ArrowUp, Delete } from "@/assets/images"
import { logger } from "@/helpers/logger"
import { QuotaConditionProps } from "./edit-survey-quota.type"
import { Options } from "../add-survey-quota/survey-quota.type"
import QuotaConditonEditTable from "../quota-condition-edit-table"
import { theme } from "@/constants/theme"
import { useSnackbar } from "notistack"
import { QuotaService } from "@/services/quotas.service"
import LoadingSpinner from "../loader"

interface EditSurveyQuotaComponentProps {
  surveyData: any
  data: any
  index: number
  quotaList: any[]
  setQuotaList: React.Dispatch<React.SetStateAction<any[]>>
  getSurveyQuotas: () => Promise<void>
  options: Options[]
  searchText: string
  setSearchText: React.Dispatch<React.SetStateAction<string>>
}

interface formData {
  quota_name: string
  quota_value: string
  selectedOptions: string[]
  client_quota_value: string | null
  client_quota_id: string | null
}

const EditSurveyQuotaComponent: React.FC<EditSurveyQuotaComponentProps> = ({
  surveyData,
  data,
  index,
  quotaList,
  // setQuotaList,
  getSurveyQuotas,
  options,
  setSearchText,
}) => {
  const { surveyId } = useParams()
  const {
    watch,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      quota_name: "",
      quota_value: "",
      selectedOptions: [],
      client_quota_value: "0",
      client_quota_id: "",
    },
  })

  let selectedOptions = watch("selectedOptions")
  let quota_name = watch("quota_name")
  let quota_value = watch("quota_value")
  // let client_quota_value = watch("client_quota_value");
  // let client_quota_id = watch("client_quota_id");

  const quotaService = new QuotaService()
  const [questionOpen, setQuestionOpen] = useState<Number[]>([])
  const [errorId, setErrorId] = useState<Number[]>([])
  const [quotaOpen, setQuotaOpen] = useState<boolean>(false)
  const [quotaCondition, setQuotaCondition] =
    useState<QuotaConditionProps | null>(null)
  const [createQuestion, setCreateQuestion] = useState(false)
  const [questionSelect, setQuestionSelect] = useState(false)
  const [openQuestion, setOpenQuestion] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [quotaConditionError, setQuotaConditionError] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const Submit = async (result: any) => {
    if (errorId.length <= 0) {
      setIsLoading(true)
      let payload: any = {
        name: result.quota_name,
        sample_size: Number(result.quota_value),
        // client_quota_value: Number(result.client_quota_value),
        // client_quota_id: String(result.client_quota_id),
        quota_conditions: quotaCondition?.quota_conditions?.map((val: any) => {
          return {
            question_id: Number(val.question_id),
            // question_data_code: Number(val.question_data_code),
            answer_details: val.question_answers
              ?.filter((ans: any) =>
                val.selectedAns.includes(Number(ans.question_answer_id)),
              )
              ?.map((ans: any) => {
                return {
                  id: ans.id ? Number(ans.id) : null,
                  sample_size: ans.sample_size,
                  answer_id: ans.question_answer_id,
                  answer_text: ans?.question_answer_text
                    ? ans?.question_answer_text
                    : null,
                }
              }),
          }
        }),
      }
      try {
        await quotaService.put_quota(
          String(surveyId),
          String(quotaCondition?.id),
          payload,
        )
        setQuestionOpen([])
        setQuotaOpen(false)
        setErrorId([])
        getSurveyQuotas()
        enqueueSnackbar("Successfully saved quota!", { variant: "success" })
        setQuotaCondition(null)
        setIsLoading(false)
      } catch (error) {
        logger.error(error)
        if ((error as any)?.response?.status === 403) {
          enqueueSnackbar("Access denied: Insufficient permissions.", {
            variant: "error",
          })
        } else {
          enqueueSnackbar("There was an error processing quota.", {
            variant: "error",
          })
        }
        setIsLoading(false)
      }
    }
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  console.log(quotaCondition, "quotaCondition")

  const onDeleteClick = async (quota_id: string, isActivated: boolean) => {
    let obj = {
      is_active: isActivated,
    }
    try {
      await quotaService.active_deactive_quota_by_quota_id(
        String(surveyId),
        String(quota_id),
        obj,
      )
      getSurveyQuotas()
      if (!isActivated) {
        enqueueSnackbar("Successfully quota deactive!", { variant: "success" })
      } else {
        enqueueSnackbar("Successfully quota Activate!", { variant: "success" })
      }
    } catch (error) {
      logger.error(error)
      if ((error as any)?.response?.status == 400) {
        enqueueSnackbar(`${(error as any)?.response?.data?.message}`, {
          variant: "error",
        })
      } else if ((error as any)?.response?.status === 403) {
        enqueueSnackbar("Access denied: Insufficient permissions.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar("There was an error processing deactive quota.", {
          variant: "error",
        })
      }
    }
  }

  useEffect(() => {
    if (selectedOptions.length > 0) {
      let questionIds = selectedOptions?.map((val) => Number(val))
      setQuestionOpen([...questionOpen, ...questionIds])
      let optionData: any = []
      optionData = options
        ?.filter((value: any) => {
          if (selectedOptions?.includes(value.id)) {
            return true
          }
        })
        ?.map((value: any) => {
          return {
            question_type_id: value.question_type_id,
            question_id: value.id,
            question_data_code: Number(value.question_code),
            question_name: value.question_name,
            question_answers: value
              ? value.answers?.map((answer: any, _index: number) => {
                  return {
                    question_answer_id: answer.id,
                    question_answer_text: answer.answer_text,
                    question_answer_code: answer.pre_code,
                    sample_size: 0,
                    completed: 0,
                    remaining: 0,
                  }
                })
              : [],
            selectedAns: [],
          }
        })
      let payload: any = { ...quotaCondition }
      payload?.quota_conditions.push(...optionData)
      setQuotaCondition(payload)
      setValue("selectedOptions", [])
      setCreateQuestion(false)
      setOpenQuestion(false)
      setQuestionSelect(false)
    }
  }, [createQuestion])

  useEffect(() => {
    let pyaload: number[] = []
    let errorCheck: number[] = []
    quotaCondition?.quota_conditions?.map((val: any) => {
      if (val.selectedAns.length <= 0) {
        if (!errorCheck?.includes(Number(val?.question_id))) {
          errorCheck.push(val.question_id)
        }
      } else {
        if (errorCheck?.includes(Number(val?.question_id))) {
          let check = errorCheck.filter(
            (value) => value !== Number(val.question_id),
          )
          errorCheck = check
        }
      }

      let sum = 0
      val.question_answers
        ?.filter((ans: any) => {
          if (val.selectedAns?.includes(ans?.question_answer_id)) {
            return true
          }
        })
        .map((ans: any) => {
          sum = sum + ans.sample_size
        })
      if (Number(watch("quota_value")) !== sum) {
        if (!pyaload?.includes(Number(val?.question_id))) {
          pyaload.push(val.question_id)
        }
      } else {
        if (pyaload?.includes(Number(val?.question_id))) {
          let check = pyaload.filter(
            (value: any) => value !== Number(val?.question_id),
          )
          pyaload = check
        }
      }
    })
    setQuotaConditionError(pyaload)
    setErrorId(errorCheck)
  }, [quotaCondition, watch("quota_value")])

  useEffect(() => {
    setValue("quota_name", data?.name)
    setValue("quota_value", data?.sample_size.toString())
    // setValue("client_quota_value", String(data?.client_quota_value))
    // setValue("client_quota_id", String(data?.client_quota_id))
    // setQuotaOpen(true)
    let questionIds: any = []
    data?.quota_conditions?.map((val: any) => {
      if (val.question_id) {
        questionIds.push(Number(val.question_id))
      }
      val.question_answers?.map((value: any) => {
        let payload: any = null
        val.answer_details
          ?.filter(
            (ans: any) =>
              Number(ans.answer_id) === Number(value.question_answer_id),
          )
          ?.map((ans: any) => {
            payload = ans
          })
        if (payload === null) {
          value.completed = 0
          value.remaining = 0
          value.sample_size = 0
          return value
        } else {
          value.id = payload.id
          value.completed = payload.completed
          value.remaining = payload.remaining
          value.sample_size = payload.sample_size
          payload = null
          return value
        }
      })
      val.selectedAns = val.answer_details?.map(
        (answer: any) => answer.answer_id,
      )
      return val
    })
    setQuotaCondition(data)
    setQuestionOpen(questionIds)
  }, [data])

  const ingerNum = (e: any) => {
    const characterCode = e.key
    if (characterCode === "Backspace") return

    const characterNumber = Number(characterCode)
    if (characterNumber >= 0 && characterNumber <= 9) {
      return
    } else {
      e.preventDefault()
    }
  }

  const MenuProps = {
    autoFocus: false,
    sx: {
      "&& .Mui-selected": {
        backgroundColor: "var(--grey-300, #DFE3E8)",
        color: theme.palette.primary.main,
        fontWeight: "700",
      },
    },
    PaperProps: {
      style: {
        maxHeight: "500px",
        minWidth: "500px",
        borderRadius: "8px",
        background: "#FFF",
        boxShadow:
          "0px 8px 24px -4px rgba(199, 203, 206, 0.25), 0px 0px 2px 0px rgba(145, 158, 171, 0.25)",
      },
    },
  }

  return (
    <StyledContainer
      style={{
        marginBottom: "20px",
        opacity: !quotaCondition?.is_active ? 0.5 : 1,
      }}
      key={index}
    >
      {isLoading ? <LoadingSpinner /> : ""}
      <form onSubmit={handleSubmit(Submit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            {!quotaCondition?.edit ? (
              <>
                <StyledKeys>Quota Name*</StyledKeys>
                <StyledValues>{quota_name}</StyledValues>
              </>
            ) : (
              <>
                <Input
                  label='Quota Name*'
                  {...register("quota_name", {
                    required: "Quota name is required",
                  })}
                />
                {errors.quota_name && (
                  <p
                    style={{
                      color: "red",
                      paddingTop: "5px",
                      margin: "0px",
                      fontSize: "12px",
                    }}
                  >
                    {errors.quota_name.message}
                  </p>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            {!quotaCondition?.edit || surveyData.status_name === "LIVE" ? (
              <>
                <StyledKeys>Sample Size*</StyledKeys>
                <StyledValues>{quota_value}</StyledValues>
              </>
            ) : (
              <>
                <Input
                  type='number'
                  autoSelectOnFocus={true}
                  onKeyPress={(e: any) => {
                    ingerNum(e)
                  }}
                  inputProps={{
                    min: 0,
                  }}
                  label='Sample Size*'
                  {...register("quota_value", {
                    required: "Quota value is required",
                    // max: sampleSize,
                    min: surveyData?.sample_size,
                  })}
                />
                {errors.quota_value &&
                errors.quota_value &&
                errors.quota_value.type &&
                errors.quota_value.type === "min" ? (
                  <p
                    style={{
                      color: "red",
                      paddingTop: "5px",
                      margin: "0px",
                      fontSize: "12px",
                    }}
                  >
                    Quota value should be eaual to or greater than
                    {surveyData?.sample_size}
                  </p>
                ) : errors.quota_value ? (
                  <p
                    style={{
                      color: "red",
                      paddingTop: "5px",
                      margin: "0px",
                      fontSize: "12px",
                    }}
                  >
                    {errors.quota_value.message}
                  </p>
                ) : (
                  ""
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "50px",
                gap: "10px",
              }}
            >
              <IconButton
                disabled={!quotaCondition?.is_active}
                style={{ alignItems: "start" }}
                onClick={() => {
                  if (quotaOpen) {
                    setQuotaOpen(false)
                    setQuestionOpen([])
                  } else {
                    setQuotaOpen(true)
                    let questionId: any = quotaList[
                      index
                    ]?.quota_conditions?.map((val: any) =>
                      Number(val.question_id),
                    )
                    setQuestionOpen(questionId)
                  }
                }}
              >
                {quotaOpen ? (
                  <img src={ArrowDown} alt='' height='8px' />
                ) : (
                  <img src={ArrowUp} alt='' height='8px' />
                )}
              </IconButton>
              <>
                <IconButton
                  aria-controls='menu'
                  aria-haspopup='true'
                  disabled={!quotaCondition?.is_active ? true : false}
                  onClick={handleClick}
                  size='small'
                  style={{ alignItems: "start" }}
                >
                  <MoreVertIcon
                    fontSize='medium'
                    style={{ color: "#C4CDD5" }}
                  />
                </IconButton>
                <CustomCardMenu
                  anchorEl={anchorEl}
                  open={open}
                  setAnchorEl={setAnchorEl}
                  onClose={handleClose}
                  onDeactivate={() => {
                    if (quotaCondition?.is_active) {
                      onDeleteClick(String(quotaCondition?.id), false)
                    } else {
                      onDeleteClick(String(quotaCondition?.id), true)
                    }
                  }}
                  quotaCardMenu={true}
                  isActive={quotaCondition?.is_active ? true : false}
                  onEdit={() => {
                    setQuotaOpen(true)
                    let questionId: any = quotaList[
                      index
                    ]?.quota_conditions?.map((val: any) =>
                      Number(val.question_id),
                    )
                    setQuestionOpen(questionId)
                    let payload: any = { ...quotaCondition }
                    payload.edit = true
                    setQuotaCondition(payload)
                    setAnchorEl(null)
                  }}
                />
              </>
            </Box>
          </Grid>

          {quotaOpen && (
            <Grid item xs={12} md={12}>
              {quotaCondition?.quota_conditions?.map(
                (group: any, groupIndex: number) => (
                  <div
                    key={`group-${groupIndex}`}
                    style={{
                      border: "1px solid rgb(223, 227, 232)",
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Box
                        sx={{ fontWeight: 900, fontSize: "14px" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            group && group?.question_name
                              ? group.question_name
                              : "",
                        }}
                      ></Box>
                      <Stack direction='row' spacing={2} alignItems='center'>
                        <IconButton
                          style={{
                            cursor: !quotaCondition.edit ? "" : "pointer",
                            display:
                              surveyData.status_name === "LIVE" ||
                              !quotaCondition.edit
                                ? "none"
                                : "",
                          }}
                          onClick={() => {
                            let payload: any = { ...quotaCondition }
                            payload.quota_conditions =
                              payload?.quota_conditions?.filter(
                                (val: any) =>
                                  val.question_id !== group.question_id,
                              )
                            setQuotaCondition(payload)
                            let check = errorId.filter(
                              (val) => val !== group.question_id,
                            )
                            setErrorId(check)
                          }}
                        >
                          <img src={Delete} width={13} height={13} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (questionOpen?.includes(group?.question_id)) {
                              let payload = questionOpen.filter(
                                (val) => val !== group.question_id,
                              )
                              setQuestionOpen(payload)
                            } else {
                              setQuestionOpen([
                                ...questionOpen,
                                group.question_id,
                              ])
                            }
                          }}
                        >
                          <img
                            src={
                              questionOpen?.includes(group?.question_id)
                                ? ArrowDown
                                : ArrowUp
                            }
                            width={14}
                            height={14}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </IconButton>
                      </Stack>
                    </Stack>
                    {errorId?.includes(group?.question_id) &&
                    quotaCondition.quota_conditions[groupIndex]?.selectedAns
                      ?.length <= 0 &&
                    quotaCondition?.quota_conditions[groupIndex]
                      ?.question_answers?.length !==
                      quotaCondition.quota_conditions[groupIndex]?.selectedAns
                        .length ? (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        display={
                          !questionOpen?.includes(group?.question_id)
                            ? "none"
                            : ""
                        }
                        style={{
                          color: "red",
                          paddingTop: "5px",
                          margin: "0px",
                          fontSize: "12px",
                        }}
                      >
                        Please select atleast one field
                      </Grid>
                    ) : quotaConditionError?.includes(group?.question_id) ? (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        display={
                          !questionOpen?.includes(group?.question_id)
                            ? "none"
                            : ""
                        }
                        style={{
                          color: "red",
                          paddingTop: "5px",
                          margin: "0px",
                          fontSize: "12px",
                        }}
                      >
                        The total quota value should be equal to be sample size
                      </Grid>
                    ) : (
                      ""
                    )}
                    <FormControlLabel
                      sx={{
                        display:
                          surveyData.status_name === "LIVE" ||
                          !quotaCondition.edit ||
                          !questionOpen?.includes(group?.question_id)
                            ? "none"
                            : "",
                      }}
                      control={
                        <Checkbox
                          color='primary'
                          size='small'
                          checked={
                            quotaCondition?.quota_conditions[groupIndex]
                              .question_answers?.length ===
                            quotaCondition?.quota_conditions[groupIndex]
                              .selectedAns?.length
                          }
                          onChange={(e: any) => {
                            //@ts-ignore
                            let payload: any = { ...quotaCondition }
                            if (!e.target.checked) {
                              payload.quota_conditions[groupIndex].selectedAns =
                                []
                            } else {
                              payload.quota_conditions[groupIndex].selectedAns =
                                quotaCondition.quota_conditions[
                                  groupIndex
                                ].question_answers?.map((val: any) => {
                                  return Number(val.question_answer_id)
                                })
                            }
                            setQuotaCondition(payload)
                          }}
                        />
                      }
                      label={<div style={{ fontSize: "12px" }}>Select All</div>}
                    />

                    <Grid
                      container
                      spacing={2}
                      display={
                        !questionOpen?.includes(group?.question_id)
                          ? "none"
                          : ""
                      }
                      sx={{ marginTop: 0 }}
                    >
                      <Grid item xs={12} md={12}>
                        <QuotaConditonEditTable
                          data={group}
                          quotaCondition={quotaCondition}
                          setQuotaCondition={setQuotaCondition}
                          groupIndex={groupIndex}
                          surveyData={surveyData}
                        />
                      </Grid>
                    </Grid>
                  </div>
                ),
              )}
            </Grid>
          )}
          {quotaCondition?.edit && questionSelect && (
            <Grid item xs={12} md={12}>
              <FormControl sx={{ fontSize: "12px" }} fullWidth>
                <InputLabel style={{ color: "#919EAB" }}>
                  Qualifications
                </InputLabel>
                <Select
                  open={openQuestion}
                  onOpen={() => setOpenQuestion(true)}
                  multiple
                  value={selectedOptions}
                  label='Qualifications'
                  {...register("selectedOptions", {
                    required: false,
                  })}
                  sx={{
                    width: "calc(100vw - 250px)",
                    "& .MuiMenu-paper": {
                      width: "500px !important",
                    },
                    boxShadow: "none",
                    ".MuiOutlinedInput-notchedOutline": {
                      border: "1px solid var(--grey-300, #DFE3E8)",
                    },
                    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid var(--grey-300, #DFE3E8)",
                      },
                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid var(--grey-300, #DFE3E8)",
                      },
                  }}
                  MenuProps={{
                    ...MenuProps,
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  }}
                  renderValue={(selected) => (
                    <div>
                      {selected
                        ?.map(
                          (value) =>
                            options.find(
                              (item) => Number(item.id) === Number(value),
                            )?.question_name,
                        )
                        .join(", ")}
                    </div>
                  )}
                >
                  <ListSubheader>
                    <MDInput
                      variant='standard'
                      autoFocus
                      placeholder='Search in questions library'
                      fullWidth
                      style={{ padding: "2rem 1rem 0.5rem 0rem" }}
                      InputProps={{
                        endAdornment: <SearchIcon />,
                      }}
                      InputLabelProps={{
                        sx: {
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: "400",
                          lineHeight: "140%",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "transparent",
                          },
                          "&:hover fieldset": {
                            borderColor: "transparent",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#C4CDD5",
                          },
                          "& input": {
                            padding: "1rem !important",
                          },
                        },
                        "& .MuiInput-underline:after": {
                          borderBottom: "1px solid #C4CDD5",
                        },
                      }}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key !== "Escape") {
                          e.stopPropagation()
                        }
                      }}
                    />
                  </ListSubheader>
                  {options
                    ?.filter((val) => {
                      let found = quotaCondition.quota_conditions.find(
                        (value: any) => val.id === value.question_id,
                      )
                      if (!found) {
                        return true
                      }
                    })
                    .map((option, i) => (
                      <MenuItem
                        key={i}
                        value={option.id}
                        sx={{
                          borderRadius: "8px",
                          height: "40px",
                          "&:hover": {
                            borderRadius: "8px",
                            opacity: 0.8,
                            background: "var(--grey-300, #DFE3E8)",
                            transition: "background 0.3s",
                          },
                        }}
                      >
                        <Checkbox
                          color='primary'
                          checked={selectedOptions?.includes(option?.id)}
                          size='small'
                        />
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              option && option?.question_name
                                ? option.question_name
                                : "",
                          }}
                        ></span>
                      </MenuItem>
                    ))}

                  <ListSubheader
                    style={{
                      position: "sticky",
                      bottom: 0,
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: "8px",
                      gap: "1rem",
                      backgroundColor: "#FFF",
                    }}
                  >
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={() => {
                        setOpenQuestion(false)
                        setValue("selectedOptions", [])
                        setSearchText("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      size='small'
                      disabled={selectedOptions.length <= 0 ? true : false}
                      onClick={() => {
                        setCreateQuestion(true)
                      }}
                    >
                      Done
                    </Button>
                  </ListSubheader>
                </Select>
              </FormControl>
            </Grid>
          )}
          {quotaCondition?.edit &&
            quotaOpen &&
            surveyData.status_name !== "LIVE" && (
              <Grid item xs={12} md={12}>
                <Button
                  disabled={
                    questionSelect
                      ? true
                      : options?.every((val: any) => {
                            let found = quotaCondition?.quota_conditions.find(
                              (value: any) => val.id === value.question_id,
                            )
                            return found
                          })
                        ? true
                        : false
                  }
                  variant='text'
                  color='primary'
                  onClick={() => {
                    setQuestionSelect(true)
                  }}
                >
                  + Profile Qualifications
                </Button>
              </Grid>
            )}
          {quotaCondition?.edit && quotaOpen && (
            <Grid
              item
              xs={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <Button
                variant='outlined'
                onClick={() => {
                  let payload = { ...quotaCondition }
                  payload.edit = false
                  setQuotaCondition(payload)
                  getSurveyQuotas()
                  setQuotaOpen(false)
                  setQuestionOpen([])
                  setQuestionSelect(false)
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                type='submit'
                disabled={
                  isLoading ||
                  errorId.length > 0 ||
                  quotaConditionError.length > 0 ||
                  quotaCondition?.quota_conditions.length <= 0
                }
              >
                Save
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </StyledContainer>
  )
}

export default EditSurveyQuotaComponent
