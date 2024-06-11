import QuestionTypeBaseComp from '@/components/question-types-base-comp'
import { useState, useEffect } from 'react'
import { QuestionAnsTypes, QuestionBaseCategoryTypes, QuestionBaseTypes, SinglePunchProps } from './numeric-list-types'
import {
  BoxWrapper,
  ErrorBox,
  MDInput,
  MdBox,
  StyledAnswersDivider,
  // StyledCardAnswerText,
  StyledContentBox,
  StyledEditOptionsBox,
  // StyledQuestionBaseDivider,
  StyledRowGapWrapper,
  StyledRowWrapper,
  StyledTypeText,
} from './numeric-list.style'
import Checkbox from '@mui/material/Checkbox'
// import FormControlLabel from "@mui/material/FormControlLabel";
import { IconButton, Box, Button, Tooltip, Typography, FormControlLabel, Switch, ImageList, ImageListItem } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import QuestionBaseCategory from '@/components/question-base-category'
import Grid from '@mui/material/Grid'
import Select from '@/components/select'
import Stack from '@mui/material/Stack'
import QuestionBaseShowCodes from '@/components/question-base-show-codes'
// import { CardsDragnDropIcon } from "@/assets/images";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import '../../../global.css'
import { theme } from '@/constants/theme'
import { StyledCardQuestionHeadingTitle, StyledLabel } from '@/components/question-types-base-comp/question-types-base.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import QuestionTypeIcon from '@/constants/questionTypeIcon'
import { SortingListTypes } from '@/components/project-survey-builder/project-survey-builder.type'
import LockIcon from '@mui/icons-material/Lock'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import QuestionNotesComponent from '@/components/question-notes'
import { QuestionNameInput } from '@/constants/cutom-question-name-input'
import _ from 'lodash'
import BuilderSwitchQuestions from '@/components/builder-switch-questions/builder-switch-questions.component'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import PasteListModalComponent from '@/components/paste-list-modal/paste-list-modal.component'



import BurstModeIcon from '@mui/icons-material/BurstMode';
// 
import UploadModalSelect from '@/components/project-media-upload-modal-select/project-media-upload-modal-select.component'
import { FilesTypes } from '@/components/project-media-upload-modal/project-media-upload-modal.type'
import ShowConceptForAnswers from '@/components/concept-answers-show/concept-answers-show.component'


const UpperLimitType = [
  {
    value: 'Smaller',
    text: 'Smaller',
  },
  {
    value: 'SmallerOrEqual',
    text: 'SmallerOrEqual',
  },
]

const LowerLimitType = [
  {
    value: 'Greater',
    text: 'Greater',
  },
  {
    value: 'GreaterOrEqual',
    text: 'GreaterOrEqual',
  },
]

