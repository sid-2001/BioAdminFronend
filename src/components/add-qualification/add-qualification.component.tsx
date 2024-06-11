import { useEffect, useState } from 'react'
// import Select from "@/components/select"
import {
  FormControl,
  InputLabel,
  ListSubheader,
  Select as FormSelect,
  Button,
  Checkbox,
  MenuItem,
  Box,
  Grid,
  FormControlLabel,
  IconButton,
  Stack,
  ListItemIcon,
  ListItemText,
  // Switch,
  Collapse,
  // List,
} from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { theme } from '@/constants/theme'
import { AddQualificationComponentProps, OptionsType, QualificationType } from './add-qualification.type'
import TextFieldNew from '../text-field-new/text-field-new.component'
import TextField from '../text-field'
import { Delete } from '@mui/icons-material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import AddBtn from "../add-btn"
// import AddCustomQualificationComponent from '../add-custom-qualification'
import { QualificationService } from '@/services/qualification.service'
import { logger } from '@/helpers/logger'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import LoadingSpinner from '../loader'
// import AddCustomQualificationComponent from '../add-custom-qualification'
import QuestionTypeIcon from '@/constants/questionTypeIcon'

// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Rangeques } from '@/assets/images'

// qualificationsData
// const AddQualificationComponent = ({ getQualificationsData }: AddQualificationComponentProps) => {

