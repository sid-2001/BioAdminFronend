import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd'
import { SectionsQuestionsListComponentProps } from './sections-questions-list.type'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { theme } from '@/constants/theme'
import { styled } from '@mui/material/styles'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
} from '@mui/material'
import { Question, Section } from '@/types/survey-builder.type'
import QuestionTypeIcon from '@/constants/questionTypeIcon'
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SouthIcon from '@mui/icons-material/South'
import { Deactivate } from '@/assets/images'
import { ProjectService } from '@/services/projects.service'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import FolderIcon from '@mui/icons-material/Folder'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddIcon from '@mui/icons-material/Add'
import LoadingSpinner from '../loader'
import { QuestionValidator } from './validator'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const SectionsQuestionsListComponent = (props: SectionsQuestionsListComponentProps) => {
  let {
    setquestionError,
    sections,
    selectedSection,
    selectedQuestion,
    setSectionAdd,
    setSections,
    setSelectedQuestion,
    setQuestionEdit,
    setSelectedSection,
    setSectionDelete,
    setQuestionPreview,
    preview,
    scrollToElement,
    setQuestionSoftDelete,
    setQuestionDelete,
    getProjectTemplate,
    setThreadOpen,
    setSectionSoftDelete,
    questionCompare,
    setQuestionCompare,
    setSubQuestion,
    subQuestion,
    setSubOpen,
    subOpen,
    setQuestionSubDelete,
    setSubAdd,
    // subAdd,
    sectionCompare,
    setSectionCompare,

    // setSelectedFileQuestionTitle,
  } = props

  const matches = useMediaQuery('(max-width:1800px)')
  const [questionDiscard, setQuestionDiscard] = useState<Question | null>(null)
  const [sectionDiscard, setSectionDiscard] = useState<Section | null>(null)
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  let projectService = new ProjectService()
  let { projectId, surveyId } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  let isError = false

  const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ }) => ({
    border: `1px solid #FFF`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }))

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={
        <SouthIcon
          sx={{
            fontSize: '1.5rem',
          }}
        />
      }
      {...props}
    />
  ))(({ theme }) => ({
    // padding: "0.1rem",
    background: 'white',
    justifyContent: 'space-between',
    borderRadius: '0.8rem',
    minHeight: '0px !important',

    // "& .css-1jbdj9q-MuiStack-root>:not(style)~:not(style)": {
    //   display: "none",
    // },
    '& .MuiAccordionSummary-expandIconWrapper': {
      display: 'none !important',
      // marginTop: "-2.3rem",
      color: theme.palette.primary.main,
    },
    '&:hover': {
      background: theme.palette.grey[200],
      // "& .css-1jbdj9q-MuiStack-root>:not(style)~:not(style)": {
      //   display: "unset",
      // },
      // "& .MuiAccordionSummary-expandIconWrapper": {
      //   display: "unset !important",
      //   color: theme.palette.primary.main,
      // },
    },

    // "& .delete-icon": {
    //   display: "none", // Hide the delete icon by default
    // },
    // "&:hover": {
    //   // ... existing hover styles ...

    //   "& .delete-icon": {
    //     display: "unset", // Show the delete icon on hover
    //   },
    // }

    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      // transform: "rotate(180deg)",
      // display: "unset !important",
      // color: theme.palette.primary.main,
      // marginTop: "-2.7rem",
    },
    // "& .MuiAccordionSummary-content": {
    //   marginLeft: theme.spacing(1),
    // },
  }))

  const AccordionDetails = styled(MuiAccordionDetails)(({ }) => ({
    padding: '5px 0px 5px 8px',

    // Hide the deactivate icon by default
    '& .deactivate-icon-wrapper': {
      display: 'none',
    },

    // Show the deactivate icon on hover
    '&:hover': {
      '& .deactivate-icon-wrapper': {
        display: 'block', // Change to 'flex', 'inline', etc., as per your layout
      },
    },
  }))

  const StackStyled = styled(Stack)(({ }) => ({
    // Hide the deactivate icon by default in each question item
    '& .question-item .deactivate-icon-wrapper': {
      display: 'none',
    },

    // Show the deactivate icon only on hover of each individual question item
    '& .question-item:hover .deactivate-icon-wrapper': {
      display: 'block', // Or 'flex', 'inline', etc., as per your layout
    },
  }))

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination } = result
    if (!destination) {
      return
    }
    const reorderedSections = Array.from(sections)
    const [moved] = reorderedSections.splice(result.source.index, 1)
    reorderedSections.splice(Number(result && result.destination && result?.destination?.index), 0, moved)

    const updatedAnswers = reorderedSections.map((section, index) => ({
      ...section,
      section_sort_order: index + 1,
    }))
    await setSections(updatedAnswers)
    SectionSortOrder(updatedAnswers)
  }

  const handleChange = (panel: any) => {
    setSectionAdd(false)
    setSelectedSection(panel)
  }

  const onDragQuestionEnd = async (result: DropResult) => {
    const { destination } = result
    if (!destination) {
      return
    }
    const reorderedSections = Array.from(selectedSection?.questions ? selectedSection?.questions : [])
    const [moved] = reorderedSections.splice(result.source.index, 1)
    reorderedSections.splice(Number(result && result.destination && result?.destination?.index), 0, moved)
    const updatedAnswers = reorderedSections.map((question, index) => ({
      ...question,
      sorting_order: index + 1,
    }))
    let payload: any = { ...selectedSection }
    if (payload) {
      payload.questions = updatedAnswers
      let sectionData: Section[] = sections.map((section) => {
        if (payload?.section_id === section?.section_id) {
          section = payload
        }
        return section
      })
      await setSections(sectionData)
      QuestionSortOrder(payload)
    }
  }

  const onDragSubQuestionEnd = async (result: DropResult) => {
    const { destination } = result
    if (!destination) {
      return
    }
    const reorderedSubQuestions = Array.from(selectedQuestion?.sub_questions ? selectedQuestion?.sub_questions : [])
    const [moved] = reorderedSubQuestions.splice(result.source.index, 1)
    reorderedSubQuestions.splice(Number(result && result.destination && result?.destination?.index), 0, moved)
    const updatedAnswers = reorderedSubQuestions.map((question, index) => ({
      ...question,
      child_sort_order: index + 1,
    }))
    let payload: any = { ...selectedQuestion }
    payload.sub_questions = updatedAnswers
    let localSections: any = sections.map((section) => {
      if (section.section_id === selectedSection?.section_id) {
        section.questions.map((question) => {
          if (question.question_id === selectedQuestion?.question_id) {
            question.sub_questions = updatedAnswers
          }
          return question
        })
      }
      return section
    })
    await setSections(localSections)
    SubQuestionSortOrder(payload)
  }

  const SectionSortOrder = async (sectionData: Section[]) => {
    setLoading(true)
    let obj = sectionData.map((section) => {
      return {
        section_id: Number(section.section_id),
        sort_order: Number(section.section_sort_order),
      }
    })
    if (projectId && surveyId)
      try {
        await projectService.sort_project_builder_section(obj, String(projectId), Number(surveyId))
        getProjectTemplate()
        enqueueSnackbar('Sections sort successfully', {
          variant: 'success',
        })
        setLoading(false)
      } catch (e) {
        console.log(e)
        enqueueSnackbar('Oops somthing went wrong !!', {
          variant: 'error',
        })
        setLoading(false)
      }
  }

  const QuestionSortOrder = async (sectionData: Section) => {
    setLoading(true)
    let obj = sectionData.questions.map((question: Question) => {
      return {
        question_id: Number(question.question_id),
        sort_order: Number(question.sorting_order),
      }
    })
    if (projectId && surveyId)
      try {
        await projectService.sort_project_builder_question(obj, String(projectId), Number(surveyId), String(sectionData.section_id))
        getProjectTemplate()
        enqueueSnackbar('Questions sort successfully', {
          variant: 'success',
        })
        setLoading(false)
      } catch (e) {
        console.log(e)
        enqueueSnackbar('Oops somthing went wrong !!', {
          variant: 'error',
        })
        setLoading(false)
      }
  }

  const SubQuestionSortOrder = async (questionData: Question) => {
    setLoading(true)
    let obj: any =
      questionData?.sub_questions &&
      questionData?.sub_questions.map((question: Question) => {
        return {
          question_id: Number(question.question_id),
          parent_id: Number(selectedQuestion?.question_id),
          child_sort_order: Number(question?.child_sort_order),
        }
      })
    if (projectId && surveyId)
      try {
        await projectService.sort_project_builder_sub_question(obj, String(projectId), Number(surveyId), String(selectedSection?.section_id))
        getProjectTemplate()
        enqueueSnackbar('Questions sort successfully', {
          variant: 'success',
        })
        setLoading(false)
      } catch (e) {
        console.log(e)
        enqueueSnackbar('Oops somthing went wrong !!', {
          variant: 'error',
        })
        setLoading(false)
      }
  }

  const handleClose = () => {
    setOpen(false)
    setSectionModalOpen(false)
    setSectionDiscard(null)
    setQuestionDiscard(null)
  }

  useEffect(() => {
    if (questionDiscard) {
      setOpen(true)
    }
    if (sectionDiscard) {
      setSectionModalOpen(true)
    }
  }, [questionDiscard, sectionDiscard])

  const handleSectionModal = () => {
    if (selectedSection?.section_id === -1) {
      let sectionPayload = sections.filter((val) => val.section_id !== selectedSection?.section_id)
      setSections(sectionPayload)
    }

    setSectionAdd(false)
    setSelectedQuestion(null)
    setQuestionEdit(false)
    handleChange(sectionDiscard)
    setSectionCompare(false)
    setSectionDiscard(null)
    setQuestionDiscard(null)
    setSubOpen(null)
    setSubQuestion(null)
    handleClose()
  }

  function findDuplicateValuesForKey(arr: any, keyName: string) {
    const valueMap = new Map()
    const duplicateValues: any = []

    // Iterate through the array of objects
    arr.forEach((obj: any) => {
      const value = obj[keyName]
      if (!valueMap.has(value)) {
        // If the value is not in the map, add it
        valueMap.set(value, true)
      } else {
        // If the value is already in the map, it's a duplicate
        duplicateValues.push(value)
      }
    })

    return duplicateValues
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      <Dialog open={open || sectionModalOpen} maxWidth="sm" fullWidth>
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h6">Confirm</Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography fontSize="15px" fontWeight="400">
              You have unsaved changes?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (sectionModalOpen) {
                handleSectionModal()
              } else {
                if (subOpen && questionDiscard?.parent_id === selectedQuestion?.question_id) {
                  setQuestionPreview(null)
                  setSubQuestion(null)
                  setTimeout(() => {
                    setSubQuestion(questionDiscard)
                  }, 150)
                  setSectionAdd(false)
                  if (preview) {
                    scrollToElement(String(questionDiscard?.question_title))
                  }
                  setThreadOpen(false)
                  setOpen(false)
                  setQuestionDiscard(null)
                } else {
                  if (selectedQuestion?.question_id === -1) {
                    let sectionPayload: Section[] = [...sections]
                    sectionPayload.map((val) => {
                      if (selectedSection?.section_id === val.section_id) {
                        let questionsData = val.questions.filter((ques) => selectedQuestion?.question_id !== ques?.question_id)
                        val.questions = questionsData
                      }
                      return val
                    })
                    setSections(sectionPayload)
                  }
                  setQuestionPreview(null)
                  setSelectedQuestion(null)
                  setTimeout(() => {
                    setSelectedQuestion(questionDiscard)
                  }, 150)
                  setSectionAdd(false)
                  scrollToElement(String(questionDiscard?.question_title))
                  setThreadOpen(false)
                  setOpen(false)
                  setQuestionDiscard(null)
                  setSubOpen(null)
                  setSubQuestion(null)
                }
              }
            }}
            variant="contained"
          >
            Discard
          </Button>
        </DialogActions>
      </Dialog>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: '100%' }}>
              {sections?.map((section: any, index: number) => {
                let checkValidation = section.questions.some((val: any) => QuestionValidator(val).check)
                if (checkValidation == true) {
                  isError = true
                }

                let checkQuesUniqueCode = findDuplicateValuesForKey(section.questions, 'question_data_code')
                if (checkValidation == true || checkQuesUniqueCode.length > 0) {
                  isError = true
                }
                setquestionError(isError)
                return (
                  <Draggable
                    key={String(section.section_id)}
                    draggableId={String(section.section_id)}
                    index={index}
                    isDragDisabled={selectedSection === null ? false : true}
                  >
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Accordion
                          key={section.section_id}
                          expanded={selectedSection?.section_id === section.section_id}
                          onChange={() => {
                            if (sectionCompare && selectedSection !== null && selectedSection?.section_id !== section.section_id) {
                              setSectionDiscard(section)
                            } else {
                              if (selectedSection?.section_id === section.section_id) {
                                setSectionAdd(false)
                                setSelectedQuestion(null)
                                setQuestionEdit(false)
                                setSelectedSection(null)
                              } else {
                                setSectionAdd(false)
                                setSelectedQuestion(null)
                                setQuestionEdit(false)
                                handleChange(section)
                              }
                              setThreadOpen(false)
                              setQuestionCompare(false)
                              setQuestionDiscard(null)
                              setSubQuestion(null)
                              setSubOpen(null)
                            }
                          }}
                        >
                          <AccordionSummary
                            sx={{
                              background: selectedSection?.section_id === section.section_id ? theme.palette.grey[200] : '',
                            }}
                          >
                            <Stack spacing={0} width="100%">
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                width="100%"
                                justifyContent="space-between"
                                sx={{ position: 'relative' }}
                              >
                                <Stack spacing={1} direction="row" alignItems="center">
                                  {selectedSection?.section_id === section.section_id ? (
                                    <FolderIcon
                                      sx={{
                                        color: theme.palette.primary.main,
                                      }}
                                    />
                                  ) : (
                                    <FolderOutlinedIcon
                                      sx={{
                                        color: theme.palette.primary.main,
                                      }}
                                    />
                                  )}
                                  <Tooltip title={section.section_name?.length > (matches ? 25 : 30) ? section.section_name : null} placement="right">
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                      {truncateText(
                                        section.section_name ? section.section_name : '',
                                        matches ? 25 : selectedSection === null ? 30 : 30,
                                      )}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <InfoOutlinedIcon
                                    color="error"
                                    fontSize="small"
                                    sx={{
                                      padding: '0px',
                                      display: checkValidation || checkQuesUniqueCode.length > 0 ? '' : 'none',
                                    }}
                                  />
                                  <img
                                    src={Deactivate}
                                    color="error"
                                    onClick={() => {
                                      if (section.section_id === -1) {
                                        setSectionSoftDelete(true)
                                      } else {
                                        setTimeout(() => {
                                          handleChange(section)
                                          setSectionDelete(true)
                                        }, 100)
                                      }
                                    }}
                                  />
                                </Stack>
                              </Stack>
                            </Stack>
                          </AccordionSummary>

                          <DragDropContext onDragEnd={onDragQuestionEnd}>
                            <Droppable droppableId="questions">
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: '100%' }}>
                                  <AccordionDetails>
                                    <Stack spacing={1}>
                                      {section?.questions?.map((question: Question, ind: number) => (
                                        <Draggable
                                          key={String(question.question_id)}
                                          draggableId={String(question.question_id)}
                                          index={ind}
                                          isDragDisabled={subOpen ? true : false}
                                        >
                                          {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                              <StackStyled
                                                className={`question-item`}
                                                key={question.question_id}
                                                onClick={() => {
                                                  if (
                                                    ((questionCompare && selectedQuestion?.question_id === question?.question_id) ||
                                                      questionCompare === false) &&
                                                    (selectedQuestion?.question_id === question?.question_id ||
                                                      selectedQuestion?.question_id !== -1) &&
                                                    selectedSection?.questions?.find((item) => item?.question_id == selectedQuestion?.question_id)
                                                      ?.question_type_id == selectedQuestion?.question_type_id
                                                  ) {
                                                    setSubQuestion(null)
                                                    if (selectedQuestion === null || selectedQuestion.question_id !== question.question_id) {
                                                      if (question.question_type_id !== 17) {
                                                        setSubOpen(null)
                                                      } else {
                                                        setSubOpen(question?.question_id)
                                                      }
                                                      setQuestionPreview(null)
                                                      setSectionAdd(false)
                                                      setSelectedQuestion(null)
                                                      if (preview) {
                                                        scrollToElement(question.question_title)
                                                      }
                                                      setTimeout(() => {
                                                        setSelectedQuestion(question)
                                                      }, 100)
                                                    }
                                                    setThreadOpen(false)
                                                  } else {
                                                    setQuestionDiscard(question)
                                                  }
                                                }}
                                                justifyContent="center"
                                                padding="0.3rem"
                                                sx={{
                                                  background:
                                                    selectedQuestion?.question_id === question.question_id
                                                      ? 'linear-gradient(98deg,rgb(198, 167, 254),rgb(145, 85, 253) 94%)'
                                                      : '',

                                                  borderRadius: '6px',
                                                  position: 'relative',
                                                  color: selectedQuestion?.question_id === question.question_id ? 'white' : '',
                                                  '&:hover': {
                                                    cursor: 'pointer',
                                                    background: selectedQuestion?.question_id !== question.question_id ? theme.palette.grey[100] : '',
                                                  },
                                                }}
                                              >
                                                <Tooltip
                                                  title={
                                                    checkQuesUniqueCode.includes(question.question_data_code)
                                                      ? 'Question code should be unique'
                                                      : QuestionValidator(question).validText
                                                  }
                                                >
                                                  <InfoOutlinedIcon
                                                    color="error"
                                                    fontSize="small"
                                                    sx={{
                                                      padding: '0px',
                                                      display:
                                                        checkQuesUniqueCode.includes(question.question_data_code) || QuestionValidator(question).check
                                                          ? ''
                                                          : 'none',
                                                      position: 'absolute',
                                                      right: question?.question_type_id !== 17 ? 35 : question.question_id === -1 ? 35 : 95,
                                                      top: 7,
                                                    }}
                                                  />
                                                </Tooltip>
                                                <IconButton
                                                  sx={{
                                                    padding: '0px',
                                                    position: 'absolute',
                                                    right: 60,
                                                    top: 5,
                                                    display: question?.question_type_id !== 17 || question.question_id === -1 ? 'none' : '',
                                                  }}
                                                  onClick={() => {
                                                    setSubAdd(true)
                                                  }}
                                                >
                                                  <AddIcon
                                                    sx={{
                                                      color: selectedQuestion?.question_id === question.question_id ? 'white' : '',
                                                    }}
                                                  />
                                                </IconButton>
                                                <KeyboardArrowDownIcon
                                                  onClick={(e) => {
                                                    e.preventDefault()
                                                    if (subOpen === null) {
                                                      setSubOpen(question.question_id)
                                                    } else {
                                                      setSubOpen(null)
                                                    }
                                                  }}
                                                  style={{
                                                    position: 'absolute',
                                                    right: 30,
                                                    top: 5,
                                                    transform: subOpen === question.question_id ? 'rotate(180deg)' : '',
                                                    display: question?.question_type_id !== 17 || question.question_id === -1 ? 'none' : '',
                                                  }}
                                                />
                                                <img
                                                  src={Deactivate}
                                                  style={{
                                                    position: 'absolute',
                                                    right: 10,
                                                    top: 10,
                                                  }}
                                                  onClick={() => {
                                                    if (question.question_id === -1) {
                                                      setQuestionSoftDelete(true)
                                                    } else {
                                                      setQuestionDelete(true)
                                                    }
                                                  }}
                                                />
                                                <Stack spacing={0.3} direction="row" alignItems="center">
                                                  <QuestionTypeIcon typeId={Number(question?.question_type_id)} />
                                                  <Stack
                                                    spacing={0.2}
                                                    width="100%"
                                                    sx={{
                                                      boxSizing: 'border-box',
                                                    }}
                                                  >
                                                    {/* <span
                                                      dangerouslySetInnerHTML={{
                                                        __html: question?.question_name
                                                          ? truncateText(question.question_name ? question.question_name : '', matches ? 15 : 25)
                                                          : '', */}
                                                    <Typography
                                                      variant="body1"
                                                      sx={{
                                                        fontSize: '12px',
                                                        lineHeight: '18px',
                                                        fontWeight: 500,
                                                      }}
                                                      width={'70%'}
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          question?.question_name || question.question_data_code
                                                            ? truncateText(
                                                              question.question_data_code
                                                                ? `${question.question_data_code}.${question.question_name ? question.question_name : ''
                                                                }`
                                                                : '',
                                                              matches
                                                                ? question?.question_type_id === 17
                                                                  ? QuestionValidator(question).check ||
                                                                    checkQuesUniqueCode.includes(question.question_data_code)
                                                                    ? 12
                                                                    : 15
                                                                  : 18
                                                                : question?.question_type_id === 17
                                                                  ? QuestionValidator(question).check ||
                                                                    checkQuesUniqueCode.includes(question.question_data_code)
                                                                    ? 10
                                                                    : 20
                                                                  : 25,
                                                            )
                                                            : '',
                                                      }}
                                                    >
                                                      {/* <span></span>. */}
                                                      {/* <span
                                                        dangerouslySetInnerHTML={{
                                                          __html: question?.question_name
                                                            ? truncateText(question.question_name ? question.question_name : '', matches ? 15 : 25)
                                                            : '',
                                                        }}
                                                      ></span> */}
                                                    </Typography>
                                                  </Stack>
                                                </Stack>
                                              </StackStyled>
                                              <DragDropContext onDragEnd={onDragSubQuestionEnd}>
                                                <Droppable droppableId="subQuestions">
                                                  {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: '100%' }}>
                                                      {question.sub_questions?.map((questionVal, subIndex) => {
                                                        return (
                                                          <Draggable
                                                            key={String(questionVal.question_id)}
                                                            draggableId={String(questionVal.question_id)}
                                                            index={subIndex}
                                                          >
                                                            {(provided) => (
                                                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <StackStyled
                                                                  className={`question-item`}
                                                                  key={questionVal.question_id}
                                                                  onClick={() => {
                                                                    if (questionCompare === false) {
                                                                      if (
                                                                        subQuestion === null ||
                                                                        subQuestion.question_id !== questionVal.question_id
                                                                      ) {
                                                                        setQuestionPreview(null)
                                                                        setSubQuestion(null)
                                                                        if (preview) {
                                                                          scrollToElement(questionVal.question_title)
                                                                        }
                                                                        setTimeout(() => {
                                                                          setSelectedQuestion(question)
                                                                          setSubQuestion(questionVal)
                                                                        }, 100)
                                                                        setSectionAdd(false)
                                                                      }
                                                                      setThreadOpen(false)
                                                                    } else {
                                                                      setQuestionDiscard(questionVal)
                                                                    }
                                                                  }}
                                                                  justifyContent="center"
                                                                  padding="0.3rem"
                                                                  sx={{
                                                                    marginLeft: '5px',
                                                                    marginTop: '8px',
                                                                    display: subOpen === question.question_id ? '' : 'none',
                                                                    background:
                                                                      subQuestion?.question_id === questionVal.question_id
                                                                        ? 'linear-gradient(98deg,rgb(198, 167, 254),rgb(145, 85, 253) 94%)'
                                                                        : '',

                                                                    borderRadius: '6px',
                                                                    position: 'relative',
                                                                    color: subQuestion?.question_id === questionVal.question_id ? 'white' : '',
                                                                    '&:hover': {
                                                                      cursor: 'pointer',
                                                                      background:
                                                                        subQuestion?.question_id !== questionVal.question_id
                                                                          ? theme.palette.grey[100]
                                                                          : '',
                                                                    },
                                                                  }}
                                                                >
                                                                  <img
                                                                    src={Deactivate}
                                                                    style={{
                                                                      position: 'absolute',
                                                                      right: 10,
                                                                      top: 10,
                                                                    }}
                                                                    onClick={() => {
                                                                      setQuestionSubDelete(true)
                                                                    }}
                                                                  />
                                                                  <Stack spacing={0.3} direction="row" alignItems="center">
                                                                    <QuestionTypeIcon typeId={Number(questionVal?.question_type_id)} />
                                                                    <Stack
                                                                      spacing={0.2}
                                                                      width="100%"
                                                                      sx={{
                                                                        boxSizing: 'border-box',
                                                                      }}
                                                                    >
                                                                      <Typography
                                                                        variant="body1"
                                                                        sx={{
                                                                          fontSize: '12px',
                                                                          lineHeight: '18px',
                                                                          fontWeight: 500,
                                                                        }}
                                                                        width={'70%'}
                                                                      >
                                                                        <span
                                                                          dangerouslySetInnerHTML={{
                                                                            __html:
                                                                              questionVal?.question_name || questionVal?.question_data_code
                                                                                ? truncateText(
                                                                                  questionVal.question_data_code
                                                                                    ? `${questionVal.question_data_code}.${questionVal.question_name ? questionVal.question_name : ''
                                                                                    }`
                                                                                    : '',
                                                                                  matches ? 15 : 25,
                                                                                )
                                                                                : '',
                                                                          }}
                                                                        ></span>
                                                                      </Typography>
                                                                    </Stack>
                                                                  </Stack>
                                                                </StackStyled>
                                                              </div>
                                                            )}
                                                          </Draggable>
                                                        )
                                                      })}
                                                      {provided.placeholder}
                                                    </div>
                                                  )}
                                                </Droppable>
                                              </DragDropContext>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                    </Stack>
                                  </AccordionDetails>
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </Accordion>
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

export default SectionsQuestionsListComponent
