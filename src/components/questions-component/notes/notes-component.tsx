import QuestionTypeBaseComp from '@/components/question-types-base-comp'
import { useState, useEffect } from 'react'
import { QuestionBaseTypes, NotesProps, QuestionBaseCategoryTypes } from './notes-types'
import { BoxWrapper, ErrorBox, MdBox, StyledContentBox, StyledRowWrapper, StyledTypeText } from './notes.style'
import { Button, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import { theme } from '@/constants/theme'
import QuestionTypeIcon from '@/constants/questionTypeIcon'
import { StyledCardQuestionHeadingTitle } from '@/components/question-types-base-comp/question-types-base.style'
import { QuestionNameInput } from '@/constants/cutom-question-name-input'
import _ from 'lodash'

const Notes: React.FC<NotesProps> = ({
  question,
  surveyQuestionId,
  SaveQuestion,
  add,
  editFalse,
  setEditFalse,
  loading,
  setQuestionPreview,
  questionPreview,
  questionTheme,
  setQuestionCompare,

  uploadMediaModalSelect,
  setUploadMediaModalSelect,
  selectedFileQuestionTitle,
  setSelectedFileQuestionTitle
}) => {
  const [questionBase, setQuestionBase] = useState<QuestionBaseTypes | null>(null)
  const [questionBaseCategory, setQuestionBaseCategory] = useState<QuestionBaseCategoryTypes | null>(null)
  const [valid, setValid] = useState(false)
  const [isEdit, setIsEdit] = useState(add ? true : false)
  const [questionObjCopy, setQuestionObjCopy] = useState<any>(null)

  const dataConverter = () => {
    let payload: QuestionBaseTypes | null = {
      question_data_code: question?.question_data_code ? question?.question_data_code : '',
      question_name: question?.question_name ? question?.question_name : '',
      question_title: question?.question_title ? question?.question_title : '',
      question_title_formatted: question?.question_title_formatted ? question?.question_title_formatted : '',
      description: question?.description ? question?.description : '',
      instructions: question?.instructions ? question?.instructions : '',
      programming_notes: question?.programming_notes ? question?.programming_notes : '',
      question_id: question?.question_id ? Number(question?.question_id) : null,
      question_category_id: question?.question_category_id ? Number(question?.question_category_id) : 1,
      question_category: question?.question_category ? question?.question_category : '',
      question_code: question?.question_code ? question?.question_code : '',
      question_type_id: question?.question_type_id ? Number(question?.question_type_id) : 3,
      question_time: question?.question_time ? question?.question_time : 0,
      concept: question?.concept ? question?.concept : null,

    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {}

    setQuestionBase(payload)
    setQuestionBaseCategory(questionBaseCategoryPayload)
    let questionCopy: any = {
      questionBase: payload,
      questionBaseCategory: questionBaseCategoryPayload,
    }
    setQuestionObjCopy(questionCopy)
  }

  useEffect(() => {
    dataConverter()
  }, [question])

  useEffect(() => {
    if (
      surveyQuestionId
        ? questionBase?.question_title_formatted !== '' &&
        //questionBase?.instructions !== "" &&
        questionBase?.question_name !== ''
        : questionBase?.question_title_formatted !== '' &&
        questionBase?.question_code &&
        questionBase?.question_name !== '' &&
        //questionBase?.instructions !== "" &&
        questionBase?.question_code !== '0' &&
        questionBase?.question_code !== '' &&

        questionBase?.question_data_code !== '0' &&
        questionBase?.question_data_code !== '' &&

        questionBase?.question_category_id !== null &&
        questionBase?.question_type_id !== null
    ) {
      setValid(true)
    } else {
      setValid(false)
    }
  }, [questionBase])

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
      question_type_id: 6,
      instructions: '',
      question_time: 30,
      concept: null,

    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {}
    setQuestionBase(payload)
    setQuestionBaseCategory(questionBaseCategoryPayload)
  }

  useEffect(() => {
    if (add) {
      resetForm()
    }
  }, [add])

  useEffect(() => {
    if (isEdit) {
      setEditFalse && setEditFalse(true)
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
    if (isEdit && setQuestionPreview) {
      let obj = {
        questionBase: questionBase,
        questionBaseCategory: questionBaseCategory,
      }
      setQuestionPreview(obj)
    }
  }, [questionBase, questionBaseCategory])

  useEffect(() => {
    if (!isEdit && questionPreview) {
      setQuestionBaseCategory(questionPreview?.questionBaseCategory)
      setQuestionBase(questionPreview?.questionBase)
    }
  }, [questionPreview])

  useEffect(() => {
    if (isEdit && setQuestionCompare) {
      if (_.isEqual(questionBase, questionObjCopy?.questionBase) && _.isEqual(questionBaseCategory, questionObjCopy?.questionBaseCategory)) {
        setQuestionCompare(false)
      } else {
        setQuestionCompare(true)
      }
    }
  }, [questionBase, questionBaseCategory])

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

  return (
    <BoxWrapper>
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
                  <QuestionTypeIcon typeId={16} />
                  <StyledTypeText display="flex" alignItems="center" flexDirection="row" style={{ gap: "1rem" }}>
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
      ) : (
        // <StyledContentBox>
        //   <Grid container spacing={2}>
        //     <Grid item xs={12}>
        //       <StyledRowWrapper>
        //         <Stack direction="row" alignItems="flex-start">
        //           <QuestionTypeIcon typeId={16} />
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
        ''
      )}

      <QuestionTypeBaseComp questionBase={questionBase} setQuestionBase={setQuestionBase} isEdit={isEdit} questionTheme={questionTheme}
        uploadMediaModalSelect={uploadMediaModalSelect} setUploadMediaModalSelect={setUploadMediaModalSelect}
        selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle} />

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
            disabled={!valid || loading ? true : false}
            onClick={async () => {
              let payload: any = {
                ...questionBase,
                ...questionBaseCategory,
                                  concept_id: selectedFileQuestionTitle ? selectedFileQuestionTitle?.id : (questionBase?.concept?.id ? questionBase?.concept?.id : null),

              }
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
  )
}

export default Notes
