import QuestionTypeBaseComp from '@/components/question-types-base-comp'
import { useState, useEffect } from 'react'
import { QuestionAnsTypes, QuestionBaseCategoryTypes, QuestionBaseTypes, SinglePunchProps } from './single-punch-types'
import {
  BoxWrapper,
  ErrorBox,
  MDInput,
  MdBox,
  StyledAnswersDivider,
  // StyledCardAnswerText,
  StyledContentBox,
  StyledEditOptionsBox,
  StyledGridContainer,
  StyledRowGapWrapper,
  StyledRowWrapper,
  StyledTypeText,
} from './single-punch.style'
import Checkbox from '@mui/material/Checkbox'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import { IconButton, Box, Button, Typography, Tooltip, ImageList, ImageListItem, ImageListItemBar } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import QuestionBaseCategory from '@/components/question-base-category'
import Grid from '@mui/material/Grid'
import Select from '@/components/select'
import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack'
import QuestionBaseShowCodes from '@/components/question-base-show-codes'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import '../../../global.css'
import { theme } from '@/constants/theme'
import { StyledLabel } from '@/components/question-base-category/question-base-category.style'
import QuestionTypeIcon from '@/constants/questionTypeIcon'
import LockIcon from '@mui/icons-material/Lock'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import QuestionNotesComponent from '@/components/question-notes'
import { StyledCardQuestionHeadingTitle } from '@/components/question-types-base-comp/question-types-base.style'
import _ from 'lodash'
// import { logger } from '@/helpers/logger'
// import { ListService } from '@/services/list.service'
import BuilderSwitchQuestions from '@/components/builder-switch-questions/builder-switch-questions.component'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import BurstModeIcon from '@mui/icons-material/BurstMode';
import UploadModalSelect from '@/components/project-media-upload-modal-select/project-media-upload-modal-select.component'
import { FilesTypes } from '@/components/project-media-upload-modal/project-media-upload-modal.type'

import ShowConceptForAnswers from '@/components/concept-answers-show/concept-answers-show.component'

// interface ShowConceptAnswersProps {
//   answer: any;
//   index: number | null;
//   selectedFileQuestionAnswer: any;

//   questionAns: QuestionAnsTypes[];
//   setQuestionAns: React.Dispatch<React.SetStateAction<QuestionAnsTypes[]>>;
// }

// function ShowConceptForAnswers({
//   // selectedFileQuestionTitle,
//   // questionBase,
//   // setSelectedFileQuestionTitle,
//   // setQuestionBase

//   answer, index, selectedFileQuestionAnswer, questionAns, setQuestionAns
// }: ShowConceptAnswersProps) {
//   if (!answer?.concept?.file_url) {
//     return null;
//   }

//   const file = selectedFileQuestionAnswer || answer?.concept;

//   let fileType;
//   if (typeof file?.type === 'string') {
//     if (file.type.startsWith('image')) {
//       fileType = 1;
//     } else if (file.type.startsWith('video')) {
//       fileType = 2;
//     } else if (file.type.startsWith('audio')) {
//       fileType = 3;
//     }
//   } else if (answer?.concept?.type) {
//     fileType = answer.concept.type;
//   }

//   const handleDelete = () => {
//     if (index || index == 0) {
//       let payload: any[] = [...questionAns]
//       payload[index].concept_id = null
//       payload[index].concept = null
//       setQuestionAns(payload)
//     }
//   }

//   console.log(file, fileType, "file_urlfile_urlfile_urlfile_urlfile_urlfile_url");

//   return (
//     // <Grid item xs={12} spacing={0}>
//     <Tooltip title={answer?.concept?.concept_name}>
//       <div style={{ width: '30px', height: '30px', position: 'relative', display: 'inline-block' }}>
//         {fileType === 1 && (
//           <img
//             src={file.file_url}
//             alt={file.file_name}
//             loading="lazy"
//             style={{ maxHeight: "100%", objectFit: "contain", maxWidth: "100%" }}
//           />
//         )}
//         {/* {fileType === 2 && (
//           <video
//             src={file.file_url}
//             controls
//             style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
//           />
//         )}
//         {fileType === 3 && (
//           <audio
//             src={file.file_url}
//             controls
//             style={{ maxHeight: '100%', maxWidth: "100%", }}
//           />
//         )} */}

//         {fileType === 2 && (
//           <VideoLibraryIcon />
//         )}
//         {fileType === 3 && (
//           <AudiotrackIcon />
//         )}
//         <IconButton
//           // onClick={handleDelete}
//           style={{
//             position: 'absolute',
//             top: -15,
//             right: -15,
//             padding: '2px',
//             backgroundColor: 'rgba(255, 255, 255, 0.7)',

//           }}
//         >
//           <DeleteOutlineIcon onClick={() => handleDelete()} fontSize="small" color="error" style={{ height: "15px" }} />
//         </IconButton>
//         {/* <ImageListItemBar
//           title={file.concept_name}
//           position="below"
//           actionIcon={
//             <IconButton >
//               <DeleteOutlineIcon fontSize="small" color="error" />
//             </IconButton>
//           }
//         /> */}
//       </div>
//     </Tooltip>
//     // {/* // </Grid> */ }
//   );
// }
import PasteListModalComponent from '@/components/paste-list-modal/paste-list-modal.component'

const SinglePunch: React.FC<SinglePunchProps> = ({
  question,
  surveyQuestionId,
  SaveQuestion,
  add,
  editFalse,
  loading,
  setQuestionPreview,
  questionPreview,
  sortingList,
  setEditFalse,
  questionTheme,
  setQuestionCompare,

  // changesQuestionId, setChangedQuestionId,

  setSelectedQuestion,
  swapList,
  questionTypeList,

  // uploadMediaModalSelect,
  // setUploadMediaModalSelect,
  // selectedFileQuestionTitle,
  // setSelectedFileQuestionTitle,

  // uploadAnswerIndex,
  // setUploadAnswerIndex,

  // selectedFileQuestionAnswer,
  // setSelectedFileQuestionAnswer
}) => {
  const [questionBase, setQuestionBase] = useState<QuestionBaseTypes | null>(null)
  const [questionAns, setQuestionAns] = useState<QuestionAnsTypes[]>([])
  const [deletedQuestionAns, setDeletedQuestionAns] = useState<QuestionAnsTypes[]>([])
  const [questionBaseCategory, setQuestionBaseCategory] = useState<QuestionBaseCategoryTypes | null>(null)

  const [valid, setValid] = useState(false)
  const [isEdit, setIsEdit] = useState(add ? true : false)
  const [answerListSorting, setAnswerListSorting] = useState<any>([])
  const [collapseConf, setCollapseConf] = useState(false)
  // const [collapseAns, setCollapseAns] = useState(false);
  const [checkedRadios, setCheckedRadios] = useState<number | null>(null)
  const [questionObjCopy, setQuestionObjCopy] = useState<any>(null)
  const [addOption, setAddOption] = useState(false)

  // upload media

  const [uploadMediaModalSelect, setUploadMediaModalSelect] = useState(false)
  const [selectedFileQuestionTitle, setSelectedFileQuestionTitle] = useState<FilesTypes | null>(null)

  const [selectedFileQuestionAnswer, _setSelectedFileQuestionAnswer] = useState<FilesTypes | null>(null)
  const [uploadAnswerIndex, setUploadAnswerIndex] = useState<number | null>(null)

  // const [questionTypeList, setQuestionTypeList] = useState<any[]>([])

  // let listServices = new ListService()

  // const getQuestionTypes = async () => {
  //   try {
  //     let data = await listServices.question_type_list()
  //     let response = data.map((val: any) => {
  //       return {
  //         id: val.id,
  //         name: val.name,
  //       }
  //     })
  //     setQuestionTypeList(response)
  //   } catch (error) {
  //     logger.error(error)
  //   }
  // }

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
      question_name: question?.question_name ? question?.question_name : '',
      question_title: question?.question_title ? question?.question_title : '',
      question_title_formatted: question?.question_title_formatted ? question?.question_title_formatted : '',
      instructions: question?.instructions ? question?.instructions : '',
      programming_notes: question?.programming_notes ? question?.programming_notes : '',
      question_id: question?.question_id ? Number(question?.question_id) : null,
      question_category_id: question?.question_category_id ? Number(question?.question_category_id) : 1,
      question_category: question?.question_category ? question?.question_category : '',
      question_code: question?.question_code ? question?.question_code : '',
      question_type_id: question?.question_type_id ? Number(question?.question_type_id) : 1,
      question_time: question?.question_time ? question?.question_time : 0,
      question_data_code: question?.question_data_code ? question?.question_data_code : '',
      concept: question?.concept ? question?.concept : null,
    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {
      answer_sorting_order: question?.answer_sorting_order ? question?.answer_sorting_order : '',
      // no_of_rows: question?.no_of_rows,
      // no_of_rows: question?.no_of_rows ? question?.no_of_rows : 0,
      // columns: question?.no_of_columns ? question?.no_of_columns : 0,
      required_question: question?.required_question ? question?.required_question : false,
      show_codes: false,
      can_have_quota: question?.can_have_quota ? question?.can_have_quota : false,
    }

    let questionCopy: any = {
      questionBase: payload,
      questionBaseCategory: questionBaseCategoryPayload,
    }
    setQuestionBase(JSON.parse(JSON.stringify(payload)))
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

  useEffect(() => {
    dataConverter()
  }, [question])

  useEffect(() => {
    let check = questionAns && questionAns?.length > 0 && questionAns?.some((answer) => answer.question_answer_text === '')
    let checkCode = questionAns && questionAns?.length > 0 && questionAns?.some((answer) => answer.question_answer_code === '')
    let uniqueCodeCheck =
      questionAns && questionAns?.length > 0 && new Set(questionAns?.map((a) => a.question_answer_code)).size !== questionAns?.length

    if (
      // questionBase?.question_data_code !== '' &&
      //   questionBase?.question_data_code !== '0' &&
      surveyQuestionId
        ? questionBase?.question_title_formatted !== '' &&
        check === false &&
        checkCode === false &&
        uniqueCodeCheck === false &&
        questionAns?.length > 0 &&
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
        //questionBase?.instructions !== "" &&
        questionBase?.question_category_id !== null &&
        questionBase?.question_type_id !== null
    ) {
      setValid(true)
    } else {
      setValid(false)
    }
  }, [questionAns, questionBase])

  console.log(questionBase, questionBase?.question_data_code, valid, 'questionBase?.question_data_codequestionBase?.question_data_code')

  const resetForm = () => {
    let payload: QuestionBaseTypes | null = {
      question_name: '',
      question_title: '',
      question_title_formatted: '',
      description: '',
      programming_notes: '',
      question_id: null,
      question_category_id: 1,
      question_category: '',
      question_code: '',
      question_type_id: 1,
      instructions: '',
      question_time: 30,

      question_data_code: '',
      concept: null,
    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {
      answer_sorting_order: 2,
      // no_of_rows: 0,
      // columns: 0,
      required_question: true,
      show_codes: false,
      can_have_quota: true,
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

  useEffect(() => {
    if (isEdit && setQuestionPreview && !questionPreview) {
      let obj = {
        questionBase: JSON.parse(JSON.stringify(questionBase)),
        questionBaseCategory: JSON.parse(JSON.stringify(questionBaseCategory)),
        questionAns: JSON.parse(JSON.stringify(questionAns)),
      }
      setQuestionPreview(obj)
    }
  }, [questionBase, questionBaseCategory, questionAns])

  useEffect(() => {
    if (!isEdit && questionPreview && !setQuestionPreview) {
      setQuestionAns(questionPreview?.questionAns)
      setQuestionBaseCategory(JSON.parse(JSON.stringify(questionPreview?.questionBaseCategory)))
      setQuestionBase(JSON.parse(JSON.stringify(questionPreview?.questionBase)))
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

  // useEffect(() => {
  //   getQuestionTypes()
  // }, [])

  // console.log(questionTypeList, 'questionTypeListquestionTypeList', question, questionBase, questionBaseCategory, questionAns)

  const addOptionClose = () => {
    setAddOption(false)
  }

  const handleGetList = (value: string[]) => {
    let options = value.filter((val: string) => val !== '')
    let greaterNumber = questionAns.length > 0 ? Math.max(...questionAns.map((ans) => Number(ans.question_answer_code))) : 0
    let finalPayload = options.map((option, i) => {
      return {
        question_answer_id: '',
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
      <UploadModalSelect
        open={uploadMediaModalSelect}
        onClose={() => {
          setUploadMediaModalSelect(false)
          setUploadAnswerIndex(null)
        }}
        // selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
        // selectedFileQuestionAnswer={selectedFileQuestionAnswer} setSelectedFileQuestionAnswer={setSelectedFileQuestionAnswer}
        uploadAnswerIndex={uploadAnswerIndex}
        setUploadAnswerIndex={setUploadAnswerIndex}
        questionAns={questionAns}
        setQuestionAns={setQuestionAns}
        questionBase={questionBase}
        setQuestionBase={setQuestionBase}
      />
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
                    width: '98%',
                  }}
                >
                  <Stack direction="row" alignItems="center ">
                    <QuestionTypeIcon typeId={1} />
                    {/*  */}
                    <BuilderSwitchQuestions setSelectedQuestion={setSelectedQuestion} swapList={swapList} questionTypeList={questionTypeList} />
                    {/* <Tooltip
                      placement="right"
                      title=''
                    // title={
                    //   sections.find((val) => val?.questions.find((value) => value?.question_id === -1))
                    //     ? 'Please Save Exisiting Question'
                    //     : sections.find((val) => val.section_id === -1)
                    //       ? 'Please Save Exisiting Section'
                    //       : ''
                    // }
                    >
                      <Box
                        sx={{
                          // display: hideSection ? 'none' : '',
                        }}
                      >
                       
                        <IconButton style={{ margin: "0rem 0rem 0rem 0.5rem" }}>

                          <img src={ArrowUp}
                            onClick={(e: any) => {
                              e.stopPropagation()
                              handleClick(e)
                            }}
                          />
                        </IconButton>

                        <Menu
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >

                          {questionTypeList?.map((value: any, i) => (
                            <MenuItem
                              key={i}
                              sx={{
                                // display:
                                //   selectedSection === null
                                //     ? 'none'
                                //     : '' || selectedSection?.questions.find((val: any) => val?.question_id === -1)
                                //       ? 'none'
                                //       : '',
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                let payload: any = {
                                  question_type_id: 2,
                                  question_code: questionBase?.question_code,
                                  question_name: questionBase?.question_name,
                                  question_title_formatted: questionBase?.question_title_formatted,
                                  question_title: questionBase?.question_title,
                                  question_id: questionBase?.question_id,
                                  instructions: questionBase?.instructions,
                                  programming_notes: questionBase?.programming_notes,
                                  question_category: questionBase?.question_category,
                                  question_category_id: questionBase?.question_category_id,
                                  question_time: questionBase?.question_time,

                                  // required_question: true,
                                  // answer_sorting_order: 1,
                                  // answers: [
                                  //   {
                                  //     question_answer_code: 1,
                                  //     question_answer_text: '',
                                  //     is_active: true,
                                  //   },
                                  //   {
                                  //     question_answer_code: 2,
                                  //     question_answer_text: '',
                                  //     is_active: true,
                                  //   },
                                  // ],
                                  // prompt_answer: [],
                                }
                                // setQuestionBase(payload)
                                setChangedQuestionId(2)
                                // let sectionPayload = [...sections]
                                // sectionPayload.map((val) => {
                                //   if (selectedSection.section_id === val.section_id) {
                                //     val.questions.push(payload)
                                //   }
                                //   return val
                                // })
                                // let questionSelect: any = selectedSection.questions[selectedSection.questions.length - 1]
                                // setQuestionPreview(null)
                                // setSelectedQuestion(null)
                                // setSubOpen(null)
                                // setSubQuestion(null)

                                // setTimeout(() => {
                                //   setSections(sectionPayload)
                                //   setSectionAdd(false)
                                //   setQuestionEdit(true)
                                //   setSelectedQuestion(questionSelect)
                                //   handleClose()
                                // }, 100)
                                handleClose()
                              }}
                            >
                              <QuestionTypeIcon typeId={Number(value.id)} />
                              {'  '}&nbsp;
                              <Typography variant="caption">{value.name}</Typography>
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                    </Tooltip> */}
                    <StyledTypeText display="flex" alignItems="center" flexDirection="row" style={{ gap: '1rem' }}>
                      {/* <span> {questionBase?.question_code}. </span> */}
                      {/* <span
                        dangerouslySetInnerHTML={{
                          __html: questionBase?.question_name
                            ? questionBase?.question_name
                            : "",
                        }}
                      ></span> */}
                      {/* <Grid item xs={12}> */}
                      <StyledCardQuestionHeadingTitle>
                        <MDInput
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
                        <MDInput
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
          //           <QuestionTypeIcon typeId={1} />
          //           <StyledTypeText
          //             display="flex"
          //             alignItems="center"
          //             flexDirection="row"
          //             sx={{ fontSize: "1rem", fontWeight: 700 }}
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

        <QuestionTypeBaseComp
          questionBase={questionBase}
          setQuestionBase={setQuestionBase}
          isEdit={isEdit}
          questionTheme={questionTheme}
          uploadMediaModalSelect={uploadMediaModalSelect}
          setUploadMediaModalSelect={setUploadMediaModalSelect}
          selectedFileQuestionTitle={selectedFileQuestionTitle}
          setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
          loading={loading}
          uploadAnswerIndex={uploadAnswerIndex}
          setUploadAnswerIndex={setUploadAnswerIndex}
        />

        {isEdit ? (
          <StyledRowGapWrapper sx={{ padding: '0rem', width: '100%', display: surveyQuestionId ? '' : 'none' }}>
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

              {/* <Stack direction="row"> */}
              <Button
                size="small"
                onClick={() => {
                  setAddOption(true)
                }}
              >
                +Add Options.
              </Button>
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              {/* </Stack> */}
            </Stack>
          </StyledRowGapWrapper>
        ) : null}

        {isEdit ? (
          <StyledContentBox sx={{ display: surveyQuestionId ? '' : 'none' }}>
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
                                  <Stack className="configuration-box-sub-drop-icon-stack ">{/* <img src={CardsDragnDropIcon} /> */}</Stack>
                                  {/* <FormControlLabel
                                  style={{ marginRight: "0rem" }}
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
                                      width: questionBaseCategory?.show_codes ? '25%' : '90% !important',
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
                                      sx={{ width: '80%' }}
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
                                    <ShowConceptForAnswers
                                      answer={answer}
                                      index={index}
                                      selectedFileQuestionAnswer={selectedFileQuestionAnswer}
                                      setQuestionAns={setQuestionAns}
                                      questionAns={questionAns}
                                    />
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
                                    </>
                                  ) : null}
                                  {questionBaseCategory?.show_codes ? (
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
                                  ) : null}
                                  {questionBaseCategory?.show_codes ? (
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
                                  ) : null}
                                  <Box style={{ marginLeft: '0.8rem' }}>
                                    <Tooltip title={''} placement="left">
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
                                      // debugger;
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
                control={<Checkbox size="small" color="secondary" disabled />}
                label={""}
              /> */}
              <Checkbox size="small" color="secondary" disabled />
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
                  .map((answer, ind) => (
                    // <StyledCardAnswerText key={ind} style={{ display: 'flex', alignItems: 'start' }}>
                    <ImageListItem key={ind} style={{
                      display: "flex", alignItems: "start", gap: "0.5rem", flexDirection: questionAns.some((item) => item?.concept?.file_url) ? 'column' : 'row'
                    }}>
                      < Radio
                        checked={checkedRadios === Number(ind)}
                        onChange={() => {
                          setCheckedRadios(Number(ind))
                        }}
                        sx={{
                          '& .MuiSvgIcon-root': { fontSize: 18 },
                          height: '16px',
                          marginTop: '0.4rem',
                          // marginBottom: "0.4rem",
                          padding: "0px !important",
                          color: questionTheme?.controls.unselected,
                          '&.Mui-checked': {
                            color: questionTheme?.controls.selected,
                          },
                        }}
                        size="small"
                      />
                      <ImageListItemBar
                        sx={{
                          background: 'transparent'
                        }}


                      />
                      {/* <Radio
                        checked={checkedRadios === Number(ind)}
                        onChange={() => {
                          setCheckedRadios(Number(ind))
                        }}
                        sx={{
                          '& .MuiSvgIcon-root': { fontSize: 18 },
                          height: '16px',
                          marginTop: '0.4rem',
                          color: questionTheme?.controls.unselected,
                          '&.Mui-checked': {
                            color: questionTheme?.controls.selected,
                          },
                        }}
                        size="small"
                      /> */}
                      <span>
                        {answer?.concept ? (
                          <ShowConceptForAnswers
                            answer={answer}
                            index={null}
                            hide={true}
                            selectedFileQuestionAnswer={selectedFileQuestionAnswer}
                            setQuestionAns={setQuestionAns}
                            questionAns={questionAns}
                          />
                        ) : null}
                      </span>
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


                        {answer.add_other_option ? (
                          <MDInput
                            disabled
                            // sx={{ paddingLeft: '10px' }}
                            variant="standard"
                            value="Specify other"
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
                    </ImageListItem>
                    // {/* </StyledCardAnswerText> */ }
                  ))}
            </ImageList>
          </StyledContentBox>
        )}
        {/* <StyledAnswersDivider
          isEdit={isEdit}
          sx={{
            display: collapseAns ? "none" : "",
            backgroundColor: `${theme.palette.primary.dark}`,
            height: "2px",
            width: "98%"
          }}
        /> */}

        {isEdit ? (
          <StyledContentBox className="configuration-box" sx={{ marginBottom: '0rem' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              // marginTop="0.5rem"
              display={isEdit ? 'flex' : 'none'}
              sx={{
                // borderBottom: collapseConf
                //   ? `2px solid ${theme.palette.primary.dark}`
                //   : "",
                marginBottom: '0.5rem',
                // marginBottom: !collapseConf ? "0.5rem" : "",
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
              <StyledGridContainer container spacing={2} sx={{ padding: '0px' }}>
                <Grid item xs={11.8}>
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
                    // register={register as any}
                    isRequired={true}
                    size="small"
                  />
                </Grid>
                <StyledLabel
                  style={{
                    fontSize: '0.8rem',
                    paddingLeft: '1.3rem',
                    marginBottom: '-1rem',
                  }}
                >
                  Settings
                </StyledLabel>
                <Grid
                  container
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingLeft: '0.5rem',
                  }}
                >
                  <Grid xs={5} style={{ marginLeft: '0.95rem', marginBottom: '-1rem' }}>
                    <QuestionBaseCategory setQuestionBaseCategory={setQuestionBaseCategory} questionBaseCategory={questionBaseCategory} />
                  </Grid>
                  <Grid xs={5}>
                    <FormControlLabel
                      sx={{ marginLeft: '1rem' }}
                      control={
                        <Switch
                          size="small"
                          sx={{ marginTop: '5px' }}
                          checked={questionBaseCategory?.can_have_quota ? true : false}
                          color="primary"
                          onChange={(e) => {
                            let payload: any = { ...questionBaseCategory }
                            payload.can_have_quota = e.target.checked
                            setQuestionBaseCategory(payload)
                          }}
                        />
                      }
                      label={<StyledLabel>Can have Quota</StyledLabel>}
                    />
                  </Grid>
                </Grid>
              </StyledGridContainer>
            </StyledEditOptionsBox>
            <StyledAnswersDivider
              isEdit={isEdit}
              sx={{
                // display: collapseConf ? "none" : "",
                backgroundColor: `${theme.palette.primary.dark}`,
                height: '2px',
                width: '98%',
                marginBottom: '0.5rem',
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
              padding: '1rem 1rem 1rem 2rem',
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

export default SinglePunch
