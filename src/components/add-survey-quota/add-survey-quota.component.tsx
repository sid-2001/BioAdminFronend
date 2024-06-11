import {
  // StyledContainer,
  StyledQualifications,
} from "./survey-quota.style"
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
} from "@mui/material"
import TextField from "../text-field"
import { useOutletContext, useParams } from "react-router"
import { useForm } from "react-hook-form"
import { ArrowDown, ArrowUp, Delete, Search } from "@/assets/images"
import { useEffect, useState } from "react"
import { CheckBoxData, Options, QuotaAddProps } from "./survey-quota.type"
import { QuotaService } from "@/services/quotas.service"
import { logger } from "@/helpers/logger"
import { useSnackbar } from "notistack"
import { theme } from "@/constants/theme"
import QuotaConditonAddTable from "../quota-condition-add-table"
import LoadingSpinner from "../loader"

interface formData {
  quota_name: string
  quota_value: number | null
  selectedOptions: string[]
  client_quota_value: number | null
  client_quota_id: string | null
}

function AddSurveyQuotaComponent(props: QuotaAddProps) {
  let { setNewQuota, options, setSearchText, getSurveyQuotas } = props
  const { survey } = useOutletContext<any>()
  const [openQual, setOpenQual] = useState(true)
  const [open, setOpen] = useState(false)
  const [questionData, setQuestionData] = useState<CheckBoxData[]>([])
  const [createQuestion, setCreateQuestion] = useState(false)
  const [errorId, setErrorId] = useState<number[]>([])
  const [questionOpen, setQuestionOpen] = useState<Number[]>([])
  const [quotaConditionError, setQuotaConditionError] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [questionSelect, setQuestionSelect] = useState(false)
  const { surveyId } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const {
    watch,
    setValue,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      quota_name: "",
      quota_value: null,
      selectedOptions: [],
      client_quota_value: 0,
      client_quota_id: "",
    },
  })

  let selectedOptions = watch("selectedOptions")
  const quotaService = new QuotaService()

  const Submit = async (data: any) => {
    if (errorId.length <= 0) {
      setIsLoading(true)
      let payload: any = {
        name: data.quota_name,
        sample_size: Number(data.quota_value),
        quota_conditions: questionData.map((question) => {
          return {
            question_id: question.qualification_id,
            answer_details: question.checkboxes
              .filter((ans) =>
                question.selectedAns.includes(String(ans.option_id)),
              )
              .map((ans) => {
                return {
                  sample_size: ans.quota,
                  answer_id: ans.option_id,
                  answer_text: ans.option,
                }
              }),
          }
        }),
      }
      try {
        await quotaService.post_survey_quota(String(surveyId), payload)
        setQuestionData([])
        setErrorId([])
        setQuestionOpen([])
        setOpenQual(false)
        getSurveyQuotas()
        resetForm()
        setNewQuota(false)
        enqueueSnackbar("Successfully saved quota!", { variant: "success" })
        setIsLoading(false)
      } catch (e) {
        logger.error(e)
        if ((e as any)?.response?.status === 403) {
          enqueueSnackbar("Access denied: Insufficient permissions.", {
            variant: "error",
          })
        } else {
          enqueueSnackbar("An error occurred. Please try again.", {
            variant: "error",
          })
        }
        setIsLoading(false)
      }
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

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }

  useEffect(() => {
    if (selectedOptions.length > 0) {
      let questionIds = selectedOptions.map((val) => Number(val))
      setQuestionOpen([...questionOpen, ...questionIds])
      let optionData: any[] = options
        .filter((value: Options) => {
          if (selectedOptions.includes(value.id)) {
            return true
          }
        })
        .map((value: Options) => {
          return {
            qualification_type_id: value.question_type_id,
            qualification_id: Number(value.id),
            heading: value ? value.question_name : "",
            question_data_code: value.question_code,
            checkboxes: value
              ? value.answers.map((answer) => ({
                  option_id: String(answer.id),
                  option_code: String(answer.pre_code),
                  option: answer.answer_text,
                  quota: 0,
                  complete: 0,
                  remaining: 0,
                }))
              : [],
            selectedAns: [],
          }
        })
      setQuestionData([...questionData, ...optionData])
      setValue("selectedOptions", [])
      setCreateQuestion(false)
      setQuestionSelect(false)
    }
  }, [createQuestion])

  useEffect(() => {
    let payload: number[] = []
    let errorCheck: number[] = []
    questionData.map((val) => {
      let sum = 0
      val.checkboxes
        .filter((ans) => {
          if (val.selectedAns.includes(ans.option_id)) {
            return true
          }
        })
        .map((ans) => {
          sum = sum + ans.quota
        })
      if (Number(watch("quota_value")) !== sum) {
        if (!payload.includes(Number(val.qualification_id))) {
          payload.push(Number(val.qualification_id))
        }
      } else {
        if (payload.includes(Number(val.qualification_id))) {
          let check = payload.filter(
            (value) => value !== Number(val.qualification_id),
          )
          payload = check
        }
      }
      if (val.selectedAns.length <= 0) {
        if (!errorCheck.includes(Number(val.qualification_id))) {
          errorCheck.push(Number(val.qualification_id))
        }
      } else {
        if (errorCheck.includes(Number(val.qualification_id))) {
          let check: any = errorCheck.filter(
            (value) => value !== Number(val.qualification_id),
          )
          errorCheck = check
        }
      }
    })
    setErrorId(errorCheck)
    setQuotaConditionError(payload)
  }, [questionData, watch("quota_value")])

  const resetForm = () => {
    reset({
      quota_name: "",
      quota_value: null,
      selectedOptions: [],
      client_quota_id: "",
    })
  }

  return (
    <Dialog open={true} maxWidth='xl' fullWidth>
      <DialogTitle
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: "white",
        }}
      >
        Add Quota
      </DialogTitle>
      {isLoading ? <LoadingSpinner /> : ""}

      <form onSubmit={handleSubmit(Submit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
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
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                autoSelectOnFocus={true}
                type='number'
                fullWidth
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
                  min: survey?.sample_size,
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
                  Quota value should be eaual to or greater than &nbsp;
                  {survey?.sample_size}
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
            </Grid>

            <Grid item xs={12}>
              <Box
                style={{
                  borderRadius: "0.5rem",
                  border: "1px solid #DFE3E8",
                  padding: "1.5rem",
                  margin: "1rem 0 2rem 0",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <StyledQualifications style={{ fontWeight: 900 }}>
                    Qualifications
                  </StyledQualifications>
                  <span>
                    <img
                      src={ArrowDown}
                      height={16}
                      width={16}
                      onClick={() => setOpenQual(false)}
                      style={{
                        display: openQual ? "block" : "none",
                        cursor: "pointer",
                      }}
                    />
                    <img
                      src={ArrowUp}
                      height={16}
                      width={16}
                      onClick={() => setOpenQual(true)}
                      style={{
                        display: openQual ? "none" : "block",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </Box>

                <Box
                  style={{
                    display: openQual ? "block" : "none",
                    marginTop: "2rem",
                  }}
                >
                  {questionData.map((group: any, groupIndex: number) => (
                    <div
                      key={`group-${groupIndex}`}
                      style={{
                        marginBottom: "1rem",
                        border: "1px solid #ddd",
                        padding: "1rem",
                        borderRadius: "5px",
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
                              group && group?.heading ? group.heading : "",
                          }}
                        ></Box>
                        <Stack direction='row' spacing={2} alignItems='center'>
                          <IconButton
                            onClick={() => {
                              let payload: CheckBoxData[] = questionData.filter(
                                (val) =>
                                  val.qualification_id !==
                                  group.qualification_id,
                              )
                              setQuestionData(payload)
                              let check = errorId.filter(
                                (val) => val !== group.qualification_id,
                              )
                              setErrorId(check)
                            }}
                          >
                            <img
                              src={Delete}
                              alt='delete'
                              width={13}
                              height={13}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              if (
                                questionOpen.includes(group.qualification_id)
                              ) {
                                let payload = questionOpen.filter(
                                  (val) => val !== group.qualification_id,
                                )
                                setQuestionOpen(payload)
                              } else {
                                setQuestionOpen([
                                  ...questionOpen,
                                  group.qualification_id,
                                ])
                              }
                            }}
                          >
                            <img
                              src={
                                questionOpen.includes(group.qualification_id)
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
                      <Grid
                        container
                        spacing={2}
                        display={
                          !questionOpen.includes(group.qualification_id)
                            ? "none"
                            : ""
                        }
                        sx={{ marginTop: 0 }}
                      >
                        {errorId.includes(group.qualification_id) &&
                        questionData[groupIndex].checkboxes.length !==
                          questionData[groupIndex].selectedAns.length ? (
                          <Grid
                            item
                            xs={12}
                            md={12}
                            style={{
                              color: "red",
                              paddingTop: "5px",
                              margin: "0px",
                              fontSize: "12px",
                            }}
                          >
                            Please select atleast one field
                          </Grid>
                        ) : quotaConditionError.includes(
                            group.qualification_id,
                          ) ? (
                          <Grid
                            item
                            xs={12}
                            md={12}
                            style={{
                              color: "red",
                              paddingTop: "5px",
                              margin: "0px",
                              fontSize: "12px",
                            }}
                          >
                            The total quota value should be equal to be sample
                            size
                          </Grid>
                        ) : (
                          ""
                        )}

                        <Grid item xs={12} md={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                color='primary'
                                size='small'
                                checked={
                                  questionData[groupIndex].checkboxes.length ===
                                  questionData[groupIndex].selectedAns.length
                                }
                                onChange={(e: any) => {
                                  //@ts-ignore
                                  let payload: CheckBoxData[] = [
                                    ...questionData,
                                  ]
                                  if (!e.target.checked) {
                                    payload[groupIndex].selectedAns = []
                                  } else {
                                    payload[groupIndex].selectedAns =
                                      questionData[groupIndex].checkboxes.map(
                                        (val) => val.option_id,
                                      )
                                  }
                                  console.log(questionData)
                                  setQuestionData(payload)
                                }}
                              />
                            }
                            label={
                              <div style={{ fontSize: "12px" }}>Select All</div>
                            }
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <QuotaConditonAddTable
                            data={
                              group && group.checkboxes ? group.checkboxes : []
                            }
                            setCheckboxes={setQuestionData}
                            checkboxes={questionData}
                            groupIndex={groupIndex}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </Box>

                {questionSelect && (
                  <Box
                    style={{
                      display: openQual ? "block" : "none",
                      marginTop: "2rem",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ fontSize: "12px", width: "100%" }}
                    >
                      <InputLabel style={{ color: "#919EAB" }}>
                        Qualifications
                      </InputLabel>
                      <Select
                        open={open}
                        onOpen={() => setOpen(true)}
                        multiple
                        sx={{
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                        value={selectedOptions}
                        label='Qualifications'
                        {...register("selectedOptions", {
                          required: false,
                        })}
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
                          <TextField
                            variant='standard'
                            autoFocus
                            placeholder='Search in questions library'
                            fullWidth
                            style={{ padding: "2rem 1rem 0.5rem 0rem" }}
                            InputProps={{
                              endAdornment: <img src={Search} />,
                            }}
                            InputLabelProps={{
                              //@ts-ignore
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
                        <ListSubheader
                        sx={{
                          fontWeight: "bold",
                          color: "#8E27D7",
                          background: "var(--grey-300, #DFE3E8)",
                          marginBottom: "0.5rem",
                          borderRadius: "0.5rem",
                          position: "sticky",
                          top: "70px",
                          display: options.some(option => option.qualification_category_id === 1 || option.qualification_category_id === 2) ? "block" : "none",
                        }}
                      >
                        Standard
                      </ListSubheader>
                      {options
                        ?.filter(option => {
                          // let data = quotaList
                          //   .filter((value) => value.is_active)
                          //   .map((value) => {
                          //     return value.quota_conditions[0];
                          //   });
                          // let found = questionData.find(
                          //   (value: any) =>
                          //     Number(option.id) ===
                          //     Number(value.qualification_id),
                          // )
                          // if (!found) {
                          //   return true
                          // }
                          if (option.qualification_category_id === 1 || option.qualification_category_id === 2) {
                            let found = questionData.find((value: any) => Number(option.id) === Number(value.qualification_id));
                            return !found; // Return true if option.id is not found in questionData
                          } else {
                            return false; // Exclude options with qualification_category_id other than 1 or 2
                          }
                        })
                        .map((option, i) => (
                          <MenuItem
                            key={i}
                            color="primary"
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
                            <Checkbox color="primary" checked={selectedOptions.includes(option.id)} size="small" />
                            {truncateText(option?.question_name, 50)}
                          </MenuItem>
                        ))}
                      <ListSubheader
                        sx={{
                          fontWeight: "bold",
                          color: "#8E27D7",
                          background: "var(--grey-300, #DFE3E8)",
                          marginBottom: "0.5rem",
                          borderRadius: "0.5rem",
                          position: "sticky",
                          top: "70px",
                          display: options.some(option => option.qualification_category_id === 3) ? "block" : "none",
                        }}
                      >
                        Custom
                      </ListSubheader>
                      {options
                        ?.filter(option => {
                          // let data = quotaList
                          //   .filter((value) => value.is_active)
                          //   .map((value) => {
                          //     return value.quota_conditions[0];
                          //   });
                          if (option.qualification_category_id === 3) {
                            let found = questionData.find((value: any) => Number(option.id) === Number(value.qualification_id));
                            return !found; // Return true if option.id is not found in questionData
                          } else {
                            return false; // Exclude options with qualification_category_id other than 3
                          }
                        })
                        .map((option, i) => (
                          <MenuItem
                            key={i}
                            color="primary"
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
                            <Checkbox color="primary" checked={selectedOptions.includes(option.id)} size="small" />
                            {truncateText(option?.question_name, 50)}
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
                              setOpen(false)
                              setSearchText("")
                              setValue("selectedOptions", [])
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant='contained'
                            size='small'
                            disabled={
                              selectedOptions.length <= 0 ? true : false
                            }
                            onClick={() => {
                              setCreateQuestion(true)
                              setOpen(false)
                            }}
                          >
                            Done
                          </Button>
                        </ListSubheader>
                      </Select>
                    </FormControl>
                  </Box>
                )}
                <Box
                  style={{
                    marginTop: "1rem",
                    display: openQual ? "block" : "none",
                  }}
                >
                  <Button
                    variant='text'
                    color='primary'
                    disabled={
                      questionSelect
                        ? true
                        : options.length === questionData.length
                          ? true
                          : false
                    }
                    onClick={() => {
                      setQuestionSelect(true)
                    }}
                  >
                    + Profile Qualifications
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 1,
            background: "white",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginBottom: "0.8rem",
              marginRight: "0.8rem",
            }}
          >
            <Button
              variant='outlined'
              onClick={() => {
                setCreateQuestion(false)
                setErrorId([])
                setQuestionOpen([])
                setOpenQual(false)
                setNewQuota(false)
                getSurveyQuotas()
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              type='submit'
              disabled={
                isLoading ||
                !watch("quota_name") ||
                !watch("quota_value") ||
                questionData.length <= 0 ||
                quotaConditionError.length > 0 ||
                errorId.length > 0
                  ? true
                  : false
              }
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddSurveyQuotaComponent
