import QuestionTypeBaseComp from '@/components/question-types-base-comp'
import { useState, useEffect } from 'react'
import { QuestionAnsTypes, QuestionBaseTypes, GridMultiSelectProps, PromptAnsTypes, QuestionBaseCategoryTypes } from './grid-multi-select-types'
import {
  BoxWrapper,
  ErrorBox,
  MDInput,
  MdBox,
  // StyledCardAnswerText,
  StyledContentBox,
  StyledEditOptionsBox,
  StyledGridContainer,
  StyledRowGapWrapper,
  StyledRowWrapper,
  StyledTypeText,
} from './grid-multi-select.style'
import Checkbox from '@mui/material/Checkbox'
// import FormControlLabel from "@mui/material/FormControlLabel";
import { IconButton, Box, Button, Tooltip, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Grid from '@mui/material/Grid'
import Select from '@/components/select'
import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack'
// import { CardsDragnDropIcon } from "@/assets/images";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import {
  StyledAnswersDivider,
  // StyledQuestionBaseDivider,
} from '../single-punch/single-punch.style'
import QuestionBaseCategory from '@/components/question-base-category'
import QuestionBaseShowCodes from '@/components/question-base-show-codes'
import '../../../global.css'
import GridMultiSelectViewTable from './grid-multi-select-view-table'
import { theme } from '@/constants/theme'
import { StyledCardQuestionHeadingTitle } from '@/components/question-types-base-comp/question-types-base.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import QuestionTypeIcon from '@/constants/questionTypeIcon'
import { SortingListTypes } from '@/components/project-survey-builder/project-survey-builder.type'
import LockIcon from '@mui/icons-material/Lock'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import QuestionNotesComponent from '@/components/question-notes'
import { QuestionNameInput } from '@/constants/cutom-question-name-input'
import { StyledLabel } from '@/components/question-base-show-codes/question-base-show-codes.style'
import _ from 'lodash'
import BuilderSwitchQuestions from '@/components/builder-switch-questions/builder-switch-questions.component'
import SwapCallsIcon from '@mui/icons-material/SwapCalls'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'

import BurstModeIIcon from '@mui/icons-material/BurstMode'
//
import UploadModalSelect from '@/components/project-media-upload-modal-select/project-media-upload-modal-select.component'
import { FilesTypes } from '@/components/project-media-upload-modal/project-media-upload-modal.type'
import ShowConceptForAnswers from '@/components/concept-answers-show/concept-answers-show.component'
import PasteListModalComponent from '@/components/paste-list-modal/paste-list-modal.component'

const GridMultiSelect: React.FC<GridMultiSelectProps> = ({
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

  const [promptAns, setPromptAns] = useState<PromptAnsTypes[]>([])
  const [deletedPromptAns, setDeletedPromptAns] = useState<PromptAnsTypes[]>([])

  const [questionBaseCategory, setQuestionBaseCategory] = useState<QuestionBaseCategoryTypes | null>(null)
  const [valid, setValid] = useState(false)
  const [isEdit, setIsEdit] = useState(add ? true : false)
  const [answerListSorting, setAnswerListSorting] = useState<SortingListTypes[]>([])
  const [collapseConf, setCollapseConf] = useState(true)
  // const [collapseAns, setCollapseAns] = useState(false);
  // const [collapsePromts, setCollapsePromts] = useState(false);
  const [questionObjCopy, setQuestionObjCopy] = useState<any>(null)

  const [promptAnswersSwap, setPromptAnswersSwap] = useState(false)

  const [deletedQuestionAnsSwap, setDeletedQuestionAnsSwap] = useState<QuestionAnsTypes[]>([])
  const [deletedPromptAnsSwap, setDeletedPromptAnsSwap] = useState<PromptAnsTypes[]>([])
  const [addOption, setAddOption] = useState(false)
  const [addPromptOption, setAddPromptOption] = useState(false)

  // upload media

  const [uploadMediaModalSelect, setUploadMediaModalSelect] = useState(false)
  const [selectedFileQuestionTitle, setSelectedFileQuestionTitle] = useState<FilesTypes | null>(null)

  const [selectedFileQuestionAnswer, _setSelectedFileQuestionAnswer] = useState<FilesTypes | null>(null)
  const [uploadAnswerIndex, setUploadAnswerIndex] = useState<number | null>(null)

  const [uploadPromptIndex, setUploadPromptIndex] = useState<number | null>(null)

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

  const isCodeDuplicate = (code: string | number) => {
    return questionAns.filter((answer) => answer.question_answer_code === code).length > 1
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

  const isPromptCodeDuplicate = (code: string | number) => {
    return promptAns.filter((answer) => answer.prompt_code === code).length > 1
  }

  const onDragEndPromptAns = (result: DropResult) => {
    const { destination } = result
    if (!destination) {
      return
    }
    const reorderedAnswers = Array.from(promptAns)
    const [moved] = reorderedAnswers.splice(result.source.index, 1)
    reorderedAnswers.splice(Number(result && result.destination && result?.destination?.index), 0, moved)

    const updatedAnswers = reorderedAnswers.map((answer, index) => ({
      ...answer,
      sort_order: index + 1,
    }))
    setPromptAns(updatedAnswers)
  }

  const dataConverter = () => {
    let payload: QuestionBaseTypes | null = {
      question_data_code: question?.question_data_code ? question?.question_data_code : '',
      question_name: question?.question_name ? question?.question_name : '',
      question_title: question?.question_title ? question?.question_title : '',
      question_title_formatted: question?.question_title_formatted ? question?.question_title_formatted : '',
      description: question?.description ? question?.description : '',
      instructions: question?.instructions ? question.instructions : '',
      programming_notes: question?.programming_notes ? question?.programming_notes : '',
      question_id: question?.question_id ? Number(question?.question_id) : null,
      question_category_id: question?.question_category_id ? Number(question?.question_category_id) : 1,
      question_category: question?.question_category ? question?.question_category : '',
      question_code: question?.question_code ? question?.question_code : '',
      question_type_id: question?.question_type_id ? Number(question?.question_type_id) : 1,
      question_time: question?.question_time ? question?.question_time : 0,
      concept: question?.concept ? question?.concept : null,
    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {
      prompt_sorting_order: question?.prompt_sorting_order ? question?.prompt_sorting_order : 1,
      answer_sorting_order: question?.answer_sorting_order ? question.answer_sorting_order : '',
      required_question: question?.required_question ? true : false,
      show_codes: false,
      // prompt_show_code: question?.prompt_show_code ? true : false,
      can_have_quota: question?.can_have_quota ? true : false,
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

    if (question?.prompt_answer && Array.isArray(question?.prompt_answer)) {
      const transformedPromptAnswers = question?.prompt_answer.map((answer, index) => ({
        ...answer,
        sort_order: index + 1,
      }))
      setPromptAns(JSON.parse(JSON.stringify(transformedPromptAnswers)))
      questionCopy.promptAns = JSON.parse(JSON.stringify(transformedPromptAnswers))
    } else if (question?.question_parts && Array.isArray(question?.question_parts)) {
      const transformedPromptAnswers = question?.question_parts.map((answer, index) => ({
        ...answer,
        sort_order: index + 1,
      }))
      setPromptAns(JSON.parse(JSON.stringify(transformedPromptAnswers)))
      questionCopy.promptAns = JSON.parse(JSON.stringify(transformedPromptAnswers))
    }
    setQuestionObjCopy(questionCopy)
  }

  useEffect(() => {
    dataConverter()
  }, [question])

  useEffect(() => {
    let check = questionAns?.some((answer) => answer.question_answer_text === '')

    let checkCode = questionAns?.some((answer) => answer.question_answer_code === '')
    let uniqueCodeCheck = new Set(questionAns?.map((a) => a.question_answer_code)).size !== questionAns?.length

    let checkPromptCode = promptAns?.some((answer) => answer.prompt_code === '')
    let uniquePromptCodeCheck = new Set(promptAns?.map((a) => a.prompt_code)).size !== promptAns?.length

    // let promptAnsCheck = promptAns?.some((answer) => answer.prompt_text === '')
    if (
      surveyQuestionId
        ? questionBase?.question_title_formatted !== '' &&
          check === false &&
          checkCode === false &&
          uniqueCodeCheck === false &&
          checkPromptCode === false &&
          uniquePromptCodeCheck === false &&
          // promptAnsCheck === false &&
          promptAns.length > 0 &&
          questionAns?.length > 0 &&
          //questionBase?.instructions !== "" &&
          questionBase?.question_name !== ''
        : questionBase?.question_title_formatted !== '' &&
          // check === false &&
          // checkCode === false &&
          uniqueCodeCheck === false &&
          checkPromptCode === false &&
          uniquePromptCodeCheck === false &&
          // promptAnsCheck === false &&
          // questionAns.length > 0 &&
          promptAns?.length > 0 &&
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
  }, [questionAns, questionBase, promptAns])

  const reserForm = () => {
    let payload: QuestionBaseTypes | null = {
      question_data_code: '',
      question_name: '',
      question_title: '',
      question_title_formatted: '',
      description: '',
      programming_notes: '',
      instructions: '',
      question_id: null,
      question_category_id: 1,
      question_category: '',
      question_code: '',
      question_type_id: 13,
      question_time: 30,
      concept: null,
    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {
      prompt_sorting_order: 1,
      answer_sorting_order: 1,
      required_question: true,
      show_codes: false,
      prompt_show_code: false,
      can_have_quota: true,
    }
    setQuestionBase(payload)
    setQuestionBaseCategory(questionBaseCategoryPayload)
  }

  useEffect(() => {
    if (add) {
      reserForm()
    }
  }, [add])

  useEffect(() => {
    if (isEdit) {
      setEditFalse && setEditFalse(true)
      if (sortingList) {
        setAnswerListSorting(sortingList)
      }
      // sortingList();
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

  // useEffect(() => {
  //   if (questionBaseCategory?.prompt_sorting_order === 2) {
  //     let payload = promptAns.map((ans) => {
  //       ans.keep_answer_position = false
  //       return ans
  //     })
  //     setPromptAns(payload)
  //   }
  // }, [questionBaseCategory])

  useEffect(() => {
    if (isEdit && setQuestionPreview) {
      let obj = {
        questionBase: questionBase,
        questionBaseCategory: questionBaseCategory,
        questionAns: questionAns,
        promptAns: promptAns,
      }
      setQuestionPreview(obj)
    }
  }, [questionBase, questionBaseCategory, questionAns, promptAns])

  useEffect(() => {
    if (!isEdit && questionPreview) {
      setQuestionAns(questionPreview?.questionAns ? questionPreview?.questionAns : [])
      setQuestionBaseCategory(questionPreview?.questionBaseCategory)
      setQuestionBase(questionPreview?.questionBase)
      setPromptAns(questionPreview?.promptAns ? questionPreview?.promptAns : [])
    }
  }, [questionPreview])

  useEffect(() => {
    if (isEdit && setQuestionCompare) {
      let questionBaseCategoryCopy = { ...questionBaseCategory }
      let questionBaseCategoryObjCopy = { ...questionObjCopy.questionBaseCategory }

      delete questionBaseCategoryObjCopy.show_codes
      delete questionBaseCategoryObjCopy.prompt_show_code
      delete questionBaseCategoryCopy.show_codes
      delete questionBaseCategoryCopy.prompt_show_code
      if (
        _.isEqual(questionBase, questionObjCopy?.questionBase) &&
        _.isEqual(questionAns, questionObjCopy?.questionAns) &&
        _.isEqual(promptAns, questionObjCopy?.promptAns) &&
        _.isEqual(questionBaseCategoryCopy, questionBaseCategoryObjCopy)
      ) {
        setQuestionCompare(false)
      } else {
        setQuestionCompare(true)
      }
    }
  }, [questionAns, questionBase, questionBaseCategory, promptAns])

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

  // const swappedToPrompts = questionAns.map(answer => ({
  //   // prompt_id: answer.answer_id,
  //   prompt_id: null,
  //   prompt_code: answer.question_answer_code,
  //   prompt_text: answer.question_answer_text,
  //   add_other_option: answer.add_other_option,
  //   keep_answer_position: answer.keep_answer_position,
  //   sort_order: answer.sort_order,
  //   is_active: answer.is_active,
  //   is_exclusive: answer.is_exclusive
  // }));

  // // Swapping prompts to question answers
  // const swappedToAnswers = promptAns.map((prompt) => ({
  //   id: null,
  //   question_id: null,
  //   answer_id: null,
  //   question_answer_id: null,
  //   add_other_field: null,
  //   question_answer_code: prompt.prompt_code,
  //   question_answer_text: prompt.prompt_text,
  //   question_answer_data_code: null,
  //   // term_condition: null,
  //   language_id: null,
  //   style_name: null,
  //   answer_punch_type: null,
  //   style_background_color: null,
  //   add_other_option: prompt.add_other_option,
  //   keep_answer_position: prompt.keep_answer_position,
  //   lock_position: false,
  //   sort_order: prompt.sort_order,
  //   // answer_sort_order: prompt.sort_order || (index + 1),
  //   is_active: prompt.is_active,
  //   is_exclusive: prompt.is_exclusive,
  //   ae: false,
  //   is_terminate: false,
  //   analysis_group: "",
  //   sub_class: "",
  //   class: ""
  // }));

  // const SwapPromptAnswers = () => {
  //   if (!promptAnswersSwap) {
  //     // @ts-ignore
  //     setPromptAns(swappedToPrompts)
  //     // @ts-ignore
  //     setQuestionAns(swappedToAnswers)
  //   }
  //   else {
  //     // @ts-ignore
  //     setPromptAns(question?.prompt_answer)
  //     // @ts-ignore
  //     setQuestionAns(question?.answers)
  //   }
  // }

  const handleSwap = () => {
    if (!promptAnswersSwap) {
      const newPromptAns = promptAns.map((prompt) => ({ ...prompt, is_active: false }))
      const newQuestionAns = questionAns.map((answer) => ({ ...answer, is_active: false }))

      setDeletedPromptAnsSwap(newPromptAns)
      setDeletedQuestionAnsSwap(newQuestionAns)

      const swappedToPrompts = newQuestionAns?.map((answer) => ({
        prompt_id: null,
        prompt_code: answer.question_answer_code,
        prompt_text: answer.question_answer_text,
        add_other_option: answer.add_other_option,
        keep_answer_position: answer.keep_answer_position,
        sort_order: answer.sort_order,
        is_active: true,
        is_exclusive: answer.is_exclusive,
      }))

      const swappedToAnswers = newPromptAns?.map((prompt) => ({
        id: null,
        question_id: null,
        answer_id: null,
        question_answer_id: null,
        add_other_field: null,
        question_answer_code: prompt.prompt_code,
        question_answer_text: prompt.prompt_text,
        question_answer_data_code: null,
        // term_condition: null,
        language_id: null,
        style_name: null,
        answer_punch_type: null,
        style_background_color: null,
        add_other_option: prompt.add_other_option,
        keep_answer_position: prompt.keep_answer_position,
        lock_position: false,
        sort_order: prompt.sort_order,
        // answer_sort_order: prompt.sort_order || (index + 1),
        is_active: true,
        is_exclusive: prompt.is_exclusive,
        ae: false,
        is_terminate: false,
        analysis_group: '',
        sub_class: '',
        class: '',
      }))
      // @ts-ignore
      setPromptAns(swappedToPrompts)
      // @ts-ignore
      setQuestionAns(swappedToAnswers)
      setPromptAnswersSwap(true)
    } else {
      setPromptAns(deletedPromptAnsSwap.map((item) => ({ ...item, is_active: true })))
      setQuestionAns(deletedQuestionAnsSwap.map((item) => ({ ...item, is_active: true })))

      setDeletedPromptAnsSwap([])
      setDeletedQuestionAnsSwap([])
      setPromptAnswersSwap(false)
    }
  }

  function reverseRows() {
    const promptCodes = promptAns.map((prompt) => prompt.prompt_code)

    const reversedPromptCodes = [...promptCodes].reverse()

    promptAns.forEach((prompt, index) => {
      prompt.prompt_code = reversedPromptCodes[index]
    })

    setPromptAns([...promptAns])
  }

  function reverseColumns() {
    const questionCodes = questionAns.map((answer) => answer.question_answer_code)

    const reversedQuestionCodes = [...questionCodes].reverse()

    questionAns.forEach((answer, index) => {
      answer.question_answer_code = reversedQuestionCodes[index]
    })

    setQuestionAns([...questionAns])
  }

  // console.log(questionAns, promptAns, "promptAnspromptAns", questionPreview, question, promptAnswersSwap)

  const addOptionClose = () => {
    setAddOption(false)
    setAddPromptOption(false)
  }

  const handleGetList = (value: string[]) => {
    if (addOption) {
      let options = value.filter((val: string) => val !== '')
      let greaterNumber = questionAns.length > 0 ? Math.max(...questionAns.map((ans) => Number(ans.question_answer_code))) : 0
      let finalPayload = options.map((option, i) => {
        return {
          question_answer_id: '',
          question_answer_code: `${greaterNumber + (i + 1)}`,
          question_answer_text: option,
          keep_answer_position: false,
          is_exclusive: false,
          add_other_option: false,
          sort_order: Number(questionAns.length ? questionAns.length + 1 : 1),
          is_terminate: false,
          is_active: true,
          analysis_group: null,
          sub_class: null,
          class: null,
        }
      })
      let payload: QuestionAnsTypes[] = [...questionAns]
      let newArray = payload.concat(finalPayload)
      setQuestionAns(newArray)
      addOptionClose()
    } else {
      let options = value.filter((val: string) => val !== '')
      let greaterNumber =
        promptAns.length > 0
          ? Math.max(
              ...promptAns.map((prom) => {
                let number = String(prom.prompt_code).match(/(\d+)/)
                if (number) {
                  return Number(number[0])
                } else {
                  return 0
                }
              }),
            )
          : 0
      let finalPayload = options.map((option, i) => {
        return {
          prompt_id: null,
          prompt_code: `${greaterNumber + (i + 1)}`,
          prompt_text: option,
          add_other_option: false,
          keep_answer_position: false,
          sort_order: Number(promptAns.length ? promptAns.length + 1 : 1),
          is_active: true,
        }
      })
      let payload: PromptAnsTypes[] = [...promptAns]
      let newArray = payload.concat(finalPayload)
      setPromptAns(newArray)
      addOptionClose()
    }
  }

  return (
    <>
      <UploadModalSelect
        open={uploadMediaModalSelect}
        onClose={() => {
          setUploadMediaModalSelect(false)
          setUploadAnswerIndex(null)
          setUploadPromptIndex(null)
        }}
        // selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
        // selectedFileQuestionAnswer={selectedFileQuestionAnswer} setSelectedFileQuestionAnswer={setSelectedFileQuestionAnswer}
        uploadAnswerIndex={uploadAnswerIndex || uploadAnswerIndex == 0 ? uploadAnswerIndex : uploadPromptIndex}
        setUploadAnswerIndex={uploadAnswerIndex || uploadAnswerIndex == 0 ? setUploadAnswerIndex : setUploadPromptIndex}
        questionAns={uploadAnswerIndex || uploadAnswerIndex == 0 ? questionAns : promptAns}
        setQuestionAns={uploadAnswerIndex || uploadAnswerIndex == 0 ? setQuestionAns : setPromptAns}
        questionBase={questionBase}
        setQuestionBase={setQuestionBase}
      />

      <BoxWrapper>
        <PasteListModalComponent open={addOption || addPromptOption} addOptionClose={addOptionClose} handleGetList={handleGetList} />
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
                  <Stack direction="row" alignItems="flex-start">
                    <QuestionTypeIcon typeId={13} />

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
                          placeholder="Question Code*"
                          className="base-comp-question_code-input"
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiInputBase-input': {
                              fontWeight: 700,
                            },
                          }}
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
                          placeholder="Question Name*"
                          className="base-comp-question_code-input"
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiInputBase-input': {
                              fontWeight: 700,
                            },
                          }}
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
        //           <QuestionTypeIcon typeId={13} />
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
          setUploadPromptIndex={setUploadPromptIndex}
        />

        {isEdit ? (
          <StyledRowGapWrapper sx={{ padding: '0px' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              display={isEdit ? 'flex' : 'none'}
              sx={{
                // borderBottom: collapsePromts
                //   ? `2px solid ${theme.palette.primary.dark}`
                //   : "",
                // marginBottom: !collapsePromts ? "1rem" : "",
                width: '100%',
              }}
            >
              <Typography variant="h6">Rows</Typography>

              <Stack direction="row">
                <Button
                  size="small"
                  onClick={() => {
                    setAddPromptOption(true)
                  }}
                >
                  +Add Options
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Tooltip title={'Reverse answers codes'}>
                    <IconButton
                      onClick={() => {
                        reverseRows()
                      }}
                    >
                      <SwapVerticalCircleIcon style={{ backgroundColor: '#fff', borderRadius: '50px', color: '#6A5198' }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Tooltip title={'Swap rows columns'}>
                    <IconButton
                      onClick={() => {
                        handleSwap()
                        // setPromptAnswersSwap(!promptAnswersSwap)
                      }}
                    >
                      <SwapCallsIcon
                        style={{
                          backgroundColor: promptAnswersSwap ? '#6A5198' : '#fff',
                          borderRadius: '50px',
                          color: promptAnswersSwap ? '#fff' : 'grey',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Show Code">
                    {/* <FormControlLabel
                      control={ */}
                    <Switch
                      size="small"
                      sx={{ marginTop: '5px' }}
                      checked={questionBaseCategory?.prompt_show_code ? true : false}
                      color="primary"
                      onChange={(e) => {
                        let payload: any = { ...questionBaseCategory }
                        payload.prompt_show_code = e.target.checked
                        setQuestionBaseCategory(payload)
                      }}
                    />
                    {/* }
                      label={""}
                    /> */}
                  </Tooltip>
                </Box>
                {/* <IconButton
                  onClick={() => {
                    setCollapsePromts(!collapsePromts);
                  }}
                >
                  <KeyboardArrowDownIcon
                    sx={{ transform: collapsePromts ? "rotate(180deg)" : "" }}
                  />
                </IconButton> */}
              </Stack>
            </Stack>
          </StyledRowGapWrapper>
        ) : null}
        {isEdit ? (
          <StyledContentBox sx={{ padding: '0px' }}>
            {/* --- */}
            <DragDropContext onDragEnd={onDragEndPromptAns}>
              <Droppable droppableId="promptAns">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {promptAns
                      .filter((answer) => answer.is_active)
                      .map((answer, index) => (
                        <Draggable key={index} draggableId={String(answer.sort_order)} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <StyledEditOptionsBox
                                key={index}
                                sx={{
                                  alignItems: index === 0 ? 'flex-end' : 'center',
                                  padding: '0px',
                                }}
                              >
                                <Stack className="configuration-box-sub-drop-icon-stack ">{/* <img src={CardsDragnDropIcon} /> */}</Stack>
                                {/* <FormControlLabel
                                  control={ */}
                                <Checkbox checked size="small" color="primary" />
                                {/* }
                                  label={""}
                                /> */}

                                {questionBaseCategory?.prompt_show_code ? (
                                  <Stack
                                    className="stack-question_answer_code"
                                    sx={{
                                      width: '10% !important',
                                    }}
                                  >
                                    <Tooltip
                                      title={
                                        answer?.prompt_code === ''
                                          ? 'This Field is required'
                                          : isPromptCodeDuplicate(answer?.prompt_code)
                                            ? 'Code must be unique!'
                                            : ''
                                      }
                                    >
                                      <MDInput
                                        // autoFocus
                                        className="input-question_answer_code"
                                        variant="standard"
                                        placeholder="Code"
                                        value={answer?.prompt_code}
                                        // onKeyPress={(e: any) => {
                                        //   ingerNum(e)
                                        // }}
                                        onChange={(e) => {
                                          let payload: PromptAnsTypes[] = [...promptAns]
                                          payload[index].prompt_code = e.target.value
                                          setPromptAns(payload)
                                        }}
                                        error={isPromptCodeDuplicate(answer?.prompt_code) ? true : false}
                                      />
                                    </Tooltip>
                                  </Stack>
                                ) : null}

                                <Stack
                                  className="stack-question_answer_text"
                                  sx={{
                                    width: questionBaseCategory?.prompt_show_code ? '100%  !important' : '100% !important',
                                  }}
                                >
                                  {/* {index === 0 && (
                                    <StyledLabel sx={{ padding: "0px" }}>
                                      Text
                                    </StyledLabel>
                                  )} */}
                                  <MDInput
                                    // fullWidth
                                    autoFocus={promptAns.filter((answer) => answer.prompt_id === null).length > 0 ? true : false}
                                    className="input-question_answer_text"
                                    sx={{ width: '80%' }}
                                    variant="standard"
                                    placeholder="Text"
                                    value={answer?.prompt_text}
                                    onChange={(e) => {
                                      let payload: PromptAnsTypes[] = [...promptAns]
                                      payload[index].prompt_text = e.target.value
                                      setPromptAns(payload)
                                    }}
                                  />
                                  {/* {answer?.prompt_text === '' ? <ErrorBox>This Field is required</ErrorBox> : ''} */}
                                </Stack>

                                {answer?.concept ? (
                                  <ShowConceptForAnswers
                                    answer={answer}
                                    index={index}
                                    selectedFileQuestionAnswer={selectedFileQuestionAnswer}
                                    setQuestionAns={setPromptAns}
                                    questionAns={promptAns}
                                  />
                                ) : null}

                                {questionBaseCategory?.prompt_show_code ? (
                                  <>
                                    <Tooltip title="Lock Position">
                                      <IconButton
                                        onClick={() => {
                                          let payload: PromptAnsTypes[] = [...promptAns]
                                          if (answer?.keep_answer_position) {
                                            payload[index].keep_answer_position = false
                                          } else {
                                            payload[index].keep_answer_position = true
                                          }
                                          setPromptAns(payload)
                                        }}
                                      >
                                        <LockIcon fontSize="small" color={answer?.keep_answer_position ? 'primary' : 'inherit'} />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : null}

                                <Box style={{ marginLeft: '0.8rem' }}>
                                  <Tooltip title={''} placement="left">
                                    <BurstModeIIcon 
                                      width={12}
                                      onClick={() => {
                                        setUploadMediaModalSelect(true)
                                        setUploadPromptIndex(index)
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
                                    let payload: PromptAnsTypes[] = [...promptAns]
                                    let deletedPayload: PromptAnsTypes[] = [...deletedPromptAns]

                                    if (answer.prompt_id) {
                                      payload[index].is_active = false
                                      deletedPayload.push(payload[index])
                                    }
                                    payload.splice(index, 1)

                                    payload = payload.map((answer, idx) => ({
                                      ...answer,
                                      sort_order: idx + 1,
                                    }))

                                    setPromptAns(payload)
                                    setDeletedPromptAns(deletedPayload)
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
            <StyledEditOptionsBox className="prompt-add-container" style={{ padding: '0px' }}>
              {/* <FormControlLabel
                control={<Checkbox size="small" color="primary" />}
                label={""}
              /> */}
              <Checkbox size="small" color="primary" />
              <MDInput
                fullWidth
                size="small"
                variant="standard"
                // className="prompt-add-container-input"
                placeholder="Add Options"
                onFocus={() => {
                  let payload: PromptAnsTypes[] = [...promptAns]
                  let greaterNumber =
                    promptAns.length > 0
                      ? Math.max(
                          ...promptAns.map((prom) => {
                            let number = String(prom.prompt_code).match(/(\d+)/)
                            if (number) {
                              return Number(number[0])
                            } else {
                              return 0
                            }
                          }),
                        )
                      : 0
                  payload.push({
                    prompt_id: null,
                    prompt_code: `${greaterNumber + 1}`,
                    prompt_text: ``,
                    add_other_option: false,
                    keep_answer_position: false,
                    sort_order: Number(promptAns.length ? promptAns.length + 1 : 1),
                    is_active: true,
                  })
                  setPromptAns(payload)
                }}
              />
            </StyledEditOptionsBox>
          </StyledContentBox>
        ) : (
          <StyledContentBox className="answer-add-container-view-mode">
            <StyledEditOptionsBox sx={{ padding: '0px' }}>
              <GridMultiSelectViewTable promptAns={promptAns} questionAns={questionAns} questionTheme={questionTheme} />
            </StyledEditOptionsBox>
          </StyledContentBox>
        )}
        {/* <StyledAnswersDivider
          isEdit={isEdit}
          sx={{
            display: collapsePromts ? "none" : "",
            backgroundColor: `${theme.palette.primary.dark}`,
            height: "2px",
          }}
        /> */}
        {isEdit ? (
          <StyledRowGapWrapper sx={{ padding: '0px' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              marginTop="0.5rem"
              display={isEdit ? 'flex' : 'none'}
              sx={{
                // borderBottom: collapseAns
                //   ? `2px solid ${theme.palette.primary.dark}`
                //   : "",
                // marginBottom: "0.5rem",
                width: '100%',
              }}
            >
              <Typography variant="h6">Columns</Typography>

              <Stack direction="row">
                <Button
                  size="small"
                  onClick={() => {
                    setAddOption(true)
                  }}
                >
                  +Add Options
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
              </Stack>
            </Stack>
          </StyledRowGapWrapper>
        ) : null}
        {isEdit ? (
          <StyledContentBox>
            {/* --- */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="answers">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {questionAns
                      .filter((answer) => answer.is_active)
                      .map((answer, index) => (
                        <Draggable key={index} draggableId={String(answer.sort_order)} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <StyledEditOptionsBox
                                key={index}
                                sx={{
                                  alignItems: index === 0 ? 'flex-end' : 'center',
                                  padding: '0px',
                                }}
                              >
                                <Stack className="configuration-box-sub-drop-icon-stack ">{/* <img src={CardsDragnDropIcon} /> */}</Stack>
                                {/* <FormControlLabel
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
                                  <Stack sx={{ width: '10% !important' }}>
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
                                    width: questionBaseCategory?.show_codes ? '25%' : '100% !important',
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
                                        // fullWidth
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

                                    <Tooltip title="Lock Position">
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
                                    <Tooltip title="Add Oth.field">
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
                                    <Tooltip title="Is Exclusive">
                                      <IconButton
                                        onClick={() => {
                                          let payload: QuestionAnsTypes[] = [...questionAns]
                                          if (answer?.is_exclusive) {
                                            payload[index].is_exclusive = false
                                          } else {
                                            payload[index].is_exclusive = true
                                          }
                                          setQuestionAns(payload)
                                        }}
                                      >
                                        <FolderSpecialIcon fontSize="small" color={answer?.is_exclusive ? 'primary' : 'inherit'} />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : null}

                                <Box style={{ marginLeft: '0.8rem' }}>
                                  <Tooltip title={''} placement="left">
                                    <BurstModeIIcon 
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
            <StyledEditOptionsBox className="answer-add-container" style={{ padding: '0px' }}>
              {/* <FormControlLabel
                control={<Checkbox size="small" color="primary" />}
                label={""}
              /> */}
              <Checkbox size="small" color="primary" />
              <MDInput
                fullWidth
                size="small"
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
                    keep_answer_position: false,
                    is_exclusive: false,
                    add_other_option: false,
                    sort_order: Number(questionAns.length ? questionAns.length + 1 : 1),
                    is_terminate: false,

                    is_active: true,
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
          ''
        )}

        {/* <StyledAnswersDivider
          isEdit={isEdit}
          sx={{
            display: collapseAns ? "none" : "",
            backgroundColor: `${theme.palette.primary.dark}`,
            height: "2px",
          }}
        /> */}
        {isEdit ? (
          <StyledContentBox className="configuration-box" style={{ marginBottom: '-0.5rem' }}>
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
            <StyledEditOptionsBox sx={{ padding: '0px', display: collapseConf ? 'none' : '' }}>
              <StyledGridContainer container spacing={2}>
                <Grid item xs={5.85}>
                  <Select
                    className="configuration-box-select"
                    value={questionBaseCategory?.prompt_sorting_order ? questionBaseCategory?.prompt_sorting_order.toString() : ''}
                    items={answerListSorting}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.prompt_sorting_order = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                    label="Rows list sorting"
                    name="sorting_order"
                    // register={register as any}
                    isRequired={true}
                    size="small"
                  />
                </Grid>
                <Grid item xs={5.85}>
                  <Select
                    className="configuration-box-select"
                    value={questionBaseCategory?.answer_sorting_order ? questionBaseCategory?.answer_sorting_order.toString() : ''}
                    items={answerListSorting}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.answer_sorting_order = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                    label="Columns sorting"
                    name="answer_sorting_order"
                    // register={register as any}
                    isRequired={true}
                    size="small"
                  />
                </Grid>
              </StyledGridContainer>
            </StyledEditOptionsBox>
            <StyledLabel
              style={{
                display: collapseConf ? 'none' : '',
                fontSize: '0.8rem',
                paddingTop: '0rem',
                paddingLeft: '0.8rem',
                marginBottom: '0rem',
              }}
            >
              Settings
            </StyledLabel>

            <StyledEditOptionsBox>
              <StyledGridContainer
                container
                spacing={2}
                xs={12}
                className="configuration-box-sub-cont"
                style={{
                  display: collapseConf ? 'none' : '',
                  paddingLeft: '1rem',
                  marginBottom: '0.5rem',
                }}
              >
                <Grid xs={6}>
                  <QuestionBaseCategory setQuestionBaseCategory={setQuestionBaseCategory} questionBaseCategory={questionBaseCategory} />
                </Grid>
              </StyledGridContainer>
            </StyledEditOptionsBox>
            <StyledAnswersDivider
              isEdit={isEdit}
              sx={{
                backgroundColor: `${theme.palette.primary.dark}`,
                height: '2px',
                width: '98%',
                marginBottom: '1rem',
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
                  reserForm();
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
                payload.answers = [...questionAns, ...deletedQuestionAns, ...deletedQuestionAnsSwap]
                payload.prompt = [...promptAns, ...deletedPromptAns, ...deletedPromptAnsSwap]

                if (valid) {
                  let check: any = await SaveQuestion(payload)
                  if (check === true) {
                    setIsEdit(false)
                  }
                }
                setPromptAnswersSwap(false)
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

export default GridMultiSelect