const AddQualificationComponent = ({ getQualificationsData, qualificationsData }: AddQualificationComponentProps) => {
  // const [questionType, setQuestionType] = useState<number>(1)
  const [searchText, setSearchText] = useState('')
  const [options, setOptions] = useState<OptionsType[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [qualifications, setQualifications] = useState<QualificationType[]>([])
  const [error, setError] = useState(false)
  const [cellOpen, setCellOpen] = useState(true)
  // const [customOpen, setCustomOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { surveyId } = useParams()

  const qualificationServices = new QualificationService()
  const { enqueueSnackbar } = useSnackbar()

  const MenuProps = {
    autoFocus: false,
    sx: {
      '&& .Mui-selected': {
        backgroundColor: 'var(--grey-300, #DFE3E8)',
        color: theme.palette.primary.main,
        fontWeight: '700',
      },
    },
    PaperProps: {
      style: {
        maxHeight: '500px',
        minWidth: '500px',
        borderRadius: '8px',
        background: '#FFF',
        boxShadow: '0px 8px 24px -4px rgba(199, 203, 206, 0.25), 0px 0px 2px 0px rgba(145, 158, 171, 0.25)',
      },
    },
  }

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }

  const getQualifications = async () => {
    try {
      const data = await qualificationServices.get_qualifications(searchText, Number(surveyId))
      setOptions(data)
    } catch (e) {
      console.log(e)
    }
  }

  const getAnswers = async (id: string, category_id: number) => {
    try {
      const data: any = await qualificationServices.get_answers(String(id), category_id, Number(surveyId))
      return data.question
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getQualifications()
  }, [searchText])

  const CreateQuestionData = async () => {
    if (selectedOptions.length > 0) {
      const qualificationData: any[] = await Promise.all(
        options
          .filter((value: OptionsType) => selectedOptions.includes(String(value.id)))
          .map(async (value: OptionsType) => {
            const payload: any = {
              id: value.id,
              name: value.name,
              qualificationTypeId: value.type_id,
              questionText: value.name,
              qualificationCategoryId: value.category_id,
            }
            const answersData = await getAnswers(String(value.id), Number(value.category_id))

            payload.questionText = answersData.text
            if (value.type_id === 1 || value.type_id === 2) {
              payload.answers = answersData.answers.map((ans: any) => {
                return {
                  id: ans.id,
                  label: ans.answer_text,
                }
              })
              payload.selectedAnswers = []
            } else if (value.type_id === 3) {
              payload.text = 'Text'
            } else if (value.type_id === 4) {
              payload.selectedRange = [
                {
                  min: '18',
                  max: '99',
                },
              ]
            }
            return payload
          }),
      )
      setQualifications(qualificationData)
      setCellOpen(true)
    }
  }

  useEffect(() => {
    CreateQuestionData()
  }, [selectedOptions])

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

  // const handleCustomDialoge = () => {
  //   setCustomOpen(false)
  // }

  const save = async () => {
    setIsLoading(true)
    const payload: any = {
      qualification_type_id: qualifications[0].qualificationTypeId,
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
      await qualificationServices.post_qualification(String(surveyId), payload)
      getQualificationsData()
      enqueueSnackbar('Qualification complete sucessfully', {
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
    setSelectedOptions([])
    setError(false)
    setCellOpen(false)
  }

  // const groupOptionsByCategory = () => {
  //   const groupedOptionsArr = {
  //     Group1And2: [],
  //     Group3: [],
  //   };

  //   options.forEach(option => {
  //     if (option.category_id === 1 || option.category_id === 2) {
  //       groupedOptionsArr.Group1And2.push(option);
  //     } else if (option.category_id === 3) {
  //       groupedOptionsArr.Group3.push(option);
  //     }
  //   });

  //   return groupedOptionsArr;
  // };

  // const groupedOptions = groupOptionsByCategory();

  // console.log(selectedOptions, groupedOptions, "groupedOptionsgroupedOptions");

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setCellOpen(!cellOpen)}>
            {cellOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="left">
          <InputLabel sx={{ fontSize: '13px', color: 'black', marginBottom: '0.2rem' }}>Question*</InputLabel>
          <FormControl
            fullWidth
            sx={{
              fontSize: '12px',
              width: 'calc(100vw - 600px)',
            }}
            size="small"
          // disabled={questionType === 2}
          >
            <FormSelect
              sx={{
                boxSizing: 'border-box',
                borderRadius: '4px',
                padding: '0px',
              }}
              value={selectedOptions}
              onChange={(e) => {
                //@ts-ignore
                setSelectedOptions([String(e.target.value)])
              }}
              label=""
              MenuProps={{
                ...MenuProps,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              renderValue={(selected) => (
                <div
                  dangerouslySetInnerHTML={{
                    __html: selected
                      ?.map((value) => {
                        return truncateText(options.find((item: any) => Number(item.id) === Number(value))?.name || '', 100)
                      })
                      .join(', '),
                  }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                ></div>
              )}
            >
              <ListSubheader>
                <TextField
                  variant="standard"
                  autoFocus
                  placeholder="Search"
                  fullWidth
                  value={searchText}
                  style={{ padding: '2rem 1rem 0.5rem 0rem' }}
                  InputLabelProps={{
                    //@ts-ignore
                    sx: {
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      lineHeight: '140%',
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#C4CDD5',
                      },
                      '& input': {
                        padding: '1rem !important',
                      },
                    },
                    '& .MuiInput-underline:after': {
                      borderBottom: '1px solid #C4CDD5',
                    },
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e: any) => {
                    if (e.key !== 'Escape') {
                      e.stopPropagation()
                    }
                  }}
                />
              </ListSubheader>
              <ListSubheader
                sx={{
                  fontWeight: 'bold',
                  color: '#8E27D7',
                  background: 'var(--grey-300, #DFE3E8)',
                  marginBottom: '0.25rem',
                  borderRadius: '0.5rem',
                  position: 'sticky',
                  top: '70px',
                  maxWidth: "calc(100vw - 680px)",
                  display: options.some((option) => option.category_id === 1 || option.category_id === 2) ? 'block' : 'none',
                }}
              >
                Standard
              </ListSubheader>
              {options
                .filter((option) => {
                  let check = qualificationsData.find((val: any) => Number(option.id) === Number(val.qualification_id))
                  if ((option.category_id === 1 || option.category_id === 2) && !check) {
                    return true
                  } else {
                    return false
                  }
                })
                .map((option, i) => (
                  <MenuItem
                    key={i}
                    color="primary"
                    value={option.id}
                    sx={{
                      borderRadius: '8px',
                      padding: "0rem 1rem", minHeight: "0px ", marginBottom: "0.25rem",
                      '&:hover': {
                        borderRadius: '8px',
                        opacity: 0.8,
                        background: 'var(--grey-300, #DFE3E8)',
                        transition: 'background 0.3s',
                      },
                    }}
                  >

                    <ListItemIcon style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginRight: "0.5rem" }}>
                      {option?.type_id && (
                        option?.type_id == 4 ?
                          <img src={Rangeques} style={{ color: "#5f5f5f", height: "24px" }} />
                          :
                          <QuestionTypeIcon typeId={option?.type_id} />
                      )
                      }
                    </ListItemIcon>
                    <div  >
                      <ListItemText style={{ margin: "0.1rem" }}
                        primary={<span style={{
                          display: "block",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "calc(100vw - 680px)",
                        }} dangerouslySetInnerHTML={{
                          __html: option?.code,
                        }} />}
                      ></ListItemText>
                      <ListItemText style={{ margin: "0.1rem" }}
                        primary={<span style={{
                          display: "block",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "calc(100vw - 680px)",
                        }} dangerouslySetInnerHTML={{
                          __html: option?.name,
                        }} />}
                      ></ListItemText>
                    </div>

                    {/* <p
                      dangerouslySetInnerHTML={{
                        __html: truncateText(option?.name, 50),
                      }}
                    ></p> */}
                  </MenuItem>
                ))}
              <ListSubheader
                sx={{
                  fontWeight: 'bold',
                  color: '#8E27D7',
                  background: 'var(--grey-300, #DFE3E8)',
                  marginBottom: '0.25rem',
                  borderRadius: '0.5rem',
                  position: 'sticky',
                  top: '70px',
                  maxWidth: "calc(100vw - 680px)",
                  display: options.some((option) => option.category_id === 3) ? 'block' : 'none',
                }}
              >
                Custom
              </ListSubheader>
              {options
                .filter((option) => {
                  let check = qualificationsData.find((val: any) => Number(option.id) === Number(val.qualification_id))
                  if (option.category_id === 3 && !check) {
                    return true
                  } else {
                    return false
                  }
                })
                .map((option, i) => (
                  <MenuItem
                    key={i}
                    color="primary"
                    value={option.id}
                    sx={{
                      borderRadius: '8px',
                      padding: "0rem 1rem", minHeight: "0px ", marginBottom: "0.25rem",
                      '&:hover': {
                        borderRadius: '8px',
                        opacity: 0.8,
                        background: 'var(--grey-300, #DFE3E8)',
                        transition: 'background 0.3s',
                      },
                    }}
                  >
                    <ListItemIcon style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginRight: "0.5rem" }}>
                      {option?.type_id && (
                        option?.type_id == 4 ?
                          <img src={Rangeques} style={{ color: "#5f5f5f", height: "24px" }} />
                          :
                          <QuestionTypeIcon typeId={option?.type_id} />
                      )
                      }
                    </ListItemIcon>
                    <div  >
                      <ListItemText style={{ margin: "0.1rem" }}
                        primary={<span style={{
                          display: "block",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "calc(100vw - 680px)",
                        }} dangerouslySetInnerHTML={{
                          __html: option?.code,
                        }} />}
                      ></ListItemText>
                      <ListItemText style={{ margin: "0.1rem" }}
                        primary={<span style={{
                          display: "block",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "calc(100vw - 680px)",
                        }} dangerouslySetInnerHTML={{
                          __html: option?.name,
                        }} />}
                      ></ListItemText>
                    </div>
                    {/* <p
                      dangerouslySetInnerHTML={{
                        __html: truncateText(option?.name, 50),
                      }}
                    ></p> */}
                  </MenuItem>
                ))}
              {/* {options
                // .filter(option => {
                //   const checked = qualificationsData.find((value: any) => value.qualification_id === option.id);
                //   if (questionType === option?.category_id) {
                //     if (checked?.qualification_id === option.id) {
                //       return false;
                //     } else {
                //       return true;
                //     }
                //   }
                // })
                .map((option: any, i: number) => (
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
                    <p
                      dangerouslySetInnerHTML={{
                        __html: truncateText(option?.name, 50),
                      }}
                    ></p>
                  </MenuItem>
                ))} */}
            </FormSelect>
          </FormControl>
        </TableCell>
        {/* <TableCell align="left"> 
        <InputLabel sx={{ fontSize: "13px", color: "black", marginBottom: "0.2rem" }}>Type*</InputLabel>
          <Select
            size="small"
            // value={questionType?.toString() || ""}
            items={[
              { value: 1, text: "Standard" },
              { value: 2, text: "Custom" },
            ]}
            onChange={() => {
              // setQuestionType(Number(e.target.value));
              setSelectedOptions([]);
              setQualifications([]);
            }}
            name=""
            label=""
            isRequired={true}
          /> 
        </TableCell> */}
        {/* <TableCell align="center"> */}
        {/* {questionType === 1 ? (
            <Switch size="small" defaultChecked disabled />
          ) : (
            <AddBtn
              disabled={selectedOptions.length > 0 || qualifications.length > 0}
              onClick={() => {
                setCustomOpen(true);
              }}
              width="100%"
            />
          )} */}
        {/* </TableCell> */}
      </TableRow>
      {qualifications.map((value: QualificationType, i) => {
        return (
          <TableCell
            colSpan={8}
            key={value.id}
            sx={{
              display: !cellOpen ? 'none' : '',
            }}
          >
            <Collapse in={cellOpen} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  // background: "#326fa820",
                  minHeight: '150px',
                  padding: '0.5rem',
                }}
              >
                <p
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `${value.name}`,
                  }}
                ></p>

                {value.qualificationTypeId === 1 || value.qualificationTypeId === 2 ? (
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
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
                    rows={3}
                    value={value.text}
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
                            error={range.min === '' ? true :
                              Number(range.min) < 18 ? true :
                              false}
                            helperText={
                              range.min === '' ? 'This field is Required' :
                                 Number(range.min) < 18 ? 'Min can not be less then 18' :
                                ''
                            }
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
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
                            error={range.max === '' ? true : Number(range.min) > Number(range.max) ? true :
                              Number(range.max) > 100 ? true :
                              false}
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
                        <Grid item xs={2} display={qualifications[i].selectedRange?.length > 1 ? '' : 'none'}>
                          <IconButton
                            onClick={() => {
                              const payload: any = [...qualifications]
                              // payload[i].selectedRange.splice(1, index)
                              payload[i].selectedRange.splice(index, 1)
                              setQualifications(payload)
                            }}
                          >
                            <Delete style={{ color: "red" }} />
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
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => {
                      setCellOpen(false)
                      setSelectedOptions([])
                      setQualifications([])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    disabled={error}
                    onClick={() => {
                      save()
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </Box>
            </Collapse>
          </TableCell>
        )
      })}
      {/* <AddCustomQualificationComponent
        open={customOpen}
        handleClose={handleCustomDialoge}
        getQualificationsData={getQualificationsData}
        getQualifications={getQualifications}
        setSelectedOptions={setSelectedOptions}
      /> */}
    </>
  )
}

export default AddQualificationComponent
