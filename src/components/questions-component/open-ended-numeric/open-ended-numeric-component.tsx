import QuestionTypeBaseComp from '@/components/question-types-base-comp'
import { useState, useEffect } from 'react'
import { QuestionBaseTypes, OpenEndedNumericProps, QuestionBaseCategoryTypes } from './open-ended-numeric-types'
import {
  BoxWrapper,
  ErrorBox,
  MDInput,
  MdBox,
  StyledCardAnswerText,
  StyledContentBox,
  StyledEditOptionsBox,
  StyledGridContainer,
  StyledRowWrapper,
  StyledTypeText,
} from './open-ended-numeric.style'
import { Button, Stack, Typography } from '@mui/material'
import QuestionBaseCategory from '@/components/question-base-category'
import Grid from '@mui/material/Grid'
// import { StyledQuestionBaseDivider } from "../single-punch/single-punch.style";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { theme } from '@/constants/theme'
import QuestionTypeIcon from '@/constants/questionTypeIcon'
import QuestionNotesComponent from '@/components/question-notes'
import { StyledCardQuestionHeadingTitle } from '@/components/question-types-base-comp/question-types-base.style'
import { QuestionNameInput } from '@/constants/cutom-question-name-input'
import { StyledLabel } from '@/components/question-base-show-codes/question-base-show-codes.style'
import _ from 'lodash'
import Select from '@/components/select'
import BuilderSwitchQuestions from '@/components/builder-switch-questions/builder-switch-questions.component'
import { FilesTypes } from '@/components/project-media-upload-modal/project-media-upload-modal.type'
import UploadModalSelect from '@/components/project-media-upload-modal-select/project-media-upload-modal-select.component'

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

