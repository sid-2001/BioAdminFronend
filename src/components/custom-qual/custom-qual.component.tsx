import { Autocomplete, Button, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// import { CustomQualComponentTypes } from './custom-qual.type'
import { useCallback, useEffect, useState } from 'react'
import { ConfigQuestionType } from '@/types/project-data.type'
import { Box } from '@mui/system'
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import QuestionTypeIcon from '@/constants/questionTypeIcon'
import { QuestionNameInput } from '@/constants/cutom-question-name-input'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useParams } from 'react-router'
import { ProjectDataService } from '@/services/project-data.services'
import { logger } from '@/helpers/logger'
import { enqueueSnackbar } from 'notistack'
import { theme } from '@/constants/theme'


// interface CustomListTypes {
//   value: string,
//   // value: item.question_id,
//   text: string,
//   label: string,
//   question_text: string,
//   question_type_id: number,
// }


interface CustomListTypes extends Pick<ConfigQuestionType, 'question_id' | 'question_text' | 'question_type_id' | 'question_type_name'> {
  value: string;
  text: string;
  label: string;
}

interface AnswerType {
  answer_code: string;
  answer_label: string;
}


const CustomQualComponent = ({ handleClose, questionList, GetChartsQuestionsById, setLoading }: { handleClose: () => void, questionList: ConfigQuestionType[], GetChartsQuestionsById: () => Promise<void>, setLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { projectId, surveyId } = useParams()

  const projectDataService = new ProjectDataService()
  // const [customQuestions, setCustomQuestions] = useState<ConfigQuestionType[]>([])

  const [customQuestionsList, setCustomQuestionsList] = useState<CustomListTypes[]>([])

  const [selectedQuestion, setSelectedQuestion] = useState<ConfigQuestionType | null>(null);

  const [questionCode, setQuestionCode] = useState<string | null>(null);
  const [questionTitle, setQuestionTitle] = useState<string | null>(null);

  const [answerCode, setAnswerCode] = useState('1');
  const [answerText, setAnswerText] = useState('');

  const [customAnswers, setCustomAnswers] = useState<AnswerType[]>([])

  // range

  const [rangeAnswerCode, setRangeAnswerCode] = useState('1');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [binRanges, setBinRanges] = useState<AnswerType[]>([]);
  const [error, setError] = useState('');

  const handleDeleteRange = (indexToDelete: number) => {
    // setBinRanges((currentRanges: any[]) => currentRanges.filter((_, index) => index !== indexToDelete));
    setBinRanges(binRanges.filter((_, index) => index !== indexToDelete));

  };

  const handleAddRange = () => {
    setError('');
    if (validateRange(minValue, maxValue, binRanges)) {
      const newRange = `${minValue}-${maxValue}`;
      const newAnswer = { answer_code: rangeAnswerCode, answer_label: newRange }
      // setBinRanges((oldRanges: any) => [...oldRanges, newRange]);
      setBinRanges((oldRanges: any) => [...oldRanges, newAnswer]);
      setRangeAnswerCode(String(binRanges?.length + 2))
      setMinValue('');
      setMaxValue('');
    }
  };

  // const handleRangeChange = (index, field, value) => {
  //   setBinRanges(currentRanges =>
  //     currentRanges.map((range, idx) => {
  //       if (idx === index) {
  //         return { ...range, [field]: value };
  //       }
  //       return range;
  //     })
  //   );
  // };

  const handleRangeChange = (index: number, field: string, value: string) => {
    setBinRanges(currentRanges =>
      currentRanges.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };


  const validateRange = (start: string, end: string, existingRanges: any) => {
    console.log(existingRanges, "existingRangesexistingRanges")
    const startNum = Number(start);
    const endNum = Number(end);

    const defaultMin = Number(selectedQuestion?.min_value)
    const defaultMax = Number(selectedQuestion?.max_value)

    // Validation for non-numeric values
    if (isNaN(startNum) || isNaN(endNum)) {
      setError("Range must be numeric.");
      return false;
    }

    // Validation for equal values
    if (startNum == endNum) {
      setError("Start of the range must be different than the end of the range .");
      return false;
    }

    // Validation for start > end
    if (startNum > endNum) {
      setError("Start of the range must be less than the end of the range.");
      return false;
    }

    // Validation for specified range limits
    if (startNum < defaultMin || endNum > defaultMax) {
      setError(`Range must be within ${defaultMin} and ${defaultMax}.`);
      return false;
    }

    // Check for overlapping or identical ranges
    const rangeRegex = /(-?\d+)-(-?\d+)/;
    for (const range of existingRanges) {
      const match = rangeRegex.exec(range?.answer_label);
      if (match) {
        const existingStart = parseInt(match[1], 10);
        const existingEnd = parseInt(match[2], 10);

        if ((startNum <= existingEnd && endNum >= existingStart) || (startNum === existingStart && endNum === existingEnd)) {
          setError("Ranges cannot overlap or repeat.");
          return false;
        }
      }
    }

    return true; // Passed all validations
  };

  console.log(binRanges, "binRangesbinRanges")


  const ResetRanges = () => {
    setSelectedQuestion(null)
    setError('')
    setMinValue('')
    setMaxValue('')
    setBinRanges([])
    setRangeAnswerCode('1')
  }

  const ResetStates = () => {
    setSelectedQuestion(null)
    setAnswerText('')
    setAnswerCode('1')
    setCustomAnswers([])
    // // range
    // setError('')
    // setMinValue('')
    // setMaxValue('')
    // setBinRanges([])
    // setRangeAnswerCode('1')
  }

  // const handleDeleteRange = (indexToDelete: number) => {
  //   setCustomAnswers(currentRanges => currentRanges.filter((_, index) => index !== indexToDelete));
  // };

  // const handleAddAnswer = () => {
  //   if (inputAns) {
  //     setCustomAnswers(currentAnswers => [...currentAnswers, inputAns]);
  //     setAnswerText('');
  //   }
  // };

  const handleDeleteAnswer = useCallback((index: number) => {
    setCustomAnswers(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddAnswer = useCallback(() => {
    if (answerCode && answerText) {
      const newAnswer = { answer_code: answerCode, answer_label: answerText };
      setCustomAnswers(prev => [...prev, newAnswer]);
      setAnswerCode(String(customAnswers?.length + 2));
      setAnswerText('');
    }
  }, [answerCode, answerText]);

  const handleAnswersChange = (index: number, field: string, value: string) => {
    setCustomAnswers(currentAnswers =>
      currentAnswers.map((range, idx) => {
        if (idx === index) {
          return { ...range, [field]: value };
        }
        return range;
      })
    );
  };


  interface Props {
    projectId: string;
    customAnswers: any[];
    selectedQuestion: ConfigQuestionType | null;
  }

  const handleDone = useCallback(async ({ projectId, customAnswers, selectedQuestion }: Props) => {
    if (!selectedQuestion) {
      return;
    }
    setLoading(true)
    const payload = (selectedQuestion?.question_type_id == 3 ? customAnswers : binRanges).map((item, index) => ({
      project_id: Number(projectId),
      question_id: `${selectedQuestion.question_id}_${questionCode}`,
      question_variable_id: `${selectedQuestion.question_id}_${questionCode}`,
      sp_question_type_id: selectedQuestion?.question_type_id == 3 ? 'multi' : "single",
      answer_code: item?.answer_code,
      question_label: `${selectedQuestion.question_id}_${questionCode}`,
      question_type_id: selectedQuestion?.question_type_id == 3 ? 2 : 1,
      question_variable_type: 'Calculated',
      question_type_name: selectedQuestion?.question_type_id == 3 ? 'multi' : "single",
      question_precode: '',
      level_id: selectedQuestion.level_id,
      classification_type_id: selectedQuestion.classification_type_id,
      is_quotable_question: selectedQuestion.is_quotable_question,
      is_chartable_question: selectedQuestion.is_chartable_question,
      min_value: selectedQuestion.min_value,
      max_value: selectedQuestion.max_value,
      node_name: selectedQuestion.node_name,
      survey_id: selectedQuestion.survey_id || surveyId,
      chart_type_id: selectedQuestion.chart_type_id,
      classification_type_key: selectedQuestion.classification_type_key,
      classification_type_name: selectedQuestion.classification_type_name,
      chart_type_key: selectedQuestion.chart_type_key,
      chart_type_name: selectedQuestion.chart_type_name,
      node: selectedQuestion.node,
      is_tabulation: selectedQuestion.is_tabulation,
      is_max_diff: selectedQuestion.is_max_diff || false,
      is_conjoint_question: selectedQuestion.is_conjoint_question,
      is_insights_question: selectedQuestion.is_insights_question,
      answer_label: item?.answer_label,
      question_precode_label: '',
      is_calculated_question: true,
      is_tabulation_question: selectedQuestion.is_tabulation_question || false,
      question_title: questionTitle,
      parent_question_id: selectedQuestion.value,
      sort_order: index + 1
    }));

    console.log(payload, "payloadpayloadpayload")

    try {
      // @ts-ignore
      const data = await projectDataService.PostDataCustomQualification(Number(projectId), Number(surveyId), payload)
      // console.log(data, "datadata")
      if (data) {
        GetChartsQuestionsById()
        ResetStates()
        ResetRanges()
        handleClose()
        enqueueSnackbar(
          <Typography variant="body1">Question Added Successfully</Typography>,
          {
            variant: "success",
          }
        );
      } else {
        enqueueSnackbar(
          <Typography variant="body1">Question Added request failed</Typography>,
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      logger.error(error)
      enqueueSnackbar(
        <Typography variant="body1">Question Added request failed</Typography>,
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }

    console.log(payload); // Here you would actually send the payload to a server or similar.
  }, [customAnswers, selectedQuestion, projectId, questionCode, questionTitle, binRanges]);

  //  opentext - 3, numeric - 4, opentextlist - 5(not using), numericlist - 6
  // opentext is multi , other are single

  useEffect(() => {

    if (Array.isArray(questionList) && questionList.length) {
      const serviceNames = questionList?.filter(
        (val: ConfigQuestionType) =>
          (val.question_type_id === 3 || val.question_type_id === 4 || val.question_type_id === 6)
          && val.question_variable_type == 'Survey'
      )?.map((item) => ({
        ...item,
        value: item?.question_id,
        text: item.question_id,
        label: item.question_id,
        question_text: item?.question_text,
        question_type_id: item?.question_type_id,
      }));
      setCustomQuestionsList(serviceNames);
    }

    // setCustomQuestions(
    //   questionList.filter(
    //     (val: ConfigQuestionType) =>
    //       val.question_type_id === 3 || val.question_type_id === 5 || val.question_type_id === 7 || val.question_type_id === 8,
    //   ),
    // )
  }, [questionList])

  console.log('customQuestions', customQuestionsList, selectedQuestion, customAnswers, answerText, binRanges)

  return (
    <Dialog maxWidth="md" fullWidth open={true} aria-describedby="alert-dialog-slide-description">
      {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "10px",
            // marginTop: "10px",
          }}
        >
          <DialogTitle id="alert-dialog-title" color="black">
            Add Custom Qualification
          </DialogTitle>
          <Box style={{ display: "flex" }}>
            <IconButton onClick={handleClose} sx={{ width: "40px", height: "40px" }}  >
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        </Box>

        <Box style={{ padding: "1rem 2rem 2rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100vh - 400px)" }}>

          <Grid container spacing={2}>
            <Grid item xs={12} style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
              <Autocomplete
                // multiple
                id="size-small-standard-multi"
                size="small"
                options={customQuestionsList}
                getOptionLabel={(option) => option.text || ''}
                // @ts-ignore
                value={selectedQuestion}
                onChange={(_event, newValue) => {
                  if (newValue?.question_type_id == 3) {
                    ResetStates()
                  } else {
                    ResetRanges()
                  }
                  const updatedValue = newValue ? {
                    ...newValue,
                    question_id: `${newValue?.question_id}`,
                    question_title: `${newValue?.question_id}_Q1`
                  } : null;
                  // @ts-ignore
                  setSelectedQuestion(updatedValue);

                  // setQuestionCode(`${newValue?.question_id}_Q1`)
                  setQuestionCode(`Q1`)
                  setQuestionTitle(`${newValue?.question_id}_Q1`)


                }}
                // open={open}
                // onOpen={() => setOpen(true)}
                // disableCloseOnSelect
                // noOptionsText={'No options'}
                // onClose={() => setOpen(false)}
                // openOnFocus
                // selectOnFocus
                filterOptions={(options, { inputValue }) => {
                  return options?.filter(option =>
                    option?.text?.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option?.question_text?.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                renderOption={(props, option,) => (
                  <li {...props} style={{ padding: "0rem 1rem", minHeight: "0px " }} key={option?.value}>
                    <ListItemIcon  >

                      <QuestionTypeIcon typeId={option?.question_type_name == 'opentext' ? 3 : option?.question_type_name == 'numeric' ? 5 : option?.question_type_name == "numericlist" ? 8 : Number(option?.question_type_id)} />
                    </ListItemIcon>
                    <div  >
                      <ListItemText primary={option?.text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                      <ListItemText primary={option.question_text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Questions"
                    placeholder="Search Questions"
                  />
                )}


                sx={{
                  '& .MuiAutocomplete-inputRoot': {
                    flexWrap: 'nowrap !important',
                    overflowX: 'auto',
                  },
                  '& .MuiAutocomplete-tag': {
                    margin: '2px',
                    flexShrink: 0,
                  },
                  '& .MuiAutocomplete-tagList': {
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    flexWrap: 'nowrap',
                  },
                  '& .MuiAutocomplete-paper': {
                    overflow: 'visible',
                  },
                  '& .MuiAutocomplete-endAdornment': {
                    position: 'relative',
                    right: 0,
                    display: 'none',
                  },
                  '.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :nth-last-child(-n+2)': {
                      flexBasis: '100%',
                      width: '100%',
                    },
                  },
                }}
              />

            </Grid>

            <Grid item xs={12} style={{ padding: "0rem 0rem 1rem 1.5rem", display: selectedQuestion ? "block" : "none" }}>
              <Typography style={{
                fontSize: '16px',
                lineHeight: '32px',
                fontWeight: '400',
                fontFamily: 'sans-serif',
                color: 'black',
              }}>
                {selectedQuestion?.question_text}
              </Typography>

            </Grid>

            <Grid item xs={12} style={{ padding: "0rem 0rem 0rem 1.5rem", display: selectedQuestion ? "flex" : "none", gap: "1rem" }}>
              <Box style={{ width: "100%" }}>
                <QuestionNameInput
                  placeholder="Question Code"
                  className="base-comp-question_code-input"
                  size="small"
                  fullWidth
                  sx={{ "& .MuiInputBase-input": { fontWeight: 700 }, '& .MuiOutlinedInput-root': { borderColor: theme.palette.grey[500] } }}
                  value={questionCode}
                  onChange={(e) => setQuestionCode(e?.target.value)}
                  InputProps={{
                    startAdornment: <Typography style={{
                      color: theme.palette.grey[800],
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      lineHeight: "140%",
                      fontFamily: "Inter, sans-serif",
                    }}> {`${selectedQuestion?.question_id}_`} </Typography>
                  }}

                />
                {questionList?.filter((item) => item.question_id == `${selectedQuestion?.question_id}_${questionCode}`)?.length > 0 &&
                  <Typography sx={{ color: 'error.main', marginBottom: '0rem', padding: "0rem 0rem 0rem 0rem", }}>{'Question code should be unique'}</Typography>
                }
              </Box>
              {/* </Grid>

            <Grid item xs={6} style={{ padding: "0rem 0rem 1rem 1.5rem", display: selectedQuestion ? "block" : "none" }}> */}

              <QuestionNameInput
                placeholder="Question Title"
                className="base-comp-question_code-input"
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { fontWeight: 700 }, '& .MuiOutlinedInput-root': { borderColor: theme.palette.grey[500] } }}
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e?.target.value)}

              />
            </Grid>

            {selectedQuestion?.question_type_id == 3 ?
              <>
                <Grid item xs={12} style={{ padding: "0rem 0rem 0rem 1.5rem", display: selectedQuestion ? "block" : "none" }}>


                  <List dense={true} style={{ width: "77%", marginBottom: "0rem" }}>
                    {customAnswers && customAnswers?.map((answer: any, index: number) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteAnswer(index)} sx={{ color: '#666' }}>
                            <DeleteRoundedIcon style={{ color: "red" }} />
                          </IconButton>
                        }
                        sx={{
                          bgcolor: 'background.paper',
                          mb: 0.5,
                          boxShadow: 1,
                          borderRadius: '4px',
                          gap: '1rem'
                        }}
                      >
                        {/* <ListItemText primary={`${answer.answer_code}: ${answer.answer_label}`} /> */}

                        <QuestionNameInput
                          placeholder="Code"
                          className="base-comp-question_code-input"
                          size="small"
                          sx={{ "& .MuiInputBase-input": { fontWeight: 700 }, width: "14.5% !important" }}
                          value={answer.answer_code}
                          onChange={e => handleAnswersChange(index, 'answer_code', e.target.value)}
                        />
                        <QuestionNameInput
                          placeholder="Min Value"
                          className="base-comp-question_code-input"
                          size="small"
                          sx={{ "& .MuiInputBase-input": { fontWeight: 400 }, width: "85% !important" }}
                          value={answer.answer_label}
                          onChange={e => handleAnswersChange(index, 'answer_label', e.target.value)}
                        />
                      </ListItem>
                    ))}
                  </List>

                </Grid>

                <Grid item xs={12} style={{ padding: "0rem 0rem 0rem 2.5rem", display: selectedQuestion ? "block" : "none" }}>


                  <Grid item xs={12} style={{ padding: "0rem 0rem 1rem 0rem", display: selectedQuestion ? "flex" : "none", gap: "1rem" }}>

                    <QuestionNameInput
                      placeholder="Type answer code here"
                      className="base-comp-question_code-input"
                      size="small"
                      fullWidth
                      sx={{ "& .MuiInputBase-input": { fontWeight: 700 }, '& .MuiOutlinedInput-root': { borderColor: theme.palette.grey[500] }, width: "10% !important" }}
                      value={answerCode}
                      onChange={(e) => setAnswerCode(e?.target.value)}
                    />
                    <QuestionNameInput
                      placeholder="Type answer text here"
                      className="base-comp-question_code-input"
                      size="small"
                      fullWidth
                      sx={{ "& .MuiInputBase-input": { fontWeight: 700 }, '& .MuiOutlinedInput-root': { borderColor: theme.palette.grey[500] }, width: "58% !important" }}
                      value={answerText}
                      onChange={(e) => setAnswerText(e?.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} style={{ padding: "0rem 0rem 1rem 0rem", display: selectedQuestion ? "block" : "none" }}>

                    <Button disabled={!answerText || !answerCode} variant="contained" onClick={handleAddAnswer}>+ Answer</Button>
                  </Grid>
                </Grid>
              </>
              :
              <>
                <Grid container spacing={2} style={{ display: selectedQuestion ? "flex" : "none", padding: "0.5rem 0rem 0rem 2.5rem", }}>
                  <Grid item md={1.5}></Grid>
                  <Grid item md={3.65}>
                    <Typography sx={{ color: '#333', fontWeight: 'medium' }}>Min Value: {selectedQuestion?.min_value}</Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography sx={{ color: '#333', fontWeight: 'medium' }}>Max Value: {selectedQuestion?.max_value}</Typography>
                  </Grid>
                </Grid>
                <List dense={true} style={{ width: "79.5%", marginBottom: "0rem", padding: "0rem 0rem 1rem 1.5rem", }}>
                  {binRanges && binRanges?.map((range: any, index: number) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRange(index)} sx={{ color: '#666' }}>
                          <DeleteRoundedIcon style={{ color: "red" }} />
                        </IconButton>
                      }
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 0.5,
                        boxShadow: 1, // Optional: adds a shadow for depth
                        borderRadius: '4px', // Optional: rounds the corners for a softer look
                        gap: "1rem"
                      }}
                    >
                      {/* <ListItemText primary={`${range.answer_code}: ${range.answer_label}`} sx={{ color: '#333' }} /> */}

                      <QuestionNameInput
                        placeholder="Code"
                        className="base-comp-question_code-input"
                        size="small"
                        sx={{ "& .MuiInputBase-input": { fontWeight: 700 }, width: "35% !important" }}
                        value={range.answer_code}
                        onChange={e => handleRangeChange(index, 'answer_code', e.target.value)}
                      />
                      <QuestionNameInput
                        placeholder="Min Value"
                        className="base-comp-question_code-input"
                        size="small"
                        sx={{ "& .MuiInputBase-input": { fontWeight: 400 }, width: "50%" }}
                        value={range.answer_label.split('-')[0]}
                        onChange={e => handleRangeChange(index, 'answer_label', `${e.target.value}-${range.answer_label.split('-')[1]}`)}
                      />
                      <QuestionNameInput
                        placeholder="Max Value"
                        className="base-comp-question_code-input"
                        size="small"
                        sx={{ "& .MuiInputBase-input": { fontWeight: 400 }, width: "50%" }}
                        value={range.answer_label.split('-')[1]}
                        onChange={e => handleRangeChange(index, 'answer_label', `${range.answer_label.split('-')[0]}-${e.target.value}`)}
                      />

                    </ListItem>
                  ))}
                </List>
                {error && <Typography sx={{ color: 'error.main', marginBottom: '1rem', padding: "0rem 0rem 0rem 1.5rem", }}>{error}</Typography>}
                <Grid container spacing={2} style={{ marginBottom: "2rem", padding: "0rem 0rem 0rem 2.5rem", }}>
                  <Grid item xs={12} style={{ display: selectedQuestion ? "flex" : "none", gap: "1rem" }}>

                    <QuestionNameInput
                      placeholder="Type answer code here"
                      className="base-comp-question_code-input"
                      size="small"
                      fullWidth
                      sx={{ "& .MuiInputBase-input": { fontWeight: 700 }, '& .MuiOutlinedInput-root': { borderColor: theme.palette.grey[500] }, width: "10% !important" }}
                      value={rangeAnswerCode}
                      onChange={(e) => setRangeAnswerCode(e?.target.value)}
                    />

                    {/* <label>Min Value</label> */}
                    <QuestionNameInput
                      placeholder="Type Min Value"
                      className="base-comp-question_code-input"
                      size="small"
                      sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, '& .MuiOutlinedInput-root': { borderColor: theme.palette.grey[500] }, width: "29% !important" }}
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                    />

                    {/* <label>Max Value</label> */}
                    <QuestionNameInput
                      placeholder="Type Max Value"
                      className="base-comp-question_code-input"
                      size="small"
                      sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, '& .MuiOutlinedInput-root': { borderColor: theme.palette.grey[500] }, width: "29% !important" }}
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ display: selectedQuestion ? "flex" : "none", gap: "1rem" }}>
                    <Button variant="contained" onClick={handleAddRange} disabled={!rangeAnswerCode || !minValue || !maxValue} >+ Range</Button>
                  </Grid>
                </Grid>
              </>
            }
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => {
          ResetStates()
          ResetRanges()
          handleClose()
        }
        }>Cancel</Button>
        <Button variant="contained"
          disabled={!selectedQuestion || (selectedQuestion?.question_type_id == 3 ? customAnswers.length === 0 : binRanges?.length == 0) || !questionCode || !questionTitle || questionList?.filter((item) => item.question_id == `${selectedQuestion?.question_id}_${questionCode}`)?.length > 0}
          onClick={() => {
            if (projectId && customAnswers && selectedQuestion) {
              handleDone({ projectId, customAnswers, selectedQuestion })
            }
          }}>Done</Button>
      </DialogActions>
    </Dialog >
  )
}

export default CustomQualComponent