const NumericList: React.FC<SinglePunchProps> = ({
  question,
  surveyQuestionId,
  SaveQuestion,
  add,
  editFalse,
  setEditFalse,
  loading,
  setQuestionPreview,
  questionPreview,
  sortingList,
  questionTheme,
  setQuestionCompare,

  setSelectedQuestion,
  swapList,
  questionTypeList,

  // uploadMediaModalSelect,
  // setUploadMediaModalSelect,
  // selectedFileQuestionTitle,
  // setSelectedFileQuestionTitle
}) => {
  const [questionBase, setQuestionBase] = useState<QuestionBaseTypes | null>(null)
  const [questionAns, setQuestionAns] = useState<QuestionAnsTypes[]>([])
  const [deletedQuestionAns, setDeletedQuestionAns] = useState<QuestionAnsTypes[]>([])
  const [questionBaseCategory, setQuestionBaseCategory] = useState<QuestionBaseCategoryTypes | null>(null)
  const [valid, setValid] = useState(false)
  const [isEdit, setIsEdit] = useState(add ? true : false)
  const [answerListSorting, setAnswerListSorting] = useState<SortingListTypes[]>([])
  const [collapseConf, setCollapseConf] = useState(true)
  // const [collapseAns, setCollapseAns] = useState(false);
  const [questionObjCopy, setQuestionObjCopy] = useState<any>(null)
  // upload media

  const [uploadMediaModalSelect, setUploadMediaModalSelect] = useState(false)
  const [selectedFileQuestionTitle, setSelectedFileQuestionTitle] = useState<FilesTypes | null>(null);

  const [selectedFileQuestionAnswer, _setSelectedFileQuestionAnswer] = useState<FilesTypes | null>(null);
  const [uploadAnswerIndex, setUploadAnswerIndex] = useState<number | null>(null)

  const [addOption, setAddOption] = useState(false)

  const isCodeDuplicate = (code: string | number) => {
    return questionAns.filter((answer) => answer.question_answer_code === code).length > 1
  }
  const onDragEnd = (result: DropResult) => {
    const { destination } = result
    if (!destination) {
      return
    }
    const reorderedAnswers = Array.from(questionAns)
    const [moved] = reorderedAnswers.splice(result.source.index, 1)
    reorderedAnswers.splice(Number(result && result.destination && result?.destination?.index), 0, moved)

    const updatedAnswers = reorderedAnswers.map((answer, index) => ({
      ...answer,
      sort_order: index + 1,
    }))
    setQuestionAns(updatedAnswers)
  }

  const dataConverter = () => {
    let payload: QuestionBaseTypes | null = {
      question_data_code: question?.question_data_code ? question?.question_data_code : '',
      question_name: question?.question_name ? question?.question_name : '',
      question_title: question?.question_title ? question?.question_title : '',
      question_title_formatted: question?.question_title_formatted ? question?.question_title_formatted : '',
      instructions: question?.instructions ? question?.instructions : '',
      programming_notes: question?.programming_notes ? question?.programming_notes : '',
      question_id: question?.question_id ? Number(question?.question_id) : null,
      question_category_id: question?.question_category_id ? Number(question?.question_category_id) : 1,
      question_category: question?.question_category ? question?.question_category : '',
      question_code: question?.question_code ? question?.question_code : '',
      question_type_id: question?.question_type_id ? Number(question?.question_type_id) : 8,
      question_time: question?.question_time ? question?.question_time : 0,
      concept: question?.concept ? question?.concept : null,

    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {
      required_question: question?.required_question ? question?.required_question : false,
      can_have_quota: question?.can_have_quota ? question?.can_have_quota : false,
      answer_sorting_order: question?.answer_sorting_order ? question?.answer_sorting_order : '',
      show_codes: false,
      no_of_rows: question?.no_of_rows ? question?.no_of_rows : '',
      no_of_columns: question?.no_of_columns ? question?.no_of_columns : '',
      precision_value: question?.precision_value ? question?.precision_value : '',
      upper_limit: question?.upper_limit === null || question?.upper_limit === '' ? '' : question?.upper_limit,
      lower_limit: question?.lower_limit === null || question?.upper_limit === '' ? '' : question?.lower_limit,
      auto_sum: question?.auto_sum ? question?.auto_sum : false,
      multi_sum_equal: question?.multi_sum_equal ? question?.multi_sum_equal : Number(question?.multi_sum_equal) === 0 ? 0 : 100,
      lower_limit_type: question?.lower_limit_type ? question?.lower_limit_type : 'GreaterOrEqual',
      upper_limit_type: question?.upper_limit_type ? question?.upper_limit_type : 'SmallerOrEqual',
    }

    let questionCopy: any = {
      questionBase: payload,
      questionBaseCategory: questionBaseCategoryPayload,
    }

    setQuestionBase(payload)
    setQuestionBaseCategory(questionBaseCategoryPayload)
    if (question?.answers && Array.isArray(question?.answers)) {
      const transformedAnswers = question?.answers.map((answer, index) => ({
        ...answer,
        sort_order: index + 1,
      }))
      setQuestionAns(JSON.parse(JSON.stringify(transformedAnswers)))
      questionCopy.questionAns = JSON.parse(JSON.stringify(transformedAnswers))
    }
    setQuestionObjCopy(questionCopy)
  }

  const ingerNum = (e: any) => {
    const characterCode = e.key
    if (characterCode === 'Backspace') return

    const characterNumber = Number(characterCode)
    if (characterNumber >= 0 && characterNumber <= 9) {
      return
    } else {
      e.preventDefault()
    }
  }

  useEffect(() => {
    dataConverter()
  }, [question])

  useEffect(() => {
    // let check = questionAns && questionAns?.length > 0 && questionAns?.some((answer) => answer.question_answer_text === '')
    let checkCode = questionAns && questionAns?.length > 0 && questionAns?.some((answer) => answer.question_answer_code === '')
    let uniqueCodeCheck =
      questionAns && questionAns?.length > 0 && new Set(questionAns?.map((a) => a.question_answer_code)).size !== questionAns?.length

    if (
      surveyQuestionId
        ? questionBase?.question_title_formatted !== '' &&
        // check === false &&
        checkCode === false &&
        uniqueCodeCheck === false &&
        questionAns.length > 0 &&
        //questionBase?.instructions !== "" &&
        questionBase?.question_name !== ''
        : questionBase?.question_title_formatted !== '' &&
        // check === false &&
        // checkCode === false &&
        uniqueCodeCheck === false &&
        // questionAns.length > 0 &&
        questionBase?.question_code &&
        questionBase?.question_name !== '' &&
        questionBase?.question_code !== '0' &&
        questionBase?.question_code !== '' &&
        // questionBase?.question_data_code !== '0' &&
        // questionBase?.question_data_code !== '' &&

        //questionBase?.instructions !== "" &&
        questionBase?.question_category_id !== null &&
        questionBase?.question_type_id !== null
    ) {
      setValid(true)
    } else {
      setValid(false)
    }
  }, [questionAns, questionBase])

  const resetForm = () => {
    let payload: QuestionBaseTypes | null = {
      question_data_code: '',
      question_name: '',
      question_title: '',
      question_title_formatted: '',
      description: '',
      programming_notes: '',
      question_id: null,
      question_category_id: 1,
      question_category: '',
      question_code: '',
      question_type_id: 8,
      instructions: '',
      question_time: 30,

      concept: null,

    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {
      answer_sorting_order: 2,
      required_question: true,
      show_codes: false,
      can_have_quota: true,
      no_of_rows: '',
      no_of_columns: '',
      precision_value: 0,
    }
    setQuestionBase(payload)
    setQuestionBaseCategory(questionBaseCategoryPayload)
    setQuestionAns([])
  }

  useEffect(() => {
    if (add) {
      resetForm()
    }
  }, [add])

  useEffect(() => {
    if (isEdit) {
      setEditFalse && setEditFalse(true)
      if (sortingList) {
        setAnswerListSorting(sortingList)
      }
    }
  }, [isEdit])

  useEffect(() => {
    if (editFalse === false) {
      setIsEdit(false)
      dataConverter()
    } else if (editFalse) {
      setIsEdit(true)
    }
  }, [editFalse])

  // useEffect(() => {
  //   if (questionBaseCategory?.answer_sort_order === 2 || questionBaseCategory?.answer_sorting_order === 2) {
  //     let payload = questionAns.map((ans) => {
  //       ans.keep_answer_position = false
  //       return ans
  //     })
  //     setQuestionAns(payload)
  //   }
  // }, [questionBaseCategory])

  useEffect(() => {
    if (isEdit && setQuestionPreview) {
      let obj = {
        questionBase: questionBase,
        questionBaseCategory: questionBaseCategory,
        questionAns: questionAns,
      }
      setQuestionPreview(obj)
    }
  }, [questionBase, questionBaseCategory, questionAns])

  useEffect(() => {
    if (!isEdit && questionPreview) {
      setQuestionAns(questionPreview?.questionAns)
      setQuestionBaseCategory(questionPreview?.questionBaseCategory)
      setQuestionBase(questionPreview.questionBase)
    }
  }, [questionPreview])

  useEffect(() => {
    if (isEdit && setQuestionCompare) {
      let questionBaseCategoryCopy = { ...questionBaseCategory }
      let questionBaseCategoryObjCopy = { ...questionObjCopy.questionBaseCategory }

      delete questionBaseCategoryObjCopy.show_codes
      delete questionBaseCategoryCopy.show_codes
      if (
        _.isEqual(questionBase, questionObjCopy?.questionBase) &&
        _.isEqual(questionAns, questionObjCopy?.questionAns) &&
        _.isEqual(questionBaseCategoryCopy, questionBaseCategoryObjCopy)
      ) {
        setQuestionCompare(false)
      } else {
        setQuestionCompare(true)
      }
    }
  }, [questionAns, questionBase, questionBaseCategory])

  function isValidKey(event: any) {
    // Get the key code of the pressed key
    var keyCode = event.keyCode || event.which
    // Convert the key code to a character
    var charStr = String.fromCharCode(keyCode)
    // Define the pattern for allowed characters
    var pattern = /^[a-zA-Z0-9_]+$/

    // Special characters to disallow: dot (.), single quote ('), double quote (")
    var disallowedChars = ['.', "'", '"', '%']

    // If the pressed key matches the pattern or it's a special key (e.g., backspace, delete, arrow keys),
    // allow the input
    if ((pattern.test(charStr) || keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39) && !disallowedChars.includes(charStr)) {
      return true
    } else {
      // Otherwise, prevent the input
      event.preventDefault()
      return false
    }
  }

  function reverseColumns() {
    const questionCodes = questionAns.map((answer) => answer.question_answer_code)

    const reversedQuestionCodes = [...questionCodes].reverse()

    questionAns.forEach((answer, index) => {
      answer.question_answer_code = reversedQuestionCodes[index]
    })

    setQuestionAns([...questionAns])
  }

  const addOptionClose = () => {
    setAddOption(false)
  }

  const handleGetList = (value: string[]) => {
    let options = value.filter((val: string) => val !== '')
    let greaterNumber = questionAns.length > 0 ? Math.max(...questionAns.map((ans) => Number(ans.question_answer_code))) : 0
    let finalPayload = options.map((option, i) => {
      return {
        question_answer_id: '',
        answer_id: questionAns.length,
        question_answer_code: `${greaterNumber + (i + 1)}`,
        question_answer_text: option,
        add_other_option: false,
        keep_answer_position: false,
        is_terminate: false,
        is_active: true,
        sort_order: Number(questionAns.length > 0 ? Number(questionAns.length + 1) : 1),
        analysis_group: null,
        sub_class: null,
        class: null,
      }
    })
    let payload: QuestionAnsTypes[] = [...questionAns]
    let newArray = payload.concat(finalPayload)
    setQuestionAns(newArray)
    addOptionClose()
  }

  return (
    <>

      <UploadModalSelect open={uploadMediaModalSelect} onClose={() => {
        setUploadMediaModalSelect(false)
        setUploadAnswerIndex(null)
      }}
        // selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
        // selectedFileQuestionAnswer={selectedFileQuestionAnswer} setSelectedFileQuestionAnswer={setSelectedFileQuestionAnswer}
        uploadAnswerIndex={uploadAnswerIndex} setUploadAnswerIndex={setUploadAnswerIndex}
        questionAns={questionAns} setQuestionAns={setQuestionAns} questionBase={questionBase} setQuestionBase={setQuestionBase} />

      <BoxWrapper>
        <PasteListModalComponent open={addOption} addOptionClose={addOptionClose} handleGetList={handleGetList} />
        {isEdit ? (
          <StyledContentBox>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledRowWrapper
                  sx={{
                    borderBottom: `2px solid ${theme.palette.primary.dark}`,
                    padding: '0.5rem 0rem',
                  }}
                >
                  <Stack direction="row" alignItems="center">
                    <QuestionTypeIcon typeId={8} />
                    <BuilderSwitchQuestions setSelectedQuestion={setSelectedQuestion} swapList={swapList} questionTypeList={questionTypeList} />

                    <StyledTypeText display="flex" alignItems="center" flexDirection="row" style={{ gap: '1rem' }}>
                      {/* <span> {questionBase?.question_code}. </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: questionBase?.question_name
                            ? questionBase?.question_name
                            : "",
                        }}
                      ></span> */}
                      {/* <Grid item xs={12}> */}
                      <StyledCardQuestionHeadingTitle>
                        <QuestionNameInput
                          sx={{
                            '& .MuiInputBase-input': {
                              fontWeight: 700,
                            },
                          }}
                          placeholder="Question Code*"
                          className="base-comp-question_code-input"
                          size="small"
                          fullWidth
                          onKeyPress={(e: any) => {
                            isValidKey(e)
                          }}
                          value={questionBase?.question_data_code}
                          onChange={(e) => {
                            let payload: any = { ...questionBase }
                            payload.question_data_code = e.target.value
                            setQuestionBase(payload)
                          }}
                        />
                        {questionBase?.question_data_code === '' ? <ErrorBox>This Field is required</ErrorBox> : ''}
                      </StyledCardQuestionHeadingTitle>

                      <StyledCardQuestionHeadingTitle>
                        <QuestionNameInput
                          sx={{
                            '& .MuiInputBase-input': {
                              fontWeight: 700,
                            },
                          }}
                          placeholder="Question Name*"
                          className="base-comp-question_code-input"
                          size="small"
                          fullWidth
                          onKeyPress={(e: any) => {
                            isValidKey(e)
                          }}
                          value={questionBase?.question_name}
                          onChange={(e) => {
                            let payload: any = { ...questionBase }
                            payload.question_name = e.target.value
                            setQuestionBase(payload)
                          }}
                        />
                        {questionBase?.question_name === '' ? <ErrorBox>This Field is required</ErrorBox> : ''}
                      </StyledCardQuestionHeadingTitle>
                      {/* </Grid> */}
                    </StyledTypeText>
                  </Stack>
                </StyledRowWrapper>
              </Grid>
            </Grid>
          </StyledContentBox>
        ) : // <StyledContentBox>
          //   <Grid container spacing={2}>
          //     <Grid item xs={12}>
          //       <StyledRowWrapper>
          //         <Stack direction="row" alignItems="flex-start">
          //           <QuestionTypeIcon typeId={8} />
          //           <StyledTypeText
          //             display="flex"
          //             alignItems="center"
          //             flexDirection="row"
          //             sx={{ fontSize: "1rem" }}
          //           >
          //             <span> {questionBase?.question_code}. </span>
          //             <span
          //               dangerouslySetInnerHTML={{
          //                 __html: questionBase?.question_name
          //                   ? questionBase?.question_name
          //                   : "",
          //               }}
          //             ></span>
          //           </StyledTypeText>
          //         </Stack>
          //       </StyledRowWrapper>
          //     </Grid>
          //   </Grid>
          // </StyledContentBox>
          null}

        {/* <QuestionTypeBaseComp questionBase={questionBase} setQuestionBase={setQuestionBase} isEdit={isEdit} questionTheme={questionTheme}
          uploadMediaModalSelect={uploadMediaModalSelect} setUploadMediaModalSelect={setUploadMediaModalSelect}
          selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle} /> */}

        <QuestionTypeBaseComp questionBase={questionBase} setQuestionBase={setQuestionBase} isEdit={isEdit} questionTheme={questionTheme}
          uploadMediaModalSelect={uploadMediaModalSelect} setUploadMediaModalSelect={setUploadMediaModalSelect}
          selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle} loading={loading}
          uploadAnswerIndex={uploadAnswerIndex} setUploadAnswerIndex={setUploadAnswerIndex}
        />

        {isEdit ? (
          <StyledRowGapWrapper sx={{ padding: '0px', display: surveyQuestionId ? '' : 'none' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              marginTop="0.5rem"
              display={isEdit ? 'flex' : 'none'}
              sx={{
                // borderBottom: collapseAns
                //   ? `2px solid ${theme.palette.primary.dark}`
                //   : "",
                marginBottom: '0rem',
                width: '100%',
              }}
            >
              {/* <Typography variant="h6">Responses</Typography> */}

              <Button
                size="small"
                onClick={() => {
                  setAddOption(true)
                }}
              >
                +Add Options.
              </Button>
              <Stack direction="row">
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Tooltip title={'Reverse answers codes'}>
                    <IconButton
                      onClick={() => {
                        reverseColumns()
                      }}
                    >
                      <SwapVerticalCircleIcon style={{ backgroundColor: '#fff', borderRadius: '50px', color: '#6A5198' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <QuestionBaseShowCodes setQuestionBaseCategory={setQuestionBaseCategory} questionBaseCategory={questionBaseCategory} />
                </Box>
                {/* <IconButton
                  onClick={() => {
                    setCollapseAns(!collapseAns);
                  }}
                >
                  <KeyboardArrowDownIcon
                    sx={{ transform: collapseAns ? "rotate(180deg)" : "" }}
                  />
                </IconButton> */}
              </Stack>
            </Stack>
          </StyledRowGapWrapper>
        ) : null}
        {isEdit ? (
          <StyledContentBox sx={{ display: surveyQuestionId ? '' : 'none' }}>
            {/* --- */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="answers">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {questionAns &&
                      questionAns.length > 0 &&
                      questionAns
                        ?.filter((answer) => answer.is_active)
                        .map((answer, index) => (
                          <Draggable key={index} draggableId={String(answer.sort_order)} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <StyledEditOptionsBox
                                  key={index}
                                  sx={{
                                    alignItems: index === 0 ? 'flex-end' : 'center',
                                  }}
                                >
                                  {/* <Stack className="configuration-box-sub-drop-icon-stack ">
                                  <img src={CardsDragnDropIcon} />
                                </Stack> */}
                                  {/* <FormControlLabel
                                  // className="configuration-box-sub-drop-icon-stack-selected"
                                  control={ */}
                                  <Checkbox
                                    checked={answer.is_terminate ? false : true}
                                    onChange={() => {
                                      let payload: QuestionAnsTypes[] = [...questionAns]
                                      payload[index].is_terminate = !payload[index].is_terminate

                                      setQuestionAns(payload)
                                    }}
                                    size="small"
                                    color="primary"
                                  />
                                  {/* }
                                  label={""}
                                /> */}
                                  {questionBaseCategory?.show_codes ? (
                                    <Stack
                                      // className="stack-question_answer_code"
                                      sx={{ width: '10% !important' }}
                                    >
                                      <Tooltip
                                        title={
                                          answer?.question_answer_code === ''
                                            ? 'This Field is required'
                                            : isCodeDuplicate(answer?.question_answer_code)
                                              ? 'Code must be unique!'
                                              : ''
                                        }
                                      >
                                        <MDInput
                                          className="input-question_answer_code"
                                          variant="standard"
                                          placeholder="Code"
                                          value={answer?.question_answer_code}
                                          onKeyPress={(e: any) => {
                                            ingerNum(e)
                                          }}
                                          onChange={(e) => {
                                            let payload: QuestionAnsTypes[] = [...questionAns]
                                            payload[index].question_answer_code = e.target.value
                                            setQuestionAns(payload)
                                          }}
                                          error={isCodeDuplicate(answer?.question_answer_code) ? true : false}
                                        />
                                      </Tooltip>
                                    </Stack>
                                  ) : null}
                                  <Stack
                                    className="stack-question_answer_text"
                                    sx={{
                                      width: questionBaseCategory?.show_codes ? '85% !important' : '100% !important',
                                    }}
                                  >
                                    {/* {index === 0 && (
                                    <StyledLabel sx={{ padding: "0px" }}>
                                      Text
                                    </StyledLabel>
                                  )} */}
                                    <MDInput
                                      // fullWidth
                                      autoFocus={questionAns.filter((answer) => answer.question_answer_id === '').length > 0 ? true : false}
                                      className="input-question_answer_text"
                                      variant="standard"
                                      placeholder="Text"
                                      value={answer?.question_answer_text}
                                      onChange={(e) => {
                                        let payload: QuestionAnsTypes[] = [...questionAns]
                                        payload[index].question_answer_text = e.target.value
                                        setQuestionAns(payload)
                                      }}
                                    />
                                  </Stack>

                                  {answer?.concept ? (
                                    <ShowConceptForAnswers answer={answer} index={index} selectedFileQuestionAnswer={selectedFileQuestionAnswer} setQuestionAns={setQuestionAns} questionAns={questionAns} />
                                  ) : null}

                                  {questionBaseCategory?.show_codes ? (
                                    <>
                                      <Stack className="stack-question_answer_text">
                                        <MDInput
                                          className="input-question_answer_text"
                                          sx={{ width: '80%' }}
                                          variant="standard"
                                          placeholder="Group"
                                          value={answer?.analysis_group}
                                          onChange={(e) => {
                                            let payload: QuestionAnsTypes[] = [...questionAns]
                                            payload[index].analysis_group = e.target.value
                                            setQuestionAns(payload)
                                          }}
                                        />
                                      </Stack>

                                      <Tooltip title="Lock position">
                                        <IconButton
                                          onClick={() => {
                                            let payload: QuestionAnsTypes[] = [...questionAns]
                                            if (answer?.keep_answer_position) {
                                              payload[index].keep_answer_position = false
                                            } else {
                                              payload[index].keep_answer_position = true
                                            }
                                            setQuestionAns(payload)
                                          }}
                                        >
                                          <LockIcon fontSize="small" color={answer?.keep_answer_position ? 'primary' : 'inherit'} />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Add other. field">
                                        <IconButton
                                          onClick={() => {
                                            let payload: QuestionAnsTypes[] = [...questionAns]
                                            if (answer?.add_other_option) {
                                              payload[index].add_other_option = false
                                            } else {
                                              payload[index].add_other_option = true
                                            }
                                            setQuestionAns(payload)
                                          }}
                                        >
                                          <TextFieldsIcon color={answer?.add_other_option ? 'primary' : 'inherit'} fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  ) : null}

                                  <Box style={{ marginLeft: '0.8rem' }}>
                                    <Tooltip title={''} placement='left'>
                                      <BurstModeIcon 
                                        width={12}
                                        onClick={() => {
                                          setUploadMediaModalSelect(true)
                                          setUploadAnswerIndex(index)
                                        }}
                                        style={{
                                          cursor: 'pointer',
                                          // backgroundColor: uploadMediaModalSelect ? `${theme.palette.primary.main}` : '#ffffff',
                                          borderRadius: '4px',
                                        }}
                                      />
                                    </Tooltip>
                                  </Box>

                                  <IconButton
                                    onClick={() => {
                                      let payload: QuestionAnsTypes[] = [...questionAns]
                                      let deletedPayload: QuestionAnsTypes[] = [...deletedQuestionAns]

                                      if (answer.question_answer_id) {
                                        payload[index].is_active = false
                                        deletedPayload.push(payload[index])
                                      }
                                      payload.splice(index, 1)

                                      payload = payload.map((answer, idx) => ({
                                        ...answer,
                                        sort_order: idx + 1,
                                      }))

                                      setQuestionAns(payload)
                                      setDeletedQuestionAns(deletedPayload)
                                    }}
                                  >
                                    <DeleteOutlineIcon fontSize="small" color="error" />
                                  </IconButton>
                                </StyledEditOptionsBox>
                              </div>
                            )}
                          </Draggable>
                        ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <StyledEditOptionsBox className="answer-add-container">
              {/* <FormControlLabel
                control={<Checkbox size="small" color="primary" />}
                label={""}
              /> */}
              <Checkbox size="small" color="primary" />
              <MDInput
                fullWidth
                variant="standard"
                // className="answer-add-container-input"
                placeholder="Add Options"
                onFocus={() => {
                  let payload: QuestionAnsTypes[] = [...questionAns]
                  let greaterNumber = questionAns.length > 0 ? Math.max(...questionAns.map((ans) => Number(ans.question_answer_code))) : 0
                  payload.push({
                    question_answer_id: '',
                    answer_id: questionAns.length,
                    question_answer_code: `${greaterNumber + 1}`,
                    question_answer_text: ``,
                    add_other_option: false,
                    keep_answer_position: false,
                    is_terminate: false,
                    is_active: true,
                    sort_order: Number(questionAns.length > 0 ? Number(questionAns.length + 1) : 1),

                    analysis_group: null,
                    sub_class: null,
                    class: null,
                  })
                  setQuestionAns(payload)
                }}
              />
            </StyledEditOptionsBox>
          </StyledContentBox>
        ) : (
          <StyledContentBox className="answer-add-container-view-mode" sx={{ display: surveyQuestionId ? '' : 'none' }}>
            <ImageList sx={{ width: '100%', gridTemplateColumns: questionAns.some((item) => item?.concept?.file_url) ? 'repeat(2, 1fr) !important' : 'repeat(1, 1fr) !important', }}>
              {questionAns &&
                questionAns.length > 0 &&
                questionAns
                  ?.filter((answer) => answer.is_active)
                  .map((answer, index) => (
                    <>
                      <ImageListItem key={index} style={{
                        display: "flex", alignItems: "start", gap: "0.5rem", flexDirection: questionAns.some((item) => item?.concept?.file_url) ? 'column' : 'row'
                      }}>
                        {answer?.concept ? (
                          <ShowConceptForAnswers answer={answer} index={null} hide={true} selectedFileQuestionAnswer={selectedFileQuestionAnswer} setQuestionAns={setQuestionAns} questionAns={questionAns} />
                        ) : null}

                        <span style={{ display: "flex", flexDirection: "column" }}>
                          <span
                            style={{
                              fontSize: '20px',
                              lineHeight: '28px',
                              fontWeight: 400,
                              fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: `${answer.question_answer_text}`,
                            }}
                          ></span>



                          <MDInput variant="standard" size="small" type="number" className="opn-ended-input" />
                          {answer.add_other_option ? (
                            <MDInput
                              disabled
                              sx={{ paddingLeft: '10px' }}
                              value="Specify other"
                              variant="standard"
                              placeholder="Specify other"
                              className="opn-ended-input"
                            />
                          ) : (
                            ''
                          )}
                          {answer.is_terminate ? (
                            <span
                              className="question-terminate-span"
                              style={{
                                fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                              }}
                            >
                              [Terminate]
                            </span>
                          ) : (
                            ''
                          )}
                        </span>
                        {/* </StyledCardAnswerText> */}


                      </ImageListItem>
                    </>
                  ))}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ marginTop: '1rem', width: '200px', display: !questionBaseCategory?.auto_sum ? 'none' : '' }}
              >
                <Typography fontSize="14px"> Total</Typography>
                <Typography fontSize="14px"> 0.00</Typography>
              </Stack>
            </ImageList>
          </StyledContentBox>
        )}
        {/* <StyledAnswersDivider
          isEdit={isEdit}
          sx={{
            display: collapseAns ? "none" : "",
            backgroundColor: `${theme.palette.primary.dark}`,
            height: "2px",
            marginTop: "1rem",
          }}
        /> */}

        {isEdit ? (
          <StyledContentBox className="configuration-box" sx={{ marginBottom: '0rem' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              marginTop="0.5rem"
              display={isEdit ? 'flex' : 'none'}
              sx={{
                // borderBottom: collapseConf
                //   ? `2px solid ${theme.palette.primary.dark}`
                //   : "",
                marginBottom: '0.5rem',
              }}
            >
              <Typography variant="h6">Configuration</Typography>
              <IconButton
                onClick={() => {
                  setCollapseConf(!collapseConf)
                }}
              >
                <KeyboardArrowDownIcon sx={{ transform: !collapseConf ? 'rotate(180deg)' : '' }} />
              </IconButton>
            </Stack>

            <StyledEditOptionsBox sx={{ display: collapseConf ? 'none' : '' }}>
              <Grid container spacing={1}>
                <Grid item xs={11.8}>
                  <Stack width="100%">
                    <Select
                      className="configuration-box-select"
                      value={(questionBaseCategory?.answer_sorting_order && questionBaseCategory?.answer_sorting_order.toString()) || ''}
                      items={answerListSorting}
                      onChange={(e) => {
                        let payload: any = { ...questionBaseCategory }
                        payload.answer_sorting_order = e.target.value
                        setQuestionBaseCategory(payload)
                      }}
                      label="Answer list sorting"
                      name="answer_sorting_order"
                      isRequired={true}
                      size="small"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={3.93}>
                  <Stack width="100%">
                    <StyledLabel style={{ paddingTop: '0.1rem', paddingBottom: '10px' }}>Input Box Size</StyledLabel>
                    <MDInput
                      className="base-comp-no_of_answers_min .MuiInputBase-input"
                      label="Rows"
                      size="small"
                      type="number"
                      fullWidth
                      value={questionBaseCategory?.no_of_rows}
                      onChange={(e) => {
                        let payload: any = { ...questionBaseCategory }
                        payload.no_of_rows = e.target.value
                        setQuestionBaseCategory(payload)
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={3.93}>
                  <Stack width="100%">
                    <StyledLabel style={{ paddingTop: '0.5rem', paddingBottom: '20px' }}> </StyledLabel>
                    <MDInput
                      label="Width"
                      type="number"
                      className="base-comp-no_of_answers_min .MuiInputBase-input"
                      size="small"
                      fullWidth
                      value={questionBaseCategory?.no_of_columns}
                      onChange={(e) => {
                        let payload: any = { ...questionBaseCategory }
                        payload.no_of_columns = e.target.value
                        setQuestionBaseCategory(payload)
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={3.93}>
                  <Stack width="100%">
                    <StyledLabel style={{ paddingTop: '0.5rem', paddingBottom: '20px' }}></StyledLabel>
                    <MDInput
                      label="Decimals"
                      type="number"
                      className="base-comp-no_of_answers_min .MuiInputBase-input"
                      size="small"
                      onFocus={(e) => e?.target?.value == '0' || (0 && e.target.select())}
                      fullWidth
                      onKeyPress={(e: any) => {
                        ingerNum(e)
                      }}
                      value={questionBaseCategory?.precision_value}
                      onChange={(e) => {
                        let payload: any = { ...questionBaseCategory }
                        payload.precision_value = e.target.value
                        setQuestionBaseCategory(payload)
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={5.9} marginTop="0.5rem">
                  <Select
                    items={LowerLimitType}
                    value={questionBaseCategory?.lower_limit_type?.toString() || ''}
                    size="small"
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.lower_limit_type = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                    label="Lower Limit Type"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px !important',
                      },
                    }}
                    name={'lower_limit_type'}
                  />
                </Grid>
                <Grid item xs={5.9} marginTop="0.5rem">
                  <Select
                    items={UpperLimitType}
                    value={questionBaseCategory?.upper_limit_type?.toString() || ''}
                    size="small"
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.upper_limit_type = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                    label="Upper Limit Type"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px !important',
                      },
                    }}
                    name={'upper_limit_type'}
                  />
                </Grid>
                <Grid item xs={5.9} marginTop="0.5rem">
                  <MDInput
                    label="Lower Limit"
                    type="number"
                    className="base-comp-no_of_answers_min .MuiInputBase-input"
                    size="small"
                    onFocus={(e) => e?.target?.value == '0' || (0 && e.target.select())}
                    fullWidth
                    onKeyPress={(e: any) => {
                      ingerNum(e)
                    }}
                    value={questionBaseCategory?.lower_limit}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.lower_limit = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                  />
                </Grid>
                <Grid item xs={5.9} marginTop="0.5rem">
                  <MDInput
                    label="Upper Limit"
                    type="number"
                    className="base-comp-no_of_answers_min .MuiInputBase-input"
                    size="small"
                    onFocus={(e) => e?.target?.value == '0' || (0 && e.target.select())}
                    fullWidth
                    onKeyPress={(e: any) => {
                      ingerNum(e)
                    }}
                    value={questionBaseCategory?.upper_limit}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.upper_limit = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                  />
                </Grid>

                <Grid item xs={2.5} marginTop={!questionBaseCategory?.auto_sum ? '0.5rem' : '1rem'}>
                  <FormControlLabel
                    sx={{ marginLeft: '0.2rem' }}
                    control={
                      <Switch
                        size="small"
                        checked={questionBaseCategory?.auto_sum}
                        onChange={(e) => {
                          let payload: any = { ...questionBaseCategory }
                          payload.auto_sum = e.target.checked
                          setQuestionBaseCategory(payload)
                        }}
                      />
                    }
                    label={<StyledLabel sx={{ paddingTop: '0rem' }}>Auto Sum</StyledLabel>}
                  />
                </Grid>
                <Grid
                  item
                  xs={9.3}
                  marginTop="0.5rem"
                  sx={{
                    display: !questionBaseCategory?.auto_sum ? 'none' : '',
                  }}
                >
                  <MDInput
                    label="Multi Sum Equal"
                    type="number"
                    className="base-comp-no_of_answers_min .MuiInputBase-input"
                    size="small"
                    onFocus={(e) => e?.target?.value == '0' || (0 && e.target.select())}
                    fullWidth
                    onKeyPress={(e: any) => {
                      ingerNum(e)
                    }}
                    value={questionBaseCategory?.multi_sum_equal}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.multi_sum_equal = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                  />
                </Grid>

                <StyledLabel
                  style={{
                    fontSize: '0.8rem',
                    paddingTop: '0.5rem',
                    paddingLeft: '0.8rem',
                    marginBottom: '-0.5rem',
                  }}
                >
                  Settings
                </StyledLabel>

                <Grid xs={6} style={{ paddingLeft: '0.8rem' }}>
                  <QuestionBaseCategory setQuestionBaseCategory={setQuestionBaseCategory} questionBaseCategory={questionBaseCategory} />
                </Grid>
              </Grid>
            </StyledEditOptionsBox>
            <StyledAnswersDivider
              isEdit={isEdit}
              sx={{
                backgroundColor: `${theme.palette.primary.dark}`,
                height: '2px',
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
                width: '98%',
              }}
            />
          </StyledContentBox>
        ) : (
          ''
        )}

        {isEdit && !collapseConf ? <QuestionNotesComponent questionBase={questionBase} setQuestionBase={setQuestionBase} isEdit={isEdit} /> : ''}
        {isEdit ? (
          <MdBox
            sx={{
              padding: '2rem 1rem 1rem 2rem',
              position: 'sticky',
              bottom: '-10px',
              zIndex: '100',
            }}
          >
            {/* <Button
              variant="outlined"
              onClick={() => {
                if (add) {
                  resetForm();
                } else {
                  dataConverter();
                  setIsEdit(false);
                }
              }}
            >
              Cancel
            </Button> */}
            <Button
              variant="contained"
              disabled={questionBase?.question_data_code == '' || questionBase?.question_data_code == '0' || !valid || loading ? true : false}
              onClick={async () => {
                let payload: any = {
                  ...questionBase,
                  ...questionBaseCategory,
                  // concept_id: selectedFileQuestionTitle ? selectedFileQuestionTitle?.id : (questionBase?.concept?.id ? questionBase?.concept?.id : null),

                }
                payload.answers = [...questionAns, ...deletedQuestionAns]

                if (valid) {
                  let check: any = await SaveQuestion(payload)
                  if (check === true) {
                    setIsEdit(false)
                  }
                }
              }}
            >
              Save
            </Button>
          </MdBox>
        ) : (
          ''
        )}
      </BoxWrapper>
    </>
  )
}

export default NumericList