const OpenEndedNumeric: React.FC<OpenEndedNumericProps> = ({
  question,
  surveyQuestionId,
  SaveQuestion,
  add,
  editFalse,
  loading,
  setQuestionPreview,
  questionPreview,
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
  const [questionBaseCategory, setQuestionBaseCategory] = useState<QuestionBaseCategoryTypes | null>(null)
  const [valid, setValid] = useState(false)
  const [isEdit, setIsEdit] = useState(add ? true : false)
  // const [collapseConf, setCollapseConf] = useState(true);
  const [questionObjCopy, setQuestionObjCopy] = useState<any>(null)

  // upload media

  const [uploadMediaModalSelect, setUploadMediaModalSelect] = useState(false)
  const [selectedFileQuestionTitle, setSelectedFileQuestionTitle] = useState<FilesTypes | null>(null);

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
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {
      required_question: question?.required_question ? question?.required_question : false,
      precision_value: question?.precision_value ? question?.precision_value : 0,

      columns: question?.no_of_columns ? question?.no_of_columns : 0,
      // no_of_columns: question?.no_of_columns ? question?.no_of_columns : 0,
      can_have_quota: question?.can_have_quota ? question?.can_have_quota : false,
      input_prefix: question?.input_prefix ? question?.input_prefix : '',
      input_suffix: question?.input_suffix ? question?.input_suffix : '',
      upper_limit: question?.upper_limit === null || question?.upper_limit === '' ? '' : question?.upper_limit,
      lower_limit: question?.lower_limit === null || question?.upper_limit === '' ? '' : question?.lower_limit,
      lower_limit_type: question?.lower_limit_type ? question?.lower_limit_type : 'GreaterOrEqual',
      upper_limit_type: question?.upper_limit_type ? question?.upper_limit_type : 'SmallerOrEqual',
    }

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
        // questionBase?.question_data_code !== '0' &&
        // questionBase?.question_data_code !== '' &&

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
      question_name: '',
      question_data_code: '',
      question_title: '',
      question_title_formatted: '',
      description: '',
      programming_notes: '',
      question_id: null,
      question_category_id: 1,
      question_category: '',
      question_code: '',
      question_type_id: 5,
      instructions: '',
      question_time: 30,

      concept: null,

    }
    let questionBaseCategoryPayload: QuestionBaseCategoryTypes | null = {
      precision_value: 0,
      columns: 0,
      required_question: true,
      can_have_quota: true,
      input_prefix: '',
      input_suffix: '',
      no_of_columns: '',
    }
    setQuestionBase(payload)
    setQuestionBaseCategory(questionBaseCategoryPayload)
  }

  useEffect(() => {
    if (add) {
      resetForm()
    }
  }, [add])

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
      setQuestionBase(questionPreview.questionBase)
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
    <>
      <UploadModalSelect open={uploadMediaModalSelect} onClose={() => {
        setUploadMediaModalSelect(false)
        // setUploadAnswerIndex(null)
      }}
        // @ts-ignore
        selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
        // selectedFileQuestionAnswer={selectedFileQuestionAnswer} setSelectedFileQuestionAnswer={setSelectedFileQuestionAnswer}
        // uploadAnswerIndex={uploadAnswerIndex} setUploadAnswerIndex={setUploadAnswerIndex}
        // questionAns={questionAns} setQuestionAns={setQuestionAns} 
        questionBase={questionBase} setQuestionBase={setQuestionBase} />

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
                  <Stack direction="row" alignItems="center">
                    <QuestionTypeIcon typeId={5} />
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
          //           <QuestionTypeIcon typeId={5} />
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

        <QuestionTypeBaseComp questionBase={questionBase} setQuestionBase={setQuestionBase} isEdit={isEdit} questionTheme={questionTheme}
          uploadMediaModalSelect={uploadMediaModalSelect} setUploadMediaModalSelect={setUploadMediaModalSelect}
          selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
        />

        {isEdit ? (
          <StyledContentBox>
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
              {/* <IconButton
              onClick={() => {
                setCollapseConf(!collapseConf);
              }}
            >
              <KeyboardArrowDownIcon
                sx={{ transform: collapseConf ? "rotate(180deg)" : "" }}
              />
            </IconButton> */}
            </Stack>
            <StyledEditOptionsBox
            // sx={{ display: collapseConf ? "none" : "" }}
            >
              <StyledGridContainer container spacing={1}>
                <Grid item xs={3}>
                  <MDInput
                    label="Decimal"
                    className="configuration-box-input .MuiInputBase-input"
                    size="small"
                    fullWidth
                    type="number"
                    inputProps={{
                      min: 0,
                    }}
                    value={(questionBaseCategory?.precision_value && questionBaseCategory?.precision_value.toString()) || ''}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.precision_value = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MDInput
                    label="Width"
                    className="configuration-box-input .MuiInputBase-input"
                    size="small"
                    fullWidth
                    type="number"
                    inputProps={{
                      min: 0,
                    }}
                    value={(questionBaseCategory?.columns && questionBaseCategory?.columns.toString()) || ''}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.columns = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MDInput
                    label="Prefix"
                    className="configuration-box-input .MuiInputBase-input"
                    size="small"
                    fullWidth
                    value={questionBaseCategory?.input_prefix}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.input_prefix = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MDInput
                    label="Suffix"
                    className="configuration-box-input .MuiInputBase-input"
                    size="small"
                    fullWidth
                    value={questionBaseCategory?.input_suffix}
                    onChange={(e) => {
                      let payload: any = { ...questionBaseCategory }
                      payload.input_suffix = e.target.value
                      setQuestionBaseCategory(payload)
                    }}
                  />
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
              </StyledGridContainer>
            </StyledEditOptionsBox>
            <StyledLabel
              style={{
                fontSize: '0.8rem',
                paddingTop: '0px',
                paddingLeft: '0.8rem',
                marginBottom: '0rem',
              }}
            >
              Settings
            </StyledLabel>

            <StyledEditOptionsBox style={{ paddingLeft: '1rem' }}>
              <StyledGridContainer container spacing={2} xs={12} className="configuration-box-sub-cont" style={{ marginBottom: '0rem' }}>
                <Grid xs={6}>
                  <QuestionBaseCategory setQuestionBaseCategory={setQuestionBaseCategory} questionBaseCategory={questionBaseCategory} />
                </Grid>
              </StyledGridContainer>
            </StyledEditOptionsBox>
            {/* <StyledQuestionBaseDivider
            isEdit={isEdit}
            sx={{
              backgroundColor: `${theme.palette.primary.dark}`,
              height: "2px",
            }}
          /> */}
          </StyledContentBox>
        ) : (
          ''
        )}
        {!isEdit && (
          <StyledContentBox className="answer-add-container-view-mode">
            <StyledCardAnswerText className="form-control-answer-div">
              <span
                className="open-ended-prefix-suffix-text"
                style={{
                  fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                }}
              >
                {questionBaseCategory?.input_prefix}
              </span>
              <MDInput variant="standard" size="small" type="number" placeholder="number" className="opn-ended-input" />
              <span
                className="open-ended-prefix-suffix-text"
                style={{
                  fontSize: '20px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                }}
              >
                {questionBaseCategory?.input_suffix}
              </span>
            </StyledCardAnswerText>
          </StyledContentBox>
        )}

        {isEdit ? <QuestionNotesComponent questionBase={questionBase} setQuestionBase={setQuestionBase} isEdit={isEdit} /> : ''}

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
    </>
  )
}

export default OpenEndedNumeric
